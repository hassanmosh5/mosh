# The Faceless YouTube Toolkits

Six single-file, offline toolkits that turn Chapter 12 of *The AI Income Blueprint* —
Income Stream #7, Content Creation at Scale — into working tools for a faceless YouTube
channel.

Open `index.html` in any modern browser — no install, no build step, no accounts, no
internet connection, and no data ever leaves the device.

## Why this app

Chapter 12 is the book's longest income-stream chapter and the one that is hardest to act
on, because everything in it is a long game. It contains a niche test, a ten-step
production workflow with its prompts, a Shorts strategy, a five-layer monetisation stack,
a weekly schedule, and a month-by-month income curve — all of it as prose and tables you
read once and then have to remember for eighteen months.

These are those six things as tools. The niche test scores. The workflow fills in its own
prompts. The stack calculates. The schedule tracks. The income curve tells you which row
you are on today.

## What's in it

| Tab | Source | What it does |
|---|---|---|
| 🎯 **Niche Scorecard** | Ch. 12, Step 1 + the profitable niche formula | Scores a niche out of 21 across seven criteria, gives the RPM band and a verdict, flags each failing criterion with the chapter's own fix, and compares saved candidates side by side |
| 🎬 **Video Studio** | Ch. 12, Step 2 + Appendix C #31, #32 | The ten-step workflow as a checklist with times. Fill the brief once — niche, topic, audience, format, length, tone, CTA — and every prompt fills itself in. Copy each, or download the whole brief as Markdown |
| ✂️ **Shorts Engine** | Ch. 12, Step 3 + Appendix C #35 | 2–3 Shorts per long-form video: the excerpt-selection prompt, the cut-and-post checklist, and the book's repurposing prompt for everywhere else |
| 💰 **Monetisation Stack** | Ch. 12 | All five layers calculated — ads (locked until 1,000 subscribers), affiliates, sponsorships, products, memberships — against the chapter's rate guides, plus the patience graph with your month highlighted |
| 📅 **Weekly System** | Ch. 12 + Mindset Shift #12 | The Monday–Friday production system with time tallies, a publishing log, and progress bars toward the 50-asset and 24-week goals |
| 📖 **Playbook** | Ch. 12 | Format decision framework, RPM by niche, the tool stack, the five costly mistakes, the Aiko Tanaka case study, and Mindset Shift #12 |

## Prompt provenance

Every prompt in the app is labelled, because where it came from changes how much you
should trust it:

- <kbd>FROM THE BOOK</kbd> — quoted from the chapter's workflow table or Appendix C
  (prompts #31, #32 and #35), with only your fields substituted. Steps 1, 2, 4 and 9 of
  the production workflow are these.
- <kbd>BUILT FROM THE CHAPTER</kbd> — assembled here from an instruction the chapter gives
  in prose but never writes out as a prompt. The thumbnail prompt (Step 8) and the Shorts
  excerpt prompt are these; the chapter says to use AI to design thumbnails and to
  identify the strongest thirty-second excerpt, but does not supply the wording.
- <kbd>MANUAL</kbd> — the steps the book insists you do yourself. Fact verification
  (Step 3) is "non-negotiable for credibility and accuracy", and script refinement
  (Step 5) is Pass 2 of the 3-Pass Method, where your expertise elevates a generic script.

## The scorecard

Chapter 12 gives four criteria for a strong YouTube niche — high advertiser value,
search-driven rather than trend-driven, deep enough for 100+ videos, and domain expertise
as the differentiator. The chapter's action step then applies the profitable niche formula
from the blog section — buyers exist, affiliate programmes exist, search competition is
manageable — to whichever format you chose.

The scorecard runs all seven, three points each, for a score out of 21. Niche specificity
is scored separately and folded into the verdict rather than the total, because it is not
a pass/fail criterion — it is the lesson of the case study, and the app says so where it
matters.

Advertiser value is not self-assessed. Pick your category and the RPM band comes from the
chapter: personal finance $15–$30, business and investing $12–$25, software and technology
$10–$20, health and wellness $8–$15. General interest, gaming and entertainment sit at
$2–$5 — the trap the chapter names explicitly, since a personal finance channel with
10,000 subscribers earns 3–5× an entertainment channel the same size.

## The numbers

Every figure in the app is the book's:

- **Workflow times** sum to 180 minutes, the midpoint of the chapter's 2.5–4 hours per
  video. The weekly system sums to 3h 50m, inside its 3.5–5 hour range.
- **Script length** scales with the video: 1,200 words at 8 minutes, 1,400 at 10, 1,800 at
  12 — the chapter's 1,200–1,800 words for an 8–12 minute video, with Appendix C's
  10-minute/1,400-word pairing as the default.
- **Ad revenue** is locked below 1,000 subscribers, because the YouTube Partner Programme
  requires 1,000 subscribers and 4,000 watch hours. Every other layer works from the first
  video.
- **Sponsorship rates** interpolate across the chapter's $500–$5,000 range for
  10,000–100,000 subscribers, and the field tells you the band for the subscriber count
  you entered.
- **The patience graph** is the chapter's faceless-YouTube column, month for month.

As the book's own disclaimer notes, these are ranges based on observed outcomes — not
guarantees of results.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of
  any kind. Verified with a browser run asserting zero non-`file://` requests.
- **Everything is saved** to `localStorage` as you go — niche scores, production
  checkboxes, monetisation figures, the weekly checklist and the publishing log.
  `⬇ Back up` downloads the lot as JSON; `🗑 Clear` backs up first, then wipes. Storage
  failures (private mode, `file://` restrictions) degrade to in-memory rather than
  breaking the app.
- **Shared fields.** The niche and audience you enter once are used by the scorecard, the
  studio prompts and the Shorts prompts. The RPM category is shared between the scorecard
  and the stack calculator.
- **Light and dark**, following your system setting, with a manual toggle.
- **Accessible.** Real form controls throughout, arrow-key tab navigation, visible focus
  rings, live-region toasts, and all animation disabled under `prefers-reduced-motion`.
- **Printable.** Print styles drop the interface and keep the cards.

## What it produces

Four downloadable files, all plain Markdown:

- `production-brief.md` — the full ten-step workflow with every prompt filled in for one
  video. This is the file you work from on a Wednesday.
- `shorts-plan.md` — the excerpt and repurposing prompts for that video's Shorts.
- `publishing-log.md` — your asset count and every piece published, with dates.
- `niche-comparison.md` — the scored candidates, if you saved more than one.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub
Pages. Served from this repo's root, the app lives at `/youtube-toolkit/`.
