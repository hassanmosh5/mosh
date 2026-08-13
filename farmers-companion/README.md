# Farmer's Companion

A single-file, offline planning tool for a season on a smallholding: which crop
goes on which plot, on what date, watered with what, fed with what, protected
how — and whether the arithmetic of all that comes out ahead.

Open `index.html` in any modern browser — no install, no build step, no accounts, no
internet connection, and no data ever leaves the device.

**It will not let you type in a yield.** That is the one input every farm-planning
spreadsheet asks for and nobody can honestly supply. This app derives it instead, from
six things it can check, and shows the whole multiplication.

## The argument the app makes

Three claims, and the app is built around them.

**1. Margin per hectare is the wrong ranking for most smallholdings.** It is the right
one only if land is what you run out of, and land almost never is. What runs out first is
the week in which three crops all need weeding, or the water in the driest month, or the
cash between the fertiliser and the first sale. Whichever of those fills up first is the
constraint the crop choice should be judged against, so the app finds it and ranks by
margin per unit of *it* — per peak-week hour, per cubic metre, per unit of working
capital. When that ranking disagrees with the per-hectare one, the app says so.

**2. A yield you type in is a wish.** So each planting starts at the crop's ceiling and
gets multiplied down:

```
expected = ceiling × water × nutrients × protection × timing × hands × calibration
```

Each factor is computed on a different page of the app and each is shown with its
working. None of them is a fudge: the water factor is the FAO water-production
relationship, the nutrient factor is Liebig's law of the minimum applied to a real
removal calculation, protection is what your own committed practices leave behind, and
*hands* is the share of the crop's critical hours that nobody in the plan is available to
work.

**3. Farms fail on the timing of money, not the total.** A season with a good margin can
be impossible to finance. The number that decides it is the deepest point of the monthly
cash curve — the working capital the plan actually needs — and it is never the same as
the season's total cost.

## The tabs

| Tab | What it does |
|---|---|
| 🚜 **Farm** | Climate zone, hemisphere, altitude, plots with soil and pH, the water you can actually deliver, hands available per week, and the money you have before the season |
| 🌱 **Crops** | 26 crops with the numbers that drive everything: duration, ceiling, crop coefficients, water response factor, nutrient removal per tonne, labour hours, untreated pest loss. Prices and ceilings are yours to overwrite |
| 🗺 **Season plan** | Crop and date per plot, the four constraints ranked by how full they are, and the yield derivation for every planting with the one factor that is holding it back named |
| 📅 **Calendar** | The dozen dates one planting date implies, a week-by-week labour curve stacked household / hired / nobody, and every operation in order with a CSV export |
| 💧 **Water** | Monthly balance: crop demand from ETo × Kc, usable rain by the FAO rule, deficit, what your source can abstract, and what a cubic metre earns on each crop |
| 🧪 **Soil & feed** | Removal, soil and manure supply, legume credit, lime where pH locks up phosphate, and the cheapest blend of the bags you can actually buy — at real recovery rates, split basal and top dressing |
| 🐛 **Protection** | 20 pests and diseases for the crops you planted, with what a scouting walk looks for and what a threshold is; 11 practices each taking a stated bite out of the loss; a scouting log that guards pre-harvest intervals against your harvest dates |
| 💰 **Margins** | Gross margin per planting, both rankings side by side, break-even yield and price, and a price × yield sensitivity grid |
| 📉 **Cash flow** | The monthly curve, the trough, whether it can be financed, what holding grain does to both the price and the trough, and four ways to make the trough shallower |
| 📄 **Farm plan** | Everything as one Markdown document, plus an input shopping list and an operations calendar as CSV |

## How the yield is actually derived

Nothing here is a benchmark. These are the rules the app applies, stated in the interface
so you can disagree with them.

**Water.** Demand is reference evapotranspiration for the zone multiplied by the crop
coefficient for the day it is on — flat through establishment, climbing through
development, flat at mid-season, falling at the end (FAO-56 shape). Rain is discounted to
what a crop can use: above 75 mm in a month, 80% of it less 25 mm; below that, 60% less
10 mm. The remaining deficit is met from your source, divided by your application
method's efficiency, and shared out across plantings when there is not enough. What is
still missing becomes yield loss through the crop's own response factor:

