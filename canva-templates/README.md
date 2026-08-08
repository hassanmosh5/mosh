# The Canva Template Library Builder

A single-file, offline mini app that turns Chapter 7 of *The AI Income Blueprint* into a
working production line for Canva template packs — and then plans the whole catalogue they
belong to.

Open `index.html` in any modern browser — no install, no build step, no accounts, no
internet connection, and no data ever leaves the device.

## Why this app

Chapter 7 (`books/THE_AI_INCOME_BLUEPRINT.pdf`) names Canva templates as one of the eight
most profitable digital product types, and one of the highest-volume sellers on Etsy —
"virtually every small business owner uses Canva and actively seeks time-saving templates."
It also gives the pricing bands, the six validation methods, the eight-step creation
workflow, the platform comparison, the listing-SEO structure and the catalogue-builder
mindset shift.

What it does not give you is the thing you actually need before opening Canva: a build
sheet. Which templates, at which pixel dimensions, in which colours, with which type
pairing, laid out how. This app is that missing document — generated for any of 3,456
niche × pack-type × angle combinations, then priced, validated and scheduled.

## What's in it

| Tab | Source | What it does |
|---|---|---|
| 🎨 **Pack Builder** | Ch. 7 + Ch. 4 | Niche → pack type → angle produces a complete spec: brand kit, per-template build sheet with exact canvas sizes and layout structure, build order, delivery steps, price ladder, listing copy and an optional AI design-brief prompt |
| 🗂 **Catalogue Planner** | Ch. 7 | A 12–40 pack library with a week-by-week publishing schedule and the four-rung price ladder |
| ✅ **Validate** | Ch. 7 | The 30-Minute Validation Method as a scored checklist, with the exact search phrases to paste into Etsy, Gumroad, Pinterest and Google Trends |
| 💰 **Sell It** | Ch. 7 | Platform comparison, five-paragraph listing generator, 13 Etsy tags, the full pricing table and a 14-point pre-launch checklist |
| 📚 **My Library** | Ch. 7 | Saved specs, progress against your catalogue target, exportable as one Markdown file |
| 📖 **Reference** | Ch. 4, 7 | The eight-step workflow, a canvas-size cheat sheet, how to actually deliver a Canva pack, the four costly mistakes and the income milestones |

## The numbers

**24 niches × 18 pack types × 8 angles = 3,456 distinct listings**, before a single
template is redesigned. That is the point the Catalogue Planner is making: the expensive
part of this income stream is the first pack in a niche. Every pack after it is a
duplicate of the master file with a different angle, a different surface, or a different
season.

Underneath that, **172 individual template definitions** — each with a name, the job it
does for the buyer, its exact pixel canvas, and its layout structure. The pack spec is
assembled from those, not from a template string.

## Niche → brand system

Picking a niche does not just change a label. It swaps in:

- a **buyer sentence** and the **specific problem** the pack solves (Chapter 7's first two
  criteria for a winning product idea)
- a **five-colour palette** with a role for each swatch — base, ink, primary, secondary,
  accent — and the rule that keeps a pack from looking busy: the accent appears exactly
  once per template
- a **three-font pairing**, all available in Canva, split into headings, body and accent
- **five content pillars** the placeholder copy should speak to
- the **search keywords** the listing has to rank for, and when in the year this buyer buys

Wellness coaches get Oat, Deep Fern, Sage, Clay and Terracotta with Cormorant Garamond and
Montserrat. Fitness coaches get Fog, Graphite, Ignite, Iron and Volt with Anton and
Archivo. Solo attorneys get Parchment, Ink Black, Counsel Navy, Pewter and Statute Gold
with Libre Baskerville and Karla.

## Canvas sizes

Every template carries a pixel canvas rather than a Canva preset name, because preset names
move around between releases and pixel dimensions do not. In Canva each one is a **Custom
size**. The Reference tab lists all 21 sizes the app uses, with the two that carry
gotchas called out — story highlight covers (artwork must sit in the middle 500 × 500,
because the circle crops everything else) and YouTube channel banners (the 1546 × 423 safe
area).

## Angles

The same eight templates sold three ways are three products, and this is the cheapest way
to grow a catalogue without designing anything new. Each angle rewrites the pack name, the
promise, the styling note, the listing copy and three of the thirteen tags:

Minimalist · Luxury · Bold · Warm & Earthy · Playful · Seasonal · Starter · Complete

## Pricing

The price band is computed from the template count against Chapter 7's pricing table:
5–10 templates at $12–$27, and 20+ at $27–$67. The two bands between those (1–4 and 11–19)
are interpolated from the table's endpoints, and the generated spec says so rather than
presenting them as the book's numbers.

The app always lists at the **bottom** of the band, with a note to raise the price after
five reviews — the book's stated approach, and its reasoning: a $4 pack signals "made
quickly", the same pack at $17 signals "designed professionally", and the higher-priced
version often converts better because price is one of the few quality signals a buyer has
before downloading.

## What the buyer actually receives

The Reference tab spells out the delivery mechanics, which is where most first packs go
wrong:

1. One Canva design, one template per page, every page named to match the build sheet
2. **Share → Template link** — never an edit link
3. A one-page PDF carrying that link, the fonts, the five hex codes and a two-line "how to
   edit" instruction. *That PDF is the file the buyer downloads.*
4. Free-tier fonts only, or the Pro requirements stated plainly in the listing —
   mismatched fonts are the most common cause of refund requests
5. A licence line, and three to five mockup images

Step 5 is Chapter 7's most-skipped step and its single biggest conversion factor: a mockup
showing the templates in use converts dramatically better than a flat screenshot, and can
double the conversion rate on an otherwise identical listing.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of
  any kind. Verified with a browser run asserting zero non-`file://` requests.
- **Everything is saved** to `localStorage` as you go — your library, catalogue settings,
  validation scores, launch checklist and theme. `⬇ Back up` downloads the lot as JSON;
  `🗑 Clear` backs up first, then wipes. Storage failures (private mode, `file://`
  restrictions) degrade to in-memory rather than breaking the app.
- **Light and dark**, following your system setting, with a manual toggle.
- **Accessible.** Real form controls throughout, `fieldset`/`legend` on every field,
  arrow-key tab navigation, visible focus rings, live-region toasts, and all animation
  disabled under `prefers-reduced-motion`.
- **Printable.** The generated spec has print styles that drop the interface.
- Every spec, listing and catalogue plan is verified to build cleanly across all 3,456
  combinations, with all 13 Etsy tags unique and inside Etsy's 20-character cap.
- The price bands and income figures are the book's, and as its own disclaimer notes, they
  are ranges based on observed outcomes — not guarantees of results.

## Selling what it makes

The spec is the production document; the templates you build from it are the product. But
the spec exports as plain Markdown, which means the Catalogue Planner's output is itself a
sellable artefact — "the 20-pack Canva catalogue plan for wellness coaches" is a swipe-file
product in Chapter 7's own terms, at the $27–$67 band.

You can also sell this builder itself. It is one self-contained HTML file, and "your own
website / anything, including this HTML file itself" is a row in that platform table for a
reason.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub
Pages. Served from this repo's root, the app lives at `/canva-templates/`.
