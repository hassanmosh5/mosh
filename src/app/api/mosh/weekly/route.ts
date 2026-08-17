import { readJson, readQuery, route } from "@/lib/mosh/api";
import { fromIsoDate } from "@/lib/mosh/dates";
import { weeklyEntrySchema, weeklyQuerySchema } from "@/lib/mosh/schemas";
import { getWeek, saveWeek } from "@/lib/mosh/services/weekly";

export const GET = route({}, async (ctx, request) => {
  const query = readQuery(request, weeklyQuerySchema);
  return getWeek(ctx, query.weekStart ? fromIsoDate(query.weekStart) : undefined);
});

export const POST = route({}, async (ctx, request) => {
  const input = await readJson(request, weeklyEntrySchema);
  return saveWeek(ctx, input);
});
