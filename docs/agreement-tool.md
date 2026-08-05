# Agreement generator (`agreement.html`, private, live at `/agreement.html`)

Self-contained private tool to generate brand collaboration agreements as PDFs. Shares the invoice's **form mechanics** (variable filling, live preview, derived numbering, localStorage archive) but has its own **document design**. NOT linked from any nav; carries `<meta name="robots" content="noindex, nofollow">`. Sends no data anywhere.

## Document design (deliberately NOT the invoice's)

The first build copied the invoice masthead and was rejected. A contract is not a statement, so it opens differently:

- **Title masthead, not a header band.** No filled `--panel` bar. The document name "Collaboration *agreement*" is the largest element (43px sans over a 46px Instrument Serif italic in blue, stacked), under a hairline-ruled "BRAND PARTNERSHIP" eyebrow. Generous top padding, no border.
- **Identity is a byline under a 1.5px rule**, not a competing wordmark. Order matters and is intentional: **Kunwar Deep** (17px, the person signing) → **Creator of @the_ecomjet** (12.5px blue, what the brand actually recognises) → "Trading as NEVER SETTLE · email" (9.5px muted). Agreement no. + date sit right-aligned opposite.
- **Parties block is quiet reference matter**: 10px muted body, 8.5px muted labels, no blue. It states the parties; the masthead already introduced them. Do not re-inflate this.

### NEVER SETTLE is deliberately de-emphasised

Brands know Kunwar by the Instagram channel, not the entity, and the entity name appearing everywhere read as wrong. It now appears in exactly **two** places, each functional:

1. The muted masthead line "Trading as NEVER SETTLE".
2. The Creator's signature title, "Creator, @the_ecomjet · NEVER SETTLE".

It is **not** in the preamble, the parties block, or the screen footer. Keeping those two mentions matters: invoices are raised as NEVER SETTLE and payment lands in an account in that name, so removing it entirely would break the paper trail from agreement → invoice → bank. Do not add more mentions, and do not remove these two.

### The Certificate of signature page

The last page of every agreement, on its own sheet (`break-before: page` on the `.sign-break` spacer). Designed as a security document: full-bleed engraved guilloche field, double engine-turned frame, centred "Certificate *of signature*" title, agreement number and party names, two signing panels, and a rosette seal in the foot.

**Fields are only the four that were agreed: signature, name, title, date.** Name and title prefill from the form; signature and date are always blank for hand or e-signing.

- **The pattern is mathematically generated SVG**, inlined in the markup:
  - The **field** is 46 interfering sine curves (two frequencies per line, marching evenly top to bottom) drawn twice with a 10px offset copy. That second pass is what produces the moire a real engraving has.
  - The **seal** is a hypotrochoid rosette (the classic engine-turned banknote motif), two passes at different `r`/`d`.
  - Both were generated with a throwaway Python script and pasted in as path data. To regenerate, use the formulas in the comments; keep the output under ~25KB per group or the file bloats.
- **Why inline `<svg>` elements and not CSS:** `repeating-*-gradient` renders guilloche as scratchy strokes rather than curves, and `::before`/`::after` bands with absolute positioning painted **inconsistently between the top and bottom page edges** in print (the top band repeatedly failed while the bottom one drew). Real DOM elements are predictable. No external asset, so nothing can 404.
- Field opacity is `.22` and the header sits on a radial wash, so the pattern never competes with the type. Signing panels are `rgba(255,255,255,.9)` so the ruled lines stay unambiguous to write on.

**The page is decorative and makes no verification claim.** It deliberately does NOT reproduce the parts of a PandaDoc/DocuSign certificate that were in the reference screenshot: IP addresses, sent/viewed/signed timestamps, "email verified" lines, or a QR code. Those attest that a platform *observed* the signing. This is a static page printed *before* anyone signs, so any such field would have to be typed by hand, producing a fabricated record that is worse than useless if the document is ever challenged. If genuine signing metadata is wanted, run the PDF through an e-sign service and let it append its own certificate page.

### Both signature blocks stay blank. Do not pre-print the signature.

`photos/signature.png` exists and the invoice uses it, so this comes up. It was considered and **deliberately rejected** for the agreement:

- An invoice is a statement you issue; an agreement is executed by both parties. Sending a pre-signed contract says "these terms are final", and if the Brand redlines anything the signature is attached to a document that no longer reflects what was agreed.
- It risks being bound to an edited document: a party could alter a clause, sign, and hold up a fully-executed contract carrying the Creator's signature.
- It puts a liftable signature image in every prospect's inbox, including deals that never close.
- Convention is that the party proposing terms signs **last**, after the other side accepts.

