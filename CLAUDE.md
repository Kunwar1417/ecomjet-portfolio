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
| `case-studies.html` | Index page listing all case studies | Done, 3 cards live |
| `case-study-lindy.html` | Lindy AI case study | Fully populated with real data |
| `case-study-heygen.html` | HeyGen case study | Fully populated with real data |
| `case-study-particl.html` | Particl AI case study | Fully populated with real data |
| `insights.html` | Audience & analytics | Fully populated with real audience data |

## Assets

```
photos/   Kunwar.jpg avatar, campaign photos
logos/    43 brand logos (SVG + PNG)
reels/    per-reel cover JPGs: lindy-1..4, heygen-1..2, particl-1..5
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

Shared CSS lives in `case-study.css`. Each page imports both stylesheets:
```html
<link rel="stylesheet" href="styles.css" />
<link rel="stylesheet" href="case-study.css?v=4" />
```
Bump the `?v=` query when CSS changes to bust browser cache.

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

When a brand appears in another case study's "Keep looking" cards, the same accent applies, with the logo rendered white via `filter: brightness(0) invert(1)`.

---

## JavaScript (`app.js`)

- Intersection Observer for `.reveal` scroll animations
- Logo marquee infinite scroll
- Smooth scroll on nav links
- Hero reel-stack hover tilt
- Sticker slot rotation
- Reads `TWEAK_DEFAULTS` to set `--orange`, italic font, etc.

Each case study has its own inline slider script (defines `BRAND_REELS` array, wires up prev/next, updates DOM on click). The script lives just above `<script src="app.js"></script>`.

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
- Design is locked. Do not alter the visual system without explicit ask.
- Bump `case-study.css?v=N` when changing shared CSS to force browser cache refresh.

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

**Case studies (`case-studies.html` + 3 per-brand pages):**
- All 3 brand pages fully populated with real campaign data
- The brief, approach, content slider, results grid, and reflection are all data-backed copy (no placeholders)
- Reel slider per case study driven by `BRAND_REELS` JS array with cover, concept, icp, views, eng, ig, report fields
- Results grid: Partnerships, Total views, Links sent, Link CTR, Avg engagement, Best reel

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

## External references

- Per-reel performance reports live in Notion, linked from each reel's `report` field in the `BRAND_REELS` array on each case study page. Source of truth for view/eng numbers shown in the case studies.
- Instagram Insights is the source for view + engagement figures shown on case studies and `insights.html`.
- ManyChat handles all tracked link clicks shown in the "Links sent" + "Link CTR" tiles on case studies.
