# The board method — reference knowledge

Upload this as the agent's knowledge file. It is the reasoning the app performs
in code, written out so a language model can perform it consistently.

---

## 1. The five figures that decide most meetings

Before any director speaks, compute these. If any one of them fails, that is
the headline of the meeting and everything else is commentary.

### Gross profit per customer per month

```
monthly gross profit = price × gross margin
```

For annual billing, divide by 12. For a one-off product, multiply by the number
of repeat purchases per year and divide by 12. This single figure appears in
four of the five tests below.

### LTV : CAC

```
lifetime (months) = 1 ÷ monthly churn rate
lifetime value    = monthly gross profit × lifetime
ratio             = lifetime value ÷ cost to acquire one customer
```

- **Below 1:1** — every customer loses money. Growth accelerates the loss. This
  is a blocking finding, not a concern.
- **1:1 to 3:1** — survives only if CAC never rises. CAC always rises once the
  warm audience is spent.
- **Above 3:1** — workable. State how much CAC headroom exists before it breaks.

For a non-subscription product, value the customer over a stated horizon —
24 months is a defensible default — and say that you have done so.

### CAC payback

```
payback months = cost to acquire ÷ monthly gross profit
```

Above about 18 months on a monthly subscription, every customer is a loan the
business makes to itself, repaid more slowly than a small business can survive.
The lifetime value arrives long after the cash has gone.

### Breakeven volume against capacity

```
breakeven customers = monthly fixed cost ÷ monthly gross profit
capacity ceiling    = usable hours per month ÷ hours to serve one customer
```

Where capacity is below breakeven, **the plan cannot reach breakeven at any
level of sales success**. This is the finding founders most reliably miss,
because it is invisible in a spreadsheet that models revenue but not hours.
There are exactly three remedies: automate, raise price, or add people.

A rough conversion from an automation score of 1–10 to hours per customer per
month: 10 → 0.15 h, 7 → 1.2 h, 4 → 2.2 h, 1 → 3.2 h. Assume roughly 70% of
available hours go to delivery and 30% to selling.

### Runway against time to revenue

```
runway after build = (capital − capital required) ÷ monthly burn
```

Where this is shorter than months-to-first-revenue plus a margin of about three
months, the business runs out of money before it finds out whether it works.
Blocking finding.

---

## 2. Evidence tagging

Every figure is **MEASURED**, **ESTIMATED** or **GUESSED**. Carry the tags
through the whole report. A board that is confident about numbers the proposer
invented is worse than no board at all.

Evidence of willingness to pay, weakest to strongest:

| Level | Evidence | What it actually proves |
|---|---|---|
| 0 | Nothing | Nothing |
| 1 | "People said they'd buy" | That people are polite |
| 2 | A waitlist | Curiosity, at zero cost |
| 3 | Pre-orders or deposits | The first honest signal |
| 4 | Paying customers at this price | The price is real |
| 5 | Renewals | The product is real |

Levels 0 and 1 mean the Customer Advocate should not be outvoted. Nobody has
paid, so every projection describes a person who does not exist yet.

---

## 3. Scenarios, run properly

Move the inputs, not the adjectives. Simulate month by month for 36 months.
Customers arrive subject to whichever ceiling binds first — cash available for
acquisition, hours available for selling, or the share of the remaining market
anyone could plausibly win in a month — and leave at the churn rate.

| Multiplier applied to | Best | Expected | Worst |
|---|---|---|---|
| Cost to acquire | ×0.65 | ×1.00 | ×1.95 |
| Churn | ×0.60 | ×1.00 | ×1.75 |
| Growth velocity | ×1.55 | ×1.00 | ×0.45 |
| Time to first revenue | ×0.75 | ×1.00 | ×1.65 |
| Capital required | ×0.90 | ×1.00 | ×1.35 |

Report for each branch: customers at 12 and 24 months, the month breakeven is
reached (or that it is not), the lowest cash point, and whether the business
runs out of money and when.

Weight the branches by **evidence quality**, never by how the proposer feels:

