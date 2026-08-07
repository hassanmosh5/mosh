# Delivery, Licensing and Platform Rules — Reference Data

The operational half of selling digital products: how the file actually reaches the
buyer, what rights you sell them, what you are allowed to build with, and what each
platform requires.

> **Verify before relying on it.** Platform terms, file limits, and disclosure rules
> change without notice. Everything below reflects the rules as documented at the time
> of writing (2026). When a specific limit or policy decides whether someone publishes,
> tell them to confirm it on the platform's own help pages, and say plainly that you
> are working from a reference file rather than the live terms.

---

## 1. How each product type is packaged and delivered

The delivery format is part of the product. A buyer who cannot open the file leaves a
one-star review that outranks the product itself.

| Type | What the buyer receives | How to deliver | The gotcha |
|---|---|---|---|
| **Notion template** | A duplicatable page | Share → publish to web → enable **Allow duplicate as template**. Put that link inside a one-page PDF and sell the PDF. | Never sell a raw link in the listing text. Selling a PDF that *contains* the link means you can change the link later without contacting past buyers. Duplicate the template into a clean, empty workspace first — buyers inherit whatever is in the page, including your notes. |
| **Canva template** | A template link that opens as their own copy | Share → **Template link** (not "view" or "edit"). Deliver in a PDF with the link plus a short usage guide. | An edit link gives buyers access to *your* design. A template link gives each buyer their own copy. Getting this wrong lets one buyer overwrite the product for everyone. |
| **Printable planner** | Print-ready PDF | Export as PDF Print, 300 DPI. Supply **both** US Letter and A4 — the two halves of the market. | Check margins against a real printer; many home printers cannot print to the edge. Avoid full-bleed backgrounds unless you also ship a margin-safe version. |
| **Spreadsheet template** | .xlsx plus a Google Sheets copy link | For Sheets, share view-only and replace `/edit` at the end of the URL with `/copy` — the link then prompts "Make a copy". | Protect or lock formula cells before publishing, and leave one filled sample row. An unlocked template comes back as "the formulas broke". |
| **Prompt pack** | PDF to read plus a plain-text or Doc file to copy from | Both, always. | Copying out of a styled PDF drags in formatting and breaks prompts. The copy-paste version is the one buyers actually use. |
| **Workbook / guide** | Fillable PDF plus a printable version | Add form fields for the fillable copy; flatten the printable one. | Fillable fields silently fail in some mobile PDF readers. Shipping both versions removes the whole support category. |
| **Digital art print** | High-res files at common ratios | 300 DPI JPG or PNG, in 2:3, 3:4, 4:5, and ISO A-series ratios, plus a short "how to print" card. | One ratio is not a product. Buyers frame at whatever size their wall takes, and a cropped print is the most common refund request in this category. |
| **Swipe file** | Doc + PDF + .txt | Same reasoning as prompt packs — one to read, one to copy from. | — |

**Always include a start-here file.** One page: what is in the download, how to open
each file, what to do first, and how to reach you. It measurably reduces support
messages and is the cheapest review-rate improvement available.

---

## 2. Pre-publish file checklist

Run before every upload. It takes five minutes and prevents most one-star reviews.

1. Filenames are descriptive and free of spaces or version numbers —
   `Freelance-Client-Tracker-A4.pdf`, not `final_v3 (2).pdf`.
2. A start-here / read-me file is included.
3. Every link inside every file has been opened in a private browser window — this is
   how you catch a link that only works while signed into your own account.
4. Fonts are embedded in exported PDFs.
5. Both paper sizes are present where printing is involved.
6. The zip opens cleanly on a phone as well as a laptop.
7. Total size is inside the platform's limit (Etsy currently allows a small number of
   files per listing with a per-file cap in the tens of megabytes; Gumroad's cap is
   far larger — confirm both before uploading).
8. No personal data anywhere — check document properties and Notion page history.
9. The licence file is included (§3).
10. You have downloaded and opened your own product exactly as a buyer would, after
    publishing.

---

## 3. What you sell the buyer — licence terms

Every digital product needs a stated licence. Without one the buyer's rights are
ambiguous, which invites both misuse and refund disputes. Include it as a page in the
product and summarise it in the listing.

**Personal use licence** — the default for planners, art, and most templates.

> This file is licensed for personal use by a single purchaser. You may use it and
> print it as many times as you like for your own use. You may not resell, share,
> redistribute, or claim authorship of the file or any part of it, and you may not
> sell or distribute derivative works based on it.

**Commercial use licence** — for templates a business uses in its own operations
(social posts, client proposals, internal trackers). Usually priced 2–3× personal.

> This file is licensed for use by a single business. You may use and adapt it in your
> own business, including in materials you produce for your clients. You may not
> resell, share, or redistribute the file itself or any editable version of it, and
> you may not sell it as a template, whether modified or unmodified.

The line that matters in both: **the buyer may use the output, never resell the
source.** State it in exactly those terms.

Do not sell "resell rights" or PLR-style licences to a product built on someone else's
assets — you can only pass on rights you actually hold.

---

## 4. What you are allowed to build with

