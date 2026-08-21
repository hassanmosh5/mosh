# AI Appointment Booking System — Shopify listing

> Generated from `packaging/products/05-agents.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/appointment-booking/` — cover, square, story and gallery shots.
Package files: `dist/packages/appointment-booking/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `appointment-booking` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | ðŸ¤– AI agents & automation |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 29/70 characters

```
AI Appointment Booking System
```

**SEO title** — 63/70 characters

```
AI Appointment Booking System — A booking agent that invents a…
```

**Meta description** — 155/155 characters

```
A timezone-correct availability engine, the agent's prompt and tools generated from your own services and policies, and a simulator that books against the…
```


**Tags**

```
ai booking agent, appointment scheduling, availability engine, timezone, sms templates, salon booking, clinic automation, tool definitions, system prompt, offline
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $49 | `APPOINTMENTBOOKING-SOLO` | `appointment-booking-solo.zip` |
| Studio licence | $123 | `APPOINTMENTBOOKING-STUDIO` | `appointment-booking-studio.zip` |
| Agency licence | $245 | `APPOINTMENTBOOKING-AGENCY` | `appointment-booking-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>A timezone-correct availability engine, the agent&#39;s prompt and tools generated from your own services and policies, and a simulator that books against the real engine.</strong></p>
<h3>The problem</h3>
<p>&#39;An AI books your appointments&#39; is the easiest local automation to sell and the easiest to get badly wrong, because it fails quietly. A booking agent that invents a Tuesday looks exactly like one that checked. Nobody finds out until somebody drives to an appointment that was never in the diary — and by then the client has lost trust in the whole idea.</p>
<p>It deals specifically with:</p>
<ul><li>Agents that hallucinate availability because nothing constrains them</li><li>Timezone arithmetic done in the prompt, which is where it goes wrong</li><li>Prompts, tool definitions and customer messages drifting out of agreement</li><li>Message templates that exceed an SMS segment and cost triple</li></ul>
<h3>Who it is for</h3>
<ul><li>Clinics, salons, garages and studios automating their diary</li><li>Coaches with clients in other time zones</li><li>Agencies selling booking automation to local businesses</li></ul>
<h3>What you get</h3>
<ul><li>A timezone-correct availability engine: opening hours, breaks, buffers, lead times, holidays</li><li>The system prompt and tool definitions generated from the same configuration, so they cannot disagree</li><li>A conversation simulator that books against the real engine, not a mock</li><li>Message templates counted in SMS segments</li><li>Policies — cancellation, no-show, deposits — expressed once and reflected everywhere</li><li>The wiring guide for connecting it to a real calendar</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and configure services, hours, buffers and time zone.</li><li>Use the simulator to book across a timezone boundary and a holiday — that is where these break.</li><li>Generate the prompt and tool definitions together; never edit one alone.</li><li>Check every message template&#39;s segment count before you approve it.</li><li>Follow the wiring guide to connect a real calendar.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>An availability engine you can test before anything is built</li><li>A prompt and tool schema that match the engine exactly</li><li>Messages that fit one SMS segment and say what the policy actually is</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone wanting a running booking bot — this is the specification for one</li><li>Complex resource scheduling across many rooms and staff constraints</li></ul>
<h3>What it cannot do</h3>
<p>The engine is real and testable in the simulator. Whether the model you eventually connect obeys the tools is a property of that model, not of this file.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/appointment-booking/square.png` — main image, square, works in every grid
2. `dist/mockups/appointment-booking/cover.png`
3. `dist/mockups/appointment-booking/gallery-*.png`

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
