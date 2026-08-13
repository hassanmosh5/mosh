import { route, readJson } from "@/lib/cos/api";
import { listMemories, upsertMemory } from "@/lib/cos/services/knowledge";
import { memoryCreateSchema } from "@/lib/cos/schemas";

export const GET = route({ permission: "memory:read" }, async (ctx) => ({
  items: await listMemories(ctx),
}));

export const POST = route({ permission: "memory:write" }, async (ctx, request) => {
  const input = await readJson(request, memoryCreateSchema);
  return upsertMemory(ctx, input);
});
