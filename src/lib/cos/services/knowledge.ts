import { prisma } from "@/lib/prisma";
import type { CosContext } from "../tenancy";
import { assertOwned } from "../tenancy";
import { recordAudit } from "../audit";
import { conflict, notFound } from "../errors";
import { slugify } from "../format";
import type { knowledgeCreateSchema, knowledgeUpdateSchema, memoryCreateSchema, memoryUpdateSchema } from "../schemas";
import type { z } from "zod";

// ---------------------------------------------------------------------------
// Knowledge base
// ---------------------------------------------------------------------------

async function uniqueSlug(businessId: string, title: string, ignoreId?: string) {
  const base = slugify(title);
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
    const existing = await prisma.knowledgeDocument.findUnique({
      where: { businessId_slug: { businessId, slug: candidate } },
      select: { id: true },
    });
    if (!existing || existing.id === ignoreId) return candidate;
  }
  throw conflict("Too many documents share that title.");
}

export async function listKnowledge(
  ctx: CosContext,
  options: { category?: string; search?: string; take?: number } = {}
) {
  return prisma.knowledgeDocument.findMany({
    where: {
      businessId: ctx.businessId,
      ...(options.category ? { category: options.category as never } : {}),
      ...(options.search
        ? {
            OR: [
              { title: { contains: options.search, mode: "insensitive" as const } },
              { summary: { contains: options.search, mode: "insensitive" as const } },
              { body: { contains: options.search, mode: "insensitive" as const } },
              { tags: { has: options.search.toLowerCase() } },
            ],
          }
        : {}),
    },
    orderBy: [{ category: "asc" }, { updatedAt: "desc" }],
    take: options.take ?? 100,
    select: {
      id: true, title: true, slug: true, category: true, summary: true,
      tags: true, source: true, reviewAt: true, updatedAt: true, isDemo: true,
    },
  });
}

export async function getKnowledgeDocument(ctx: CosContext, id: string) {
  const doc = await prisma.knowledgeDocument.findUnique({ where: { id } });
  if (!doc || doc.businessId !== ctx.businessId) throw notFound("That document could not be found.");
  return doc;
}

export async function createKnowledgeDocument(ctx: CosContext, input: z.infer<typeof knowledgeCreateSchema>) {
  if (input.projectId) {
    const project = await prisma.project.findUnique({ where: { id: input.projectId } });
    await assertOwned(project, ctx, "project");
  }
  const slug = await uniqueSlug(ctx.businessId, input.title);
  const doc = await prisma.knowledgeDocument.create({
    data: {
      businessId: ctx.businessId,
      ...input,
      slug,
      tags: input.tags.map((tag) => tag.toLowerCase()),
    },
  });
  await recordAudit(ctx, { action: "knowledge.create", entityType: "knowledge", entityId: doc.id, detail: { title: doc.title } });
  return doc;
}

export async function updateKnowledgeDocument(
  ctx: CosContext,
  id: string,
  input: z.infer<typeof knowledgeUpdateSchema>
) {
  const existing = await prisma.knowledgeDocument.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "document");
  const slug =
    input.title && input.title !== existing!.title
      ? await uniqueSlug(ctx.businessId, input.title, id)
      : undefined;
  const doc = await prisma.knowledgeDocument.update({
    where: { id },
    data: {
      ...input,
      ...(slug ? { slug } : {}),
      ...(input.tags ? { tags: input.tags.map((tag) => tag.toLowerCase()) } : {}),
    },
  });
  await recordAudit(ctx, { action: "knowledge.update", entityType: "knowledge", entityId: id });
  return doc;
}

export async function deleteKnowledgeDocument(ctx: CosContext, id: string) {
  const existing = await prisma.knowledgeDocument.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "document");
  await prisma.knowledgeDocument.delete({ where: { id } });
  await recordAudit(ctx, { action: "knowledge.delete", entityType: "knowledge", entityId: id });
  return { ok: true };
}

/**
 * Keyword retrieval over the knowledge base.
 *
 * This is a lexical search on purpose — it has no external dependency and no
 * embedding cost. The `embedding` column and this single function are the only
 * places that need to change to move to semantic search (see AI_ARCHITECTURE.md).
 */
