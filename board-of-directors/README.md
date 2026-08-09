# CLEAR AI Board of Directors

A single-file, offline app that puts a real decision in front of fifteen
directors, each of which scores it against its own mandate using *your* numbers,
argues with the others, quantifies the downside, and returns a verdict —
including "no".

Open `index.html` in any modern browser. No install, no build step, no account,
no internet connection, and no data leaves the device unless you deliberately
switch on AI mode with your own API key.

There is a second product in the same folder: [`agent/`](agent/) turns the same
board into a custom GPT, a Claude Project, a Gemini Gem, or an API call.

---

## Why this exists

The prompt "act as a board of directors and advise me" is one of the most
copied prompts on the internet, and it fails in a specific way: it produces
fifteen enthusiastic paragraphs that agree with each other and with you. The
format looks like scrutiny. It functions as flattery.

Three things are missing, and this app supplies all three.

**Arithmetic.** A board that does not compute LTV against CAC, capacity against
breakeven, or runway against time-to-revenue is not evaluating a business. It
is describing one. Every number the directors quote here is computed from your
inputs by code you can read in the file.

**Disagreement.** Real directors have conflicting mandates. The Innovation seat
wants speed; the Risk seat wants proof. Language models trained to be agreeable
smooth that away. Here each seat scores independently and the collisions are
rendered as collisions, with a chair's ruling on which one wins.

**Honesty about the inputs.** Every figure carries an evidence tag —
`MEASURED`, `ESTIMATED` or `GUESSED` — and the board's confidence score is
discounted by how much of its input is guesswork. A board that is very confident
about numbers you invented is worse than no board at all.

---

## What's in it

