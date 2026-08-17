import { describe, expect, it } from "vitest";
import { createHmac } from "node:crypto";

import {
  verifyAdminToken,
  verifyGumroad,
  verifyPaystack,
  verifySelar,
  verifyShopify,
} from "@/lib/fulfilment/signatures";
import { createDownloadToken, downloadUrl, hashToken, looksLikeToken, safeEqual } from "@/lib/fulfilment/tokens";
import {
  parseGumroad,
  parsePaystack,
  parseSelar,
  parseShopify,
} from "@/lib/fulfilment/payloads";
import { defaultTier, findPackage, findProduct, loadCatalog } from "@/lib/fulfilment/catalog";

// The catalogue is the thing being sold, so these tests read the real one
// rather than a fixture. A product removed from sale should break them.
const catalog = loadCatalog();
const sampleSlug = catalog.products[0].slug;

describe("catalogue", () => {
  it("loads every product from packaging/products", () => {
    expect(catalog.products.length).toBeGreaterThan(30);
    expect(new Set(catalog.products.map((p) => p.slug)).size).toBe(catalog.products.length);
  });

  it("has a default tier that permits client work", () => {
    const tier = defaultTier();
    expect(tier.clientWork).toBe(true);
    expect(tier.seats).toBeGreaterThan(1);
  });

  it("gives every product the copy a listing needs", () => {
    for (const product of catalog.products) {
      expect(product.problem.length, `${product.slug} problem`).toBeGreaterThan(80);
      expect(product.solves.length, `${product.slug} solves`).toBeGreaterThanOrEqual(3);
      expect(product.usage.length, `${product.slug} usage`).toBeGreaterThanOrEqual(4);
      expect(product.notFor.length, `${product.slug} notFor`).toBeGreaterThanOrEqual(2);
      expect(product.proof.length, `${product.slug} proof`).toBeGreaterThan(20);
    }
  });

  it("reports an unbuilt package rather than pretending it exists", () => {
    expect(findPackage("not-a-real-product", "solo")).toBeUndefined();
  });
});

describe("download tokens", () => {
  it("mints tokens that are unguessable and stored only as a hash", () => {
    const a = createDownloadToken();
    const b = createDownloadToken();

    expect(a.token).not.toBe(b.token);
    expect(a.token.length).toBeGreaterThanOrEqual(43);
    expect(a.tokenHash).toBe(hashToken(a.token));
    expect(a.tokenHash).not.toContain(a.token);
  });

  it("rejects malformed tokens before they reach the database", () => {
    expect(looksLikeToken(createDownloadToken().token)).toBe(true);
    expect(looksLikeToken("short")).toBe(false);
    expect(looksLikeToken("../../etc/passwd")).toBe(false);
    expect(looksLikeToken(null)).toBe(false);
    expect(looksLikeToken("a".repeat(200))).toBe(false);
  });

  it("compares secrets without leaking length or content", () => {
    expect(safeEqual("abc", "abc")).toBe(true);
    expect(safeEqual("abc", "abd")).toBe(false);
    expect(safeEqual("abc", "abcd")).toBe(false);
  });

  it("builds a link without doubling the slash", () => {
    expect(downloadUrl("https://example.com/", "tok")).toBe("https://example.com/d/tok");
    expect(downloadUrl("https://example.com", "tok")).toBe("https://example.com/d/tok");
  });
});

describe("webhook signatures", () => {
  const body = JSON.stringify({ event: "charge.success" });

  it("accepts a correct Paystack signature and rejects a tampered body", () => {
    const secret = "sk_test_secret";
    const signature = createHmac("sha512", secret).update(body).digest("hex");

    expect(verifyPaystack(body, signature, secret).ok).toBe(true);
    expect(verifyPaystack(`${body} `, signature, secret).ok).toBe(false);
    expect(verifyPaystack(body, signature, "other-secret").ok).toBe(false);
  });

  it("refuses Paystack when no secret is configured", () => {
    const result = verifyPaystack(body, "anything", undefined);
    expect(result.ok).toBe(false);
    expect(result.ok === false && result.reason).toContain("PAYSTACK_SECRET_KEY");
  });

  it("accepts a correct Shopify HMAC and rejects a missing header", () => {
    const secret = "shpss_secret";
    const signature = createHmac("sha256", secret).update(body, "utf8").digest("base64");

    expect(verifyShopify(body, signature, secret).ok).toBe(true);
    expect(verifyShopify(body, null, secret).ok).toBe(false);
    expect(verifyShopify(body, "AAAA", secret).ok).toBe(false);
  });

  it("checks both the Gumroad URL secret and the seller id", () => {
    const config = { pingSecret: "url-secret", sellerId: "seller-1" };

    expect(verifyGumroad("url-secret", "seller-1", config).ok).toBe(true);
    expect(verifyGumroad("wrong", "seller-1", config).ok).toBe(false);
    expect(verifyGumroad("url-secret", "seller-2", config).ok).toBe(false);
    expect(verifyGumroad(null, "seller-1", config).ok).toBe(false);
  });

  it("rejects every Selar request until its secret is configured", () => {
    const unconfigured = verifySelar(body, "sig", { secret: undefined });
    expect(unconfigured.ok).toBe(false);
    expect(unconfigured.ok === false && unconfigured.reason).toContain("SELAR_WEBHOOK_SECRET");

    const secret = "selar-secret";
    const hex = createHmac("sha256", secret).update(body, "utf8").digest("hex");
    const base64 = createHmac("sha256", secret).update(body, "utf8").digest("base64");

    expect(verifySelar(body, hex, { secret }).ok).toBe(true);
    expect(verifySelar(body, base64, { secret, encoding: "base64" }).ok).toBe(true);
    expect(verifySelar(body, base64, { secret, encoding: "hex" }).ok).toBe(false);
  });

  it("will not accept a short admin token even if it matches", () => {
    expect(verifyAdminToken("Bearer short", "short").ok).toBe(false);

    const token = "a".repeat(32);
    expect(verifyAdminToken(`Bearer ${token}`, token).ok).toBe(true);
    expect(verifyAdminToken(token, token).ok).toBe(true);
    expect(verifyAdminToken("Bearer wrong-token-of-same-len".padEnd(32, "x"), token).ok).toBe(false);
  });
});

