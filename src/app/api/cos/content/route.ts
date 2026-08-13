import { route, readJson } from "@/lib/cos/api";
import { listContent, createContentItem } from "@/lib/cos/services/content";
import { contentCreateSchema } from "@/lib/cos/schemas";

export const GET = route({ permission: "content:read" }, async (ctx) => ({
  items: await listContent(ctx),
}));

export const POST = route({ permission: "content:write" }, async (ctx, request) => {
  const input = await readJson(request, contentCreateSchema);
  return createContentItem(ctx, input);
});
