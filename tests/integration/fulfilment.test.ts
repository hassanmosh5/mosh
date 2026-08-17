import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { hasDatabase, prisma } from "./setup";
import {
  claimDownload,
  inspectGrant,
  issueGrant,
  reissueGrant,
  revokeSale,
} from "@/lib/fulfilment/grants";
import { defaultTier, findPackage, loadCatalog } from "@/lib/fulfilment/catalog";
import { hashToken } from "@/lib/fulfilment/tokens";

/**
 * The path a buyer's money takes, against a real database: webhook → sale →
 * grant → download → exhaustion → revocation. The unit tests cover the parsing
 * and the signatures; these cover the two properties that only a real database
 * can demonstrate — that a replayed webhook cannot sell twice, and that
 * concurrent downloads cannot both pass the limit check.
 */
const describeIfDb = hasDatabase ? describe : describe.skip;

const catalog = loadCatalog();
const tier = defaultTier().id;

// Pick a product that has actually been built, so the test fails for the right
// reason if `npm run pkg:build` has not been run.
const builtProduct =
  catalog.products.find((product) => findPackage(product.slug, tier))?.slug ?? null;

let unique = 0;
const reference = () => `TEST-${Date.now().toString(36)}-${(unique += 1)}`;

describeIfDb("fulfilment: payment to download", () => {
  const created: string[] = [];

  beforeAll(() => {
    if (!builtProduct) {
      throw new Error("No packages built. Run `npm run pkg:build` before the integration suite.");
    }
  });

  afterAll(async () => {
    if (created.length) {
      await prisma.sale.deleteMany({ where: { id: { in: created } } });
    }
    await prisma.$disconnect();
  });

  it("records the sale and issues a usable grant", async () => {
    const ref = reference();
    const result = await issueGrant({
      platform: "PAYSTACK",
      reference: ref,
      email: "buyer@example.test",
      productSlug: builtProduct!,
      tier,
      amountMinor: 37000,
      currency: "GHS",
    });

    expect(result.status).toBe("issued");
    if (result.status !== "issued") return;
    created.push(result.saleId);

    expect(result.token).toBeTruthy();
    expect(result.expiresAt.getTime()).toBeGreaterThan(Date.now());

    // The token is never stored, only its hash.
    const stored = await prisma.downloadGrant.findUnique({ where: { id: result.grantId } });
    expect(stored?.tokenHash).toBe(hashToken(result.token!));
    expect(JSON.stringify(stored)).not.toContain(result.token!);

    const found = await inspectGrant(result.token!);
    expect(found.ok).toBe(true);
  });

  it("does not sell twice when a webhook is replayed", async () => {
    const ref = reference();
    const input = {
      platform: "PAYSTACK" as const,
      reference: ref,
      email: "replay@example.test",
      productSlug: builtProduct!,
      tier,
      amountMinor: 37000,
      currency: "GHS",
    };

    const first = await issueGrant(input);
    expect(first.status).toBe("issued");
    if (first.status !== "issued") return;
    created.push(first.saleId);

    const replay = await issueGrant(input);
    expect(replay.status).toBe("already-issued");
    if (replay.status !== "already-issued") return;

    // Same sale, same grant, and no second token minted.
    expect(replay.saleId).toBe(first.saleId);
    expect(replay.grantId).toBe(first.grantId);
    expect(replay.token).toBeNull();

    const grants = await prisma.downloadGrant.count({ where: { saleId: first.saleId } });
    expect(grants).toBe(1);
  });

  it("counts every download and stops at the limit", async () => {
    const ref = reference();
    const result = await issueGrant({
      platform: "MANUAL",
      reference: ref,
      email: "limit@example.test",
      productSlug: builtProduct!,
      tier,
      amountMinor: 0,
      currency: "GHS",
    });
    expect(result.status).toBe("issued");
    if (result.status !== "issued") return;
    created.push(result.saleId);

    const max = result.maxDownloads;
    for (let attempt = 0; attempt < max; attempt++) {
      const claim = await claimDownload(result.token!, { ip: "127.0.0.1", userAgent: "vitest" });
      expect(claim.ok, `claim ${attempt + 1} of ${max}`).toBe(true);
    }

    const overLimit = await claimDownload(result.token!, {});
    expect(overLimit.ok).toBe(false);
    expect(overLimit.ok === false && overLimit.reason).toBe("exhausted");

    const events = await prisma.downloadEvent.count({ where: { grantId: result.grantId } });
    expect(events).toBe(max);
  });

  it("cannot be pushed past the limit by concurrent clicks", async () => {
    const ref = reference();
    const result = await issueGrant({
      platform: "MANUAL",
      reference: ref,
      email: "race@example.test",
      productSlug: builtProduct!,
      tier,
      amountMinor: 0,
      currency: "GHS",
    });
    if (result.status !== "issued") throw new Error("expected a fresh grant");
    created.push(result.saleId);

    // Leave one download available, then fire ten requests at it at once.
    await prisma.downloadGrant.update({
      where: { id: result.grantId },
      data: { downloadCount: result.maxDownloads - 1 },
    });

    const attempts = await Promise.all(
      Array.from({ length: 10 }, () => claimDownload(result.token!, {}))
    );
    const succeeded = attempts.filter((attempt) => attempt.ok).length;

    expect(succeeded).toBe(1);

    const grant = await prisma.downloadGrant.findUnique({ where: { id: result.grantId } });
    expect(grant?.downloadCount).toBe(result.maxDownloads);
  });

  it("refuses an expired grant without consuming a download", async () => {
    const ref = reference();
    const result = await issueGrant({
      platform: "MANUAL",
      reference: ref,
      email: "expired@example.test",
      productSlug: builtProduct!,
      tier,
      amountMinor: 0,
      currency: "GHS",
    });
    if (result.status !== "issued") throw new Error("expected a fresh grant");
    created.push(result.saleId);

    await prisma.downloadGrant.update({
      where: { id: result.grantId },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });

    const claim = await claimDownload(result.token!, {});
    expect(claim.ok).toBe(false);
    expect(claim.ok === false && claim.reason).toBe("expired");

    const grant = await prisma.downloadGrant.findUnique({ where: { id: result.grantId } });
    expect(grant?.downloadCount).toBe(0);
  });

  it("revokes every live link when a sale is refunded", async () => {
    const ref = reference();
    const result = await issueGrant({
      platform: "SHOPIFY",
      reference: ref,
      email: "refund@example.test",
      productSlug: builtProduct!,
      tier,
      amountMinor: 7300,
      currency: "USD",
    });
    if (result.status !== "issued") throw new Error("expected a fresh grant");
    created.push(result.saleId);

    const second = await reissueGrant(result.saleId);
    expect((await inspectGrant(second.token)).ok).toBe(true);

    const revoked = await revokeSale(result.saleId, "REFUNDED");
    expect(revoked).toBe(2);

    for (const token of [result.token!, second.token]) {
      const claim = await claimDownload(token, {});
      expect(claim.ok).toBe(false);
      expect(claim.ok === false && claim.reason).toBe("revoked");
    }

    const sale = await prisma.sale.findUnique({ where: { id: result.saleId } });
    expect(sale?.status).toBe("REFUNDED");
  });

  it("re-issues a working link for a buyer who lost theirs", async () => {
    const ref = reference();
    const result = await issueGrant({
      platform: "WHATSAPP",
      reference: ref,
      email: "lost@example.test",
      productSlug: builtProduct!,
      tier,
      amountMinor: 37000,
      currency: "GHS",
    });
    if (result.status !== "issued") throw new Error("expected a fresh grant");
    created.push(result.saleId);

    const fresh = await reissueGrant(result.saleId);
    const claim = await claimDownload(fresh.token, {});
    expect(claim.ok).toBe(true);

    // The original still works too — re-issuing is not revoking.
    expect((await inspectGrant(result.token!)).ok).toBe(true);
  });

  it("will not issue a grant for something that has no package", async () => {
    const result = await issueGrant({
      platform: "MANUAL",
      reference: reference(),
      email: "nope@example.test",
      productSlug: "a-product-that-does-not-exist",
      tier,
      amountMinor: 0,
      currency: "GHS",
    });

    expect(result.status).toBe("unknown-product");
    expect(await prisma.sale.count({ where: { productSlug: "a-product-that-does-not-exist" } })).toBe(0);
  });

  it("deletes grants and events with the sale", async () => {
    const result = await issueGrant({
      platform: "MANUAL",
      reference: reference(),
      email: "cascade@example.test",
      productSlug: builtProduct!,
      tier,
      amountMinor: 0,
      currency: "GHS",
    });
    if (result.status !== "issued") throw new Error("expected a fresh grant");

    await claimDownload(result.token!, {});
    await prisma.sale.delete({ where: { id: result.saleId } });

    expect(await prisma.downloadGrant.count({ where: { id: result.grantId } })).toBe(0);
    expect(await prisma.downloadEvent.count({ where: { grantId: result.grantId } })).toBe(0);
  });
});
