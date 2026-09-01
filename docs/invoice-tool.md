# Invoice generator (`invoice.html`, private, live at `/invoice`)

Self-contained private tool to generate brand invoices as PDFs. Replaces manual Canva work. Redesigned "statement" layout (NOT a copy of the old Canva file): warm-cream ground, deep-navy ink (`#14213A`), brand blue (`#2B49C4`) spent only on the total bar / rules / labels, a slim 3mm blue left spine, header + footer panel bands. Bricolage Grotesque throughout with one Instrument Serif italic accent (on "Total *due*"). NOT linked from any nav; carries `<meta name="robots" content="noindex, nofollow">`. Sends no data anywhere.

- **Architecture:** single file, no backend, no build, no external CSS/JS deps (self-contained inline `<style>` + vanilla JS IIFE; does NOT pull `styles.css` or `app.js`). Lives at repo root, served at **`/invoice`** (`vercel.json` sets `cleanUrls: true`, so `/invoice.html` 308-redirects to the extensionless path; verified live 20 Aug 2026).
- **Layout:** two-pane on screen (form left, live A4 preview right, scaled via a JS `fitDoc()` transform + a zoom slider). Print stylesheet (`@media print`) shows only `.inv-doc` at true A4, resets the transform, preserves colors. Export = browser "Save as PDF".
- **India vs International toggle** drives everything via `is-india`/`is-intl` app classes + `.india-only`/`.intl-only` field visibility:
  - India: rail word "Tax invoice", SAC column (default `998366`), IGST 18%, ₹ (`en-IN` grouping → ₹2,95,000), Supplier block shows `NEVER SETTLE` + `Proprietor: Kunwardeep` (one word, per legal docs) + GSTIN + PAN, billed-to shows optional brand GST + Place of supply, payments = Kotak block + UPI ID (legible text line) + `photos/upi-qr.png`.
  - International: rail word "Invoice", no SAC, Tax 0%, $ (`en-US`), Reference column hidden entirely (unless a partnership code is added), optional Stripe line via checkbox. No PayPal. Payments come from the **client bank location** toggle below.
- **Client bank location toggle** (International only, `intl-only` field, state var `BANK`): picks which set of details prints.
  - `us` (**default**): Community Federal Savings Bank, method line `ACH (US domestic transfer)`, then Account holder / Account number / ACH routing number / Type / Bank / Bank address.
  - `swift`: for clients banking outside the US, Currency Cloud (UK), method line `SWIFT (International wire)`, then Account holder / **Account number (IBAN)** / BIC-SWIFT code / Type / Bank / Bank address.
  - **The two blocks are deliberately parallel**: same row order, same label wording, `Type` is "Checking" on both (and on India). The IBAN row leads with the familiar term and puts the acronym in brackets, so the scan column never opens on jargon. No "Bank country" row, the address already ends in the country. Keep them in sync if you edit either.
  - **`.pay-method`** is the promoted method line: brand blue, 12px/700, hairline rule under it. It is the routing instruction (*how* to send), so it sits above the grid rather than as a row inside it. This is a slightly heavier spend of the accent blue than the usual "total bar / rules / labels" rule, done on purpose.
  - The Stripe line still appends in both. The toggle is hidden on India (India has its own Kotak + UPI block and ignores `BANK`).
  - `BANK` is saved on the invoice object (`bank` key) and restored by `loadForm`, so reopening an old invoice reprints the same details it was sent with. It is deliberately **sticky** across "New invoice" (matching how the Stripe checkbox and terms behave), so a run of non-US invoices does not need re-toggling.
  - Table header is "Item" on both. Total bar reads "Total due" on both.
