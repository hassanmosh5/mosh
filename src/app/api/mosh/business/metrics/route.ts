import { readJson, route } from "@/lib/mosh/api";
import { offerMetricSchema } from "@/lib/mosh/schemas";
import { saveOfferMetric } from "@/lib/mosh/services/business";

export const POST = route({}, async (ctx, request) => {
  const input = await readJson(request, offerMetricSchema);
  return saveOfferMetric(ctx, input);
});
