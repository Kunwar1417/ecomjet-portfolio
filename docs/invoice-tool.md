# Invoice generator (`invoice.html`, private, live at `/invoice`)

Self-contained private tool to generate brand invoices as PDFs. Replaces manual Canva work. Redesigned "statement" layout (NOT a copy of the old Canva file): warm-cream ground, deep-navy ink (`#14213A`), brand blue (`#2B49C4`) spent only on the total bar / rules / labels, a slim 3mm blue left spine, header + footer panel bands. Bricolage Grotesque throughout with one Instrument Serif italic accent (on "Total *due*"). NOT linked from any nav; carries `<meta name="robots" content="noindex, nofollow">`. Sends no data anywhere.

- **Architecture:** single file, no backend, no build, no external CSS/JS deps (self-contained inline `<style>` + vanilla JS IIFE; does NOT pull `styles.css` or `app.js`). Lives at repo root, served at **`/invoice`** (`vercel.json` sets `cleanUrls: true`, so `/invoice.html` 308-redirects to the extensionless path; verified live 20 Aug 2026).
- **Layout:** two-pane on screen (form left, live A4 preview right, scaled via a JS `fitDoc()` transform + a zoom slider). Print stylesheet (`@media print`) shows only `.inv-doc` at true A4, resets the transform, preserves colors. Export = browser "Save as PDF".
- **India vs International toggle** drives everything via `is-india`/`is-intl` app classes + `.india-only`/`.intl-only` field visibility:
  - India: rail word "Tax invoice", SAC column (default `998366`), IGST 18%, ₹ (`en-IN` grouping → ₹2,95,000), Supplier block shows `NEVER SETTLE` + `Proprietor: Kunwardeep` (one word, per legal docs) + GSTIN + PAN, billed-to shows optional brand GST + Place of supply, payments = Kotak block + UPI ID (legible text line) + `photos/upi-qr.png`.
  - International: rail word "Invoice", no SAC, Tax 0%, **US$** (`en-US` grouping, see *Naming the currency* below), Reference column hidden entirely (unless a partnership code is added), optional Stripe line via checkbox. No PayPal. Payments come from the **client bank location** toggle below.
- **Client bank location toggle** (International only, `intl-only` field, state var `BANK`): picks which set of details prints.
  - `us` (**default**): Community Federal Savings Bank, method line `ACH (US domestic transfer)`, then Account holder / Account number / ACH routing number / Type / Bank / Bank address.
  - `swift`: for clients banking outside the US, Currency Cloud (UK), method line `SWIFT (International wire)`, then Account holder / **Account number (IBAN)** / BIC-SWIFT code / Type / Bank / Bank address.
  - **The two blocks are deliberately parallel**: same row order, same label wording, `Type` is "Checking" on both (and on India). The IBAN row leads with the familiar term and puts the acronym in brackets, so the scan column never opens on jargon. No "Bank country" row, the address already ends in the country. Keep them in sync if you edit either.
  - **`.pay-method`** is the promoted method line: brand blue, 12px/700, hairline rule under it. It is the routing instruction (*how* to send), so it sits above the grid rather than as a row inside it. This is a slightly heavier spend of the accent blue than the usual "total bar / rules / labels" rule, done on purpose.
  - The Stripe line still appends in both. The toggle is hidden on India (India has its own Kotak + UPI block and ignores `BANK`).
  - `BANK` is saved on the invoice object (`bank` key) and restored by `loadForm`, so reopening an old invoice reprints the same details it was sent with. It is deliberately **sticky** across "New invoice" (matching how the Stripe checkbox and terms behave), so a run of non-US invoices does not need re-toggling.
  - Table header is "Item" on both. Total bar reads "Total due" on both.
