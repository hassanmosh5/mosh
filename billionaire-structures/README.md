# Billionaire Structures Guide

A single-file, offline guide to the holding companies, trusts, partnerships, foundations and
family offices that large fortunes are actually held in — with the arithmetic that decides
which of them, if any, you should own.

Open `index.html` in any modern browser — no install, no build step, no accounts, no internet
connection, and no data ever leaves the device.

**It is not a list of what rich people have.** That list is free and useless. Everything here
exists because each of those structures has an annual bill, a failure mode, and a level of
wealth below which it costs more than it will ever save — and almost nobody who sells them
says so.

## The argument the app makes

1. **There are only four questions.** Who controls it, who pays the tax on it, what can be
   taken from it, and what happens to it when you die. Every structure in the library is an
   answer to one of them. If you cannot say which one you are trying to answer, you are
   shopping rather than planning.

2. **Most of the field is an answer to a tax half the world does not pay.** Freezes, discounts,
   insurance trusts and perpetual trusts all exist to reduce a transfer tax. Ghana, Nigeria,
   Kenya, India, Australia, Singapore and the UAE do not levy one. Select any of them and the
   app rules those structures out by name — and says what the real exposure is instead:
   succession law, administration delay, forced heirship, and assets sitting in a country that
   *does* tax them.

3. **The bill has a date; the assets do not.** A business sells in eighteen months and the tax
   is due in nine. That mismatch, not the rate, is what breaks estates — and it is why the app
   computes the liquidity gap before it computes anything clever.

4. **Control is what unwinds the whole thing.** Every system has a rule that treats an asset
   you gave away but still direct as though you never gave it away. The retained-control audit
   is the practical version of that rule, and it can fail a plan on one line.

5. **The line between planning and evasion is not the structure — it is whether the structure
   is real and whether it is reported.** Arranging your affairs to attract less tax is lawful
   and always has been. Concealment is a separate offence with its own penalties, and it does
   not become planning by being expensive.

## The tabs

| Tab | What it does |
|---|---|
| 🧭 **Position** | Eleven asset classes with their cost basis and how long each really takes to sell, debts, family shape, five exposure scores, jurisdiction and horizon. Everything else is derived from this page |
| 🏛 **Structures** | The library: 33 structures, each with who owns it, who controls it, who pays the tax, what happens at death, what it costs to build and keep, what it does *not* do, and how it fails — plus a verdict computed from your own numbers |
| ⚖️ **Fit** | Every structure ranked by benefit against annual cost, the level of wealth at which each one starts to pay, an ownership chart drawn from the ones that passed, and the total running cost of the whole arrangement in basis points |
| 💀 **Death tax** | Fifteen dated regimes, editable band by band. The full waterfall from gross estate to what heirs receive, the projection as the estate compounds against a frozen exemption, and every jurisdiction compared on the same estate |
| 🧊 **Freeze** | GRAT, sale to a grantor trust, valuation discounts and annual gifting on the same asset, side by side — with the statutory hurdle each has to beat and what each costs when it fails |
| 💧 **Liquidity** | What falls due, what can be raised inside the payment window, the forced-sale discount on the difference, and why a policy you own has to be bigger than the hole it fills |
| 🎛 **Control** | Voting and economics split apart, the family table that results, and an eight-point audit of what you have retained — the facts that pull a transfer back into your estate |
| ❤️ **Giving** | The crossover between a donor-advised fund and a private foundation, solved rather than asserted; remainder and lead trusts, including the minimum-remainder test a badly-set trust actually fails |
| 🚩 **Red lines** | A twelve-point audit with four blocking items, the doctrines that unwind structures, what has to be reported to whom, and the arrangements that are not structures at all |
| 📄 **Report** | The whole review as Markdown, the verdict table as CSV, and the questions worth paying an adviser an hour to answer |

## The parts most guides get wrong

**The marginal rate is read off the schedule, not asserted.** It is computed by evaluating the
whole rate function at the chargeable estate and at a thousand more — so it picks up an
exemption not yet used up (marginal rate zero, and every tax-driven structure correctly ruled
out), a band boundary, and the UK residence band tapering away, which produces a marginal rate
*above* the headline 40%. A flat "40%" assumption cannot show any of that.

**Benefits are never added up.** Several structures shelter the same assets from the same tax.
Summing their benefits — which is how the field is usually sold — produces a number that is
simply false, so the app refuses to and says why.

**Protection is priced against expected loss.** An offshore trust is compared with the annual
probability of a claim multiplied by what it could reach, and for most readers it loses badly.
The probabilities are deliberately modest: inflate them and every trust looks like a bargain,
which is exactly how they are sold.

**Insurance is grossed up for the tax on itself.** A policy in your estate is taxed before it
pays the tax it was bought to pay, so the cover needed is the gap divided by one minus the
marginal rate. That circularity is the entire arithmetic case for an insurance trust, and the
app shows both numbers side by side.