```
factor = 1 − Ky × (1 − met)
```

A crop with Ky 1.25 that got 80% of what it wanted keeps 75% of its yield. A crop with Ky
0.70 keeps 86%. That difference is why the crop to plant when the rain is uncertain is
usually not the one with the best margin.

**Nutrients.** The target yield is what the rest of the plan allows if the crop were fed
properly. That target removes a fixed amount of N, P₂O₅ and K₂O per tonne. Subtract what
the soil rating supplies, what manure releases in its first season (half the nitrogen,
three fifths of the phosphate, four fifths of the potassium), and any nitrogen a legume
left behind. What remains is divided by the share a crop actually recovers from a bag in
its own season — 50% of nitrogen, 25% of phosphate, 60% of potassium — and only then
turned into bags, cheapest-per-kilo-of-nutrient first. Below pH 5.5 the phosphate supply
is discounted and lime is prescribed before fertiliser, because spreading phosphate on
acid soil is money poured onto the ground. The scarcest nutrient sets the ceiling and the
others cannot make up for it.

**Protection.** Every crop carries a share of yield lost to pests and disease with no
management at all. Each practice you commit to multiplies what is left: rotation −18%,
weeding finished by day 21 −15%, weekly recorded scouting −15%, roguing and sanitation
−12%, and so on. Field loss can never fall below 15% of the untreated figure, and store
loss never below 20% of it, because there is no combination of good practice that removes
loss entirely. The three most powerful practices in the list cost nothing but attention.

**Timing.** The mean temperature across the growing period against the crop's range, a
severe penalty for frost inside the window of a frost-sensitive crop, multiplied by seed
vigour — where saving seed from a hybrid costs about 30% of the yield, which is the most
expensive saving in farming.

**Hands.** Every planting becomes a weekly demand curve: ground preparation scaled by
traction, planting, weeding front-loaded because that is where the yield is decided,
protection, irrigation hours at your method's rate, and harvest across the picking
window. Hours above what the household can do are hired; hours above what can be hired
are simply not done. The share of a crop's *critical* hours that nobody works comes off
its yield — which is how a labour constraint stops being an abstraction.

**Calibration.** Enter what a planting actually weighed and every remaining estimate is
rescaled by the ratio. One measured harvest is worth more than every default in the file,
and after it the app stops guessing.

## What it deliberately does not do

- **No livestock.** Feed budgets, stocking rates and animal health are a different model
  and pretending otherwise would make the cash flow a fiction.
- **No perennials.** Every crop here is annual or short-cycle. A coffee bush or a banana
  stool is an investment amortised over years, not a season plan.
- **No product names, ever.** The protection pages give thresholds, cultural controls and
  pre-harvest intervals by product class. What is registered for what crop is a local
  legal question and this file cannot answer it.
- **No forecast.** The climate figures are long-run typical values for a zone of that
  description. They are a starting point to overwrite with your own records; there is no
  network connection in this file and there is nothing to fetch.
- **No pretence of precision.** Yields come out of a chain of judgements. The app's claim
  is that a derived number whose assumptions are all visible beats a confident number
  typed into a cell.

## Everything is editable, and the defaults say what they are

Prices, yield ceilings, seed costs, rainfall month by month, fertiliser prices and which
products you can actually buy, soil fertility and pH per plot, wage, water cost,
transport and levies — all of it. Where the app applies a weight of its own (recovery
fractions, loss reductions, effective-rainfall rule, manure release fractions) it prints
the number in the interface next to the thing it affects.

## Data

Stored in `localStorage` in your browser and nowhere else. **⬇ Back up** writes a JSON
file, **⬆ Restore** reads one back, and **🗑 Clear** downloads a backup before wiping.
Nothing is transmitted anywhere, because there is nothing in the file that could transmit
it: no scripts from anywhere else, no fonts, no images, no analytics.

## Output

- **Season plan** — one Markdown document with the plots, dates, derivations, water
  balance, fertiliser plan, protection plan, margins and cash flow.
- **Input shopping list** — CSV: what to buy, how much, roughly what it costs, and the
  date you need it by.
- **Operations calendar** — CSV: every date the plan implies, with what to do and why.

Print any tab straight from the browser; the print stylesheet drops the chrome.
