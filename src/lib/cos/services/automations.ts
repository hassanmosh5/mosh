import { prisma } from "@/lib/prisma";
import type { CosContext } from "../tenancy";
import { assertOwned } from "../tenancy";
import { recordAudit } from "../audit";
import { notFound } from "../errors";
import { scoreAutomation, scoreDecision } from "../scoring";
import type { automationCreateSchema, automationUpdateSchema, decisionSchema } from "../schemas";
import type { z } from "zod";

// ---------------------------------------------------------------------------
// Automation opportunities
// ---------------------------------------------------------------------------

export async function listAutomations(ctx: CosContext) {
  const items = await prisma.automation.findMany({
    where: { businessId: ctx.businessId },
    orderBy: [{ score: "desc" }, { updatedAt: "desc" }],
    take: 200,
  });
  return items.map((item) => ({ ...item, analysis: scoreAutomation(item) }));
}

export async function getAutomation(ctx: CosContext, id: string) {
  const item = await prisma.automation.findUnique({ where: { id } });
  if (!item || item.businessId !== ctx.businessId) throw notFound("That automation could not be found.");
  return { ...item, analysis: scoreAutomation(item) };
}

export async function createAutomation(ctx: CosContext, input: z.infer<typeof automationCreateSchema>) {
  const analysis = scoreAutomation(input);
  const automation = await prisma.automation.create({
    data: { businessId: ctx.businessId, ...input, score: analysis.score },
  });
  await recordAudit(ctx, {
    action: "automation.create",
    entityType: "automation",
    entityId: automation.id,
    detail: { name: automation.name, score: analysis.score },
  });
  return { ...automation, analysis };
}

export async function updateAutomation(ctx: CosContext, id: string, input: z.infer<typeof automationUpdateSchema>) {
  const existing = await prisma.automation.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "automation");

  const merged = {
    frequencyPerMonth: input.frequencyPerMonth ?? existing!.frequencyPerMonth,
    minutesPerRun: input.minutesPerRun ?? existing!.minutesPerRun,
    minutesAfter: input.minutesAfter ?? existing!.minutesAfter,
    complexity: input.complexity ?? existing!.complexity,
    businessValue: input.businessValue ?? existing!.businessValue,
  };
  const analysis = scoreAutomation(merged);

  const automation = await prisma.automation.update({
    where: { id },
    data: { ...input, score: analysis.score },
  });
  await recordAudit(ctx, { action: "automation.update", entityType: "automation", entityId: id });
  return { ...automation, analysis };
}

export async function deleteAutomation(ctx: CosContext, id: string) {
  const existing = await prisma.automation.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "automation");
  await prisma.automation.delete({ where: { id } });
  await recordAudit(ctx, { action: "automation.delete", entityType: "automation", entityId: id });
  return { ok: true };
}

/**
 * Detect repetitive work that is a candidate for automation.
 *
 * The signal is real: tasks that recur on a schedule, or whose titles repeat
 * across the history, cost the founder the same minutes over and over. The
 * detector proposes candidates with measured frequency and effort; a human
 * decides whether to log them.
 */
