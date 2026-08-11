# E-Commerce Order Automation

A single-file, offline mini app that costs an order desk minute by minute, ranks every
automation by how fast it pays for itself, turns exception handling into arithmetic instead
of mood, and exports the runbook you would hand to whoever runs the desk on the day you
don't.

Open `index.html` in any modern browser — no install, no build step, no accounts, no
internet connection, and no data ever leaves the device.

## Why this app exists

*The AI Income Blueprint* (`books/THE_AI_INCOME_BLUEPRINT.pdf`) is thorough about getting a
store to the point of taking orders, and silent about what happens next. Chapter 7 covers
products, validation, listings and pricing. Chapter 9 teaches you to audit *somebody else's*
business for automation opportunities and sell them a kit. Chapter 15 says the first $1,000
month is a problem of action and the first $5,000 month is a problem of systems.

Nowhere does it point that audit at your own order desk.

That gap matters, because the order desk is the part of a store that scales worst. A listing
is written once. An order is processed every single time, and the minutes are invisible: no
one invoices you for reading the order, checking the payment, picking, packing, buying
postage, answering "where is it?", or reconciling the payout. At the app's default figures a
store doing 600 orders a month spends **159 hours** on those minutes — and its 45% gross
margin has 74% of it eaten before anything reaches the owner.

| From the book | Where it lands |
|---|---|
| Ch. 9 — the Business Efficiency Audit and the automation templates | The Automations tab, pointed inwards instead of at a client |
| Ch. 9 — the ROI arithmetic behind an automation proposal | Payback weeks, break-even volume, and the build-plan cash table |
| Ch. 15 — systems as the constraint above $5k/month | The build plan's sequencing, and the runbook that makes a step handable |
| Ch. 7 — platform choice and fee structures | Deliberately *not* repeated: that is the [`ecommerce-setup/`](../ecommerce-setup/) app's job |

Everything else — pipeline minute models, exception frequencies, deflection rates, capacity
arithmetic, the returns economics — is order-desk operations craft the book does not cover,
and the app says so in its own footer.

## What's in it

| Tab | What it does |
|---|---|
| 🧾 **Order desk** | The pipeline as thirteen editable steps with minutes and coverage, reseeded per fulfilment model, ending in one number: what survives of an order's contribution after processing |
| 🤖 **Automations** | Eighteen real order-desk automations, each ranked by payback on top of whatever you already have on. Two of them save nothing and say so |
| 🛠 **Build plan** | The queue sequenced by payback and prerequisite, against the hours you actually have, with the month-by-month cash line |
| 🚨 **Exceptions** | Eleven things that go wrong, costed in both minutes and money, with a claim threshold that decides the small ones for you |
| ✉️ **Messages** | A ten-message post-purchase sequence with compounding WISMO deflection, full templates, and the deflection landing back on the pipeline |
| ⏱ **Capacity & SLA** | Whether your dispatch promise survives the minutes between the cut-off and the courier, on an average day and on a peak one |
| 🔁 **Returns** | What a return actually costs, component by component, and the value below which asking for the item back is a loss you chose |
| 🩺 **Audit** | Fifteen checks read from your own numbers, ranked by what they cost a month, each naming the tab it came from |
| 📄 **Runbook** | The lot as one Markdown document, plus the automation library as CSV |

## The number nobody counts

A finished order is not the price minus the cost of goods. It is the price, minus the goods,
minus every minute somebody spent making it happen, minus the ones that went wrong, minus the
ones that came back:

```
handling per order  =  Σ (step minutes × share of orders it touches) ÷ 60 × the hour it costs
exceptions          =  Σ (frequency × orders) × (minutes + direct loss)
returns             =  return rate × (postage + labour + unrecovered stock + fees)

left over           =  order value × margin − handling − exceptions − returns − tools
```

At the defaults that is **$9.27 of handling** against **$18.90 of contribution**, before a
single thing has gone wrong. The app is uncomfortable on purpose, in the same way a
production estimate is: the discomfort is the information.

## Payback, measured honestly

Every automation is scored by what it is worth *on top of what is already turned on*, not in
isolation:

```
payback weeks  =  build hours ÷ (hours saved per month ÷ 4.33)
```

