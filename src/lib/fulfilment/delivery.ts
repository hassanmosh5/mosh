/**
 * Getting the download link to the buyer.
 *
 * There is no mail dependency in this repository, so this speaks Resend's REST
 * API over `fetch` when a key is configured and otherwise records the link for
 * manual sending. It never claims to have sent something it did not: the
 * webhook response and the server log both say which of the two happened, so a
 * missing key shows up as an obvious warning rather than as silence and an
 * angry customer three days later.
 */

import type { CatalogProduct } from "./catalog";
import { loadCatalog } from "./catalog";
import { downloadUrl } from "./tokens";

export type DeliveryOutcome =
  | { sent: true; via: "resend"; id: string }
  | { sent: false; via: "manual"; reason: string; link: string };

export type DeliveryInput = {
  email: string;
  token: string;
  product: CatalogProduct;
  tierName: string;
  expiresAt: Date;
  maxDownloads: number;
  platform: string;
  /** Optional public origin used to build the buyer's download URL. */
  siteUrl?: string;
};

export function deliveryEmailSubject(product: CatalogProduct): string {
  return `Your download: ${product.name}`;
}

export function deliveryEmailText(input: DeliveryInput, link: string): string {
  const { meta, policies } = loadCatalog();
  const firstSteps = input.product.usage
    .slice(0, 3)
    .map((step, index) => `${index + 1}. ${step}`)
    .join("\n");

  return `Thank you — ${input.product.name} is yours.

DOWNLOAD
${link}

Valid until ${input.expiresAt.toISOString().slice(0, 10)}, up to ${input.maxDownloads} downloads.
Save the files somewhere permanent; once downloaded they are yours whether the
link still works or not.

WHAT YOU BOUGHT
${input.product.name} — ${input.tierName}

START HERE
Unzip it and open START-HERE.md. Then:

${firstSteps}

IF ANYTHING IS WRONG
Reply to this email. ${policies.supportPromise}
${policies.refundText}

— ${meta.seller}, ${meta.brand}
`;
}

function escapeHtml(text: string): string {
  return text.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] as string
  );
}

export function deliveryEmailHtml(input: DeliveryInput, link: string): string {
  const { meta, policies } = loadCatalog();
  const steps = input.product.usage
    .slice(0, 3)
    .map((step) => `<li>${escapeHtml(step)}</li>`)
    .join("");

  return `<div style="font-family:system-ui,-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:32rem;color:#1d1b18;line-height:1.55">
  <p>Thank you — <strong>${escapeHtml(input.product.name)}</strong> is yours.</p>
  <p style="margin:24px 0">
    <a href="${escapeHtml(link)}" style="background:#b0521c;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">Download it</a>
  </p>
  <p style="color:#6d6862;font-size:14px">
    Valid until ${input.expiresAt.toISOString().slice(0, 10)}, up to ${input.maxDownloads} downloads.
    Save the files somewhere permanent — once downloaded they are yours whether the link still works or not.
  </p>
  <p><strong>What you bought:</strong> ${escapeHtml(input.product.name)} — ${escapeHtml(input.tierName)}</p>
  <p><strong>Start here:</strong> unzip it and open <code>START-HERE.md</code>. Then:</p>
  <ol>${steps}</ol>
  <p style="color:#6d6862;font-size:14px">
    Anything wrong, reply to this email. ${escapeHtml(policies.supportPromise)}<br>
    ${escapeHtml(policies.refundText)}
  </p>
  <p style="color:#6d6862;font-size:14px">— ${escapeHtml(meta.seller)}, ${escapeHtml(meta.brand)}</p>
</div>`;
}

export async function deliverDownload(input: DeliveryInput): Promise<DeliveryOutcome> {
  const { meta } = loadCatalog();
  const siteUrl = input.siteUrl ?? process.env.SITE_URL ?? meta.siteUrl;
  const link = downloadUrl(siteUrl, input.token);

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FULFILMENT_FROM_EMAIL;

  if (!apiKey || !from) {
    return {
      sent: false,
      via: "manual",
      reason: !apiKey
        ? "RESEND_API_KEY is not set — send the link by hand"
        : "FULFILMENT_FROM_EMAIL is not set — send the link by hand",
      link,
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [input.email],
      reply_to: meta.supportEmail,
      subject: deliveryEmailSubject(input.product),
      text: deliveryEmailText(input, link),
      html: deliveryEmailHtml(input, link),
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    return {
      sent: false,
      via: "manual",
      reason: `Resend returned ${response.status}: ${body.slice(0, 200)}`,
      link,
    };
  }

  const result = (await response.json().catch(() => ({}))) as { id?: string };
  return { sent: true, via: "resend", id: result.id ?? "unknown" };
}

/**
 * One line per fulfilment, in a shape that greps. When email is not configured
 * this is the only record of the link, so it deliberately includes it.
 */
export function logFulfilment(
  outcome: DeliveryOutcome,
  input: { platform: string; email: string; productSlug: string; tier: string }
): void {
  if (outcome.sent) {
    console.info(
      `[fulfilment] delivered platform=${input.platform} product=${input.productSlug} tier=${input.tier} to=${input.email} id=${outcome.id}`
    );
    return;
  }
  console.warn(
    `[fulfilment] NOT EMAILED platform=${input.platform} product=${input.productSlug} tier=${input.tier} to=${input.email} reason="${outcome.reason}" link=${outcome.link}`
  );
}