- **Numbering:** ONE shared counter, format `KD-YYYY-NNNN`, auto-rolls per year. **Self-healing / derived, not a stored counter:** the next number is always `max(saved invoice numbers for the year) + 1`, seeded at 15 for 2026 (→ first suggested `KD-2026-0016`). Exploring or misclicks never waste a number; a number is only "consumed" when you Download its PDF. Field is editable.
- **Saved-invoice archive (the "one place"):** Download PDF saves the ENTIRE invoice (type, brand, address, items, amounts, terms, date) to `localStorage` key `kd_invoices` (array, source of truth for both the archive list and the derived next-number). The "Saved invoices" list under the form is clickable: click a row → `loadForm()` reloads it fully for view/edit/re-download; each row has a delete (×). Re-downloading an existing number updates it in place. `localStorage` is per-browser, so always generate from the same machine/browser (no cross-device sync without a backend).
- **"New invoice" button** is safe: warns before clearing if the current invoice has content and hasn't been downloaded (saved). No blind counter advance.
- **Line items:** multiple rows (add/remove), free-text description with a `datalist` quick-pick of common deliverables, subtotal auto-sums. First line of a description is the title; extra lines become grey sub-text.
- **Payment terms:** preset `<select>` (7 days / 30 days / 100% advance) + a **50/50 split** option that reveals a milestone toggle (50% advance / final 50%) which labels the line item and writes the correct balance sentence, + a "Custom…" free-text override.
- **Partnership code** is an optional checkbox (off by default), like Stripe.
- **PDF filename** auto-set from invoice number + brand (`document.title` swapped just before `window.print()`, then restored).
- **Hardcoded constants** live in the `ME` object at the top of the inline `<script>` (registered address, GSTIN, PAN, `india` Kotak details, `us` bank details, `swift` international-wire details, and the live `stripe` payment link — a "customer chooses price" Stripe Payment Link, reused for every invoice).
- **Stripe line** is deliberately understated (secondary to bank transfer): one quiet sentence "Prefer card? Pay with Stripe (enter the invoice total at checkout)" with only the two-word link emphasised in blue. No raw URL shown.
- **Two user-supplied asset PNGs** (both present, with `onerror` fallbacks): `photos/signature.png` (signature above the sign line; white background dropped via `mix-blend-mode: multiply` on the cream) and `photos/upi-qr.png` (India UPI QR).

## Register view (the book: due dates, follow-ups, and the period a CA asks for)

A second screen-only view in the same file, toggled by the **Invoice / Register** switch in the top bar. Code identifiers still say `timeline` (`view-timeline`, `renderTimeline`); only the user-facing label is "Register". It **sends nothing to anyone**: no reminder email, no brand-facing surface.

**It answers two questions with one surface, and the only thing that changes between them is the lens.**

| Lens | Selected in the margin | The ledger becomes |
|---|---|---|
| **All time** (default) | `All time` chip | Grouped by urgency: Past due / Due soon / Upcoming / Settled. *Who owes me, and how late?* |
| **A period** | a year, an `FY yy–yy` chip, or a month | That period as a page of the book, in order of issue. *What did I bill, and what tax is on it?* |

**Periods are always cut by INVOICE DATE, never by due date.** That is the date the books are kept on, and it is what the CA asks for. `PERIOD` is `{kind:'all'} | {kind:'year',y} | {kind:'fy',y} | {kind:'month',y,m}` (`m` is 0-11); `periodRange()` turns it into an inclusive ISO `from`/`to` and `inPeriod()` tests `inv.date` against it. The FY chip is the **Indian financial year, 1 April → 31 March**, which is why it exists at all.

### Hierarchy is the whole job here

Read this before changing any type size or adding any rule. The build before this one had the right layout and was still rejected as *"clunky… so many lines… every text is of the same size, so I have to really focus to find out which is the past due section."* Section headings, column labels and the closing label were all 9.5px muted caps, and there was a hairline under every row, every month, every group head and a double rule at the foot. Three rules fix it and must hold:

1. **Four type levels, and nothing shares a level with a different job.** Period title 24 / section heading 15 bold ink / row name 15 and the figure 16.5 / meta and column labels 11.5 muted. **A heading must never be set like a label.**
2. **Air separates, lines do not.** A section is told apart by 34px of space above its heading, not by a rule. The only hairlines left in the table are between rows *inside* a group, at 6% ink (`--hair`).
3. **Status is a pill, not coloured text.** One tinted chip per row (`.pill--over/soon/upcoming/paid`) is the only colour in the table, so the eye lands on it first.

Supporting these: a **monogram** (`.tl-mono`) gives every row an entry point, tinted from a hash of the brand name so a brand keeps its mark, and **all four tints are cool** so a monogram can never be misread as a status. The year chips are a **real segmented control**, the selected month is a **solid ink chip**, and the period total is a **panel summary bar**, not another rule. The per-row `IN` badge was removed: the amount column's currency already says India or international.

### Layout: one sheet, a quiet margin, and the account

Earlier builds got this wrong twice before that: first as SaaS dashboard grammar (three equal stat tiles), then as a narrow 968px "reverse of the invoice" sheet that read as a receipt stranded on a wide desktop. The current build is **one page frame at `max-width: 1400px`** with the blue spine and the header/footer bands kept from the invoice, split inside into:

- **`.tl-rail`, the ruled margin (288px, sticky, its own `--rail` ground).** Outstanding (one pot per currency), then three plain facts (Open / Past due / Next due), then the month spine. It always reports the **whole book**, never the selected period: what you are owed is not a period question. Below 1240px it unsticks and becomes a horizontal strip above the ledger.
- **`.tl-ledger`, the account.** A period heading (name, count, folio range, and a "Show all time" escape when a period is on), a **sticky column head**, ruled single-line rows, and a closing block.

