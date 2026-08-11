# The Proposal &amp; Contract Kit

A single-file, offline mini app that writes the four documents an engagement actually
needs: the proposal, the services agreement, the change order, and the emails that carry
them. Everything is generated from one form — your fee, your dates, your client, your
jurisdiction — so the numbers in the contract are the numbers in the proposal.

Open `index.html` in any modern browser — no install, no build step, no accounts, no
internet connection, and no data ever leaves the device.

> **Not legal advice.** This is a drafting aid built from general practice, not a lawyer.
> Contract law varies by country, by state, and by the facts of your engagement. Read every
> clause, delete what does not apply, and for anything over a couple of thousand — or with
> unusual risk, personal data at scale, or a client much larger than you — have it reviewed.
> The book's own Appendix G says the same thing.

## Why this app exists

*The AI Income Blueprint* (`books/THE_AI_INCOME_BLUEPRINT.pdf`) stops one step short of the
documents themselves. Chapter 15 tells you to send a one-page proposal within 24 hours of
the call, priced on outcome value, with three tiers and an expiry date. Appendix G lists the
six clauses a service agreement needs — scope, revisions, payment, IP, confidentiality,
termination — and then points you at a template website.

[`agency-sops/`](../agency-sops/) turns that into a checklist you tick. This app writes the
documents. It is the difference between "your agreement should cover intellectual property"
and a clause that says rights transfer *on payment in full*, renumbered automatically when
you switch a different clause off.

## What's in it

| Tab | What it does |
|---|---|
| 🧭 **Engagement** | One form: service line, deal shape, both parties, the numbers, the dates, scope in and out. Everything else is generated from it |
| 💰 **Price &amp; terms** | The three-number pricing method, a three-tier builder anchored on the middle, an effective hourly rate, a dated invoice schedule, and what late payment costs |
| 📄 **Proposal** | Five paragraphs you write; the rest assembles. Live document preview, Markdown export, print styles |
| 📜 **Agreement** | 41 clauses with plain-English explanations, on/off switches, editable wording, and a Schedule A built from your scope |
| 🔁 **Change orders** | The sentence that stops scope creep, a change-order generator, and a register of everything raised |
| 📬 **Send &amp; chase** | Six emails — send, three follow-ups, acceptance, overdue — plus the four objections and how to answer them |
| ✅ **Pre-send review** | 20 checks against your actual engagement, ranked, each with a link to the field that fixes it |

## Three things it does that a template file cannot

**Cross-references renumber themselves.** Clause bodies reference each other by id, not by
number. Switch off the approval clause and the platform clause stops pointing at "clause 6"
— it points at whatever number approval now is, or degrades to prose if you removed it
entirely. A downloaded template with hard-coded numbers silently breaks the moment you
delete a paragraph, and nobody notices until it matters.

**Switching a clause off tells you what you just accepted.** Untick "Limitation of
liability" and the card turns red: *on a £1,800 engagement you are carrying unlimited
exposure — this is the single easiest risk a solo provider can fix.* The app is not trying
to stop you; it is making sure the decision is one you made rather than one you inherited
from whatever template you found first.

**The documents agree with each other.** The fee in the proposal, the fee in clause 8, the
deposit in the schedule and the figure in the acceptance email are the same number because
they are the same variable. The most common contract failure in a solo practice is not a
missing clause — it is a proposal that says one thing and an agreement that says another.

## Jurisdiction is a setting, not a footnote

Eight jurisdictions — UK, Ireland, other EU/EEA, US, Canada, Australia, New Zealand, and
elsewhere — each changing the governing-law clause, the late-payment mechanism, the
data-protection reference, the tax label, the contractor-status wording and the e-signature
note. The mechanisms differ enough that a single "governing law: [COUNTRY]" line would be
useless:

