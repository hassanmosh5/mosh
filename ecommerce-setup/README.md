# Store Setup Guides — Shopify &amp; E-Commerce

A single-file, offline set of setup guides for the step *The AI Income Blueprint* mentions
in one line and never expands: opening your own store.

Open `index.html` in any modern browser — no install, no build step, no accounts, no
internet connection, and no data ever leaves the device.

## Why this exists

Chapter 7's platform table covers Etsy, Gumroad, Payhip, Stan Store and Creative Market,
and its recommended sequence ends like this:

> Add your own website or Stan Store once you are generating consistent income and want to
> reduce platform fees and build a direct customer relationship.

That is the whole of the book's guidance on owning a store. Every earlier step is
documented in detail — validation, listing SEO, pricing bands, the 30-day launch plan —
and then the last one is a sentence. These guides are that sentence, expanded: when the
step is actually worth taking, and exactly how to take it.

Shopify appears elsewhere in the book only in Chapter 9, as something *other people* have
that you automate for them. Here it is the thing you are building.

## What's in it

| Tab | What it does |
|---|---|
| 🧭 **Choose** | Six weighted questions and a verdict on whether you need a store yet, plus a break-even calculator for the only fee question that matters |
| 🛠 **Set Up** | The build, in 11 ordered steps and 79 tickable items — from the settings you cannot undo through to removing the password page |
| 📦 **Product Tracks** | Digital download, print-on-demand and physical stock as three separate configurations, because almost every setting that differs between two stores traces back to this one choice |
| ✍️ **Listing Builder** | The book's five-part description structure, built for a Shopify product page, with SEO title and meta description under their real character limits |
| 🚀 **Launch** | 29 pre-flight checks in five groups, and what the first 90 days actually look like |
| 📊 **Fees &amp; Reference** | An editable fee comparison across six platforms, the book's price bands, and a glossary |

## The break-even question

The reason most people give for leaving a marketplace is fees, and it is usually the wrong
reason at the time they give it. A marketplace takes a percentage forever; a store charges
a fixed monthly fee plus a smaller percentage. Below a certain monthly revenue the
percentage is cheaper. Above it, the fixed fee is.

The Choose tab computes that crossover from your own average order value, by scanning the
revenue range rather than solving a formula, so it stays correct when you edit the rates.
At the defaults — $27 average order, Shopify Basic vs Gumroad's flat 10% — it lands around
**$660/month**, roughly 25 orders.

It also says the thing a calculator cannot: below the crossover the marketplace is supplying
search traffic you would otherwise have to buy or earn, and that is worth far more than the
fee difference. Fees are the *last* reason to open a store. Owning the customer
relationship is the first.

## About the numbers

**Every rate in the fee comparison is an editable field, not a quote.** Platform pricing
changes, differs by country, and differs between monthly and annual billing. The defaults
are a starting point with a visible warning attached; correct them from each platform's own
pricing page and the whole comparison recalculates from what you enter. Your edits are
saved.

Two figures are deliberately flagged rather than quietly copied from the book:

- The book's table lists a **Gumroad** paid tier that removes the percentage fee. Gumroad
  has since consolidated toward a single flat rate with no paid plan. The default here is
  the flat rate, and the app says to confirm the current terms before planning around
  either figure.
- **Etsy's** listed 6.5% is the transaction fee alone. The default in the calculator
  combines it with payment processing and adds the per-listing fee separately, because
  three fees stack and estimates that use only the headline number are wrong by a third.

Price bands, income ranges and platform figures quoted from the book carry the book's own
disclaimer: they are ranges based on observed outcomes, not guarantees. Nothing here is
tax, legal or financial advice.

## What the guides argue

Not neutral documentation. The guides take positions, and the positions are these:

- **A store is a multiplier on traffic you already have.** A multiplier on zero is zero.
  Roughly half the value of the Choose tab is talking you out of the other five tabs.
- **Three settings in the first five minutes are effectively permanent** — store currency,
  the `.myshopify.com` address, and your address/timezone. Everything else in the admin is
  reversible. Step 2 exists entirely to get those right.
- **One checkbox separates a digital store from a broken one.** Leaving "This is a physical
  product" ticked on a PDF makes checkout demand a postal address and charge shipping on a
  file, which reads to a buyer as a scam.
- **Ninety minutes in the theme editor, then stop.** Time there feels like progress and
  mostly is not. A beautiful store that cannot take money earns exactly as much as no store.
- **Apps are a recurring tax on margin and page speed.** Five at $10–$30 a month can exceed
  your plan cost while you are still finding your first hundred customers.
- **Judge the store at day 90, not day 3.** The book is explicit that the first ninety days
  of a digital product business are slow, and that listings, reviews and SEO compound rather
  than pay out. A store is slower still, because you are also building the traffic.

## The listing builder

Chapter 7 gives a five-paragraph description structure for a marketplace listing — what it
is and who for, what it solves, what is included, technical details, FAQs. This builds that
structure for a Shopify product page, and adds the two fields Shopify keeps separate from
the description and most people leave to auto-generate:

- **Page title** with a live counter against 60 characters
- **Meta description** with a live counter against 160
- **URL handle**, generated the way Shopify generates it
- **Tags**, from your keywords

Picking a product type loads sensible defaults for components, formats and compatibility,
and shows the book's price band for that type — flagging when your price falls below or
above it. Switching type afterwards updates those defaults **only where you have not
written your own text**; anything you edited survives the switch.

Output copies as Markdown, as HTML for Shopify's `</>` editor view (headings render as
`h3`, which is what most themes style correctly inside a description), or downloads as a
`.md` file with the SEO fields in a header block.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of
  any kind. Verified with a browser run asserting zero non-`file://` requests.
- **Everything is saved** to `localStorage` as you go — every tick, quiz answer, listing
  draft, edited rate and the theme. `⬇ Back up` downloads the lot as JSON; `🗑 Clear` backs
  up first, then wipes. Storage failures (private mode, some `file://` restrictions) degrade
  to in-memory with a warning rather than breaking the app.
- **Light and dark**, following your system setting, with a manual toggle.
- **Accessible.** Real form controls throughout, arrow-key tab navigation with roving
  tabindex, visible focus rings, live-region output on the calculators and the verdict, and
  all animation disabled under `prefers-reduced-motion`.
- **Printable.** Print styles drop the interface and expand every collapsed step, so the
  whole thing prints as one document.
- Both checklists export as Markdown with `- [x]` state preserved, so you can carry them
  into an issue tracker or a notes app.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub
Pages. Served from this repo's root, the guides live at `/ecommerce-setup/`.
