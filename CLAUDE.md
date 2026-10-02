# Kunwar · Brand Partnership Portfolio Site

**Creator:** Kunwar Deep, Instagram handle `@the_ecomjet`, email `kunwar@thecomjet.com`
**Purpose:** Static brand pitch site sent to prospective sponsors. Pure HTML/CSS/JS, no build step.

> **Detailed docs live in `docs/`. Read the relevant one only when your task touches that area** (keeps this file lean). Index at the bottom.

## Writing rules
- **Do not use em dashes (`—`) in any copy.** Use commas, periods, or rephrase.
- Tone is natural, helpful, plain spoken. Not boastful.
- Design is locked. Do not alter the visual system without an explicit ask.

## Pages

**Public** (in nav/footer, indexed, listed in `sitemap.xml`):

| File | Purpose |
|---|---|
| `index.html` | Home / portfolio |
| `case-studies.html` | Index page listing all case studies |
| `case-study-{lindy,heygen,particl,emergent,ltx}.html` | 5 per-brand case studies, all fully populated with real data |
| `insights.html` | Audience & analytics (346K followers, real audience data) |

**Private** (`noindex`, linked from nowhere, in `robots.txt`, NOT in `sitemap.xml`):

| File | Purpose |
|---|---|
| `private.html` | **The index of every private page.** Live at `/private`. Start here when you need to know what is unlisted. Add a row to it whenever you make a new private page. |
| `invoice.html` | Invoice generator (line items carry an optional **live post link**, and a **deposit already received** is deducted after tax so the invoice closes on Balance due), plus a private **Register** view: due dates, follow-ups, period views by invoice date (month / year / FY) and a CSV export for the CA. Sends nothing to brands. See docs/invoice-tool.md. |
| `agreement.html` | Brand collaboration agreement generator at `/agreement`. Multi-page A4 contract PDF, plus **shareable links**. See docs/agreement-tool.md. |
| `sign.html` | The brand's view of a shared agreement, served at `/s/<token>`. They fill their fields and **sign** here. **Deliberately NOT in `robots.txt`** (a `Disallow: /s/` would advertise the path); privacy comes from the `noindex` meta tag + the `X-Robots-Tag` header in `vercel.json`. |
| `rates.html` | Rate card at `/rates`, sent for cold/early pricing questions. Carries the site nav + footer (outbound links only, which does not make it discoverable). Warm inquiries get a full proposal instead. See docs/proposals.md. |
| `proposal-{brand}-print.html` | Per-brand pitch pages (landscape PDF). Built from `proposal-template-print.html`. Usually exported to PDF and emailed, **not deployed**. See docs/proposals.md. |
| `/outreach` | **Not a file here.** `vercel.json` proxies `/outreach/*` to the outreach dashboard on Modal (`Outreach - Hong Kong/app`, app `outreach-hq`). Password protected by the dashboard itself. `/outreach` redirects to `/outreach/` because the dashboard uses relative asset paths. To change the dashboard, deploy the Modal app, not this site. |
| `media-kit.html` | Source for the downloadable `media-kit.pdf`. 6-page Letter layout. The "Get the media kit" buttons link to the **PDF**, never to this page. To update the kit: edit here, then re-print (see below). A second PDF, `media-kit-region.pdf`, adds an audience Region block: print it from `media-kit.html?region=1`. It is linked from nowhere (sent directly), with a `noindex` header in `vercel.json`. Re-print **both** whenever the kit changes. |

**Re-printing `media-kit.pdf`** (no Chrome in /Applications; use the puppeteer-cached Chrome):
```sh
python3 -m http.server 8899          # serve root, so fonts + images load
~/.cache/puppeteer/chrome-headless-shell/*/chrome-headless-shell-mac-arm64/chrome-headless-shell \
  --no-sandbox --disable-gpu --hide-scrollbars --force-color-profile=srgb \
  --user-data-dir=/tmp/cdp-mk --no-pdf-header-footer --virtual-time-budget=15000 \
  --print-to-pdf=media-kit.pdf http://localhost:8899/media-kit.html
```
`@page { size: Letter; margin: 0 }` in the file drives page size, so pass no paper flags. The full-Chrome `--headless=new` + CDP `Page.printToPDF` route hangs on this page; the headless-shell binary above works.

**Making a page private:** all four, in order of what actually matters:
1. `<meta name="robots" content="noindex, nofollow" />` in the head, under the viewport tag. **This is the one that works** (it stops listing even if a crawler reaches the page another way).
2. A `Disallow:` line in `robots.txt` for both the clean path and the `.html` one.
3. Keep it out of `sitemap.xml`.
4. Add a card to `private.html` so the index stays complete.

**Auditing:** `grep -L 'name="robots"' *.html` lists pages with no noindex tag. Search `site:theecomjet.com` to see what Google actually has. If a private page is already indexed, `robots.txt` will not remove it (blocking the crawl prevents Google from seeing the noindex); use Search Console removal.

