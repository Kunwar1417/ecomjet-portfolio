# Brand proposals (SCQA landscape system)

> **Not every inquiry gets a proposal.** For cold or early "what do you charge?" emails, send the rate card at `/rates` (`rates.html`) instead. It carries the standard ladder with scope attached, so a bare number never goes out alone. Build a full per-brand proposal only once the brand has described the campaign. See "The rate card" at the bottom of this file.

Private, per-brand pitch pages sent to one prospective brand (as a PDF attachment, occasionally a link). **Not linked from nav or footer** (same privacy model as `invoice.html`), so they never clutter the public portfolio.

## The current system: `proposal-template-print.html`

**This is the go-forward format.** A self-contained **landscape** (11in × 8.5in Letter) print document, 10 fixed pages, built on the SCQA framework (Situation, Challenge, Question/Target, Answer). Reuses the site's design language (Bricolage + Instrument Serif, cream/ink/orange, 1.5px ink borders, hard offset shadows) but all CSS is inlined so page geometry is print-tuned. Screen shows a print helper bar (hidden in print).

First brand built with it: **Cursor** (`proposal-cursor-print.html`) — the finished reference example. Look at it to see "what good looks like."

> The older **portrait AiSensy** proposal has been **deleted** (recoverable from git history if ever needed). It is not part of this system; do not use it as a base.

### How to make a new proposal
1. **Copy the template:** `cp proposal-template-print.html proposal-{brand}-print.html`
2. **Replace every `{{PLACEHOLDER}}`.** The header comment in the file lists all of them + the page map. Nothing else changes.
3. **Add the brand logo** to `logos/{brand}.webp` (or .svg/.png) and point `{{BRAND_LOGO}}` at it. The cover puts it in a **white pill** (brand marks are usually dark-on-light and clash on the dark/orange chip).
4. **Redraw the 4 storyboard SVG icons** on the Video 1 page to match the new concept (the template ships the squat-alarm example).
5. **Generate the PDF:** serve locally (`python3 -m http.server 3000`), open `/proposal-{brand}-print.html`, click the print bar button → **Save as PDF → Layout: Landscape → enable "Background graphics" → Letter.**

### DESIGN IS LOCKED
Do **not** change layout, CSS, page count, component structure, fonts, or colors. **Only the copy inside the marked slots changes per brand.** If a design change is ever needed, make it deliberately and replicate it back into the template so all future proposals stay consistent.

