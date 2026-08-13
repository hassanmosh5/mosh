import { prisma } from "@/lib/prisma";
import type { ReportKind } from "@/generated/prisma/enums";
import type { CosContext } from "../tenancy";
import { recordAudit } from "../audit";
import { addDays, formatDate, formatMoney, relativeDays, startOfDay } from "../format";
import { getBriefing } from "../dashboard";
import { getAnalytics } from "./analytics";
import { isAiConfigured, getAnthropic, recordAiUsage, resolveEffort, resolveModel, textFromContent, toAiError } from "../ai/client";
import { CHIEF_OF_STAFF_PROMPT } from "../ai/prompts";
import { renderRecords } from "../ai/guard";

const PERIOD_DAYS: Record<ReportKind, number> = {
  DAILY_BRIEFING: 1,
  WEEKLY_EXECUTIVE: 7,
  MONTHLY_BUSINESS: 30,
  QUARTERLY_STRATEGY: 91,
};

const TITLES: Record<ReportKind, string> = {
  DAILY_BRIEFING: "Executive Morning Briefing",
  WEEKLY_EXECUTIVE: "Weekly Executive Report",
  MONTHLY_BUSINESS: "Monthly Business Report",
  QUARTERLY_STRATEGY: "Quarterly Strategy Review",
};

/**
 * Reports are generated from real records in two layers:
 *  1. A deterministic Markdown report assembled from the data. This always
 *     works, with or without an AI key configured.
 *  2. An optional AI narrative layer that interprets the same figures.
 *
 * The figures come from the database either way — the AI never supplies them.
 */
export async function generateReport(
  ctx: CosContext,
  input: { kind: ReportKind; periodStart?: Date | null; periodEnd?: Date | null },
  now = new Date()
) {
  const periodEnd = input.periodEnd ?? now;
  const periodStart = input.periodStart ?? addDays(startOfDay(periodEnd), -PERIOD_DAYS[input.kind]);

  const [briefing, analytics, completed, created, wonDeals] = await Promise.all([
    getBriefing(ctx, now),
    getAnalytics(ctx, now),
    prisma.task.count({
      where: { businessId: ctx.businessId, status: "COMPLETED", completedAt: { gte: periodStart, lte: periodEnd } },
    }),
    prisma.task.count({
      where: { businessId: ctx.businessId, createdAt: { gte: periodStart, lte: periodEnd } },
    }),
    prisma.opportunity.count({
      where: { businessId: ctx.businessId, status: "WON", closedAt: { gte: periodStart, lte: periodEnd } },
    }),
  ]);

  const metrics = {
    period: { start: periodStart.toISOString(), end: periodEnd.toISOString() },
    tasksCompleted: completed,
    tasksCreated: created,
    dealsWon: wonDeals,
    overdueTasks: briefing.snapshot.tasks.overdue,
    blockedTasks: briefing.snapshot.tasks.blocked,
    activeProjects: briefing.snapshot.projects.active,
    projectsAtRisk: briefing.snapshot.projects.atRisk,
    weightedPipeline: briefing.snapshot.crm.weightedPipelineValue,
    monthRevenue: briefing.snapshot.finance.monthRevenue,
    monthExpenses: briefing.snapshot.finance.monthExpenses,
    monthProfit: briefing.snapshot.finance.monthProfit,
    outstandingInvoices: briefing.snapshot.finance.outstandingInvoices,
    conversionRate: analytics.pipeline.totals.conversionRate,
    automationHoursSavedPerMonth: analytics.automation.savedHoursPerMonth,
    aiCostUsdLast30Days: analytics.ai.estimatedCostUsd,
  };

  const deterministic = buildMarkdown(ctx, input.kind, metrics, briefing, analytics, periodStart, periodEnd);

  let body = deterministic;
  let aiGenerated = false;

  if (isAiConfigured()) {
    try {
      body = await narrate(ctx, input.kind, deterministic, metrics);
      aiGenerated = true;
    } catch (error) {
      // A failed narrative must not lose the report — fall back to the
      // deterministic version and note why.
      console.error("[m-cos] report narration failed", error);
      body = `${deterministic}\n\n> The AI narrative layer was unavailable for this run; the figures above are from the database.`;
    }
  }

  const report = await prisma.report.create({
    data: {
      businessId: ctx.businessId,
      createdById: ctx.userId,
      kind: input.kind,
      title: `${TITLES[input.kind]} — ${formatDate(periodEnd)}`,
      periodStart,
      periodEnd,
      metrics: metrics as never,
      body,
      aiGenerated,
    },
  });

  await recordAudit(ctx, {
    action: "report.generate",
    entityType: "report",
    entityId: report.id,
    detail: { kind: input.kind, aiGenerated },
  });

  return report;
}

