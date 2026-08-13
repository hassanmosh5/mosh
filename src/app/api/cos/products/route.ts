import { route, readJson } from "@/lib/cos/api";
import { listProducts, createProduct } from "@/lib/cos/services/content";
import { productCreateSchema } from "@/lib/cos/schemas";

export const GET = route({ permission: "product:read" }, async (ctx) => ({
  items: await listProducts(ctx),
}));

export const POST = route({ permission: "product:write" }, async (ctx, request) => {
  const input = await readJson(request, productCreateSchema);
  return createProduct(ctx, input);
});
