# CLEAR AI Board of Directors — Shopify listing

> Generated from `packaging/products/01-decide.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/board-of-directors/` — cover, square, story and gallery shots.
Package files: `dist/packages/board-of-directors/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `board-of-directors` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | ðŸ§­ Start & decide |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 27/70 characters

```
CLEAR AI Board of Directors
```

**SEO title** — 66/70 characters

```
CLEAR AI Board of Directors — Fifteen directors, allowed to say no
```

**Meta description** — 153/155 characters

```
Fifteen seats score your decision against your own numbers, argue with each other, simulate three years of downside, and return a verdict that can be no.
```


**Tags**

```
business decision tool, board of directors, unit economics, risk analysis, founder tools, decision framework, pre-mortem, runway calculator, custom gpt, offline app
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $49 | `BOARDOFDIRECTORS-SOLO` | `board-of-directors-solo.zip` |
| Studio licence | $123 | `BOARDOFDIRECTORS-STUDIO` | `board-of-directors-studio.zip` |
| Agency licence | $245 | `BOARDOFDIRECTORS-AGENCY` | `board-of-directors-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>Fifteen seats score your decision against your own numbers, argue with each other, simulate three years of downside, and return a verdict that can be no.</strong></p>
<h3>The problem</h3>
<p>The prompt &#39;act as a board of directors and advise me&#39; is one of the most copied on the internet, and it fails in a specific way: fifteen enthusiastic paragraphs that agree with each other and with you. It looks like scrutiny; it functions as flattery. Three things are missing — arithmetic, disagreement, and honesty about the quality of your inputs.</p>
<p>It deals specifically with:</p>
<ul><li>AI advice that never computes LTV against CAC, capacity against breakeven, or runway against time-to-revenue</li><li>Advisors who agree with each other because they are one advisor wearing fifteen hats</li><li>Confidence scores that treat a guess and a measured figure as the same evidence</li><li>Plans that fail on the two things nobody calculates: capacity below breakeven, and runway shorter than time to first revenue</li></ul>
<h3>Who it is for</h3>
<ul><li>Anyone about to commit real money or real months to something hard to undo</li><li>Founders who have to convince a partner, a lender or an internal approver</li><li>People who have noticed that &#39;act as my board of directors&#39; produces applause</li></ul>
<h3>What you get</h3>
<ul><li>Brief and Numbers — the CLEAR intake plus ~35 inputs with twelve derived metrics updating live</li><li>Board — fifteen director reports, each scoring against its own mandate only</li><li>Debate — the collisions between seats, with the chair&#39;s ruling on each</li><li>Risk — three 36-month cash simulations and a ranked pre-mortem</li><li>Resolution — verdict, weighted vote, blocking findings and the conditions attached</li><li>Roadmap — 30/90/365-day plans with nine KPIs targeted from your own figures</li><li>Minutes — the whole deliberation as roughly 28,000 characters of Markdown</li><li>Agent pack — the same fifteen seats as a custom GPT, Claude Project, Gemini Gem or API call</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and click Example to load a real worked decision first.</li><li>Clear it, then fill in the Brief and the Numbers. Rough figures are fine — tag them GUESSED and the board discounts its own confidence.</li><li>Read the Debate tab before the Resolution. The disagreements are the thinking.</li><li>If it blocks, note which finding did it and what would change that vote.</li><li>Export the Minutes. Re-run in 90 days with measured figures and compare.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A verdict with the blocking findings named, not a score with a smile</li><li>The exact list of which of your numbers must be wrong for you to be right</li><li>A written record you can hand to whoever has to approve the decision</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone who wants it to say yes</li><li>Regulated financial, legal or tax advice — buy an hour with a professional instead</li></ul>
<h3>What it cannot do</h3>
<p>Six findings are treated as blocking and no director who raises one may also report a comfortable score. It cannot verify any number you enter, and says so.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/board-of-directors/square.png` — main image, square, works in every grid
2. `dist/mockups/board-of-directors/cover.png`
3. `dist/mockups/board-of-directors/gallery-*.png`

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
