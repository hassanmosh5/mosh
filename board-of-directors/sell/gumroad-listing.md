# Gumroad listing — paste-ready

Everything Gumroad asks for, written out. Copy each block into the matching
field. Gumroad's description editor takes rich text (headings, bold, lists,
links, code blocks) but **not** raw HTML or CSS — so the copy below is written
to survive being pasted as plain rich text.

The landing page in [`index.html`](index.html) is the *other* half of this: host
it yourself and point it at the Gumroad product, or skip it and let the Gumroad
page do all the work. Both are written from the same argument.

---

## Product setup

| Field | Value |
|---|---|
| **Name** | CLEAR AI Board of Directors |
| **URL / permalink** | `clear-board` → `https://YOURNAME.gumroad.com/l/clear-board` |
| **Type** | Digital product |
| **Call to action** | `I want this!` (Gumroad default converts fine — "Buy this" also works) |
| **Category** | Business & Money → Entrepreneurship, or Software → Productivity |
| **Summary** (shows under the title) | Fifteen directors score your decision against your own numbers, argue with each other, simulate the downside for three years, and return a verdict that is allowed to be no. One HTML file. Works offline. No API key. |

### Tags

```
business decision making, startup tools, decision framework, board of directors,
business plan, unit economics, offline app, ai prompt, custom gpt, founders,
small business, risk analysis
```

Gumroad's search is weak; tags matter less than the title and the summary. Put
the words a buyer would actually type — "should I launch this", "business
decision tool" — into the summary rather than hoarding them in tags.

---

## Pricing

Three versions on one product. Gumroad calls these **Versions** — one product,
one page, a dropdown at checkout. Do not create three separate products; you
will split your reviews and your search ranking three ways.

| Version | Price | Contains |
|---|---|---|
| The app | $29 | `index.html` + README |
| **App + agent pack** *(default)* | **$39** | everything above, plus `agent/` |
| Team licence | $99 | everything, licensed for a team and for client work |

Set the **App + agent pack** version as the default selection. It is the one
most buyers should take, and the $29 tier exists mainly to make $39 look like
the sensible choice rather than the expensive one.

**On pricing this at all.** These numbers are a starting point, not a
recommendation with evidence behind it. Nobody has paid for this product yet, so
its price is a guess — which is exactly the kind of figure the app itself would
tag `GUESSED` and discount. Launch at $39, watch the first twenty sales, and
move it. Under-pricing a decision tool is a real risk: a $9 price signals a
novelty, and buyers making a $10,000 decision do not shop for novelties.

**Purchasing power parity.** Turn Gumroad's PPP discount on if you are selling
into Africa, South Asia or Latin America. The product is built for buyers on
metered data and unreliable power; pricing it in US dollars without PPP prices
most of them out of it.

---

## Description — paste this into the description field

