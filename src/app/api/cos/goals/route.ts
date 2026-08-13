import { route, readJson } from "@/lib/cos/api";
import { listGoals, createGoal } from "@/lib/cos/services/goals";
import { goalCreateSchema } from "@/lib/cos/schemas";

export const GET = route({ permission: "goal:read" }, async (ctx) => ({
  items: await listGoals(ctx),
}));

export const POST = route({ permission: "goal:write" }, async (ctx, request) => {
  const input = await readJson(request, goalCreateSchema);
  return createGoal(ctx, input);
});
