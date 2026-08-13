import { prisma } from "@/lib/prisma";
import type { CosContext } from "../tenancy";
import { assertOwned } from "../tenancy";
import { recordAudit } from "../audit";
import { conflict, notFound } from "../errors";
import { slugify, toNumber } from "../format";
import { scoreProjectHealth } from "../scoring";
import type { projectCreateSchema, projectUpdateSchema } from "../schemas";
import type { z } from "zod";

type CreateInput = z.infer<typeof projectCreateSchema>;
type UpdateInput = z.infer<typeof projectUpdateSchema>;

/**
 * Recompute a project's completion percentage and health from its tasks,
 * risks and budget. Called after any change to the project or its tasks so the
 * dashboard never shows a stale health indicator.
 */
export async function recomputeProjectHealth(projectId: string, now = new Date()) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true, status: true, deadline: true, budget: true, spend: true,
      tasks: { select: { status: true, dueDate: true } },
      risks: { where: { resolvedAt: null }, select: { severity: true } },
    },
  });
  if (!project) return null;

  const tasks = project.tasks;
  const countable = tasks.filter((t) => t.status !== "CANCELLED");
  const done = countable.filter((t) => t.status === "COMPLETED").length;
  const completion = countable.length === 0 ? 0 : Math.round((done / countable.length) * 100);

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const overdueTasks = tasks.filter(
    (t) => t.status !== "COMPLETED" && t.status !== "CANCELLED" && t.dueDate && t.dueDate < today
  ).length;
  const blockedTasks = tasks.filter((t) => t.status === "BLOCKED").length;

  const result = scoreProjectHealth({
    status: project.status,
    deadline: project.deadline,
    completion,
    overdueTasks,
    blockedTasks,
    openRisks: project.risks,
    budget: project.budget === null ? null : toNumber(project.budget),
    spend: project.spend === null ? null : toNumber(project.spend),
    now,
  });

  await prisma.project.update({
    where: { id: projectId },
    data: {
      completion,
      health: result.health,
      healthNote: result.reasons.join(" "),
    },
  });

  return { completion, ...result };
}

async function uniqueSlug(businessId: string, name: string, ignoreId?: string): Promise<string> {
  const base = slugify(name);
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
    const existing = await prisma.project.findUnique({
      where: { businessId_slug: { businessId, slug: candidate } },
      select: { id: true },
    });
    if (!existing || existing.id === ignoreId) return candidate;
  }
  throw conflict("Too many projects share that name — please pick a different one.");
}

/** Verify optional foreign keys belong to the same business before writing. */
async function assertRelations(ctx: CosContext, input: { clientId?: string; areaId?: string }) {
  if (input.clientId) {
    const client = await prisma.client.findUnique({ where: { id: input.clientId } });
    await assertOwned(client, ctx, "client");
  }
  if (input.areaId) {
    const area = await prisma.businessArea.findUnique({ where: { id: input.areaId } });
    await assertOwned(area, ctx, "business area");
  }
}

export async function createProject(ctx: CosContext, input: CreateInput) {
  await assertRelations(ctx, input);
  const slug = await uniqueSlug(ctx.businessId, input.name);

  const project = await prisma.project.create({
    data: {
      businessId: ctx.businessId,
      name: input.name,
      slug,
      description: input.description,
      clientId: input.clientId,
      areaId: input.areaId,
      status: input.status,
      startDate: input.startDate,
      deadline: input.deadline,
      budget: input.budget,
      revenue: input.revenue,
      spend: input.spend,
      notes: input.notes,
    },
  });

  await recomputeProjectHealth(project.id);
  await recordAudit(ctx, {
    action: "project.create",
    entityType: "project",
    entityId: project.id,
    detail: { name: project.name },
  });
  return project;
}

export async function updateProject(ctx: CosContext, id: string, input: UpdateInput) {
  const existing = await prisma.project.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "project");
  await assertRelations(ctx, input);

  const slug =
    input.name && input.name !== existing!.name
      ? await uniqueSlug(ctx.businessId, input.name, id)
      : undefined;

  const project = await prisma.project.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(slug ? { slug } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.clientId !== undefined ? { clientId: input.clientId || null } : {}),
      ...(input.areaId !== undefined ? { areaId: input.areaId || null } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.startDate !== undefined ? { startDate: input.startDate } : {}),
      ...(input.deadline !== undefined ? { deadline: input.deadline } : {}),
      ...(input.budget !== undefined ? { budget: input.budget } : {}),
      ...(input.revenue !== undefined ? { revenue: input.revenue } : {}),
      ...(input.spend !== undefined ? { spend: input.spend } : {}),
      ...(input.notes !== undefined ? { notes: input.notes } : {}),
    },
  });

  await recomputeProjectHealth(project.id);
  await recordAudit(ctx, {
    action: "project.update",
    entityType: "project",
    entityId: id,
    detail: { fields: Object.keys(input) },
  });
  return project;
}

export async function deleteProject(ctx: CosContext, id: string) {
  const existing = await prisma.project.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "project");
  await prisma.project.delete({ where: { id } });
  await recordAudit(ctx, {
    action: "project.delete",
    entityType: "project",
    entityId: id,
    detail: { name: existing!.name },
  });
  return { ok: true };
}

export async function listProjects(
  ctx: CosContext,
  options: { status?: string; clientId?: string; take?: number } = {}
) {
  return prisma.project.findMany({
    where: {
      businessId: ctx.businessId,
      ...(options.status ? { status: options.status as never } : {}),
      ...(options.clientId ? { clientId: options.clientId } : {}),
    },
    orderBy: [{ status: "asc" }, { deadline: "asc" }, { updatedAt: "desc" }],
    take: options.take ?? 100,
    include: {
      client: { select: { id: true, name: true } },
      area: { select: { id: true, name: true } },
      _count: { select: { tasks: true, risks: true, milestones: true } },
    },
  });
}

export async function getProject(ctx: CosContext, id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, name: true } },
      area: { select: { id: true, name: true } },
      milestones: { orderBy: [{ order: "asc" }, { dueDate: "asc" }] },
      risks: { orderBy: { severity: "desc" } },
      tasks: {
        orderBy: [{ status: "asc" }, { dueDate: "asc" }],
        select: {
          id: true, title: true, status: true, priority: true, dueDate: true,
          assignee: { select: { name: true } },
        },
      },
      members: {
        include: {
          user: { select: { id: true, name: true } },
          agent: { select: { id: true, name: true, key: true } },
        },
      },
    },
  });
  if (!project || project.businessId !== ctx.businessId) throw notFound("That project could not be found.");
  return project;
}
