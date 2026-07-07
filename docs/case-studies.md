# Case studies

Covers the per-brand case study pages, the index page, per-brand assignments, and how to add a new one.

## Case study template (`case-study-{brand}.html`)

Shared CSS lives in `case-study.css`. Each page imports both stylesheets (both carry version queries):
```html
<link rel="stylesheet" href="styles.css?v=2" />
<link rel="stylesheet" href="case-study.css?v=7" />
```
Bump the `?v=` query (on whichever file changed, across ALL pages) when CSS changes. See docs/design-system.md for the cache-busting rule.

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
- `report`: Notion performance report URL (set to `'#'` if the reel has no Notion link — the slider hides the button)

**The results section: 6 tile grid** — fixed labels in this order:
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

## case-studies.html (index page)

Hero with kicker `The work` + H1 `Case studies.` + 1 line lede. Then a 3 column grid (`.cs-index__grid`) of `.more-card` items with an extra `.more-card__stats` strip showing Total views, Avg eng, Partnerships per brand. Each card links to its full case study page. Grid drops to 2 columns at 1000px, 1 column at 680px.

## Per-brand assignments

| Brand | Accent for logo band | Reel covers | IG handle in case |
|---|---|---|---|
| Lindy AI | `--plum` | `reels/lindy-1..4.jpg` | https://www.instagram.com/reel/{id}/ |
| HeyGen | `--green` | `reels/heygen-1..2.jpg` | same |
| Particl AI | `--blue` | `reels/particl-1..5.jpg` | same |
| Emergent | `--orange` | `reels/emergent-1..6.jpg` | same |
| LTX Studio | `--pink` | `reels/ltx-1..5.jpg` | same |

**Logo notes:**
- Emergent: `logos/emergent.svg`, rendered white via `filter: brightness(0) invert(1)`
- LTX Studio: use `logos/LTXstudio.png` (full "Ltx Studio" lockup, transparent bg, RGBA) with `filter: brightness(0) invert(1); max-width: 160px`. Do NOT use `logos/ltx-studio.svg` (it is the "Ltx" wordmark only, missing "Studio").

**Reels without Notion reports:** the slider script hides the "Performance report" button per-reel when `report === '#'`. Set `report: '#'` for reels that have no Notion link (Emergent reels 4-6, LTX reels 3-5). Logic lives in the inline slider `update()` via `reportLink.style.display = r.report === '#' ? 'none' : ''`.

When a brand appears in another case study's "Keep looking" cards, the same accent applies, with the logo rendered white via `filter: brightness(0) invert(1)`.

**Per-brand data notes:**
- Emergent: AI app builder, `--orange`, 6 reels / 5 campaigns, 454K views, 1,050 links, 57% CTR, 7% eng. Persona-per-reel angle. Notion reports for reels 1-3 only.
- LTX Studio: AI video production (by Lightricks), `--pink`, 5 reels / 5 campaigns, 5.26M views, 41K links, 45% CTR, 9% eng. Format-per-reel angle (BMW ad, Lay's ad, superhero short, 2x YouTube-in-10-min). Notion reports for reels 1-2 only.

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

## External data sources
- Per-reel performance reports live in Notion (linked from each reel's `report` field). Source of truth for view/eng numbers.
- Instagram Insights is the source for view + engagement figures.
- ManyChat handles all tracked link clicks shown in the "Links sent" + "Link CTR" tiles.