- **Naming the currency (international invoices).** A bare `$` is not a currency. A client in Singapore reads it as SGD, in Sydney as AUD, in Toronto as CAD, and every one of those is worth less than a US dollar, so the brand agrees to a smaller number than the one that was quoted. The document states the unit in three independent places, and all three are load-bearing:
  1. **Every figure is written `US$3,500`**, not `$3,500`. `fmtMoney()` builds the international string itself (`"US$" + Intl` grouping) rather than asking `Intl` for a currency symbol, because `en-US` renders USD as a bare `$`. Negative values keep the sign outside the unit (`−US$450`). This propagates everywhere at once: line items, the totals stack, the blue bar, the saved-invoice list and the whole Register.
  2. **The amount column head carries the unit**, `AMOUNT (USD)` and `AMOUNT (INR)`, so the column is labelled even before a figure is read.
  3. **`Currency` is the first row of Payment details**, `USD (United States Dollars)`, bolded via `.pay-cur`. This is the only one of the three that a payer's bank actually acts on: the account numbers below it cannot imply a currency, and a wire sent in the sender's local dollar gets converted on the way in. It prints on both the ACH and the SWIFT blocks, which stay parallel.
  - **India is deliberately left alone.** `₹` belongs to exactly one currency, so there is nothing to disambiguate, and the India block is already dense with GSTIN / PAN / UPI. The asymmetry is intentional; do not "balance" it by adding a Currency row there.
