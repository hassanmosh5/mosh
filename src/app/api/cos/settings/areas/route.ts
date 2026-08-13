import { prisma } from "@/lib/prisma";
import { route, readJson } from "@/lib/cos/api";
import { businessAreaSchema } from "@/lib/cos/schemas";
import { slugify } from "@/lib/cos/format";
import { recordAudit } from "@/lib/cos/audit";

export const GET = route({ permission: "settings:read" }, async (ctx) => ({
  items: await prisma.businessArea.findMany({
    where: { businessId: ctx.businessId },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  }),
}));

export const POST = route({ permission: "settings:write" }, async (ctx, request) => {
  const input = await readJson(request, businessAreaSchema);
  const count = await prisma.businessArea.count({ where: { businessId: ctx.businessId } });
  const area = await prisma.businessArea.create({
    data: { businessId: ctx.businessId, slug: slugify(input.name), ...input, order: count },
  });
  await recordAudit(ctx, { action: "area.create", entityType: "business_area", entityId: area.id });
  return area;
});
