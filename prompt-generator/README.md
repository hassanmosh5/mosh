# The Wealth Ideas Prompt Generator

A single-file, offline mini app that turns the **Wealth Ideas Matrix** workbook into a
working CLEAR-formula prompt generator — and then packages its output as a prompt pack
you can list for sale.

Open `index.html` in any modern browser — no install, no build step, no accounts, no
internet connection, and no data ever leaves the device.

## Why this app

The matrix workbook is 100 rows across 10 sheets: an expert role, a business context, an
audience, an income-stream offer and a niche, matched per wealth idea. On its own it is a
reference table. The CLEAR Formula in Chapter 5 of *The AI Income Blueprint*
(`books/THE_AI_INCOME_BLUEPRINT.pdf`) is the structure those columns were built for —
**C**ontext, **L**ength, **E**xample, **A**udience, **R**ole, plus the task. This app
joins the two, so the workbook stops being a table and starts producing prompts.

Chapter 10 then treats a prompt pack as its own product category. The Pack Builder is
that chapter: it emits a complete, sellable file rather than a list of prompts.

## What's in it

| Tab | Source | What it does |
|---|---|---|
| 🎯 **Generator** | Ch. 5 + the matrix | Every CLEAR field as a dropdown of real workbook values. Live labelled prompt, copy / save / download, and the 3-Pass follow-ups generated alongside it |
| 📦 **Pack Builder** | Ch. 10 | 20–100 prompts → one Markdown or `.txt` file with a cover page, how-to-use guide, stream index, numbered prompts and a licence |
| 💾 **My Library** | Ch. 5 | Prompts that worked, saved locally and exportable as one Markdown file |
| 💰 **Sell It** | Ch. 7 | Platform comparison, a five-paragraph listing-copy generator, a 12-point pre-launch checklist and the price bands |
| 📖 **The Formula** | Ch. 5, 6–12 | CLEAR and the 3-Pass Method as reference, the five mistakes, and what each of the seven income streams actually sells |

## The numbers

Ten wealth ideas, each carrying 10 expert roles, 10 business contexts, 10 audiences and
10 offers. Combined freely that is **99,000 distinct prompts**.

Not 100,000 — the Life Coaching sheet repeats one context, so it carries 9 unique
contexts rather than 10. Duplicates are dropped rather than padded, and every count shown
in the app is computed from the real arrays at runtime rather than hard-coded.

## Matched rows vs mixed combinations

The four fields in each workbook row were written to describe **one** business. Recombining
them freely multiplies the variety, but it will also pair a photographer-marketplace context
with a property-developer audience — coherent enough to read past, incoherent enough for a
buyer to notice.

So both modes exist and the distinction is explicit:

- **Matched** replays a real workbook row. Role, context, audience and offer describe a
  single coherent business. Row provenance is stored as explicit indices in the data, so
  a matched combination is always traceable back to the sheet it came from.
- **Mixed** recombines across the whole matrix.

The Pack Builder defaults to matched, because that is what you would sell. Switching it to
mixed prints a line on the pack's cover page saying so.

## The prompt structure

Every part is labelled, because the labels are what make the structure work:

```
R — ROLE            the expertise the AI adopts
C — CONTEXT         the situation + the offer this supports + the market
A — AUDIENCE        who reads the result
TASK                one task, never three
L — LENGTH & FORMAT exact size, structure, output type
E — EXAMPLE         the tone or format to match
RULES               optional: clarifying questions, no clichés, invent nothing, 3 variants
```

Default order is role-first, which reads better to a model. A toggle switches it to strict
`C · L · E · A · R` if you want the book's ordering literally.

The **Task** field is filtered by the income stream you pick, with 6–7 tasks per stream
across all seven streams, each carrying a matching Length line that auto-fills when the
task changes. Any field can be overridden with **Write my own…**.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of
  any kind. Verified with a browser run asserting zero non-`file://` requests.
- **Everything is saved** to `localStorage` as you go — your library, pack settings,
  checklist and theme. `⬇ Back up` downloads the lot as JSON; `🗑 Clear` backs up first,
  then wipes. Storage failures (private mode, `file://` restrictions) degrade to
  in-memory rather than breaking the app.
- **Light and dark**, following your system setting, with a manual toggle.
- **Accessible.** Real form controls throughout, `fieldset`/`legend` on every CLEAR field,
  arrow-key tab navigation, visible focus rings, live-region toasts, and all animation
  disabled under `prefers-reduced-motion`.
- **Printable.** The generated pack has print styles that drop the interface.
- The platform fees, price bands and income figures are the book's, and as its own
  disclaimer notes, they are ranges based on observed outcomes — not guarantees of results.

## Selling what it makes

The Pack Builder's output is the product; this app is the tool that makes it. The generated
file is plain Markdown or text, so it uploads as-is to Gumroad and Payhip, and converts to
PDF (paste into Google Docs or Canva Docs, export) for Etsy and Creative Market, which want
a PDF plus mockup images.

The book's recommended sequence is Gumroad first — zero cost, simplest listing, validate
fast — then Etsy once you have two or three positive reviews, then your own site or Stan
Store once income is consistent. The **Sell It** tab carries the full comparison, and its
checklist flags the step most people skip: lifestyle mockup images, which the book
identifies as the single biggest conversion factor.

You can also sell this generator itself — it is one self-contained HTML file, and "Own
website / anything, including this HTML file itself" is a row in that platform table for
a reason.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub
Pages. Served from this repo's root, the app lives at `/prompt-generator/`.
