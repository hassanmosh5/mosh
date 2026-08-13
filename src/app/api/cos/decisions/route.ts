import { route, readJson } from "@/lib/cos/api";
import { createDecision, listDecisions } from "@/lib/cos/services/automations";
import { decisionSchema } from "@/lib/cos/schemas";

export const GET = route({ permission: "analytics:read" }, async (ctx) => ({
  items: await listDecisions(ctx),
}));

export const POST = route({ permission: "automation:write" }, async (ctx, request) => {
  const input = await readJson(request, decisionSchema);
  return createDecision(ctx, input);
});
