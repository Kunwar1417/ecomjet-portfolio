# Shared components & app.js

Shared markup and behavior used across every page (nav, footer, CTA) plus what `app.js` does.

## JavaScript (`app.js`)
- Intersection Observer for `.reveal` scroll animations
- Logo marquee infinite scroll
- Smooth scroll on nav links
- Hero reel-stack hover tilt
- Sticker slot rotation
- Reads `TWEAK_DEFAULTS` to set `--orange`, italic font, etc. (see docs/design-system.md — the TWEAK_DEFAULTS block is a required dependency)
- **Mobile nav toggle**: wires up `.nav__hamburger` to toggle `.nav--open` on `.nav`, which reveals the `.nav__mobile` drawer. Tapping any drawer link closes it.

Each case study has its own inline slider script (defines `BRAND_REELS`, wires up prev/next). It lives just above `<script src="app.js"></script>`.

## Mobile navigation (shared markup on every page)

The nav has two parts: the always-visible `.nav__inner` bar and a `.nav__mobile` drawer that is a **sibling** of `.nav__inner` inside `<nav class="nav">` (NOT a child of `.nav__inner`, or it breaks the flex layout).

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

## Closing CTA + Footer (shared markup)

Use `.section--cta-closing` for the dark closing block. Contains the rocket sticker SVG, h2 with `worth watching` italic, lede, and a `.cta-block` with the orange media kit button + email fallback.

Footer uses `.footer` with 4 columns: logo+blurb, Pages, Reach me, The kit. Always link "Recent work" to `case-studies.html`.

Email everywhere: `kunwar@thecomjet.com`
LinkedIn: `https://www.linkedin.com/in/kunwar-deep-583626234/`
