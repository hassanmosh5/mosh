import { prisma } from "@/lib/prisma";
import { route, readJson } from "@/lib/cos/api";
import { businessSettingsSchema } from "@/lib/cos/schemas";
import { recordAudit } from "@/lib/cos/audit";

export const PATCH = route({ permission: "settings:write" }, async (ctx, request) => {
  const input = await readJson(request, businessSettingsSchema);
  const business = await prisma.business.update({ where: { id: ctx.businessId }, data: input });
  await recordAudit(ctx, {
    action: "settings.business",
    entityType: "business",
    entityId: business.id,
    detail: { fields: Object.keys(input) },
  });
  return business;
});
