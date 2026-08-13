import { route, readJson } from "@/lib/cos/api";
import { listLeads, createLead } from "@/lib/cos/services/crm";
import { leadCreateSchema } from "@/lib/cos/schemas";

export const GET = route({ permission: "crm:read" }, async (ctx) => ({
  items: await listLeads(ctx),
}));

export const POST = route({ permission: "crm:write" }, async (ctx, request) => {
  const input = await readJson(request, leadCreateSchema);
  return createLead(ctx, input);
});
