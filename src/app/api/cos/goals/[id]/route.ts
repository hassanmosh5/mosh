import { route, readJson } from "@/lib/cos/api";
import { getGoal, updateGoal, deleteGoal } from "@/lib/cos/services/goals";
import { goalUpdateSchema } from "@/lib/cos/schemas";

export const GET = route<{ id: string }>({ permission: "goal:read" }, async (ctx, _request, { id }) =>
  getGoal(ctx, id)
);

export const PATCH = route<{ id: string }>({ permission: "goal:write" }, async (ctx, request, { id }) => {
  const input = await readJson(request, goalUpdateSchema);
  return updateGoal(ctx, id, input);
});

export const DELETE = route<{ id: string }>({ permission: "goal:delete" }, async (ctx, _request, { id }) =>
  deleteGoal(ctx, id)
);