**Intended flow:** send unsigned → Brand signs → Creator countersigns the returned PDF outside this tool (Preview Markup, or whatever e-sign service the Brand uses).

**Signature titles are kept on both sides.** The Brand's title is the field showing their signatory had authority to bind the company, which is what you point at if a deal is later disputed. The Creator's side reads "Creator, @the_ecomjet · NEVER SETTLE" rather than a corporate title.

**Address:** the Creator's short-form address (`ME.address`) stays in the parties block. A contract identifies its parties by address, and dropping it while still asking the Brand for theirs would be asymmetric.
- **No filled fee slab.** The fee sits between two hairline rules with a small muted "TOTAL FEE" label and the amount at 20px in ink. A blue block advertises a price; a contract states it. Blue is reserved for clause numbers, the title italic, and the handle.

- **Architecture:** single file, no backend, no build, no external CSS/JS deps (inline `<style>` + vanilla JS IIFE; does NOT pull `styles.css` or `app.js`). Repo root, served at **`/agreement`** (`vercel.json` sets `cleanUrls: true`, so `/agreement.html` 308-redirects to it). Locally, with `python3 -m http.server`, there is no clean-URL rewrite, so use `/agreement.html`.
- **Layout:** two-pane on screen (scrolling form left, live A4 preview right, scaled by `fitDoc()` + zoom slider). Print stylesheet shows only `.inv-doc` at true A4. Export = browser "Save as PDF".
- **Multi-page.** Runs 3 to 4 A4 pages. The print CSS is subtle and was arrived at by fixing real defects. **Read this before touching `@media print`:**
  - **`@page { margin: 0 }` is mandatory.** Chrome does **not** paint any background into the `@page` margin area in print-to-PDF (verified with a pixel probe: margin strips render white while the content box renders cream). Any non-zero `@page` margin puts white bands around every page.
  - **Page margins therefore come from fixed-position `.pg-band` divs** (top and bottom, cream, 13mm) plus `.inv-doc-wrap { padding: 13mm 0 }` so real content reserves that space. A fixed element repeats on every page in paged media, which is exactly what a per-page margin needs.
  - **Never put top padding on `.d-body` in print.** It is re-applied after every page break and opens a blank band at the top of pages 2+. This was the original "weird page break gap". Horizontal insets on `.inv-doc` are fine (side padding does not repeat vertically).
  - **The blue spine is `body::after`** (fixed, `z-index: 3` so it sits above the cream bands). Do **not** give it a negative z-index: that drops it behind the page background and takes the blue clause numbers with it.
  - `.cl { break-inside: avoid }` keeps a clause heading attached to its body. `.fee-bar`, `.kv-grid`, `.dtab`, `.sign-col` also avoid breaking so a margin band never clips a rule.
  - **Verify any print change by rendering to PDF and pixel-checking the corners**, not by eye: top-left must be spine blue `(50,72,189)`, top-right and bottom-right cream `(251,250,246)`, on every page.
- **Numbering:** format `KD-A-YYYY-NNNN` (4-digit, matching the invoice), derived not stored. Next number is always `max(saved numbers for the year) + 1`, so exploring never burns a number. Consumed only on Download. Editable. **Seeded at `SEED_SEQUENCE = 15` for 2026, so the first agreement is `KD-A-2026-0016`.** This is a **separate counter from invoices** and the two intentionally drift apart: `KD-2026-0016` (invoice) and `KD-A-2026-0016` (agreement) are unrelated documents that happen to share a number at the start only.
- **Saved archive:** Download PDF saves the whole agreement to `localStorage` key `kd_agreements`. Clickable list under the form reloads any past agreement for edit/re-download; each row has a delete. Re-downloading an existing number updates in place. Per-browser, so generate from the same machine.
- **"New agreement"** warns before clearing if the current one has content and was never downloaded.
- **Clause engine:** `buildClauses()` returns an array of `{h, b}` and the renderer numbers them. Optional clauses return nothing when their checkbox is off, so numbering always stays contiguous. To add a clause, insert it at the right position in that function.

## Clause set (16 max, 12 always present)

Always: Scope · Deliverables · Timeline and approval · Fee and payment · Revisions · Creative control and disclosure · Usage rights · Ownership · Cancellation · Warranties and liability · Disputes · General.

Optional (off by default): **Exclusivity** (category, days, named competitors) · **Confidentiality** · **Use after the licence ends** (content deletion on expiry) · **Additional terms** (free text, appears only when filled).

## Decisions baked in

