import { readQuery, route } from "@/lib/mosh/api";
import { addDays, fromIsoDate, today } from "@/lib/mosh/dates";
import { dailyQuerySchema } from "@/lib/mosh/schemas";
import { getStreak, listDays } from "@/lib/mosh/services/daily";

export const GET = route({}, async (ctx, request) => {
  const query = readQuery(request, dailyQuerySchema);
  const to = query.to ? fromIsoDate(query.to) : today();
  const from = query.from ? fromIsoDate(query.from) : addDays(to, -29);

  const [days, streak] = await Promise.all([listDays(ctx, { from, to }), getStreak(ctx)]);
  return { days, streak };
});
