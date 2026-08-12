# AI Customer Support Agent

A single-file, offline planning tool for the decision that comes before building a
support agent: which of your messages it should answer, what it must be told, what it
must never say, and how often it has to be right before it saves you any money.

Open `index.html` in any modern browser — no install, no build step, no accounts, no
internet connection, and no data ever leaves the device.

**It is not a chatbot.** Nothing here talks to a model. It decides what the model should
be told, what it should refuse, and whether the arithmetic works — and then hands you the
system prompt, the fixed replies, a 50-case test bench and a rollout plan.

## The argument the app makes

Most support-agent projects are sold on containment: the share of conversations the agent
closes. Containment counts the tickets it answers and ignores the ones it answers
*wrongly*, which do not cost zero. The customer comes back crosser, a person untangles it,
and some of them leave.

Once you count that, three things follow, and the app is built around them:

1. **The unit of decision is the intent, not "support".** Automating support as a whole is
   a decision nobody can make well. Automating *"where is my order"* is one anybody can
   make in ten seconds. Thirty-four intents, each with its own verdict: the agent resolves
   it, drafts it for a person, or hands it straight over.
2. **You cannot automate what you have not written down.** An agent missing a fact does not
   fall silent — it invents a plausible one. So each intent declares the documents and
   lookups it needs, and a missing one blocks auto-resolution outright. This is the whole
   safety mechanism and it is deliberately annoying.
3. **Every intent has a break-even accuracy**, and they are wildly different. A three-minute
   stock question breaks even in the low tens of percent. An eleven-minute refund on a
   customer worth £120 needs to be right around nine times in ten before it beats a person.

## The tabs

| Tab | What it does |
|---|---|
| 🎯 **Scope** | Business model, volume, staffed hours, loaded cost, channels, tone. Everything else is computed from here |
| 📋 **Intents** | Your ticket taxonomy with a per-intent verdict, a derived accuracy, and the reason it was overridden if it was |
| 📚 **Knowledge** | 27 documents and 12 live lookups, each tracked as missing / partial / written, ranked by volume unblocked per hour of writing |
| 🛡 **Boundaries** | Money limits, identity bar, the uncertainty rule, 10 escalation triggers and 11 prohibitions — five of which cannot be switched off |
| 🧠 **Agent brief** | The full system prompt, assembled from every other tab, with a token estimate and the cost of carrying it on every turn |
| 💬 **Replies** | 19 replies that must not be improvised, generated from your own limits and hours, editable, and quoted into the brief |
| 🧪 **Test bench** | 50 adversarial and ordinary messages across 10 categories, each with what it probes and what a pass looks like |
| 💰 **Economics** | Per-intent cost with and without the agent, the break-even accuracy for each, payback, and a sensitivity table |
| 🚀 **Rollout** | Five phases whose entry gates read the rest of the app and refuse to open when unmet |
| 📄 **Spec** | The lot as one Markdown document |

## How accuracy is derived rather than typed

Nobody can honestly type an accuracy figure for an agent they have not built, so the app
computes one and shows its working:

```
accuracy = ceiling × (each document it needs) × (each lookup it needs) × calibration
```

The **ceiling** is a judgement about how well-defined the question is — a tracking lookup
is nearly deterministic at 0.95, an angry complaint is not a question at all at 0.25.
Sources multiply it: **written 1.0, partial 0.75, missing 0.45**; **connected 1.0, manual
0.7, absent 0.4**. A missing document also blocks auto-resolution outright, because the
failure mode is not a gap in the answer — it is a fluent, confident, wrong one.

None of those weights are benchmarks. They are the numbers the app applies, stated in the
interface so you can disagree with them.

**Calibration replaces the estimate with a measurement.** After the drafting phase, enter
how many conversations you reviewed and how many were fully resolved; every accuracy on
every tab is rescaled by the ratio, and the economics move with it.

## The break-even calculation

For an intent the agent resolves itself, with `a` = accuracy:

```
cost with agent = a·(agent cost) + (1−a)·(agent cost + P)
P = human minutes × rework multiplier + handoff minutes + churn share × customer value
```

Setting that equal to the cost of a person and solving for `a` gives the break-even
accuracy. The table reports it next to the derived accuracy, and an intent below its own
line is flagged: automating it is a cost, not a saving. That is where the app's least
intuitive output comes from — **routing an intent back to a human sometimes increases the
total saving.**

Three pricing models are supported, because they change what is worth automating:
per-token (you build it), per-resolution (a vendor charges for each conversation closed),
and a flat monthly fee — where the marginal conversation is free and the calculus shifts.

Token prices are **order-of-magnitude bands to overwrite with the price on your own
invoice**, not quotes. They move constantly and vary by provider; the app says so where
they are used.

## What it deliberately does not count

- **Faster replies.** Real value, no invoice. Reported as hours of customer waiting removed.
- **The tickets you never see** — questions people would have abandoned along with the
  purchase. Upside the app refuses to guess at.
- **Redundancies.** Hours saved is not headcount saved unless somebody leaves. A team at
  capacity converts saved hours into faster replies instead.
- **Seasonality.** One monthly volume, evenly spread. If you have a peak, run it twice.

## Test bench

Fifty cases in ten groups — ordinary, ambiguity, out of scope, policy pressure, identity,
injection and abuse, handoff, tone, language, broken input. They are not questions about
your product; they are the shapes of message that make support agents fail: the one
pressing on a policy edge, the one asking about someone else's account, the one with an
instruction hidden inside a translation request, the 2,000-word message with the question
in the last line.

Each carries a severity. **Blockers gate the rollout** — the auto-resolution phase will not
open while one is outstanding, and that is the intended behaviour rather than a bug in it.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of
  any kind. Verified with a browser run asserting zero non-`file://` requests.
- **Everything is saved** to `localStorage` as you type. `⬇ Back up` downloads the lot as
  JSON, `⬆ Restore` reads it back, and `🗑 Clear` backs up first, then wipes. Storage
  failures (private mode, `file://` restrictions) degrade to in-memory with a warning
  rather than breaking the app.
- **Light and dark**, following your system setting, with a manual toggle.
- **Accessible.** Real form controls throughout, every input labelled, arrow-key tab
  navigation, visible focus rings, live-region toasts, and all animation disabled under
  `prefers-reduced-motion`.
- **Responsive** to 390px with no horizontal page scroll on any tab; wide tables scroll
  inside their own containers.
- **Exports** as Markdown (brief, replies, test checklist, full specification), CSV
  (the per-intent economics) and JSON (a complete backup).

## Verification

Checked in headless Chromium — 121 assertions covering the catalogue's internal
consistency, the arithmetic against hand
calculations, every blocking rule firing and clearing, the break-even identity (cost at the
break-even accuracy equals the cost of a person, to nine decimal places), calibration,
save/restore and its repair of a deliberately damaged file, escaping of user text in the
brief, the replies and the specification, the interactive controls, no external requests,
and no horizontal overflow at 390/768/1280px.

## What will go stale

The token price bands, quickly — they are labelled as bands for that reason. The list of
things an agent gets wrong will not: an unverifiable claim that a colleague promised a
refund has been a support problem for as long as there has been support, and it is on the
test bench because a model folds to it in a way a person does not.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub
Pages. Served from this repo's root, the app lives at `/support-agent/`.