describe("payload parsing", () => {
  it("reads a Paystack charge and its metadata", () => {
    const result = parsePaystack({
      event: "charge.success",
      data: {
        reference: "T123",
        amount: 37000,
        currency: "GHS",
        status: "success",
        customer: { email: "Buyer@Example.com " },
        metadata: { product_slug: sampleSlug, tier: "solo" },
      },
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.sale.email).toBe("buyer@example.com");
    expect(result.sale.productSlug).toBe(sampleSlug);
    expect(result.sale.tier).toBe("solo");
    expect(result.sale.amountMinor).toBe(37000);
  });

  it("reads Paystack custom_fields when metadata is not an object", () => {
    const result = parsePaystack({
      event: "charge.success",
      data: {
        reference: "T124",
        customer: { email: "b@example.com" },
        metadata: {
          custom_fields: [{ variable_name: "product_slug", value: sampleSlug }],
        },
      },
    });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.sale.productSlug).toBe(sampleSlug);
  });

  it("refuses a Paystack charge that does not name a product", () => {
    const result = parsePaystack({
      event: "charge.success",
      data: { reference: "T125", customer: { email: "b@example.com" }, metadata: {} },
    });

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.reason).toContain("product_slug");
  });

  it("ignores Paystack events other than charge.success", () => {
    expect(parsePaystack({ event: "charge.failed", data: {} }).ok).toBe(false);
  });

  it("splits a Shopify order into one sale per line item and flags unmapped SKUs", () => {
    const tier = defaultTier().id;
    const sku = `${sampleSlug.toUpperCase().replace(/-/g, "")}-${tier.toUpperCase()}`;

    const { sales, unmapped } = parseShopify({
      id: 998,
      email: "buyer@example.com",
      currency: "USD",
      line_items: [
        { sku, price: "73.00", quantity: 1 },
        { sku: "NOT-A-REAL-SKU", title: "Something else", price: "9.00" },
      ],
    });

    expect(sales).toHaveLength(1);
    expect(sales[0].productSlug).toBe(sampleSlug);
    expect(sales[0].tier).toBe(tier);
    expect(sales[0].reference).toBe(`998:${sku}`);
    expect(sales[0].amountMinor).toBe(7300);
    expect(unmapped).toEqual(["NOT-A-REAL-SKU"]);
  });

  it("keys Shopify sales per line item so a replay cannot double-issue", () => {
    const first = parseShopify({
      id: 1,
      email: "a@example.com",
      line_items: [{ title: findProduct(sampleSlug)!.name, price: "1" }],
    });
    const replay = parseShopify({
      id: 1,
      email: "a@example.com",
      line_items: [{ title: findProduct(sampleSlug)!.name, price: "1" }],
    });

    expect(first.sales[0].reference).toBe(replay.sales[0].reference);
  });

  it("reads a Gumroad ping and its version", () => {
    const form = new URLSearchParams({
      sale_id: "S1",
      email: "buyer@example.com",
      product_permalink: `https://x.gumroad.com/l/${sampleSlug}`,
      price: "3900",
      variants: "Tier: Studio licence",
      test: "false",
    });

    const result = parseGumroad(form);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.sale.productSlug).toBe(sampleSlug);
    expect(result.sale.tier).toBe("studio");
    expect(result.sale.isTest).toBe(false);
  });

  it("marks Gumroad test pings so they never become real sales", () => {
    const form = new URLSearchParams({
      sale_id: "S2",
      email: "b@example.com",
      product_permalink: sampleSlug,
      test: "true",
    });
    const result = parseGumroad(form);
    expect(result.ok && result.sale.isTest).toBe(true);
  });

  it("refuses a Gumroad ping whose permalink matches nothing", () => {
    const form = new URLSearchParams({
      sale_id: "S3",
      email: "b@example.com",
      product_permalink: "https://x.gumroad.com/l/some-other-thing",
    });
    expect(parseGumroad(form).ok).toBe(false);
  });

  it("reads a Selar payload and converts major units to minor", () => {
    const result = parseSelar({
      data: {
        reference: "SEL-1",
        customer_email: "buyer@example.com",
        product_name: findProduct(sampleSlug)!.name,
        amount: 370,
        currency: "ghs",
      },
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.sale.productSlug).toBe(sampleSlug);
    expect(result.sale.amountMinor).toBe(37000);
    expect(result.sale.currency).toBe("GHS");
  });

  it("refuses a Selar payload that identifies no product", () => {
    const result = parseSelar({ data: { reference: "SEL-2", email: "b@example.com" } });
    expect(result.ok).toBe(false);
    expect(result.ok === false && result.reason).toContain("cannot identify the product");
  });

  it("never accepts an invalid email from any platform", () => {
    expect(
      parsePaystack({
        event: "charge.success",
        data: { reference: "R", customer: { email: "not-an-email" }, metadata: { product_slug: sampleSlug } },
      }).ok
    ).toBe(false);

    expect(
      parseGumroad(new URLSearchParams({ sale_id: "S", email: "nope", product_permalink: sampleSlug })).ok
    ).toBe(false);
  });
});
