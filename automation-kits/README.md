# AI Automation Kits

A single-file, offline mini app that turns Chapter 9 of **_The AI Income Blueprint_** by
Hassan Mohammed (`books/THE_AI_INCOME_BLUEPRINT.pdf`) into a working console for selling
AI-powered business systems — and Chapter 15 into the systems that keep the business running
once you have sold them.

Open `index.html` in any modern browser — no install, no build step, no accounts, no internet
connection, and no data ever leaves the device.

## Why this app

Chapter 9 is the book's highest-ceiling income stream, and it is written as a set of tools you
are meant to use rather than read: a thirty-minute audit script, ten automation templates, a
five-part proposal format, a pricing table, an ROI calculation, and a five-step selling process.
On the page they are separate lists. In practice they are one pipeline — the audit produces the
kit, the kit produces the price, the price and the audit together produce the proposal.

This app is that pipeline. Answer the audit as the client answers, and the recommended
automations rank themselves, the fee lands in the right band, and the one-page proposal is
already written.

Chapter 15 is the other half of the same job: what happens after the first client says yes. The
Systems tab carries the stage model, the SOP system, the value-pricing arithmetic and the MRR
tracker, because Chapter 9's income projections only materialise if the retainers compound.

## What's in it

| Tab | Source | What it does |
|---|---|---|
| 🔍 **Efficiency Audit** | Ch. 9, pp. 119–120 | All four sections of the 30-minute Business Efficiency Audit as live questions, with each answer wired to the opportunity signals the book tells you to listen for. Ranks the automations as you go and writes the closing line |
| ⚙ **Automation Kits** | Ch. 9, pp. 116–117, 120–123 | All 10 templates with their real triggers, actions, results and tool stacks. Build a kit; the app prices it, totals the build time, and lists the access the client must grant. Plus the full niche table |
| 📄 **Proposal** | Ch. 9, p. 125 | The book's five-section, one-page proposal, assembled from the audit, the kit and the ROI. Copy, download as Markdown, or print — it prints to exactly one page |
| 💰 **Pricing & ROI** | Ch. 9, pp. 123–124 · Ch. 15, pp. 224–225 | The three value levers the book quantifies, the seven-row offering table, and the Three-Number Value Pricing System as a calculator |
| 📋 **Systems & SOPs** | Ch. 15, pp. 221–233 | Hustler / Operator / Owner stage assessment, the AI SOP prompt generator, the six priority SOPs, an MRR tracker checked against the book's growth targets, VA readiness, and the productisation table |
| 📖 **Selling Playbook** | Ch. 9, pp. 117–130 | The five-step selling process, the outreach message generator, the three objections and their answers, Mindset Shift #9 with the retainer-renewing report paragraph, the income projections, the tools, the case study, and the chapter action step |

## How the audit ranking works

The book gives each audit section an **OPPORTUNITY SIGNAL** — the answers that mean money is
being left on the table. This app makes those signals mechanical:

- every answer option carries a **weight of 0–3** and a list of the automation templates it
  implicates, both shown on the option itself so nothing is hidden
- an answer that describes an already-automated process is weight 0 and maps to nothing
- each answer also carries an **evidence line** written in proposal voice, which is what ends up
  in Section 1 of the proposal — so the problem summary is the client's own answers, not a
  generic pitch

The findings list on the audit tab shows **only** the audit score, deliberately: that is what the
client actually told you. The kit tab adds a **+2 niche bonus** for automations the book's niche
table lists under your chosen niche, and labels them, so you can see which recommendations came
from the conversation and which came from the book's expectations of that sector.

## What this app added, and what it transcribed

Everything is transcribed from the book except three audit fields, which are badged
**app-added** in the interface:

1. **Approximate no-show rate** (Section 2) — the book's own opportunity signal for that section
   is "no-show rate above 10%", but it never asks the number. It is a field here because the
   proposal's ROI line needs it.
2. **Staff hours per week lost to those tasks** (Section 4) — same reason; the book's Section 4
   asks *which* tasks, and the ROI needs *how many hours*.
3. **Do you chase clients for documents, forms or information?** (Section 4) — without it,
   Automation 6 (Document Collection Reminder) has no trigger in the audit, even though the
   book's own niche table lists document chasing as the top opportunity for law firms and
   accountants.

Both measures feed straight into the ROI calculator, so you are asked once and the number is
used everywhere.

Two ROI inputs are also flagged app-added — appointments per month, and the cost of one staff
hour. The book quantifies hours saved but never puts a price on them, so **staff time is
reported separately from recovered revenue** rather than folded into it. The headline "recovered
revenue" figure counts only leads and appointments, which are the two levers the book's own
proposal ROI line uses.

## Build times and fees are not invented

- **Build times.** The book states build times for three worked examples only (2–3 hours,
  1.5–2 hours, 1–2 hours, pp. 114–115). Those three map to Automations 1, 2 and 3 and are shown
  as stated. The other seven are this app's estimates, anchored to those three, and are always
  labelled `(est.)`. The kit summary says how many of your selections are estimates.
- **Project fees.** The suggested fee is the midpoint of where the book's package band for a kit
  that size (Single / Starter / Full System, p. 123) overlaps your niche's average project fee
  (pp. 116–117). When the two do not overlap — a six-automation kit for a salon, say — the app
  says so rather than quietly splitting the difference.
- **Build weeks.** Anchored to the book's own productised package: "3 automations, $1,200 flat,
  2-week delivery" (Ch. 15, p. 231).

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of any
  kind. Verified with a browser run that asserts zero non-`file://` requests, before and after
  a reload.
- **Everything is saved** to `localStorage` as you go — audit answers and notes, your kit, the
  proposal fields, every calculator, your SOP progress and retainers. `⬇ Back up` downloads the
  lot as JSON; `🗑 Clear` backs up first, then wipes. Storage failures (private mode, `file://`
  restrictions) degrade to in-memory with a warning rather than breaking the app.
- **Light and dark**, following your system setting, with a manual toggle and no flash on load.
- **Accessible.** Real form controls throughout, `fieldset`/`legend` on every audit question,
  arrow-key tab navigation with Home/End, visible focus rings, live-region toasts, labelled
  repeated rows, and all animation disabled under `prefers-reduced-motion`.
- **Printable.** The proposal has print styles that drop the entire interface. With a
  three-automation kit it prints to one page, which is the constraint the book actually sets.
- Content is transcribed with chapter and page references shown throughout — the book's own
  printed page numbers, not PDF page numbers. The income figures, fee ranges and conversion
  rates are the book's, and as its own disclaimer notes, they are ranges based on observed
  outcomes, not guarantees of results.

## What you do with the output

The proposal downloads as plain Markdown and prints to a single page, which is what Step 3 of
the selling process asks for. The outreach message, the audit close, the SOP prompt and the
monthly report paragraph all copy to the clipboard as plain text, because each of them is
something you paste somewhere else — LinkedIn, an email, ChatGPT, a client's inbox.

The app itself is one self-contained HTML file, so it also works as the demonstration piece
Chapter 9 tells you to build before approaching clients: something you can show on a laptop in
an audit conversation rather than describe.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub Pages.
Served from this repo's root, the app lives at `/automation-kits/`.
