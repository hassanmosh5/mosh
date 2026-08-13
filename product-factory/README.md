# MOSH Product Factory

A single-file, offline production console for a one-person digital product studio: what to build,
in what order, with which gates, at what price, and — the question everything else turns on — how
many products a month you can actually finish.

Open `index.html` in any modern browser. No install, no build step, no accounts, no internet
connection, and no data ever leaves the device.

**It does not make anything.** Nothing here talks to a model. It works out what to build and what
the model should be told, and it prices the hours the plan assumes you have.

## The argument the app makes

A plan to publish "multiple products every month" is a claim about hours, not about software. The
app takes that claim seriously enough to test it, and three things follow:

1. **A factory's output is set by its slowest human step, not its fastest AI one.** Generation
   collapses drafting from days to minutes and leaves deciding, checking, formatting and answering
   customers exactly where they were. On the workflows here a model takes 9.7 hours off the 16.9-hour
   e-book workflow — real, and worth having, and not the same as taking the e-book off you. The
   Production tab prints the ratio rather than asserting it.
2. **Every published product is a standing cost, not a finished asset.** Support questions,
   refunds, a broken download link, a syllabus that changed, a model that no longer behaves the way
   the prompt pack says. Upkeep scales with the catalogue; your week doesn't. There is a catalogue
   size at which upkeep consumes every build hour you have, and the app solves for it.
3. **The pipeline is exactly as automatic as its worst gate.** Most steps can run unattended. A
   handful cannot, because being wrong is expensive in a way that review-by-another-model does not
   fix — wrong physics in an exam guide, a feed ratio that kills birds, an invented regnal date in
   a history of a living institution. Those gates are marked, costed into every estimate, and never
   ticked automatically.

## The tabs

| Tab | What it does |
|---|---|
| 🏭 **Factory** | Your hours, your upkeep, your retirement rate — and the capacity, the catalogue ceiling and a month-by-month simulation that follow from them |
| 💡 **Ideas** | Twelve seeded products scored on five weighted factors, ranked by score **per hour** rather than by score |
| 🔧 **Production** | Three workflows (e-book, course, pack) as 34 steps with owners, artifacts, minutes and gates |
| 🤖 **Agents** | Seven system prompts, written from the selected product, with the prohibitions that stop a model filling holes with invention |
| ⚠️ **Checks** | 18 category-specific ways generated content is wrong, how each one surfaces, and who can actually settle it |
| 💰 **Economics** | Store fees, net per sale, break-even units, payback months, the price ladder, and both currencies |
| 🔻 **Funnel** | Seven steps priced per 1,000 visitors, with a sensitivity table saying which single rate is worth working on |
| 🗓 **Schedule** | The thirty-day month laid against your real hours — and the recurring month that is not week four of the first one |
| 📄 **Export** | The lot as one Markdown document, plus two CSVs |

## The arithmetic

Four pieces, each checkable by hand and each checked in the page at load.

**Capacity.** Upkeep is paid out of your month before anything gets built, so the catalogue settles
where the launches your remaining hours allow exactly replace what retires:

```
C* = monthHours / (h·r + u)        ceiling = monthHours / u

h = hours per product   r = share retired per month   u = upkeep hours per product per month
```

At 15 hours a week, 45 minutes of upkeep per product per month and 4% retired, the catalogue
settles at 44 products and the sustainable launch rate is 1.8 a month — against the 3.6 a standing
start suggests, and against a ceiling of 87 products where upkeep alone is a full month. The
simulation runs the same thing month by month and converges on it (36 live at two years, still
climbing), which is the point of solving it twice.

**Cost per product.** Workflow minutes plus that category's verification minutes:

```
e-book 16.9 h   course 25.8 h   pack 11.8 h        (workflow)
history +6.5 h   agriculture +4.4 h   education +3.8 h   AI +3.1 h   business +1.8 h
```

