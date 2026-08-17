import { readJson, readQuery, route } from "@/lib/mosh/api";
import { funnelSnapshotSchema, isoDate } from "@/lib/mosh/schemas";
import { deleteSnapshot, getFunnel, saveSnapshot } from "@/lib/mosh/services/funnel";
import { z } from "zod";

export const GET = route({}, async (ctx, request) => {
  const { days } = readQuery(
    request,
    z.object({ days: z.coerce.number().int().min(7).max(730).default(180) })
  );
  return getFunnel(ctx, days);
});

export const POST = route({}, async (ctx, request) => {
  const input = await readJson(request, funnelSnapshotSchema);
  await saveSnapshot(ctx, input);
  return getFunnel(ctx);
});

export const DELETE = route({}, async (ctx, request) => {
  const { date } = readQuery(request, z.object({ date: isoDate }));
  await deleteSnapshot(ctx, date);
  return getFunnel(ctx);
});
