# Agreement tool: design language & product direction

Companion to `docs/agreement-tool.md` (which covers mechanics: clauses, numbering, archive, print CSS). **This file is the design and product brief.** Read it before changing how the agreement *looks*, or before building the shareable/e-sign version.

---

## 1. Where this is going (product direction)

The direction is a **PandaDoc-like experience**: send the brand a link, they open the agreement in the browser and fill their own fields, and it is executed online.

**Shipped (August 2026): the full loop.** The brand opens `/s/<token>`, reads the agreement, signs in the browser, and downloads the executed copy. The creator countersigns from the studio. Terms are frozen server-side, so the document the brand signs cannot be altered by anyone. No PDF is emailed in either direction. Mechanics in `agreement-tool.md`.

What that implies for anyone working on this:

- **Keep the document a real DOM document**, not a canvas or an image. Fields must be able to become inputs. This is now enforced structurally: `agreement-doc.js` renders the same DOM for both pages.
- **Keep every brand-supplied value in one place.** `readForm()` / `loadForm()` round-trip the whole agreement as a plain object; that object is the `terms` column verbatim.
- **The signature panel fields (signature, name, title, date) are the counterparty inputs.** Do not merge them into prose.
- **Only capture what you will honestly print.** There is a server now, so signing metadata is *possible*; §5 still governs what may appear on the page.

### Rules the signing build locked in (do not relax)

- A signature is an image clamped by the **additive** `.sign-rule.signed` class to `max-height: 8mm`. The 9mm box must never grow, or `break-inside: avoid` on the certificate reflows the page.
- The sign endpoint accepts **only signer fields**, never terms, and is idempotent on the token.
- `terms_sha256` is re-verified at signing time; a mismatch aborts.
- The certificate prints only genuinely captured facts. An unsigned agreement still shows four blank rules and no metadata.

---

## 2. Visual system

Shared with `invoice.html` at the token level, but the **document design is its own** — the agreement is a contract, not a statement, and the first build was rejected for looking like a copied invoice.

### Tokens

| Token | Value | Use |
|---|---|---|
| `--ink` | `#14213A` | Primary text |
| `--blue` | `#2B49C4` | Accent only: clause numbers, title italic, the handle, section labels |
| `--paper` | `#FBFAF6` | Page ground |
| `--panel` | `#F1EFE7` | Screen chrome bands |
| `--muted` | `#6B7385` | Secondary text, labels |
| `--line` / `--line-2` | `#DAD8CE` / `#C9C6BB` | Hairlines |
| `--sans` | Bricolage Grotesque | Everything |
| `--serif` | Instrument Serif (italic) | One accent per surface |

**Blue is rationed.** It marks structure (clause numbers), the document title italic, and the `@the_ecomjet` handle. It is never a filled slab behind content. The fee was once a solid blue bar and it was removed for shouting: *a contract states its number, it does not advertise it.*

### Page architecture

1. **Title masthead** (page 1 only). Eyebrow rule "BRAND PARTNERSHIP" → `Collaboration` (43px sans) over `agreement` (46px Instrument Serif italic, blue). No filled header band.
2. **Byline** under a 1.5px rule: **Kunwar Deep** (17px) → **Creator of @the_ecomjet** (12.5px blue) → "Trading as NEVER SETTLE · email" (9.5px muted). Agreement no. + date right-aligned opposite.
3. **Preamble** sentence, then a **quiet parties block** (10px muted, no blue).
4. **Numbered clauses**: 11.5px uppercase heading with a blue number in an 8mm gutter, hairline under, body indented to match.
5. **Certificate of signature**, own page. See §4.

### Identity hierarchy (settled, do not re-litigate)

Brands know the Instagram channel, not the legal entity. Order is always:

**Kunwar Deep** → **@the_ecomjet** → *NEVER SETTLE (small, muted)*

`NEVER SETTLE` appears exactly **twice**, both functional: the masthead byline, and nowhere else in the body. It is kept because invoices are raised and paid under that name, so removing it entirely breaks the agreement → invoice → bank paper trail. It is not in the preamble, parties block, or footer.

### Tone

Neutral, never adversarial. Full rules in `agreement-tool.md`, summarised:

