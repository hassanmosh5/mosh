import { route, readJson } from "@/lib/cos/api";
import { getContentItem, updateContentItem, deleteContentItem } from "@/lib/cos/services/content";
import { contentUpdateSchema } from "@/lib/cos/schemas";

export const GET = route<{ id: string }>({ permission: "content:read" }, async (ctx, _request, { id }) =>
  getContentItem(ctx, id)
);

export const PATCH = route<{ id: string }>({ permission: "content:write" }, async (ctx, request, { id }) => {
  const input = await readJson(request, contentUpdateSchema);
  return updateContentItem(ctx, id, input);
});

export const DELETE = route<{ id: string }>({ permission: "content:delete" }, async (ctx, _request, { id }) =>
  deleteContentItem(ctx, id)
);
