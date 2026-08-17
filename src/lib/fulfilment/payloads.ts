/**
 * Reading "what was bought" out of four differently-shaped webhook bodies.
 *
 * Each platform is parsed on its own terms, and each parser refuses rather than
 * guesses. Guessing here means emailing the wrong product to a paying customer,
 * which costs more than a failed webhook that retries.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { defaultTier, findProduct, findTier, loadCatalog } from "./catalog";

export type ParsedSale = {
  reference: string;
  email: string;
  productSlug: string;
  tier: string;
  amountMinor: number;
  currency: string;
  isTest: boolean;
};

export type ParseResult = { ok: true; sale: ParsedSale } | { ok: false; reason: string };

const fail = (reason: string): ParseResult => ({ ok: false, reason });

function normaliseEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Accepts a slug or an exact product name, so a storefront that cannot attach
 * metadata to a product still works — Paystack's storefront being the case
 * that forced this.
 *
 * Matching is exact on one of the two. There is deliberately no fuzzy match:
 * two products here differ by a word, and shipping the wrong one to a paying
 * customer is worse than failing the webhook and being told about it.
 */
function resolveSlug(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const candidate = value.trim();
  if (!candidate) return null;

  if (findProduct(candidate)) return candidate;

  const slugified = slugify(candidate);
  if (findProduct(slugified)) return slugified;

  const byName = loadCatalog().products.find(
    (product) => slugify(product.name) === slugified
  );
  return byName?.slug ?? null;
}

function resolveTier(value: unknown): string {
  if (typeof value === "string" && findTier(value.trim().toLowerCase())) {
    return value.trim().toLowerCase();
  }
  return defaultTier().id;
}

// ---------------------------------------------------------------- Paystack

type PaystackBody = {
  event?: string;
  data?: {
    reference?: string;
    amount?: number;
    currency?: string;
    status?: string;
    customer?: { email?: string };
    metadata?:
      | { product_slug?: string; tier?: string; custom_fields?: { variable_name?: string; value?: string }[] }
      | string;
  };
};

export function parsePaystack(body: PaystackBody): ParseResult {
  if (body.event !== "charge.success") return fail(`ignoring event "${body.event}"`);

  const data = body.data;
  if (!data) return fail("no data object");
  if (data.status && data.status !== "success") return fail(`charge status "${data.status}"`);

  const reference = typeof data.reference === "string" ? data.reference : null;
  if (!reference) return fail("no transaction reference");

  const email = normaliseEmail(data.customer?.email);
  if (!email) return fail("no usable customer email");

  // Metadata arrives as an object, or as a JSON string, or as Paystack's
  // custom_fields array depending on how the payment page was built.
  let metadata: Record<string, unknown> = {};
  if (typeof data.metadata === "string") {
    try {
      metadata = JSON.parse(data.metadata) as Record<string, unknown>;
    } catch {
      metadata = {};
    }
  } else if (data.metadata && typeof data.metadata === "object") {
    metadata = data.metadata as Record<string, unknown>;
    const fields = (data.metadata as { custom_fields?: { variable_name?: string; value?: string }[] })
      .custom_fields;
    for (const field of fields ?? []) {
      if (field.variable_name) metadata[field.variable_name] = field.value;
    }
  }

  const productSlug = resolveSlug(metadata.product_slug) ?? resolveSlug(metadata.product);
  if (!productSlug) {
    return fail(
      "no product_slug in metadata — add it to the payment page, or name the product exactly as its catalogue name or slug"
    );
  }

  return {
    ok: true,
    sale: {
      reference,
      email,
      productSlug,
      tier: resolveTier(metadata.tier),
      amountMinor: typeof data.amount === "number" ? data.amount : 0,
      currency: typeof data.currency === "string" ? data.currency : "GHS",
      isTest: false,
    },
  };
}

// ----------------------------------------------------------------- Shopify

let skuMapCache: Record<string, { slug: string; tier: string }> | null = null;

export function loadSkuMap(): Record<string, { slug: string; tier: string }> {
  if (skuMapCache) return skuMapCache;
  const path = join(process.cwd(), "packaging", "listings", "_imports", "sku-map.json");
  skuMapCache = existsSync(path)
    ? (JSON.parse(readFileSync(path, "utf8")) as Record<string, { slug: string; tier: string }>)
    : {};
  return skuMapCache;
}

type ShopifyOrder = {
  id?: number | string;
  order_number?: number;
  email?: string;
  contact_email?: string;
  currency?: string;
  test?: boolean;
  line_items?: { sku?: string; title?: string; price?: string; quantity?: number }[];
};

/**
 * A Shopify order can contain several products, so this returns one parsed
 * sale per line item that maps to a package. Line items that do not map are
 * reported rather than dropped silently — an unmapped SKU is a configuration
 * error somebody has to see.
 */