export async function detectAutomationCandidates(ctx: CosContext) {
  const [recurring, completed, existing] = await Promise.all([
    prisma.task.findMany({
      where: { businessId: ctx.businessId, recurrence: { not: "NONE" } },
      select: { title: true, recurrence: true, estimateMins: true, actualMins: true },
      take: 200,
    }),
    prisma.task.findMany({
      where: { businessId: ctx.businessId, status: "COMPLETED" },
      select: { title: true, estimateMins: true, actualMins: true, completedAt: true },
      orderBy: { completedAt: "desc" },
      take: 500,
    }),
    prisma.automation.findMany({
      where: { businessId: ctx.businessId },
      select: { name: true },
    }),
  ]);

  const known = new Set(existing.map((item) => item.name.trim().toLowerCase()));
  const perMonth: Record<string, number> = {
    DAILY: 22, WEEKLY: 4, BIWEEKLY: 2, MONTHLY: 1, QUARTERLY: 1,
  };

  type Candidate = {
    name: string;
    process: string;
    frequencyPerMonth: number;
    minutesPerRun: number;
    minutesAfter: number;
    complexity: number;
    businessValue: number;
    evidence: string;
  };

  const candidates = new Map<string, Candidate>();

  for (const task of recurring) {
    const key = task.title.trim().toLowerCase();
    if (known.has(key) || candidates.has(key)) continue;
    const minutes = task.actualMins ?? task.estimateMins ?? 30;
    candidates.set(key, {
      name: task.title,
      process: `Recurring task "${task.title}" repeats on a ${task.recurrence.toLowerCase()} schedule.`,
      frequencyPerMonth: perMonth[task.recurrence] ?? 1,
      minutesPerRun: minutes,
      minutesAfter: Math.max(2, Math.round(minutes * 0.2)),
      complexity: 2,
      businessValue: 3,
      evidence: `Scheduled recurrence: ${task.recurrence.toLowerCase()}`,
    });
  }

  // Titles that repeat at least three times in recent history.
  const counts = new Map<string, { count: number; minutes: number[]; title: string }>();
  for (const task of completed) {
    const key = task.title.trim().toLowerCase();
    if (!key) continue;
    const entry = counts.get(key) ?? { count: 0, minutes: [], title: task.title };
    entry.count += 1;
    const minutes = task.actualMins ?? task.estimateMins;
    if (minutes) entry.minutes.push(minutes);
    counts.set(key, entry);
  }

  for (const [key, entry] of counts) {
    if (entry.count < 3 || known.has(key) || candidates.has(key)) continue;
    const averageMinutes =
      entry.minutes.length > 0
        ? Math.round(entry.minutes.reduce((a, b) => a + b, 0) / entry.minutes.length)
        : 30;
    candidates.set(key, {
      name: entry.title,
      process: `"${entry.title}" has been completed ${entry.count} times — the same work is being repeated by hand.`,
      frequencyPerMonth: Math.max(1, Math.round(entry.count / 3)),
      minutesPerRun: averageMinutes,
      minutesAfter: Math.max(2, Math.round(averageMinutes * 0.2)),
      complexity: 3,
      businessValue: 3,
      evidence: `${entry.count} completed instances`,
    });
  }

  return [...candidates.values()]
    .map((candidate) => ({ ...candidate, analysis: scoreAutomation(candidate) }))
    .sort((a, b) => b.analysis.score - a.analysis.score)
    .slice(0, 12);
}

// ---------------------------------------------------------------------------
// Decisions
// ---------------------------------------------------------------------------

export async function listDecisions(ctx: CosContext) {
  return prisma.decision.findMany({
    where: { businessId: ctx.businessId },
    orderBy: [{ score: "desc" }, { createdAt: "desc" }],
    take: 100,
  });
}

export async function createDecision(ctx: CosContext, input: z.infer<typeof decisionSchema>) {
  const result = scoreDecision(input);
  const decision = await prisma.decision.create({
    data: {
      businessId: ctx.businessId,
      ...input,
      score: result.score,
      rationale:
        input.rationale ??
        `Drivers: ${result.drivers.join(", ")}. Drags: ${result.drags.join(", ")}. Verdict: ${result.verdict}.`,
    },
  });
  await recordAudit(ctx, {
    action: "decision.create",
    entityType: "decision",
    entityId: decision.id,
    detail: { title: decision.title, score: result.score, verdict: result.verdict },
  });
  return { ...decision, analysis: result };
}

export async function deleteDecision(ctx: CosContext, id: string) {
  const existing = await prisma.decision.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "decision");
  await prisma.decision.delete({ where: { id } });
  await recordAudit(ctx, { action: "decision.delete", entityType: "decision", entityId: id });
  return { ok: true };
}
