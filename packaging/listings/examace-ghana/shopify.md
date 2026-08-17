# ExamAce Ghana — EdTech Site Template — Shopify listing

> Generated from `packaging/products/06-life.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/examace-ghana/` — cover, square, story and gallery shots.
Package files: `dist/packages/examace-ghana/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `examace-ghana` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | 🏦 Money, property & life |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 36/70 characters

```
ExamAce Ghana — EdTech Site Template
```

**SEO title** — 68/70 characters

```
ExamAce Ghana — EdTech Site Template — Built for a phone on metered…
```

**Meta description** — 150/155 characters

```
A five-page marketing site and student-dashboard prototype for an exam-prep subscription — no images, no web fonts, no framework, nothing to block on.
```


**Tags**

```
edtech template, exam prep site, bece wassce, low bandwidth website, africa web design, static site, html css template, student dashboard, tutoring business, mobile first
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $39 | `EXAMACEGHANA-SOLO` | `examace-ghana-solo.zip` |
| Studio licence | $98 | `EXAMACEGHANA-STUDIO` | `examace-ghana-studio.zip` |
| Agency licence | $195 | `EXAMACEGHANA-AGENCY` | `examace-ghana-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>A five-page marketing site and student-dashboard prototype for an exam-prep subscription — no images, no web fonts, no framework, nothing to block on.</strong></p>
<h3>The problem</h3>
<p>Sites built for African mobile users are usually sites built for a laptop on fibre, shipped anyway. A typical web font pair is 60–120KB and blocks text from painting; a hero image is a megabyte; a framework is another 200KB before anything appears. On a metered 3G connection that is not slow, it is a bounce.</p>
<p>It deals specifically with:</p>
<ul><li>Marketing sites that take ten seconds to paint on a mid-range Android</li><li>Data costs that fall on the student, not the business</li><li>No credible prototype to show investors or partners</li><li>Design systems that need a build step and a package manager to change a colour</li></ul>
<h3>Who it is for</h3>
<ul><li>Anyone launching a tutoring or exam-prep business in West Africa</li><li>Developers who need a low-bandwidth site pattern to copy</li><li>Founders pitching an edtech idea and needing something real to show</li></ul>
<h3>What you get</h3>
<ul><li>A single-scroll homepage, three subject pages and a student dashboard prototype</li><li>Zero images — every icon is an inline SVG symbol, the hero is a CSS phone mock, the favicon is a data URI</li><li>No web fonts, no CDN, no framework, no analytics: nothing to resolve, nothing to block on</li><li>A complete design system in 42KB of CSS (8.8KB gzipped)</li><li>5.5KB of JavaScript for nav, pricing tabs, reveal animations and a demo sign-in</li><li>Pricing tabs and WhatsApp contact links wired in</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html. There is no build step and no package to install.</li><li>Replace the brand, subjects and pricing with yours — everything is plain HTML.</li><li>Edit assets/examace.css for colours and type; it is one readable file.</li><li>Point the WhatsApp links at your own number.</li><li>Host it anywhere that serves static files.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A site that paints immediately on a cheap phone and a slow connection</li><li>A working prototype to show before anything is built</li><li>A design system you can edit with a text editor</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone needing a working LMS — the dashboard is a prototype, not a backend</li><li>Teams wanting a React or Next.js codebase</li></ul>
<h3>What it cannot do</h3>
<p>The dashboard is a front-end prototype with a demo sign-in. There is no server, no database and no real authentication behind it.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/examace-ghana/square.png` — main image, square, works in every grid
2. `dist/mockups/examace-ghana/cover.png`
3. `dist/mockups/examace-ghana/gallery-*.png`

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
| URL | `https://REPLACE-ME.example.com/api/webhooks/shopify` |

Copy the signing secret Shopify shows you into `SHOPIFY_WEBHOOK_SECRET`. The
route verifies the HMAC on the raw body, matches each line item's SKU to a
package, and emails a signed download link that expires in
30 days after 8 downloads.

Map each variant SKU in `packaging/sku-map.json` so the webhook knows which
ZIP a line item refers to.

---
14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
