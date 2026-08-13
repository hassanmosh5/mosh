import { route, readJson } from "@/lib/cos/api";
import { updateContact, deleteContact } from "@/lib/cos/services/crm";
import { contactUpdateSchema } from "@/lib/cos/schemas";

export const PATCH = route<{ id: string }>({ permission: "crm:write" }, async (ctx, request, { id }) => {
  const input = await readJson(request, contactUpdateSchema);
  return updateContact(ctx, id, input);
});

export const DELETE = route<{ id: string }>({ permission: "crm:delete" }, async (ctx, _request, { id }) =>
  deleteContact(ctx, id)
);
