import { readQuery, route } from "@/lib/mosh/api";
import { weeklyQuerySchema } from "@/lib/mosh/schemas";
import { weeklyTrend } from "@/lib/mosh/services/weekly";

export const GET = route({}, async (ctx, request) => {
  const query = readQuery(request, weeklyQuerySchema);
  return { weeks: await weeklyTrend(ctx, query.weeks ?? 12) };
});