The second line is why an Akan encyclopedia is not an e-book with a different cover, and it is
carried into the ranking, the schedule, the break-even and the simulation rather than being said
once in a paragraph.

**Decay.** A product's monthly sales fall towards a floor rather than holding their launch month:

```
units(age) = visitors × conversion × [floor + (1 − floor)·decay^age] × (2.5 in the launch month)
```

The 15% decay and the 35% floor are defaults you can change. The shape is not a default.

**The funnel.** Each rate applies to the step above it, so the app raises each one by a tenth of
itself and reports what the total does. Rates compound downwards, which is why the free guide
usually beats the price of anything below it — but that is computed from your numbers, and your
numbers are allowed to disagree.

## What it deliberately doesn't do

- **It doesn't research the market.** Every demand and competition score is a judgement you typed.
  The app makes them explicit and weighs them consistently; it cannot make them true.
- **It ships no fee schedule.** Selar, Gumroad and Paystack appear with placeholder rates flagged
  **unverified** until you open their pricing pages and type what they say. Platform fees change,
  and any figure baked in would be wrong by the time you read it.
- **It has no exchange rate** and never fetches one. Type yours and prices appear in both
  currencies.
- **It doesn't publish anything.** No store, no processor, no mailing list, no network of any kind.
- **It doesn't write the product.** It writes the briefs that write the product, and it is explicit
  about which parts of the result a person still has to verify.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of any kind.
  Verified with a browser run asserting zero non-`file://` requests.
- **Everything is saved** to `localStorage` as you type. `⬇ Back up` downloads the lot as JSON,
  `⬆ Restore` reads it back, and `🗑 Clear` backs up first, then wipes. Storage failures (private
  mode, `file://` restrictions) degrade to in-memory with a warning rather than breaking the app.
- **A worked example** — a first year with four products committed, including one course — loads
  into every field with one button. It deliberately overflows the month, because that is the
  honest result and the app should not hide it.
- **Light and dark**, following your system setting, with a manual toggle.
- **Accessible.** Real form controls throughout, every input labelled, arrow-key tab navigation,
  visible focus rings, live-region toasts, and all animation disabled under `prefers-reduced-motion`.
  Re-rendering restores the caret, so typing in a field that drives a live calculation is not
  interrupted.
- **Responsive** to 390px with no horizontal page scroll on any tab; wide tables scroll inside
  their own containers.
- **Exports** as Markdown (the whole factory, ~37,000 characters at defaults), CSV (the product
  table, the month-by-month simulation) and JSON (a complete backup).

## Verification

722 assertions run in the page at load, and the count is reported in the footer — catalogue
consistency (no duplicate ids, every workflow step's agent resolvable, every category carrying at
least one check, every agent owning at least one step, all 84 agent briefs rendering without
leaking an `undefined` or an `[object Object]`) and the arithmetic against values worked out by
hand: fees capped at the price, net and break-even, the decay curve at both extremes and on its
floor, the steady-state formula against the simulation it describes, quadrupling upkeep shrinking
the catalogue, the funnel's compounding at five known steps, membership counted over its lifetime,
sensitivity never negative, no week overbooked, history costing more verification than business,
and a deliberately corrupt saved file being repaired rather than crashing the app.

Checked separately in headless Chromium: every tab at 390, 768 and 1280px with no horizontal page
scroll, the worked example, filtering, adding and deleting an idea, ticking steps, all seven briefs
rendering, live recalculation as fees and funnel rates are typed, the Markdown build, persistence
across a reload, dark mode, escaping of user text (an `<img onerror>` typed into an idea name
reaches the tables as text), and no external requests.

## What will go stale

The store list and the fee shapes, within a year or two. The workflow minutes will not, and neither
will the accuracy register: a model producing a confident regnal date it cannot source is not a bug
in a particular product, it is what a model does with a specific question and no source, and it
will still be true of whatever replaces the tools named here.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub Pages.
Served from this repo's root, the app lives at `/product-factory/`.
