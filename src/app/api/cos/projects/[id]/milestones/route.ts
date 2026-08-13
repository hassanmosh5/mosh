import { prisma } from "@/lib/prisma";
import { route, readJson } from "@/lib/cos/api";
import { assertOwned } from "@/lib/cos/context";
import { milestoneSchema } from "@/lib/cos/schemas";
import { recordAudit } from "@/lib/cos/audit";

export const POST = route<{ id: string }>({ permission: "project:write" }, async (ctx, request, { id }) => {
  const project = await prisma.project.findUnique({ where: { id } });
  await assertOwned(project, ctx, "project");
  const input = await readJson(request, milestoneSchema);
  const milestone = await prisma.milestone.create({ data: { projectId: id, ...input } });
  await recordAudit(ctx, { action: "milestone.create", entityType: "milestone", entityId: milestone.id });
  return milestone;
});
