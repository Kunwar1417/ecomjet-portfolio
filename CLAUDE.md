# Kunwar · Brand Partnership Portfolio Site

**Creator:** Kunwar Deep, Instagram handle `@the_ecomjet`, email `kunwar@thecomjet.com`
**Purpose:** Static brand pitch site sent to prospective sponsors.

## Writing rules
- Do not use em dashes (`—`) in any copy. Use commas, periods, or rephrase.
- Tone is natural, helpful, plain spoken. Not boastful.

---

## Pages

| File | Purpose | Status |
|---|---|---|
| `index.html` | Home / portfolio | Design complete, content polished |
| `case-studies.html` | Index page listing all case studies | Done, 5 cards live |
| `case-study-lindy.html` | Lindy AI case study | Fully populated with real data |
| `case-study-heygen.html` | HeyGen case study | Fully populated with real data |
| `case-study-particl.html` | Particl AI case study | Fully populated with real data |
| `case-study-emergent.html` | Emergent case study | Fully populated with real data |
| `case-study-ltx.html` | LTX Studio case study | Fully populated with real data |
| `insights.html` | Audience & analytics | Fully populated with real audience data |
| `invoice.html` | Private invoice generator (served at `/invoice`) | Live, self-contained |

## Assets

```
photos/   Kunwar.jpg avatar, campaign photos
logos/    brand logos (SVG + PNG)
reels/    per-reel cover JPGs: lindy-1..4, heygen-1..2, particl-1..5, emergent-1..6, ltx-1..5
```

---

## Design system (`styles.css` + `case-study.css`)

**Palette (oklch + hex accents)**
- `--cream` / `--cream-2` / `--paper`: warm off-white backgrounds
- `--ink` / `--ink-2` / `--ink-3`: near-black text hierarchy
- `--orange #E55525`: primary accent (CTAs, highlights)
- `--green #2F6B4F` · `--blue #2B49C4` · `--pink #B0345A` · `--plum #6E2A4E` · `--butter #F2E27A`: category accents
- `--dark` / `--dark-2` / `--dark-text` / `--dark-text-2`: dark sections

**Typography**
- `--sans`: Bricolage Grotesque (400 to 800, opsz 12 to 96)
- `--italic`: Instrument Serif, used for em + orange decorative text

**Shadows** (retro offset print style)
- `--shadow-card: 6px 6px 0 0 var(--ink)`
- `--shadow-card-sm: 4px 4px 0 0 var(--ink)`

**Radii** `--r-sm 10` · `--r-md 18` · `--r-lg 28` · `--r-pill 999`
**Layout** `.wrap` max 1320px, 32px side padding. Breakpoints at 860 and 760.

**Critical app.js dependency**
Every page using `app.js` MUST include this script block BEFORE `<script src="app.js"></script>`:
```html
<script>
const TWEAK_DEFAULTS = { "accent": "#E55525", "italic": "Instrument Serif", "stickers": "on", "bg": "warm" };
</script>
```
Without it, `app.js` writes `undefined` into the `--orange` variable and the page loses its accent color.

---

## Case study template (`case-study-{brand}.html`)

Shared CSS lives in `case-study.css`. Each page imports both stylesheets (both carry version queries):
```html
<link rel="stylesheet" href="styles.css?v=2" />
<link rel="stylesheet" href="case-study.css?v=7" />
```
Bump the `?v=` query (on whichever file changed, across ALL pages) when CSS changes to bust browser cache. Mobile Safari will otherwise serve stale CSS.

**Section order (top to bottom)**
1. Nav (shared markup, "Case Studies" active state)
2. Back link to `case-studies.html`
3. Header: tags, brand H1, lede quote, meta card (Brand / Category / Format / Partnerships / Audience fit)
4. The brief (`.cs-row`, 1:2 grid)
5. The approach (`.cs-row`)
6. The content (`.cs-row` with `.cs-reel-slider` in the right column)
7. The results (`.cs-row` with 6 tile `.cs-stats` grid)
8. The reflection (`.cs-row`)
9. "Keep looking" section (`.more`, 2 brand cards linking to the other case studies)
10. Closing CTA (`.section--cta-closing`, dark, rocket sticker, media kit button)
11. Footer (shared markup)
12. `TWEAK_DEFAULTS` script + `app.js`

