import { prisma } from "@/lib/prisma";
import type { CosContext } from "../tenancy";
import { assertOwned } from "../tenancy";
import { recordAudit } from "../audit";
import { notFound } from "../errors";
import { toNumber } from "../format";
import { goalProgress, goalRisk } from "../scoring";
import type { goalCreateSchema, goalUpdateSchema } from "../schemas";
import type { z } from "zod";

export const HORIZON_ORDER = ["ANNUAL", "QUARTERLY", "MONTHLY", "WEEKLY", "DAILY"] as const;

/** Goals with computed progress and pace risk — the shape used by the UI and AI. */
export async function listGoals(ctx: CosContext, now = new Date()) {
  const goals = await prisma.goal.findMany({
    where: { businessId: ctx.businessId },
    orderBy: [{ horizon: "asc" }, { deadline: "asc" }, { createdAt: "desc" }],
    include: {
      owner: { select: { id: true, name: true } },
      children: { select: { id: true, title: true, status: true } },
      _count: { select: { tasks: true } },
    },
    take: 200,
  });

  return goals.map((goal) => {
    const current = toNumber(goal.currentValue);
    const target = goal.targetValue === null ? null : toNumber(goal.targetValue);
    const progress = goalProgress(current, target);
    const risk = goalRisk(progress, goal.startDate, goal.deadline, now);
    return {
      ...goal,
      current,
      target,
      progress,
      atRisk: risk?.atRisk ?? false,
      expectedPct: risk?.expectedPct ?? null,
    };
  });
}

export async function getGoal(ctx: CosContext, id: string) {
  const goal = await prisma.goal.findUnique({
    where: { id },
    include: {
      tasks: { orderBy: [{ status: "asc" }, { dueDate: "asc" }] },
      children: true,
      parent: { select: { id: true, title: true } },
      owner: { select: { id: true, name: true } },
    },
  });
  if (!goal || goal.businessId !== ctx.businessId) throw notFound("That goal could not be found.");
  return goal;
}

export async function createGoal(ctx: CosContext, input: z.infer<typeof goalCreateSchema>) {
  if (input.parentId) {
    const parent = await prisma.goal.findUnique({ where: { id: input.parentId } });
    await assertOwned(parent, ctx, "parent goal");
  }
  const goal = await prisma.goal.create({
    data: {
      businessId: ctx.businessId,
      ...input,
      currentValue: input.currentValue ?? 0,
      ownerId: input.ownerId ?? ctx.userId,
    },
  });
  await recordAudit(ctx, { action: "goal.create", entityType: "goal", entityId: goal.id, detail: { title: goal.title } });
  return goal;
}

export async function updateGoal(ctx: CosContext, id: string, input: z.infer<typeof goalUpdateSchema>) {
  const existing = await prisma.goal.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "goal");
  if (input.parentId === id) throw notFound("A goal cannot be its own parent.");
  const goal = await prisma.goal.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.horizon !== undefined ? { horizon: input.horizon } : {}),
      ...(input.parentId !== undefined ? { parentId: input.parentId || null } : {}),
      ...(input.ownerId !== undefined ? { ownerId: input.ownerId || null } : {}),
      ...(input.kpi !== undefined ? { kpi: input.kpi } : {}),
      ...(input.targetValue !== undefined ? { targetValue: input.targetValue } : {}),
      ...(input.currentValue !== undefined ? { currentValue: input.currentValue ?? 0 } : {}),
      ...(input.unit !== undefined ? { unit: input.unit } : {}),
      ...(input.startDate !== undefined ? { startDate: input.startDate } : {}),
      ...(input.deadline !== undefined ? { deadline: input.deadline } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
    },
  });
  await recordAudit(ctx, { action: "goal.update", entityType: "goal", entityId: id, detail: { fields: Object.keys(input) } });
  return goal;
}

export async function deleteGoal(ctx: CosContext, id: string) {
  const existing = await prisma.goal.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "goal");
  await prisma.goal.delete({ where: { id } });
  await recordAudit(ctx, { action: "goal.delete", entityType: "goal", entityId: id });
  return { ok: true };
}