> **The problem with "act as a board of directors"**
>
> You have probably run that prompt. Fifteen enthusiastic paragraphs come back,
> they agree with each other, and they agree with you. It looks like scrutiny.
> It functions as applause.
>
> Three things are missing, and this fixes all three.
>
> **1. It does the arithmetic.**
>
> Before a single director speaks, the engine computes — from your own figures —
> gross profit per customer, lifetime value against acquisition cost, CAC
> payback, how many customers breakeven actually needs, how many customers your
> own hands can physically serve, and how much runway is left after the build.
>
> Two of those end businesses, and almost nobody calculates them:
>
> - **Capacity against breakeven.** If your hands cap you at 51 customers and
>   breakeven needs 47, success arrives as an operations crisis a quarter after
>   it arrives as good news. If capacity is *below* breakeven, the plan cannot
>   reach breakeven at any level of sales success — and no amount of marketing
>   repairs that.
> - **Runway against time to revenue.** If the build leaves you 1.8 months of
>   cash and your first customer is 4 months away, you run out before you find
>   out. Invisible in a spreadsheet that models revenue but not the silence
>   before it.
>
> **2. The directors disagree with each other.**
>
> Real boards have conflicting mandates — Innovation wants speed, Risk wants
> proof. Each of the fifteen seats scores your decision against its own mandate
> only, and where two seats reach opposite conclusions from identical facts, you
> get the argument in full plus the chair's ruling on which one wins.
>
> Six findings are treated as **blocking**: inverted unit economics, runway
> shorter than time to revenue, a funding gap, capacity below breakeven,
> exposure above the capital you said you could lose, and heavy regulation with
> no licensing plan. A director who raises one cannot also report a comfortable
> score.
>
> **3. It is honest about your inputs.**
>
> Every figure you enter is tagged `MEASURED`, `ESTIMATED` or `GUESSED`. The
> confidence score is discounted by how much of the board's input is guesswork,
> and the report says so out loud. Scenario probabilities lean toward the worst
> case when the evidence is thin — because guesses are systematically
> optimistic.
>
> If all fifteen scores land within 8 points of each other, the app warns you.
> That much agreement means one input is dominating every seat. A board that
> agrees on everything has one director wearing fifteen hats.
>
> ---
>
> **What it looks like in practice**
>
> The app ships with a worked example you can load in one click: two people
> running a manual bookkeeping service in Lagos at $3,200/month, thinking about
> turning it into $39/month software, with no engineer on the team.
>
> The unit economics are excellent — 13.6:1 lifetime value to acquisition cost,
> payback in 1.1 months. A cheerleading board stops there and says yes.
>
> These fifteen said:
>
> - CEO & Strategy Chair — **80** — strong founder–market fit, real market, but names the cannibalisation
> - Africa Market — **71** — mobile money is in the plan, which is correct
> - Competitive Intelligence — **68** — proven demand with a genuine wedge
> - **Chief Financial Officer — 32 — BLOCKING:** 1.8 months of runway against 4 months to first revenue
> - Chief Operating Officer — **28** — 546 hours of build at 20h/week is 10.5 months, not the stated 4
> - **Risk Director — 16 — BLOCKING:** $12,100 of exposure against $9,000 of capital
> - Investment Director — **14** — probability-weighted cash at 24 months is negative
>
> Verdict: **MODIFY AND RESUBMIT**, 50/100, confidence 50%.
>
> Not "no". Not "yes, go for it". The economics are fine *and* the plan runs out
> of money in month two — a different sentence, a more useful one, and one you
> can act on this week.
>
> ---
>
> **What you get**
>
> **The app** — one HTML file. Open it and it runs. No install, no build step,
> no account, no API key, no internet.
>
> - **Brief** — the CLEAR intake: Context, Length, Examples, Audience, Role
> - **Numbers** — around 35 inputs, twelve derived metrics updating live
> - **Board** — fifteen director reports with scores, concerns, and what would change each vote
> - **Debate** — the collisions between seats, with a chair's ruling on each
> - **Risk** — three 36-month cash simulations and a ranked pre-mortem
> - **Resolution** — verdict, weighted vote, blocking findings, conditions attached
> - **Roadmap** — 30/90/365-day plans with saved progress, and nine KPIs with targets from your own numbers
> - **Minutes** — the whole deliberation as roughly 28,000 characters of Markdown
>
> **The agent pack** — the same fifteen seats as a hosted AI agent: a
> ready-to-paste system prompt, configuration for a ChatGPT custom GPT, a Claude
> Project, a Gemini Gem or a raw API call, and a knowledge file documenting the
> entire method — formulas, thresholds and failure modes.
>
> The app also builds a complete board prompt with your brief and figures
> already in it, ready to paste into any free chat model. No key needed. Or add
> your own key and run live directors against OpenAI, Anthropic, or any
> compatible endpoint.
>
> ---
>
> **Your data never leaves your machine**
>
> With AI mode switched off the file makes zero network requests. Everything you
> type is saved in your own browser and can be backed up to a JSON file. There
> is no server in this product, no account, and no database — which you can
> verify yourself, because the whole thing is one readable file.
>
> ---
>
> **Do not buy this if**
>
> - You want it to say yes. It is designed to be capable of saying no, and it will.
> - You have no figures at all and no willingness to estimate any. It computes; it cannot conjure.
> - You want a business plan template, a pitch deck, or automated bookkeeping. This is none of those.
> - You need regulated financial, legal or tax advice. Buy an hour with a professional instead.
>
> ---
>
> **Buy it if**
>
> - You are about to commit real money or real months to something you cannot fully undo.
> - You want the argument *against* your plan in writing, before you find it the expensive way.
> - You have to convince a partner, a lender, a spouse, or an internal approver.
> - You work where data is metered and power is unreliable, and offline is not a nice-to-have.
>
> ---
>
> **What this is not**
>
> A decision-support tool, not an oracle. It applies fixed rules — which you can
> read in the file — to figures you supply. It has no access to your market,
> your customers or your books, and it cannot verify a single number you enter.
> Its confidence score measures agreement between its own seats and the quality
> of your inputs; it cannot measure whether you are right.
>
> It is not financial, legal, tax or investment advice, and not a substitute for
> a real board, an accountant, or a lawyer. Anything involving other people's
> money, regulated activity or debt should be checked by someone qualified and
> accountable.
>
> 30-day refund, no questions asked.