**One column measure, `--led-cols`, is shared by the head and every row**: `brand / issued→due / status / amount / actions`. That is what keeps the money a column. The invoice number and the follow-up state live in a second line *inside* the brand cell, which is one fewer column to scan. The action lane is reserved width, so revealing the buttons on hover never moves a line, and it is sized so the buttons never crowd the figure.

### The signature: `BILLED BY MONTH`

The year read down the margin. Every month prints what was billed in it and clicking one turns the ledger into that month's page, so **the period filter, the year's shape and the navigation are one object**. Clicking the selected month again returns to All time.

- The **bar is the year's rhythm; the figure beside it is the readout.** Each currency is scaled to its own biggest month (`maxInr`, `maxUsd`) and drawn in its own colour (ink = India, blue = international), because one shared scale would need an exchange rate. A bar is drawn only for a currency that actually has money in that month, so a quiet month stays a single ruled line.
- **No rule under any month**: the bar is the only ink a month needs, and empty months sit at `.42` opacity. The spine shows the months of the **focused year**; an FY selection makes it run Apr → Mar and crossing months carry a 2-digit year. Each cell owns its own `y`, so the crossing works.

### The closing block (`.tl-close`)

The page closes on a **panel summary bar** (`--panel` ground, one top hairline) rather than another rule in the table: `Total, august 2026` then one account per currency with **Billed / IGST / Paid / Unpaid**. The heading says which page you are on; the foot says what the page adds up to, so neither does the other's job. IGST only prints where there is tax (India). Sub/tax/total come from `invSplit()`: line items are the source, but the **stored total wins** on any disagreement, since that is what was actually sent.

### Export for the CA (`Export CSV`)

The band's one control. It exports **exactly the period on screen** (`KD-register-2026-08.csv`, `KD-register-FY2026-27.csv`, `KD-register-all-time.csv`), in issue order, columns: Invoice, Invoice date, Due date, Brand, Place, Currency, Subtotal, Tax (IGST), Total, Status, Paid on. A **UTF-8 BOM** is prepended, which is what makes Excel read `₹` and the brand names correctly. Disabled when the period is empty. Kept pure data (no total rows) so it imports cleanly.

### Rules that still hold

- **Two currencies are two accounts.** Never summed, never converted, anywhere: an FX rate invented here would make a private book lie about what is arriving. Both pots print at the same size so neither reads as a footnote.
- **Money is always Bricolage with `tabular-nums lining`.** The two Outstanding figures add `font-variation-settings: "opsz" 72`. **Instrument Serif italic is for sentences here, never for figures** (the empty-state line). A currency column has to align digit over digit, and Indian grouping (`₹3,54,000`) has an irregular rhythm a display italic only worsens.
- **One status mark per row**, and it is the pill. Past due additionally gets a warm band tint, because that is the row you came for. Settled rows keep their pill and go quiet by muting the name, the figure and the monogram, never by dropping the whole row's opacity.
- **Motion is one orchestrated moment on view entry**: rows fade and rise on a capped 28ms stagger, the spine's bars grow. `renderTimeline(true)` from `setView`, `renderTimeline(false)` from every action, so marking three invoices paid does not replay a show. `prefers-reduced-motion` kills it.
- **Due date** is a form field (`f-due`) under Date, **derived not asked for**: `date + termsNetDays()`. `elDue.dataset.derived` tracks provenance (`"1"` auto, `"0"` hand-typed). **It is deliberately NOT printed on the invoice**, which states the terms in words; the due date exists to drive this view.
- **Payment state** rides on the same `kd_invoices` objects: `paid`, `paidDate`, `nudges`. Old invoices lack all three and still render (`dueOf()` re-derives from `termsSel`). `carryPaymentState()` guards the real hazard: `readForm()` only knows form fields, so a re-download would otherwise reset an invoice to unpaid.
- **Empty states each say one thing.** No invoices at all → `.is-blank` hides the margin and the column head entirely and the page carries one invitation. A period with nothing in it → "Nothing was invoiced in January 2026." plus the way back. Everything settled → the margin says so and `.tl-facts:empty` leaves no stray rule.
- **Print safety:** `.inv-tl` is in the print `display:none` list and `.inv-app.view-timeline .inv-doc-wrap` is forced back to `display:block`, so Download PDF from the register still emits the A4 invoice. Verified via `--print-to-pdf`: 1 page.
- The **overdue count** shows as a badge on the Register switch (`#view-badge`).
