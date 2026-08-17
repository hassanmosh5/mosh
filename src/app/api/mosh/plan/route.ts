import { readJson, readQuery, route } from "@/lib/mosh/api";
import { getYearPlan, saveYearPlan } from "@/lib/mosh/services/plan";
import { yearPlanSchema } from "@/lib/mosh/schemas";
import { z } from "zod";

const querySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100).optional(),
});

export const GET = route({}, async (ctx, request) => {
  const query = readQuery(request, querySchema);
  return getYearPlan(ctx, query.year);
});

export const PUT = route({}, async (ctx, request) => {
  const input = await readJson(request, yearPlanSchema);
  return saveYearPlan(ctx, input);
});
