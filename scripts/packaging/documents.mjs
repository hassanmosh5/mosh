/**
 * The documents that ship inside every customer package.
 *
 * These are what a buyer actually opens first, so they are written to be read
 * by someone who has just paid and wants to use the thing in the next five
 * minutes — not as legal boilerplate that nobody reads.
 */

import { formatMoney } from "./catalog.mjs";

const rule = "\n---\n";

function bullets(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function numbered(items) {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

/** The first file a buyer opens. Everything they need is above the fold. */
export function startHere(product, tier, catalog) {
  const entry = product.entry ?? "index.html";
  const opens =
    entry === "index.html"
      ? `Double-click **\`index.html\`**. It opens in your browser and runs immediately — there is nothing to install, no account to make, and no internet connection required.`
      : `Start with **\`${entry}\`**. It contains the setup, step by step.`;

  return `# Start here — ${product.name}

**${product.tagline}**

${opens}

## In the next five minutes

${numbered(product.usage.slice(0, 3))}

## What is in this folder

| File | What it is |
|---|---|
| \`${entry}\` | The product itself |
| \`USAGE.md\` | Full instructions, what it solves, and how to get the most out of it |
| \`README.md\` | The technical detail: how it works and what it deliberately does not do |
| \`LICENCE.txt\` | Your ${tier.name.toLowerCase()} — what you may and may not do with this |
| \`WHATS-INCLUDED.txt\` | Every file, its size, and its SHA-256 checksum |
${tier.clientWork ? "| `client/` | The brief and delivery checklist for using this in paid client work |\n" : ""}${tier.id === "agency" ? "| `white-label/` | Notes on presenting the output as your own work |\n" : ""}
## Your licence in one line

${tier.summary}

Full terms are in \`LICENCE.txt\`.

## If something is wrong

Email **${catalog.meta.supportEmail}** and say what happened. ${catalog.policies.supportPromise}

${catalog.policies.refundText}
${rule}
*${catalog.meta.brand} · ${catalog.meta.seller}*
`;
}

/** The manual: what it solves, how to run it, and where it stops. */
export function usageGuide(product, tier, catalog) {
  const entry = product.entry ?? "index.html";

  return `# ${product.name}

**${product.oneLiner}**

${rule}

## The problem this solves

${product.problem}

Specifically, it deals with:

${bullets(product.solves)}

## Who it is for

${bullets(product.audience)}

## What is inside

${bullets(product.inside)}

## How to use it

${numbered(product.usage)}

## What should be true when you finish

${bullets(product.outcomes)}

## Do not buy this if

${bullets(product.notFor)}

*(You already own it. This section is here because it is also in the listing, and a
promise you can check against what you received is worth more than one you cannot.)*

## What it cannot do

${product.proof}

${catalog.policies.disclaimer}

${rule}

## Practical notes

- **It runs offline.** ${
    entry === "index.html"
      ? "Open the file from your own disk. No server, no build step, no account."
      : "Everything is plain text you can read and edit."
  }
- **Your data stays with you.** Anything you type is stored by your own browser on your own device. There is nothing to sign into and nothing is uploaded.
- **Back it up.** Browser storage can be cleared by the browser. If the app has an export button, use it at the end of a working session.
- **Keep the file.** ${catalog.policies.updatePolicy}

## Support

**${catalog.meta.supportEmail}** — ${catalog.policies.supportPromise}

${rule}
*${catalog.meta.brand} · ${catalog.meta.seller} · ${tier.name}*
`;
}

/** Per-tier licence. Short enough that a buyer might actually read it. */
export function licence(product, tier, catalog) {
  const year = new Date().getFullYear();

  const permissions = [
    `Use ${product.name} on any device you personally control.`,
    `Use it for ${tier.seats === 1 ? "your own business and your own projects" : `the work of up to ${tier.seats} named people in your organisation`}.`,
    tier.clientWork
      ? "Use the output it generates in paid work delivered to your clients."
      : "Use the output it generates in your own business.",
    "Keep the files permanently. This licence does not expire.",
    "Modify the files for your own use.",
  ];

  if (tier.id === "agency") {
    permissions.push(
      "Present the generated deliverables to clients as your own work product, without crediting this tool."
    );
  }

  const prohibitions = [
    "Resell, sublicense, republish or redistribute the product files themselves, in whole or in part.",
    "Upload the files to a public repository, file-sharing site, marketplace or AI training corpus.",
    tier.clientWork
      ? "Give the product files to a client. You may give them the output; the tool stays with you."
      : "Use the product or its output in paid client work — that requires the Studio or Agency licence.",
    `Share access beyond ${tier.seats === 1 ? "yourself" : `the ${tier.seats} people this licence covers`}.`,
    "Remove or alter this licence file.",
  ];

  return `${product.name.toUpperCase()}
${tier.name.toUpperCase()}

Copyright (c) ${year} ${catalog.meta.seller} / ${catalog.meta.brand}.
All rights reserved.

Licensed to the purchaser named on the receipt that accompanied this download.

SEATS: ${tier.seats}
CLIENT WORK: ${tier.clientWork ? "Permitted" : "Not permitted"}


YOU MAY

${permissions.map((line, i) => `  ${i + 1}. ${line}`).join("\n")}


YOU MAY NOT

${prohibitions.map((line, i) => `  ${i + 1}. ${line}`).join("\n")}


HONEST NOTE ON ENFORCEMENT

This product is a readable file. Anyone who buys it can also read it and copy
it, and no licence text changes that. It is written down so that both sides
know what was agreed, not because it can be technically enforced. The business
this belongs to competes on updates, support and trust.


WARRANTY

Provided "as is", without warranty of any kind, express or implied. To the
maximum extent permitted by law, the copyright holder is not liable for any
claim, damage or other liability arising from the use of this product.

${catalog.policies.disclaimer}


REFUNDS

${catalog.policies.refundText}


UPGRADING

To add seats or client-work rights, buy the higher tier and email the receipt
to ${catalog.meta.supportEmail}; the difference is credited.

Questions: ${catalog.meta.supportEmail}
`;
}

/** Only ships in tiers that permit client work. */
export function clientBrief(product, catalog) {
  return `# Using ${product.name} in client work

Your licence permits it. This note is about doing it well.

## What the client is buying

Not the tool. The client is buying the **decision, document or specification**
that comes out of it, made with your judgement applied to their figures. Price
it as work, not as software access.

## Before the engagement

1. Run the tool once on the client's real figures before you quote. It takes
   under an hour and it will usually change your quote.
2. Note which inputs you had to guess. Those are the questions for the kick-off
   call, and they are also the reason your quote may need a range rather than a
   number.
3. Decide what you are handing over: the exported output, or a document you have
   written from it. The second is worth more and takes about an hour longer.

## During

- Keep the tool on your side of the table. Under the Studio licence you may not
  give the client the product files themselves — the output is theirs, the tool
  is yours.
- Where the tool returns an unwelcome answer, deliver it. That is the entire
  value of a tool that is capable of saying no, and clients remember who told
  them early.
- Record which figures came from the client. When a number is later disputed,
  the record settles it in ten seconds.

## On delivery

- Hand over the export plus a one-page summary in your own words.
- State the assumptions on the same page as the conclusions.
- Say plainly what the analysis did not cover. ${product.proof}

## What not to claim

- Do not present the computed figures as verified. ${catalog.policies.disclaimer}
- Do not promise an outcome. Describe the process and what it produces.
- Do not imply the tool has market data. It has whatever you and the client typed.

---
*${catalog.meta.brand} · questions: ${catalog.meta.supportEmail}*
`;
}

export function deliveryChecklist(product) {
  return `# Delivery checklist — ${product.name}

Tick these before you send anything to a client.

## Inputs
- [ ] Every figure came from the client or is marked as an estimate
- [ ] The estimates are listed in one place, visible to the client
- [ ] Dates, currency and units are the client's, not the defaults
- [ ] You ran it at least twice: once with their optimistic figures, once with realistic ones

## Output
- [ ] The export opens cleanly on a machine that is not yours
- [ ] No placeholder or example content survives anywhere in it
- [ ] Your own summary is attached, in your own words
- [ ] The limitations paragraph is included and is not buried

## Commercial
- [ ] Scope of what you are delivering is written down
- [ ] The client knows what is not included
- [ ] Follow-up work, if any, is quoted separately
- [ ] You kept a copy of the inputs as delivered

## The one that matters
- [ ] If the analysis says do not proceed, you have said so in the first paragraph
`;
}

export function whiteLabelNotes(product, catalog) {
  return `# White-label notes — ${product.name}

The Agency licence permits you to present the generated deliverables to clients
as your own work product, with no attribution to this tool.

## What that covers

- Exported documents, specifications, plans and analyses
- Screenshots of output inside your own reports and decks
- Your own restyling of the output in your template

## What it does not cover

- Redistributing the product files themselves. The tool stays with you, always.
- Reselling this as a product, a template, or a course asset.
- Claiming authorship of the underlying method.

## Doing it credibly

Remove the example content. Buyers of consulting work can tell when a
deliverable was generated and not read — usually because a default value
survived into the final document.

Write your own front page. The output is the analysis; the argument is yours,
and the argument is what the client is paying for.

Keep the limitations. ${product.proof} A deliverable that states its own limits
is more persuasive than one that pretends it has none, and it is the difference
between a report and a liability.

---
*${catalog.meta.brand} · agency licence · ${catalog.meta.supportEmail}*
`;
}

/** The receipt/thank-you note the platform sends after payment. */
export function receiptNote(product, tier, catalog) {
  return `Thank you — ${product.name} is yours.

START HERE
Unzip the download and open START-HERE.md, or go straight to the app:
${product.entry ?? "index.html"} opens in any browser and runs offline.

FIRST FIVE MINUTES
${product.usage
  .slice(0, 3)
  .map((step, i) => `${i + 1}. ${step}`)
  .join("\n")}

WHAT YOU BOUGHT
${tier.name} — ${tier.summary}
Price paid: ${formatMoney(tier.pricing.usd, "USD")} (${formatMoney(tier.pricing.ghs, "GHS")})

YOUR DOWNLOAD LINK
Valid for ${catalog.policies.downloadWindowDays} days and up to ${catalog.policies.maxDownloads} downloads.
Save the files somewhere permanent — once downloaded they are yours forever,
with or without the link.

IF ANYTHING IS WRONG
Reply to this email. ${catalog.policies.supportPromise}
${catalog.policies.refundText}

— ${catalog.meta.seller}, ${catalog.meta.brand}
`;
}
