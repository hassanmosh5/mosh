import { route, readJson } from "@/lib/cos/api";
import { getClient, updateClient, deleteClient } from "@/lib/cos/services/crm";
import { clientUpdateSchema } from "@/lib/cos/schemas";

export const GET = route<{ id: string }>({ permission: "crm:read" }, async (ctx, _request, { id }) =>
  getClient(ctx, id)
);

export const PATCH = route<{ id: string }>({ permission: "crm:write" }, async (ctx, request, { id }) => {
  const input = await readJson(request, clientUpdateSchema);
  return updateClient(ctx, id, input);
});

export const DELETE = route<{ id: string }>({ permission: "crm:delete" }, async (ctx, _request, { id }) =>
  deleteClient(ctx, id)
);
