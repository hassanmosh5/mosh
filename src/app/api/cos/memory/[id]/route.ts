import { route, readJson } from "@/lib/cos/api";
import { updateMemory, deleteMemory } from "@/lib/cos/services/knowledge";
import { memoryUpdateSchema } from "@/lib/cos/schemas";

export const PATCH = route<{ id: string }>({ permission: "memory:write" }, async (ctx, request, { id }) => {
  const input = await readJson(request, memoryUpdateSchema);
  return updateMemory(ctx, id, input);
});

export const DELETE = route<{ id: string }>({ permission: "memory:delete" }, async (ctx, _request, { id }) =>
  deleteMemory(ctx, id)
);
