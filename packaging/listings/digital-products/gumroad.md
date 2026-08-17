# Digital Products Maker — Gumroad listing

> Generated from `packaging/products/01-decide.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/digital-products/` — cover, square, story and gallery shots.
Package files: `dist/packages/digital-products/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Type | Digital product |
| URL / permalink | `digital-products` → https://REPLACE-ME.gumroad.com/l/digital-products |
| Category | Start & decide |
| Call to action | I want this! |

**Name** — 22/60 characters

```
Digital Products Maker
```

**Summary (shows under the title)** — 144/255 characters

```
Eight product formats compared on how much AI really carries, a validation gate with hard floors that can return a kill, and the fee arithmetic.
```

**Tags** — 10/12

```
digital product validation, product idea checker, ebook vs course, template pack, pricing calculator, gumroad seller tools, product market fit, ai product workflow, offline tool, etsy digital
```

## Versions — one product, three prices

Use Gumroad **Versions**, not three separate products. Three products split your
reviews and your ranking three ways.

| Version | Price | Attach this file |
|---|---|---|
| Solo licence | $39 | `digital-products-solo.zip` |
| Studio licence ← set as default | $98 | `digital-products-studio.zip` |
| Agency licence | $195 | `digital-products-agency.zip` |

Gumroad attaches different files to different versions. Use that rather than
maintaining three products by hand.

**Purchasing power parity:** turn it on. This is built for buyers on metered
data; pricing in US dollars without PPP prices most of them out of it.

## Description — paste into the description field

**Description** — 3484/12000 characters

```
Eight product formats compared on how much AI really carries, a validation gate with hard floors that can return a kill, and the fee arithmetic.

THE PROBLEM

A digital product has no marginal cost, which is the whole appeal and also the trap: the entire cost is paid up front, before one person has said they want it. Eleven hours in a document is eleven hours whether it sells four hundred copies or none — and by the time you find out, the money is already spent. The only decision that changes the outcome is made before you build.

It deals specifically with:

• Picking a format because it sounds fun rather than because AI actually carries most of the work
• Building for weeks with no evidence anyone will pay, then calling it a marketing problem
• Pricing at $19 without knowing what the platform fee, the refund rate and the traffic leave you
• Prompts that produce a generic first draft because they were written from nothing

WHO IT IS FOR

• Anyone about to spend a weekend building something nobody asked for
• Creators choosing between an ebook, a template pack, a course and a notion of a course
• Sellers who cannot work out why a $19 product earns $6

WHAT YOU GET

• Formats — eight product types scored on how much of the work AI genuinely does, with build hours attached
• The gate — three criteria with hard floors; miss one and the app says kill, not 'consider adjusting'
• 30-Minute Validation — the method on a clock, with what to search and what counts as evidence
• Build — the eight-step workflow with the prompts written from your own answers, not templates
• Numbers — fee, refund and traffic arithmetic that says how many visitors the price actually needs
• Launch and Kit — the listing structure and a one-page export of the whole decision

Delivered as a ZIP: the app itself, a START-HERE page, full usage instructions,
your licence, and a checksum list of every file so you can verify what arrived.

Free updates to the version you bought for 12 months. You keep the files forever either way.

HOW YOU USE IT

1. Open index.html and describe the product in the Product tab — one honest paragraph.
2. Compare Formats before you commit. The build-hours column is the one people skip and regret.
3. Run the gate. If it kills the idea, that is the product working; change an input or change the idea.
4. Do the 30-minute validation with real marketplace tabs open. The app has no network access — the evidence has to be yours.
5. Take the Build prompts into any chat model, then run the Numbers tab before you set a price.

WHAT SHOULD BE TRUE WHEN YOU FINISH

• A yes or a no on this specific product, with the number that decided it
• If yes: the eight prompts that build it, already carrying your context
• The visitor count your price and conversion rate really require, before you promise yourself anything

WHAT IT IS NOT

• People who want the product written for them — nothing here talks to a model
• Anyone unwilling to have an idea killed by their own numbers

Both gates can return a kill. The arithmetic quotes figures, never percentages of success it cannot know.

These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.

14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
```


## Cover and thumbnail

Gumroad wants a 1280×720 cover and a 600×600 thumbnail.

- Cover: `dist/mockups/digital-products/cover.png` (already 1280×720)
- Thumbnail: `dist/mockups/digital-products/square.png` — crop to 600×600
- Extra gallery images: `dist/mockups/digital-products/gallery-*.png`

These are screenshots of the product running, not stock photography. That is
deliberate — the cover shows what arrives.

## Receipt / thank-you note

Paste into **Content → Receipt note**:

```
1. Open index.html and describe the product in the Product tab — one honest paragraph.
2. Compare Formats before you commit. The build-hours column is the one people skip and regret.
3. Run the gate. If it kills the idea, that is the product working; change an input or change the idea.
```

The full receipt text is in `dist/packages/digital-products/receipt-<tier>.txt`.

## Delivery

Gumroad hosts the file and emails the link itself — nothing else to configure.

If you also want the sale recorded in your own database, point
**Settings → Advanced → Ping** at:

```
https://REPLACE-ME.example.com/api/webhooks/gumroad?secret=YOUR_GUMROAD_PING_SECRET
```

Gumroad does not sign its pings, so the URL secret and the seller-ID check in
that route are what authenticate it. See `docs/SELLING.md`.

---
14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