```
p(best)  ≈ 0.10 + 0.16 × evidence quality
p(worst) ≈ 0.42 − 0.22 × evidence quality
p(expected) = the remainder
```

A brief built on guesses is not neutral. It is weighted toward the worst case,
because guesses are systematically optimistic.

---

## 4. The confidence score

```
confidence = 0.40 × agreement between seats
           + 0.45 × evidence quality of the inputs
           + 0.15 × completeness of the brief
```

State plainly what this is: a measure of internal agreement and input quality.
It is **not** a probability that the decision is correct. A board can be
confidently wrong, and this one has no access to the proposer's market.

A very *low* score spread — under about 8 points across fifteen mandates — is
itself a warning. It usually means one or two inputs are dominating every seat,
or the brief is too vague for the mandates to disagree about. Unanimity is a
defect.

---

## 5. Resolution thresholds

Compute a weighted score across the seats. Suggested weights: Strategy and
Finance 1.3; Risk and Customer Advocate 1.2; Product 1.1; Africa 1.2 when
Africa is the primary market and 0.4 otherwise; Innovation 0.7; Human Capital
0.8; Technology and Legal 0.9; all others 1.0.

| Condition | Resolution |
|---|---|
| 3+ blocking findings, or weighted below 30 | REJECT |
| Any blocking finding and weighted below 48 | REJECT |
| Any blocking finding | MODIFY AND RESUBMIT |
| Weighted 74+ | PROCEED |
| Weighted 58–73 | PROCEED WITH CONDITIONS |
| Weighted 45–57 | MODIFY AND RESUBMIT |
| Below 45 | DEFER |

MODIFY AND RESUBMIT is not a refusal and should not be delivered as one. It
means the idea survives and this version of the plan does not — usually a
matter of weeks.

DEFER is the honest answer when the inputs that would make the decision
decidable have not been gathered. Deferring is cheap. Deciding blind is not.

---

## 6. Africa-specific reality checks

Apply these whenever the primary market is African, diaspora, or cross-border.
They are the ones that most reliably break plans imported from elsewhere.

- **Payment rails.** Card penetration is low and recurring-card failure rates
  are high across much of the continent. Mobile money is the default rail for
  most consumer and small-business customers. A subscription product with cards
  only will show involuntary churn on top of real churn.
- **Data cost.** Data is metered and expensive relative to income. A heavy
  application is a recurring cost the customer pays in order to use your
  product. Set a page-weight budget; make the core function work on 3G or
  offline.
- **Power.** Where mains supply is unreliable, customers already budget for
  fuel and inverters. Any product competing for that same wallet loses. Test on
  a phone at 15% battery after six hours without power.
- **Recurring billing is cultural, not only technical.** Many customers prefer
  to pay when they use rather than commit monthly. Offer pay-as-you-go or a
  3-month prepaid option alongside any subscription and compare retention.
- **Multi-country is not one market.** Each country has its own regulator,
  rails, currency and language of business. Treat the second country as a fresh
  launch with its own budget and its own board review, after the first is
  genuinely won.
- **Price against local income**, not against a US comparison. A figure that
  reads as trivial in dollars can be a meaningful share of discretionary
  monthly income.
- **Distribution runs through trust.** WhatsApp is the region's actual
  customer-service and distribution layer, not an afterthought. A local
  founder's network is an advantage foreign entrants cannot buy.

---

## 7. Failure modes of this board itself

Name these when they apply. A board that cannot audit itself is a horoscope.

- **Garbage in.** Every figure is the proposer's. The arithmetic is exactly as
  good as the inputs and no better.
- **No market access.** The board cannot verify a market size, a competitor
  claim, or whether customers exist. It can only check internal consistency.
- **Fixed rules.** The thresholds above are conventions, defensible but not
  laws. A business can work at 2:1 LTV:CAC; it is simply harder, and the board
  should say which it is.
- **Anchoring.** A proposer who wants a yes will tune the inputs until they get
  one. That is the failure mode this format cannot prevent — only the evidence
  tags make it visible.
