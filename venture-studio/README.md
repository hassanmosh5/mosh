# CLEAR AI Digital Product Venture Studio

A single-file, offline console that turns a list of things you already know into a ranked catalogue
of digital products — and then refuses to design any of them until you have spent thirty minutes
checking that buyers exist.

Open `index.html` in any modern browser. No install, no build step, no accounts, no internet
connection, and no data ever leaves the device.

**It has never seen a marketplace.** It makes no network requests, so the six numbers that decide
whether a product gets built have to come from you, looking at real listings with your own eyes. The
app tells you exactly what to search for and then blocks nine of its thirteen tabs until you answer.

## The argument the app makes

Most people with something worth selling make the same three mistakes, in the same order: they pick
the product type first, they validate after building, and they think in single products rather than
catalogues. So:

1. **The idea is the cheap part.** Three knowledge assets crossed with thirty-three product types is
   ninety-nine scored ideas in the time it takes to type three phrases. Scoring the bad ones matters
   as much as scoring the good: it is how you find out that your strongest asset makes a mediocre
   ebook and an excellent spreadsheet, which is not something you would have guessed.
2. **Validation is the only part that cannot be generated.** Everything else in this file is
   arithmetic on your inputs and can be produced in a second. The six numbers in the worksheet are
   thirty minutes of manual work on real marketplaces, they are the only evidence in the whole
   system that anyone wants the thing, and no amount of good writing downstream substitutes for
   them. So the app will not write a blueprint, a listing, a funnel or a licence until all six are in.
3. **One product is a listing; nine is a business.** Every validated product carries an ecosystem of
   nine rungs cut from material you already made — and a catalogue plan that tells you the size at
   which upkeep eats your whole week, which for most operators arrives sooner than the ambition does.

## The tabs

Twenty phases, thirteen tabs.

| Tab | Phase | What it does |
|---|---|---|
| 🧠 **Assets** | 1 | Up to twelve knowledge assets, each with origin, years, depth and proof — and the inventory they produce: buyer, problem, product potential |
| 💡 **Opportunities** | 2 | Every asset × all 33 product types, scored on demand, profitability, ease, scalability, competition and SEO, with build hours and a price |
| 🔎 **Validate** | 3 | Six checks, thirty minutes, the exact queries to run, and a decision: proceed, refine, pivot or reject |
| 📐 **Blueprint** | 4 · 6 | Architecture, the four versions with net-per-sale on each platform, and the type-specific contents |
| 🛠 **Build** | 5 · 7 | Draft, accuracy and polish passes with the human gates marked, then seven QA scores and what to do about the ones under 8 |
| 🪜 **Ecosystem** | 8 | The nine rungs one product becomes, priced and costed, with the two you should not build yet |
| 📚 **Catalogue** | 9 · 19 | 30/90/365-day plans, the stall point, twelve months of arithmetic, and what each catalogue size costs in people |
| 🛒 **Listings** | 10 · 11 | A listing per platform with every character limit enforced, ~55 keywords, FAQs, cover briefs and mockup specs |
| 📣 **Marketing** | 12 · 13 | A 90-day plan, six articles, 34 posts across five channels, and five email sequences |
| 🔻 **Funnel** | 14 · 15 | Nine stages drawn as a diagram, the price ladder, and three revenue scenarios with their assumptions printed beside them |
| ⚙️ **Operations** | 16 · 17 · 18 | Six licences in full, six SOPs, and four recurring-revenue shapes with churn, half-life and LTV |
| ⚖️ **Board** | 20 | Eight directors scoring the same dossier, each with a risk and a demand, and a verdict that can block |
| 📤 **Export** | — | The whole thing as one Markdown dossier, two CSVs and a JSON backup |

## How it sits beside the other apps in this repo

Four apps in this studio touch digital products, and they start at different points. This one starts
furthest upstream and hands off:

- **This app** — *I know some things. What should exist, and which one first?* Ends with a validated
  product, a catalogue plan and a board verdict.
- **[`digital-products/`](../digital-products/)** — the Chapter 7 tool for one product you have
  already thought of: eight formats compared, two gates that can kill it, the 30-Minute Validation
  Method as a running clock. Both apps carry a version of the book's validation; that one runs it as
  six timed blocks for a single idea, this one runs it as six weighted checks that produce a score
  and a proceed/refine/pivot/reject decision across a whole ranking.
- **[`product-factory/`](../product-factory/)** — once you know what to build, the production console:
  workflows, agent briefs, accuracy checks, and how many products a month you can actually finish.
- **[`packaging-agent/`](../packaging-agent/)** — once a product is finished, the commercial package:
  the folder tree, the PDFs, the ZIP, the tiers.

The catalogue tab here and the Product Factory both compute the size at which upkeep eats the working
week. That is deliberate: this one predicts it from a plan, that one measures it from what you have
already built, and the two disagreeing is useful information about the plan.

## The arithmetic

Four pieces, each checkable by hand and each checked in the page at load.

**The ranking.** Six criteria, 0–10 each, weighted into one score:

```
score = 24%·demand + 20%·profitability + 16%·competition
      + 14%·ease + 14%·scalability + 12%·SEO
```

Competition is scored so that 10 means an empty shelf. Demand comes from the product type adjusted
by how broad the asset's origin is and whether you named a buyer. Profitability is shelf price per
build hour, less the average platform commission. Ease moves with your depth in the subject and with
how many weeks the build eats at your stated hours. The weights sit at the top of the file; move one
and every row, plan and price moves with it.

**The thirty minutes.** Six checks, weighted to 100, summing to exactly thirty minutes:

