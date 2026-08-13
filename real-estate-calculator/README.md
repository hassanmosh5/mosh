# Real Estate Calculator

A single-file, offline underwriting tool for a property deal: what it actually costs to buy,
what a lender will actually lend, what the tenant actually leaves you after tax, and how far
your assumptions can be wrong before the whole thing stops working.

Open `index.html` in any modern browser — no install, no build step, no accounts, no internet
connection, and no data ever leaves the device.

**It is not a yield calculator.** Rent divided by price takes two seconds and answers nothing.
Everything here exists because that number is missing the stamp duty, the void, the capital
reserve, the lender's stress test, the finance-cost restriction and the day the fix ends.

## The argument the app makes

Most property spreadsheets compute a gross yield, subtract a mortgage payment, and stop. Three
things follow from taking the rest seriously, and the app is built around them:

1. **The price is not the cost.** Purchase tax, legal fees, a surcharge on an additional
   property, the works and the contingency routinely add 10–15% before the first tenant moves
   in. Every percentage the app reports — cash-on-cash, IRR, equity multiple — is measured
   against the cash that actually left your account, never against the deposit.
2. **The lender, not the deposit, decides how much you borrow.** A 75% LTV product is not a 75%
   loan. A UK buy-to-let is capped by rent divided by a stressed rate; a US-style DSCR loan is
   capped by NOI divided by the payment. When that cap binds it is the deposit that moves, and
   the app moves it, which is why the cash requirement is often larger than the percentage you
   typed.
3. **The interesting number is the break-even, not the return.** Every deal works on its own
   assumptions. The app solves for the rent, the interest rate, the void level and the price
   fall at which it stops working, and shows the distance between each of those and today.

## The tabs

| Tab | What it does |
|---|---|
| 🏠 **Deal** | Price, works, and the purchase-tax table for eleven regimes — editable band by band, because they change at every Budget. Ends with the all-in cost and the cash required |
| 🏦 **Finance** | Rate, term, interest-only or repayment, the fix and the revert. Then the two lender caps side by side, and which one binds |
| 💷 **Cash flow** | Twelve operating cost lines, voids, arrears, the tenant-find fee amortised over the tenancy, and four income-tax regimes — waterfalled from asking rent to what reaches your account |
| 📈 **Returns** | Eight measures that all claim to be "the return", each with what it leaves out; the rules of thumb, annotated; and the break-even table |
| 🗓 **Projection** | Year by year to exit with rent, cost and value growth diverging, the revert rate landing, CGT on the sale, IRR and the profit decomposed into cash, amortisation and assumed growth |
| 🔨 **Flip & BRRRR** | Bridging by the month with rolled or serviced interest, the maximum bid for a target profit solved backwards through the purchase tax, and a refinance whose limit is usually the rent rather than the valuation |
| ⚖️ **Rent vs buy** | Both sides invest — the renter puts the deposit and the monthly difference into a market — with the capital growth rate that makes them tie |
| 🧪 **Stress** | Cash flow at every combination of rate and rent, what breaks it first, and a bad year priced in full |
| 📊 **Compare** | Saved deals ranked side by side, because the best yield and the best IRR are rarely the same property |
| 📄 **Report** | The whole underwrite as one Markdown document, including the assumptions table you will have forgotten in six months |

## The parts most calculators get wrong

**The finance-cost restriction.** A UK individual landlord cannot deduct mortgage interest from
rental profit. Tax is charged on rent minus running costs — the figure *before* interest — and
interest returns only as a basic-rate credit capped by the tax due. On a higher-rate taxpayer
with a large loan this single line is the difference between a deal that works and one that does
not. The Cash flow tab prints what the restriction costs you in money, against what the same
year would have cost when interest was deductible.

**The lender's stress test.** At 145% cover and a 5.5% stress rate, £1,000 of monthly rent
supports about £150,000 of borrowing regardless of the LTV on the product sheet; at an 8.5%
stress rate the same rent supports about £97,000. The app computes both caps, shows which binds,
and adds the shortfall to your cash requirement rather than quietly ignoring it.

**Stress testing a loan you have already drawn.** Once the money is borrowed the loan is a fact.
A rent fall three years later does not shrink it — so every stress test and every break-even in
the app holds the drawn loan still. Letting the lender's test resize the loan while rent moves
makes a deal look robust when it is not, and it is an easy mistake to make.

