import { route, readJson } from "@/lib/cos/api";
import { listAutomations, createAutomation } from "@/lib/cos/services/automations";
import { automationCreateSchema } from "@/lib/cos/schemas";

export const GET = route({ permission: "automation:read" }, async (ctx) => ({
  items: await listAutomations(ctx),
}));

export const POST = route({ permission: "automation:write" }, async (ctx, request) => {
  const input = await readJson(request, automationCreateSchema);
  return createAutomation(ctx, input);
});
