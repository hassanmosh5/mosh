import { prisma } from "@/lib/prisma";
import { route, readJson } from "@/lib/cos/api";
import { notFound } from "@/lib/cos/errors";
import { agentUpsertSchema } from "@/lib/cos/schemas";
import { recordAudit } from "@/lib/cos/audit";

export const GET = route<{ key: string }>({ permission: "agent:read" }, async (ctx, _request, { key }) => {
  const agent = await prisma.aIAgent.findUnique({
    where: { businessId_key: { businessId: ctx.businessId, key } },
    include: { executions: { orderBy: { startedAt: "desc" }, take: 20 } },
  });
  if (!agent) throw notFound("That agent could not be found.");
  return agent;
});

export const PATCH = route<{ key: string }>({ permission: "agent:write" }, async (ctx, request, { key }) => {
  const input = await readJson(request, agentUpsertSchema.partial());
  const existing = await prisma.aIAgent.findUnique({
    where: { businessId_key: { businessId: ctx.businessId, key } },
  });
  if (!existing) throw notFound("That agent could not be found.");
  const agent = await prisma.aIAgent.update({ where: { id: existing.id }, data: input });
  await recordAudit(ctx, { action: "agent.update", entityType: "agent", entityId: agent.id, detail: { key } });
  return agent;
});
