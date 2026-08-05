# Deployment

Hosted on Vercel as a static site. No build command, output is the repo root.

- Live URL: **https://theecomjet.com** (custom domain mapped to Vercel)
- Vercel project: `ecomjet-portfolio` (org `team_iHgUTat3rFQmaRNoUmn5XsSL`, project id in `.vercel/project.json`, gitignored)
- GitHub remote: `https://github.com/Kunwar1417/ecomjet-portfolio.git` (branch `main`)
- Preview deploy: `npx vercel --yes` (no flag)
- Direct `.vercel.app` URLs are protected by Vercel Deployment Protection (401 without login). The custom domain bypasses this and serves publicly.

## URLs are clean (no `.html`)
`vercel.json` sets `"cleanUrls": true`, so pages serve at `/insights`, `/case-studies`, `/invoice`, `/rates`. Requesting the `.html` form returns a **308 redirect** to the extensionless path. Internal links across the site use the extensionless form; keep it that way.

## CRITICAL: the GitHub→Vercel auto-deploy is currently INACTIVE
A `git push` to `main` does **not** reliably trigger a Vercel deploy right now (the integration went stale; a push updated GitHub but produced no new deployment). **Do not assume push = deploy.** Deploy manually (see runbook below), then verify the live URL. (If the GitHub integration is later reconnected in the Vercel dashboard, pushes will auto-deploy again — and safely, because they build from committed GitHub code, not the local working tree.)

## CRITICAL: SAFE DEPLOY RUNBOOK (protects against accidental local file deletions)

Background: the local working tree has, at times, contained **accidental deletions of image files that the live site depends on** (e.g. `photos/Kunwar.jpg`, `reels/*.jpg`). A naive `vercel --prod` from the project root deploys the **current folder contents**, so any locally-deleted file would vanish from the live site. The committed git history always has the correct, intact files. **Therefore: always deploy from committed history, never from a dirty working tree.**

Safe deploy procedure (deletes nothing, ignores working-tree mess):
1. Ensure the intended state is committed on `main` (`git status` clean; at minimum, no unintended `^ D` deletions). Run `git status --short | grep "^ D"` — expect no output.
2. Clone the repo to a temp dir: `git clone <this repo path> /tmp/deploy-clean`
3. Copy the Vercel link into it: `cp -R .vercel /tmp/deploy-clean/.vercel`
4. Deploy from the clone: `cd /tmp/deploy-clean && npx vercel --prod --yes`
5. **Verify** live: `curl -s -o /dev/null -w "%{http_code}" https://theecomjet.com/invoice.html` (expect 200) and spot-check a few images (`/photos/Kunwar.jpg`, `/reels/lindy-1.jpg` → 200).
6. Delete the temp clone.

Recovering accidentally-deleted files (they are safe in git forever): `git checkout HEAD -- <path>` restores any committed file to disk. `git status | grep "^ D"` lists pending deletions to watch for.

The repo `.gitignore` ignores `.vercel`, `node_modules` and `**/.DS_Store` (macOS junk). Do not commit `.DS_Store` files.

## The site is no longer purely static

`/api` holds serverless functions backing the shareable agreement links (see `docs/agreement-tool.md`). Everything else is still plain HTML that opens from disk.

**What this changes:**

- **`package.json` exists**, with one dependency (`@neondatabase/serverless`). Vercel installs it during deploy; the safe runbook above is unchanged, since the clone includes `package.json` and Vercel runs the install itself.
- **`node_modules` is gitignored** and must never be committed.
- **Two environment variables must exist in the Vercel project** (Project → Settings → Environment Variables, all environments):
  - `SHARE_SECRET` — any long random string. Required to create share links. **The API fails closed:** if it is missing, every write is refused, which is the intended behaviour, not a bug. **Already set** for Production and Development.
  - `DATABASE_URL` — the Neon Postgres connection string. **Not yet provisioned.** See below.

### ⚠️ Remaining setup: link the database (one time, ~2 minutes)

Sharing returns `503 {"error":"Sharing is not set up yet."}` until this is done. Everything else on the site, including the agreement form and its PDF, works regardless.

It cannot be scripted: creating the database means accepting Neon's marketplace terms, which only the account owner can do in a browser.

1. Vercel dashboard → the `ecomjet-portfolio` project → **Storage** → **Create Database** → **Neon** (Postgres). The free tier is ample here; a few hundred agreements is kilobytes.
2. Accept the terms, create it, and **connect it to this project**. Vercel injects `DATABASE_URL` automatically.
3. **Redeploy** (env vars only reach functions on a new deploy): use the SAFE DEPLOY RUNBOOK above.
4. Verify: `curl -s https://theecomjet.com/api/agreements/nonexistenttoken000000` should return `404 {"error":"This link is not valid."}`. A 503 means the variable did not land; a 500 means the connection string is wrong.

The table is created automatically on first use, so there is no migration step.

**The share key.** The first time "Create share link" is clicked, the browser asks for a key. That is `SHARE_SECRET`. Read the current value with `npx vercel env pull` (writes `.env.local`, which is gitignored), or set a new one with `npx vercel env rm SHARE_SECRET production` then `vercel env add`. It is entered once per browser and kept in `localStorage` under `kd_share_key`.
- **The share features do not work over `python3 -m http.server`** or from `file://`, because there is no `/api` there. Use `npx vercel dev` to exercise them locally. Static pages, including `/agreement`'s form, preview and PDF, still work fine on the plain server.
- **The database schema is created on first use** (`CREATE TABLE IF NOT EXISTS`). There is no migration step. If the schema ever grows complicated enough that this feels risky, that is the signal to add real migrations.

**After deploying, verify the API too:** `curl -s -o /dev/null -w "%{http_code}" https://theecomjet.com/api/agreements/nonexistenttoken000000` should return **404** (reaching the function), not 500 (misconfigured database) and not 404-from-static.
