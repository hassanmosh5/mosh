import { route, readJson } from "@/lib/cos/api";
import { listContacts, createContact } from "@/lib/cos/services/crm";
import { contactCreateSchema } from "@/lib/cos/schemas";

export const GET = route({ permission: "crm:read" }, async (ctx) => ({
  items: await listContacts(ctx),
}));

export const POST = route({ permission: "crm:write" }, async (ctx, request) => {
  const input = await readJson(request, contactCreateSchema);
  return createContact(ctx, input);
});
