import { readJson, readQuery, route } from "@/lib/mosh/api";
import { milestoneCreateSchema, milestoneUpdateSchema } from "@/lib/mosh/schemas";
import { createMilestone, deleteMilestone, updateMilestone } from "@/lib/mosh/services/plan";
import { z } from "zod";

export const POST = route({}, async (ctx, request) => {
  const input = await readJson(request, milestoneCreateSchema);
  return createMilestone(ctx, input);
});

export const PATCH = route({}, async (ctx, request) => {
  const input = await readJson(request, milestoneUpdateSchema);
  return updateMilestone(ctx, input);
});

export const DELETE = route({}, async (ctx, request) => {
  const { id } = readQuery(request, z.object({ id: z.string().trim().min(1).max(40) }));
  return deleteMilestone(ctx, id);
});