| Tab | What it does |
|---|---|
| 📋 **Brief** | The CLEAR intake — Context, Length, Examples, Audience, Role — plus the decision written as something that can be voted on, and your own strongest argument against it |
| 🧮 **Numbers** | ~35 inputs across offer, acquisition, capital, time and judgement, each financial figure evidence-tagged. Twelve derived metrics update live |
| 🏛 **Board** | Fifteen director reports: score out of 100, vote, concerns, opportunities, what would change the vote, recommendations |
| ⚔️ **Debate** | Where the seats agree, where they collide (with a chair's ruling), and the structural trade-offs nobody gets to avoid |
| 🎲 **Risk** | Best / expected / worst run through a 36-month cash simulation, plus a ranked pre-mortem |
| ⚖️ **Resolution** | The verdict, the weighted vote, blocking findings, conditions attached, and a confidence score that explains what it does and does not measure |
| 🗺 **Roadmap** | 30 / 90 / 365-day plans generated from the conditions, with progress saved, plus a nine-metric KPI dashboard |
| 🤖 **AI mode** | Build the full board prompt with your brief in it (no key needed), or run live directors against OpenAI, Anthropic or any OpenAI-compatible endpoint with your own key |
| 📄 **Minutes** | The whole deliberation as one Markdown document in the ten-section board format — roughly 28,000 characters for a full report |

---

## The five tests that decide most meetings

The directors are prose. This is the machinery underneath, and it runs before
any of them speaks.

```
monthly gross profit  = price × gross margin
lifetime value        = monthly gross profit ÷ monthly churn
LTV : CAC             — below 1:1 is fatal, below 3:1 is a condition
payback months        = CAC ÷ monthly gross profit
breakeven customers   = monthly burn ÷ monthly gross profit
capacity ceiling      = usable hours ÷ hours to serve one customer
runway after build    = (capital − capital required) ÷ monthly burn
```

Two of those are the ones people miss.

**Capacity against breakeven.** If your hands top out at 51 customers and
breakeven needs 47, success arrives as an operations crisis about a quarter
after it arrives as good news. If capacity is *below* breakeven, the plan
cannot reach breakeven at any level of sales success — and no amount of
marketing fixes it. There are exactly three remedies: automate, raise the
price, or add people.

**Runway against time to revenue.** If the build leaves you 1.8 months of cash
and the first customer is 4 months away, you run out before you find out. This
is invisible in a spreadsheet that models revenue but not the gap before it.

Six conditions are treated as **blocking findings**. A seat that raises one has
its score capped, because a blocking finding is the headline whatever else that
mandate liked:

- inverted unit economics (LTV below CAC)
- runway shorter than time to first revenue plus a margin
- capital required exceeds capital available
- delivery capacity below breakeven volume
- exposure exceeds the capital you said you could lose
- heavy regulatory exposure with no licensing plan or budget

---

## What it produces — the worked example

The **📎 Example** button in the top bar loads a real trade-off rather than a
demo: two people running a manual bookkeeping service in Lagos at $3,200/month,
considering turning it into $39/month software, with no engineer on the team.

The board returns **MODIFY AND RESUBMIT** at a weighted 50/100 and 50%
confidence, with two blocking findings:

| Seat | Score | |
|---|---|---|
| CEO & Strategy Chair | 80 | strong founder–market fit, real market, but names the cannibalisation |
| Africa Market | 71 | mobile money is in the plan; flags recurring-billing friction |
| Competitive Intelligence | 68 | proven demand with a genuine wedge |
| Chief Financial Officer | **32** | **BLOCKING** — 1.8 months of runway against 4 months to revenue |
| Chief Operating Officer | 28 | 546 hours of build at 20h/week is 10.5 months, not the stated 4 |
| Risk | **16** | **BLOCKING** — $12,100 of exposure against $9,000 of capital |
| Investment | 14 | probability-weighted cash at 24 months is negative |

Note what the board did *not* do. The unit economics are excellent — 13.6:1
LTV:CAC, payback in 1.1 months — and the CEO seat scores it 80. A cheerleading
board stops there and says yes. This one says the economics are fine and the
plan is still going to run out of money in month two, which is a different
sentence and a more useful one.

---

## Evidence tagging, and why the confidence score is honest

Click any evidence tag to cycle it: `GUESSED → ESTIMATED → MEASURED`.

```
confidence = 0.40 × agreement between the seats
           + 0.45 × evidence quality of your inputs
           + 0.15 × completeness of the brief
```

That is deliberately not a probability of success, and the app says so on the
Resolution page in the same size type as the score. It measures whether the
board's own inputs are worth anything. It cannot measure whether you are right,
because it has no access to your market.

The scenario probabilities work the same way. A brief built on guesses is not
neutral — it is weighted toward the worst case, because guesses are
systematically optimistic:

```
p(best)  ≈ 0.10 + 0.16 × evidence quality
p(worst) ≈ 0.42 − 0.22 × evidence quality
```

One more deliberate inversion: a score spread under 8 points across fifteen
mandates triggers a warning, not a celebration. Unanimity means one input is
dominating every seat, or the brief is too vague to disagree about.

---

## AI mode

Two routes, and the one that needs no API key is the one most people should use.

**Copy the prompt.** Builds the complete board prompt — the fifteen-seat system
prompt, your brief, your figures with their evidence tags, the arithmetic
already computed, and the offline board's own verdict for the model to argue
with. Paste it into ChatGPT, Claude, Gemini, anything. About 7,500 characters.

**Live directors.** Calls OpenAI, Anthropic, or any OpenAI-compatible endpoint
(OpenRouter, Together, a local server) directly from the page. Your key is
stored in this browser and sent to nobody but the provider you chose — there is
no server in this product for it to be sent to, which you can verify by reading
the file. Browser-origin calls are sometimes blocked by CORS or by corporate
networks; when that happens the copy-the-prompt route still works.

The offline engine and the language model check each other. The engine cannot
read your market; the model cannot do compound arithmetic reliably. Feeding the
engine's numbers to the model is the point.

---

## Selling it

[`sell/`](sell/) contains the storefront, ready to configure:

| File | What it is |
|---|---|
| [`sell/index.html`](sell/index.html) | A complete sales landing page — hero, the argument, the worked example as proof, pricing tiers, FAQ. Self-contained and offline like everything else here; host it anywhere. Set `gumroadUrl` and your prices in the `CONFIG` block at the bottom of the file and the page wires itself up. Until you do, it shows a seller-only banner telling you the checkout is still a placeholder |
| [`sell/gumroad-listing.md`](sell/gumroad-listing.md) | Every Gumroad field written out paste-ready: name, summary, tags, the full description, version pricing, what to zip, cover art instructions, receipt note, and a day-7 follow-up email |

This folder is built to be sold. Three separable products:

| Product | Files | Suits |
|---|---|---|
| The app | `index.html` alone | Gumroad, Payhip, Lemon Squeezy, Etsy digital downloads |
| The agent | `agent/` | The same stores, plus listing the GPT in the GPT Store |
| The bundle | the whole folder | The version that actually converts |

The app is the part with no substitute: it runs with no API key, no account and
no network, which is exactly what a buyer facing metered data and unreliable
power needs. The agent pack is the part that is easy to demo. Sell the demo,
deliver the tool.

**Before you list it, three things.**

1. **The disclaimer belongs on the listing, not only inside the product.** This
   is a decision-support tool, not financial, legal, tax or investment advice.
   Selling something that reads like advice to people who will act on it is
   regulated in most places. Say plainly what it is: structure and arithmetic
   applied to figures the buyer supplies.

2. **Do not claim outcomes.** "Make better decisions" is a claim about a
   process and is defensible. "Increase revenue 40%" is a claim about a result
   you cannot produce and should not make.

3. **Decide your licence before the first sale, not after.** Single-user,
   team, or resale rights — an unstated licence defaults to a dispute. The
   whole product is one readable HTML file, so anyone who buys it can also read
   and copy it. Price accordingly, and compete on updates and support rather
   than on obscurity.

`agent/configuration.md` has the listing mechanics: platform-by-platform setup,
recommended settings, and what to put in each field.

---

## What this is not

It is a scoring engine applying fixed rules — which you can read in the file —
to figures you supply. It has no access to your market, your customers or your
books, and it cannot verify a single number you enter.

The thresholds it uses (3:1 LTV:CAC, 18-month payback, three months of reserve)
are conventions. They are defensible and they are not laws; a business can work
at 2:1, it is simply harder.

It is not a substitute for a real board with fiduciary duty, an accountant, or
a lawyer. Anything involving other people's money, regulated activity or debt
should be checked by someone qualified and accountable.

And it cannot stop you tuning the inputs until you get the answer you wanted.
That is the one failure mode the format cannot prevent — the evidence tags only
make it visible.

---

## Technical notes

- One file, ~186 KB, no dependencies, no build step, no network requests.
  Verified in Chromium: zero external requests with AI mode off.
- State persists to `localStorage` under `clear-board-v1`. Back up and restore
  as JSON from the top bar; the API key is excluded from backups.
- The whole deliberation re-runs on any input change, debounced.
- Light, dark, and system themes; no horizontal overflow at 390 px; print
  stylesheet renders every panel for save-as-PDF.
- The engine is plain functions — `buildModel`, `simulate`, the fifteen
  `DIRECTORS[].run` scorers, `runBoard` — and is testable in Node by extracting
  the `<script>` block.
