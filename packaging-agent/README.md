# MOSH Packaging Agent

A single-file, offline console that turns one AI-generated asset into the commercial package it
needs in order to be sold: four priced tiers, a documentation set, three licences, four marketplace
listings, 120 keywords, fifty social posts, a five-step funnel, a launch plan — and a ZIP of
fifty-odd files with real PDFs in it.

Open `index.html` in any modern browser. No install, no build step, no accounts, no internet
connection, and no data ever leaves the device.

**It does not write your product.** Nothing here talks to a model. It has never seen the thing you
are selling; it knows only the ten fields you type, and it says so in the one folder it cannot
fill for you.

## The argument the app makes

An AI output is not a product. The gap between the two is not creativity, it is a list of specific
artefacts — a licence that says what a buyer may sell, a price that sits somewhere defensible, a
file list published before payment, a paragraph naming what the thing cannot do. That list is
finite, it is nearly identical for every digital product, and writing it by hand for the fourth
time is the reason most finished assets never get listed. So:

1. **The package is deterministic; only the judgement is yours.** The same ten inputs always produce
   the same fifty files, byte for byte. Nothing is sampled, so a listing you approved on Monday is
   the listing that exports on Friday.
2. **Nearly half the package is not for the buyer.** Listings, posts, keywords, mockup specs and the
   launch plan are yours. They are generated into `07_Marketing/` and marked *studio only*, and the
   per-tier customer ZIPs exclude them — because the most common way a solo studio embarrasses
   itself is shipping its own sales notes inside the product.
3. **Limits belong on the sales page, not in the refund email.** Every category carries a *gate* —
   the thing a person still has to check — and it is carried verbatim into the README, the manual,
   the sales page, the FAQ, the day-5 email and all four listings. A product that hides what it
   cannot do until after payment gets one sale per customer.

## The tabs

| Tab | What it does |
|---|---|
| 📦 **Product** | Ten fields, and the analysis they produce: a monetisation score, a value proposition, and descriptions at 50, 150 and 500 words |
| 💰 **Pricing** | Four tiers priced inside the brief's ranges from your own numbers, in dollars and cedis, with net-per-sale on four stores and the ladder ratios |
| 📁 **Files** | The ten-folder structure, what each tier ships, and every generated file readable in full before you export it |
| 🛒 **Listings** | Gumroad, Selar, Paystack Storefront and Shopify — four different buyers, four different pages, character limits enforced |
| 🔍 **SEO** | 50 primary, 50 secondary and 20 long-tail keywords with intent and placement, plus metadata inside every field's limit |
| 📣 **Marketing** | Fifty posts: ten angles across Facebook, Instagram, LinkedIn, X and WhatsApp |
| 🔻 **Funnel** | Lead magnet → low-ticket → core → premium → consulting, with landing copy, two order bumps, three upsells, two downsells and seven emails |
| 🚀 **Launch** | Sales page, eight screenshots, six mockups, a thirty-item checklist, an affiliate programme and four outreach templates |
| 📤 **Export** | The full package, a customer ZIP per tier, the lot as one Markdown document, two CSVs, and a JSON backup |

## What it generates

Around fifty files across the ten folders — the exact count follows from what you tick as already
built. For the worked example: **49 files, 10 folders, 39,000 words**.

```
WhatsApp_Sales_Closer/
├── README.md · START_HERE.txt
├── 01_Prompts/          system prompt · prompt library · variables
├── 02_Source_Code/      the one folder this app cannot fill
├── 03_Documentation/    quick start · installation · manual · FAQ · troubleshooting · changelog
│                        …and the same five again as real PDFs
├── 04_Templates/        prompt · workflow · SOP · automation
├── 05_Examples/         one job start to finish, with the inputs
├── 06_Assets/           cover text at three sizes · mockup specs · brand notes
├── 07_Marketing/        studio only: 4 listings · 50 posts · 7 emails · funnel · keywords · launch
├── 08_Videos/           four scripts · recording checklist
├── 09_Licensing/        personal · commercial · agency · the comparison table
└── 10_Bonus_Content/    fast track · selling the output · the upkeep plan
```

## The arithmetic

Four pieces, each checkable by hand and each checked in the page at load.

**The score.** One number, weighted, from five judgements you typed:

```
score = 28%·demand + 24%·pain + 20%·budget + 18%·(5 − competition) + 10%·completeness
```

At 75 it reads *priority build*; under 35 it says package this as a lead magnet and sell the tier
above it as a service. The app weighs your judgements consistently. It cannot make them true, and
it never pretends the numbers came from research.

**The ladder.** Each tier is placed inside the range the brief sets, by where your market sits:

```
mix = 0.55·(score/100) + 0.45·budget          Starter      $9  + $20 ·(0.6·mix + 0.4·complexity)
                                              Professional $49 + $50 ·(0.5·mix + 0.5·complexity)
                                              Premium      $99 + $200·(0.45·mix + 0.55·complexity)
                                              Enterprise   $500 + $4,500·(…)^1.7
```

