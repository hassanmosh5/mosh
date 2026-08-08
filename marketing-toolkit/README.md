# The Digital Marketing Toolkits

Eight single-file, offline tools that turn Chapter 8 of *The AI Income Blueprint* — AI-Powered
Social Media Management — into something you can actually run a client on, plus Chapter 12's
three content formats and Chapter 5's prompt formula.

Open `index.html` in any modern browser. No install, no build step, no accounts, no internet
connection, and no data ever leaves the device.

## Why this app

Chapter 8 is the most operational chapter in the book. It contains a scoring method for finding
prospects, five outreach scripts, an eight-step production workflow with real time estimates,
six priced packages, three retention behaviours and four pitfalls — and all of it arrives as
prose you have to re-read every time you need it.

That is a set of tools written down as a chapter. This is the same set of tools as tools.

The launch-kit app in this repo covers *which* income stream to pick and the 30-day plan to
start it. The prompt-generator covers turning the wealth-ideas matrix into sellable prompt
packs. This one covers the month-to-month work of the marketing service itself: finding the
client, winning them, delivering to them, and keeping them.

## What's in it

| Tab | Source | What it does |
|---|---|---|
| 🔍 **Prospect Audit** | Ch. 8, Methods 1–2 | Score businesses on the book's four gap signals; the list ranks itself. Generates the one-page Social Media Health Check for any prospect, ready to print |
| 📧 **Outreach** | Ch. 8 scripts | All five scripts with merge fields filled from the prospect you picked, unfilled placeholders highlighted, plus a pipeline that flags who is due a 5-day follow-up |
| 🗓 **Calendar** | Ch. 8, Retention Factor 1 | A real month grid: platform per slot, content type, pillar, and a caption brief per post. Markdown, CSV and print output for the approval meeting |
| ✍️ **Caption Studio** | Ch. 5 × Ch. 8 | The CLEAR formula with each platform's own rules, cadence and hashtag conventions built into the prompt. Plus a hashtag research prompt and a saved-prompt library |
| 💼 **Packages** | Ch. 8 pricing | The six packages, an effective-hourly calculator against the workflow's own time estimates, income projections, and a proposal built from the discovery-call close |
| 📊 **Reports** | Ch. 8, Retention Factors 2–3 | Enter this month against last month; it finds the biggest improvement, states it as a business outcome rather than a statistic, and carries the figures forward next month |
| 📡 **Content Engine** | Ch. 12 | Newsletter issue builder + monetisation ladder, SEO niche scorer + article brief, faceless-YouTube niche check + video brief. Each with the chapter's workflow and prompts |
| 📖 **Playbooks** | Ch. 8 reference | Platform deep dives, retention factors, tech stack, milestones, the two scaling paths, Mindset Shift #8 and the Jerome Williams case study |

## The scoring

The four signals are the book's, verbatim from Method 1 — last post date, posting consistency,
content quality, engagement rate — along with its thresholds: more than two weeks since the last
post is an opportunity, and engagement below 1% is an opportunity.

The **arithmetic that turns four signals into one 0–100 score is this app's, not the book's.**
The book says "select the 10 businesses with the most obvious gaps"; it does not weight them.
Each signal contributes its severity out of its own maximum, and only signals you have actually
checked are counted — so a half-researched prospect is scored on what you know rather than
penalised for what you haven't looked at yet.

Sorted by score, the top ten are highlighted. That is the book's Part A target.

## What the app adds, and where

Everything quoted — packages, rates, workflow times, income stages, RPM bands, the newsletter
ladder, the platform pro tips, all five scripts — is the book's. Four things are the app's own,
and each says so where it appears:

- **The content-mix weights** (40/20/20/20). The book names the four categories — educational,
  promotional, community-building, behind-the-scenes — but never gives a split. The sliders
  start there and are meant to be moved. The calendar deals from an exact bag, so the delivered
  month matches the ratio you set rather than averaging towards it.
- **The opportunity score**, as above.
- **The pipeline stages.** The book names the discovery call as the milestone; the six stages
  around it are the app's.
- **The cadences for LinkedIn, Facebook and short-form video.** The book gives an explicit
  cadence for Instagram (4–7 times per week) and Google Business Profile (weekly) only. The
  other three are derived from the post volumes in the package table, and each platform's
  playbook entry says which it is.

## The report

Pitfall 3 in the chapter is measuring vanity metrics: "Not *you gained 80 followers* but
*80 new local people are now seeing your content every time you post*."

Every line the report writes is translated that way, and the headline is chosen automatically —
whichever metric improved most, stated in business terms, because business owners do not read
detailed analytics and remember one number instead. A metric that fell more than 5% is named
too, in its own section: a report that only ever contains good news stops being believed.

Save a report and next month's "carry forward" moves this month's figures into the previous
column, so the comparison is already made before you start typing.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of any
  kind. Verified with a browser run asserting zero non-`file://` requests.
- **Everything is saved** to `localStorage` as you go — prospects, pipeline, calendars, saved
  prompts, reports, milestones and theme. `⬇ Back up` downloads the lot as JSON; `🗑 Clear`
  backs up first, then wipes. Storage failures (private mode, `file://` restrictions) degrade
  to in-memory with a warning rather than breaking.
- **Light and dark**, following your system setting, with a manual toggle.
- **Accessible.** Real form controls throughout, `fieldset`/`legend` on the CLEAR fields,
  arrow-key tab navigation, visible focus rings, live-region toasts, and all animation disabled
  under `prefers-reduced-motion`.
- **Printable.** The audit, the calendar, the proposal and the report all have print styles that
  drop the interface — which is how you get the one-page PDF Method 2 depends on.
- **Exports** where a client needs a file: CSV for the prospect list and the calendar, Markdown
  for the calendar and the prompt library.
- The rates, package prices and income figures are the book's, and as its own disclaimer notes,
  they are ranges based on observed outcomes — not guarantees of results.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub Pages.
Served from this repo's root, the app lives at `/marketing-toolkit/`.