## Page map (10 landscape pages)
| # | Page | Role | Notes |
|---|---|---|---|
| 01 | Cover | lockup + thesis | Kunwar × {Brand} pill, cover title (one `<em>`), lede, meta row |
| 02 | Situation | **S** | Name the **category/industry**, not the brand (don't call out their content as flawed) |
| 03 | Challenge | **C** | The problem the situation creates. Brand may be named as the thing that *could help*, never the flaw |
| 04 | Target | **Q → persona** | **Full dark page**, the pivot. States who we're targeting plainly (not a rhetorical question) |
| 05 | The plan | **A (shape)** | State the series shape plainly (e.g. "3 videos, one a month"). **No fake boxes** for undecided videos |
| 06 | Video 1 | the concept | Two-col: "Concept for Video 1" heading + concept + compact storyboard filmstrip. The **build** is the payoff, tool is the star |
| 07 | Why this works | proof of fit | 4 reasons in **brand-benefit** terms, rule-separated columns (no boxes) |
| 08 | Audience | proof | Kunwar's audience stats (brand-independent). Compact, boxes size to content |
| 09 | Brands | proof | The real brand wall (see list below). Only brands actually partnered with |
| 10 | Options + process | pricing + close | 3 packages + connected-timeline process. Prices in **USD** |

## Copy discipline (learned the hard way, follow these)
- **Headings are plain and factual.** Never dramatic, never "do X, not Y" constructions ("Show it, don't explain it" was rejected). A heading should read like a person stating a fact.
- **Simple wording** a non-technical brand manager gets on first read. No jargon, no wooing.
- **Heading + one description line** per section. No small dramatic sub-eyebrows ("The Question Worth Answering").
- **Situation names the category, not the brand.** Keeps the brand on the solving side of the problem.
- **Don't invent detail you don't have.** If videos 2 and 3 aren't decided, say "3-video series" plainly; don't fill boxes with vague filler.
- **No em dashes anywhere**, including CSS comments. (Global site rule.)

## Design discipline: the offset-shadow box = emphasis only
The hard offset-shadow box is the **emphasis** device. Reserve it for **things the brand chooses between or the hero**: the package cards, the Video 1 concept card, the dark pages. **Supporting content stays flat / rule-separated** (the process = connected timeline, the "why this works" reasons = rule-separated columns). When everything is a box, nothing is emphasized.

## The 3 packages (pricing lives on page 10)
- **The Series** *(recommended, dark feature card)*: 3 videos (1/month) + 3 story sets + bio link for the full partnership + 30-day paid usage rights per video.
- **UGC**: 3 videos for the brand's own channels/ads + full rights, not posted to Kunwar's page.
- **Single** *(quiet, de-emphasized)*: 1 video + 1 story set + bio link. The "brand will ask if they want it" option.
- Prices in **USD** (`{{PRICE_SERIES/UGC/SINGLE}}`). Series is priced so it's the obvious value; Single is priced high per-video so the Series wins.

## The real brand wall (page 09) — use ONLY brands actually partnered with
Pulled from the live site (media kit + case studies). Do **not** add recognizable names Kunwar hasn't worked with (a brand manager may spot a false claim):
`ChatGPT · Replit · Lindy AI · HeyGen · Emergent · Particl AI · Gamma · Luma AI · Intercom · Supernormal · Wispr Flow · AdCreative AI · GoHighLevel · InVideo AI · Meshy · LTX Studio · Creatify · Omnisend · Kittl · Higgsfield · Alibaba`

## Design tokens (for rebuilding elsewhere, e.g. Canva)
- **Fonts:** Bricolage Grotesque (sans, 400–800) everywhere; Instrument Serif (italic) for orange `<em>` accents and the `$` price prefix.
- **Colors:** bg cream `#f6f2ea`; cream-2 `#efe9dc`; paper `#fdfbf6`; ink `#1c1a17`; ink-2 `#46433d`; ink-3 `#6f6a61`; rule `#ddd6c8`; primary accent **orange #E55525**; accents green #2F6B4F, blue #2B49C4, plum #6E2A4E, butter #F2E27A; dark `#17140f`, dark-text `#f4f0e8`.
- **Signature look:** hard offset drop shadows (6px 6px 0 / 4px 4px 0 solid ink), 1.5px solid ink borders, rounded corners (12/16/18px, pill 999px), orange sparkle SVG stickers.
- **Print:** `@page { size: Letter landscape; margin: 0 }`; `.page { page-break-after: always }`; `print-color-adjust: exact` keeps bands/shadows.

## The rate card (`rates.html`, served at `/rates`)

Private page for cold and early pricing inquiries, sent as a link into a conversation that is usually already underway on email or WhatsApp. **It is not a proposal and must not become one.** No pitch, no case studies, no argument for the value. Prices with scope attached, and that is it.

**Privacy:** two independent defenses, both required. `<meta name="robots" content="noindex, nofollow">` on line 6, and no inbound link from any page (nav, footer or body). Also covered by `robots.txt` + excluded from `sitemap.xml`. The page does carry the site nav and footer, so a brand can click through to the case studies; that is outbound only and does not make it discoverable.

**Contents:** header, two rate cards (Series $10,500 feature / Single $4,000 quiet), add-ons as flat rows, 4-step process timeline, dark logo wall, one quiet closing line. UGC lives in add-ons rather than as a third card, so brands do not anchor on the cheaper number.

**Prices are exact, no "starts at" prefix.** The add-ons section already communicates that the number can move. Saying it twice makes both feel soft.

**Add-on prices are `On request` placeholders** pending real figures. Replace `.addon__price.is-tbd` values and drop the `is-tbd` class when set.

**Hierarchy rule, same as the proposals:** only the rate cards get the offset-shadow box. Add-ons and the process stay flat and rule-separated. Boxing them would flatten the hierarchy and dilute the prices.

**Logo wall is a dark band on purpose.** 8 of the 11 logos are pre-rendered white-on-transparent PNGs (`PRE_WHITE` in `app.js:22-27`); on a light background they are invisible and no filter fixes an already-white image. Those get `class="is-prewhite"` (`filter: none`); normal SVGs get `brightness(0) invert(1)`. Static grid, not the home page marquee, because 11 logos fit on screen and should be readable.

**Keep in sync with the proposals:** the $10,500 / $4,000 ladder appears in both. Change one, change the other.

## Deploying a proposal
Same **SAFE DEPLOY RUNBOOK** as everything else (`docs/deployment.md`). Proposals are usually **sent as a PDF attachment**, not deployed publicly, they work fine served locally for PDF generation without ever going live. If deploying, `<meta name="robots" content="noindex, nofollow">` is already set so they aren't indexed.