function buildMarkdown(
  ctx: CosContext,
  kind: ReportKind,
  metrics: Record<string, unknown>,
  briefing: Awaited<ReturnType<typeof getBriefing>>,
  analytics: Awaited<ReturnType<typeof getAnalytics>>,
  periodStart: Date,
  periodEnd: Date
): string {
  const money = (value: number) => formatMoney(value, ctx.currency);
  const lines: string[] = [];

  lines.push(`# ${TITLES[kind]}`);
  lines.push(`_${formatDate(periodStart)} → ${formatDate(periodEnd)} · ${ctx.businessName}_`);
  lines.push("");

  lines.push("## Performance");
  lines.push(`- Tasks completed: **${metrics.tasksCompleted}** (created: ${metrics.tasksCreated})`);
  lines.push(`- Deals won in period: **${metrics.dealsWon}**`);
  lines.push(`- Active projects: **${metrics.activeProjects}** (${metrics.projectsAtRisk} needing attention)`);
  lines.push(`- Month to date: revenue ${money(Number(metrics.monthRevenue))}, expenses ${money(Number(metrics.monthExpenses))}, profit **${money(Number(metrics.monthProfit))}**`);
  lines.push(`- Weighted pipeline: **${money(Number(metrics.weightedPipeline))}** · conversion rate ${metrics.conversionRate}%`);
  lines.push("");

  lines.push("## Problems");
  if (briefing.urgent.length === 0 && briefing.projectsNeedingAttention.length === 0) {
    lines.push("- Nothing urgent is outstanding.");
  } else {
    for (const item of briefing.urgent.slice(0, 5)) {
      lines.push(`- **Urgent:** ${item.task.title} — ${item.reasons.join(", ")}`);
    }
    for (const project of briefing.projectsNeedingAttention.slice(0, 5)) {
      lines.push(`- **${project.health} project:** ${project.name} (${project.completion}% complete, ${relativeDays(project.deadline)}) — ${project.healthNote ?? "no note"}`);
    }
  }
  if (Number(metrics.outstandingInvoices) > 0) {
    lines.push(`- **Cash:** ${money(Number(metrics.outstandingInvoices))} outstanding on unpaid invoices.`);
  }
  lines.push("");

  lines.push("## Opportunities");
  if (briefing.followUps.length > 0) {
    for (const lead of briefing.followUps.slice(0, 5)) {
      lines.push(`- Follow up with **${lead.name}**${lead.company ? ` (${lead.company})` : ""} — ${lead.nextAction ?? "no next action recorded"} · ${relativeDays(lead.followUpAt)}`);
    }
  } else {
    lines.push("- No follow-ups are due.");
  }
  if (analytics.automation.potentialHoursPerMonth > 0) {
    lines.push(`- Automating the logged candidates would free **${analytics.automation.potentialHoursPerMonth}h/month**.`);
  }
  lines.push("");

  lines.push("## Risks");
  if (briefing.risks.length === 0) {
    lines.push("- No open project risks recorded.");
  } else {
    for (const risk of briefing.risks.slice(0, 6)) {
      lines.push(`- **${risk.severity}** on ${risk.project.name}: ${risk.title}`);
    }
  }
  const behindGoals = briefing.snapshot.goals.filter((goal) => goal.atRisk);
  for (const goal of behindGoals) {
    lines.push(`- Goal behind pace: **${goal.title}** at ${goal.progress}% (expected ${goal.expectedPct}%).`);
  }
  lines.push("");

  lines.push("## Recommendations");
  for (const item of briefing.topPriorities.slice(0, 5)) {
    lines.push(`- ${item.task.title} — ${item.classification.replace("_", " ").toLowerCase()} (${item.reasons.join(", ")})`);
  }
  if (briefing.delegatable.length > 0) {
    lines.push(`- Delegate: ${briefing.delegatable.map((item) => item.task.title).join("; ")}`);
  }
  if (briefing.automatable.length > 0) {
    lines.push(`- Automate: ${briefing.automatable.map((item) => item.task.title).join("; ")}`);
  }
  lines.push("");

  lines.push("## Next actions");
  briefing.topPriorities.slice(0, 5).forEach((item, index) => {
    lines.push(`${index + 1}. ${item.task.title}`);
  });
  lines.push("");
  lines.push(`_Figures are REPORTED and CALCULATED data from the M-CoS database. This is an operational summary, not accounting or tax advice._`);

  return lines.join("\n");
}

async function narrate(
  ctx: CosContext,
  kind: ReportKind,
  deterministic: string,
  metrics: Record<string, unknown>
): Promise<string> {
  const anthropic = getAnthropic();
  const model = resolveModel();
  const data = renderRecords("report-metrics", metrics);

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: 8_000,
      system: `${CHIEF_OF_STAFF_PROMPT}

You are writing the ${TITLES[kind]}. You have been given a report that was assembled directly from the database. Rewrite it as an executive report the founder can act on.

Rules:
- Keep every number exactly as given. Never introduce a figure that is not in the data.
- Keep the section order: Performance, Problems, Opportunities, Risks, Recommendations, Next actions.
- Add interpretation, not padding: what the numbers mean, what is causing them, what to do.
- Be direct about bad news.
- Output Markdown only.`,
      thinking: { type: "adaptive" },
      output_config: { effort: resolveEffort() },
      messages: [
        {
          role: "user",
          content: `Database-assembled report:\n\n${deterministic}\n\nRaw metrics:\n${data.text}`,
        },
      ],
    });

    await recordAiUsage(ctx, { model, purpose: "report_narrative", usage: response.usage });
    const text = textFromContent(response.content);
    return text || deterministic;
  } catch (error) {
    throw toAiError(error);
  }
}

export async function listReports(ctx: CosContext) {
  return prisma.report.findMany({
    where: { businessId: ctx.businessId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true, kind: true, title: true, periodStart: true, periodEnd: true,
      aiGenerated: true, createdAt: true,
    },
  });
}

export async function getReport(ctx: CosContext, id: string) {
  const report = await prisma.report.findUnique({ where: { id } });
  if (!report || report.businessId !== ctx.businessId) return null;
  return report;
}
