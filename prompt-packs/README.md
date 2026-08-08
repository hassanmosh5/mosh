# AI Prompt Packs for Businesses & Creators

Eight finished, sellable prompt packs — **160 role-first prompts** — plus the machinery to
turn any one of them into a product file you can list this afternoon.

Open `index.html` in any modern browser — no install, no build step, no accounts, no
internet connection, and no data ever leaves the device.

## Why this app

Chapter 10 of *The AI Income Blueprint* (`books/THE_AI_INCOME_BLUEPRINT.pdf`) is the one
chapter that describes a product rather than a service. It sets out what separates a pack
that earns five-star reviews from one that earns refund requests — five characteristics, a
four-hour creation workflow, a pricing model, four marketing channels — and then scopes six
sample packs at the level of a bullet list.

This builds them. Not the outline of a pack: the pack.

It is deliberately the opposite of the [Wealth Ideas Prompt Generator](../prompt-generator/)
in this repo. That app is combinatorial — pick fields from dropdowns, generate one of 99,000
prompts. This one is curated: a fixed catalogue of finished prompts, written to be used as
they stand, organised the way the buyer's working day is organised.

## What's in it

| Tab | Source | What it does |
|---|---|---|
| 📚 **The Packs** | Ch. 10 | All 8 packs, filterable by track, with full-text search across every prompt. Each pack opens to its 5 sections, 20 prompts, market notes, tier, price band and platform guidance |
| 👤 **Make It Yours** | Ch. 10, Characteristic 3 | Nine profile fields that auto-fill placeholders across the whole library. Each field shows how many prompts it actually appears in, counted at runtime |
| ⭐ **My Picks** | Ch. 5 | Star prompts across packs; exports as its own custom file |
| 📦 **Export & Sell** | Ch. 10, steps 5–8 | Any pack → a complete product file (cover, how-to-use guide, contents, numbered prompts, licence) in Markdown or plain text. Plus listing title, description and tags from the book's title formula, and the three-tier pricing table |
| 📈 **Catalogue Plan** | Ch. 10, p. 145 | The five-rung upsell ladder computed for any pack, a 12-week publishing schedule, the income projections and the four marketing channels |
| 📖 **The Craft** | Ch. 5 & 10 | The five characteristics, CLEAR, the 3-Pass Method, the four costly mistakes, the 8-step workflow, and the book's niche list with the 15 this library serves marked and the other 31 left for you |

## The eight packs

**For businesses**

| Pack | Audience | Band |
|---|---|---|
| 🏡 The Real Estate Agent's AI Toolkit | Independent residential agents, 2–15 years in | $17–$27 |
| 🧑‍💼 The HR Professional's AI Command Centre | People-ops leads in companies of 50–1,000 | $27–$47 |
| 🔧 The Local Service Business Kit | Trades, salons, restaurants, gyms — owner-operators | $14–$24 |
| 🛍️ The E-commerce Seller's Revenue Kit | Shopify, Etsy, Amazon sellers at $2k–$50k/month | $19–$29 |

**For creators**

| Pack | Audience | Band |
|---|---|---|
| 🎓 The Online Course Creator's Full Stack | Digital educators launching or growing a course | $27–$47 |
| 🎙️ The YouTube & Podcast Studio | 500–100k subscribers, publishing weekly | $17–$27 |
| ✍️ The Newsletter & Personal Brand Engine | Writers and solo experts building in public | $17–$27 |
| 🧩 The Digital Product Maker's Kit | Template, planner and workbook sellers | $19–$29 |

Three of these are the book's own scoped samples built out in full — Pack 1 (real estate),
Pack 3 (HR) and Pack 5 (course creator). The other five come from its 50-niche list.

## What the app doesn't cover, and why

The book scopes six sample packs. Three are here. The personal trainer and virtual assistant
packs were cut for scope — eight packs at twenty prompts was the budget, and it had to split
evenly between the two audiences the title promises.

