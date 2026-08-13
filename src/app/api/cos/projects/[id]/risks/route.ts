import { prisma } from "@/lib/prisma";
import { route, readJson } from "@/lib/cos/api";
import { assertOwned } from "@/lib/cos/context";
import { riskSchema } from "@/lib/cos/schemas";
import { recordAudit } from "@/lib/cos/audit";
import { recomputeProjectHealth } from "@/lib/cos/services/projects";

export const POST = route<{ id: string }>({ permission: "project:write" }, async (ctx, request, { id }) => {
  const project = await prisma.project.findUnique({ where: { id } });
  await assertOwned(project, ctx, "project");
  const input = await readJson(request, riskSchema);
  const risk = await prisma.projectRisk.create({ data: { projectId: id, ...input } });
  await recomputeProjectHealth(id);
  await recordAudit(ctx, { action: "risk.create", entityType: "risk", entityId: risk.id, detail: { severity: risk.severity } });
  return risk;
});
