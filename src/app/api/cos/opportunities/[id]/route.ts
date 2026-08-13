import { route, readJson } from "@/lib/cos/api";
import { updateOpportunity, deleteOpportunity } from "@/lib/cos/services/crm";
import { opportunityUpdateSchema } from "@/lib/cos/schemas";

export const PATCH = route<{ id: string }>({ permission: "crm:write" }, async (ctx, request, { id }) => {
  const input = await readJson(request, opportunityUpdateSchema);
  return updateOpportunity(ctx, id, input);
});

export const DELETE = route<{ id: string }>({ permission: "crm:delete" }, async (ctx, _request, { id }) =>
  deleteOpportunity(ctx, id)
);
