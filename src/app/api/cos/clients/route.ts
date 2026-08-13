import { route, readJson } from "@/lib/cos/api";
import { listClients, createClient } from "@/lib/cos/services/crm";
import { clientCreateSchema } from "@/lib/cos/schemas";

export const GET = route({ permission: "crm:read" }, async (ctx) => ({
  items: await listClients(ctx),
}));

export const POST = route({ permission: "crm:write" }, async (ctx, request) => {
  const input = await readJson(request, clientCreateSchema);
  return createClient(ctx, input);
});
