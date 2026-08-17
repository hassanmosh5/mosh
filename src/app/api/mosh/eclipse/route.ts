import { readJson, route } from "@/lib/mosh/api";
import { eclipseStartSchema, eclipseUpdateSchema } from "@/lib/mosh/schemas";
import { getEclipse, startEclipse, updateEclipseDay } from "@/lib/mosh/services/eclipse";

export const GET = route({}, async (ctx) => getEclipse(ctx));

export const PATCH = route({}, async (ctx, request) => {
  const input = await readJson(request, eclipseUpdateSchema);
  return updateEclipseDay(ctx, input);
});

/** Start (or restart) the 50-day clock. */
export const POST = route({}, async (ctx, request) => {
  const input = await readJson(request, eclipseStartSchema);
  return startEclipse(ctx, input);
});