export function parseShopify(order: ShopifyOrder): {
  sales: ParsedSale[];
  unmapped: string[];
  reason?: string;
} {
  const email = normaliseEmail(order.email) ?? normaliseEmail(order.contact_email);
  if (!email) return { sales: [], unmapped: [], reason: "no usable email on the order" };

  const orderId = String(order.id ?? order.order_number ?? "");
  if (!orderId) return { sales: [], unmapped: [], reason: "no order id" };

  const skuMap = loadSkuMap();
  const sales: ParsedSale[] = [];
  const unmapped: string[] = [];

  for (const item of order.line_items ?? []) {
    const sku = item.sku?.trim().toUpperCase();
    const mapped = sku ? skuMap[sku] : undefined;

    if (!mapped) {
      // Fall back to the title, which is enough when a store was built by hand
      // rather than from the generated CSV.
      const slug = resolveSlug(item.title);
      if (!slug) {
        unmapped.push(item.sku ?? item.title ?? "(unnamed line item)");
        continue;
      }
      sales.push({
        reference: `${orderId}:${slug}`,
        email,
        productSlug: slug,
        tier: defaultTier().id,
        amountMinor: Math.round(Number(item.price ?? 0) * 100),
        currency: order.currency ?? "USD",
        isTest: Boolean(order.test),
      });
      continue;
    }

    sales.push({
      reference: `${orderId}:${sku}`,
      email,
      productSlug: mapped.slug,
      tier: mapped.tier,
      amountMinor: Math.round(Number(item.price ?? 0) * 100),
      currency: order.currency ?? "USD",
      isTest: Boolean(order.test),
    });
  }

  return { sales, unmapped };
}

// ----------------------------------------------------------------- Gumroad

/** Gumroad Ping is form-encoded, so every value arrives as a string. */
export function parseGumroad(form: URLSearchParams): ParseResult {
  const saleId = form.get("sale_id");
  if (!saleId) return fail("no sale_id");

  const email = normaliseEmail(form.get("email"));
  if (!email) return fail("no usable email");

  const permalink = form.get("product_permalink") ?? "";
  const slugFromPermalink = permalink.split("/").filter(Boolean).pop();
  const productSlug =
    resolveSlug(slugFromPermalink) ??
    resolveSlug(form.get("short_product_id")) ??
    resolveSlug(form.get("product_name"));

  if (!productSlug) {
    return fail(
      `cannot match "${permalink || form.get("product_name")}" to a catalogue product — set the Gumroad permalink to the product slug`
    );
  }

  // Gumroad Versions arrive as {"Tier": "Studio licence"} or similar.
  let tier = defaultTier().id;
  const variants = form.get("variants");
  if (variants) {
    const lowered = variants.toLowerCase();
    for (const candidate of ["solo", "studio", "agency"]) {
      if (lowered.includes(candidate)) tier = candidate;
    }
  }

  return {
    ok: true,
    sale: {
      reference: saleId,
      email,
      productSlug,
      tier: resolveTier(tier),
      amountMinor: Number(form.get("price") ?? 0),
      currency: form.get("currency")?.toUpperCase() ?? "USD",
      isTest: form.get("test") === "true",
    },
  };
}

// ------------------------------------------------------------------- Selar

type SelarBody = Record<string, unknown> & {
  event?: string;
  data?: Record<string, unknown>;
};

/**
 * Selar's payload shape is not documented publicly at the time of writing, so
 * this reads the field names such payloads commonly use and refuses when none
 * of them identify a catalogue product. It never falls back to "the first
 * product that looks similar".
 */
export function parseSelar(body: SelarBody): ParseResult {
  const data = (body.data ?? body) as Record<string, unknown>;

  const reference =
    (typeof data.reference === "string" && data.reference) ||
    (typeof data.transaction_id === "string" && data.transaction_id) ||
    (typeof data.order_id === "string" && data.order_id) ||
    (typeof data.id === "string" && data.id) ||
    null;
  if (!reference) return fail("no reference/transaction_id/order_id in payload");

  const email =
    normaliseEmail(data.email) ??
    normaliseEmail(data.customer_email) ??
    normaliseEmail((data.customer as { email?: string })?.email) ??
    normaliseEmail((data.buyer as { email?: string })?.email);
  if (!email) return fail("no usable email in payload");

  const metadata = (data.metadata ?? {}) as Record<string, unknown>;
  const productSlug =
    resolveSlug(metadata.product_slug) ??
    resolveSlug(data.product_slug) ??
    resolveSlug(data.product_name) ??
    resolveSlug((data.product as { name?: string })?.name);

  if (!productSlug) {
    return fail(
      "cannot identify the product — name the Selar product exactly as its catalogue slug, or send product_slug in metadata"
    );
  }

  const amount = Number(data.amount ?? data.total ?? 0);

  return {
    ok: true,
    sale: {
      reference,
      email,
      productSlug,
      tier: resolveTier(metadata.tier ?? data.tier),
      // Selar quotes major units in most of its payloads; store minor units.
      amountMinor: Number.isFinite(amount) ? Math.round(amount * 100) : 0,
      currency: typeof data.currency === "string" ? data.currency.toUpperCase() : "NGN",
      isTest: data.test === true || data.mode === "test",
    },
  };
}

export function resetPayloadCaches(): void {
  skuMapCache = null;
}
