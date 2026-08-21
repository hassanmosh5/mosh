# Meta Ads & Pixel Blueprints — Gumroad listing

> Generated from `packaging/products/04-growth.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/meta-ads/` — cover, square, story and gallery shots.
Package files: `dist/packages/meta-ads/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Type | Digital product |
| URL / permalink | `meta-ads` → https://moshdigitalstudios.gumroad.com/l/meta-ads |
| Category | Marketing & growth |
| Call to action | I want this! |

**Name** — 27/60 characters

```
Meta Ads & Pixel Blueprints
```

**Summary (shows under the title)** — 150/255 characters

```
The tracking code, the event map, the campaign structure — and the arithmetic that decides whether any of it can work at the budget you actually have.
```

**Tags** — 10/12

```
meta ads, facebook pixel, conversions api, campaign structure, learning phase, cpa calculator, ad budget, event tracking, paid traffic, offline tool
```

## Versions — one product, three prices

Use Gumroad **Versions**, not three separate products. Three products split your
reviews and your ranking three ways.

| Version | Price | Attach this file |
|---|---|---|
| Solo licence | $49 | `meta-ads-solo.zip` |
| Studio licence ← set as default | $123 | `meta-ads-studio.zip` |
| Agency licence | $245 | `meta-ads-agency.zip` |

Gumroad attaches different files to different versions. Use that rather than
maintaining three products by hand.

**Purchasing power parity:** turn it on. This is built for buyers on metered
data; pricing in US dollars without PPP prices most of them out of it.

## Description — paste into the description field

**Description** — 3049/12000 characters

```
The tracking code, the event map, the campaign structure — and the arithmetic that decides whether any of it can work at the budget you actually have.

THE PROBLEM

Paid traffic fails at small budgets in a way nobody warns about: the campaign never gathers enough conversion events to leave the learning phase, so the algorithm optimises on noise and the money goes out in a straight line. That is arithmetic, and it can be checked before the first cedi is spent — but almost every guide starts with campaign structure and never mentions it.

It deals specifically with:

• Spending a budget too small to exit the learning phase
• A Pixel installed but no event map, so nothing is optimisable
• Campaign structures copied from a video with different economics
• No idea what a conversion may cost before it stops making sense

WHO IT IS FOR

• Anyone about to spend their first $500 on Meta ads
• Agencies running client ads without a documented event map
• Sellers whose Pixel fires on every page and measures nothing

WHAT YOU GET

• The tracking setup: Pixel and Conversions API, with what each one is actually for
• An event map derived from your funnel, not a generic list of standard events
• Campaign structure per objective, with the budget each structure needs
• The learning-phase arithmetic: events per week required, at your conversion rate
• Maximum allowable cost per acquisition from your own margin
• A verdict that is allowed to say your budget cannot work yet

Delivered as a ZIP: the app itself, a START-HERE page, full usage instructions,
your licence, and a checksum list of every file so you can verify what arrived.

Free updates to the version you bought for 12 months. You keep the files forever either way.

HOW YOU USE IT

1. Open index.html and enter your margin and conversion rate first.
2. Read the learning-phase verdict before designing anything. If it says the budget is too small, that is the most valuable output here.
3. Build the event map from your real funnel steps.
4. Take the tracking spec to whoever installs it — it is written to be handed over.
5. Set up campaigns to the structure, and hold the budget it specifies.

WHAT SHOULD BE TRUE WHEN YOU FINISH

• A yes or no on paid traffic at your current budget and margin
• An event map you can hand to whoever installs the code
• A campaign structure with a budget that matches it

WHAT IT IS NOT

• Anyone wanting creative or copy — this is measurement and structure
• Advertisers with large budgets and an in-house analyst

It has no access to your ad account and cannot see your results. Everything is computed from figures you enter, and the thresholds are stated on screen.

These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.

14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
```


## Cover and thumbnail

Gumroad wants a 1280×720 cover and a 600×600 thumbnail.

- Cover: `dist/mockups/meta-ads/cover.png` (already 1280×720)
- Thumbnail: `dist/mockups/meta-ads/square.png` — crop to 600×600
- Extra gallery images: `dist/mockups/meta-ads/gallery-*.png`

These are screenshots of the product running, not stock photography. That is
deliberate — the cover shows what arrives.

## Receipt / thank-you note

Paste into **Content → Receipt note**:

```
1. Open index.html and enter your margin and conversion rate first.
2. Read the learning-phase verdict before designing anything. If it says the budget is too small, that is the most valuable output here.
3. Build the event map from your real funnel steps.
```

The full receipt text is in `dist/packages/meta-ads/receipt-<tier>.txt`.

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