- **Numbering:** ONE shared counter, format `KD-YYYY-NNNN`, auto-rolls per year. **Self-healing / derived, not a stored counter:** the next number is always `max(saved invoice numbers for the year) + 1`, seeded at 15 for 2026 (→ first suggested `KD-2026-0016`). Exploring or misclicks never waste a number; a number is only "consumed" when you Download its PDF. Field is editable.
- **Saved-invoice archive (the "one place"):** Download PDF saves the ENTIRE invoice (type, brand, address, items, amounts, terms, date) to `localStorage` key `kd_invoices` (array, source of truth for both the archive list and the derived next-number). The "Saved invoices" list under the form is clickable: click a row → `loadForm()` reloads it fully for view/edit/re-download; each row has a delete (×). Re-downloading an existing number updates it in place. `localStorage` is per-browser, so always generate from the same machine/browser (no cross-device sync without a backend).
- **"New invoice" button** is safe: warns before clearing if the current invoice has content and hasn't been downloaded (saved). No blind counter advance.
- **Line items:** multiple rows (add/remove), free-text description with a `datalist` quick-pick of common deliverables, subtotal auto-sums. First line of a description is the title; extra lines become grey sub-text.
- **Live post link (per line item):** an optional second field under each description. Brands ask for the link often enough that it belongs on the document rather than in the covering email.
  - **The link wears a short phrase, never the URL.** A raw `instagram.com/reel/DcOLckITE78` is noise on an invoice, so the item prints `Watch the reel` in blue and the address hides behind the anchor (Chrome's Save as PDF carries it through, verified in the exported file).
  - **The phrase is read off the URL**, so it tells the truth about what it opens: `Watch the reel` for a reel, `Watch the video` for YouTube or TikTok, `View the post` for anything else. `linkWords()` is where a new platform gets added.
  - Several links on one item are allowed, separated by spaces or commas, for a package billed as one line. Then they are **numbered by kind** (`Reel 1`, `Video 2`) so they stay tellable apart. A protocol is added if it was not pasted, and anything that is not a URL is dropped silently rather than printed as a broken link.
  - Stored per item as `link`, so reopening a saved invoice reprints it.
- **Payment terms:** preset `<select>` (7 days / 30 days / 100% advance) + a **50/50 split** option that reveals a milestone toggle (50% advance / final 50%) which labels the line item and writes the correct balance sentence, + a "Custom…" free-text override.
- **Advance / deposit already received:** an optional block (checkbox, then amount + date received + free-text reference, plus a one-click "Set it to 50% of the total"). It is a **receipt, not a discount**, and the whole design follows from that:
  - **It comes off after tax.** The stack becomes Subtotal → IGST → **Invoice total** → **Deposit received** (as a minus) → the bar. Deducting before tax would under-charge GST, which is charged on the full value of the work whatever was banked early. The line says `Deposit received`, not "Less advance received": the minus sign already does the arithmetic, and the accountant's "less" reads stiff on a document a brand has to act on. The CSV keeps the word **advance**, since that is GSTR-1's own vocabulary.
  - **The blue bar always carries the figure the brand has to pay**, so with an advance on the invoice it stops saying `Total due` and says `Balance due` (the serif italic accent moves with it). One bar, one number to act on.
  - **The date received and the reference are both optional.** A quiet note under the stack carries whichever was filled (`Received on 14 August, 2026 · Wire ref 88410-2`), because that is what an AP team matches on. It never repeats that a deposit came in, which the line above already said, so with neither filled there is no note at all. If the deposit covers the whole invoice the note adds "Paid in full, this copy is for your records", because that document is now a receipt.
  - Over-payment is clamped to the total, so the balance can never print negative.
  - **`total` on the saved invoice is always the full billed value**, never the balance. The advance rides alongside it (`advOn`, `adv`, `advDate`, `advRef`) and only moves what is *outstanding*. Everything that reports billing (the month spine, `Billed`, the taxable value in the CSV) is untouched by it.
  - **Two flows, and only one of them wants this block.** Bill the whole engagement here and deduct the deposit, *or* send a separate advance invoice and then bill only the balance. Doing both double-bills the register, which is why the hint under the block says so.
  - The advance is per-invoice and is cleared by "New invoice", unlike the deliberately sticky Stripe / bank / terms choices.
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

### The closing block (`.tl-close`): the period's business numbers

The page closes on a **panel summary bar** (`--panel` ground, one top hairline) rather than another rule in the table. The heading says which page you are on; the foot says what the page came to, so neither does the other's job.

**Revenue is the point of this block.** IGST is collected on the government's behalf and is not income, so a month that billed ₹3,30,400 *earned* ₹2,80,000. The build before this one printed `Billed / IGST / Paid / Unpaid` as four label-and-figure pairs at one size, three of them coloured, and left that subtraction to be done in the head. It was rejected as ugly and clunky, and the diagnosis is the same one the hierarchy section makes about the table: **nothing was allowed to be the answer.**

One aligned measure, shared by the head row and every account:

`account · Billed · IGST held · Revenue · ⟨air⟩ · Collected · Outstanding`

- **Revenue is the only figure set at size** (24px, `opsz 72`), because it is the only one that says what the business earned. Billed and IGST are the working that gets to it and sit at 15px. Four type levels again: hero figure 24 / account name 13 / figures 15 / labels and meta 10–11 muted.
- **The empty 28px track before `Collected` is air doing a rule's job**, separating what the period earned from where that money stands. Consistent with *air separates, lines do not*.
- **Colour is spent once.** Only `Outstanding` carries `--over`, and only when it is above zero. The old block's green `Paid` is gone: money arriving is the normal case and did not need marking.
- **A zero still prints, muted** (`.nil`), because it is a fact. The exception is IGST on an international account, which prints an en dash: an export carries no IGST *at all*, which is a different statement from carrying none.
- **`avg` appears only at two invoices or more**, since an average of one is just the figure again. It averages revenue, not billed, to stay consistent with the hero.

**The delta.** Under Revenue, one line comparing against the period immediately before (`prevPeriod()` → previous month / year / FY; `prevLabelShort()` names it, printing the year only when the comparison crosses one). It is deliberately quiet: muted 11px with an arrow, no colour, because a down month is information and not an alarm. It is **omitted entirely when the previous period earned nothing**, since a percentage off a base of nothing is not a comparison, and on **All time**, which has nothing to stand against.

Sub/tax/total come from `invSplit()`: line items are the source, but the **stored total wins** on any disagreement, since that is what was actually sent. Revenue is computed as `billed − tax` rather than by summing `sub`, so the arithmetic printed across the row is exactly true.

Below 1024px the seven tracks stop fitting the hero, so **the foot stops being a table**: the head row is dropped and each figure carries its own label through `data-l` in a `::before`, two columns wide.

**The CSV needs no revenue column.** `Taxable value` already is it, under GSTR-1's own name.

### Export for the CA (`Export CSV`)

The band's one control. It exports **exactly the period on screen** (`KD-register-2026-08.csv`, `KD-register-FY2026-27.csv`, `KD-register-all-time.csv`), in issue order. A **UTF-8 BOM** is prepended, which is what makes Excel read `₹` and the client names correctly. Disabled when the period is empty. Kept pure data (no total rows, no symbols, no digit grouping) so a spreadsheet can sum it.

Columns borrow **GSTR-1's own vocabulary**, so the CA can map them without asking what anything means:

`Invoice · Invoice date · Due date · Client · Client GSTIN · Place of supply · Supply type · SAC · Currency · Taxable value · Tax type · Tax rate % · Tax amount · Invoice total · Advance received · Advance received on · Balance due · Status · Paid on`

- **`Supply type`** is derived the way the CA would decide it, and tells them which GSTR-1 table the row belongs in: `Export of services` for any international invoice, else `B2B` when a client GSTIN is present and `B2C` when it is not.
- **`Client GSTIN` and `Place of supply` come straight off the form** (`f-bt-gst`, `f-supply`) and are blank if they were never filled. A missing GSTIN silently reclassifies a registered client as B2C, which costs them their input credit, and a ₹2.5L+ inter-state B2C line still needs a place of supply. **Both fields being optional in the form is the weak link in this export.**
- **Place of supply is left empty on exports** rather than filled with a guess: it is a state, and Table 6A does not take one.
- **USD rows stay in USD, deliberately.** GST values an exported service at the rate on the date of the time of supply, not at whatever the remittance actually converted at, so the conversion is the CA's lookup against their own rate convention (RBI reference, bank TT buying). A rate invented here would only disagree with their books. `Invoice date` + `Currency` is everything they need. This is the same principle that stops the register summing or converting currencies anywhere.
- **`Tax type` / `Tax rate %` are `IGST` / `18` on every India invoice**, because that is what the document itself charges. If an intra-state (Delhi place of supply) case is ever handled, it splits into CGST + SGST and these two columns are where it lands.
- **`Advance received` / `Advance received on` / `Balance due` are the receipt side of the row** and never touch `Taxable value` or `Tax amount`: the tax is on the full invoice whatever was banked early. **The date is there because an advance taken in an earlier tax period is a liability in *that* period** (GSTR-1 table 11A), which the CA can only see if the date travels with the amount.
- **`Status` and `Paid on` are for Kunwar's own books, not for GST.** Liability attaches to the invoice, not the receipt; an overdue invoice is still tax payable in its own month. `Part paid` is used only for an open invoice carrying an advance; an overdue one still says `Overdue`, since lateness is the thing to act on.

### An advance in the book

The register never mixes the two sides of a row. **Billed stays billed; the advance only moves what is still owed.**

- **Outstanding in the margin is the sum of balances**, not of totals: a deposit already banked is not still owed.
- **The row keeps its billed figure at its own type level** and puts the balance under it as one muted line (`₹1,47,500 due`), so the money still reads down as a single column and the figure keeps its level in the hierarchy.
- **The pill stays a timing pill.** A part-paid invoice is still late or still upcoming, and that is what you act on, so "part paid" is told by the second money line, not by a fifth status. One status mark per row still holds.
- **In the closing block, `Paid` means received against that period's billing**, so an advance on a still-open invoice counts in it. That is what keeps `Billed − Paid = Unpaid` true on the page.
- Marking an invoice paid settles it whole; the advance stops mattering at that point and is not counted twice.

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
