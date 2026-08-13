# AI Website Prompt Kit

A single-file, offline tool for the part of building a website with AI that happens before
the first message: deciding the things the builder will otherwise decide for you.

Open `index.html` in any modern browser — no install, no build step, no accounts, no internet
connection, and no data ever leaves the device.

**It does not build anything.** Nothing here talks to a model. It works out what the model
should be told, writes the prompts from your answers, and prices what the missing answers
cost you.

## The argument the app makes

An AI website builder never asks for what it wasn't given. Say "build me a site for my
roofing business" and it doesn't stop — it produces one, with an invented brand, invented
services, invented testimonials, a stack it chose silently, and a purple gradient hero. None
of those were rejected; they were never considered. And every subsequent prompt inherits
them, so the second, third and tenth message are spent undoing defaults you never picked.

Three things follow, and the app is built around them:

1. **The cost of a vague prompt is not a worse site — it's the redo.** A redo costs exactly
   what the original did, in credits and in your time. Vagueness is charged twice: once for
   the attempt, once for the undo.
2. **Fourteen decisions steer the whole build.** Not "what colour" but "what a visitor should
   do", "what you can actually prove", "what it must never do". Each one you leave blank is
   made by the model, silently, and inherited by everything after it.
3. **Constraints in one message decay; constraints in the rules file don't.** Every builder
   has somewhere to put standing instructions, and almost nobody uses it. The tab that
   generates that file is the most useful thing here.

## The tabs

| Tab | What it does |
|---|---|
| 🎯 **Brief** | The fourteen decisions, each with the default the builder will pick if you skip it, and the weight it carries |
| 📜 **Project rules** | The standing-instructions document, assembled from the brief, with the exact place it goes in your builder |
| 🧱 **Prompts** | 44 prompts across 9 phases, written from your answers, each flagged with what it locks in and which of its inputs are still undecided |
| 🔁 **Build order** | The sequence, with gates, and the place you record what actually happened |
| 🩹 **Repair** | 20 failure modes, what really caused each one, and the prompt that repairs it |
| 🧪 **Acceptance** | 38 checks — 22 of them blocking — to run before accepting a phase |
| 💳 **Credits** | What the redos cost, against your own prices, and what the brief saves |
| 🛠 **Builders** | Nine tools compared on what they lock you into rather than on quality |
| 📄 **Kit** | The lot as one Markdown document |

## The fourteen decisions

Weighted 1–10 by how much of the build each one steers. The weights are the app's judgement,
printed next to each decision so you can disagree with them.

What the site is for · who it's for · the one action · what you can prove · the pages · the
home page section order · voice · colour, type, shape and density · stack and hosting · where
words and pictures come from · forms, accounts and payments · what it must never do ·
language, money, region and law · the performance and accessibility bar.

Each one shows the default it will inherit if left blank — "indigo #6366f1 on white, Inter,
8px radius, a gradient hero", "three competing buttons of equal weight", "invented
testimonials with invented names" — because the fallback is the argument. An answer under
eight characters is treated as unanswered: it is not enough text to steer anything, and
scoring it would flatter the total.

## Where the prompts get their shape

Nine phases, in an order that isn't arbitrary. Whatever exists when you ask for the next
thing is the context for it, so:

- **Structure before surface**, because built together they weld together, and every styling
  change then risks the structure.
- **Design system before pages**, because a page built first gets its own private design, and
  merging two private designs later is a rewrite.
- **Copy after layout**, because copy written first gets cut to fit.
- **Forms wired up as their own step**, because a form that validates beautifully and posts
  nowhere is the defining defect of the AI-built website and is invisible in every preview.

A prompt whose inputs are still blank is rendered with the hole visible — `[NOT DECIDED — …]`
— and the card says which decisions you are handing over. You can send it anyway. You just
can't do it without noticing.

## The arithmetic

Builders charge per message, per credit or per month, so the app prices redos rather than
guessing at quality:

```
p = base(risk) × (0.5 + 1.5 × (1 − specificity)) × (1 + 0.6 × unanswered inputs)
base:  low 0.10   medium 0.18   high 0.28        capped at 0.75

attempts = 1 / (1 − p)          messages = prompts × mean attempts
```

The three base rates and the two multipliers are judgements, stated in the interface. The
consequence isn't: something that fails a fraction *p* of the time takes 1/(1−*p*) attempts,
which climbs gently until *p* passes about a half and then very steeply.

**The estimate is replaced by a measurement.** Record statuses and redos on the Build order
tab; once five prompts are accepted, your own count takes over and every figure on the
Credits tab moves with it.

Two comparisons come out of this, and the second is the less obvious one:

- **Brief against no brief** — the same build with every decision defaulted, and how many
  prompts of building it takes to pay back the hour spent writing the brief.
- **Forty-four small prompts against six big ones.** The big ones need *fewer messages* —
  which is why people send them — but a mega-prompt carrying seven prompts' worth of work
  fails when any part of it fails, and a failure discards everything it contained. Fewer
  messages, several times more thrown-away work.

Prices are yours to type. The app ships no price list, because builder pricing changes every
few months and any figure baked in would be wrong by the time you read it.

## What it deliberately doesn't do

- **It doesn't rank the builders.** Nine are described on shape, cost and what you get out.
  The question worth asking isn't which is best — it's what happens on the day you want to
  leave, and only some of the answers are reversible.
- **It doesn't promise a good site.** It removes one failure — the model deciding things you
  should have decided — and leaves every other one standing.
- **It doesn't review code.** The acceptance checks catch what a person can see in a browser,
  not what a security audit would.
- **It doesn't write your copy.** Several prompts explicitly forbid the model from writing
  facts, and the app has no facts of yours either.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of any
  kind. Verified with a browser run asserting zero non-`file://` requests.
- **Everything is saved** to `localStorage` as you type. `⬇ Back up` downloads the lot as
  JSON, `⬆ Restore` reads it back, and `🗑 Clear` backs up first, then wipes. Storage failures
  (private mode, `file://` restrictions) degrade to in-memory with a warning rather than
  breaking the app.
- **A worked example** — a Leeds roofing company — loads into every field with one button, so
  the app is legible before you have typed anything. Every field stays editable.
- **Light and dark**, following your system setting, with a manual toggle.
- **Accessible.** Real form controls throughout, every input labelled, arrow-key tab
  navigation, visible focus rings, live-region toasts, and all animation disabled under
  `prefers-reduced-motion`.
- **Responsive** to 390px with no horizontal page scroll on any tab; wide tables scroll inside
  their own containers.
- **Exports** as Markdown (the rules file, the full kit), CSV (the prompt index with each
  prompt's redo probability) and JSON (a complete backup).

## Verification

717 assertions run in the page at load, and the count is reported in the footer — catalogue
consistency (no duplicate ids, every prompt's phase and inputs resolvable, every prompt
rendering without leaking an `undefined`), and the arithmetic against values worked out by
hand: 1/(1−p) at three points, the weighted specificity score at both ends, the eight-character
floor, the vagueness multiplier at both extremes, the per-prompt gap penalty, all three
pricing models, the big-bang comparison's direction, and the switch from estimate to
measurement at the fifth accepted prompt.

Checked separately in headless Chromium: every tab at 390, 768 and 1280px with no horizontal
page scroll, the worked example, prompt rendering, filtering and search, status and redo
recording, the checklist, the rules and kit generation, persistence across a reload, dark
mode, escaping of user text (a `<img onerror>` typed into the brief reaches the prompts as
text), and no external requests.

## What will go stale

The builder list, within a year or two — tools appear and merge, and the pricing shapes move.
The failure modes won't. A model filling an empty testimonial slot with a plausible name is
not a bug in a particular product; it is what a model does with a slot and no fact, and it
will still be true of whatever replaces these nine.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub
Pages. Served from this repo's root, the app lives at `/website-prompts/`.