---

## The files you upload

Zip this structure and upload it as the product content. For the **App** version,
upload a zip containing only the first two.

```
clear-ai-board-of-directors/
├── index.html          ← the app; this is the product
├── README.md           ← what it does, the arithmetic, the honest limits
├── LICENCE.txt         ← whichever tier they bought (write this before launch)
└── agent/              ← bundle and team versions only
    ├── instructions.txt
    ├── configuration.md
    └── knowledge/
        └── board-method.md
```

Gumroad can attach different files to different versions. Use that rather than
maintaining three zips by hand.

---

## Cover and thumbnail

Gumroad wants a **cover** at 1280×720 (16:9) and a square **thumbnail** at
600×600.

You already own the best possible cover art: a screenshot of the Resolution page
with the verdict, the two blocking findings and the fifteen vote bars visible.
It shows the product disagreeing with someone, which is the entire pitch, and it
is honest because it is the actual output.

Take it yourself:

1. Open `../index.html`
2. Click **📎 Example** in the top bar
3. Go to the **⚖️ Resolution** tab
4. Screenshot at a wide window; crop to 1280×720 around the verdict and vote bars

For the square thumbnail, crop tighter — the `MODIFY AND RESUBMIT` verdict block
and the four stat tiles underneath it are enough, and stay legible at the small
size Gumroad renders in its grid.

Do not put a stock photo of people around a boardroom table on it. Every
competing listing has one, and none of them show the product.

---

## Receipt / thank-you note

> Thank you — the board is yours.
>
> **Start here:** unzip, then open `index.html` in any browser. It runs
> immediately; there is nothing to install and nothing to sign into.
>
> **First run:** click **📎 Example** in the top bar. It loads a real trade-off
> with real numbers so you can see what a full report looks like before you type
> anything of your own. Then hit **🗑 Clear** and enter your own decision.
>
> **Give it twenty minutes.** The Brief page and the Numbers page are the whole
> job — the fifteen reports, the debate, the risk model and the roadmap all
> generate from them. Rough figures are fine; tag them `GUESSED` and the board
> will discount its own confidence accordingly rather than pretending.
>
> **If it tells you not to do the thing:** it has no authority over you. But it
> will have written down exactly which of your numbers has to be wrong for you
> to be right. Keep that list. Check it in 90 days.
>
> Reply to this email if anything is unclear or broken. I read every one.

---

## First follow-up email (send at day 7)

> Did the board disagree with you?
>
> If you have run it once, the most useful thing you can do now is run it again
> in 90 days with the figures you actually observed instead of the ones you
> assumed. The value was never in the first verdict — it is in seeing which
> assumption was wrong, and how quickly you found out.
>
> Two things people miss on the first pass:
>
> **The evidence tags are not decoration.** Click each one. If most of your
> inputs are `GUESSED`, the confidence score drops and the risk model shifts
> toward the worst case, on purpose. Replacing your three biggest guesses with
> measured figures changes the verdict more than any other edit you can make.
>
> **The Debate page is where the thinking is.** The scores tell you what the
> board concluded. The debate tells you *why the seats disagreed*, which is the
> part you can argue with.
>
> If it has been useful, a review on the product page helps more than you would
> think. If it has not, reply and tell me why — I would rather fix it than keep
> your money.

Do not automate more than two emails. This is a tool, not a course, and a
five-part sequence about a single HTML file reads as desperation.

---

## Before you press publish

**The disclaimer goes on the listing, not only inside the product.** It is in
the description above — keep it there. Selling something that reads like
financial advice to people who will act on it is regulated in most places.

**Claim a process, never an outcome.** "Find the flaw in your plan before it
costs you" describes what the tool does. "Increase your revenue 40%" is a claim
about a result you cannot produce and should not make. Gumroad will not stop
you; a chargeback and a bad review will.

**Write the licence before the first sale, not after.** Single user, team, or
resale — an unstated licence is a dispute waiting to happen. Remember that the
whole product is one readable HTML file, so anyone who buys it can also read it
and copy it. That is fine. Compete on updates, support and trust rather than on
obscurity, and price accordingly.

**Do not fake social proof.** No invented testimonials, no "as featured in", no
made-up sales counts. The landing page ships with no testimonial section for
exactly this reason — add one when you have real quotes from real buyers, with
their permission.

**Refunds are cheaper than bad reviews.** The 30-day no-questions policy in the
copy above is there deliberately. Someone who wanted a template and got a
scoring engine should get their money back quickly and without an argument.
