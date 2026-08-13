import { prisma } from "@/lib/prisma";
import type { CosContext } from "../tenancy";
import { addDays, startOfDay, toNumber } from "../format";
import { scoreAutomation } from "../scoring";
import { getFinancialSummary } from "./finance";
import { getPipeline } from "./crm";

/**
 * Business analytics.
 *
 * Every figure here is derived from stored records. Anything the AI estimates
 * is stored separately with `origin: AI_ESTIMATE` and is never mixed into these
 * totals (see the FinanceEntry model).
 */
export async function getAnalytics(ctx: CosContext, now = new Date()) {
  const businessId = ctx.businessId;
  const since90 = addDays(startOfDay(now), -90);
  const since30 = addDays(startOfDay(now), -30);

  const [
    finance,
    pipeline,
    leadCount,
    newClients,
    products,
    contentProduced,
    contentPerformance,
    projectStats,
    taskStats,
    automations,
    aiUsage,
    agentUsage,
  ] = await Promise.all([
    getFinancialSummary(ctx, 6, now),
    getPipeline(ctx),
    prisma.lead.count({ where: { businessId, createdAt: { gte: since90 } } }),
    prisma.client.count({ where: { businessId, createdAt: { gte: since90 } } }),
    prisma.product.findMany({
      where: { businessId },
      select: { id: true, name: true, unitsSold: true, revenue: true, stage: true, price: true },
      orderBy: { revenue: "desc" },
      take: 10,
    }),
    prisma.contentItem.groupBy({
      by: ["status"],
      where: { businessId },
      _count: true,
    }),
    prisma.contentItem.findMany({
      where: { businessId, status: "PUBLISHED" },
      select: { id: true, title: true, platform: true, views: true, engagements: true, conversions: true },
      orderBy: { views: "desc" },
      take: 8,
    }),
    prisma.project.groupBy({ by: ["status"], where: { businessId }, _count: true }),
    prisma.task.groupBy({ by: ["status"], where: { businessId }, _count: true }),
    prisma.automation.findMany({
      where: { businessId },
      select: {
        id: true, name: true, status: true, score: true,
        frequencyPerMonth: true, minutesPerRun: true, minutesAfter: true,
        complexity: true, businessValue: true,
      },
    }),
    prisma.aiUsage.aggregate({
      where: { businessId, createdAt: { gte: since30 } },
      _sum: { inputTokens: true, outputTokens: true, estimatedCost: true },
      _count: true,
    }),
    prisma.aiUsage.groupBy({
      by: ["agentKey"],
      where: { businessId, createdAt: { gte: since30 } },
      _sum: { estimatedCost: true, inputTokens: true, outputTokens: true },
      _count: true,
    }),
  ]);

  const totalTasks = taskStats.reduce((total, row) => total + row._count, 0);
  const completedTasks = taskStats.find((row) => row.status === "COMPLETED")?._count ?? 0;
  const totalProjects = projectStats.reduce((total, row) => total + row._count, 0);
  const completedProjects = projectStats.find((row) => row.status === "COMPLETED")?._count ?? 0;

  const liveAutomations = automations.filter((item) => item.status === "LIVE");
  const savedHoursPerMonth = liveAutomations.reduce(
    (total, item) => total + scoreAutomation(item).monthlyHoursSaved,
    0
  );
  const potentialHoursPerMonth = automations
    .filter((item) => item.status !== "LIVE" && item.status !== "REJECTED")
    .reduce((total, item) => total + scoreAutomation(item).monthlyHoursSaved, 0);

  return {
    currency: ctx.currency,
    finance,
    pipeline,
    acquisition: {
      leadsLast90Days: leadCount,
      clientsLast90Days: newClients,
      conversionRate: pipeline.totals.conversionRate,
      averageDealValue: pipeline.totals.averageDealValue,
    },
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      unitsSold: product.unitsSold,
      revenue: toNumber(product.revenue),
      price: toNumber(product.price),
      stage: product.stage,
    })),
    content: {
      byStatus: contentProduced.map((row) => ({ status: row.status, count: row._count })),
      topPerforming: contentPerformance,
    },
    delivery: {
      projectsByStatus: projectStats.map((row) => ({ status: row.status, count: row._count })),
      tasksByStatus: taskStats.map((row) => ({ status: row.status, count: row._count })),
      taskCompletionRate: totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100),
      projectCompletionRate: totalProjects === 0 ? 0 : Math.round((completedProjects / totalProjects) * 100),
    },
    automation: {
      live: liveAutomations.length,
      candidates: automations.length - liveAutomations.length,
      savedHoursPerMonth: Math.round(savedHoursPerMonth * 10) / 10,
      potentialHoursPerMonth: Math.round(potentialHoursPerMonth * 10) / 10,
    },
    ai: {
      requestsLast30Days: aiUsage._count,
      inputTokens: aiUsage._sum.inputTokens ?? 0,
      outputTokens: aiUsage._sum.outputTokens ?? 0,
      estimatedCostUsd: toNumber(aiUsage._sum.estimatedCost),
      byAgent: agentUsage
        .map((row) => ({
          agentKey: row.agentKey ?? "chief-of-staff",
          requests: row._count,
          estimatedCostUsd: toNumber(row._sum.estimatedCost),
          inputTokens: row._sum.inputTokens ?? 0,
          outputTokens: row._sum.outputTokens ?? 0,
        }))
        .sort((a, b) => b.estimatedCostUsd - a.estimatedCostUsd),
    },
  };
}
