import { prisma } from "@/lib/prisma";
import { route, readJson } from "@/lib/cos/api";
import { agentUpsertSchema } from "@/lib/cos/schemas";
import { recordAudit } from "@/lib/cos/audit";

export const GET = route({ permission: "agent:read" }, async (ctx) => ({
  items: await prisma.aIAgent.findMany({
    where: { businessId: ctx.businessId },
    orderBy: [{ status: "asc" }, { name: "asc" }],
    include: { _count: { select: { executions: true } } },
  }),
}));

export const POST = route({ permission: "agent:write" }, async (ctx, request) => {
  const input = await readJson(request, agentUpsertSchema);
  const agent = await prisma.aIAgent.upsert({
    where: { businessId_key: { businessId: ctx.businessId, key: input.key } },
    create: { businessId: ctx.businessId, ...input },
    update: input,
  });
  await recordAudit(ctx, {
    action: "agent.upsert",
    entityType: "agent",
    entityId: agent.id,
    detail: { key: agent.key },
  });
  return agent;
});
