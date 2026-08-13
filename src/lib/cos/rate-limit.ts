import { rateLimited } from "./errors";

type Bucket = { tokens: number; updatedAt: number };

const buckets = new Map<string, Bucket>();

/**
 * Token-bucket rate limiter.
 *
 * This is an in-process limiter: it protects a single Node instance, which is
 * the right level of protection for expensive AI endpoints on a single-tenant
 * deployment. For a multi-instance deployment, back it with Redis — the call
 * sites do not change (see SECURITY.md).
 */
export function consumeRateLimit(
  key: string,
  options: { limit: number; windowMs: number }
): { remaining: number; resetInMs: number } {
  const now = Date.now();
  const refillPerMs = options.limit / options.windowMs;
  const existing = buckets.get(key);

  const bucket: Bucket = existing
    ? {
        tokens: Math.min(options.limit, existing.tokens + (now - existing.updatedAt) * refillPerMs),
        updatedAt: now,
      }
    : { tokens: options.limit, updatedAt: now };

  if (bucket.tokens < 1) {
    buckets.set(key, bucket);
    const resetInMs = Math.ceil((1 - bucket.tokens) / refillPerMs);
    throw rateLimited(
      `Too many requests. Try again in ${Math.max(1, Math.ceil(resetInMs / 1000))}s.`
    );
  }

  bucket.tokens -= 1;
  buckets.set(key, bucket);

  // Opportunistic cleanup so the map cannot grow without bound.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (now - v.updatedAt > options.windowMs * 4) buckets.delete(k);
    }
  }

  return { remaining: Math.floor(bucket.tokens), resetInMs: 0 };
}

/** Limits tuned per surface. AI calls are the expensive ones. */
export const RATE_LIMITS = {
  ai: { limit: 20, windowMs: 60_000 },
  agent: { limit: 10, windowMs: 60_000 },
  write: { limit: 120, windowMs: 60_000 },
  read: { limit: 600, windowMs: 60_000 },
} as const;

export function resetRateLimits(): void {
  buckets.clear();
}
