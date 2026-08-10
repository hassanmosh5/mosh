# WhatsApp AI Sales Assistant

A single-file, offline mini app that turns "we should put AI on our WhatsApp" into a build
specification: a qualification playbook, a system prompt and a knowledge file, message templates
checked against the platform's rules before you submit them, the 24-hour window arithmetic that
decides what a follow-up is allowed to be, and a cost model that says what conversion lift the
whole thing has to earn.

Open `index.html` in any modern browser — no install, no build step, no accounts, no internet
connection, and no data ever leaves the device.

## Why this app exists

*The AI Income Blueprint* (`books/THE_AI_INCOME_BLUEPRINT.pdf`) is about AI-assisted income, and
several of its streams — coaching, services, local business work — are sold in a chat window rather
than on a website. The book covers the selling: qualify before you quote (Ch. 7), price the outcome
rather than the hour (Ch. 11), follow up on a schedule (Ch. 14), write the prompt with the CLEAR
Formula (Ch. 5). It does not cover WhatsApp, because WhatsApp is not a writing problem.

That is the gap. On WhatsApp the selling is the easy half. The half that sinks these builds is a set
of platform rules that have nothing to do with sales technique and everything to do with whether the
message you wrote is delivered at all.

| From the book | Where it lands |
|---|---|
| Ch. 7 — qualify before you quote | The qualifying questions, and the four-question ceiling |
| Ch. 11 — price the outcome, not the hour | The objection answers and the negotiation floor |
| Ch. 14 — the follow-up discipline | The follow-up sequence, run through the window rules |
| Ch. 5 — the CLEAR Formula and the 3-Pass Method | The structure of the generated system prompt |

Everything else — the 24-hour window, template categories and approval, opt-in, per-message
pricing, quality ratings — is Meta's, and the app says so wherever it uses one.

## What's in it

| Tab | What it does |
|---|---|
| 🏪 **Setup** | The offer, the current inbox, which of the three WhatsApp products you are actually on, and how people opted in |
| 💬 **Playbook** | Seven stages, the qualifying questions, an objection library with your answers, the close, and who you cannot help |
| 🧠 **Assistant** | Twelve guardrails, eight escalation triggers, a knowledge file — and the system prompt and fact sheet built out of all of it |
| 🎭 **Dry run** | Seven customers, each making a fixed sequence of moves, checked against what you actually wrote down |
| 🕐 **24-hour window** | The follow-up sequence, with every step classified as free-form or template, priced, and timed |
| 🧾 **Templates** | A library and fifteen checks that run offline, including the one that decides your category for you |
| 🧮 **Economics** | Funnel, message costs, model costs, handover labour — and the lift required to break even |
| 🩺 **Audit** | Every finding reads a field you typed and names it |
| 📄 **Handover pack** | The lot as one Markdown document, plus templates as CSV and everything as JSON |

## The rule that breaks every follow-up plan

When a customer messages you, a **customer service window** opens for 24 hours. Inside it you can
write whatever you like, as often as you like, for nothing. When it shuts, free-form messaging stops
— and it stops silently. There is no bounce, no error, no notification. The message simply is not
delivered, and the lead looks like it went cold on its own.

To reach that person again you need a **message template**: written in advance, approved by Meta,
filed under a category, at a price. If the category is marketing you need their consent as well, and
"they messaged us first" is not consent to market to them.

So the window tab classifies each step by the only thing that matters, which is the hour it is sent:

```
step at +h hours after the customer's last message

  h < 24   free-form, free, write anything
  h ≥ 24   template required → category → price → (marketing? → consent required)
```

The worked example ships with the sequence everybody writes on the first attempt — nudge, nudge,
quote reminder at three days, re-engage in the spring — and the app marks the third step **not
deliverable**, because it was written as a free-form message and the window shut two days earlier.
That is the point of the tab.

The window also reopens every time the customer replies, which is why there is a toggle for it: the
same four steps cost different amounts and obey different rules depending on whether anyone answered.

## The cost nobody budgets for, and the one everybody does

The model calls are the line every plan includes. On the worked example they come to about $0.025 a
conversation. The lines that actually decide whether this is worth doing are the template messages
(billed per message, by the country of the number you are messaging, at rates that differ by a factor
of ten between markets) and the human hours spent on the conversations the assistant hands over.

