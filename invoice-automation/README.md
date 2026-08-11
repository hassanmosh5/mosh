# Invoice & Payment Automation

A single-file, offline mini app for the half of freelancing nobody sells a course
about: getting the invoice out correctly, and then getting it paid. Build an invoice
that adds up to the cent, derive every due date from a stated payment term, run a
chase sequence that writes its own emails, and see what you are actually owed and
when it is due.

Open `index.html` in any modern browser — no install, no build step, no accounts, no
internet connection, and no data ever leaves the device.

## Why this app exists

The other apps in this repo help you win the work. This one is about the gap between
finishing it and being paid for it, which is where a startling amount of small-business
income quietly evaporates.

Almost none of that gap is a collections problem. It is a decisions problem: what to
number the invoice, when it falls due, when to chase, what to say, what to charge for
being late. Those get re-decided on every single invoice, badly, under time pressure,
which is why the invoice goes out late, the terms drift, the reminder never gets sent,
and the money arrives whenever the client feels like it.

So the app makes each of those a setting, once, and derives everything else from it.

| Income stream | How this applies |
|---|---|
| #1 Freelance writing & content, #6 Coaching & consulting | Deposits, Net 14, and a chase sequence for clients who pay on a run |
| #3 Social media management, #4 Local business automation | Monthly retainers on the Recurring tab; direct debit rather than chasing |
| #2 Digital products, #5 Prompt packs | Mostly prepaid — but the gateway-fee arithmetic is where the margin goes |
| Agency work | Multi-client aging, concentration risk, and DSO as a trend |

Nothing in this app is book content. It is invoice arithmetic, calendar arithmetic and
a set of opinions about collections, and it says so in its own footer.

## What's in it

| Tab | What it does |
|---|---|
| ⚙️ **Setup** | The policy every invoice inherits: numbering, terms, tax, chase sequence, late fees, currency |
| 👥 **Clients** | Who you bill and on what terms, with per-client overrides — and how many days late each one actually pays |
| 🧾 **Invoices** | Line items, discounts, deposits and instalments, payments, and a printable invoice document |
| 📤 **Chase queue** | What to send today, already written, with the merge fields filled in |
| 🔁 **Recurring** | Retainers and subscriptions: when the next one is due, and a click to raise it |
| 💳 **Getting paid** | What each payment method costs you, and what to charge so a specific sum lands |
| 📊 **Aging & cash** | Aging bands, who owes what, DSO, and when the money is contractually due |
| 🔌 **Wire it up** | Each automation as a trigger, an action, the thing no tool does for you, and how to set it up in Stripe, Wave, Xero, Sheets, Make/Zapier |
| 📄 **Spec** | The whole policy — terms, templates, ledger — as one Markdown document, plus CSV exports |

## Four rules the whole thing rests on

**1 · Money is an integer number of minor units.** Cents, pence, kobo — never a
decimal. `0.1 + 0.2` is `0.30000000000000004`, and an invoice that is off by a cent is
an invoice someone has to phone you about. Amounts convert to minor units at the input
boundary and format back at the output boundary; in between there are only integers.
`dec` is not always 2, either — yen and the CFA franc have no minor unit at all.

**2 · Dates are civil dates, never timestamps.** `new Date("2026-04-30")` parses as UTC
midnight and prints as the 29th for anyone west of Greenwich, which is how an invoice
ends up one day overdue in one timezone and not in another. Dates here are
`YYYY-MM-DD` strings, all arithmetic goes through UTC, and the local clock is read in
exactly one function.

**3 · Status is derived, not stored.** An invoice is paid when its payments cover it and
overdue when today is past its due date and they don't. There is no status field to set,
so there is no way to have a "paid" invoice with money outstanding.

**4 · A discount is applied before tax, and allocated across the lines.** The line bases
sum to exactly the discounted subtotal, so the tax you declare is the tax on what you
actually charged. Discounting the total after tax gives a different number and a return
that doesn't reconcile.

## The arithmetic is checked, not trusted

The app's whole arithmetic layer is written above the UI line with no DOM access, which
lets it be extracted and run outside a browser. **187 assertions** run against it —
boundary cases plus roughly 130,000 fuzz iterations — and they check invariants rather
than examples:

- **`net + tax = total`, always** — across all three tax modes, both rounding modes,
  negative lines, zero quantities, over-100% discounts and mixed rates, 30,000 times.
  Group totals must also sum to the invoice totals, and every result must be an integer.
- **Instalments sum to the total exactly**, for every plan, at every amount. Three equal
  instalments of $100.00 are 33.34 + 33.33 + 33.33 and the app decides who gets the odd
  cent, not the client.
- **A due date is never before its issue date**, for every term type over 1,500 random
  issue dates.
- **Month arithmetic never walks backwards.** 31 Jan + 1 month is 28 Feb (29 in a leap
  year), + 3 months is 30 Apr, and a monthly schedule anchored on the 31st is still on
  the 31st sixty months later.
