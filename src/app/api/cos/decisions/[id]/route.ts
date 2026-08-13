import { route } from "@/lib/cos/api";
import { deleteDecision } from "@/lib/cos/services/automations";

export const DELETE = route<{ id: string }>({ permission: "automation:write" }, async (ctx, _request, { id }) =>
  deleteDecision(ctx, id)
);