| Check | Minutes | Weight | You count |
|---|---|---|---|
| Marketplace search | 6 | 22 | Listings that genuinely answer the search |
| Etsy demand analysis | 5 | 20 | Of the top 10, how many show 100+ sales |
| Price ceiling | 5 | 14 | Highest price a comparable product actually sells at |
| Community research | 5 | 16 | Communities of 1,000+ where this buyer gathers |
| Forum demand | 5 | 16 | Threads in 90 days asking for exactly this |
| Search intent | 4 | 12 | Of 10 queries, how many autocomplete into buying intent |

Marketplace search is deliberately **not** monotonic: zero listings scores 10/100, twenty-two scores
100, and two hundred scores 8. An empty shelf is not an opportunity, it is usually an answer. Two
hard rules override the weighted score: no listings *and* no threads *and* no communities is a
Reject whatever else is true, and a product with no proven price and no proven seller needs 62+ to
survive. Above 72 proceeds; 55–71 refines; 38–54 pivots to a different product type from the same
asset; below 38 rejects.

**Prices are shelf prices.** Every figure is snapped to something people actually charge — 19, 79,
199 — from the type's band, moved by the market's purchasing power and by your depth and proof. The
four tiers are 0.45×, 1×, 2.4× and 6.5× the core price, and each is shown net of every active
platform's commission and fixed fee.

**Revenue is arithmetic, not a forecast, and says so in four places.** Visits are your audience at a
stated reach rate plus an assumed per-listing trickle from each platform. Conversion is shown at 1%,
2.5% and 5% rather than picked. The four rates involved were invented by this file, they are printed
beside the numbers they produce, and the table carries the line that matters most: *a new listing
with no audience and no reviews sells nothing for the first sixty days, and none of these columns
knows that.*

## What it deliberately doesn't do

- **It does not research anything.** No network requests, no marketplace data, no search volumes, no
  competitor prices. The validation numbers are yours to go and find, and the app is built around
  refusing to proceed without them rather than around filling them in plausibly.
- **It does not write your product.** It writes the outline, the structure, the worksheets and the
  eight-part spine; the accuracy pass is yours and the app names the specific human gate for each of
  the thirty-three types — a lawyer for contract templates, a fresh account for Notion templates, a
  current model for prompt packs.
- **It makes no income claims**, and the copy it generates makes none either. That is a rule in the
  generators, not a house style.
- **The platform fees are stale by design.** They are the studio's last recorded figures, shown with
  the rate next to every checkbox and a line telling you to check before you publish a price.
- **The licences are not legal advice.** Six are generated in full, in plain English, and the app
  says on the page that none of them has been read by a lawyer in your jurisdiction or your buyer's.
- **It publishes nothing.** No store API, no processor, no mailing list, no analytics.

## Notes

- **Fully offline.** No external scripts, fonts, images or requests of any kind — verified by
  grepping the file for any absolute URL and by running it from `file://`.
- **Everything is saved** to `localStorage` as you type. The Export tab downloads a JSON backup and
  restores from one pasted back in. Storage failures degrade to in-memory rather than breaking.
- **A worked example loads by default** — three Ghanaian knowledge assets — so every tab has
  something real in it before you have typed anything.
- **Deterministic.** No sampling anywhere: choices are spread with a seeded hash of the ids, so the
  fourth idea from the second asset is the same idea, with the same name and the same price, every
  time the file is opened. Two consecutive renders are byte-identical.
- **Light and dark**, following the system setting, with a manual toggle.
- **Accessible.** Real form controls, every input labelled, tab semantics with `aria-selected`,
  visible focus rings, live-region toasts, animation disabled under `prefers-reduced-motion`. The
  caret position is captured and restored across re-renders, so typing in a field that drives a live
  calculation cannot move it.
- **Responsive to 390px** with no horizontal page scroll on any tab; wide tables and the funnel
  diagram scroll inside their own containers.

## Verification

**104 self-checks run in the page at load** and the count is reported in the footer. A red footer
means do not trust the numbers above it. They cover the string helpers, the integrity of all
thirty-three type rows, score and price bounds, tier ordering, catalogue constraints, every platform
character limit, the validation decision table at four corners, the board blocking an unvalidated
product, and the dossier containing all fifteen sections with no `undefined`, no `NaN` and no
unfilled placeholder.

Checked separately in headless Chromium, and the numbers below are from those runs:

- **891 combinations swept** — every opportunity in the worked example against all nine markets —
  running all fifteen generators plus the full dossier on each, with zero errors and no unresolved
  template in any output.
- **All thirteen tabs rendered in three states** (nothing selected, selected but unvalidated, fully
  validated) with no `undefined`, `NaN` or `[object Object]` reaching the page.
- **Zero horizontal overflow** on all thirteen tabs at 390, 768 and 1280px.
- **`<img src=x onerror=…>` typed into every free-text field** — name, buyer, evidence, studio,
  operator and the validation notes — produces zero injected nodes across all thirteen tabs.
- **Determinism**: two consecutive renders byte-identical, two consecutive dossiers byte-identical.
- **Round trips**: add and remove assets, select and deselect, backup and restore, and a switch
  through all nine markets with every price and score still finite.
- **The worked example's dossier** is 10,157 words across fifteen sections.

**Not verified here:** the CSV files have not been opened in a spreadsheet application, and no
generated listing has been posted to a real marketplace, so the character limits are enforced
against the studio's recorded figures rather than against the platforms themselves.

## What will go stale

The platform list and every fee on it, within a year or two — which is why the fees are visible next
to their checkboxes rather than buried. The character limits, when a store redesigns. The AI product
types fastest of all: a prompt pack is dated within two quarters and the app says so in its gate and
in its upkeep hours.

The argument will not. Ideas will still be cheap, validation will still be the only expensive part,
and the operator who builds ten unvalidated products will still lose to the one who validated three.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub Pages.
Served from this repo's root, the app lives at `/venture-studio/`.
