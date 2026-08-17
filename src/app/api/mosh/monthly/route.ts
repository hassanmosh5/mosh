import { readJson, readQuery, route } from "@/lib/mosh/api";
import { fromIsoDate } from "@/lib/mosh/dates";
import { monthlyQuerySchema, monthlyReviewSchema } from "@/lib/mosh/schemas";
import { getMonth, monthlyTrend, saveMonth } from "@/lib/mosh/services/monthly";

export const GET = route({}, async (ctx, request) => {
  const query = readQuery(request, monthlyQuerySchema);
  const [review, trend] = await Promise.all([
    getMonth(ctx, query.month ? fromIsoDate(query.month) : undefined),
    monthlyTrend(ctx, query.months ?? 12),
  ]);
  return { review, trend };
});

export const POST = route({}, async (ctx, request) => {
  const input = await readJson(request, monthlyReviewSchema);
  return saveMonth(ctx, input);
});
