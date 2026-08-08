# The Agency Operations System

A single-file, offline mini app that turns Chapter 15 of **_The AI Income Blueprint_** by Hassan
Mohammed (`books/THE_AI_INCOME_BLUEPRINT.pdf`) into the thing that chapter describes: a working
set of standard operating procedures for a digital service agency.

Open `index.html` in any modern browser — no install, no build step, no accounts, no internet
connection, and no data ever leaves the device.

## Why this app

Chapter 15 makes a specific claim: the first $1,000 month is a problem of action, and the first
$5,000 month is a problem of systems. It then names the six procedures that constitute those
systems, gives the order to build them in, and provides an AI prompt for drafting each one.

What it does not do — cannot do, in a book — is hand you the procedures. The delivery workflows
that would fill them are scattered across four other chapters: the 48-minute brief-to-delivery
workflow in Chapter 6, the eight-step monthly cycle in Chapter 8, the Business Efficiency Audit in
Chapter 9, the five-stage coaching workflow in Chapter 11.

This app joins them. The six SOPs arrive pre-written from the book's actual workflows for whichever
service line you run, and every line of every one is editable.

## What's in it

| Tab | Source | What it does |
|---|---|---|
| 🏗 **Stage** | Ch. 15 | The Hustler / Operator / Owner characteristics as a diagnostic. Tick what is true, get your stage, its focus, its trigger to the next one, and which SOP to build next |
| 📋 **SOP Library** | Ch. 15 + 6, 8, 9, 11 | Six procedures in the book's build order, pre-filled per service line, fully editable, status-tracked, exportable as one Markdown operations manual |
| ✨ **Drafter** | Ch. 15 | The book's SOP-drafting prompt with your details filled in, the five-step creation process, the gap log, and the 90-day review schedule |
| 👥 **Delegation** | Ch. 15 + 8 | The three hiring signals tested against your own numbers, the delegate-now / month-two / never board, where to find a VA, and the micro-agency arithmetic |
| 💰 **Pricing** | Ch. 15 | The Three-Number Value Pricing calculator, the four underpricing signals, the rate-increase message generator, the productisation converter, and MRR against the book's targets |
| 📎 **Client Pack** | Ch. 8, 9, 11 + App. G | The intake questionnaire for your stream, the six service-agreement clauses, the seven invoice fields, the retention rhythm, and the scope-creep response |

## The six procedures

Built in Chapter 15's priority order, with the book's own timings:

| # | SOP | When to build it | Time to write |
|---|---|---|---|
| 1 | Client onboarding workflow | Month 2, after your first client | 45–60 min |
| 2 | Core delivery workflow | Month 2, after your first delivery | 45–60 min |
| 3 | Monthly client reporting | Month 3, when the first report is due | 30–45 min |
| 4 | Outreach and follow-up sequence | Month 3, before any delegation | 30–45 min |
| 5 | New client proposal process | Month 4, once rate and package are stable | 30–45 min |
| 6 | VA training documentation | Before your first VA hire | 60–90 min |

Each one carries the six sections the book's drafting prompt asks for — purpose, trigger, materials
needed, numbered steps, quality checks, common mistakes — because those are the sections that make
a document a procedure rather than a note. Steps carry optional minute estimates that total at the
bottom, so a procedure nobody has timed is visibly a procedure nobody has run.

## What actually changes between service lines

Four streams, and the app does not pretend they are the same business:

- **✍ Writing** (Ch. 6) — the six-step brief-to-delivery workflow, 48 minutes for an 800-word post,
  with Passes 2 and 3 as separate steps because that is where the leverage is. Quality checks
  include the hallucination check and the AI-phrase elimination list.
- **📱 Social** (Ch. 8) — the eight-step monthly cycle at its real per-client times, with the
  batching instruction attached to the steps it applies to. Roughly 3–4 hours per client per month.
- **⚙ Automation** (Ch. 9) — the audit-to-handover build sequence, including the step most people
  skip: rebuilding into the client's own paid account so they own the credentials.
- **🎓 Coaching** (Ch. 11) — the five-stage workflow, starting from the three-sentence post-session
  summary that everything downstream depends on.

Onboarding access lists, reference documents and reporting metrics vary per stream too. Each stream
keeps its own edits, its own statuses and its own review dates — switching between them loses
nothing.

## How the stage read is computed

The book gives 5, 6 and 6 characteristics for the three stages, plus an income range for each. The
app calls your stage from the **characteristics**, not the income: the highest stage whose
statements are at least 60% ticked. Income ranges are shown, but they describe stages rather than
define them — a person earning $4,000 with no documented process is a Hustler with a good month,
and the chapter is fairly direct about what happens next to that person.

Every stage shows its own tick count, so you can see exactly why the app called it the way it did.

## How the pricing calculator works

The Three-Number system is Outcome Value × 5–15%, cross-referenced with the top third of market
rates, using whichever is higher. Two things the book leaves to the reader, made explicit here:

- **"Top third of the range"** is computed as `low + 2/3 × (high − low)` — the point at which the
  top third begins. A $150–$400 range gives $317.
- **Both numbers are always shown**, with the winning one highlighted, because the number you did
  not use is the one you will need in the sales conversation.

Project fees are shown at 3–5× the first month's retainer, as in Chapter 15's worked example.

The rate-increase generator writes Rule 3's expansion message and checks your increase against the
book's 20–30% band, saying so when you are outside it in either direction.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of any kind.
  Verified with a browser run asserting zero non-`file://` requests.
- **Everything is saved** to `localStorage` as you go — SOP edits, statuses, review dates, notes,
  every answer and every number. `⬇ Back up` downloads the lot as JSON; `🗑 Clear` backs up first,
  then wipes. Storage failures (private mode, `file://` restrictions) degrade to in-memory rather
  than breaking the app.
- **Your edits are yours.** Editing any line of a procedure forks it from the book's version;
  `↺ Reset` puts the book's version back. The library shows which procedures you have changed.
- **Light and dark**, following your system setting, with a manual toggle.
- **Accessible.** Real form controls throughout, `fieldset`/`legend` on every group, arrow-key tab
  navigation, visible focus rings that survive a re-render, live-region toasts, and all animation
  disabled under `prefers-reduced-motion`.
- **Printable.** Any open procedure prints without the interface.
- The price bands, thresholds and income figures are the book's, and as its own disclaimer notes,
  they are ranges based on observed outcomes — not guarantees of results. The service-agreement and
  invoicing material carries Appendix G's disclaimer: it is general educational information, not
  legal advice.

## Exporting

Any single procedure copies or downloads as Markdown. **⬇ Download the manual** exports all six for
the current service line as one file — cover block with your stage and live count, then every
procedure in build order with its status and next review date. That file is what you hand a new
assistant, and it is the artefact Chapter 15 says makes a business transferable rather than
personal.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub Pages.
Served from this repo's root, the app lives at `/agency-sops/`.
