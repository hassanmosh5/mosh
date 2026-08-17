import { readJson, readQuery, route } from "@/lib/mosh/api";
import { dailyEntrySchema, dailyQuerySchema } from "@/lib/mosh/schemas";
import { getDay, saveDay } from "@/lib/mosh/services/daily";

export const GET = route({}, async (ctx, request) => {
  const query = readQuery(request, dailyQuerySchema);
  return getDay(ctx, query.date);
});

export const POST = route({}, async (ctx, request) => {
  const input = await readJson(request, dailyEntrySchema);
  return saveDay(ctx, input);
});
