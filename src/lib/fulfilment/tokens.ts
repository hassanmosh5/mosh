/**
 * Download tokens.
 *
 * A token is 32 bytes of randomness. Only its SHA-256 is stored, so a database
 * leak yields no working links — the same reason password hashes exist. There
 * is no signature and no embedded payload, because a stateless token cannot be
 * revoked and cannot count its own downloads, and both matter more here than
 * saving a database round trip.
 */

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

/** 43 characters of base64url. Long enough that guessing is not a strategy. */
export function createDownloadToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashToken(token) };
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Constant-time comparison for any secret compared inside a request. */
export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/**
 * Tokens appear in URLs, so they are cheap to fat-finger. Rejecting a
 * malformed one before touching the database keeps the failure fast and keeps
 * junk out of the query log.
 */
export function looksLikeToken(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{40,64}$/.test(value);
}

export function downloadUrl(siteUrl: string, token: string): string {
  return `${siteUrl.replace(/\/$/, "")}/d/${token}`;
}
