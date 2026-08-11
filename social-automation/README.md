# Social Media Content Automation

A single-file, offline mini app that reconciles the three numbers a content
plan is usually allowed to contradict: what you promised to post, what your
source material can actually yield, and how many hours you have.

Open `index.html` in any modern browser — no install, no build step, no accounts, no
internet connection, and no data ever leaves the device.

## Why this app exists

Chapter 8 of *The AI Income Blueprint* (`books/THE_AI_INCOME_BLUEPRINT.pdf`) covers
social media management as a service — prospecting, outreach, packages, retention. The
[`marketing-toolkit`](../marketing-toolkit/) app in this repo already builds that: finding
the client, winning them, delivering to them, keeping them. Chapter 12 covers content at
scale, and [`youtube-toolkit`](../youtube-toolkit/) builds that for one platform.

Neither of them, and neither chapter, goes near the part that actually breaks: the
production system. A calendar gets built, the calendar is perfectly reasonable, and by
week three it is half empty — not because anyone lost interest, but because the plan was
arithmetically impossible on the day it was written and nothing in the process was
capable of noticing.

Every input needed to see that coming is knowable before the first post. Almost nobody
multiplies them together.

## What's in it

| Tab | What it does |
|---|---|
| ⚙️ **Setup** | Sources, platforms, formats, cadence, pillars and the production model. The three ceilings compute live at the top |
| ♻️ **Atomise** | One source asset → every derivative it can yield, split by whether you cut it, adapt it, or make it from nothing. Each with its extraction instruction and a CLEAR-structured prompt |
| 📅 **Queue** | Cadence as dated slots, pillars assigned to hit your target mix, formats flagged where the schedule outruns the yield |
| 🏭 **Batch day** | Seven production steps costed, before and after automation, laid out as a run sheet with clock times and breaks |
| 🔌 **Wiring** | 15 automation recipes priced by payback against *your* volume, in build order — plus the eight things this app refuses to help you automate |
| 📐 **Specs** | Canvas, length, caption limit, fold point, hashtag convention and link behaviour for 22 formats across 9 platforms |
| 🩺 **Diagnostics** | 22 patterns tested against your own configuration; the ones that match are flagged and sorted to the top |
| 📄 **Plan** | The lot as one Markdown document, including the workings |

## The rule the whole thing rests on

**Cadence is a promise. Supply and capacity are facts.**

Three ceilings, and the smallest one is your real posting rate:

| Ceiling | What it is |
|---|---|
| **Cadence** | Posts per week × formats. The only one of the three you control by typing |
| **Supply** | Source assets × what each yields into the formats you actually run |
| **Capacity** | Your hours, against what those posts cost to produce |

The app names which one is binding and by how much. A plan whose cadence exceeds its
binding ceiling is not ambitious — it is a schedule of posts that will be published late,
published thin, or not published.

## Cut, adapt, make

The distinction the Atomise tab rests on, and the reason repurposing plans look cheap and
turn out not to be:

| Mode | What it means | Cost |
|---|---|---|
| **Cut** | The derivative already exists inside the source. You are choosing an in-point and an out-point | 0.55× |
| **Adapt** | The substance exists, the artefact does not. You are rewriting or re-laying-out | 1× |
| **Make** | Nothing exists. You are producing something new and calling it repurposing because it shares a topic | 1.7× |

This is why the source type matters more than the platform list. A long-form video yields
36 assets across 21 formats, and 23 of those assets are cuts. The same topic as a blog post
yields 25 assets across 15 formats — and every video format among them is a **make**, three
unfilmed videos sitting on a calendar, which is exactly how a content plan quietly dies.
Nine source types are modelled, each with its own
yield map, its own capture cost, and the three prep steps that decide whether atomising it
takes twenty minutes or an afternoon.

## Review cannot be automated to zero

Each of the seven production steps carries a **floor** — the share that cannot be
automated away however many recipes you switch on. Extract has a floor of 15%, schedule
10%, produce 45%. Review's floor is **1.00**, and no configuration this app permits can
move it. Engage is 0.90: triage can be automated, answering cannot.

