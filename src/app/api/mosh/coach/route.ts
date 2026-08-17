import { readJson, readQuery, route } from "@/lib/mosh/api";
import { coachRequestSchema } from "@/lib/mosh/schemas";
import { deleteSession, listSessions, reflect } from "@/lib/mosh/services/coach";
import { z } from "zod";

export const GET = route({}, async (ctx, request) => {
  const { take } = readQuery(
    request,
    z.object({ take: z.coerce.number().int().min(1).max(100).default(20) })
  );
  return { sessions: await listSessions(ctx, take) };
});

/**
 * Coaching runs on the AI rate-limit bucket: it is the one endpoint here that
 * can call a model, and it should be the first thing throttled under load.
 */
export const POST = route({ limit: "ai" }, async (ctx, request) => {
  const input = await readJson(request, coachRequestSchema);
  return reflect(ctx, input);
});

export const DELETE = route({}, async (ctx, request) => {
  const { id } = readQuery(request, z.object({ id: z.string().trim().min(1).max(40) }));
  return deleteSession(ctx, id);
});
