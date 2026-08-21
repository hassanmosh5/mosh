# AI Income Launch Kit — Shopify listing

> Generated from `packaging/products/01-decide.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/launch-kit/` — cover, square, story and gallery shots.
Package files: `dist/packages/launch-kit/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `launch-kit` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | ðŸ§­ Start & decide |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 20/70 characters

```
AI Income Launch Kit
```

**SEO title** — 68/70 characters

```
AI Income Launch Kit — Pick one income stream and survive the first…
```

**Meta description** — 135/155 characters

```
Score yourself across seven AI income streams, validate the winner in seven days, then run a thirty-day launch plan that tracks itself.
```


**Tags**

```
ai side income, income stream picker, 30 day launch plan, business validation, clear prompt formula, freelance start, digital product launch, side hustle planner, offline app, no subscription
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $29 | `LAUNCHKIT-SOLO` | `launch-kit-solo.zip` |
| Studio licence | $73 | `LAUNCHKIT-STUDIO` | `launch-kit-studio.zip` |
| Agency licence | $145 | `LAUNCHKIT-AGENCY` | `launch-kit-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>Score yourself across seven AI income streams, validate the winner in seven days, then run a thirty-day launch plan that tracks itself.</strong></p>
<h3>The problem</h3>
<p>The reason most AI side incomes never start is not laziness and not the market — it is that the first decision never gets made. Seven plausible streams, no way to compare them against your own hours, skills and cash, so you research a fourth one instead. Then the thirty days that were supposed to be a launch become thirty days of tab-opening.</p>
<p>It deals specifically with:</p>
<ul><li>Choosing between income streams with nothing to compare them on except enthusiasm</li><li>Committing thirty days to an idea nobody has told you they want</li><li>A launch plan that lives in your head and quietly loses two days a week</li><li>Writing prompts that produce generic output because they never carried your context</li></ul>
<h3>Who it is for</h3>
<ul><li>Anyone who has read three books about starting an AI side income and started none of them</li><li>Freelancers deciding which service to lead with</li><li>People with more ideas than evenings</li></ul>
<h3>What you get</h3>
<ul><li>Fit Matrix — score yourself on five dimensions and get all seven income streams ranked, with a primary, a secondary, and the profile you match</li><li>7-Day Validation Sprint — one action a day, each with the question it answers and the output it must produce, ending in Proceed / Refine / Pivot</li><li>Commitment Statement — the fill-in template, rendered as a signed document you can print and put where you will see it</li><li>30-Day Launch Plan — all thirty days with real tasks, time estimates and weekly milestone checks, adapted for service, product or content tracks</li><li>CLEAR prompt builder — Context, Length, Examples, Audience, Role, assembled into a prompt you can paste anywhere</li><li>Pricing cheat sheet — the bands for each stream, so your first quote is not a guess</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html. Nothing to install, no account, works with the wifi off.</li><li>Do the Fit Matrix first — five sliders, about six minutes. Read the ranking before you argue with it.</li><li>Run the 7-Day Sprint on your top stream. One action per day; write the output in the box, not in your head.</li><li>If the sprint says Proceed, write the Commitment Statement and print it.</li><li>Work the 30-Day Plan day by day. Everything is saved in the browser, so close the tab whenever you like.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>One income stream chosen, in writing, with the reason it beat the other six</li><li>A seven-day test that costs nothing and can honestly return &#39;pivot&#39;</li><li>Thirty dated tasks you can open tomorrow morning instead of deciding again</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone looking for a done-for-you business or a list of passive income tricks</li><li>People who want the tool to promise an income figure — it refuses to</li></ul>
<h3>What it cannot do</h3>
<p>The scores come from your own answers against fixed rules you can read in the file. It cannot check whether your answers are true.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/launch-kit/square.png` — main image, square, works in every grid
2. `dist/mockups/launch-kit/cover.png`
3. `dist/mockups/launch-kit/gallery-*.png`

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