Two automations that cut the same step do not each save it, so switching one on re-ranks
everything else — a self-serve tracking page is worth a great deal until you turn it on, at
which point the WISMO auto-reply behind it is worth much less. The library re-sorts itself
every time.

Anything with a subscription is also scanned for the volume at which it starts paying:

```
break-even volume  =  the monthly order count at which the saving covers the tool's fee
```

Below that volume the app says so plainly rather than showing a green number. Two entries —
SLA escalation routing and replenishment reminders — score zero and stay in the library
anyway, because pretending they do not exist is worse than admitting one changes *when you
find out* and the other is a revenue automation this app does not model.

## The threshold that decides small claims

Investigating a claim costs a known amount. Not investigating costs a known amount too — the
extra claims you get when nobody is checking. They cross:

```
threshold  =  (minutes to investigate ÷ 60 × your hourly) ÷ extra claim rate
```

At the defaults that is **$29.17**, which for a $42 average order means *ask*. Drop the
average order to $25 and the same arithmetic says stop asking. The app resolves the rule
against your own numbers and tells you which side you are on, per exception type, and it
flags the case where you have written an auto-resolve policy but have not built anything to
execute it.

The extra-claim rate is the one figure here nobody can look up — it is stated as a
placeholder, on the tab, next to the number it produces.

## Returns get the same treatment

```
refund without the return below  =  (inbound postage + handling labour) ÷ (resellable % × cost share)
```

Below that value the parcel costs more to take back than the item is worth once it is back on
the shelf. The app also refuses to be glib about it: some items you are obliged to accept
back, and a returnless refund on a resellable item is stock you have thrown away, so the rule
is offered per product rather than as a blanket policy.

## A dispatch promise is arithmetic or it is a lie

"Order by 2pm for same-day dispatch" is a claim about the minutes between your cut-off and
your courier. The Capacity tab counts the orders arriving before the cut-off, multiplies by
the fulfilment minutes left after automation, divides by the people on the bench, and
compares. At the defaults it is **short by 32 minutes**, and the app names the latest cut-off
that would hold — flagged as a conservative bound, because moving the cut-off earlier also
moves orders out of the same-day bucket.

Then it does the peak day, because a promise that only survives an average Tuesday is not a
promise.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of any
  kind. Verified with a browser run asserting zero non-`file://` requests.
- **Everything is saved** to `localStorage` as you type. `⬇ Back up` downloads the lot as
  JSON, `⬆ Restore` reads it back, and `🗑 Clear` backs up first, then wipes. A restored or
  hand-edited file is repaired on load: missing ids are generated, invalid enums fall back to
  valid ones, percentages are clamped, negative build hours become zero and an impossible
  clock time reverts. Storage failures (private mode, `file://` restrictions) degrade to
  in-memory with a warning rather than breaking the app.
- **Light and dark**, following your system setting, with a manual toggle.
- **Accessible.** Real form controls throughout, `aria-label` on every field in a table row,
  arrow-key tab navigation with Home/End, visible focus rings, live-region toasts, and all
  animation disabled under `prefers-reduced-motion`. Typing in a rate field never rebuilds the
  table under your cursor.
- **Responsive** down to 390px with no horizontal page scroll; wide tables scroll inside their
  own containers.
- **Printable.** The runbook has print styles that drop the interface.
- **Verified in a real browser.** 118 assertions run against the file in headless Chromium:
  the arithmetic (pipeline minutes, payback, break-even, deflection compounding, exception
  loss, capacity windows, returns thresholds), the audit rules firing *and* clearing, build-plan
  prerequisite ordering, the save/restore round trip and its repair of sixteen kinds of damage,
  escaping of user text into every rendered surface, focus retention while typing, and no
  horizontal overflow at 390, 768 and 1280px across all nine tabs.

## What will go stale

Every frequency, minute figure, deflection rate and cost in this app is a **planning default
with a wide range**, not a benchmark for your store. Exception rates in particular vary more
by category and country than any single number can carry, which is why each one is an input
with the app's default sitting in it rather than a fact printed on the page. Replace them with
a month of your own tickets and every tab recalculates.

Tool subscription prices move constantly, so they are editable per automation with the
default visible. Nothing here forecasts sales, and no automation in the library raises
revenue: they remove minutes and losses from orders you already have.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub
Pages. Served from this repo's root, the app lives at `/order-automation/`.
