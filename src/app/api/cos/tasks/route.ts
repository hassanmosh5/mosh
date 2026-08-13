import { route, readJson, readQuery } from "@/lib/cos/api";
import { createTask, listTasks } from "@/lib/cos/services/tasks";
import { taskCreateSchema, taskQuerySchema } from "@/lib/cos/schemas";

export const GET = route({ permission: "task:read" }, async (ctx, request) => {
  const query = readQuery(request, taskQuerySchema.partial());
  return listTasks(ctx, query);
});

export const POST = route({ permission: "task:write" }, async (ctx, request) => {
  const input = await readJson(request, taskCreateSchema);
  return createTask(ctx, input);
});
