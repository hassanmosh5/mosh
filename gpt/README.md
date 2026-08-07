# Digital Product Studio — a custom GPT

A ChatGPT custom GPT that takes someone from "I don't know what to sell" to a
validated, built, priced, and published digital product — and diagnoses it when the
product is live and not selling.

It is built on Chapter 7 of **THE AI INCOME BLUEPRINT** — the 3 Criteria, the
30-Minute Validation Method, the 8-step creation workflow, the pricing and platform
tables, the SEO fundamentals, and the upsell ladder — so its advice matches the book
rather than generic AI business filler.

---

## What's in here

| File | What it is |
|---|---|
| `instructions.txt` | The GPT's system instructions. Paste into the Instructions field. 7,875 of the 8,000 character limit. |
| `configuration.md` | Every other field — name, description, conversation starters, capabilities, publishing settings. Copy/paste ready. |
| `knowledge/digital-product-playbook.md` | Strategy reference — pricing tables, platform comparison, validation methods, income projections. Upload as a knowledge file. |
| `knowledge/delivery-licensing-and-policy.md` | Operational reference — how each product type is packaged and delivered, pre-publish file checklist, licence wording, what assets are safe to build with, marketplace rules, refunds, and the not-selling diagnostic. Upload as a knowledge file. |

---

## Setting it up (about 10 minutes)

1. Go to [chatgpt.com/gpts/editor](https://chatgpt.com/gpts/editor) — or Explore GPTs
   → **Create**. Requires ChatGPT Plus, Pro, Team, or Enterprise.
2. Click the **Configure** tab. Ignore the Create chat tab — you already have the
   config written.
3. Fill in **Name** and **Description** from `configuration.md`.
4. Paste the whole of `instructions.txt` into **Instructions**.
5. Add the four **Conversation starters** from `configuration.md`.
6. Under **Knowledge**, upload **both** files from `knowledge/`. The GPT references them
   by name in four places and degrades badly without them. Optionally upload the book
   PDF too — read the note in `configuration.md` first if you sell it.
7. Under **Capabilities**, enable Web Browsing, DALL·E, and Canvas. Decide on Code
   Interpreter using the table in `configuration.md`.
8. For the profile picture, click the image box → **Use DALL·E** and describe
   something in your brand palette, or upload your own.
9. **Create** → choose who can access it → **Save**.

---

## Testing it before you publish

Run these and check the behaviour in the right-hand column. If any fails, the fix is
almost always in `instructions.txt`.

| Test message | What should happen |
|---|---|
| "I want to make a productivity planner" | Pushes back on the vagueness, asks for a specific buyer, refuses to accept "busy people" as an audience. |
| "Just write me a Notion template for freelancers, skip the validation" | Asks the validation question once, and if you decline, names the risk in one sentence and then helps fully without nagging. |
| "How much can I make in my first month?" | Says $0–$100. Does not inflate it, does not promise anything, explains the first 90 days build the catalogue. |
| "What's the best price for a Canva template pack?" | Quotes $12–$27 for a 5–10 template pack from the playbook, and proposes a three-tier structure. |
| "My Etsy listing has had 40 impressions and no sales in 5 days" | Names Mode 7, tells you 5 days and 40 impressions is too early to diagnose, and does **not** invent a fix. |
| "300 impressions, 4 visits, no sales" | Diagnoses the thumbnail specifically — impressions without clicks — and does not send you to rewrite the description. |
| "I'm selling a Canva template with stock photos in it" | Raises the licensing problem before anything else: stock elements are licensed for finished designs, not for redistribution inside an editable template. |
| "How do I deliver a Notion template to buyers?" | Duplicate-as-template link, delivered inside a PDF so the link can change later — not a raw link in the listing. |

If it invents sales figures or review counts during validation, or cannot answer the
delivery and licensing tests, a knowledge file probably didn't upload — check the
Knowledge section.

---

## Tuning it later

- **Too long-winded?** Add a line under `# HOW YOU WRITE`: "Default to under 200
  words unless producing a deliverable."
- **Not pushy enough on validation?** Strengthen `# THE ONE RULE` — the current
  version deliberately asks only once so it doesn't become annoying.
- **Want it to sell the book?** Add a line to the instructions telling it to
  reference specific chapters by number when a topic goes beyond digital products.
- **Adding to the instructions?** They sit at 7,875 of the 8,000 character cap, so
  there is room for about two more sentences. Put new reference material in a knowledge
  file instead — no practical size limit, and the GPT retrieves from it just as
  reliably. Count with
  `python3 -c "print(len(open('gpt/instructions.txt', encoding='utf-8').read()))"`,
  not `wc -m`, which counts bytes and overstates it by about a hundred.

---

## A note on the numbers

Every price range, platform fee, and income projection comes from the book and
reflects market rates at the time it was written. Platform fees in particular change
— re-check Etsy, Gumroad, and Payhip's current terms before republishing the GPT, and
update `knowledge/digital-product-playbook.md` when they do.

The income projections are ranges from observed practitioner outcomes, not
guarantees, and the instructions require the GPT to present them that way.

The same applies harder to `knowledge/delivery-licensing-and-policy.md`. Asset licensing
terms, marketplace creativity standards, AI-disclosure rules, and per-listing file limits
all change, and getting them wrong costs a seller their shop rather than a sale. That
file states its own currency at the top and instructs the GPT to send users to the
platform's live terms for anything decisive — keep both true when you revise it.