The therapist's practice marketing kit was left out for a different reason. The book prices
it higher precisely because of "ethical complexity", and a pack of marketing prompts aimed at
clinicians needs the ethical review of someone who holds the registration — not a template
written blind. The Craft tab has the workflow for building it; a practitioner should be the
one to run it.

## Every prompt is checked, not just written

A validation pass runs over the data and asserts all of it:

- **160 prompts**, 8 packs × 5 sections × 4 prompts, no exceptions
- **Every prompt opens with `You are a…`** — Chapter 10 calls role-first structure "the single
  most impactful structural element of a high-quality prompt", so it is enforced rather than
  intended
- **1,247 placeholders**, averaging 7.8 per prompt, every bracket balanced, none empty
- **321 follow-up instructions** — at least two per prompt, because the book's third costly
  mistake is a buyer who doesn't know how to iterate
- No duplicate titles, no prompt under 350 characters, and every pack's export file builds in
  both formats and both placeholder modes

## An honest note on tiers

Twenty prompts is **Starter** scope on the book's own count (20–25 prompts, $9–$17). But every
pack here ships with five use-case sections and a how-to-use guide, which is **Standard**-tier
structure (40–60 prompts, $17–$37). They sit between the two, and the app says so in the
pricing hint rather than quietly claiming the higher tier.

Three packs are priced above the Starter band anyway — HR at $27–$47, course creators at
$27–$47, e-commerce at $19–$29 — because Chapter 10 prices by how much a buyer's profession
will pay, not by prompt count. Professional audiences carry the higher willingness to pay; the
book is explicit about it.

## Selling versus using

The same 160 prompts serve both, and the app keeps the two modes distinct:

- **Using them.** Fill in the nine profile fields and every prompt in the library rewrites
  itself, live. Filled placeholders turn green; the ones still open stay amber and are counted
  on each prompt.
- **Selling them.** Export with placeholders left blank — the default — because a buyer's pack
  must carry its own fields. Export with them pre-filled and the cover page prints a warning
  saying so, so you can't ship your own details by accident.

The exported file is plain Markdown or text, so it uploads as-is to Gumroad and Payhip. Etsy
and Creative Market want a PDF: use the print button, or paste into Google Docs or Canva Docs
and export from there.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of any
  kind. Verified with a browser run asserting zero non-`file://` requests, and zero console
  errors across every tab.
- **Everything is saved** to `localStorage` as you go — profile, picks, export settings,
  schedule, theme. `⬇ Back up` downloads the lot as JSON; `🗑 Clear` backs up first, then
  wipes. Storage failures (private mode, `file://` restrictions) degrade to in-memory with a
  visible warning rather than breaking the app.
- **Light and dark**, following your system setting, with a manual toggle.
- **Accessible.** Real ARIA tablist with arrow-key navigation, `fieldset`/`legend` on grouped
  controls, `aria-pressed` on every toggle, visible focus rings, live-region toasts, and all
  animation disabled under `prefers-reduced-motion`. No horizontal overflow at 390px on any tab.
- **Printable.** The export prints to a clean typeset page with the interface dropped.
- The prices, income figures and timelines are the book's, and as its own disclaimer notes,
  they are ranges based on observed outcomes — not guarantees of results.

## One thing the app will not do for you

The book's second costly mistake is prompts that produce generic output, and its fix is to
test every prompt before publishing. Step 3 of the eight-step workflow — human enrichment — is
marked in The Craft tab as the step that cannot be skipped and cannot be automated.

So: these prompts are written to the book's structure, but they have not been run against your
market with your knowledge in them. Before you list any of these as your own product, run
10–15 of them, and put in the domain-specific language a real practitioner in your niche would
recognise. That pass is the entire difference between a pack that earns reviews and one that
earns refunds, and it is the one part of this that has to be yours.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub
Pages. Served from this repo's root, the app lives at `/prompt-packs/`.
