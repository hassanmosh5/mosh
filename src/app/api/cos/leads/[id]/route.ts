import { route, readJson } from "@/lib/cos/api";
import { updateLead, deleteLead } from "@/lib/cos/services/crm";
import { leadUpdateSchema } from "@/lib/cos/schemas";

export const PATCH = route<{ id: string }>({ permission: "crm:write" }, async (ctx, request, { id }) => {
  const input = await readJson(request, leadUpdateSchema);
  return updateLead(ctx, id, input);
});

export const DELETE = route<{ id: string }>({ permission: "crm:delete" }, async (ctx, _request, { id }) =>
  deleteLead(ctx, id)
);
