import { prisma } from "@/lib/prisma";
import { NotificationKind, NotificationSeverity } from "@/generated/prisma/enums";
import type { CosContext } from "./tenancy";
import { addDays, formatDate, startOfDay, toNumber } from "./format";

type Draft = {
  kind: NotificationKind;
  severity: NotificationSeverity;
  title: string;
  body?: string;
  entityType?: string;
  entityId?: string;
  dedupeKey: string;
};

/**
 * Derive notifications from the current state of the business.
 *
 * Notifications are *derived*, not pushed: running this repeatedly is safe
 * because each candidate carries a stable `dedupeKey`, so the founder never
 * sees the same alert twice for the same underlying fact.
 */
export async function refreshNotifications(ctx: CosContext, now = new Date()): Promise<number> {
  const businessId = ctx.businessId;
  const today = startOfDay(now);
  const in3 = addDays(today, 3);
  const staleCutoff = addDays(today, -14);
  const drafts: Draft[] = [];

  const [overdueTasks, deadlines, staleLeads, followUps, risks, invoices, weakProducts, automations] =
    await Promise.all([
      prisma.task.findMany({
        where: { businessId, status: { notIn: ["COMPLETED", "CANCELLED"] }, dueDate: { lt: today } },
        select: { id: true, title: true, dueDate: true, priority: true },
        take: 40,
      }),
      prisma.project.findMany({
        where: {
          businessId,
          status: { notIn: ["COMPLETED", "CANCELLED"] },
          deadline: { gte: today, lte: in3 },
        },
        select: { id: true, name: true, deadline: true, completion: true },
        take: 20,
      }),
      prisma.lead.findMany({
        where: {
          businessId,
          stage: { notIn: ["WON", "LOST"] },
          OR: [{ lastContactedAt: { lt: staleCutoff } }, { lastContactedAt: null }],
        },
        select: { id: true, name: true, company: true, lastContactedAt: true },
        take: 20,
      }),
      prisma.lead.findMany({
        where: { businessId, stage: { notIn: ["WON", "LOST"] }, followUpAt: { lte: today } },
        select: { id: true, name: true, followUpAt: true, nextAction: true },
        take: 20,
      }),
      prisma.projectRisk.findMany({
        where: {
          resolvedAt: null,
          severity: { in: ["HIGH", "CRITICAL"] },
          project: { businessId, status: { notIn: ["COMPLETED", "CANCELLED"] } },
        },
        select: { id: true, title: true, severity: true, project: { select: { id: true, name: true } } },
        take: 20,
      }),
      prisma.invoice.findMany({
        where: { businessId, status: { in: ["SENT", "PARTIAL", "OVERDUE"] }, dueAt: { lt: today } },
        select: { id: true, number: true, amount: true, amountPaid: true, dueAt: true },
        take: 20,
      }),
      prisma.product.findMany({
        where: { businessId, stage: { in: ["LAUNCH", "OPTIMIZATION", "SCALE"] }, unitsSold: { lt: 5 } },
        select: { id: true, name: true, unitsSold: true, stage: true },
        take: 10,
      }),
      prisma.automation.findMany({
        where: { businessId, status: "IDENTIFIED", score: { gte: 66 } },
        select: { id: true, name: true, score: true },
        take: 10,
      }),
    ]);

  for (const task of overdueTasks) {
    drafts.push({
      kind: NotificationKind.TASK_OVERDUE,
      severity: task.priority === "CRITICAL" ? NotificationSeverity.CRITICAL : NotificationSeverity.WARNING,
      title: `Overdue: ${task.title}`,
      body: `Was due ${formatDate(task.dueDate)}.`,
      entityType: "task",
      entityId: task.id,
      dedupeKey: `task-overdue:${task.id}:${task.dueDate?.toISOString().slice(0, 10)}`,
    });
  }

  for (const project of deadlines) {
    drafts.push({
      kind: NotificationKind.DEADLINE_APPROACHING,
      severity: project.completion < 70 ? NotificationSeverity.CRITICAL : NotificationSeverity.WARNING,
      title: `${project.name} is due ${formatDate(project.deadline)}`,
      body: `${project.completion}% complete.`,
      entityType: "project",
      entityId: project.id,
      dedupeKey: `project-deadline:${project.id}:${project.deadline?.toISOString().slice(0, 10)}`,
    });
  }

  for (const lead of staleLeads) {
    drafts.push({
      kind: NotificationKind.LEAD_INACTIVE,
      severity: NotificationSeverity.WARNING,
      title: `No contact with ${lead.name}${lead.company ? ` (${lead.company})` : ""} in 14+ days`,
      body: lead.lastContactedAt ? `Last contacted ${formatDate(lead.lastContactedAt)}.` : "Never contacted.",
      entityType: "lead",
      entityId: lead.id,
      dedupeKey: `lead-stale:${lead.id}:${today.toISOString().slice(0, 10)}`,
    });
  }

  for (const lead of followUps) {
    drafts.push({
      kind: NotificationKind.CLIENT_FOLLOW_UP,
      severity: NotificationSeverity.INFO,
      title: `Follow up with ${lead.name}`,
      body: lead.nextAction ?? `Follow-up was set for ${formatDate(lead.followUpAt)}.`,
      entityType: "lead",
      entityId: lead.id,
      dedupeKey: `lead-followup:${lead.id}:${lead.followUpAt?.toISOString().slice(0, 10)}`,
    });
  }

  for (const risk of risks) {
    drafts.push({
      kind: NotificationKind.PROJECT_RISK,
      severity: risk.severity === "CRITICAL" ? NotificationSeverity.CRITICAL : NotificationSeverity.WARNING,
      title: `${risk.severity} risk on ${risk.project.name}`,
      body: risk.title,
      entityType: "project",
      entityId: risk.project.id,
      dedupeKey: `risk:${risk.id}`,
    });
  }

  for (const invoice of invoices) {
    const outstanding = toNumber(invoice.amount) - toNumber(invoice.amountPaid);
    drafts.push({
      kind: NotificationKind.INVOICE_OVERDUE,
      severity: NotificationSeverity.WARNING,
      title: `Invoice ${invoice.number} is overdue`,
      body: `${outstanding.toFixed(2)} outstanding, due ${formatDate(invoice.dueAt)}.`,
      entityType: "invoice",
      entityId: invoice.id,
      dedupeKey: `invoice-overdue:${invoice.id}:${invoice.dueAt?.toISOString().slice(0, 10)}`,
    });
  }

  for (const product of weakProducts) {
    drafts.push({
      kind: NotificationKind.PRODUCT_UNDERPERFORMING,
      severity: NotificationSeverity.INFO,
      title: `${product.name} has only ${product.unitsSold} sales`,
      body: `It is in the ${product.stage.toLowerCase()} stage — review the offer or the traffic source.`,
      entityType: "product",
      entityId: product.id,
      dedupeKey: `product-weak:${product.id}:${today.toISOString().slice(0, 7)}`,
    });
  }

  for (const automation of automations) {
    drafts.push({
      kind: NotificationKind.AUTOMATION_OPPORTUNITY,
      severity: NotificationSeverity.INFO,
      title: `High-value automation: ${automation.name}`,
      body: `Opportunity score ${automation.score}/100.`,
      entityType: "automation",
      entityId: automation.id,
      dedupeKey: `automation:${automation.id}`,
    });
  }

  if (drafts.length === 0) return 0;

  const result = await prisma.notification.createMany({
    data: drafts.map((draft) => ({ ...draft, businessId })),
    skipDuplicates: true,
  });

  return result.count;
}
