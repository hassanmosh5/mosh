# Store Setup Guides — Shopify & E-Commerce — Gumroad listing

> Generated from `packaging/products/02-package.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/ecommerce-setup/` — cover, square, story and gallery shots.
Package files: `dist/packages/ecommerce-setup/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Type | Digital product |
| URL / permalink | `ecommerce-setup` → https://REPLACE-ME.gumroad.com/l/ecommerce-setup |
| Category | Package & sell |
| Call to action | I want this! |

**Name** — 41/60 characters

```
Store Setup Guides — Shopify & E-Commerce
```

**Summary (shows under the title)** — 144/255 characters

```
Six weighted questions on whether you need your own store yet, a break-even calculator for platform fees, and the build in eleven ordered steps.
```

**Tags** — 10/12

```
shopify setup, own store vs marketplace, platform fees, break even, digital delivery, ecommerce guide, gumroad fees, store launch, checkout setup, offline guide
```

## Versions — one product, three prices

Use Gumroad **Versions**, not three separate products. Three products split your
reviews and your ranking three ways.

| Version | Price | Attach this file |
|---|---|---|
| Solo licence | $29 | `ecommerce-setup-solo.zip` |
| Studio licence ← set as default | $73 | `ecommerce-setup-studio.zip` |
| Agency licence | $145 | `ecommerce-setup-agency.zip` |

Gumroad attaches different files to different versions. Use that rather than
maintaining three products by hand.

**Purchasing power parity:** turn it on. This is built for buyers on metered
data; pricing in US dollars without PPP prices most of them out of it.

## Description — paste into the description field

**Description** — 3107/12000 characters

```
Six weighted questions on whether you need your own store yet, a break-even calculator for platform fees, and the build in eleven ordered steps.

THE PROBLEM

Every step before this one is documented in detail — validation, listing SEO, pricing bands, launch plans — and then the last step, owning your store, is a single sentence: do it once you are earning consistently. That leaves the two questions that matter unanswered. Is it worth it at your volume, and in what order do you build it?

It deals specifically with:

• Opening a store too early and paying a monthly fee out of three sales
• Staying on a marketplace long past the point the fees exceed a subscription
• Building a store in the wrong order and redoing the checkout twice
• No plan for the direct customer relationship the move was supposed to buy

WHO IT IS FOR

• Sellers doing consistent numbers on Gumroad, Etsy or Selar and wondering about their own store
• Anyone paying marketplace fees and unsure whether a subscription beats them
• First-time store builders who want an order of operations

WHAT YOU GET

• Choose — six weighted questions and a verdict on whether you need a store yet
• A break-even calculator for the only fee question that matters: marketplace percentage against monthly subscription
• Set Up — the build in eleven ordered steps, each with what 'done' looks like
• Payments and digital delivery, including what a store does not do for you
• The migration path off a marketplace without losing the reviews you earned
• A launch checklist for the first week live

Delivered as a ZIP: the app itself, a START-HERE page, full usage instructions,
your licence, and a checksum list of every file so you can verify what arrived.

Free updates to the version you bought for 12 months. You keep the files forever either way.

HOW YOU USE IT

1. Open index.html and answer the six questions honestly.
2. Put your real monthly sales and fee percentage into the break-even calculator.
3. If the verdict is 'not yet', close the tab and re-run it in a quarter. That is a result.
4. If it is yes, work the eleven steps in order.
5. Use the launch checklist before you announce anything.

WHAT SHOULD BE TRUE WHEN YOU FINISH

• A yes or no on the store, with the volume figure that decided it
• The break-even number of sales per month, in your currency
• Eleven steps in the right order, so nothing gets built twice

WHAT IT IS NOT

• Sellers with no sales yet — the honest answer will be 'not yet' and you can have that for free
• Physical-goods logistics; this is about digital delivery

The break-even is computed from the fee percentages and volume you type. It has no live pricing for any platform — check the current plans before you commit.

These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.

14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
```


## Cover and thumbnail

Gumroad wants a 1280×720 cover and a 600×600 thumbnail.

- Cover: `dist/mockups/ecommerce-setup/cover.png` (already 1280×720)
- Thumbnail: `dist/mockups/ecommerce-setup/square.png` — crop to 600×600
- Extra gallery images: `dist/mockups/ecommerce-setup/gallery-*.png`

These are screenshots of the product running, not stock photography. That is
deliberate — the cover shows what arrives.

## Receipt / thank-you note

Paste into **Content → Receipt note**:

```
1. Open index.html and answer the six questions honestly.
2. Put your real monthly sales and fee percentage into the break-even calculator.
3. If the verdict is 'not yet', close the tab and re-run it in a quarter. That is a result.
```

The full receipt text is in `dist/packages/ecommerce-setup/receipt-<tier>.txt`.

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
