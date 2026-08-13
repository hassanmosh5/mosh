import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { CosContext } from "./tenancy";
import { addDays, endOfDay, startOfDay, toNumber } from "./format";
import {
  goalProgress,
  goalRisk,
  prioritiseTasks,
  weightedPipeline,
  type PrioritisableTask,
  type ScoredTask,
} from "./scoring";

export type ExecutiveSnapshot = Awaited<ReturnType<typeof getExecutiveSnapshot>>;

/**
 * One pass over the operational tables, shaped for the executive dashboard,
 * the morning briefing, the report generator and the AI context builder.
 *
 * It queries counts and small top-N slices rather than loading whole tables —
 * the AI must never receive the entire database (see PERFORMANCE in
 * ARCHITECTURE.md).
 */
export async function getExecutiveSnapshot(ctx: CosContext, now = new Date()) {
  const businessId = ctx.businessId;
  const today = startOfDay(now);
  const todayEnd = endOfDay(now);
  const in7 = addDays(today, 7);
  const in14 = addDays(today, 14);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const staleLeadCutoff = addDays(today, -14);

  const openTaskWhere: Prisma.TaskWhereInput = {
    businessId,
    status: { notIn: ["COMPLETED", "CANCELLED"] },
  };

  const [
    openTasks,
    overdueTasks,
    dueTodayTasks,
    blockedTasks,
    completedThisWeek,
    activeProjects,
    projectsAtRisk,
    upcomingDeadlines,
    leadsOpen,
    staleLeads,
    followUpsDue,
    clientsActive,
    openOpportunities,
    monthRevenue,
    monthExpenses,
    outstandingInvoices,
    productsLive,
    contentScheduled,
    contentOverdue,
    automationCandidates,
    agentRuns7d,
    notifications,
    activeGoals,
  ] = await Promise.all([
    prisma.task.count({ where: openTaskWhere }),
    prisma.task.count({ where: { ...openTaskWhere, dueDate: { lt: today } } }),
    prisma.task.count({ where: { ...openTaskWhere, dueDate: { gte: today, lte: todayEnd } } }),
    prisma.task.count({ where: { businessId, status: "BLOCKED" } }),
    prisma.task.count({
      where: { businessId, status: "COMPLETED", completedAt: { gte: addDays(today, -7) } },
    }),
    prisma.project.count({ where: { businessId, status: { in: ["ACTIVE", "REVIEW"] } } }),
    prisma.project.count({
      where: { businessId, status: { notIn: ["COMPLETED", "CANCELLED"] }, health: { in: ["YELLOW", "RED"] } },
    }),
    prisma.project.findMany({
      where: {
        businessId,
        status: { notIn: ["COMPLETED", "CANCELLED"] },
        deadline: { not: null, lte: in14 },
      },
      orderBy: { deadline: "asc" },
      take: 6,
      select: { id: true, name: true, deadline: true, health: true, completion: true },
    }),
    prisma.lead.count({ where: { businessId, stage: { notIn: ["WON", "LOST"] } } }),
    prisma.lead.count({
      where: {
        businessId,
        stage: { notIn: ["WON", "LOST"] },
        OR: [{ lastContactedAt: { lt: staleLeadCutoff } }, { lastContactedAt: null }],
      },
    }),
    prisma.lead.findMany({
      where: { businessId, stage: { notIn: ["WON", "LOST"] }, followUpAt: { lte: in7 } },
      orderBy: { followUpAt: "asc" },
      take: 6,
      select: { id: true, name: true, company: true, followUpAt: true, stage: true, nextAction: true },
    }),
    prisma.client.count({ where: { businessId, status: "ACTIVE" } }),
    prisma.opportunity.findMany({
      where: { businessId, status: "OPEN" },
      select: { id: true, title: true, value: true, probability: true, stage: true, expectedCloseAt: true },
    }),
    prisma.financeEntry.aggregate({
      where: { businessId, kind: "REVENUE", occurredAt: { gte: monthStart } },
      _sum: { amount: true },
    }),
    prisma.financeEntry.aggregate({
      where: { businessId, kind: "EXPENSE", occurredAt: { gte: monthStart } },
      _sum: { amount: true },
    }),
    prisma.invoice.aggregate({
      where: { businessId, status: { in: ["SENT", "PARTIAL", "OVERDUE"] } },
      _sum: { amount: true, amountPaid: true },
      _count: true,
    }),
    prisma.product.count({ where: { businessId, stage: { in: ["LAUNCH", "OPTIMIZATION", "SCALE"] } } }),
    prisma.contentItem.count({
      where: { businessId, status: { in: ["SCHEDULED", "PRODUCTION", "REVIEW"] } },
    }),
    prisma.contentItem.count({
      where: { businessId, status: { notIn: ["PUBLISHED", "REPURPOSE"] }, publishAt: { lt: today } },
    }),
    prisma.automation.findMany({
      where: { businessId, status: { in: ["IDENTIFIED", "EVALUATING", "APPROVED"] } },
      orderBy: { score: "desc" },
      take: 4,
      select: { id: true, name: true, score: true, status: true, minutesPerRun: true, frequencyPerMonth: true, minutesAfter: true },
    }),
    prisma.agentExecution.count({ where: { businessId, startedAt: { gte: addDays(today, -7) } } }),
    prisma.notification.findMany({
      where: { businessId, readAt: null },
      orderBy: [{ severity: "desc" }, { createdAt: "desc" }],
      take: 6,
      select: { id: true, kind: true, severity: true, title: true, body: true, createdAt: true },
    }),
    prisma.goal.findMany({
      where: { businessId, status: { in: ["ACTIVE", "AT_RISK"] } },
      orderBy: [{ horizon: "asc" }, { deadline: "asc" }],
      take: 8,
      select: {
        id: true, title: true, horizon: true, kpi: true, unit: true,
        targetValue: true, currentValue: true, startDate: true, deadline: true, status: true,
      },
    }),
  ]);

  const revenue = toNumber(monthRevenue._sum.amount);
  const expenses = toNumber(monthExpenses._sum.amount);
  const invoicedOutstanding =
    toNumber(outstandingInvoices._sum.amount) - toNumber(outstandingInvoices._sum.amountPaid);

  const pipelineValue = openOpportunities.reduce((total, o) => total + toNumber(o.value), 0);
  const weighted = weightedPipeline(
    openOpportunities.map((o) => ({
      value: toNumber(o.value),
      probability: o.probability,
      stage: o.stage,
    }))
  );

  const goals = activeGoals.map((goal) => {
    const current = toNumber(goal.currentValue);
    const target = goal.targetValue === null ? null : toNumber(goal.targetValue);
    const progress = goalProgress(current, target);
    const risk = goalRisk(progress, goal.startDate, goal.deadline, now);
    return { ...goal, current, target, progress, atRisk: risk?.atRisk ?? false, expectedPct: risk?.expectedPct ?? null };
  });

  return {
    generatedAt: now,
    currency: ctx.currency,
    tasks: {
      open: openTasks,
      overdue: overdueTasks,
      dueToday: dueTodayTasks,
      blocked: blockedTasks,
      completedLast7Days: completedThisWeek,
    },
    projects: {
      active: activeProjects,
      atRisk: projectsAtRisk,
      upcomingDeadlines,
    },
    crm: {
      openLeads: leadsOpen,
      staleLeads,
      activeClients: clientsActive,
      followUpsDue,
      pipelineValue,
      weightedPipelineValue: weighted,
      openOpportunities: openOpportunities.length,
    },
    finance: {
      monthRevenue: revenue,
      monthExpenses: expenses,
      monthProfit: revenue - expenses,
      outstandingInvoices: invoicedOutstanding,
      outstandingInvoiceCount: outstandingInvoices._count,
    },
    products: { live: productsLive },
    content: { scheduled: contentScheduled, overdue: contentOverdue },
    automations: automationCandidates,
    ai: { executionsLast7Days: agentRuns7d },
    notifications,
    goals,
  };
}