The approval gate is on the recipe board with a payback of *never*. It saves zero minutes,
takes about 50 minutes to build, and is the most valuable thing on the board — the failure
it prevents is not clumsy prose but a confident false statement published under your name
at scale. If drafting or publishing is switched on and the gate is not, the app raises a
blocking diagnostic.

There is also a list of eight things the app will not help you build at all — auto-DMs,
auto-comments, engagement pods, follow/unfollow, DM scraping, unattended publishing —
each with what it actually costs and what to do instead.

## Payback is computed against your volume, not in general

Every recipe declares minutes saved, the step it saves them on, and a basis: per post, per
source asset, or flat per month. Monthly saving is that figure times the volume *your*
configuration produces, which is why the same recipe pays back in eight days for one person
and never for another. The build order is simply setup ÷ monthly saving, sorted ascending,
and it re-sorts as you change anything.

Savings are then capped by the step floors, so a stack of recipes all targeting the same
step cannot sum to more than that step can give up. The app says when a recipe has been
capped and by which floor.

## Everything is arithmetic on what you typed

No forecasting, no benchmark data, no growth model. Given a cadence and a source mix the
app will tell you the plan needs 48 hours a month and you have 52 — that is what its own
default configuration works out to. It will not tell you whether anyone will watch.

A few figures are the app's own assumptions rather than facts, and each says so where it
appears:

- **The batching curve** — `1 − saving × (1 − 1/n)`, defaulting to 35% at scale, applied
  to extract, produce, write and schedule but never to review, replies or capture.
- **Mode multipliers**, production minutes per format, and recipe savings — estimates from
  the shape of the work. Replace them with your own after one batch and everything
  downstream gets better.
- **The offer ceiling** at 20% of published output. The only editorial opinion in the
  arithmetic, and labelled as a judgement where it is enforced.
- **Format floors** — the weekly rate below which a format does not repay its setup. Used
  to raise a diagnostic, never to compute.

A month is `365.25 / 7 / 12` = 4.348 weeks, not four. At a 40-post month that difference
is three posts.

## Verified in a browser

76 checks run against the built file in headless Chromium — zero non-`file://` requests,
zero console errors, every tab rendering at 390 / 768 / 1440 px with no horizontal page
scroll, every control labelled, arrow-key tab navigation, and state surviving a reload.

The engine is asserted rather than assumed: review is unautomatable at every recipe
combination, no step falls below its floor, switching every recipe on never *increases*
total time, the binding ceiling is genuinely the minimum of the three, pillar assignment
lands within one post of the target mix at 5 / 17 / 40 / 100 / 231 slots, the queue only
ever lands on permitted days, and an empty configuration produces no `NaN` anywhere. A
deliberately hostile backup — negative rates, unknown format ids, a string where a number
belongs, no posting days at all — is repaired rather than fatal.

## What will go stale

The specification table. Caption limits, video durations and slide counts move without
notice, and this page makes no network requests, so it cannot check and will never know.
Rows that have moved before are marked **spec moves**, the table prints the date a human
last looked, and there is a one-click re-check list covering the enabled formats you build
templates against.

The tools named in the recipes will churn too, which is why every recipe is written as a
trigger and a sequence of steps rather than as one vendor's screens.

The arithmetic will not go stale. Supply, capacity and cadence have to agree or the
smallest one wins; cut costs less than adapt costs less than make; review cannot be
automated to zero. None of those are platform settings.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of
  any kind — asserted by a browser run, not assumed.
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
- **Exports** as CSV and tab-separated text for the queue and the spec table, and Markdown
  for briefs and the full plan. The Plan tab prints with the interface dropped.

## What comes from the book

| | |
|---|---|
| CLEAR Formula — Context, Length, Examples, Audience, Role | Chapter 5 |
| 3-Pass Method — draft, then accuracy and depth, then voice | Chapter 5 |
| Batch-planning a month of content; cross-format repurposing | Chapters 8 and 12 |
| Three ceilings, cut/adapt/make, step floors, the batching curve, payback arithmetic, the specification table, the 22 diagnostics | **This app's own.** Each says so where it appears |

Earnings figures in the book are ranges based on observed outcomes rather than guarantees.
The same is true of every figure here, with the additional caveat that these are arithmetic
on numbers you typed in.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub
Pages. Served from this repo's root, the app lives at `/social-automation/`.
