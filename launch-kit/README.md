# AI Income Launch Kit

A single-file, offline mini app built from **_The AI Income Blueprint_** by Hassan Mohammed
(`books/THE_AI_INCOME_BLUEPRINT.pdf`).

Open `index.html` in any modern browser — no install, no build step, no accounts, no
internet connection, and no data ever leaves the device.

## Why this app

Part Four of the book (Chapters 13–14) is a set of decision tools written out in prose:
a scoring matrix you are meant to work through with a pen, a seven-day test, a fill-in
commitment template, and a thirty-day checklist. This turns those into the thing they
were always describing.

## What's in it

| Tool | Source | What it does |
|---|---|---|
| 🧭 **Fit Matrix** | Ch. 13 | Score yourself on 5 dimensions → ranked fit across all 7 income streams, a primary and a secondary, the book's matching profile, and the 3 gut-check questions |
| ⚡ **7-Day Validation Sprint** | Ch. 13 | The 7 daily actions with their key question and required output, notes per day, and the Proceed / Refine / Pivot decision |
| 📜 **Commitment Statement** | Ch. 13 | The book's template as a form; renders a signed statement you can copy or print |
| 📅 **30-Day Launch Plan** | Ch. 14 | All 30 days with their real tasks, times and milestone checks, weekly milestones, and the product / content track adaptations |
| ✨ **CLEAR prompt builder** | Ch. 5 | Context, Length, Examples, Audience, Role → one assembled prompt, copy to clipboard. Plus the 3-Pass Method |
| 💰 **Pricing cheat sheet** | Appendix D | All 26 offerings across the 7 streams at starter, mid-tier and premium rates, with your chosen stream highlighted |

## How the scoring works

The book's Step 2 (p.192) says to **match** your personal score to each stream's matrix
rating, and take the stream with the most matches — not to maximise every dimension. The
app implements exactly that:

- exact match on a dimension = 2 points
- off by one = 1 point
- off by two = 0 points, and the dimension is flagged as a **weakest link**

Skill match is rated per stream and carries double weight, because the book asks you to
score it separately and says it "should be highest for streams that most match your
background." Totals are shown as a percentage of 12, and every dimension's contribution is
visible so you can see *why* a stream ranked where it did.

The book's own six proven combinations (Expert Writer, Domain Expert, Creative Operator,
Systems Thinker, Passive Builder, Knowledge Publisher) are matched against your result.
Where your computed secondary differs from the book's canonical pairing, the app says so
rather than quietly picking one.

You can override both the primary and the secondary — the sprint, the statement, the plan
track and the pricing table all follow whatever you commit to.

## The three plan tracks

The day-by-day plan in Chapter 14 is written for service streams (#1, #3, #4, #6). The book
gives week-level adaptations for the others, and the app switches between them:

- **Service** — all 30 days
- **Digital products & prompt packs** (#2, #5) — Week 1 as written *plus* the two product
  validation actions; Weeks 2–4 replaced by the book's adaptation
- **Content creation** (#7) — all four weeks replaced, with the book's warning that content
  will not produce meaningful income in 30 days

Days 1–7 are the same actions on the service and product tracks, so ticking one carries
across both.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of
  any kind. Verified with a browser run that asserts zero non-`file://` requests.
- **Everything is saved** to `localStorage` as you go — scores, notes, checkboxes, your
  statement and your prompt. The 🗑 button clears it all; the ⬇ button downloads everything
  as a plain-text file first.
- **Light and dark**, following your system setting, with a manual toggle.
- **Printable.** The commitment statement and the launch plan both have print styles that
  drop the interface.
- **Accessible.** Real form controls throughout, visible focus rings, `fieldset`/`legend` on
  every scored group, live-region toasts, and all animation disabled under
  `prefers-reduced-motion`.
- Content is transcribed from the book with chapter and page references shown throughout.
  The income figures are the book's, and as its own disclaimer notes, they are not
  guarantees of results.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub
Pages. Served from this repo's root, the app lives at `/launch-kit/`.
