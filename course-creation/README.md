# Course Creation Systems

A single-file, offline mini app that turns a course idea into a build specification: a
curriculum designed backwards from a measurable outcome, time-boxed lesson scripts, an
honest production-hours estimate, the pricing and platform arithmetic, a drop-off audit and
a launch schedule.

Open `index.html` in any modern browser — no install, no build step, no accounts, no
internet connection, and no data ever leaves the device.

## Why this app exists

*The AI Income Blueprint* (`books/THE_AI_INCOME_BLUEPRINT.pdf`) names courses twice and
stops. Chapter 7 lists them among eight digital product types; Chapter 11 has a self-paced
track as one of three coaching programme structures. Neither chapter says how a course is
actually built, because that is not what those chapters are about.

That gap is worth filling, because a course is the most expensive digital product in the
book. A prompt pack is an afternoon. A course is a hundred hours, and almost nobody works
that out before starting — which is why so many are abandoned in module three.

So the app takes the three things the book *does* give and applies them to courses:

| From the book | Where it lands |
|---|---|
| Ch. 7 — the 3 Criteria and the 30-Minute Validation Method | The validation gate, which sits in front of the production estimate |
| Ch. 11 — price the outcome, not the hour | The value anchor on the pricing tab |
| Ch. 14 — the 30-day launch plan | The launch schedule, counted backwards from your date |
| Ch. 5 — the CLEAR Formula and the 3-Pass Method | The scripting prompt on the lesson tab |

Everything else — effort ratios, beat structures, platform fee models, the drop-off checks
— is course-production craft, and the app says so in its own footer.

## What's in it

| Tab | What it does |
|---|---|
| 🎯 **Outcome** | The promise as one sentence, the economics, and a validation gate that stays shut until something has actually happened |
| 🧱 **Curriculum** | An outline builder that designs backwards from the proof, with five starting structures and a scope guard |
| 🎬 **Lesson design** | Any lesson split into time-boxed beats with word budgets, a script skeleton, and a CLEAR-formula scripting prompt |
| 🏭 **Production** | The hours. Effort ratios by production style, everything that is not recording, and whether it fits before your launch date |
| 💷 **Pricing** | Value anchor, sales needed, people needed, revenue per build hour, and a price sensitivity table |
| 🏗 **Platform** | Six hosting models with editable fees, net per sale, and the volume at which a monthly fee starts paying for itself |
| 🩺 **Drop-off audit** | Fourteen structural checks read from your own outline, ranked, each with the fix |
| 🚀 **Launch** | A schedule counted backwards from launch day, checked against the production estimate, plus waitlist maths |
| 📄 **Brief** | The lot as one Markdown document, and the outline as CSV |

## The number everybody gets wrong

A finished minute of course is not a minute of work. Scripted to camera it is roughly
twenty to sixty minutes once you count the script, the retakes and the edit; a screencast is
six to twenty. The app carries a ratio per production style, applies it to your outline, adds
the things that are not recording, and produces one number:

```
build hours  =  Σ (lesson minutes × ratio for its style) ÷ 60
              + contingency
              + fixed overheads (workbook, artwork, sales page, …)
              + per-runtime overheads (slides, captions)
```

Which turns into a date, against your stated weekly hours:

```
weeks  =  build hours ÷ hours per week
```

This produces uncomfortable results on purpose. The default outline is 2h 12m of finished
course — a small course by any standard — and it costs about **130 hours**, which is
**21 weeks at six hours a week**. Set a launch date four months out and the app says the
plan misses it by 88 days, on the tab where you can still do something about it.

Only about a third of that is recording. Most of it is the workbook, the sales page, the
captions, the platform setup and the beta round, which is exactly the part that gets left
out of the plan.

## Three levers, and no fourth

When the plan does not fit, the app names the only three things that change it: cut
runtime, find more hours, or move the date. Each one is quantified — how many minutes,
what weekly capacity, which date.