export type BriefingPayload = Awaited<ReturnType<typeof getBriefing>>;

/**
 * The Executive Morning Briefing.
 *
 * Everything here is computed from records — the AI narrates it, it does not
 * fabricate it. `classification` comes from the deterministic task scorer so
 * URGENT / AUTOMATABLE / DELEGATABLE labels are reproducible.
 */
export async function getBriefing(ctx: CosContext, now = new Date()) {
  const businessId = ctx.businessId;
  const today = startOfDay(now);
  const horizon = addDays(today, 10);

  const [rawTasks, risks, projects, followUps, overdueInvoices, snapshot] = await Promise.all([
    prisma.task.findMany({
      where: {
        businessId,
        status: { notIn: ["COMPLETED", "CANCELLED"] },
        OR: [
          { dueDate: { lte: horizon } },
          { priority: { in: ["CRITICAL", "HIGH"] } },
          { status: "BLOCKED" },
        ],
      },
      orderBy: [{ dueDate: "asc" }],
      take: 120,
      select: {
        id: true, title: true, priority: true, status: true, dueDate: true,
        estimateMins: true, clientId: true, projectId: true, goalId: true, tags: true,
        project: { select: { name: true } },
        client: { select: { name: true } },
      },
    }),
    prisma.projectRisk.findMany({
      where: { resolvedAt: null, project: { businessId, status: { notIn: ["COMPLETED", "CANCELLED"] } } },
      orderBy: { severity: "desc" },
      take: 8,
      select: { id: true, title: true, severity: true, project: { select: { id: true, name: true } } },
    }),
    prisma.project.findMany({
      where: { businessId, status: { notIn: ["COMPLETED", "CANCELLED"] }, health: { in: ["YELLOW", "RED"] } },
      orderBy: [{ health: "desc" }, { deadline: "asc" }],
      take: 6,
      select: { id: true, name: true, health: true, healthNote: true, deadline: true, completion: true },
    }),
    prisma.lead.findMany({
      where: { businessId, stage: { notIn: ["WON", "LOST"] }, followUpAt: { lte: addDays(today, 3) } },
      orderBy: { followUpAt: "asc" },
      take: 8,
      select: { id: true, name: true, company: true, stage: true, followUpAt: true, estimatedValue: true, nextAction: true },
    }),
    prisma.invoice.findMany({
      where: { businessId, status: { in: ["SENT", "PARTIAL", "OVERDUE"] }, dueAt: { lt: today } },
      orderBy: { dueAt: "asc" },
      take: 6,
      select: { id: true, number: true, amount: true, amountPaid: true, dueAt: true, client: { select: { name: true } } },
    }),
    getExecutiveSnapshot(ctx, now),
  ]);

  const scored: ScoredTask[] = prioritiseTasks(
    rawTasks.map<PrioritisableTask>((task) => ({
      id: task.id,
      title: task.title,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      estimateMins: task.estimateMins,
      clientId: task.clientId,
      projectId: task.projectId,
      goalId: task.goalId,
      tags: task.tags,
    })),
    now
  );

  const byId = new Map(rawTasks.map((task) => [task.id, task]));
  const decorate = (item: ScoredTask) => ({
    ...item,
    context: byId.get(item.task.id),
  });

  return {
    generatedAt: now,
    snapshot,
    topPriorities: scored.slice(0, 6).map(decorate),
    urgent: scored.filter((t) => t.classification === "URGENT").slice(0, 8).map(decorate),
    delegatable: scored.filter((t) => t.classification === "DELEGATABLE").slice(0, 6).map(decorate),
    automatable: scored.filter((t) => t.classification === "AUTOMATABLE").slice(0, 6).map(decorate),
    lowValue: scored.filter((t) => t.classification === "LOW_VALUE").slice(0, 6).map(decorate),
    risks,
    projectsNeedingAttention: projects,
    followUps: followUps.map((lead) => ({ ...lead, estimatedValue: toNumber(lead.estimatedValue) })),
    overdueInvoices: overdueInvoices.map((invoice) => ({
      ...invoice,
      outstanding: toNumber(invoice.amount) - toNumber(invoice.amountPaid),
    })),
  };
}
