# Digital Products Maker

A single-file, offline tool for the part of making a digital product that decides whether it
earns anything: the hour before you start building.

Open `index.html` in any modern browser — no install, no build step, no accounts, no internet
connection, and no data ever leaves the device.

**It does not make the product.** Nothing here talks to a model. It works out whether the
product should exist, writes the prompts that build it, and does the arithmetic that says what
it has to sell.

## The argument the app makes

A digital product has no marginal cost. That is the whole appeal, and it hides the thing that
matters: **the entire cost is paid up front, before a single person has told you they want it.**
Eleven hours in a document is eleven hours whether it sells four hundred copies or none, and by
the time you find out, the money is already spent.

Three things follow, and the app is built around them:

1. **The only decision that changes the outcome is made before you build.** Everything after —
   the writing, the design, the listing — is execution on a bet that was already placed. So the
   first three tabs are about placing the bet well and the build tab comes fourth.
2. **AI has made the expensive half cheap and the hard half no easier.** Drafting is now fast.
   Knowing what to draft, for whom, and whether they'll pay is exactly as hard as it was, and
   it is the half that decides the result. The formats AI carries most completely are the ones
   buyers have seen most often — because everyone else's AI carried theirs too.
3. **A tool that can only say yes is a tool that always says yes.** Both gates here can return
   a kill, and they return it on the strength of the weakest answer rather than the average one.

## The tabs

| Tab | What it does |
|---|---|
| 🎯 **Product** | Nine decisions, each showing the default version of the product you inherit by leaving it blank |
| 📦 **Formats** | The eight formats compared on how much AI genuinely carries, hours to a first version, price band, and the specific way each one dies |
| ✅ **The gate** | The three criteria, scored 0–5 with **hard floors** — any single 0 or 1 kills the idea whatever the other two say |
| ⏱ **30 minutes** | The 30-Minute Validation Method as six five-minute blocks against a running clock, two of them blocking |
| 🏭 **Build** | The eight-step workflow, each step with a prompt written from your answers, gaps marked rather than invented |
| 💰 **Numbers** | Net per sale after fees and refunds, sales and traffic needed for your target, a price ladder, and hours to break even |
| 🚀 **Launch** | Listing copy assembled from your own answers, a 13-item pre-launch checklist with 6 blocking, and the first fourteen days |
| 📄 **Kit** | The lot as one Markdown document |

## Why the gate uses floors instead of an average

An idea that solves a real recurring problem for a buyer you cannot reach is not a
three-out-of-five idea. It is a zero, because you will never sell it. An idea with a reachable
buyer and no problem is also a zero, because they won't buy it. Averaging turns both into a
respectable middling score — and a respectable middling score gets the product built.

So the verdict reads the **lowest** criterion first and the total second. A 5, a 5 and a 1 is a
kill. It is meant to feel unfair; the alternative is finding out in eleven hours' time.

## Why the validation clock exists

The failure this method prevents is not researching too little. It is researching indefinitely,
which feels like diligence and is the same avoidance as building without asking. Five minutes a
block is enough to find evidence that exists and not enough to manufacture evidence that
doesn't.

Two of the six blocks are blocking, and they are the two that are usually checked last:

- **Can you actually reach them?** Three named channels, opened and checked against their own
  promotion rules — not "I'll post about it".
- **Is money already moving for this?** One instance of somebody paying something for this
  problem. Interest is not demand. Likes are not demand.

The method's real output is the **kill**. It cannot tell you a product will sell; it reliably
tells you when this one won't. The case study behind it is someone whose result was to abandon
what she was about to build — that is the method working.

## What the Numbers tab is actually for

It exists because "no marginal cost" makes people skip the sums, and the sums are unkind:

- The **fixed** payment fee doesn't shrink with the price, so under about ten units of currency
  it eats the product. The app will tell you when your price loses money on every sale.
- Refunds are modelled pessimistically and the assumption is printed: a refunded sale returns
  the price and the percentage fees, but the processor keeps its fixed fee.
- Conversion is where the optimism hides. Above 5% is a warm-audience number; if your traffic is
  strangers, every figure downstream of it is wrong by a factor of several, and the app says so.

The output that changes behaviour is **visitors per day, every day**. Most first targets turn
out to need a marketing operation rather than a side project, and it is much better to know
that before the eleven hours than after.

## On the earnings distribution

The app states plainly that digital-product earnings are severely skewed — a small minority of
listings take most of the revenue, the median earns close to nothing, and a large share never
sell a single copy. It deliberately **quotes no percentages**: the exact figures differ by
marketplace and year, and this file runs offline with no way to verify a number it would be
printing from memory. The shape is the part that should change what you do, and the shape is
not in dispute.

That is not an argument against building one. It is the argument for the first four tabs.

## Where the content comes from

The eight formats, the three criteria, the 30-Minute Validation Method and the eight-step
workflow are Chapter 7 of *The AI Income Blueprint* — the same chapter behind
[`gpt/`](../gpt/), which packages it as a custom GPT. This app is the working-tool version:
the chapter's judgement calls turned into scored gates that can return a no.

Hour ranges, price bands and earnings ceilings are this app's estimates for a first attempt by
one person. They are printed next to what they describe so you can disagree with them rather
than inherit them silently.

## Deliberate limits

- **Nothing is locked.** Fail both gates and the build prompts still work. The app makes the
  cost of ignoring the evidence visible; it doesn't take the decision off you.
- **No model is called.** The prompts are written for you to paste elsewhere. An answer you
  haven't given appears in them as `[MISSING — …]` rather than being filled in with a guess.
- **No pricing advice by category.** What block 4 finds people already paying beats any general
  rule, so the app asks you to find that instead of asserting a number.
- **No legal or tax content.** Consumer rules for digital goods differ by country; the packaging
  prompt marks those points `[CHECK LOCALLY]` rather than inventing an answer.
- **An answer under 8 characters counts as blank.** It isn't enough text to steer anything, and
  counting it would flatter every total on the page.

## Technical notes

- One file, ~140 KB. No CDN scripts, no web fonts, no images, no analytics, no network calls of
  any kind.
- State is kept in `localStorage` under `digital-products-maker.v1`, with Back up / Restore /
  Clear in the header. If the browser blocks storage the app says so and keeps working in memory.
- Light, dark and system themes; the clock keeps time across a reload and a backgrounded tab.
- 34 self-checks run on load — data integrity, the economics, both verdict engines — and report
  in the footer. Controls that trigger a redraw carry a focus key so keyboard users keep their
  place in a list.
