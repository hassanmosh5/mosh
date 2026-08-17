# Farmer's Companion — Gumroad listing

> Generated from `packaging/products/06-life.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/farmers-companion/` — cover, square, story and gallery shots.
Package files: `dist/packages/farmers-companion/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Type | Digital product |
| URL / permalink | `farmers-companion` → https://REPLACE-ME.gumroad.com/l/farmers-companion |
| Category | Money, property & life |
| Call to action | I want this! |

**Name** — 18/60 characters

```
Farmer's Companion
```

**Summary (shows under the title)** — 139/255 characters

```
Which crop on which plot, planted when, watered and fed with what — ranked against whatever actually runs out first: labour, water or cash.
```

**Tags** — 10/12

```
farm planning, crop planning, smallholder, yield estimate, irrigation planning, farm cash flow, agriculture tool, crop rotation, labour planning, offline
```

## Versions — one product, three prices

Use Gumroad **Versions**, not three separate products. Three products split your
reviews and your ranking three ways.

| Version | Price | Attach this file |
|---|---|---|
| Solo licence | $39 | `farmers-companion-solo.zip` |
| Studio licence ← set as default | $98 | `farmers-companion-studio.zip` |
| Agency licence | $195 | `farmers-companion-agency.zip` |

Gumroad attaches different files to different versions. Use that rather than
maintaining three products by hand.

**Purchasing power parity:** turn it on. This is built for buyers on metered
data; pricing in US dollars without PPP prices most of them out of it.

## Description — paste into the description field

**Description** — 2994/12000 characters

```
Which crop on which plot, planted when, watered and fed with what — ranked against whatever actually runs out first: labour, water or cash.

THE PROBLEM

Every farm-planning spreadsheet asks for a yield, and nobody can honestly supply one. Worse, most of them rank crops by margin per hectare — which is the right ranking only if land is what you run out of, and land almost never is. What runs out first is the week three crops all need weeding, the water in the driest month, or the cash between the fertiliser and the first sale.

It deals specifically with:

• Yield figures typed in as wishes and then treated as facts
• Ranking by margin per hectare when land is not the binding constraint
• Planting calendars that collide in the peak labour week
• Cash-flow gaps between input costs and first sale

WHO IT IS FOR

• Smallholders planning a season across several plots
• Agricultural extension workers and cooperatives
• Anyone whose farm plan is a spreadsheet with an optimistic yield in it

WHAT YOU GET

• Yield derived from six checkable things, with the whole multiplication shown
• Constraint detection: peak-week labour, water in the dry month, or working capital
• Ranking by margin per unit of the binding constraint, with a warning when it disagrees with per-hectare
• Plot-by-plot planting calendar with the collisions flagged
• Irrigation and fertiliser plans per planting
• Season cash flow, including the gap before the first sale

Delivered as a ZIP: the app itself, a START-HERE page, full usage instructions,
your licence, and a checksum list of every file so you can verify what arrived.

Free updates to the version you bought for 12 months. You keep the files forever either way.

HOW YOU USE IT

1. Open index.html and enter your plots, labour hours and water availability honestly.
2. Let it derive the yield. It starts at the crop ceiling and works down from what it can check.
3. Read which constraint it found binding — that is the whole ranking.
4. Fix the calendar collisions before planting, not during weeding.
5. Check the cash-flow gap and plan for it.

WHAT SHOULD BE TRUE WHEN YOU FINISH

• A crop plan ranked against what actually limits your farm
• A yield estimate you can defend, with every factor visible
• The week the labour plan breaks, before the season starts

WHAT IT IS NOT

• Anyone wanting local variety data or live prices — you supply those
• Large mechanised operations with farm-management software

It derives rather than accepts yields, which makes it conservative. Local conditions, varieties and prices are yours to enter, and it cannot check any of them.

These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.

14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
```


## Cover and thumbnail

Gumroad wants a 1280×720 cover and a 600×600 thumbnail.

- Cover: `dist/mockups/farmers-companion/cover.png` (already 1280×720)
- Thumbnail: `dist/mockups/farmers-companion/square.png` — crop to 600×600
- Extra gallery images: `dist/mockups/farmers-companion/gallery-*.png`

These are screenshots of the product running, not stock photography. That is
deliberate — the cover shows what arrives.

## Receipt / thank-you note

Paste into **Content → Receipt note**:

```
1. Open index.html and enter your plots, labour hours and water availability honestly.
2. Let it derive the yield. It starts at the crop ceiling and works down from what it can check.
3. Read which constraint it found binding — that is the whole ranking.
```

The full receipt text is in `dist/packages/farmers-companion/receipt-<tier>.txt`.

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
