# MOSH Packaging Agent — Gumroad listing

> Generated from `packaging/products/02-package.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/packaging-agent/` — cover, square, story and gallery shots.
Package files: `dist/packages/packaging-agent/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Type | Digital product |
| URL / permalink | `packaging-agent` → https://moshdigitalstudios.gumroad.com/l/packaging-agent |
| Category | Package & sell |
| Call to action | I want this! |

**Name** — 20/60 characters

```
MOSH Packaging Agent
```

**Summary (shows under the title)** — 168/255 characters

```
Turns one finished asset into the whole commercial package: four priced tiers, ~50 files, four marketplace listings, 120 keywords, 50 posts and a launch plan, as a ZIP.
```

**Tags** — 10/12

```
digital product packaging, product listing generator, gumroad listing, selar, licence template, product tiers, launch plan, marketplace seo, zip export, offline app
```

## Versions — one product, three prices

Use Gumroad **Versions**, not three separate products. Three products split your
reviews and your ranking three ways.

| Version | Price | Attach this file |
|---|---|---|
| Solo licence | $69 | `packaging-agent-solo.zip` |
| Studio licence ← set as default | $173 | `packaging-agent-studio.zip` |
| Agency licence | $345 | `packaging-agent-agency.zip` |

Gumroad attaches different files to different versions. Use that rather than
maintaining three products by hand.

**Purchasing power parity:** turn it on. This is built for buyers on metered
data; pricing in US dollars without PPP prices most of them out of it.

## Description — paste into the description field

**Description** — 3278/12000 characters

```
Turns one finished asset into the whole commercial package: four priced tiers, ~50 files, four marketplace listings, 120 keywords, 50 posts and a launch plan, as a ZIP.

THE PROBLEM

An AI output is not a product. The gap between the two is not creativity, it is a list of specific artefacts: a licence saying what a buyer may resell, a price that sits somewhere defensible, a file list published before payment, a paragraph naming what the thing cannot do. That list is finite, nearly identical for every digital product, and writing it by hand for the fourth time is the reason most finished assets never get listed.

It deals specifically with:

• Finished work that never ships because packaging it is a day of tedium
• Listings rewritten from scratch for each marketplace and truncated on paste
• Prices picked by feel, with no tier structure underneath them
• No licence — the most common cause of a resale dispute

WHO IT IS FOR

• Anyone with finished assets sitting in a folder, unlisted
• Studios shipping more than one product a month
• Sellers who have written the same licence and listing four times

WHAT YOU GET

• A monetisation score on the asset before anything else is generated
• Descriptions written to exact word counts, plus four priced tiers in dollars and cedis
• ~50 files across a ten-folder structure — five of them typeset as real PDFs in the browser
• Listings for Gumroad, Selar, Paystack and Shopify with every character limit enforced
• 120 keywords, 50 social posts, a five-step funnel and a launch plan
• Everything downloadable as one ZIP, plus a separate customer ZIP per tier

Delivered as a ZIP: the app itself, a START-HERE page, full usage instructions,
your licence, and a checksum list of every file so you can verify what arrived.

Free updates to the version you bought for 12 months. You keep the files forever either way.

HOW YOU USE IT

1. Open index.html and fill in the ten fields about one finished asset.
2. Read the monetisation score before generating. A low score is information, not an obstacle.
3. Generate, then read the descriptions and edit the claims — it knows only what you typed.
4. Download the full ZIP for yourself and the per-tier customer ZIP for buyers.
5. Paste each marketplace listing into its platform; the character counts already fit.

WHAT SHOULD BE TRUE WHEN YOU FINISH

• A folder you could upload to a marketplace this afternoon
• The same ten inputs always produce the same fifty files — a listing you approved on Monday is the listing that ships
• One folder it deliberately leaves empty, because it has never seen your product

WHAT IT IS NOT

• People without a finished asset — it packages, it does not create
• Anyone expecting it to describe features it was never told about

Nothing is sampled from a model, so output is deterministic. It has never seen your product and says so in the one folder it cannot fill.

These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.

14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
```


## Cover and thumbnail

Gumroad wants a 1280×720 cover and a 600×600 thumbnail.

- Cover: `dist/mockups/packaging-agent/cover.png` (already 1280×720)
- Thumbnail: `dist/mockups/packaging-agent/square.png` — crop to 600×600
- Extra gallery images: `dist/mockups/packaging-agent/gallery-*.png`

These are screenshots of the product running, not stock photography. That is
deliberate — the cover shows what arrives.

## Receipt / thank-you note

Paste into **Content → Receipt note**:

```
1. Open index.html and fill in the ten fields about one finished asset.
2. Read the monetisation score before generating. A low score is information, not an obstacle.
3. Generate, then read the descriptions and edit the claims — it knows only what you typed.
```

The full receipt text is in `dist/packages/packaging-agent/receipt-<tier>.txt`.

## Delivery

Gumroad hosts the file and emails the link itself — nothing else to configure.

If you also want the sale recorded in your own database, point
**Settings → Advanced → Ping** at:

```
https://paystack.shop/mosh-digital-studios/api/webhooks/gumroad?secret=YOUR_GUMROAD_PING_SECRET
```

Gumroad does not sign its pings, so the URL secret and the seller-ID check in
that route are what authenticate it. See `docs/SELLING.md`.

---
14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
