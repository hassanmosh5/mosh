import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { TaskOrigin } from "@/generated/prisma/enums";
import type { CosContext } from "../tenancy";
import { assertOwned } from "../tenancy";
import { recordAudit } from "../audit";
import { AppError, notFound } from "../errors";
import { addDays, startOfDay } from "../format";
import { recomputeProjectHealth } from "./projects";
import type { taskCreateSchema, taskQuerySchema, taskUpdateSchema } from "../schemas";
import type { z } from "zod";

type CreateInput = z.infer<typeof taskCreateSchema>;
type UpdateInput = z.infer<typeof taskUpdateSchema>;
type QueryInput = z.infer<typeof taskQuerySchema>;

const TASK_INCLUDE = {
  project: { select: { id: true, name: true } },
  client: { select: { id: true, name: true } },
  goal: { select: { id: true, title: true } },
  assignee: { select: { id: true, name: true } },
  agent: { select: { id: true, name: true, key: true } },
  dependsOn: {
    select: { dependsOn: { select: { id: true, title: true, status: true } } },
  },
} as const;

async function assertRelations(ctx: CosContext, input: Partial<CreateInput>) {
  if (input.projectId) {
    const project = await prisma.project.findUnique({ where: { id: input.projectId } });
    await assertOwned(project, ctx, "project");
  }
  if (input.clientId) {
    const client = await prisma.client.findUnique({ where: { id: input.clientId } });
    await assertOwned(client, ctx, "client");
  }
  if (input.goalId) {
    const goal = await prisma.goal.findUnique({ where: { id: input.goalId } });
    await assertOwned(goal, ctx, "goal");
  }
  if (input.agentId) {
    const agent = await prisma.aIAgent.findUnique({ where: { id: input.agentId } });
    await assertOwned(agent, ctx, "agent");
  }
  if (input.assigneeId) {
    const membership = await prisma.membership.findUnique({
      where: { businessId_userId: { businessId: ctx.businessId, userId: input.assigneeId } },
    });
    if (!membership) throw notFound("That assignee is not a member of this workspace.");
  }
}

/** Reject dependency cycles before they are written. */
async function assertNoCycle(taskId: string, dependsOnIds: string[]) {
  if (dependsOnIds.includes(taskId)) {
    throw new AppError("A task cannot depend on itself.", { code: "invalid_dependency" });
  }
  const seen = new Set<string>([taskId]);
  let frontier = [...dependsOnIds];

  for (let depth = 0; depth < 20 && frontier.length > 0; depth += 1) {
    const edges = await prisma.taskDependency.findMany({
      where: { taskId: { in: frontier } },
      select: { taskId: true, dependsOnId: true },
    });
    const next: string[] = [];
    for (const edge of edges) {
      if (edge.dependsOnId === taskId) {
        throw new AppError("That would create a circular dependency.", { code: "invalid_dependency" });
      }
      if (!seen.has(edge.dependsOnId)) {
        seen.add(edge.dependsOnId);
        next.push(edge.dependsOnId);
      }
    }
    frontier = next;
  }
}

export async function createTask(
  ctx: CosContext,
  input: CreateInput,
  options: { origin?: TaskOrigin; agentKey?: string } = {}
) {
  await assertRelations(ctx, input);

  if (input.dependsOnIds.length > 0) {
    const blockers = await prisma.task.findMany({
      where: { id: { in: input.dependsOnIds }, businessId: ctx.businessId },
      select: { id: true },
    });
    if (blockers.length !== input.dependsOnIds.length) {
      throw notFound("One of the blocking tasks could not be found.");
    }
  }

  const task = await prisma.task.create({
    data: {
      businessId: ctx.businessId,
      createdById: ctx.userId,
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate,
      estimateMins: input.estimateMins ?? null,
      actualMins: input.actualMins ?? null,
      projectId: input.projectId,
      clientId: input.clientId,
      goalId: input.goalId,
      assigneeId: input.assigneeId,
      agentId: input.agentId,
      tags: input.tags,
      recurrence: input.recurrence,
      recurrenceUntil: input.recurrenceUntil,
      notes: input.notes,
      origin: options.origin ?? TaskOrigin.HUMAN,
      dependsOn: {
        create: input.dependsOnIds.map((dependsOnId) => ({ dependsOnId })),
      },
    },
    include: TASK_INCLUDE,
  });

  if (task.projectId) await recomputeProjectHealth(task.projectId);
  await recordAudit(ctx, {
    action: "task.create",
    entityType: "task",
    entityId: task.id,
    actorKind: options.origin === TaskOrigin.AI ? "AI" : "USER",
    actorLabel: options.agentKey ?? ctx.userName,
    detail: { title: task.title, priority: task.priority },
  });
  return task;
}

/**
 * Recurring tasks are materialised one at a time: completing an instance spawns
 * the next one. This avoids generating hundreds of future rows that would clog
 * the task list and the AI's context window.
 */
const RECURRENCE_DAYS: Record<string, number> = {
  DAILY: 1,
  WEEKLY: 7,
  BIWEEKLY: 14,
  MONTHLY: 30,
  QUARTERLY: 91,
};