- **The aging bands partition** — every possible day count lands in exactly one.
- **A charge grossed up to net a target actually nets it**, and is the *smallest* charge
  that does, across every method and 8,000 random targets including capped fee schedules.
- **No message template can render the word `undefined`**, and every merge field used by
  any template is one the app can supply.

Those checks found four real bugs, all of them shipped-looking:

- `parseMoney("$1,000")` read the comma as a decimal point and returned ten dollars.
  Separator handling is now explicit about the ambiguity, and documented.
- Grossing up against a capped fee (ACH's $5 ceiling) overshot by thousands of minor
  units, because the closed form doesn't know about caps. `net(x)` is monotonic, so it
  is now a binary search that returns the exact minimum.
- `rank[status] || 9` sorted **overdue invoices to the bottom of the list** — rank 0 is
  falsy. The most urgent money was the hardest to find.
- Cash-flow bars were all 2px high: a percentage height against a flex item that is
  sized by its own content resolves to nothing. Heights are computed in pixels now.

A headless browser run checks the rest: every tab renders, the totals on screen equal the
totals in the model, editing and payments and issuing behave, state survives a reload,
**zero network requests of any kind**, no console errors in light or dark, and no
horizontal page scroll at 390px on any tab.

## Opinions the app has, and why

**The pre-due reminder is the valuable one.** Every sequence except Gentle sends
something before the due date. It isn't a chase — it's a chance for the client to find
the invoice and get it approved in time, and it prevents more lateness than everything
after it combined.

**You send the step you're on, not the backlog.** If four steps have passed unsent, the
app queues the latest one and reports the rest as missed. It will never have you fire
off a whole escalating sequence in one afternoon.

**A reminder that would predate the invoice is dropped, not clamped.** A −7 day
reminder on a Net 3 invoice would be scheduled four days before you sent the thing;
clamping it to the issue date would pile two reminders onto one day instead.

**A template with a hole in it is not ready to send.** An unresolved merge field is left
visible and flagged rather than replaced with nothing, because "Hi , your invoice for is
now undefined days overdue" is a message that gets sent, and it costs more goodwill than
the late payment did.

**Drafts have no number.** The number is taken at the moment of issue. A numbered draft
that gets deleted leaves a gap in the sequence, and a gap is the thing an auditor asks
about.

**Totals are never summed across currencies.** Every total, bucket and chart is grouped
by currency, because adding pounds to naira produces a number that is confidently wrong.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of
  any kind — verified by a browser run asserting zero non-`file://` requests across every
  tab and every interaction. The invoice HTML it exports is self-contained too.
- **Everything saves** to `localStorage` as you type. `⬇ Back up` downloads the lot as
  JSON, `⬆ Restore` reads it back and merges rather than replaces, and `🗑 Clear` backs
  up first, then wipes. Storage failures (private mode, `file://` restrictions) degrade
  to in-memory with a warning rather than breaking the app on the first keystroke.
- **A working date you can move.** The chase queue computes everything as of a date you
  can set forward, so you can see what next week will ask for. Nothing is changed by
  looking.
- **Light and dark**, following your system setting, with a manual toggle.
- **Accessible.** Real form controls throughout, every input labelled, arrow-key tab
  navigation, visible focus rings, live-region toasts, and all animation disabled under
  `prefers-reduced-motion`.
- **Responsive** to 390px with no horizontal page scroll on any tab; wide tables scroll
  inside their own containers, including the invoice document's own line items.
- **Printable.** Printing an invoice prints the invoice, not the app around it.
- **Exports** as a printable invoice, a standalone HTML invoice, plain text, an invoices
  CSV, a chase-schedule CSV (one row per reminder, message already written — the shape a
  mail merge wants), and the whole policy as Markdown.

## What this app is not

It does not take money, connect to a bank, send an email, or file anything. It is a place
to decide the policy and watch it work; running it every week at 6am is a job for a tool
that can send email at 6am, which is what the *Wire it up* tab is for.

It is also not legal or tax advice. Invoice content requirements, statutory late-payment
rates, interest caps and card-surcharging rules differ by country and by whether your
customer is a business or a consumer. The app does the arithmetic; it does not know the
law where you are, and it says so where it matters.

## What will go stale

The published card rates in *Getting paid*. They change without notice, vary by country,
and are negotiable above modest volume — which is exactly why they are editable settings
seeded with a starting point rather than constants. Fixed fees quoted in US dollars are
carried across to other currencies at face value and flagged as such, because converting
them would need an exchange rate this app has no way to fetch.

The tool names in *Wire it up* will drift too, so each one is written as a pattern —
trigger, action, and the thing the tool can't do — rather than a click path.

The arithmetic will not go stale. Net 30 has meant thirty days for a very long time.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub
Pages. Served from this repo's root, the app lives at `/invoice-automation/`.