**The techniques are shown failing.** A GRAT at or below the hurdle rate returns everything to
you and leaves the fees behind. A note the trust cannot service becomes the gift it was
structured not to be. A charitable remainder trust at 8% over 30 years fails the 10% test and
is not a valid trust at all. Each of those is computed, not warned about.

**Per-heir regimes are modelled per heir.** Germany, France and Japan tax each beneficiary's
share separately, so the same estate split three ways costs less than the same estate split
one way. The app shows that, and the self-checks assert it.

## What it deliberately does not do

- **Give advice.** Nothing here is legal, tax or financial advice, and no structure in it
  should be created without qualified counsel in every jurisdiction where you, your assets or
  your heirs sit.
- **State the law.** Every rate, threshold and exemption is a dated default, editable band by
  band, because all of them move and several are legislated to move again.
- **Model reliefs.** Business property relief, agricultural relief and their equivalents are
  frequently worth more than every technique in the app put together. They are named as the
  first thing to ask an adviser about; they are not computed, because they turn on facts about
  a specific business that no calculator can see.
- **Help with concealment.** Nothing in the app assists with hiding ownership, and the
  arrangements sold on that promise are listed with what they actually are.
- **Cross borders properly.** It models one jurisdiction at a time. Real estates with assets,
  entities and heirs in several countries need all of them looked at together, and that is a
  professional exercise rather than a calculator one.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of any
  kind. Verified with a browser run asserting zero non-`file://` requests.
- **Everything is saved** to `localStorage` as you type. `⬇ Back up` downloads the lot as JSON,
  `⬆ Restore` reads it back, and `🗑 Reset` backs up first, then returns to the worked example.
  Storage failures (private mode, `file://` restrictions) degrade to in-memory with a warning
  rather than breaking the app.
- **Fourteen currencies**, and a fee-level multiplier, because the same trust genuinely costs a
  fifth as much in one market as another.
- **Light and dark**, following your system setting, with a manual toggle.
- **Accessible.** Real form controls throughout, every input labelled, arrow-key tab navigation,
  visible focus rings that survive a re-render, live-region toasts, and all animation disabled
  under `prefers-reduced-motion`.
- **Responsive** to 390px with no horizontal page scroll on any tab; wide tables and charts
  scroll inside their own containers.
- **Exports** as Markdown (the full review), CSV (the verdict table) and JSON (a complete
  backup).

## Verification

Checked in headless Chromium — **105 self-checks**, which run on every load and report in the
footer, covering:

- the estate engine against hand calculations in six jurisdictions, including portability,
  the spousal deferral, a charitable deduction, the UK residence band at its cap and past its
  taper, per-heir splitting in Germany, deemed disposal in Canada, and a South African band
  table checked below, at and above its threshold
- the marginal rate: exactly 40% on a US estate above the exemption, zero below it, and above
  40% inside the UK taper
- the annuity identities (`fvAnnuity`/`annuityFactor` reconcile; a zeroed-out GRAT annuity has
  present value equal to the contribution), the GRAT returning nothing at the hurdle rate, the
  note sale returning exactly the grown seed when growth equals the note rate, discounts
  multiplying rather than adding, and the remainder factor collapsing to `(1 − payout)^term`
- the giving crossover: the two costs equal at the solved point, fund cheaper below, foundation
  cheaper above
- liquidity: assets outside the window raising nothing, cover in trust closing the gap, and
  personal cover grossed up so that `cover × (1 − marginal) = gap`
- the verdict logic — the floor always required, nothing marked "worth it" that fails to beat
  its own annual cost, every rejection carrying a reason, a family office correctly refused at
  $52m and justified at $2bn, and the level at which it starts to pay computed by bisection
- a no-death-tax jurisdiction ruling out every freeze technique by name while still requiring
  the floor
- exports naming all 33 structures, carrying the disclaimer, and quoting CSV correctly

Plus every tab rendered and exercised, focus surviving a re-render mid-typing, save/restore
round-tripping through a reload, no console errors, no external requests, and no horizontal
overflow at 390, 768 and 1280px on all ten tabs.

## What will go stale

The tax tables, first — every one is dated in the interface and editable band by band for that
reason. The US exemption is indexed and politically contested; the UK nil-rate band is frozen,
which is a tax rise every year, and its reliefs are being narrowed. Statutory hurdle rates move
monthly. Fees move with the market.

What will not go stale is the shape of it: that there are only four questions, that a structure
with no annual benefit still has an annual bill, that the tax is due long before the business
can be sold, that control retained is a gift never made, and that the difference between
planning and evasion is whether the thing is real and whether it is reported.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub Pages.
Served from this repo's root, the app lives at `/billionaire-structures/`.
