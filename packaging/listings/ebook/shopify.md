# The AI Income Blueprint — Interactive Edition — Shopify listing

> Generated from `packaging/products/01-decide.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/ebook/` — cover, square, story and gallery shots.
Package files: `dist/packages/ebook/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `ebook` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | 🧭 Start & decide |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 45/70 characters

```
The AI Income Blueprint — Interactive Edition
```

**SEO title** — 67/70 characters

```
The AI Income Blueprint — Interactive Edition — The whole book, as…
```

**Meta description** — 138/155 characters

```
All 17 chapters with highlighting, notes, inline quizzes, action-step tracking, full-text search and Markdown export. Offline, no account.
```


**Tags**

```
ai income blueprint, interactive ebook, book with quizzes, highlights and notes, offline reader, self study, action steps, markdown export, business book, no account
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $19 | `EBOOK-SOLO` | `ebook-solo.zip` |
| Studio licence | $48 | `EBOOK-STUDIO` | `ebook-studio.zip` |
| Agency licence | $95 | `EBOOK-AGENCY` | `ebook-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>All 17 chapters with highlighting, notes, inline quizzes, action-step tracking, full-text search and Markdown export. Offline, no account.</strong></p>
<h3>The problem</h3>
<p>A book you read once changes nothing. The action steps are the point, and they live at the end of chapters you have already closed — so the highlights end up in one app, the notes in another, and the seventeen action steps nowhere at all. This is the book rebuilt as the thing you actually work in.</p>
<p>It deals specifically with:</p>
<ul><li>Highlights and notes scattered across three apps and a notebook</li><li>Action steps read and never done</li><li>No way to check whether a chapter actually landed</li><li>Reading apps that need an account, a network and 40MB of fonts</li></ul>
<h3>Who it is for</h3>
<ul><li>Readers who annotate and then lose the annotations</li><li>Anyone working through the book on a phone with metered data</li><li>People who want the book and the exercises in the same place</li></ul>
<h3>What you get</h3>
<ul><li>Every chapter in full, with its key takeaways, case study and action step</li><li>Highlight any passage and attach a note; every note in one panel with jump links</li><li>Action steps as checkboxes with a free-text answer each</li><li>The 28 knowledge-check questions inline, scored and retryable</li><li>Per-chapter and per-part progress, with a ring in the header</li><li>Full-text search with snippets, three themes, adjustable typography</li><li>Export everything you wrote as one Markdown file</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html. It works on a phone, on a plane, at 2% battery.</li><li>Read normally. Select any sentence to highlight it; click the highlight to add a note.</li><li>Answer each chapter&#39;s action step in the box rather than in your head.</li><li>Take the knowledge check before moving on. Retry it until it is boring.</li><li>Export to Markdown whenever you want your notes somewhere else.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>Seventeen action steps with your answers, in a file you keep</li><li>A quiz score per chapter, so &#39;I read it&#39; becomes checkable</li><li>Your entire annotation set exportable in one click</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone who only wants the PDF to skim — the paperback experience is not the point</li><li>Readers who need audio; there is no narration</li></ul>
<h3>What it cannot do</h3>
<p>Everything is stored in your own browser. Nothing is uploaded, and there is no account to make.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/ebook/square.png` — main image, square, works in every grid
2. `dist/mockups/ebook/cover.png`
3. `dist/mockups/ebook/gallery-*.png`

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