**Current status:** all pages complete and live on https://theecomjet.com. 5 case studies live (Lindy, HeyGen, Particl, Emergent, LTX Studio). Invoice, rates and agreement tools live.

The invoice tool has a second **Register** view (private, screen-only): the book behind the documents. It sends nothing to brands. Code identifiers still say `timeline`; only the label is "Register". One 1400px sheet with the invoice's spine and bands, split into a **ruled margin** (outstanding per currency, three facts, and the `BILLED BY MONTH` spine) and the **account** (fixed columns, sticky head, a double-ruled closing block). Two lenses on the same rows: *All time* groups by urgency, and picking a month / year / **FY** in the margin turns the ledger into that period's page, ordered by issue, with the period's business numbers at the foot (**Billed / IGST held / Revenue / Collected / Outstanding**, how revenue moved on the period before, and one combined **Total revenue in INR** at a hand-set rate that is always printed beside it) and an `Export CSV` for the CA. **Periods are always cut by invoice date, never due date.** Money is always tabular sans, never the serif italic; the two currencies are two accounts and are never summed or converted, with exactly one exception: the foot's combined `Total revenue` in INR, which converts at a hand-set rate that is always printed beside it. An advance moves only what is *outstanding*: billed stays billed, `Outstanding` is the sum of balances, and a part-paid row prints the balance under its billed figure. See docs/invoice-tool.md.

**Shareable agreement links with in-browser signing are live** (Neon database `neon-bisque-queen`, `SHARE_SECRET` set). Share `/s/<token>` → the brand reads and signs in the browser → countersign from the studio → both parties download the executed PDF. No emailed attachments. See `docs/agreement-tool.md`.

## Assets

```
photos/   Kunwar.jpg avatar, signature.png, upi-qr.png, campaign photos
logos/    brand logos (SVG + PNG)
reels/    per-reel cover JPGs: lindy-1..4, heygen-1..2, particl-1..5, emergent-1..6, ltx-1..5
```

## Contacts / constants (used across the site)
- Email everywhere: `kunwar@thecomjet.com`
- LinkedIn: `https://www.linkedin.com/in/kunwar-deep-583626234/`

## Workflow quick reference
- **No build step** for pages. Open HTML directly, or run a dev server: `python3 -m http.server 3000` from project root → http://localhost:3000
- **Exception: `/api`.** The shareable agreement links are serverless functions with one npm dependency and two env vars (`DATABASE_URL`, `SHARE_SECRET`). They need `npx vercel dev`, not the Python server. Everything else, including the agreement form and its PDF, works without them. See docs/deployment.md.
- Test mobile on a real phone via `http://<mac-ip>:3000` (same Wi-Fi). Get IP: `ipconfig getifaddr en0`.
- **CSS cache busting:** editing `styles.css`, `case-study.css` or `agreement-doc.css` requires bumping its `?v=N` query across all pages that link it (mobile Safari caches hard). `agreement-doc.css` is linked by **both** `agreement.html` and `sign.html`, and is print-critical. Details in docs/design-system.md.

## ⚠️ Deploying — READ docs/deployment.md FIRST
Deploying is **not** as simple as `git push`. Two critical facts:
1. **GitHub→Vercel auto-deploy is currently INACTIVE** — a push does not deploy. You must deploy manually.
2. **Deploy ONLY from committed history via the SAFE DEPLOY RUNBOOK** (clone to a temp dir, deploy from the clone). The local working tree has at times held accidental deletions of live images; a naive `vercel --prod` from the project root would push those deletions live. The runbook prevents this.

Recover any accidentally-deleted file: `git checkout HEAD -- <path>`. Check for pending deletions: `git status --short | grep "^ D"`.

Full procedure + URL notes (site serves `.html` paths, no clean URLs) are in **docs/deployment.md**.

---

## Detailed docs index (load on demand)

| Task touches… | Read |
|---|---|
| CSS, palette, type, shadows, the `app.js` TWEAK_DEFAULTS dependency, mobile padding gotcha | `docs/design-system.md` |
| Case study pages, the index grid, per-brand assignments, adding a new brand | `docs/case-studies.md` |
| Shared nav / footer / closing CTA markup, what `app.js` does | `docs/components.md` |
| **Deploying** (safe runbook, URL rules, auto-deploy status) | `docs/deployment.md` |
| The invoice generator (`invoice.html`) | `docs/invoice-tool.md` |
| **The agreement generator** (`agreement.html`), clause set, dispute-clause reasoning, print CSS | `docs/agreement-tool.md` |
| **Agreement design language + product direction** (visual system, identity hierarchy, the planned shareable/e-sign version, integrity boundary) | `docs/agreement-design-language.md` |
| **Brand proposals** (per-brand pitch pages, pricing ladder, PDF export, design tokens) | `docs/proposals.md` |
| **The rate card** (`rates.html`) and when to send it instead of a proposal | `docs/proposals.md` |