- **Disputes are deliberately country-neutral.** Tiered clause: 15 days good-faith resolution, then a single arbitrator, **conducted remotely, in English**. The seat is an optional field; left blank it reads "as the parties agree in writing at the time", so no country is named and there is nothing for brand legal to redline. Naming India was rejected as a bad first impression; naming a foreign seat was rejected as not credible. Governing law is a separate optional field and the clause is **omitted entirely** when blank.
- **Both signature blocks are blank.** No pre-printed signature (unlike the invoice, which uses `photos/signature.png`). A counterparts + e-signature sentence sits above them.
- **Usage rights: 5 scopes, each with its own grant sentence AND its own editing rule.** Set in `SCOPE_GRANT` / `SCOPE_EDIT` / `SCOPE_HINT` in the script. The form shows a plain-language hint under the dropdown for each.
  1. **(none)** — default. Clause states no rights are granted and the content stays on the Creator's channel. Term/territory fields hide.
  2. **Organic** — repost unpaid on their own channels. Explicitly says no money may go behind it.
  3. **Organic + paid** — adds paid social, but published from the *Brand's* accounts, under their name.
  4. **Whitelisting** — ads run from **@the_ecomjet** via Meta partnership ad tools. Names the handle, obliges the Creator to grant permissions for the term, and gives the Creator a **right to demand any misrepresenting ad be paused**.
  5. **Full paid media** — all channels including display, CTV and third-party placements.
- **One licence term drives everything.** The term dropdown (1 / 3 / 6 / 12 months / perpetuity) is the single source of duration; every scope sentence reads from it via `termPhrase`. Do not add per-scope duration fields.
- **The re-edit checkbox only appears for organic and organic+paid**, because those are the only scopes where it is a real choice. Whitelisting and full paid media inherently require cutting the content into ad variants, so a blanket "may not re-edit" there would be contradictory and unenforceable. Their clauses instead permit reformatting with a meaning-not-changed guardrail, and whitelisting additionally forbids adding claims since the ad wears the Creator's face.
- **Silence-is-approval** on the review window (default 3 business days) and **delay-shifts-the-date** are in clause 3, both protecting the Creator.
- **Fee is quoted net**, and this matters MORE with overseas clients, not less. Three protections in one sentence, all deliberate:
  - *exclusive of taxes* — if GST ever applies, it does not come out of the fee.
  - *transfer and FX charges sit with the Brand* — a SWIFT wire to India loses roughly $15 to $45 to intermediary banks. Without this the Creator absorbs it.
  - *withholding certificate* — the important one. If a client withholds tax and provides no certificate, that money is simply lost; with it, the Creator claims relief under the DTAA. US clients may withhold 30% absent a W-8BEN, so this clause is what gets the paperwork moving.
- **Late-payment interest is OFF by default** (the dropdown keeps 1.5%/month options for the rare deal that wants one). Reasoning: interest is not realistically enforceable against an overseas company at these deal sizes, US procurement systems often auto-flag interest clauses and trigger a redline, and 1.5%/month compounds to ~19.6% a year which reads aggressive to a finance team. **The 50% advance is the actual protection.** Do not restore this as a default.
- Kill fee defaults to 50%; delivered content is always payable in full.
- Liability is capped at the total fee on both sides.

## Tone: neutral, not adversarial

The clause copy was deliberately softened in a pass that changed **wording only, no obligations**. The register to keep when editing:

- **State what happens, do not prohibit.** "The content runs as delivered, without re-editing" rather than "The Brand may not re-edit". Same restriction, no finger-wagging.
- **Frame positively where the meaning is identical.** "can be extended by a new written agreement" rather than "cannot be extended without one".
- **Do not pre-blame the Brand.** "If feedback, product access or the brief arrive later than planned" rather than "Delays caused by late feedback, late product access or a late brief". "If no feedback arrives" rather than "If the Creator hears nothing".
- **Avoid accusatory nouns.** The whitelisting pause right says an ad that "does not reflect what they said" rather than one that "misrepresents them".
- **Avoid debt-collection register.** "If payment goes beyond 15 days past the due date" rather than "Invoices unpaid more than 15 days past their due date".
- **Give a reason instead of a jab.** "the full fee remains payable, since the work has been completed" rather than "whether or not the Brand chooses to publish it".

**Two things were left harsh on purpose:**
1. **"does not knowingly infringe"** in Warranties. Dropping "knowingly" reads softer but materially *increases* the Creator's liability, turning a good-faith warranty into a strict one. Leave it.
2. **The liability cap** wording, already neutral.

**Note on the address:** `ME.address` in `agreement.html` is a short form ("U/G/F-1/80, Shastri Park, New Delhi, India (110053)"). The invoice deliberately carries the **full** registered address, because a tax invoice needs it. This mismatch is intentional. Do not sync them.

**Not legal advice.** These are sensible commercial terms for creator/brand deals, not lawyer-reviewed drafting. For a deal large enough to matter, have a lawyer look at it.