**The content section: reel slider**
Single visible card with prev/next nav. Per-reel data is in a JS array (`const BRAND_REELS`), and the slider script reads `[data-slide-*]` hooks.

```js
const BRAND_REELS = [
  { cover, concept, icp, views, eng, ig, report },
  ...
];
```
Each reel object provides:
- `cover`: path to thumbnail in `reels/`
- `concept`: 1 sentence describing the reel's strategic angle
- `icp`: who the reel targets (short label)
- `views`, `eng`: per-reel stats
- `ig`: Instagram reel URL (use `/reel/` singular, NOT `/reels/` plural, which forces login)
- `report`: Notion performance report URL

**The results section: 6 tile grid**
Fixed labels in this order:
1. Partnerships
2. Total views
3. Links sent (tracked via ManyChat)
4. Link CTR
5. Avg engagement
6. Best reel

Caption under the grid: `"Link clicks tracked via ManyChat. View and engagement figures pulled from Instagram Insights."` Adjust if not all reels had link tracking.

**Two buttons per reel**
- Watch on IG (`btn btn--ghost cs-reel-action-btn`) opens the reel
- Performance report (same classes) opens Notion campaign report

---

## case-studies.html (index page)

Hero with kicker `The work` + H1 `Case studies.` + 1 line lede. Then a 3 column grid (`.cs-index__grid`) of `.more-card` items with an extra `.more-card__stats` strip showing Total views, Avg eng, Partnerships per brand. Each card links to its full case study page.

Grid drops to 2 columns at 1000px, 1 column at 680px.

---

## Per-brand assignments

| Brand | Accent for logo band | Reel covers | IG handle in case |
|---|---|---|---|
| Lindy AI | `--plum` | `reels/lindy-1..4.jpg` | https://www.instagram.com/reel/{id}/ |
| HeyGen | `--green` | `reels/heygen-1..2.jpg` | same |
| Particl AI | `--blue` | `reels/particl-1..5.jpg` | same |
| Emergent | `--orange` | `reels/emergent-1..6.jpg` | same |
| LTX Studio | `--pink` | `reels/ltx-1..5.jpg` | same |

**Logo notes for new brands:**
- Emergent: `logos/emergent.svg`, rendered white via `filter: brightness(0) invert(1)`
- LTX Studio: use `logos/LTXstudio.png` (full "Ltx Studio" lockup, transparent bg, RGBA) with `filter: brightness(0) invert(1); max-width: 160px`. Do NOT use `logos/ltx-studio.svg` (it is the "Ltx" wordmark only, missing "Studio").

**Reels without Notion reports:** the slider script hides the "Performance report" button per-reel when `report === '#'`. Set `report: '#'` for reels that have no Notion link (Emergent reels 4-6, LTX reels 3-5). This logic lives in the inline slider `update()` function via `reportLink.style.display = r.report === '#' ? 'none' : ''`.

When a brand appears in another case study's "Keep looking" cards, the same accent applies, with the logo rendered white via `filter: brightness(0) invert(1)`.

---

## JavaScript (`app.js`)

- Intersection Observer for `.reveal` scroll animations
- Logo marquee infinite scroll
- Smooth scroll on nav links
- Hero reel-stack hover tilt
- Sticker slot rotation
- Reads `TWEAK_DEFAULTS` to set `--orange`, italic font, etc.
- **Mobile nav toggle**: wires up `.nav__hamburger` to toggle `.nav--open` on `.nav`, which reveals the `.nav__mobile` drawer. Tapping any drawer link closes it.

Each case study has its own inline slider script (defines `BRAND_REELS` array, wires up prev/next, updates DOM on click). The script lives just above `<script src="app.js"></script>`.

