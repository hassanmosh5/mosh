# Billionaire Structures Guide — Gumroad listing

> Generated from `packaging/products/06-life.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/billionaire-structures/` — cover, square, story and gallery shots.
Package files: `dist/packages/billionaire-structures/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Type | Digital product |
| URL / permalink | `billionaire-structures` → https://REPLACE-ME.gumroad.com/l/billionaire-structures |
| Category | Money, property & life |
| Call to action | I want this! |

**Name** — 28/60 characters

```
Billionaire Structures Guide
```

**Summary (shows under the title)** — 149/255 characters

```
33 holding structures with who controls them, who pays the tax and what happens at death — each priced, and given a verdict against your own numbers.
```

**Tags** — 10/12

```
holding company, family trust, estate planning, asset protection, succession planning, family office, wealth structures, inheritance tax, business structure, offline guide
```

## Versions — one product, three prices

Use Gumroad **Versions**, not three separate products. Three products split your
reviews and your ranking three ways.

| Version | Price | Attach this file |
|---|---|---|
| Solo licence | $69 | `billionaire-structures-solo.zip` |
| Studio licence ← set as default | $173 | `billionaire-structures-studio.zip` |
| Agency licence | $345 | `billionaire-structures-agency.zip` |

Gumroad attaches different files to different versions. Use that rather than
maintaining three products by hand.

**Purchasing power parity:** turn it on. This is built for buyers on metered
data; pricing in US dollars without PPP prices most of them out of it.

## Description — paste into the description field

**Description** — 3172/12000 characters

```
33 holding structures with who controls them, who pays the tax and what happens at death — each priced, and given a verdict against your own numbers.

THE PROBLEM

A list of the structures rich people use is free and useless. Every one of them has an annual bill, a failure mode, and a level of wealth below which it costs more than it will ever save — and almost nobody who sells them says so. Most of the field, moreover, is an answer to a transfer tax that half the world does not levy.

It deals specifically with:

• Being sold a structure designed for a tax your country does not have
• No way to compare an annual cost against a benefit you cannot quantify
• Four different questions — control, tax, protection, succession — treated as one
• Plans with red lines in them that nobody has audited

WHO IT IS FOR

• Business owners who have been quoted for a trust and cannot tell whether it is warranted
• Anyone in a country with no estate tax being sold structures designed around one
• People with real assets and no plan for what happens when they die

WHAT YOU GET

• 33 structures: who owns it, who controls it, who pays the tax, what happens at death
• A price on each one — setup and annual — so the cost is visible next to the benefit
• 15 editable death-tax regimes, including the many that levy nothing
• The freeze, liquidity, control and giving arithmetic
• A verdict per structure against your own figures, most of which will be 'not you'
• A red-lines audit that can fail a plan outright

Delivered as a ZIP: the app itself, a START-HERE page, full usage instructions,
your licence, and a checksum list of every file so you can verify what arrived.

Free updates to the version you bought for 12 months. You keep the files forever either way.

HOW YOU USE IT

1. Open index.html and select your jurisdiction first — it rules structures out by name.
2. Enter your real figures. The verdicts are meaningless without them.
3. Read the structures it rules out and why. That is most of the value.
4. Run the red-lines audit on any plan you have been sold.
5. Take the output to a qualified adviser rather than acting on it.

WHAT SHOULD BE TRUE WHEN YOU FINISH

• A shortlist that is usually much shorter than expected, with reasons
• The wealth level at which each structure starts to pay for itself
• A written brief you can take to an actual adviser, so the meeting starts at question four

WHAT IT IS NOT

• Anyone wanting legal or tax advice — this is educational and computes from your inputs
• People looking for offshore secrecy; that is not what this is about

Not legal, tax or financial advice. Regimes change and the app's 15 are editable precisely because they go stale. Anything you act on should be checked by someone qualified and accountable in your jurisdiction.

These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.

14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
```


## Cover and thumbnail

Gumroad wants a 1280×720 cover and a 600×600 thumbnail.

- Cover: `dist/mockups/billionaire-structures/cover.png` (already 1280×720)
- Thumbnail: `dist/mockups/billionaire-structures/square.png` — crop to 600×600
- Extra gallery images: `dist/mockups/billionaire-structures/gallery-*.png`

These are screenshots of the product running, not stock photography. That is
deliberate — the cover shows what arrives.

## Receipt / thank-you note

Paste into **Content → Receipt note**:

```
1. Open index.html and select your jurisdiction first — it rules structures out by name.
2. Enter your real figures. The verdicts are meaningless without them.
3. Read the structures it rules out and why. That is most of the value.
```

The full receipt text is in `dist/packages/billionaire-structures/receipt-<tier>.txt`.

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
