# SEO & Content Marketing Systems

A single-file, offline mini app that answers the question keyword research tools leave to
you: not *how many people search this*, but *would writing it ever pay you back*.

Open `index.html` in any modern browser — no install, no build step, no accounts, no
internet connection, and no data ever leaves the device.

## Why this app exists

*The AI Income Blueprint* (`books/THE_AI_INCOME_BLUEPRINT.pdf`) is an organic-first book,
and search is the most obvious organic channel in it. Chapter 12 covers blogs as one of
three content formats; Chapter 6 sells blog writing as a service. Neither goes near the
mechanics — no keyword selection, no clustering, no internal linking, no structured data,
and above all no arithmetic about whether a content programme repays what it costs.

The `marketing-toolkit` app in this repo already has the sliver the book does support: a
five-criterion niche scorer and an article-brief generator, inside one sub-tab of its
Content Engine. This is the rest of it, at the depth `meta-ads` goes to on paid.

The gap matters because content marketing fails in a specific and predictable way. The
articles get written, they are perfectly good, and eighteen months later the traffic is
real and the revenue is not. Every input needed to see that coming is knowable on day one.
Almost nobody multiplies them together.

## What's in it

| Tab | What it does |
|---|---|
| 🧭 **Profile** | Two numbers do most of the work — site authority and cost per article. Everything else is generated from them |
| 🔑 **Keywords** | Your list, scored: the position you'd actually reach, the clicks that position yields on this SERP, what those clicks convert at *for that intent*, and whether it covers the article |
| 🕸 **Clusters** | Pillar-and-spoke map, a full internal link plan with anchor text, and a cannibalisation check that catches the two keywords that are really one page |
| ✍️ **Briefs** | Format, outline, length, schema and internal links per page — plus CLEAR-structured prompts and the 3-Pass Method, which is the part that *is* the book's |
| 🔧 **On-page** | A snippet preview measured in pixels rather than characters, JSON-LD in nine types, and a 15-step checklist with three gates |
| 🧮 **Numbers** | Cost and profit as two curves, when they cross, the traffic ramp, decay, a back-solver, and where the profit actually sits |
| 🔁 **Distribution** | Eight repurposing channels with prompts, a publishing schedule in dependency order, the monetisation ladder, and what the email list is worth |
| 🩺 **Diagnostics** | 20 symptoms → causes ranked by how often they're the answer → fix |
| 📄 **Plan** | The lot as one Markdown document, including the workings |

## The one number everything obeys

An article has to earn back what it cost. Written out:

```
volume × CTR(position) × SERP features × conversion(intent) × value per conversion
    must repay the article inside your payback horizon
```

Rearranged, that gives a **minimum viable search volume** — the direct analogue of a budget
floor, and the number that decides which keywords are worth writing.

The app computes it from your own figures and then flags every keyword below it. This
produces uncomfortable results on purpose. A new site at authority 20, selling a £47
product at 90% margin, paying £150 an article, converting at 2%:

| | |
|---|---|
| Position it reaches at difficulty 30 | **21.4** |
| Click-through there, after an AI answer takes its share | **0.25%** |
| Informational keywords need | **49,850 searches/month** |
| Commercial-investigation keywords need | **10,876** |
| Transactional keywords need | **5,982** |
| The same site at difficulty **10** instead | position **4.2**, needing **2,534** |

Two things in that table are the whole strategy. Dropping the difficulty from 30 to 10
moves the floor by a factor of twenty, because it moves you from page three to page one.
Changing the intent moves it by a factor of eight, because informational traffic converts
at a fraction of the rate the plan assumed. Neither is about writing better.

The app never hides the failure case. When nothing on your list clears the floor it says
so, prices the whole programme, and points at the three inputs that could move it — rather
than suggesting a cleverer keyword.

## The position model is the app's own

There is no published function mapping difficulty and authority to a position, because the
real answer depends on the specific ten pages you are trying to displace. This app uses a
logistic curve, states it on the tab where it is used, and shows the whole thing:

```
position = 1 + 60 / (1 + e^((authority − difficulty + 16) / 9))
```

| Authority − difficulty | Position |
|--:|--:|
| +30 | 1.4 |
| +20 | 2.1 |
| +10 | 4.2 |
| 0 | 9.7 |
| −10 | 21.4 |
| −20 | 37.6 |
| −30 | 50.5 |

It is centred so parity lands at the bottom of page one, and it is smooth on purpose. A
banded model makes a keyword at difficulty 39 look categorically different from one at 41,
and that difference isn't real.

The same honesty applies to everything else derived rather than measured. The priority
score weights forecast profit at 50, reachable position at 25, payback at 15 and intent at
10 — and a keyword missing volume or difficulty is scored on what is known rather than
penalised for what hasn't been looked up yet. The ramp curve is scaled by authority: at
authority 20 an article is at 49% of its eventual traffic after six months and 96% after
twelve; at authority 50 it is at 84% and 100%. Click-through rates by position are averages
from published studies that disagree with one another, which is why they are editable and
why the app treats them as an assumption.