### Mobile navigation (shared markup on every page)

The nav has two parts: the always-visible `.nav__inner` bar and a `.nav__mobile` drawer that is a **sibling** of `.nav__inner` inside `<nav class="nav">` (NOT a child of `.nav__inner`, or it breaks the flex layout). Structure:

```html
<nav class="nav">
  <div class="nav__inner">
    ...logo, .nav__links (desktop), .nav__hamburger, .nav__cta-group...
  </div>
  <div class="nav__mobile">
    ...Home / Work / Case Studies / Insights / About / media kit btn...
  </div>
</nav>
```

At `≤860px`: `.nav__links` hides, `.nav__hamburger` + drawer take over, and `.nav__cta` (media kit button in the bar) hides to declutter. At `≤400px` the IG icon also hides. The hamburger animates into an X via `aria-expanded="true"`.

---

## Closing CTA + Footer (shared markup)

Use `.section--cta-closing` for the dark closing block. Contains the rocket sticker SVG, h2 with `worth watching` italic, lede, and a `.cta-block` with the orange media kit button + email fallback.

Footer uses `.footer` with 4 columns: logo+blurb, Pages, Reach me, The kit. Always link "Recent work" to `case-studies.html`.

Email everywhere: `kunwar@thecomjet.com`
LinkedIn: `https://www.linkedin.com/in/kunwar-deep-583626234/`

---

## Adding a new case study

1. Copy `case-study-lindy.html` as `case-study-{newbrand}.html`
2. Update `<title>`, header tags + H1 + lede + meta dl
3. Edit "The brief" and "The approach" paragraphs
4. Replace the `BRAND_REELS` JS array with new reels (cover, concept, icp, views, eng, ig, report)
5. Update the 6 results tiles + caption
6. Update the reflection paragraphs
7. Swap the two "Keep looking" cards to point to the other current brands (with correct accent vars)
8. Drop new reel covers in `reels/` as `{brand}-1.jpg`, `{brand}-2.jpg`, etc.
9. Add a new card to `case-studies.html` grid with the brand's accent, logo, tags, summary, stat strip

If a brand needs a new logo file, drop SVG into `logos/`. The white filter is applied via CSS, so the source SVG can be any color.

---

## Workflow notes

- No build step. Pure HTML/CSS/JS, opens directly in browser.
- Dev server: `python3 -m http.server 3000` from project root, visit http://localhost:3000
- Test mobile on a real phone via `http://<mac-ip>:3000` (same Wi-Fi). Get IP with `ipconfig getifaddr en0`.
- Design is locked. Do not alter the visual system without explicit ask.
- **Cache busting:** mobile Safari caches CSS aggressively. Both `styles.css?v=N` and `case-study.css?v=N` carry version queries. Bump the `?v=N` on the relevant stylesheet link **across all pages** whenever you edit that CSS file, or changes won't show on devices that already loaded the site. (`styles.css` is currently `?v=2`, `case-study.css` is `?v=7`.)

### CSS gotcha: padding shorthand zeroes out `.wrap` side padding

Several full-width sections carry both `.wrap` (which supplies horizontal padding) AND a section class. If that section class sets `padding: Xpx 0 Ypx` (shorthand), the `0` **overrides the left/right padding from `.wrap`**, pushing content to the screen bezel on mobile. Fix: use `padding-top` / `padding-bottom` only on those section classes, never the 4-value shorthand with `0` sides. This bit `.cs-header` and `.cs-index`; both now use `padding-block` style declarations. Mobile `.wrap` padding is 28px (`≤760px`) / 24px (`≤480px`); desktop is 32px.

---

## Deployment

Hosted on Vercel as a static site. No build command, output is the repo root.

