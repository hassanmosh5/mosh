import { prisma } from "@/lib/prisma";
import { route } from "@/lib/cos/api";

export const GET = route({ permission: "notification:read" }, async (ctx) => ({
  items: await prisma.notification.findMany({
    where: { businessId: ctx.businessId },
    orderBy: [{ readAt: "asc" }, { createdAt: "desc" }],
    take: 100,
  }),
}));
