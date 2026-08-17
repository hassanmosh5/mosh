/**
 * The marketing copy blocks, composed once and rendered per platform.
 *
 * Every platform gets the same argument in a different shape rather than five
 * separately-written descriptions that slowly drift apart. When the catalogue
 * changes, all five listings change with it.
 */

import { formatMoney } from "./catalog.mjs";

export function bullets(items, marker = "•") {
  return items.map((item) => `${marker} ${item}`).join("\n");
}

export function numbered(items) {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

/** The opening hook: the problem, in the buyer's words, before any feature. */
export function hook(product) {
  return product.problem;
}

/** Price table across tiers in the currencies a given platform settles in. */
export function priceTable(product, currency) {
  const key = currency.toLowerCase();
  return product.tiers
    .map(
      (tier) =>
        `${tier.name} — ${formatMoney(tier.pricing[key], currency)}${tier.default ? " (most people want this one)" : ""}\n  ${tier.summary}`
    )
    .join("\n\n");
}

export function whatYouGet(product, catalog) {
  return `WHAT YOU GET

${bullets(product.inside)}

Delivered as a ZIP: the app itself, a START-HERE page, full usage instructions,
your licence, and a checksum list of every file so you can verify what arrived.

${catalog.policies.updatePolicy}`;
}

export function honesty(product, catalog) {
  return `WHAT IT IS NOT

${bullets(product.notFor)}

${product.proof}

${catalog.policies.disclaimer}`;
}

export function guarantee(catalog) {
  return `${catalog.policies.refundText}

Support: ${catalog.meta.supportEmail} — ${catalog.policies.supportPromise}`;
}

/**
 * The long description. Used whole by Gumroad and Shopify, trimmed for the
 * platforms with tighter fields.
 */
export function longDescription(product, catalog, { currency = "USD", includePrices = true } = {}) {
  const sections = [
    product.oneLiner,
    "",
    "THE PROBLEM",
    "",
    hook(product),
    "",
    "It deals specifically with:",
    "",
    bullets(product.solves),
    "",
    "WHO IT IS FOR",
    "",
    bullets(product.audience),
    "",
    whatYouGet(product, catalog),
    "",
    "HOW YOU USE IT",
    "",
    numbered(product.usage),
    "",
    "WHAT SHOULD BE TRUE WHEN YOU FINISH",
    "",
    bullets(product.outcomes),
    "",
    honesty(product, catalog),
    "",
  ];

  if (includePrices) {
    sections.push("LICENCES", "", priceTable(product, currency), "");
  }

  sections.push(guarantee(catalog));
  return sections.join("\n").replace(/\n{3,}/g, "\n\n");
}

/** Shopify and any other field that accepts HTML. */
export function descriptionHtml(product, catalog) {
  const list = (items) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  const ol = (items) => `<ol>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;

  return [
    `<p><strong>${escapeHtml(product.oneLiner)}</strong></p>`,
    `<h3>The problem</h3>`,
    `<p>${escapeHtml(product.problem)}</p>`,
    `<p>It deals specifically with:</p>`,
    list(product.solves),
    `<h3>Who it is for</h3>`,
    list(product.audience),
    `<h3>What you get</h3>`,
    list(product.inside),
    `<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. ${escapeHtml(catalog.policies.updatePolicy)}</p>`,
    `<h3>How you use it</h3>`,
    ol(product.usage),
    `<h3>What should be true when you finish</h3>`,
    list(product.outcomes),
    `<h3>Do not buy this if</h3>`,
    list(product.notFor),
    `<h3>What it cannot do</h3>`,
    `<p>${escapeHtml(product.proof)}</p>`,
    `<p><em>${escapeHtml(catalog.policies.disclaimer)}</em></p>`,
    `<h3>Guarantee</h3>`,
    `<p>${escapeHtml(catalog.policies.refundText)} Support: ${escapeHtml(catalog.meta.supportEmail)} — ${escapeHtml(catalog.policies.supportPromise)}</p>`,
  ].join("\n");
}

export function escapeHtml(text) {
  return String(text).replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]
  );
}

/** Keeps a field inside a limit by dropping whole sentences, never mid-word. */
export function trimToSentence(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastStop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
  if (lastStop > max * 0.5) return cut.slice(0, lastStop + 1).trim();
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace).trim()}…`;
}