**Capital reserve.** Roofs, kitchens, bathrooms and windows are not repairs; they are
replacements on a 10–20 year cycle. They are a real annual cost whether or not you accrue for
them, and they are the most commonly omitted line in the whole model.

**Purchase tax as a step function.** Because progressive bands and a surcharge cliff cannot be
rearranged, the maximum bid for a target flip profit is *solved* rather than approximated — the
answer accounts for the tax changing as the price moves.

## Break-evens, and how they are found

Every break-even is a bisection over the same cash-flow engine that produces the headline
numbers, so they cannot drift apart from each other:

- **Break-even rent** — the rent at which cash flow reaches zero, with the loan held still
- **Break-even rate** — the interest rate at which it reaches zero, compared against your own
  revert rate, which is the risk with a date attached
- **Break-even void** — the share of the year empty before the deal stops paying
- **Price fall to an LTV breach** — the fall that leaves you unable to remortgage, which ends
  more portfolios than negative cash flow does

The same solver produces the maximum bid for a target flip profit, the break-even sale price on
a flip, and the capital growth rate at which buying and renting tie.

## What it deliberately does not do

- **Predict house prices.** Capital growth is an input, and the Projection tab shows what the
  deal returns with that input set to zero. If everything positive disappears, the deal is a bet
  on prices rather than an investment, and it should be sized like one.
- **Model anyone's tax code precisely.** Four coarse regimes — restricted interest, deductible
  interest, company, none — with your own marginal rate. It is a decision tool, not a return.
- **Value the property.** ARV and post-works value are yours to justify with comparables.
- **Count the intangibles in rent versus buy.** Security of tenure and the freedom to move are
  real and are not modelled; nor is the fact that almost nobody actually invests the difference
  every month, which makes the renter's column a best case.
- **Give advice.** Nothing here is financial, tax or legal advice.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of any
  kind. Verified with a browser run asserting zero non-`file://` requests.
- **Everything is saved** to `localStorage` as you type. `⬇ Back up` downloads the lot as JSON,
  `⬆ Restore` reads it back, and `🗑 Reset` backs up first, then returns to the worked example.
  Storage failures (private mode, `file://` restrictions) degrade to in-memory with a warning
  rather than breaking the app.
- **Twelve currencies**, and every figure follows the one you pick.
- **Light and dark**, following your system setting, with a manual toggle.
- **Accessible.** Real form controls throughout, every input labelled, arrow-key tab navigation,
  visible focus rings, live-region toasts, and all animation disabled under
  `prefers-reduced-motion`.
- **Responsive** to 390px with no horizontal page scroll on any tab; wide tables scroll inside
  their own containers.
- **Exports** as Markdown (the full underwrite), CSV (the projection, and the deal comparison)
  and JSON (a complete backup).

## Verification

Checked in headless Chromium — 128 assertions covering the arithmetic against hand
calculations (band tax at and either side of every threshold, the first-time-buyer relief cliff,
payment on an amortising loan, interest-only balances, principal repaid equalling the loan, the
rate change at the end of a fix, IRR against a known series, and all four tax regimes), a
worked deal whose every figure — EGI, opex, NOI, cash flow, cap rate, cash-on-cash, DSCR, each
break-even, IRR, total profit, equity multiple — is asserted against a hand calculation, the
identities (cash flow is zero at each break-even, NPV at the IRR is zero to nine decimal places,
the profit decomposition reconciles to the total, the flip's break-even sale price yields zero
profit, the maximum bid hits the target profit exactly, cash out plus cash left in equals cash
in), the lender caps, rolled versus serviced bridging interest, save/restore and its repair of a
deliberately damaged file, escaping of user text, focus surviving a re-render, no external
requests, and no horizontal overflow at 390/768/1280px on all ten tabs.

## What will go stale

The purchase-tax tables, first — every one of them is dated in the interface and editable band
by band for that reason. Stress rates and cover ratios move with the market. The tax regimes
move with governments. What will not go stale is the shape of the thing: that the price is not
the cost, that the lender decides the loan, and that a deal which only works at today's rate is
a deal that only works today.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub Pages.
Served from this repo's root, the app lives at `/real-estate-calculator/`.
