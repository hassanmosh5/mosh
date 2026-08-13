import { prisma } from "@/lib/prisma";
import { route } from "@/lib/cos/api";

export const GET = route({ permission: "agent:read" }, async (ctx) => ({
  items: await prisma.conversation.findMany({
    where: { businessId: ctx.businessId, archived: false },
    orderBy: { updatedAt: "desc" },
    take: 30,
    select: { id: true, title: true, updatedAt: true },
  }),
}));