export async function searchKnowledge(ctx: CosContext, query: string, take = 5) {
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 2)
    .slice(0, 8);

  if (terms.length === 0) return [];

  const candidates = await prisma.knowledgeDocument.findMany({
    where: {
      businessId: ctx.businessId,
      OR: terms.flatMap((term) => [
        { title: { contains: term, mode: "insensitive" as const } },
        { summary: { contains: term, mode: "insensitive" as const } },
        { body: { contains: term, mode: "insensitive" as const } },
        { tags: { has: term } },
      ]),
    },
    take: 40,
    select: { id: true, title: true, category: true, summary: true, body: true, tags: true, updatedAt: true },
  });

  const scored = candidates.map((doc) => {
    const title = doc.title.toLowerCase();
    const summary = (doc.summary ?? "").toLowerCase();
    const body = doc.body.toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (title.includes(term)) score += 5;
      if (doc.tags.includes(term)) score += 4;
      if (summary.includes(term)) score += 2;
      const occurrences = body.split(term).length - 1;
      score += Math.min(4, occurrences);
    }
    return { doc, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, take)
    .map(({ doc, score }) => ({
      id: doc.id,
      title: doc.title,
      category: doc.category,
      summary: doc.summary,
      excerpt: doc.body.slice(0, 900),
      score,
    }));
}

// ---------------------------------------------------------------------------
// Structured memory
// ---------------------------------------------------------------------------

export async function listMemories(ctx: CosContext, options: { scope?: string } = {}) {
  return prisma.memory.findMany({
    where: {
      businessId: ctx.businessId,
      ...(options.scope ? { scope: options.scope as never } : {}),
    },
    orderBy: [{ pinned: "desc" }, { scope: "asc" }, { updatedAt: "desc" }],
    include: {
      client: { select: { id: true, name: true } },
      project: { select: { id: true, name: true } },
    },
    take: 300,
  });
}

/**
 * Memory writes are upserts on (scope, key).
 *
 * Unrestricted memory growth is what makes AI memory useless, so the key space
 * is deliberately narrow: re-recording the same fact updates it rather than
 * appending a near-duplicate.
 */
export async function upsertMemory(
  ctx: CosContext,
  input: z.infer<typeof memoryCreateSchema>,
  options: { actorKind?: "USER" | "AI"; actorLabel?: string } = {}
) {
  if (input.clientId) {
    const client = await prisma.client.findUnique({ where: { id: input.clientId } });
    await assertOwned(client, ctx, "client");
  }
  if (input.projectId) {
    const project = await prisma.project.findUnique({ where: { id: input.projectId } });
    await assertOwned(project, ctx, "project");
  }

  const key = input.key.trim().toLowerCase().replace(/\s+/g, "_").slice(0, 120);

  const memory = await prisma.memory.upsert({
    where: { businessId_scope_key: { businessId: ctx.businessId, scope: input.scope, key } },
    create: { businessId: ctx.businessId, ...input, key },
    update: {
      value: input.value,
      confidence: input.confidence,
      source: input.source,
      clientId: input.clientId ?? null,
      projectId: input.projectId ?? null,
      reviewAt: input.reviewAt,
      expiresAt: input.expiresAt,
      pinned: input.pinned,
    },
  });

  await recordAudit(ctx, {
    action: "memory.upsert",
    entityType: "memory",
    entityId: memory.id,
    actorKind: options.actorKind ?? "USER",
    actorLabel: options.actorLabel ?? ctx.userName,
    detail: { scope: memory.scope, key: memory.key },
  });
  return memory;
}

export async function updateMemory(ctx: CosContext, id: string, input: z.infer<typeof memoryUpdateSchema>) {
  const existing = await prisma.memory.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "memory");
  const memory = await prisma.memory.update({ where: { id }, data: input });
  await recordAudit(ctx, { action: "memory.update", entityType: "memory", entityId: id });
  return memory;
}

export async function deleteMemory(ctx: CosContext, id: string) {
  const existing = await prisma.memory.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "memory");
  await prisma.memory.delete({ where: { id } });
  await recordAudit(ctx, { action: "memory.delete", entityType: "memory", entityId: id });
  return { ok: true };
}

/**
 * Memories the AI is allowed to see for a given turn. Expired entries are
 * excluded, pinned ones always come first, and the result is capped so memory
 * can never dominate the context window.
 */
export async function retrieveMemories(
  ctx: CosContext,
  options: { scopes?: string[]; clientId?: string; projectId?: string; take?: number } = {}
) {
  const now = new Date();
  return prisma.memory.findMany({
    where: {
      businessId: ctx.businessId,
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      ...(options.scopes?.length ? { scope: { in: options.scopes as never } } : {}),
      ...(options.clientId ? { OR: [{ clientId: options.clientId }, { clientId: null }] } : {}),
      ...(options.projectId ? { OR: [{ projectId: options.projectId }, { projectId: null }] } : {}),
    },
    orderBy: [{ pinned: "desc" }, { confidence: "desc" }, { updatedAt: "desc" }],
    take: options.take ?? 25,
    select: { scope: true, key: true, value: true, confidence: true, source: true, updatedAt: true },
  });
}