Every result is snapped to a price people actually charge — 19, 79, 199 — and the ladder is
checked at every combination of complexity, budget and demand to confirm it stays inside
$9–29 / $49–99 / $99–299 / $500–5,000 and always increases.

**Ghana pricing is a decision, not a rate.** The straight conversion is shown next to a local band
(60% by default, yours to change). A price that reads as a week's data bundle does not sell in Accra
whatever the exchange rate says — and the app labels that as judgement rather than laundering it
through arithmetic.

**Word counts are hit, not approximated.** The 50-, 150- and 500-word descriptions are assembled
from whole sentences until they land inside 6% of the target, and every category is checked at load.
Nothing is ever truncated mid-sentence; short store fields drop whole trailing clauses instead, so
a Gumroad summary ends on a finished thought rather than "…in your own".

## What it deliberately doesn't do

- **It doesn't research the market.** Demand, competition, pain and budget are four judgements you
  typed. They set the score and the prices, and they are guesses until you have asked a buyer.
- **It ships no fee schedule.** Gumroad, Selar, Paystack and Shopify appear with placeholder rates
  flagged **unverified** until you open their pricing pages and type what they say. Fixed
  per-transaction components and conversion spreads are not modelled at all, and the page says so
  rather than inventing them.
- **It has no exchange rate** and never fetches one. Type yours.
- **It doesn't write your product**, and does not pretend to: `02_Source_Code/` ships a file telling
  you what to put there and what to strip first — no keys, no client names, no `.git`.
- **It doesn't publish anything.** No store API, no processor, no mailing list, no network of any kind.
- **It makes no income claims**, and the copy it generates makes none either. That is a rule in the
  generator, not a style preference.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or requests of any kind. Verified
  with a browser run asserting zero non-`file://` requests.
- **The PDFs are written here.** Five documentation files export as real PDF 1.4 — page breaks,
  headings, tables set in Courier, page numbers, footer, a correct cross-reference table — from a
  writer in this file. No library, no server, no upload.
- **So is the ZIP.** Stored entries, real CRC-32s, a real central directory, directory entries for
  all ten folders.
- **Everything is saved** to `localStorage` as you type. `⬇ Back up` downloads the lot as JSON,
  `⬆ Restore` reads it back, and `🗑 Clear` backs up first, then wipes. Storage failures (private
  mode, `file://` restrictions) degrade to in-memory with a warning rather than breaking the app.
- **A worked example** — a WhatsApp sales agent for Ghanaian small businesses — loads into every
  field with one button.
- **Light and dark**, following your system setting, with a manual toggle.
- **Accessible.** Real form controls throughout, every input labelled, arrow-key tab navigation,
  visible focus rings, live-region toasts, and all animation disabled under `prefers-reduced-motion`.
  The form is never re-rendered on a keystroke, so typing in a field that drives a live calculation
  cannot move the caret.
- **Responsive** to 390px with no horizontal page scroll on any tab; wide tables and the folder tree
  scroll inside their own containers.

## Verification

**1,678 assertions run in the page at load**, and the count is reported in the footer — every claim
this README makes about the output, checked against the output:

- the price ladder inside its four ranges and strictly increasing, at 45 combinations of complexity,
  budget and demand
- all three descriptions inside their word windows, in all 13 categories
- exactly 50 + 50 + 20 keywords, all unique, no unfilled slot, in all 13 categories
- exactly 50 social posts, all distinct, every X post inside 280 characters, in all 13 categories
- every store field inside its own limit — Gumroad title 60, meta description 160, Open Graph 200,
  Paystack short description 150 — and none of them ending on a dangling conjunction
- all ~50 generated files rendering in three very different products with no `undefined`, no
  `[object Object]`, no `NaN` and no unresolved template
- the same inputs producing byte-identical copy twice
- the ZIP's byte layout, and CRC-32 against the standard check value
- the PDF's header, cross-reference table, page count and multi-page flow
- an `<img onerror>` typed into a product name reaching the page as text
- a deliberately corrupt saved file being repaired rather than crashing the app

Checked separately in headless Chromium: every tab at 390, 768 and 1280px with no horizontal page
scroll; the worked example; typing without losing the caret; the full ZIP, a per-tier ZIP, the
Markdown and the CSV all downloading; dark mode; persistence across a reload; recovery from corrupt
storage; and zero external requests.

Checked outside the browser, on the exported artefacts: `unzip -t` on the generated package (61
entries, no errors), and a Python pass over all five PDFs confirming the header, that `startxref`
points at the table, that every cross-reference offset points at its object, that every content
stream's declared `/Length` matches the real stream, and that the page objects match `/Count`.

**Not verified here:** the PDFs have not been opened in a graphical PDF reader — headless Chromium
downloads a PDF rather than rendering it, so their structure is proven and their typography is not.
Open one before you ship it to a customer.

## What will go stale

The store list and the fee shapes, within a year or two — which is why no fee is baked in. The
character limits, when a store redesigns. The argument will not: a buyer deciding in eleven seconds
on a phone still needs the file list before the price, and a product that hides its limits until
after payment will still get one sale per customer.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub Pages.
Served from this repo's root, the app lives at `/packaging-agent/`.
