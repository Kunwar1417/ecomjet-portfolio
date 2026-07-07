# Kunwar · Brand Partnership Portfolio Site

**Creator:** Kunwar Deep, Instagram handle `@the_ecomjet`, email `kunwar@thecomjet.com`
**Purpose:** Static brand pitch site sent to prospective sponsors. Pure HTML/CSS/JS, no build step.

> **Detailed docs live in `docs/`. Read the relevant one only when your task touches that area** (keeps this file lean). Index at the bottom.

## Writing rules
- **Do not use em dashes (`—`) in any copy.** Use commas, periods, or rephrase.
- Tone is natural, helpful, plain spoken. Not boastful.
- Design is locked. Do not alter the visual system without an explicit ask.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home / portfolio |
| `case-studies.html` | Index page listing all case studies |
| `case-study-{lindy,heygen,particl,emergent,ltx}.html` | 5 per-brand case studies, all fully populated with real data |
| `insights.html` | Audience & analytics (349K followers, real audience data) |
| `invoice.html` | Private invoice generator, live at `/invoice.html` |

**Current status:** all pages complete and live on https://theecomjet.com. 5 case studies live (Lindy, HeyGen, Particl, Emergent, LTX Studio). Invoice tool live.

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
- **No build step.** Open HTML directly, or run a dev server: `python3 -m http.server 3000` from project root → http://localhost:3000
- Test mobile on a real phone via `http://<mac-ip>:3000` (same Wi-Fi). Get IP: `ipconfig getifaddr en0`.
- **CSS cache busting:** editing `styles.css` or `case-study.css` requires bumping its `?v=N` query across all pages (mobile Safari caches hard). Details in docs/design-system.md.

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
