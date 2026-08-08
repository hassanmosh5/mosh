# The AI Income Blueprint — Interactive Edition

The whole book as a single-file, offline reader you can actually work in.
Open `index.html` in any modern browser — no install, no build step, no accounts,
no internet connection, and no data ever leaves the device.

All 5 parts · 17 chapters · 28 knowledge-check questions · about 4h 15m of reading.

## Why this app

The book already exists as a PDF, and the Next.js academy in this repo already turns it
into a course behind a login. What was missing is the thing in between: a reader you can
open on any device, annotate as you go, and keep — with no server, no account and no
network. This is that.

## What's in it

| Feature | What it does |
|---|---|
| 📚 **Full text** | Every chapter, its key takeaways, case study and action step |
| ✍️ **Highlights** | Select any passage to highlight it; click a highlight to attach a note |
| 🗒️ **Notes panel** | Every highlight and action-step answer in one list, with jump links |
| ✅ **Action steps** | Each chapter's action step becomes a checkbox plus a free-text answer |
| 🧠 **Knowledge checks** | The 28 quiz questions inline, scored, retryable |
| 📈 **Progress** | Per-chapter completion, per-part counts, a progress ring in the header |
| 🔍 **Search** | Full-text search across every chapter, with snippets |
| 🎨 **Reading settings** | Light / Sepia / Night, serif or sans, 6 text sizes, 5 line heights, 5 page widths |
| ⬇️ **Export** | Everything you highlighted, noted and scored as one Markdown file |
| 🖨️ **Print** | Chrome/Firefox print gives a clean chapter with the chrome stripped out |

## Keyboard shortcuts

| Key | Action |
|---|---|
| `←` `→` | Previous / next chapter |
| `/` | Focus search |
| `c` | Toggle contents |
| `n` | Notes &amp; highlights |
| `s` | Reading settings |
| `t` | Cycle theme |
| `Esc` | Close panel, popover or dialog |

Chapters are deep-linkable: `index.html#/ch5-art-of-the-prompt` opens straight to that
chapter, and the URL updates as you read.

## Your data

Progress, highlights, notes, quiz results and reading settings are stored in the
browser's `localStorage` under one key (`ai-income-blueprint-ebook-v1`) on the device you
read on. Nothing is uploaded, and there is no network request of any kind — the page has
no external scripts, stylesheets, fonts or images. **Reset all progress** in the settings
panel clears it; **Export** writes it out as Markdown first if you want to keep it.

Because storage is per-device and per-browser, reading on your phone and your laptop
gives you two separate sets of notes.

## How it's built

`index.html` is generated, not hand-written. The book's text lives in exactly one place —
`prisma/seed-data.ts`, which also seeds the academy's database — so the reader and the
course can never drift apart.

```
prisma/seed-data.ts  ──┐
                       ├──►  ebook/build.mjs  ──►  ebook/index.html
ebook/template.html  ──┘
```

- **`template.html`** — the app: markup, styles and logic, with a
  `/*__BOOK_DATA__*/` placeholder where the book gets inlined.
- **`build.mjs`** — strips the handful of TypeScript annotations from `seed-data.ts`,
  imports it as a module, reshapes it into the reader's format, and inlines it as JSON.
  Plain Node, no dependencies, no install step.
- **`index.html`** — the generated result, committed so it works straight from a clone.

To change the text, edit `prisma/seed-data.ts`. To change the reader, edit
`template.html`. Either way:

```bash
npm run ebook:build     # or: node ebook/build.mjs
```

The script fails loudly if `seed-data.ts` grows TypeScript syntax it doesn't know how to
strip, rather than emitting a broken page.

## Browser support

Any current Chrome, Edge, Firefox or Safari, on desktop or mobile. The layout collapses to
a single column with slide-over panels below 900px, respects
`prefers-reduced-motion`, and picks Night theme automatically when the OS is in dark mode
(until you choose a theme yourself).

## Source

Content adapted from *The AI Income Blueprint* by Hassan Mohammed —
`books/THE_AI_INCOME_BLUEPRINT.pdf`.