async function spawnNextOccurrence(ctx: CosContext, taskId: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.recurrence === "NONE") return null;

  const step = RECURRENCE_DAYS[task.recurrence];
  if (!step) return null;

  const base = task.dueDate ?? new Date();
  const nextDue = addDays(startOfDay(base), step);
  if (task.recurrenceUntil && nextDue > task.recurrenceUntil) return null;

  const next = await prisma.task.create({
    data: {
      businessId: task.businessId,
      createdById: task.createdById,
      title: task.title,
      description: task.description,
      status: "PLANNED",
      priority: task.priority,
      dueDate: nextDue,
      estimateMins: task.estimateMins,
      projectId: task.projectId,
      clientId: task.clientId,
      goalId: task.goalId,
      assigneeId: task.assigneeId,
      agentId: task.agentId,
      tags: task.tags,
      recurrence: task.recurrence,
      recurrenceUntil: task.recurrenceUntil,
      notes: task.notes,
      origin: "AUTOMATION",
    },
  });

  await recordAudit(ctx, {
    action: "task.recur",
    entityType: "task",
    entityId: next.id,
    actorKind: "SYSTEM",
    detail: { from: taskId },
  });
  return next;
}

export async function updateTask(ctx: CosContext, id: string, input: UpdateInput) {
  const existing = await prisma.task.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "task");
  await assertRelations(ctx, input);

  if (input.dependsOnIds) {
    await assertNoCycle(id, input.dependsOnIds);
  }

  const becomingComplete = input.status === "COMPLETED" && existing!.status !== "COMPLETED";
  const leavingComplete =
    input.status !== undefined && input.status !== "COMPLETED" && existing!.status === "COMPLETED";

  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.priority !== undefined ? { priority: input.priority } : {}),
      ...(input.dueDate !== undefined ? { dueDate: input.dueDate } : {}),
      ...(input.estimateMins !== undefined ? { estimateMins: input.estimateMins } : {}),
      ...(input.actualMins !== undefined ? { actualMins: input.actualMins } : {}),
      ...(input.projectId !== undefined ? { projectId: input.projectId || null } : {}),
      ...(input.clientId !== undefined ? { clientId: input.clientId || null } : {}),
      ...(input.goalId !== undefined ? { goalId: input.goalId || null } : {}),
      ...(input.assigneeId !== undefined ? { assigneeId: input.assigneeId || null } : {}),
      ...(input.agentId !== undefined ? { agentId: input.agentId || null } : {}),
      ...(input.tags !== undefined ? { tags: input.tags } : {}),
      ...(input.recurrence !== undefined ? { recurrence: input.recurrence } : {}),
      ...(input.recurrenceUntil !== undefined ? { recurrenceUntil: input.recurrenceUntil } : {}),
      ...(input.notes !== undefined ? { notes: input.notes } : {}),
      ...(becomingComplete ? { completedAt: new Date() } : {}),
      ...(leavingComplete ? { completedAt: null } : {}),
      ...(input.status === "IN_PROGRESS" && !existing!.startedAt ? { startedAt: new Date() } : {}),
      ...(input.dependsOnIds
        ? {
            dependsOn: {
              deleteMany: {},
              create: input.dependsOnIds.map((dependsOnId) => ({ dependsOnId })),
            },
          }
        : {}),
    },
    include: TASK_INCLUDE,
  });

  if (becomingComplete) await spawnNextOccurrence(ctx, id);
  const projectIds = new Set([existing!.projectId, task.projectId].filter(Boolean) as string[]);
  for (const projectId of projectIds) await recomputeProjectHealth(projectId);

  await recordAudit(ctx, {
    action: "task.update",
    entityType: "task",
    entityId: id,
    detail: { fields: Object.keys(input) },
  });
  return task;
}

export async function deleteTask(ctx: CosContext, id: string) {
  const existing = await prisma.task.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "task");
  await prisma.task.delete({ where: { id } });
  if (existing!.projectId) await recomputeProjectHealth(existing!.projectId);
  await recordAudit(ctx, {
    action: "task.delete",
    entityType: "task",
    entityId: id,
    detail: { title: existing!.title },
  });
  return { ok: true };
}

export async function listTasks(ctx: CosContext, query: Partial<QueryInput> = {}) {
  const today = startOfDay(new Date());
  const where: Prisma.TaskWhereInput = {
    businessId: ctx.businessId,
    ...(query.status ? { status: query.status } : {}),
    ...(query.priority ? { priority: query.priority } : {}),
    ...(query.projectId ? { projectId: query.projectId } : {}),
    ...(query.clientId ? { clientId: query.clientId } : {}),
    ...(query.assigneeId ? { assigneeId: query.assigneeId } : {}),
    ...(query.overdue
      ? { dueDate: { lt: today }, status: { notIn: ["COMPLETED", "CANCELLED"] } }
      : {}),
    ...(query.dueBefore && !query.overdue ? { dueDate: { lte: query.dueBefore } } : {}),
    ...(query.search
      ? {
          OR: [
            { title: { contains: query.search, mode: "insensitive" } },
            { description: { contains: query.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: [{ status: "asc" }, { priority: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
      take: query.take ?? 50,
      skip: query.skip ?? 0,
      include: TASK_INCLUDE,
    }),
    prisma.task.count({ where }),
  ]);

  return { items, total };
}

export async function getTask(ctx: CosContext, id: string) {
  const task = await prisma.task.findUnique({ where: { id }, include: TASK_INCLUDE });
  if (!task || task.businessId !== ctx.businessId) throw notFound("That task could not be found.");
  return task;
}
