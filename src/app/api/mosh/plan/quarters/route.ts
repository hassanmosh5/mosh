import { readJson, route } from "@/lib/mosh/api";
import { quarterUpdateSchema } from "@/lib/mosh/schemas";
import { updateQuarter } from "@/lib/mosh/services/plan";

export const PATCH = route({}, async (ctx, request) => {
  const input = await readJson(request, quarterUpdateSchema);
  return updateQuarter(ctx, input);
});
