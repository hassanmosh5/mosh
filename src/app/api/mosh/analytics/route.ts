import { readQuery, route } from "@/lib/mosh/api";
import { analyticsQuerySchema } from "@/lib/mosh/schemas";
import { getAnalytics } from "@/lib/mosh/services/analytics";

export const GET = route({}, async (ctx, request) => {
  const query = readQuery(request, analyticsQuerySchema);
  return getAnalytics(ctx, query.days);
});
