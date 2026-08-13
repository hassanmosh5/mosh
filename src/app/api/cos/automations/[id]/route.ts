import { route, readJson } from "@/lib/cos/api";
import { getAutomation, updateAutomation, deleteAutomation } from "@/lib/cos/services/automations";
import { automationUpdateSchema } from "@/lib/cos/schemas";

export const GET = route<{ id: string }>({ permission: "automation:read" }, async (ctx, _request, { id }) =>
  getAutomation(ctx, id)
);

export const PATCH = route<{ id: string }>({ permission: "automation:write" }, async (ctx, request, { id }) => {
  const input = await readJson(request, automationUpdateSchema);
  return updateAutomation(ctx, id, input);
});

export const DELETE = route<{ id: string }>({ permission: "automation:write" }, async (ctx, _request, { id }) =>
  deleteAutomation(ctx, id)
);
