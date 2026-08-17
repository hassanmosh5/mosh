/**
 * Recording a sale and issuing the download that follows it.
 *
 * Two properties matter more than anything else here:
 *
 *   1. Replaying a webhook must not sell twice. Every platform retries, and
 *      Gumroad retries hourly for three hours on a non-200. The unique index
 *      on (platform, reference) is what enforces it; this module never works
 *      around it.
 *   2. A download must not outlive its grant. The counter is incremented by a
 *      conditional UPDATE rather than read-then-write, so two tabs clicking at
 *      once cannot both pass the limit check.
 */

import type { Prisma } from "@/generated/prisma/client";
import type { SalesPlatform } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { createDownloadToken, hashToken } from "./tokens";
import { loadCatalog, resolveSellable } from "./catalog";

export type IssueInput = {
  platform: SalesPlatform;
  reference: string;
  email: string;
  productSlug: string;
  tier: string;
  amountMinor: number;
  currency: string;
  payload?: Prisma.InputJsonValue;
};

export type IssueResult =
  | {
      status: "issued" | "already-issued";
      saleId: string;
      grantId: string;
      /** Present only when a token was just minted; it is never recoverable later. */
      token: string | null;
      expiresAt: Date;
      maxDownloads: number;
      productName: string;
      tierName: string;
    }
  | { status: "unknown-product"; reason: string }
  | { status: "not-built"; reason: string };

function windowFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

/**
 * Records the sale and mints a download grant. Safe to call repeatedly with
 * the same platform reference — the second call reports `already-issued` and
 * changes nothing.
 */
export async function issueGrant(input: IssueInput): Promise<IssueResult> {
  const catalog = loadCatalog();
  const sellable = resolveSellable(input.productSlug, input.tier);

  if (!sellable) {
    const known = catalog.products.some((product) => product.slug === input.productSlug);
    return known
      ? {
          status: "not-built",
          reason: `No package built for ${input.productSlug}/${input.tier}. Run \`npm run pkg:build\`.`,
        }
      : {
          status: "unknown-product",
          reason: `"${input.productSlug}" is not in the catalogue.`,
        };
  }

  const existing = await prisma.sale.findUnique({
    where: { platform_reference: { platform: input.platform, reference: input.reference } },
    include: { grants: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  if (existing?.grants.length) {
    const grant = existing.grants[0];
    return {
      status: "already-issued",
      saleId: existing.id,
      grantId: grant.id,
      token: null,
      expiresAt: grant.expiresAt,
      maxDownloads: grant.maxDownloads,
      productName: sellable.product.name,
      tierName: sellable.tier.name,
    };
  }

  const { token, tokenHash } = createDownloadToken();
  const expiresAt = windowFromNow(catalog.policies.downloadWindowDays);

  // One transaction: a sale row without a grant would be a paid customer with
  // no way to download, which is the failure this whole module exists to avoid.
  const sale = await prisma.$transaction(async (tx) => {
    const record = await tx.sale.upsert({
      where: { platform_reference: { platform: input.platform, reference: input.reference } },
      update: { email: input.email, payload: input.payload },
      create: {
        platform: input.platform,
        reference: input.reference,
        email: input.email.toLowerCase().trim(),
        productSlug: input.productSlug,
        tier: input.tier,
        amountMinor: input.amountMinor,
        currency: input.currency.toUpperCase(),
        payload: input.payload,
      },
    });

    await tx.downloadGrant.create({
      data: {
        saleId: record.id,
        productSlug: input.productSlug,
        tier: input.tier,
        tokenHash,
        maxDownloads: catalog.policies.maxDownloads,
        expiresAt,
      },
    });

    return record;
  });

  const grant = await prisma.downloadGrant.findUniqueOrThrow({ where: { tokenHash } });

  return {
    status: "issued",
    saleId: sale.id,
    grantId: grant.id,
    token,
    expiresAt,
    maxDownloads: grant.maxDownloads,
    productName: sellable.product.name,
    tierName: sellable.tier.name,
  };
}

export type GrantLookup =
  | { ok: true; grant: Awaited<ReturnType<typeof findGrantRecord>> & object }
  | { ok: false; reason: "not-found" | "revoked" | "expired" | "exhausted" };

async function findGrantRecord(token: string) {
  return prisma.downloadGrant.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { sale: true },
  });
}

/** Read-only check, used by the download page before it offers the button. */
export async function inspectGrant(token: string): Promise<GrantLookup> {
  const grant = await findGrantRecord(token);
  if (!grant) return { ok: false, reason: "not-found" };
  if (grant.revokedAt) return { ok: false, reason: "revoked" };
  if (grant.expiresAt.getTime() <= Date.now()) return { ok: false, reason: "expired" };
  if (grant.downloadCount >= grant.maxDownloads) return { ok: false, reason: "exhausted" };
  return { ok: true, grant };
}

/**
 * Claims one download. The conditional UPDATE is the whole point: the same
 * predicate that decides whether a download is allowed is the one that
 * increments the counter, so concurrent requests cannot both win.
 */
export async function claimDownload(
  token: string,
  context: { ip?: string | null; userAgent?: string | null }
): Promise<GrantLookup> {
  const found = await inspectGrant(token);
  if (!found.ok) return found;

  const claimed = await prisma.downloadGrant.updateMany({
    where: {
      id: found.grant.id,
      revokedAt: null,
      expiresAt: { gt: new Date() },
      downloadCount: { lt: found.grant.maxDownloads },
    },
    data: { downloadCount: { increment: 1 } },
  });

  if (claimed.count !== 1) return { ok: false, reason: "exhausted" };

  await prisma.downloadEvent.create({
    data: {
      grantId: found.grant.id,
      ip: context.ip ?? null,
      userAgent: context.userAgent?.slice(0, 500) ?? null,
    },
  });

  return found;
}

/** Support path: a buyer who lost the link, or a fresh window after expiry. */
export async function reissueGrant(saleId: string): Promise<{ token: string; expiresAt: Date }> {
  const catalog = loadCatalog();
  const sale = await prisma.sale.findUniqueOrThrow({ where: { id: saleId } });
  const { token, tokenHash } = createDownloadToken();
  const expiresAt = windowFromNow(catalog.policies.downloadWindowDays);

  await prisma.downloadGrant.create({
    data: {
      saleId: sale.id,
      productSlug: sale.productSlug,
      tier: sale.tier,
      tokenHash,
      maxDownloads: catalog.policies.maxDownloads,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

/** Used on refund and chargeback. Revokes every live link for the sale. */
export async function revokeSale(saleId: string, reason: "REFUNDED" | "CANCELLED"): Promise<number> {
  const [, revoked] = await prisma.$transaction([
    prisma.sale.update({ where: { id: saleId }, data: { status: reason } }),
    prisma.downloadGrant.updateMany({
      where: { saleId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);
  return revoked.count;
}
