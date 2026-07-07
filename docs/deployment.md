# Deployment

Hosted on Vercel as a static site. No build command, output is the repo root.

- Live URL: **https://theecomjet.com** (custom domain mapped to Vercel)
- Vercel project: `ecomjet-portfolio` (org `team_iHgUTat3rFQmaRNoUmn5XsSL`, project id in `.vercel/project.json`, gitignored)
- GitHub remote: `https://github.com/Kunwar1417/ecomjet-portfolio.git` (branch `main`)
- Preview deploy: `npx vercel --yes` (no flag)
- Direct `.vercel.app` URLs are protected by Vercel Deployment Protection (401 without login). The custom domain bypasses this and serves publicly.

## URLs are `.html` — this project does NOT strip extensions
This Vercel project serves files at their literal path **with `.html`**. There is no clean-URL rewrite: `/insights` and `/case-studies` 404; only `/insights.html`, `/case-studies.html`, and **`/invoice.html`** work. If clean URLs are ever wanted, add a `vercel.json` with `"cleanUrls": true` (currently absent).

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

The repo `.gitignore` ignores `.vercel` and `**/.DS_Store` (macOS junk). Do not commit `.DS_Store` files.