This is where new sellers get taken down, and it is almost always avoidable.

**Design-tool stock content.** Canva and similar tools license their stock photos,
graphics, and elements for use in *your own finished designs* — not for redistribution
in something a buyer can pull apart and reuse. In practice: a template you sell should
contain only elements you created, elements you separately licensed for redistribution,
or true public-domain assets. Selling a template stuffed with the tool's own stock
elements is the single most common licence breach in this business. Canva publishes
specific guidance on selling designs and templates — check it before listing, every
time, because it has changed more than once.

**Fonts.** A font needs a licence that covers what you are doing with it. Embedding in
a PDF you sell, and shipping a font file to a buyer, are two different permissions and
the second is rarely granted. Open-licence families (SIL Open Font License, e.g. most
of Google Fonts) are the safe default — but read the individual licence, since a
handful carry extra conditions.

**Stock photography.** Standard stock licences generally forbid redistribution in an
editable or extractable form. A photo baked into a flattened printable is usually fine;
the same photo inside an editable template usually is not.

**AI-generated assets.** Check the terms of the tool that produced them: commercial
rights vary by tool and by plan, and some free tiers grant none. Keep a note of which
tool produced which asset — you may need it if a listing is challenged.

**Trademarks and lookalikes.** No brand names, characters, logos, or "compatible with
[Brand]" positioning without permission. Category descriptions are fine; names are not.

---

## 5. Platform rules that affect listings

**Etsy.** Digital items are delivered as files through Etsy, not as links to outside
sites. Etsy's creativity standards require that the seller is genuinely the designer
of what they list, and reselling mass-produced or third-party digital files is not
allowed. Where AI was used to produce the work, expect to disclose it and to be judged
on your own creative contribution — check Etsy's current seller policy before listing
AI-generated art in particular, since this area has been actively revised.

**Gumroad and Payhip.** More permissive on content and delivery, and both allow linking
to externally hosted material. Neither exempts you from the asset licensing in §4.

**Every platform.** Reselling PLR ("private label rights") bundles as your own work
breaches the creativity standards of the marketplaces that have them, and produces a
product identical to hundreds of others regardless. Not a viable strategy.

**Tax.** Marketplaces generally collect and remit VAT and sales tax on digital goods
where they are required to. Selling from your own site usually makes that your
responsibility. Keep records from the first sale, and tell people to get local advice
rather than guessing — never advise on tax specifics yourself.

---

## 6. Refunds and buyer support

**Stated policy.** Digital downloads are commonly sold as non-refundable once
downloaded, which platforms accept — but a rigid policy costs more in reviews than it
saves in refunds. The workable version:

> Because this is an instant digital download, I do not offer refunds once the files
> have been accessed. If anything does not work as described, message me — I will fix
> it or refund you.

**Refund anyway when the complaint is about the file.** A refund costs the sale price
once; a one-star review costs the listing's ranking indefinitely.

**Response template — cannot open the file:**

> Sorry about that — let's get it working. Which device and app are you opening it
> with? In the meantime here is [the alternative format], which opens on anything.

**Response template — asked for something the product does not include:**

> That is not in this product, but it is a fair thing to want. [Answer briefly if you
> can.] I have added it to the list for the next update, and you will get that update
> free as an existing buyer.

**Free updates for past buyers** are worth stating in the listing. It converts, and it
costs nothing on a file you were going to improve anyway.

---

## 7. Diagnosing a product that is not selling

Never treat "it isn't selling" as one problem. It is three, and the fix differs
completely. Get the numbers from platform analytics — Etsy reports impressions, visits,
and orders per listing; Gumroad reports views and sales.

| Symptom | The problem | What to fix |
|---|---|---|
| Very few impressions | **Discovery.** The listing does not appear in search at all. | Title and tags. Rewrite around terms buyers actually type, using every tag slot. Check the product genuinely matches a search someone performs — some products are things nobody looks for. |
| Impressions, almost no clicks | **The thumbnail.** People see it and scroll past. | The first image only. Replace the flat screenshot with a lifestyle mockup, make the text legible at thumbnail size, and compare it directly against the top three results for your keyword. |
| Clicks, no sales | **The listing page or the offer.** They arrived and were not convinced. | Description structure, what is included, missing images, price positioning, no reviews yet. Also consider that the product may be solving a problem people do not pay to solve. |
| Sales, then refunds or poor reviews | **Delivery or expectations.** | §1 and §2. Usually the file, not the product. |

**Realistic benchmarks.** Click-through and conversion rates on marketplaces are
typically low single-digit percentages, and vary enormously by category — treat any
number as directional only. What matters is the *relative* comparison: a listing far
below your own other listings on one step of the funnel has a problem localised to
that step.

**The 30-day rule.** A new listing needs roughly a month before its numbers mean
anything — marketplace search takes time to place it. Diagnose after 30 days and about
100 impressions, not after a quiet first week.

**When the honest answer is to stop.** A listing with real impressions, a competitive
thumbnail, a rewritten description, and still no sales after 60 days has been tested.
Say so. The catalogue strategy works because effort moves to the next product, not
because every product is rescued.