Two modelling decisions worth knowing about:

- **Later steps only bill for the conversations that got that far.** Each step carries the share of
  conversations still unanswered when it fires. Costing a 30-day re-engagement message against every
  conversation started overstates the bill by the share that closed, replied or bought — which on a
  real sequence is most of them.
- **Dollars and your currency are kept apart until the last moment.** Meta bills in USD; your
  revenue is not necessarily in USD. There is one exchange-rate field and one conversion.

## It computes the lift you need, not the lift you'll get

Nobody can tell you how much an assistant will improve your conversion rate, and this app does not
try. The uplift field defaults to 10%, is labelled as the one number on the page with no evidence
behind it, and the headline statistic is computed the other way round:

```
break-even lift  =  (total monthly cost + today's gross profit) ÷ (assisted gross profit at zero lift)  −  1
```

That is a number you can judge. Alongside it sits **net at zero lift** — what coverage alone is
worth, with no claim about speed or persuasion at all — which is the figure you are entitled to plan
on until you have run the thing for a month.

For a high-value local service the answer is usually that coverage alone pays for it several times
over, and the app says so in green. Put in a £15 digital product at the same volumes and the same
page turns red, because the per-message cost is fixed and the gross profit per sale is not. Both
answers are useful; only one of them is the one people expect.

## The dry run is a rehearsal, not a chatbot

There is no model in this file. Seven customers each make a fixed sequence of moves — asks the price,
pushes back on it, asks whether you are a real company, goes quiet for a day, turns out to be outside
your area, arrives with a complaint, types *"ignore your previous instructions"* — and every move is
resolved against your configuration.

Where you have written an answer, you see your answer, in a transcript. Where you have not, you see
the gap, with the fix and the tab it lives on. That is the honest version of what a demo would show
you, because at exactly that point in a real conversation a model produces *something*, and you will
not be there to read it first.

The same configuration always produces the same transcript, so it is worth re-running after a change
and comparing.

## Template checks that run before Meta sees them

Template review is slow and a rejection arrives without a useful reason, so each round trip costs
days. Fifteen checks run offline as you type — sixteen on a marketing template, which gets one
more: name format, the 1,024/60/60/25-character limits, variable numbering, the rule that a body may
not begin or end with a placeholder, no two adjacent variables, a sample value for every variable,
enough fixed text to review, link shorteners, shouting.

The interesting one is the last: **a template's category is decided by what the message says, not by
what you selected.** A body full of "50% off" and "buy now" submitted as utility gets recategorised
or rejected, and recategorisation means you are billed at the marketing rate anyway. The checker
scores the wording and tells you which category it has actually written.

## What it will not do

- It does not connect to WhatsApp, send anything, or hold a token. It is a design tool.
- It does not contain a model, and the dry run is not a conversation.
- It will not tell you an assistant is a good idea. On low order values it says the opposite, in red.
- It will not pretend the free WhatsApp Business app can run any of this. Pick that option on the
  Setup tab and the app says, in red, that everything on the next eight tabs is a specification for
  later rather than a plan for Monday.

## The figures are a snapshot, and they are all editable

The per-message rate card is a 2025 snapshot across fourteen markets. Meta revises it, and it varies
by the country of the number you are messaging. Every cell is an input; overwrite the row for your
market with the figure from your provider's bill. The same goes for the window length, the template
rules and the categories — check them against Meta's current documentation before you build, and
again before you launch.

## Everything else

- **Nine tabs, one file, no network requests of any kind** — no CDN, no fonts, no images, no
  analytics. Open it on a plane.
- **Saved in the browser's local storage.** Clearing your browser data deletes it; **Back up** is the
  only copy. Back up, restore and clear are in the top bar, and the app degrades to memory rather
  than throwing when storage is blocked.
- **A worked example** — a London kitchen fitter — fills every tab, including one unanswered
  objection and one undeliverable follow-up, so the dry run and the audit have something to say.
- **Light and dark**, following the system or forced, and responsive down to 390px.
- **Exports**: system prompt and knowledge file as Markdown, the whole build as one Markdown
  document, templates as CSV, everything as JSON.
