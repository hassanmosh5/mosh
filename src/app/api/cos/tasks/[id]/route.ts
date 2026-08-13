import { route, readJson } from "@/lib/cos/api";
import { getTask, updateTask, deleteTask } from "@/lib/cos/services/tasks";
import { taskUpdateSchema } from "@/lib/cos/schemas";

export const GET = route<{ id: string }>({ permission: "task:read" }, async (ctx, _request, { id }) =>
  getTask(ctx, id)
);

export const PATCH = route<{ id: string }>({ permission: "task:write" }, async (ctx, request, { id }) => {
  const input = await readJson(request, taskUpdateSchema);
  return updateTask(ctx, id, input);
});

export const DELETE = route<{ id: string }>({ permission: "task:delete" }, async (ctx, _request, { id }) =>
  deleteTask(ctx, id)
);