It also refuses to over-cut. Because fixed overheads do not shrink with runtime, deleting
the entire course sometimes still would not close the gap, and when that is true the app
says so rather than telling you to remove more course than you have.

## The ratios are defaults until you measure them

Every ratio is editable, and there is a calibration panel: record one real lesson, log the
wall-clock hours, and the app recomputes the whole plan on your measured figure. Until you
do, the production tab says in plain words that every number on it is a default.

## The validation gate

A course is the wrong place to find out nobody wanted it. Chapter 7's three criteria are
checkboxes, and there is a field for evidence — what actually happened, not what you
expect. Until all three are ticked and something real is written down, the production tab
opens with a red banner putting the build hours against the fact that nothing has been
validated. The drop-off audit ranks it as the most serious finding available, above every
structural problem, because it is.

Ticking boxes alone does not open the gate. The evidence field has to have something in it.

## The drop-off audit reads your outline, and predicts nothing

Fourteen structural checks, each pointing at something you typed: a first lesson too long
to finish in a sitting, a module with nothing to hand in, a course whose runtime is 80%
watching, a self-paced course with no deadline anywhere in it. Findings are ranked, each
carries what it costs and what to do, and the app names the lesson or module it came from.

There is no completion-rate score, because a completion rate cannot be computed from an
outline. A list of the places courses lose people is honest. A percentage would not be.

## Platform choice is arithmetic, not preference

Six hosting models — marketplace, checkout-and-delivery, two course-platform tiers,
membership, self-hosted — each with an editable take percentage, per-sale fee and monthly
fee. The app computes net per sale, net per month at your volume, and the break-even:
the monthly sales volume at which paying rent beats paying a percentage.

```
break-even volume  =  monthly fee ÷ (net per sale here − net per sale on the best free model)
```

The marketplace question gets the same treatment: at your price it shows the ratio between
selling it yourself and listing it, then asks whether you can find that many buyers. If you
have no audience, half of something beats all of nothing — and the app says that too.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of
  any kind. Verified with a browser run asserting zero non-`file://` requests.
- **Everything is saved** to `localStorage` as you type. `⬇ Back up` downloads the lot as
  JSON, `⬆ Restore` reads it back, and `🗑 Clear` backs up first, then wipes. A restored or
  hand-edited file is repaired on load: missing ids are generated, invalid enums fall back
  to valid ones, and non-numeric minutes become numbers. Storage failures (private mode,
  `file://` restrictions) degrade to in-memory with a warning rather than breaking the app.
- **Light and dark**, following your system setting, with a manual toggle.
- **Accessible.** Real form controls throughout, `fieldset`/`legend` on grouped fields,
  arrow-key tab navigation, visible focus rings, live-region toasts, and all animation
  disabled under `prefers-reduced-motion`.
- **Responsive** down to 390px with no horizontal page scroll; wide tables scroll inside
  their own containers.
- **Printable.** The brief has print styles that drop the interface.
- **Verified in a real browser.** 118 assertions run against the file in headless Chromium:
  the arithmetic (build hours, schedule, net per sale, platform break-even, beat clocks,
  waitlist chain), the audit rules firing and clearing, the save/restore round trip and its
  repair of damaged files, escaping of user text into every rendered surface, outline
  editing, and no horizontal overflow at 390, 768 and 1280px.

## What will go stale

Platform pricing moves constantly and card processing differs by country, so every fee is
an editable field with a stated default rather than a quote, and the app tells you to type
in the rate you were actually given. Price bands are bands, not prices — they scale with
market and currency; what does not scale is what a buyer expects at each level, which is
the column that matters.

Effort ratios are the widest ranges in the app because they vary most by person. That is
what the calibration panel is for. Nothing here forecasts sales: every figure is arithmetic
on numbers you supplied.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub
Pages. Served from this repo's root, the app lives at `/course-creation/`.
