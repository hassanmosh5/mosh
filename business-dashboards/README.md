# Business Dashboard Templates

A single-file, offline mini app that turns a handful of figures you can find in
ten minutes into a working business dashboard — with the formulas, the sources, and a
spreadsheet you can rebuild the whole thing in when you outgrow this page.

Open `index.html` in any modern browser — no install, no build step, no accounts, no
internet connection, and no data ever leaves the device.

## Why this app exists

The other apps in this repo help you *start* something: a launch, an ad account, a set of
SOPs, a product to sell. None of them tell you whether the thing is working.

That gap is the usual one. A business gets run on the bank balance and a feeling, because
the alternative looks like a bookkeeping project. So this app takes the opposite approach
from most dashboard advice: instead of listing every metric that exists, it starts from
the smallest set of figures a person will realistically write down each week, and derives
everything it possibly can from those.

| Income stream | The template it maps to |
|---|---|
| #2 Digital products, #5 Prompt packs | 💾 Digital products |
| #3 Social media management, #4 Local automation | 🧩 Agency & done-for-you services |
| #6 Coaching & consulting | 🎯 Coaching & consulting |
| #7 Content at scale | 🎬 Content & audience |
| Client work for shops and trades | 🛒 E-commerce, 📍 Local service |

Seven templates in all, plus 🔁 Subscription & membership. Each keeps 9–13 figures and
computes 19–26 metrics from them; a metric appears only when every figure it needs is one
the model tracks, which is what makes switching model rebuild the entire dashboard rather
than relabel it. Nothing in the app is book content — it is business arithmetic, and it
says so in its own footer.

## What's in it

| Tab | What it does |
|---|---|
| ⚙️ **Setup** | Pick a model; it decides the figures, the metrics, the targets and the rhythm |
| 📊 **Dashboard** | Every metric as a tile: value, change on last period, status against target, and a sparkline drawn from your own history |
| 🧾 **Data** | One row per period, one column per figure — the only typing the app asks for |
| 📚 **Metric library** | All 38 metrics: definition, formula, target, and the way each one misleads people |
| 🔌 **Where numbers come from** | Per figure: the exact menu path in Stripe, Shopify, GA4, Xero and the rest, how long it takes, and the definition trap |
| 📐 **Spreadsheet build** | The same dashboard as a sheet you own — column layout, working formulas, conditional formatting, your data ready to paste |
| 🗓 **Review rhythm** | Daily, weekly, monthly and quarterly — each line paired with the decision it exists to trigger |
| 🩺 **Diagnostics** | 20 cross-metric patterns; the ones your own figures currently match are flagged and sorted to the top |
| 📄 **Spec** | The lot as one Markdown document |

## The rule the whole thing rests on

**A blank cell is not a zero.** Blank means you don't know; zero means it genuinely was
zero. Every metric that needs a figure you left blank shows a dash rather than a number.

This sounds pedantic until you see what the alternative does. Leave direct costs blank and
the naive formula reports a **100% gross margin** — a number that is both wrong and
extremely encouraging. Then payback, lifetime value and LTV:CAC are all computed from it,
and the dashboard says to spend more on ads.

So `needs` is declared on every metric, and nothing computes until all of it is present.
Ad spend is the single deliberate exception: it is excluded from `needs`, because a
business that runs no ads leaves that column blank and genuinely means zero.

## The spreadsheet output is verified against the app

The Spreadsheet tab generates real formulas with real cell references for the exact
column layout it shows you — not a template with placeholders to fill in.

Those formulas are checked rather than trusted. Every one is evaluated against the same
figures the dashboard used, and the results must match cell for cell: **936 cells across
the seven sample datasets, and 6,552 more across adversarial data** built from blanks,
zeros, negatives and seven-figure values, in every combination the generator could reach.

That check found real bugs, all of them in the direction of a spreadsheet being cheerfully
wrong where the app refuses to answer:

- A spreadsheet treats a blank cell as zero, so every generated formula carries an
  `ISBLANK` guard built from the metric's own `needs` list. Without it the sheet reports
  that 100% margin while this page shows a dash.
- Churn with no clients at the start of the period, days-to-get-paid on negative revenue,
  payback on an order that makes no gross profit — the sheet returned numbers for all of
  them. Each now has the same guard the app applies.
- "Weeks per month" written as `4.3482` disagreed with the app in the sixth digit, so the
  Settings cell holds `=365.25/7/12` instead. Exact, and it shows its working.

## Targets are a starting line, not a benchmark

Each metric carries a conventional default target, adjusted per model — 45% gross margin
for e-commerce, 85% for digital products, 5% monthly churn for subscriptions. They set the
colour on every tile and every conditional-formatting rule.

They are all editable, and they are meant to be edited. A default target is a claim about
businesses in general, which is a category your business is not in. The app says this
where you set them rather than in a footnote.

## Everything is arithmetic on what you typed

There is no forecasting anywhere in this app, and no benchmark data hidden in it. Given
six weeks of figures it will tell you your effective hourly rate; it will not tell you what
it should be. The diagnostics flag *patterns across metrics* — revenue rising while cash
falls, margin drifting down, traffic up with orders flat — and each one says what to check
rather than what is wrong, because arithmetic can see the shape of a problem and not its
cause.

The trend deadband is 3% across a six-period window, so rounding noise doesn't get reported
as a direction. Metrics that are already percentages report their change in **percentage
points**, because a growth rate moving from 2.9% to −1.4% is a 4.3-point fall, not the
"148% decline" the relative calculation gives.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of
  any kind. Verified with a browser run asserting zero non-`file://` requests.
- **Everything is saved** to `localStorage` as you type. `⬇ Back up` downloads the lot as
  JSON, `⬆ Restore` reads it back, and `🗑 Clear` backs up first, then wipes. Storage
  failures (private mode, `file://` restrictions) degrade to in-memory with a warning
  rather than breaking the app.
- **Light and dark**, following your system setting, with a manual toggle.
- **Accessible.** Real form controls throughout, every input labelled, arrow-key tab
  navigation, visible focus rings, live-region toasts, and all animation disabled under
  `prefers-reduced-motion`.
- **Responsive** to 390px with no horizontal page scroll on any tab; wide tables scroll
  inside their own containers, and the sticky tab bar measures the masthead rather than
  assuming its height.
- **Printable.** The spec has print styles that drop the interface.
- **Exports** as CSV (figures alone, or figures with every computed metric), tab-separated
  text for pasting into a sheet, and Markdown for the full specification.

## What will go stale

The menu paths. Stripe, Shopify, GA4 and the rest rearrange their reporting screens
constantly, so every source in the app is written as a path *and* a description of what
you are looking for — the label moves, the figure doesn't.

The arithmetic will not go stale. Gross margin has been revenue minus direct costs over
revenue for a very long time, and the default targets are stated as conventional ranges
rather than current benchmarks precisely so they don't need a maintenance schedule.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub
Pages. Served from this repo's root, the app lives at `/business-dashboards/`.
