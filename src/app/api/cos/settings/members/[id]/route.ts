import { prisma } from "@/lib/prisma";
import { route, readJson } from "@/lib/cos/api";
import { membershipUpdateSchema } from "@/lib/cos/schemas";
import { assertOwned } from "@/lib/cos/context";
import { AppError } from "@/lib/cos/errors";
import { recordAudit } from "@/lib/cos/audit";

export const PATCH = route<{ id: string }>({ permission: "settings:write" }, async (ctx, request, { id }) => {
  const input = await readJson(request, membershipUpdateSchema);
  const existing = await prisma.membership.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "membership");

  // Never allow the last owner to be demoted — that would lock the workspace.
  if (existing!.role === "OWNER" && input.role !== "OWNER") {
    const owners = await prisma.membership.count({
      where: { businessId: ctx.businessId, role: "OWNER", active: true },
    });
    if (owners <= 1) {
      throw new AppError("You cannot remove the last owner of the workspace.", {
        status: 409,
        code: "last_owner",
      });
    }
  }

  const membership = await prisma.membership.update({ where: { id }, data: input });
  await recordAudit(ctx, {
    action: "membership.update",
    entityType: "membership",
    entityId: id,
    detail: { role: membership.role, active: membership.active },
  });
  return membership;
});
