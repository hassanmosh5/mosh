import { readJson, route } from "@/lib/mosh/api";
import { profileSchema } from "@/lib/mosh/schemas";
import { getProfile, saveProfile } from "@/lib/mosh/services/profile";

export const GET = route({}, async (ctx) => getProfile(ctx));

export const PATCH = route({}, async (ctx, request) => {
  const input = await readJson(request, profileSchema);
  return saveProfile(ctx, input);
});
