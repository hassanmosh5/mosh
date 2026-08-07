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
Turn what you already know into a digital product that actually sells. I validate the idea before you waste 15 hours building it, then write it, price it, and hand you a listing ready to publish. If it's live and not selling, I find the step that's broken. From THE AI INCOME BLUEPRINT.
```

286 characters. The previous version stopped at "ready to publish" — the closing line is
there because people search for help with a product that already exists more often than
for help starting one.

---

## Instructions

Paste the full contents of [`instructions.txt`](./instructions.txt).

Currently **7,875 characters against ChatGPT's 8,000 limit — 125 to spare.** It is close
to the cap because it covers seven modes. Anything you add has to come out somewhere
else, and the right home for new material is a knowledge file: those have no practical
size limit and the GPT retrieves from them just as reliably.

To check after editing:

```bash
python3 -c "print(len(open('gpt/instructions.txt', encoding='utf-8').read()))"
```

`wc -m` will report a higher number — it counts the em dashes and arrows as multiple
bytes each, and ChatGPT counts characters.

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
My product isn't selling — help me work out why
```

Swap in either of these if your audience skews differently — the fourth slot is the one
worth testing:

```
Plan my first 20-product catalogue
```
```
Check I'm allowed to sell what I've made
```

---

## Knowledge

Upload these:

1. **`knowledge/digital-product-playbook.md`** — required. The pricing tables,
   platform comparison, validation methods, and income projections the instructions
   refer to. Without it the GPT will invent numbers.
2. **`knowledge/delivery-licensing-and-policy.md`** — required. Delivery format per
   product type, the pre-publish file checklist, licence wording, what assets are
   safe to build with, marketplace rules, refund handling, and the funnel diagnostic
   Mode 7 runs on. Modes 3 and 7 and the licensing section all reference it directly.
3. **`THE_AI_INCOME_BLUEPRINT.pdf`** — optional but recommended. Gives the GPT the
   full book, so it can pull from the other income streams, the CLEAR chapter, and
   the 30-day launch plan when a conversation goes beyond digital products.

> **Note on uploading the book:** knowledge files can be surfaced to users if the
> GPT is public and Code Interpreter is enabled — a user can sometimes get the GPT
> to hand over the raw file. If you're selling the book, either publish the GPT
> with Code Interpreter **off**, keep the GPT private/link-only, or upload only the two
> markdown files rather than the full PDF.

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
