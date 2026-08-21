# Real Estate Calculator — Shopify listing

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
| Handle | `real-estate-calculator` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | ðŸ¦ Money, property & life |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 22/70 characters

```
Real Estate Calculator
```

**SEO title** — 50/70 characters

```
Real Estate Calculator — The price is not the cost
```

**Meta description** — 153/155 characters

```
What a deal really costs to buy, what a lender will really lend, what the tenant leaves after tax, and how wrong your assumptions can be before it stops…
```


**Tags**

```
buy to let calculator, property investment, rental yield, cash on cash, stress test, irr, landlord, underwriting, property deal analysis, offline
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $49 | `REALESTATECALCULATOR-SOLO` | `real-estate-calculator-solo.zip` |
| Studio licence | $123 | `REALESTATECALCULATOR-STUDIO` | `real-estate-calculator-studio.zip` |
| Agency licence | $245 | `REALESTATECALCULATOR-AGENCY` | `real-estate-calculator-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>What a deal really costs to buy, what a lender will really lend, what the tenant leaves after tax, and how wrong your assumptions can be before it stops working.</strong></p>
<h3>The problem</h3>
<p>Rent divided by price takes two seconds and answers nothing. It is missing the purchase tax, the void, the capital reserve, the lender&#39;s stress test, the finance-cost restriction and the day the fixed rate ends. Purchase costs alone routinely add 10–15% before the first tenant moves in, and every percentage return you quote is measured against the wrong denominator until you include them.</p>
<p>It deals specifically with:</p>
<ul><li>Yields calculated on the purchase price rather than the total capital in</li><li>Deals that pass on today&#39;s rate and fail the lender&#39;s stress test</li><li>No void or capital reserve, so the first boiler wipes out the year</li><li>Assumptions with no sensitivity analysis behind them</li></ul>
<h3>Who it is for</h3>
<ul><li>First-time buy-to-let buyers</li><li>Anyone underwriting on a gross yield and a mortgage payment</li><li>Investors stress-testing a deal before an offer</li></ul>
<h3>What you get</h3>
<ul><li>Full acquisition cost: purchase tax, legal, surcharges, works and contingency</li><li>Lender arithmetic including the stress test that decides the actual loan</li><li>Post-tax cash flow with the finance-cost restriction handled properly</li><li>Void and capital reserves as line items, not optimism</li><li>Cash-on-cash, IRR and equity multiple measured against total capital in</li><li>Sensitivity: how far rent, rate and void can move before the deal breaks</li><li>The refinance cliff — what happens the day the fix ends</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and enter the purchase price plus every acquisition cost you can name.</li><li>Set the lender&#39;s stress rate, not the pay rate.</li><li>Add void and capital reserves before you look at any return figure.</li><li>Read the sensitivity table — the breaking points matter more than the headline return.</li><li>Model the refinance cliff at the fix end date before you commit.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A total capital-in figure, which is usually the surprise</li><li>The rent, rate and void levels at which the deal stops working</li><li>A number you can defend to a lender or a partner</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone wanting live market or rate data — you supply the figures</li><li>Investment advice, or a substitute for your own tax position</li></ul>
<h3>What it cannot do</h3>
<p>Tax treatment varies by country and by how you hold the property. The arithmetic is explicit and editable; the assumptions behind it are yours to check.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/real-estate-calculator/square.png` — main image, square, works in every grid
2. `dist/mockups/real-estate-calculator/cover.png`
3. `dist/mockups/real-estate-calculator/gallery-*.png`

## Digital delivery — read this before publishing

**Shopify does not deliver digital files on its own.** Pick one:

**Option A — a digital-downloads app.** Simplest. Install one, attach the ZIP
per variant, and it emails the buyer. No code, a monthly fee, and the buyer's
download lives inside that app.

**Option B — this repository's own fulfilment.** Create a webhook under
Settings → Notifications → Webhooks:

| Field | Value |
|---|---|
| Event | `orders/paid` |
| Format | JSON |
| URL | `https://paystack.shop/mosh-digital-studios/api/webhooks/shopify` |

Copy the signing secret Shopify shows you into `SHOPIFY_WEBHOOK_SECRET`. The
route verifies the HMAC on the raw body, matches each line item's SKU to a
package, and emails a signed download link that expires in
30 days after 8 downloads.

Map each variant SKU in `packaging/sku-map.json` so the webhook knows which
ZIP a line item refers to.

---
14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
