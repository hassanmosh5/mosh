# Email Marketing Automation — Shopify listing

> Generated from `packaging/products/04-growth.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/email-marketing/` — cover, square, story and gallery shots.
Package files: `dist/packages/email-marketing/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `email-marketing` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | ðŸ“ˆ Marketing & growth |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 26/70 characters

```
Email Marketing Automation
```

**SEO title** — 68/70 characters

```
Email Marketing Automation — What to send, and what a subscriber is…
```

**Meta description** — 137/155 characters

```
A calendar, a launch sequence, subscriber value arithmetic, and the model of what mailing everyone does to the people who still read you.
```


**Tags**

```
email marketing, newsletter strategy, launch sequence, lead magnet, subscriber value, email calendar, list building, segmentation, open rate, offline tool
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $39 | `EMAILMARKETING-SOLO` | `email-marketing-solo.zip` |
| Studio licence | $98 | `EMAILMARKETING-STUDIO` | `email-marketing-studio.zip` |
| Agency licence | $195 | `EMAILMARKETING-AGENCY` | `email-marketing-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>A calendar, a launch sequence, subscriber value arithmetic, and the model of what mailing everyone does to the people who still read you.</strong></p>
<h3>The problem</h3>
<p>&#39;Build a list&#39; is advice that stops exactly where the work starts. Nothing in it says what to put in the emails, how often to send, what a subscriber is actually worth, or what mailing everyone every week does to the people who still open — which is the mechanism by which lists quietly die while the subscriber count goes up.</p>
<p>It deals specifically with:</p>
<ul><li>A list that never gets emailed because there is no plan for what to say</li><li>Sending to everyone every time and burning the engaged segment</li><li>No idea what a subscriber is worth, so no idea what acquiring one may cost</li><li>Launch sequences improvised the week of the launch</li></ul>
<h3>Who it is for</h3>
<ul><li>Anyone told to &#39;build a list&#39; and left there</li><li>Sellers with a list they are afraid to email</li><li>Creators whose open rate is falling and cannot see why</li></ul>
<h3>What you get</h3>
<ul><li>A send calendar with the cadence your list size and content supply can sustain</li><li>The launch sequence: seven emails over ten days, each with its job</li><li>A lead-magnet design that recruits buyers rather than freebie collectors</li><li>Subscriber value arithmetic — what one is worth, so acquisition has a ceiling</li><li>Segment fatigue modelling: what full-list sending does to your openers</li><li>Drafting prompts built from each email&#39;s own brief</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and set list size, open rate and what a customer is worth.</li><li>Read the subscriber value figure before you plan any acquisition spend.</li><li>Build the calendar around what you can genuinely produce.</li><li>Write the launch sequence in advance and store it.</li><li>Check the fatigue model before any full-list send.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A publishing cadence you can hold for a quarter</li><li>A launch sequence written before launch week</li><li>A number for what a subscriber is worth, and therefore what one may cost</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Sending the emails — no ESP is connected; you paste into yours</li><li>Cold outreach or purchased lists</li></ul>
<h3>What it cannot do</h3>
<p>Every figure comes from your inputs. Deliverability depends on your sending platform and your history, neither of which this can see.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/email-marketing/square.png` — main image, square, works in every grid
2. `dist/mockups/email-marketing/cover.png`
3. `dist/mockups/email-marketing/gallery-*.png`

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