## Cannibalisation, which is the check nobody runs until traffic drops

Two keywords with the same intent and heavily overlapping wording get answered by the same
page whatever you intended. Give them separate URLs and they compete: the two pages split
the links and the relevance signals, and neither ranks as well as one page would have.

The test is a Jaccard overlap of the meaningful word stems, at or above 0.5. The stemmer is
deliberately crude — it strips the handful of suffixes that turn a word into another form
of itself, and nothing more. Over-stemming would collapse words that genuinely differ, and
a false *these are the same page* is worse than a missed one, because it tells you to merge
two pages that shouldn't be.

Without stemming the check misses the most obvious duplicate there is. `clay soil
improvement` and `how to improve clay soil` share no literal words beyond "clay" and
"soil"; with it they score 1.00, and the app names which of the two to keep — the one
forecasting more profit — and tells you to cover the other as a section inside it.

## The pixel measurement is real

Titles and descriptions are truncated by pixel width, not character count. A 60-character
title full of capitals and Ws is cut off; a 65-character one full of thin letters is not.

The On-page tab measures the actual rendered width in the browser as you type, and shows
the truncation point in a rendered snippet with the cut portion greyed out. Both budgets
are editable fields rather than constants, because the day they change this app will not
know.

## Everything the app generates is checked

The JSON-LD is parsed as JSON and asserted to carry the right `@type` and `@context` in all
nine types, with the `HowTo` steps and `FAQPage` question pairs checked against their
inputs. Placeholders that must be replaced by hand are emitted in capitals rather than
omitted, because a required property that is silently missing is harder to notice than one
shouting at you.

The whole app is driven in a real browser on every change: 156 assertions covering the
arithmetic against independent recomputation, sorting, filtering, cannibalisation, the
forecast's monotonicity and its response to each input, schema validity, persistence,
restore, theming, the print stylesheet, keyboard tab navigation, control labelling, and no
horizontal page scroll at 390px on all nine tabs. Zero non-`file://` requests and zero
console errors are assertions, not aspirations.

## Provenance

| | Where it's from |
|---|---|
| CLEAR Formula — Context, Length, Examples, Audience, Role | Chapter 5 |
| 3-Pass Method — draft, then accuracy and depth, then voice | Chapter 5 |
| Monetisation stacking, cross-format repurposing | Chapter 12 |
| Search intent, click-through by position, clustering, internal linking, structured data, indexability | Established search mechanics, not the book |
| Position model, priority score, ramp curve, decay model, cannibalisation test, volume floor | **This app's own.** Each says so where it appears |

Earnings figures in the book are ranges based on observed outcomes rather than guarantees.
The same is true of every figure here, with the additional caveat that these are arithmetic
on numbers you typed in.

## What will go stale

Search interfaces change constantly and the labels drift faster than the mechanics. So:
click-through rates are editable rather than constant, pixel budgets are fields rather than
numbers in the source, SERP-feature effects are stated as multipliers you can change, and
the app's footer says to check anything that matters against your own Search Console data
rather than trusting any document — including itself.

The effect of an AI-generated answer on organic clicks is the most volatile figure in here.
Published estimates for it range from barely-anything to catastrophic and change every few
months. The app ships a middling multiplier, says exactly that next to it, and lets you
move it.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of
  any kind. Verified by a browser run asserting zero non-`file://` requests, and by a
  static check that the only absolute URLs in the file are the SVG namespace and the
  JSON-LD `@context` — identifiers that are never fetched.
- **Everything is saved** to `localStorage` as you type. `⬇ Back up` downloads the lot as
  JSON, `⬆ Restore` reads it back, and `🗑 Clear` backs up first, then wipes. A backup from
  an older build merges over current defaults rather than leaving keys undefined. Storage
  failures (private mode, `file://` restrictions) degrade to in-memory with a warning
  rather than breaking the app.
- **Light and dark**, following your system setting, with a manual toggle.
- **Accessible.** Real form controls throughout, every control labelled, arrow-key tab
  navigation with Home and End, visible focus rings, live-region toasts, and all animation
  disabled under `prefers-reduced-motion`.
- **Responsive** down to 390px with no horizontal page scroll — wide tables scroll inside
  their own containers. On narrow screens the top bar scrolls away and only the tabs stay
  pinned, because a wrapped header plus tabs would eat a quarter of the viewport.
- **Printable.** The brief and the plan drop the interface when printed.
- **Exports** where something has to leave: CSV for the keyword table with all its
  workings, Markdown for the brief, the cluster map, the schedule and the whole plan.
- **No API keys, no accounts, no data feed.** The app has no field for a key and asks for
  no login. Volume and difficulty come from whichever research tool you already use, and
  the app says so rather than pretending to have data it does not have.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub
Pages. Served from this repo's root, the app lives at `/seo-content/`.
