import { prisma } from "@/lib/prisma";
import type { MoshOfferTier } from "@/generated/prisma/enums";
import { toNumber } from "@/lib/cos/format";
import { notFound } from "@/lib/cos/errors";
import type { MoshContext } from "../context";
import { DEFAULT_WEALTH_TARGET, OFFER_TIERS, TIER_LABELS, TIER_WEIGHTS } from "../constants";
import { addMonths, eachMonth, fromIsoDate, monthStart, toIsoDate, today } from "../dates";
import { wealthFlowIndex, type TierRevenue } from "../scoring";
import type { offerMetricSchema, offerSchema } from "../schemas";
import type { z } from "zod";

/**
 * The business module: a three-tier offer ecosystem and the Wealth Flow Index.
 *
 * Metrics are reported one month at a time per offer. Nothing here is
 * estimated — the index is only ever as good as the numbers entered, which is
 * exactly the discipline the module is meant to build.
 */

export type OfferMetricView = {
  month: string;
  revenue: number;
  leads: number;
  conversions: number;
  subscribers: number;
  downloads: number;
  students: number;
  satisfaction: number | null;
  completionRate: number | null;
  clients: number;
  retention: number | null;
  transformation: number | null;
};

export type OfferView = {
  id: string;
  tier: MoshOfferTier;
  tierLabel: string;
  name: string;
  promise: string | null;
  price: number;
  currency: string;
  active: boolean;
  metrics: OfferMetricView[];
  /** Totals across the requested window. */
  totals: {
    revenue: number;
    leads: number;
    conversions: number;
    subscribers: number;
    downloads: number;
    students: number;
    clients: number;
    conversionRate: number | null;
    satisfaction: number | null;
    completionRate: number | null;
    retention: number | null;
    transformation: number | null;
  };
};

export type TierSummary = {
  tier: MoshOfferTier;
  label: string;
  weight: number;
  offers: number;
  revenue: number;
  weightedRevenue: number;
  headcount: number; // leads / students / clients depending on tier
};

export type BusinessView = {
  currency: string;
  months: string[];
  offers: OfferView[];
  tiers: TierSummary[];
  wealth: ReturnType<typeof wealthFlowIndex>;
  /** Wealth Flow Index per month across the window, oldest first. */
  wealthTrend: { month: string; index: number; attraction: number; core: number; premium: number }[];
  currentMonth: string;
};

function averageOf(values: (number | null)[]): number | null {
  const present = values.filter((value): value is number => typeof value === "number");
  if (present.length === 0) return null;
  return Math.round(present.reduce((sum, value) => sum + value, 0) / present.length);
}

function metricView(row: {
  month: Date;
  revenue: unknown;
  leads: number;
  conversions: number;
  subscribers: number;
  downloads: number;
  students: number;
  satisfaction: number | null;
  completionRate: number | null;
  clients: number;
  retention: number | null;
  transformation: number | null;
}): OfferMetricView {
  return {
    month: toIsoDate(row.month),
    revenue: toNumber(row.revenue as never),
    leads: row.leads,
    conversions: row.conversions,
    subscribers: row.subscribers,
    downloads: row.downloads,
    students: row.students,
    satisfaction: row.satisfaction,
    completionRate: row.completionRate,
    clients: row.clients,
    retention: row.retention,
    transformation: row.transformation,
  };
}

/**
 * Load the offer ecosystem with `months` months of reported metrics.
 *
 * The Wealth Flow Index shown is for the most recent complete window month —
 * the current month — measured against the quarter's revenue target where one
 * is set, and DEFAULT_WEALTH_TARGET otherwise.
 */
export async function getBusiness(ctx: MoshContext, months = 12): Promise<BusinessView> {
  const end = monthStart(today());
  const start = addMonths(end, -(months - 1));

  const offers = await prisma.moshOffer.findMany({
    where: { userId: ctx.userId },
    orderBy: [{ tier: "asc" }, { position: "asc" }, { createdAt: "asc" }],
    include: {
      metrics: { where: { month: { gte: start, lte: end } }, orderBy: { month: "asc" } },
    },
  });

  const offerViews: OfferView[] = offers.map((offer) => {
    const metrics = offer.metrics.map(metricView);
    const sum = (pick: (metric: OfferMetricView) => number) =>
      metrics.reduce((total, metric) => total + pick(metric), 0);

    const leads = sum((metric) => metric.leads);
    const conversions = sum((metric) => metric.conversions);

    return {
      id: offer.id,
      tier: offer.tier,
      tierLabel: TIER_LABELS[offer.tier],
      name: offer.name,
      promise: offer.promise,
      price: toNumber(offer.price),
      currency: offer.currency,
      active: offer.active,
      metrics,
      totals: {
        revenue: Math.round(sum((metric) => metric.revenue) * 100) / 100,
        leads,
        conversions,
        subscribers: sum((metric) => metric.subscribers),
        downloads: sum((metric) => metric.downloads),
        students: sum((metric) => metric.students),
        clients: sum((metric) => metric.clients),
        conversionRate: leads > 0 ? Math.round((conversions / leads) * 1000) / 10 : null,
        satisfaction: averageOf(metrics.map((metric) => metric.satisfaction)),
        completionRate: averageOf(metrics.map((metric) => metric.completionRate)),
        retention: averageOf(metrics.map((metric) => metric.retention)),
        transformation: averageOf(metrics.map((metric) => metric.transformation)),
      },
    };
  });

  const window = eachMonth(start, end).map(toIsoDate);

  const wealthTrend = window.map((month) => {
    const revenue = revenueByTier(offerViews, month);
    const result = wealthFlowIndex(revenue);
    return {
      month,
      index: result.index,
      attraction: revenue.ATTRACTION,
      core: revenue.CORE,
      premium: revenue.PREMIUM,
    };
  });

  const currentMonth = toIsoDate(end);
  const currentRevenue = revenueByTier(offerViews, currentMonth);
  const target = await wealthTargetFor(ctx, end);

  const tiers: TierSummary[] = OFFER_TIERS.map((definition) => {
    const tierOffers = offerViews.filter((offer) => offer.tier === definition.tier);
    const revenue = tierOffers.reduce((sum, offer) => sum + offer.totals.revenue, 0);
    const headcount = tierOffers.reduce((sum, offer) => {
      if (definition.tier === "ATTRACTION") return sum + offer.totals.leads;
      if (definition.tier === "CORE") return sum + offer.totals.students;
      return sum + offer.totals.clients;
    }, 0);
    return {
      tier: definition.tier,
      label: TIER_LABELS[definition.tier],
      weight: TIER_WEIGHTS[definition.tier],
      offers: tierOffers.length,
      revenue: Math.round(revenue * 100) / 100,
      weightedRevenue: Math.round(revenue * TIER_WEIGHTS[definition.tier] * 100) / 100,
      headcount,
    };
  });

  return {
    currency: ctx.currency,
    months: window,
    offers: offerViews,
    tiers,
    wealth: wealthFlowIndex(currentRevenue, target),
    wealthTrend,
    currentMonth,
  };
}

