import { route, readJson } from "@/lib/cos/api";
import { listOpportunities, createOpportunity } from "@/lib/cos/services/crm";
import { opportunityCreateSchema } from "@/lib/cos/schemas";

export const GET = route({ permission: "crm:read" }, async (ctx) => ({
  items: await listOpportunities(ctx),
}));

export const POST = route({ permission: "crm:write" }, async (ctx, request) => {
  const input = await readJson(request, opportunityCreateSchema);
  return createOpportunity(ctx, input);
});
