/**
 * Webhook authentication, one function per platform.
 *
 * Each of the four platforms authenticates differently and one of them does not
 * authenticate at all, so the differences are written out here rather than
 * hidden behind a single "verify" helper that would have to pretend they are
 * the same. Every function fails closed: no secret configured means no.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

export type VerificationResult = { ok: true } | { ok: false; reason: string };

const OK: VerificationResult = { ok: true };
const fail = (reason: string): VerificationResult => ({ ok: false, reason });

function compare(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/**
 * Paystack signs the raw body with HMAC-SHA512 using your **secret key** and
 * sends it as `x-paystack-signature`.
 */
export function verifyPaystack(
  rawBody: string,
  signature: string | null,
  secretKey: string | undefined
): VerificationResult {
  if (!secretKey) return fail("PAYSTACK_SECRET_KEY is not set");
  if (!signature) return fail("missing x-paystack-signature header");

  const expected = createHmac("sha512", secretKey).update(rawBody).digest("hex");
  return compare(expected, signature) ? OK : fail("signature mismatch");
}

/**
 * Shopify signs the raw body with HMAC-SHA256 using the webhook signing secret
 * and base64-encodes it into `x-shopify-hmac-sha256`.
 */
export function verifyShopify(
  rawBody: string,
  signature: string | null,
  secret: string | undefined
): VerificationResult {
  if (!secret) return fail("SHOPIFY_WEBHOOK_SECRET is not set");
  if (!signature) return fail("missing x-shopify-hmac-sha256 header");

  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  return compare(expected, signature) ? OK : fail("signature mismatch");
}

/**
 * Gumroad Ping is not signed and needs no signing secret — Gumroad's own
 * documentation says so. That leaves two checks worth making, and this route
 * requires both: a secret in the URL that only Gumroad has been given, and the
 * seller id in the payload matching the account we sell from.
 *
 * Treat this as weaker than the other three. It is why the Gumroad route never
 * issues a download link — Gumroad delivers its own files, so a forged ping can
 * at worst write a sale row, not give away a product.
 */
export function verifyGumroad(
  urlSecret: string | null,
  sellerId: string | undefined,
  config: { pingSecret: string | undefined; sellerId: string | undefined }
): VerificationResult {
  if (!config.pingSecret) return fail("GUMROAD_PING_SECRET is not set");
  if (!urlSecret) return fail("missing ?secret= in the ping URL");
  if (!compare(config.pingSecret, urlSecret)) return fail("URL secret mismatch");

  if (config.sellerId) {
    if (!sellerId) return fail("payload has no seller_id to check");
    if (!compare(config.sellerId, sellerId)) return fail("seller_id mismatch");
  }

  return OK;
}

/**
 * Selar's signature scheme is not documented publicly at the time of writing,
 * so this verifies a configurable HMAC rather than asserting a format that may
 * be wrong: set `SELAR_WEBHOOK_SECRET`, and override `SELAR_SIGNATURE_HEADER`
 * and `SELAR_SIGNATURE_ENCODING` if Selar's differ from the defaults.
 *
 * Confirm the real scheme with Selar before relying on this. Until the secret
 * is set the route rejects everything, which is the correct behaviour for a
 * scheme nobody has verified — and Selar delivers its own files anyway, so
 * nothing is withheld from a buyer while it stays unconfigured.
 */
export function verifySelar(
  rawBody: string,
  signature: string | null,
  config: { secret: string | undefined; encoding?: "hex" | "base64" }
): VerificationResult {
  if (!config.secret) return fail("SELAR_WEBHOOK_SECRET is not set");
  if (!signature) return fail("missing signature header");

  const encoding = config.encoding ?? "hex";
  const expected = createHmac("sha256", config.secret).update(rawBody, "utf8").digest(encoding);
  return compare(expected, signature) ? OK : fail("signature mismatch");
}

/**
 * The manual path used by WhatsApp Business sales and by support re-issues.
 * A bearer token, compared in constant time, and long enough to be worth
 * having: this endpoint can hand out any product in the catalogue.
 */
export function verifyAdminToken(
  header: string | null,
  token: string | undefined
): VerificationResult {
  if (!token) return fail("FULFILMENT_ADMIN_TOKEN is not set");
  if (token.length < 24) return fail("FULFILMENT_ADMIN_TOKEN is too short to be a secret");
  if (!header) return fail("missing Authorization header");

  const provided = header.startsWith("Bearer ") ? header.slice(7) : header;
  return compare(token, provided) ? OK : fail("bad admin token");
}
