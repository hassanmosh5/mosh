import { route, readQuery } from "@/lib/cos/api";
import { globalSearch } from "@/lib/cos/services/search";
import { searchSchema } from "@/lib/cos/schemas";

export const GET = route({ permission: "task:read" }, async (ctx, request) => {
  const { q, take } = readQuery(request, searchSchema);
  return { results: await globalSearch(ctx, q, take) };
});
