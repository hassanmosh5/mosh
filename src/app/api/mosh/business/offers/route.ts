import { readJson, readQuery, route } from "@/lib/mosh/api";
import { offerSchema } from "@/lib/mosh/schemas";
import { deleteOffer, saveOffer } from "@/lib/mosh/services/business";
import { z } from "zod";

export const POST = route({}, async (ctx, request) => {
  const input = await readJson(request, offerSchema);
  return saveOffer(ctx, input);
});

export const DELETE = route({}, async (ctx, request) => {
  const { id } = readQuery(request, z.object({ id: z.string().trim().min(1).max(40) }));
  return deleteOffer(ctx, id);
});
