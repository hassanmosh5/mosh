# The AI Income Blueprint — Interactive Edition — Gumroad listing

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
| Type | Digital product |
| URL / permalink | `ebook` → https://moshdigitalstudios.gumroad.com/l/ebook |
| Category | Start & decide |
| Call to action | I want this! |

**Name** — 45/60 characters

```
The AI Income Blueprint — Interactive Edition
```

**Summary (shows under the title)** — 138/255 characters

```
All 17 chapters with highlighting, notes, inline quizzes, action-step tracking, full-text search and Markdown export. Offline, no account.
```

**Tags** — 10/12

```
ai income blueprint, interactive ebook, book with quizzes, highlights and notes, offline reader, self study, action steps, markdown export, business book, no account
```

## Versions — one product, three prices

Use Gumroad **Versions**, not three separate products. Three products split your
reviews and your ranking three ways.

| Version | Price | Attach this file |
|---|---|---|
| Solo licence | $19 | `ebook-solo.zip` |
| Studio licence ← set as default | $48 | `ebook-studio.zip` |
| Agency licence | $95 | `ebook-agency.zip` |

Gumroad attaches different files to different versions. Use that rather than
maintaining three products by hand.

**Purchasing power parity:** turn it on. This is built for buyers on metered
data; pricing in US dollars without PPP prices most of them out of it.

## Description — paste into the description field

**Description** — 2858/12000 characters

```
All 17 chapters with highlighting, notes, inline quizzes, action-step tracking, full-text search and Markdown export. Offline, no account.

THE PROBLEM

A book you read once changes nothing. The action steps are the point, and they live at the end of chapters you have already closed — so the highlights end up in one app, the notes in another, and the seventeen action steps nowhere at all. This is the book rebuilt as the thing you actually work in.

It deals specifically with:

• Highlights and notes scattered across three apps and a notebook
• Action steps read and never done
• No way to check whether a chapter actually landed
• Reading apps that need an account, a network and 40MB of fonts

WHO IT IS FOR

• Readers who annotate and then lose the annotations
• Anyone working through the book on a phone with metered data
• People who want the book and the exercises in the same place

WHAT YOU GET

• Every chapter in full, with its key takeaways, case study and action step
• Highlight any passage and attach a note; every note in one panel with jump links
• Action steps as checkboxes with a free-text answer each
• The 28 knowledge-check questions inline, scored and retryable
• Per-chapter and per-part progress, with a ring in the header
• Full-text search with snippets, three themes, adjustable typography
• Export everything you wrote as one Markdown file

Delivered as a ZIP: the app itself, a START-HERE page, full usage instructions,
your licence, and a checksum list of every file so you can verify what arrived.

Free updates to the version you bought for 12 months. You keep the files forever either way.

HOW YOU USE IT

1. Open index.html. It works on a phone, on a plane, at 2% battery.
2. Read normally. Select any sentence to highlight it; click the highlight to add a note.
3. Answer each chapter's action step in the box rather than in your head.
4. Take the knowledge check before moving on. Retry it until it is boring.
5. Export to Markdown whenever you want your notes somewhere else.

WHAT SHOULD BE TRUE WHEN YOU FINISH

• Seventeen action steps with your answers, in a file you keep
• A quiz score per chapter, so 'I read it' becomes checkable
• Your entire annotation set exportable in one click

WHAT IT IS NOT

• Anyone who only wants the PDF to skim — the paperback experience is not the point
• Readers who need audio; there is no narration

Everything is stored in your own browser. Nothing is uploaded, and there is no account to make.

These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.

14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
```


## Cover and thumbnail

Gumroad wants a 1280×720 cover and a 600×600 thumbnail.

- Cover: `dist/mockups/ebook/cover.png` (already 1280×720)
- Thumbnail: `dist/mockups/ebook/square.png` — crop to 600×600
- Extra gallery images: `dist/mockups/ebook/gallery-*.png`

These are screenshots of the product running, not stock photography. That is
deliberate — the cover shows what arrives.

## Receipt / thank-you note

Paste into **Content → Receipt note**:

```
1. Open index.html. It works on a phone, on a plane, at 2% battery.
2. Read normally. Select any sentence to highlight it; click the highlight to add a note.
3. Answer each chapter's action step in the box rather than in your head.
```

The full receipt text is in `dist/packages/ebook/receipt-<tier>.txt`.

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