- State what happens, don't prohibit. *"The content runs as delivered"* not *"The Brand may not re-edit"*.
- Frame positively where meaning is identical. *"can be extended by a new written agreement"* not *"cannot be extended without one"*.
- Never pre-blame the Brand. *"If feedback arrives later than planned"* not *"Delays caused by late feedback"*.
- No em dashes anywhere in copy (project-wide rule).

---

## 3. Print: the hard-won rules

Print behaviour caused more regressions than anything else. **Do not change `@media print` without reading `agreement-tool.md` §print and re-running the verification below.**

The short version:

- `@page { size: A4; margin: 14mm 0; background: #FBFAF6 }` — the `background` on `@page` **itself** is the load-bearing part. It is the only way to get a per-page margin that is also painted, so pages get breathing room *and* cream reaches every edge.
- **Never** create page margins with fixed overlay bands drawn *on top of* the flow. That silently painted over real sentences; pages ended mid-word.
- **Never** put top padding on `.d-body`; it re-applies after every break.
- **The blue spine is not printed.** Chrome clips fixed elements to the page content area, so it stopped 14mm short top and bottom and read as a rendering fault. `border-left` on `@page` would fix it but Chrome ignores that property. Screen keeps the spine; print does not. **If the spine is ever restored to print, the bleed must be solved first.**

### Verification (run this, don't eyeball it)

```python
from pypdf import PdfReader
for i, p in enumerate(PdfReader("out.pdf").pages, 1):
    last = [l for l in (p.extract_text() or "").split("\n") if l.strip()][-1]
    print(i, "OK" if last.rstrip()[-1] in ".:" or last.isupper() else "CLIPPED", repr(last[-60:]))
```

Run against **both** a fully populated agreement and an empty form. Also render **without** `--no-pdf-header-footer` at least once, because that flag hides Chrome's own date/URL headers which the real user sees unless they disable them in the print dialog.

---

## 4. The Certificate of signature page

Last page, own sheet. A security-document treatment: full-bleed engraved guilloche field, double engine-turned frame, centred title, agreement reference, two signing panels, rosette seal.

- Pattern is **mathematically generated inline SVG** (46 interfering sine curves drawn twice with an offset copy for moire; a hypotrochoid rosette for the seal). Gradients render guilloche as scratchy strokes; absolutely-positioned pseudo-elements painted inconsistently between page edges. Real DOM elements only.
- Fields are exactly four: **signature, name, title, date**, per party. Name and title prefill; signature and date stay blank.
- Field opacity `.22`, header on a radial wash, panels at `rgba(255,255,255,.9)` so ruled lines stay writable.

---

## 5. Integrity boundary (important)

The certificate takes **visual** cues from PandaDoc/DocuSign. It must not take **evidentiary** ones.

It deliberately omits: IP addresses, sent/viewed/signed timestamps, "email verified" lines, QR codes, reference hashes. Those attest that a platform *observed* a signing event. This is a static page printed *before* anyone signs, so such a field could only be typed by hand — a fabricated record, and precisely the thing that would collapse under scrutiny if a contract were ever disputed.

**Rule for the future shareable version too:** only print metadata the system genuinely captured. If real signing evidence is wanted, either build the backend that actually records it, or route the PDF through a real e-sign service and let it append its own certificate page.

Related: **both signature blocks stay blank**. `photos/signature.png` exists and the invoice pre-prints it, but an agreement is executed by both parties. Sending a pre-signed contract weakens the negotiating position, risks being bound to an edited document, and puts a liftable signature in every prospect's inbox. Flow is: send unsigned → brand signs → countersign the returned PDF.

---

## 6. Index of related docs

| Topic | File |
|---|---|
| Agreement mechanics, clause set, print CSS detail, numbering, archive | `docs/agreement-tool.md` |
| This file: visual system, product direction, integrity boundary | `docs/agreement-design-language.md` |
| Invoice tool (shares tokens, different document design) | `docs/invoice-tool.md` |
| Proposals + rate card | `docs/proposals.md` |
| Site-wide design system | `docs/design-system.md` |
| Deploying (safe runbook) | `docs/deployment.md` |
