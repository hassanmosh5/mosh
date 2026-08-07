# GPT Configuration — copy/paste values

Everything below goes into the **Configure** tab of the ChatGPT GPT Builder
(chatgpt.com → Explore GPTs → Create). Character limits noted where they apply.

---

## Name

*(50 character limit)*

```
Digital Product Studio
```

Alternatives if that name is taken:
- `The Digital Product Studio`
- `Digital Product Studio — AI Income`
- `Sell It Once — Digital Product Studio`

---

## Description

*(300 character limit — shown on the GPT's card)*

```
Turn what you already know into a digital product that actually sells. I validate your idea before you waste 15 hours building it, then write the product, price it, and hand you a listing ready to publish. Built on the Chapter 7 frameworks of THE AI INCOME BLUEPRINT.
```

---

## Instructions

Paste the full contents of [`instructions.txt`](./instructions.txt).

Currently ~7.5k characters against ChatGPT's 8,000 character limit, leaving room
for your own edits. If you add to it, trim elsewhere or move the detail into the
knowledge file instead.

---

## Conversation starters

*(4 maximum — these are the first thing a new user sees, so they double as a
statement of what the GPT does)*

```
Help me find a digital product I could actually sell
```
```
Validate my product idea before I build it
```
```
Write the listing and SEO for a product I've made
```
```
Plan my first 20-product catalogue
```

---

## Knowledge

Upload both files:

1. **`knowledge/digital-product-playbook.md`** — required. The pricing tables,
   platform comparison, validation methods, and income projections the instructions
   refer to. Without it the GPT will invent numbers.
2. **`THE_AI_INCOME_BLUEPRINT.pdf`** — optional but recommended. Gives the GPT the
   full book, so it can pull from the other income streams, the CLEAR chapter, and
   the 30-day launch plan when a conversation goes beyond digital products.

> **Note on uploading the book:** knowledge files can be surfaced to users if the
> GPT is public and Code Interpreter is enabled — a user can sometimes get the GPT
> to hand over the raw file. If you're selling the book, either publish the GPT
> with Code Interpreter **off**, keep the GPT private/link-only, or upload only the
> playbook file rather than the full PDF.

---

## Capabilities

| Capability | Setting | Why |
|---|---|---|
| **Web Browsing** | **On** | Mode 2 validation needs live Etsy, Gumroad, and Google Trends checks. Without it the GPT can only hand the user a checklist to run themselves. |
| **DALL·E Image Generation** | **On** | Step 6 of the build workflow is mockup images — the step that doubles listing conversion. |
| **Canvas** | **On** | Product content and listing copy are long-form documents the user edits alongside the GPT. |
| **Code Interpreter** | **Your call** | On: can generate real .xlsx/.csv spreadsheet templates and PDF planners as downloadable files, which is genuinely useful for two of the eight product types. Off: protects your uploaded knowledge files from extraction. If you upload the full book, turn this off. |

---

## Actions

None required. The GPT works entirely through conversation plus browsing.

Optional later additions, if you want to build them out:
- A Gumroad API action to create and update product listings directly.
- An Etsy API action to pull live search and listing data for validation.

---

## Additional Settings

- **Use conversation data to improve our models** — off, unless you want it on.

---

## Publishing

- **Only me** — while testing.
- **Anyone with a link** — for buyers of the book. This is the recommended setting
  if the GPT is a bonus for your readers.
- **Everyone (GPT Store)** — for lead generation. If you publish publicly, you need
  a verified builder profile, and you should review the knowledge-file note above
  before uploading the book.
