import { prisma } from "@/lib/prisma";
import { route } from "@/lib/cos/api";
import { assertOwned } from "@/lib/cos/context";

export const PATCH = route<{ id: string }>({ permission: "notification:write" }, async (ctx, _request, { id }) => {
  const existing = await prisma.notification.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "notification");
  return prisma.notification.update({ where: { id }, data: { readAt: new Date() } });
});