function revenueByTier(offers: OfferView[], month: string): TierRevenue {
  const revenue: TierRevenue = { ATTRACTION: 0, CORE: 0, PREMIUM: 0 };
  for (const offer of offers) {
    const metric = offer.metrics.find((entry) => entry.month === month);
    if (metric) revenue[offer.tier] += metric.revenue;
  }
  return {
    ATTRACTION: Math.round(revenue.ATTRACTION * 100) / 100,
    CORE: Math.round(revenue.CORE * 100) / 100,
    PREMIUM: Math.round(revenue.PREMIUM * 100) / 100,
  };
}

/**
 * Monthly Wealth Flow Index target.
 *
 * Derived from the quarter's revenue target when the master plan sets one:
 * a quarter target is three months of revenue, and the index weights revenue
 * by tier, so the monthly index target is the quarterly revenue target (one
 * month's revenue at an average weight of about 3× across the ecosystem).
 */
async function wealthTargetFor(ctx: MoshContext, month: Date): Promise<number> {
  const year = month.getUTCFullYear();
  const quarter = Math.floor(month.getUTCMonth() / 3) + 1;

  const row = await prisma.moshQuarter.findFirst({
    where: { quarter, yearPlan: { userId: ctx.userId, year } },
    select: { revenueTarget: true },
  });

  const target = row?.revenueTarget ? toNumber(row.revenueTarget) : 0;
  return target > 0 ? target : DEFAULT_WEALTH_TARGET;
}

export async function saveOffer(ctx: MoshContext, input: z.infer<typeof offerSchema>) {
  if (input.id) {
    const existing = await prisma.moshOffer.findFirst({
      where: { id: input.id, userId: ctx.userId },
    });
    if (!existing) throw notFound("That offer could not be found.");

    return prisma.moshOffer.update({
      where: { id: input.id },
      data: {
        tier: input.tier,
        name: input.name,
        promise: input.promise,
        price: input.price,
        currency: input.currency,
        active: input.active,
      },
    });
  }

  const count = await prisma.moshOffer.count({ where: { userId: ctx.userId, tier: input.tier } });
  return prisma.moshOffer.create({
    data: {
      userId: ctx.userId,
      tier: input.tier,
      name: input.name,
      promise: input.promise,
      price: input.price,
      currency: input.currency,
      active: input.active,
      position: count,
    },
  });
}

export async function deleteOffer(ctx: MoshContext, id: string) {
  const existing = await prisma.moshOffer.findFirst({ where: { id, userId: ctx.userId } });
  if (!existing) throw notFound("That offer could not be found.");
  await prisma.moshOffer.delete({ where: { id } });
  return { ok: true };
}

export async function saveOfferMetric(
  ctx: MoshContext,
  input: z.infer<typeof offerMetricSchema>
) {
  const offer = await prisma.moshOffer.findFirst({
    where: { id: input.offerId, userId: ctx.userId },
  });
  if (!offer) throw notFound("That offer could not be found.");

  const month = monthStart(fromIsoDate(input.month));
  const data = {
    revenue: input.revenue,
    leads: input.leads,
    conversions: input.conversions,
    subscribers: input.subscribers,
    downloads: input.downloads,
    students: input.students,
    satisfaction: input.satisfaction ?? null,
    completionRate: input.completionRate ?? null,
    clients: input.clients,
    retention: input.retention ?? null,
    transformation: input.transformation ?? null,
  };

  return prisma.moshOfferMetric.upsert({
    where: { offerId_month: { offerId: offer.id, month } },
    create: { offerId: offer.id, month, ...data },
    update: data,
  });
}

/** Wealth Flow Index for one month — used by the dashboard. */
export async function wealthFlowForMonth(ctx: MoshContext, month: Date) {
  const anchor = monthStart(month);
  const rows = await prisma.moshOfferMetric.findMany({
    where: { month: anchor, offer: { userId: ctx.userId } },
    select: { revenue: true, offer: { select: { tier: true } } },
  });

  const revenue: TierRevenue = { ATTRACTION: 0, CORE: 0, PREMIUM: 0 };
  for (const row of rows) revenue[row.offer.tier] += toNumber(row.revenue);

  const target = await wealthTargetFor(ctx, anchor);
  return wealthFlowIndex(revenue, target);
}