- **UK**: statutory interest at 8 points above the Bank of England base rate, plus a fixed
  recovery sum of £40, £70 or £100 by debt size, under the Late Payment of Commercial Debts
  (Interest) Act 1998 — it applies whether or not your contract mentions it.
- **Ireland and the EU**: 8 points above the reference rate plus a €40 minimum, under
  Directive 2011/7/EU as implemented locally.
- **US**: no federal statutory interest for private B2B work, so the contract is all you
  have. State usury caps can void an aggressive rate, which is why an enforceable 1.5% a
  month beats an unenforceable 5%.
- **Canada**: section 4 of the Interest Act caps recovery at 5% a year if you state a
  monthly rate without its annual equivalent — so the app writes "1.5% per month (18% per
  year)".
- **Australia**: the unfair contract terms regime has covered small-business standard-form
  contracts since November 2023, with civil penalties. One-sided rights to vary or
  terminate are the usual casualties.

Figures that move — thresholds, base rates, registration limits — are editable fields or
are marked "check the current figure" rather than being frozen into the text.

## The clause library

41 clauses across six groups, of which about 29 are on by default. Each carries a one-line
explanation of what it does and, when you switch it off, what you have just accepted.

Seven are service-specific and appear only for the service line that needs them: source
verification and publication responsibility for writing; platform rules and account
ownership for social and video; third-party API changes and acceptance testing for
automation; session cancellation and "this is not regulated advice" for coaching.

One is there because of what this repo is about. The **Use of AI tools** clause discloses AI
use in writing, on your terms, with a verification promise attached — and notes that the
Client's confidential information will not go into a public tool without consent. Undisclosed
AI use is the accusation that ends engagements; disclosed AI use with a verification
standard is a professional position. It also flags the copyright wrinkle: in some
jurisdictions material generated without sufficient human authorship may not attract
copyright at all, which matters for a clause that assigns rights.

## The pre-send review

Twenty checks, computed from your engagement rather than from a generic list. It reads the
deposit percentage, the payment terms, the number of exclusions, which clauses are switched
on, whether the client is a business or an individual, and how many placeholders are left
anywhere in the pack. Failures are specific: not "consider a deposit" but *no deposit — you
start work with nothing paid, on £1,800 of exposure*.

It disagrees with you on purpose. A 60-day payment term is flagged even if the client asked
for it. Five revision rounds is called a briefing problem being solved at your expense. The
"Fix →" button jumps to the field that changes it.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of
  any kind. Verified with a browser run asserting zero non-`file://` requests.
- **Everything is saved** to `localStorage` as you type. `⬇ Back up` downloads the lot as
  JSON; `🗑 Clear` backs up first, then wipes. If storage is unavailable (private mode,
  `file://` restrictions) the app says so once and keeps working in memory.
- **Per-service memory.** Edit the deliverables for social, switch to automation, switch
  back — your edits are still there. Each service line keeps its own scope and proposal copy.
- **Placeholders are visible.** Anything unfilled renders as `[LIKE THIS]`, highlighted in
  the preview and counted above it. Searching an exported file for `[` finds every gap in
  one pass.
- **Accessible.** Real form controls throughout, `fieldset`/`legend` on grouped fields,
  arrow-key tab navigation, visible focus rings, live-region toasts, and all animation
  disabled under `prefers-reduced-motion`.
- **Responsive** down to 390px with no horizontal page scroll; the invoice table scrolls
  inside its own container.
- **Printable.** Proposal, agreement and change order have print styles that drop the
  interface and leave the document — print to PDF and send it.
- **Light and dark**, following your system setting, with a manual toggle.

## Verification

A headless Chromium run asserts, on every change: no external requests, no console errors,
all seven panels render, documents rebuild from the form, every numeric cross-reference
points at a clause that exists (including after a clause is switched off), the schedule
dates and late-payment arithmetic are correct, state survives a reload, and no page-level
horizontal scroll appears at 390px on any tab.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub
Pages. Served from this repo's root, the app lives at `/client-contracts/`.
