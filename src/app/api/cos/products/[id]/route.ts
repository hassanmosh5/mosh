import { route, readJson } from "@/lib/cos/api";
import { getProduct, updateProduct, deleteProduct } from "@/lib/cos/services/content";
import { productUpdateSchema } from "@/lib/cos/schemas";

export const GET = route<{ id: string }>({ permission: "product:read" }, async (ctx, _request, { id }) =>
  getProduct(ctx, id)
);

export const PATCH = route<{ id: string }>({ permission: "product:write" }, async (ctx, request, { id }) => {
  const input = await readJson(request, productUpdateSchema);
  return updateProduct(ctx, id, input);
});

export const DELETE = route<{ id: string }>({ permission: "product:delete" }, async (ctx, _request, { id }) =>
  deleteProduct(ctx, id)
);
