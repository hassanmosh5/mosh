# Real Estate Calculator — Gumroad listing

> Generated from `packaging/products/06-life.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/real-estate-calculator/` — cover, square, story and gallery shots.
Package files: `dist/packages/real-estate-calculator/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Type | Digital product |
| URL / permalink | `real-estate-calculator` → https://REPLACE-ME.gumroad.com/l/real-estate-calculator |
| Category | Money, property & life |
| Call to action | I want this! |

**Name** — 22/60 characters

```
Real Estate Calculator
```

**Summary (shows under the title)** — 161/255 characters

```
What a deal really costs to buy, what a lender will really lend, what the tenant leaves after tax, and how wrong your assumptions can be before it stops working.
```

**Tags** — 10/12

```
buy to let calculator, property investment, rental yield, cash on cash, stress test, irr, landlord, underwriting, property deal analysis, offline
```

## Versions — one product, three prices

Use Gumroad **Versions**, not three separate products. Three products split your
reviews and your ranking three ways.

| Version | Price | Attach this file |
|---|---|---|
| Solo licence | $49 | `real-estate-calculator-solo.zip` |
| Studio licence ← set as default | $123 | `real-estate-calculator-studio.zip` |
| Agency licence | $245 | `real-estate-calculator-agency.zip` |

Gumroad attaches different files to different versions. Use that rather than
maintaining three products by hand.

**Purchasing power parity:** turn it on. This is built for buyers on metered
data; pricing in US dollars without PPP prices most of them out of it.

## Description — paste into the description field

**Description** — 3061/12000 characters

```
What a deal really costs to buy, what a lender will really lend, what the tenant leaves after tax, and how wrong your assumptions can be before it stops working.

THE PROBLEM

Rent divided by price takes two seconds and answers nothing. It is missing the purchase tax, the void, the capital reserve, the lender's stress test, the finance-cost restriction and the day the fixed rate ends. Purchase costs alone routinely add 10–15% before the first tenant moves in, and every percentage return you quote is measured against the wrong denominator until you include them.

It deals specifically with:

• Yields calculated on the purchase price rather than the total capital in
• Deals that pass on today's rate and fail the lender's stress test
• No void or capital reserve, so the first boiler wipes out the year
• Assumptions with no sensitivity analysis behind them

WHO IT IS FOR

• First-time buy-to-let buyers
• Anyone underwriting on a gross yield and a mortgage payment
• Investors stress-testing a deal before an offer

WHAT YOU GET

• Full acquisition cost: purchase tax, legal, surcharges, works and contingency
• Lender arithmetic including the stress test that decides the actual loan
• Post-tax cash flow with the finance-cost restriction handled properly
• Void and capital reserves as line items, not optimism
• Cash-on-cash, IRR and equity multiple measured against total capital in
• Sensitivity: how far rent, rate and void can move before the deal breaks
• The refinance cliff — what happens the day the fix ends

Delivered as a ZIP: the app itself, a START-HERE page, full usage instructions,
your licence, and a checksum list of every file so you can verify what arrived.

Free updates to the version you bought for 12 months. You keep the files forever either way.

HOW YOU USE IT

1. Open index.html and enter the purchase price plus every acquisition cost you can name.
2. Set the lender's stress rate, not the pay rate.
3. Add void and capital reserves before you look at any return figure.
4. Read the sensitivity table — the breaking points matter more than the headline return.
5. Model the refinance cliff at the fix end date before you commit.

WHAT SHOULD BE TRUE WHEN YOU FINISH

• A total capital-in figure, which is usually the surprise
• The rent, rate and void levels at which the deal stops working
• A number you can defend to a lender or a partner

WHAT IT IS NOT

• Anyone wanting live market or rate data — you supply the figures
• Investment advice, or a substitute for your own tax position

Tax treatment varies by country and by how you hold the property. The arithmetic is explicit and editable; the assumptions behind it are yours to check.

These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.

14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
```


## Cover and thumbnail

Gumroad wants a 1280×720 cover and a 600×600 thumbnail.

- Cover: `dist/mockups/real-estate-calculator/cover.png` (already 1280×720)
- Thumbnail: `dist/mockups/real-estate-calculator/square.png` — crop to 600×600
- Extra gallery images: `dist/mockups/real-estate-calculator/gallery-*.png`

These are screenshots of the product running, not stock photography. That is
deliberate — the cover shows what arrives.

## Receipt / thank-you note

Paste into **Content → Receipt note**:

```
1. Open index.html and enter the purchase price plus every acquisition cost you can name.
2. Set the lender's stress rate, not the pay rate.
3. Add void and capital reserves before you look at any return figure.
```

The full receipt text is in `dist/packages/real-estate-calculator/receipt-<tier>.txt`.

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