- Live URL: **https://theecomjet.com** (custom domain mapped to Vercel)
- Vercel project: `ecomjet-portfolio` (org `team_iHgUTat3rFQmaRNoUmn5XsSL`, project id in `.vercel/project.json`, gitignored)
- GitHub remote: `https://github.com/Kunwar1417/ecomjet-portfolio.git` (branch `main`)
- Deploy to production: `npx vercel --prod --yes` from project root
- Preview deploy: `npx vercel --yes` (no flag)
- Git push to `main` also triggers a Vercel deploy via the GitHub integration, so committing + pushing is sufficient in most cases.
- Direct `.vercel.app` URLs are protected by Vercel Deployment Protection (401 without login). The custom domain bypasses this and serves publicly.

---

## Current state of the site (last updated post-deploy)

**Home page (`index.html`):**
- Hero with reel stack: 3 reels (Master Plan/Particl, Bubble Mask/Lindy, Rent Me/Relume) each with a small caption below showing brand + category
- Each reel is a single `<a class="reel-item">` wrapper containing the visual card + caption, all sharing the same tilt
- Featured case study cards use `Acquisition / Acquisition / Awareness` pills (not vanity metrics like view counts)
- Audience pitch: 349K founders and marketers

**Case studies (`case-studies.html` + 5 per-brand pages):**
- 5 brands live: Lindy AI, HeyGen, Particl AI, Emergent, LTX Studio. All fully populated with real campaign data.
- Emergent: AI app builder, `--orange`, 6 reels / 5 campaigns, 454K views, 1,050 links, 57% CTR, 7% eng. Persona-per-reel angle (build an app for a specific use case). Notion reports for reels 1-3 only.
- LTX Studio: AI video production (by Lightricks), `--pink`, 5 reels / 5 campaigns, 5.26M views, 41K links, 45% CTR, 9% eng. Format-per-reel angle (BMW ad, Lay's ad, superhero short, 2x YouTube-in-10-min). Notion reports for reels 1-2 only.
- The brief, approach, content slider, results grid, and reflection are all data-backed copy (no placeholders)
- Reel slider per case study driven by `BRAND_REELS` JS array with cover, concept, icp, views, eng, ig, report fields
- Results grid: Partnerships, Total views, Links sent, Link CTR, Avg engagement, Best reel
- Per-reel "Performance report" button auto-hides when `report === '#'` (reels without a Notion link)
- Mobile: hamburger nav drawer on all pages; `.wrap`/section padding fixed so headings don't touch the bezel

**Insights page (`insights.html`):**
- 349K followers as of May 23, 2026
- Clickable Instagram pill linking to @the_ecomjet
- Reach + growth: 349K · +9% in 90 days · 200K avg reel views (last 30 reels, viral outliers removed)
- Profession bars: 60% founders/operators, 20% marketers, 5% other creators, 15% other (percentages shown in plain bold sans, not italic, to fix visual rhythm)
- Region: India & SA 70% / North America & UK 18% / Other 12% (grouped to show absolute Western reach without naming individual countries)
- Age 18 to 45 (95%), gender 80/20 M/F
- Engagement quality 4-tile grid: 9.5% eng rate · 200K avg views · ~2 yrs avg partnership · 100% organic reach
- DMs & comments note: audience watches to act, not to be entertained

**Writing style notes:**
- Never use em dashes in copy
- Natural and helpful tone, not boastful
- Email everywhere: kunwar@thecomjet.com
- Header ledes follow the pattern: `[N reels] [for which audience] [what you showed] [headline stat]`

**Final deployed version:** Live on https://theecomjet.com

---

## Invoice generator (`invoice.html`, private, at `/invoice`)

Self-contained private tool to generate brand invoices as PDFs. Replaces manual Canva work. Redesigned "statement" layout (NOT a copy of the old Canva file): warm-cream ground, deep-navy ink (`#14213A`), brand blue (`#2B49C4`) spent only on the total bar / rules / labels, a slim 3mm blue left spine, header + footer panel bands. Bricolage Grotesque throughout with one Instrument Serif italic accent (on "Total *due*"). NOT linked from any nav; carries `<meta name="robots" content="noindex, nofollow">`. Sends no data anywhere.

- **Architecture:** single file, no backend, no build, no external CSS/JS deps (self-contained inline `<style>` + vanilla JS IIFE; does NOT pull `styles.css` or `app.js`). Served at `/invoice` via Vercel clean URLs (locally only `/invoice.html` works; `python3 -m http.server` does not do clean URLs).
- **Layout:** two-pane on screen (form left, live A4 preview right, scaled via a JS `fitDoc()` transform + a zoom slider). Print stylesheet (`@media print`) shows only `.inv-doc` at true A4, resets the transform, preserves colors. Export = browser "Save as PDF".
- **India vs International toggle** drives everything via `is-india`/`is-intl` app classes + `.india-only`/`.intl-only` field visibility:
  - India: rail word "Tax invoice", SAC column (default `998366`), IGST 18%, ₹ (`en-IN` grouping → ₹2,95,000), Supplier block shows `NEVER SETTLE` + `Proprietor: Kunwardeep` (one word, per legal docs) + GSTIN + PAN, billed-to shows optional brand GST + Place of supply, payments = Kotak block + UPI ID (legible text line) + `photos/upi-qr.png`.
  - International: rail word "Invoice", no SAC, Tax 0%, $ (`en-US`), Reference column hidden entirely (unless a partnership code is added), payments = US bank block (ACH + bank address), optional Stripe line via checkbox. No PayPal.
  - Table header is "Item" on both. Total bar reads "Total due" on both.
- **Numbering:** ONE shared counter, format `KD-YYYY-NNNN`, auto-rolls per year. **Self-healing / derived, not a stored counter:** the next number is always `max(saved invoice numbers for the year) + 1`, seeded at 15 for 2026 (→ first suggested `KD-2026-0016`). Exploring or misclicks never waste a number; a number is only "consumed" when you Download its PDF. Field is editable.
- **Saved-invoice archive (the "one place"):** Download PDF saves the ENTIRE invoice (type, brand, address, items, amounts, terms, date) to `localStorage` key `kd_invoices` (array, source of truth for both the archive list and the derived next-number). The "Saved invoices" list under the form is clickable: click a row → `loadForm()` reloads it fully for view/edit/re-download; each row has a delete (×). Re-downloading an existing number updates it in place. `localStorage` is per-browser, so always generate from the same machine/browser (no cross-device sync without a backend).
- **"New invoice" button** is now safe: warns before clearing if the current invoice has content and hasn't been downloaded (saved). No blind counter advance.
- **Line items:** multiple rows (add/remove), free-text description with a `datalist` quick-pick of common deliverables, subtotal auto-sums. First line of a description is the title; extra lines become grey sub-text.
- **Payment terms:** preset `<select>` (7 days / 30 days / 100% advance) + a **50/50 split** option that reveals a milestone toggle (50% advance / final 50%) which labels the line item and writes the correct balance sentence, + a "Custom…" free-text override.
- **Partnership code** is an optional checkbox (off by default), like Stripe.
- **PDF filename** auto-set from invoice number + brand (`document.title` swapped just before `window.print()`, then restored).
- **Hardcoded constants** live in the `ME` object at the top of the inline `<script>` (registered address, GSTIN, PAN, Kotak bank details, US bank details, and the live `stripe` payment link — a "customer chooses price" Stripe Payment Link, reused for every invoice; the invoice prints an "Enter the total shown on your invoice." note beside it).
- **Two user-supplied asset PNGs** (both present, with `onerror` fallbacks): `photos/signature.png` (signature above the sign line; white background dropped via `mix-blend-mode: multiply` on the cream) and `photos/upi-qr.png` (India UPI QR).

## External references

- Per-reel performance reports live in Notion, linked from each reel's `report` field in the `BRAND_REELS` array on each case study page. Source of truth for view/eng numbers shown in the case studies.
- Instagram Insights is the source for view + engagement figures shown on case studies and `insights.html`.
- ManyChat handles all tracked link clicks shown in the "Links sent" + "Link CTR" tiles on case studies.
