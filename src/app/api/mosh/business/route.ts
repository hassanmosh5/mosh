import { readQuery, route } from "@/lib/mosh/api";
import { businessQuerySchema } from "@/lib/mosh/schemas";
import { getBusiness } from "@/lib/mosh/services/business";

export const GET = route({}, async (ctx, request) => {
  const query = readQuery(request, businessQuerySchema);
  return getBusiness(ctx, query.months ?? 12);
});
