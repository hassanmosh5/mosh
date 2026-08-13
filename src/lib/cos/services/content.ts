import { prisma } from "@/lib/prisma";
import type { CosContext } from "../tenancy";
import { assertOwned } from "../tenancy";
import { recordAudit } from "../audit";
import { conflict, notFound } from "../errors";
import { slugify, toNumber } from "../format";
import type {
  contentCreateSchema, contentUpdateSchema,
  productCreateSchema, productUpdateSchema,
} from "../schemas";
import type { z } from "zod";

// ---------------------------------------------------------------------------
// Content calendar
// ---------------------------------------------------------------------------

export async function listContent(
  ctx: CosContext,
  options: { status?: string; platform?: string } = {}
) {
  return prisma.contentItem.findMany({
    where: {
      businessId: ctx.businessId,
      ...(options.status ? { status: options.status as never } : {}),
      ...(options.platform ? { platform: options.platform as never } : {}),
    },
    orderBy: [{ publishAt: "asc" }, { updatedAt: "desc" }],
    include: {
      product: { select: { id: true, name: true } },
      campaign: { select: { id: true, name: true } },
    },
    take: 200,
  });
}

export async function getContentItem(ctx: CosContext, id: string) {
  const item = await prisma.contentItem.findUnique({
    where: { id },
    include: { product: true, campaign: true },
  });
  if (!item || item.businessId !== ctx.businessId) throw notFound("That content item could not be found.");
  return item;
}

export async function createContentItem(ctx: CosContext, input: z.infer<typeof contentCreateSchema>) {
  if (input.productId) {
    const product = await prisma.product.findUnique({ where: { id: input.productId } });
    await assertOwned(product, ctx, "product");
  }
  if (input.campaignId) {
    const campaign = await prisma.campaign.findUnique({ where: { id: input.campaignId } });
    await assertOwned(campaign, ctx, "campaign");
  }
  const item = await prisma.contentItem.create({ data: { businessId: ctx.businessId, ...input } });
  await recordAudit(ctx, { action: "content.create", entityType: "content", entityId: item.id, detail: { title: item.title } });
  return item;
}

/**
 * Publishing is a sensitive action: the API layer routes a status change to
 * PUBLISHED through the approval flow when it originates from the AI. A human
 * setting it directly is the approval.
 */
export async function updateContentItem(ctx: CosContext, id: string, input: z.infer<typeof contentUpdateSchema>) {
  const existing = await prisma.contentItem.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "content item");
  const publishing = input.status === "PUBLISHED" && existing!.status !== "PUBLISHED";
  const item = await prisma.contentItem.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.platform !== undefined ? { platform: input.platform } : {}),
      ...(input.format !== undefined ? { format: input.format } : {}),
      ...(input.topic !== undefined ? { topic: input.topic } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.publishAt !== undefined ? { publishAt: input.publishAt } : {}),
      ...(input.script !== undefined ? { script: input.script } : {}),
      ...(input.caption !== undefined ? { caption: input.caption } : {}),
      ...(input.callToAction !== undefined ? { callToAction: input.callToAction } : {}),
      ...(input.assetUrl !== undefined ? { assetUrl: input.assetUrl } : {}),
      ...(input.productId !== undefined ? { productId: input.productId || null } : {}),
      ...(input.campaignId !== undefined ? { campaignId: input.campaignId || null } : {}),
      ...(input.views !== undefined ? { views: input.views } : {}),
      ...(input.engagements !== undefined ? { engagements: input.engagements } : {}),
      ...(input.conversions !== undefined ? { conversions: input.conversions } : {}),
      ...(publishing ? { publishedAt: new Date() } : {}),
    },
  });
  await recordAudit(ctx, {
    action: publishing ? "content.publish" : "content.update",
    entityType: "content",
    entityId: id,
    detail: { fields: Object.keys(input) },
  });
  return item;
}

