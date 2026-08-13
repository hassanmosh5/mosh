import { prisma } from "@/lib/prisma";
import type { CosContext } from "../tenancy";

export type SearchHit = {
  type: string;
  id: string;
  title: string;
  subtitle?: string;
  href: string;
};

/**
 * Global search across every entity the command centre can jump to.
 *
 * Each entity is queried with a small `take` and the results are interleaved so
 * one noisy table cannot crowd out the rest.
 */
export async function globalSearch(ctx: CosContext, query: string, take = 8): Promise<SearchHit[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const contains = { contains: q, mode: "insensitive" as const };
  const businessId = ctx.businessId;
  const perType = Math.max(2, Math.ceil(take / 2));

  const [clients, projects, tasks, leads, products, documents, agents, content, conversations] =
    await Promise.all([
      prisma.client.findMany({
        where: { businessId, OR: [{ name: contains }, { company: contains }, { email: contains }] },
        take: perType,
        select: { id: true, name: true, company: true, status: true },
      }),
      prisma.project.findMany({
        where: { businessId, OR: [{ name: contains }, { description: contains }] },
        take: perType,
        select: { id: true, name: true, status: true, health: true },
      }),
      prisma.task.findMany({
        where: { businessId, OR: [{ title: contains }, { description: contains }] },
        take: perType,
        select: { id: true, title: true, status: true, priority: true },
      }),
      prisma.lead.findMany({
        where: { businessId, OR: [{ name: contains }, { company: contains }, { email: contains }] },
        take: perType,
        select: { id: true, name: true, company: true, stage: true },
      }),
      prisma.product.findMany({
        where: { businessId, OR: [{ name: contains }, { description: contains }] },
        take: perType,
        select: { id: true, name: true, stage: true },
      }),
      prisma.knowledgeDocument.findMany({
        where: { businessId, OR: [{ title: contains }, { summary: contains }, { body: contains }] },
        take: perType,
        select: { id: true, title: true, category: true },
      }),
      prisma.aIAgent.findMany({
        where: { businessId, OR: [{ name: contains }, { role: contains }] },
        take: perType,
        select: { id: true, name: true, role: true, key: true },
      }),
      prisma.contentItem.findMany({
        where: { businessId, OR: [{ title: contains }, { topic: contains }] },
        take: perType,
        select: { id: true, title: true, platform: true, status: true },
      }),
      prisma.conversation.findMany({
        where: { businessId, title: contains },
        take: perType,
        select: { id: true, title: true, updatedAt: true },
      }),
    ]);

  const groups: SearchHit[][] = [
    clients.map((c) => ({ type: "client", id: c.id, title: c.name, subtitle: c.company ?? c.status, href: `/cos/crm/clients/${c.id}` })),
    projects.map((p) => ({ type: "project", id: p.id, title: p.name, subtitle: p.status, href: `/cos/projects/${p.id}` })),
    tasks.map((t) => ({ type: "task", id: t.id, title: t.title, subtitle: t.status, href: `/cos/tasks/${t.id}` })),
    leads.map((l) => ({ type: "lead", id: l.id, title: l.name, subtitle: l.company ?? l.stage, href: `/cos/crm` })),
    products.map((p) => ({ type: "product", id: p.id, title: p.name, subtitle: p.stage, href: `/cos/products` })),
    documents.map((d) => ({ type: "knowledge", id: d.id, title: d.title, subtitle: d.category, href: `/cos/knowledge/${d.id}` })),
    agents.map((a) => ({ type: "agent", id: a.id, title: a.name, subtitle: a.role, href: `/cos/agents/${a.key}` })),
    content.map((c) => ({ type: "content", id: c.id, title: c.title, subtitle: `${c.platform} · ${c.status}`, href: `/cos/content` })),
    conversations.map((c) => ({ type: "conversation", id: c.id, title: c.title, subtitle: "conversation", href: `/cos/chat?c=${c.id}` })),
  ];

  // Round-robin so every entity type gets representation in the first results.
  const results: SearchHit[] = [];
  for (let index = 0; results.length < take; index += 1) {
    let added = false;
    for (const group of groups) {
      if (group[index]) {
        results.push(group[index]);
        added = true;
        if (results.length >= take) break;
      }
    }
    if (!added) break;
  }

  return results;
}
