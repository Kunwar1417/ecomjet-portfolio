# Design system (`styles.css` + `case-study.css`)

Design is locked. Do not alter the visual system without an explicit ask.

## Palette (oklch + hex accents)
- `--cream` / `--cream-2` / `--paper`: warm off-white backgrounds
- `--ink` / `--ink-2` / `--ink-3`: near-black text hierarchy
- `--orange #E55525`: primary accent (CTAs, highlights)
- `--green #2F6B4F` · `--blue #2B49C4` · `--pink #B0345A` · `--plum #6E2A4E` · `--butter #F2E27A`: category accents
- `--dark` / `--dark-2` / `--dark-text` / `--dark-text-2`: dark sections

## Typography
- `--sans`: Bricolage Grotesque (400 to 800, opsz 12 to 96)
- `--italic`: Instrument Serif, used for em + orange decorative text

## Shadows (retro offset print style)
- `--shadow-card: 6px 6px 0 0 var(--ink)`
- `--shadow-card-sm: 4px 4px 0 0 var(--ink)`

## Radii & layout
- Radii: `--r-sm 10` · `--r-md 18` · `--r-lg 28` · `--r-pill 999`
- Layout: `.wrap` max 1320px, 32px side padding. Breakpoints at 860 and 760.
- Mobile `.wrap` padding is 28px (`≤760px`) / 24px (`≤480px`); desktop is 32px.

## Critical app.js dependency
Every page using `app.js` MUST include this script block BEFORE `<script src="app.js"></script>`:
```html
<script>
const TWEAK_DEFAULTS = { "accent": "#E55525", "italic": "Instrument Serif", "stickers": "on", "bg": "warm" };
</script>
```
Without it, `app.js` writes `undefined` into the `--orange` variable and the page loses its accent color.

## Cache busting (mobile Safari)
Mobile Safari caches CSS aggressively. Both `styles.css?v=N` and `case-study.css?v=N` carry version queries. Bump the `?v=N` on the relevant stylesheet link **across all pages** whenever you edit that CSS file, or changes won't show on devices that already loaded the site. (`styles.css` is currently `?v=2`, `case-study.css` is `?v=7`.)

## CSS gotcha: padding shorthand zeroes out `.wrap` side padding
Several full-width sections carry both `.wrap` (which supplies horizontal padding) AND a section class. If that section class sets `padding: Xpx 0 Ypx` (shorthand), the `0` **overrides the left/right padding from `.wrap`**, pushing content to the screen bezel on mobile. Fix: use `padding-top` / `padding-bottom` only on those section classes, never the 4-value shorthand with `0` sides. This bit `.cs-header` and `.cs-index`; both now use `padding-block` style declarations.