export async function deleteContentItem(ctx: CosContext, id: string) {
  const existing = await prisma.contentItem.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "content item");
  await prisma.contentItem.delete({ where: { id } });
  await recordAudit(ctx, { action: "content.delete", entityType: "content", entityId: id });
  return { ok: true };
}

export async function listCampaigns(ctx: CosContext) {
  return prisma.campaign.findMany({
    where: { businessId: ctx.businessId },
    orderBy: [{ active: "desc" }, { startDate: "desc" }],
    include: { product: { select: { id: true, name: true } }, _count: { select: { contentItems: true } } },
    take: 100,
  });
}

// ---------------------------------------------------------------------------
// Digital products
// ---------------------------------------------------------------------------

async function uniqueSlug(businessId: string, name: string, ignoreId?: string) {
  const base = slugify(name);
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
    const existing = await prisma.product.findUnique({
      where: { businessId_slug: { businessId, slug: candidate } },
      select: { id: true },
    });
    if (!existing || existing.id === ignoreId) return candidate;
  }
  throw conflict("Too many products share that name.");
}

export async function listProducts(ctx: CosContext) {
  const products = await prisma.product.findMany({
    where: { businessId: ctx.businessId },
    orderBy: [{ stage: "asc" }, { revenue: "desc" }],
    include: {
      area: { select: { id: true, name: true } },
      _count: { select: { contentItems: true, campaigns: true } },
    },
    take: 200,
  });
  return products.map((product) => ({
    ...product,
    priceValue: toNumber(product.price),
    revenueValue: toNumber(product.revenue),
  }));
}

export async function getProduct(ctx: CosContext, id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      area: true,
      contentItems: { orderBy: { publishAt: "asc" }, take: 30 },
      campaigns: { orderBy: { startDate: "desc" }, take: 10 },
    },
  });
  if (!product || product.businessId !== ctx.businessId) throw notFound("That product could not be found.");
  return product;
}

export async function createProduct(ctx: CosContext, input: z.infer<typeof productCreateSchema>) {
  if (input.areaId) {
    const area = await prisma.businessArea.findUnique({ where: { id: input.areaId } });
    await assertOwned(area, ctx, "business area");
  }
  const slug = await uniqueSlug(ctx.businessId, input.name);
  const product = await prisma.product.create({
    data: { businessId: ctx.businessId, ...input, slug, revenue: input.revenue ?? 0 },
  });
  await recordAudit(ctx, { action: "product.create", entityType: "product", entityId: product.id, detail: { name: product.name } });
  return product;
}

export async function updateProduct(ctx: CosContext, id: string, input: z.infer<typeof productUpdateSchema>) {
  const existing = await prisma.product.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "product");
  const slug =
    input.name && input.name !== existing!.name ? await uniqueSlug(ctx.businessId, input.name, id) : undefined;
  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(slug ? { slug } : {}),
      ...(input.category !== undefined ? { category: input.category } : {}),
      ...(input.areaId !== undefined ? { areaId: input.areaId || null } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.price !== undefined ? { price: input.price } : {}),
      ...(input.platform !== undefined ? { platform: input.platform } : {}),
      ...(input.landingPage !== undefined ? { landingPage: input.landingPage } : {}),
      ...(input.stage !== undefined ? { stage: input.stage } : {}),
      ...(input.unitsSold !== undefined ? { unitsSold: input.unitsSold } : {}),
      ...(input.revenue !== undefined ? { revenue: input.revenue ?? 0 } : {}),
      ...(input.feedback !== undefined ? { feedback: input.feedback } : {}),
    },
  });
  await recordAudit(ctx, {
    action: input.price !== undefined && input.price !== null ? "product.pricing_change" : "product.update",
    entityType: "product",
    entityId: id,
    detail: { fields: Object.keys(input) },
  });
  return product;
}

export async function deleteProduct(ctx: CosContext, id: string) {
  const existing = await prisma.product.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "product");
  await prisma.product.delete({ where: { id } });
  await recordAudit(ctx, { action: "product.delete", entityType: "product", entityId: id });
  return { ok: true };
}
