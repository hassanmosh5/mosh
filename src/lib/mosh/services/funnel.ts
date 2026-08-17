import { prisma } from "@/lib/prisma";
import type { MoshContext } from "../context";
import { FUNNEL_STAGES, type FunnelStageKey } from "../constants";
import { addDays, fromIsoDate, toIsoDate, today } from "../dates";
import { analyseFunnel, type FunnelCounts } from "../scoring";
import type { funnelSnapshotSchema } from "../schemas";
import type { z } from "zod";

/**
 * The customer funnel.
 *
 * Snapshots are cumulative counts taken on a date, not events — which is what
 * makes them cheap enough to actually keep up with. The latest snapshot drives
 * the funnel visual; the series drives the trend.
 */

export type FunnelView = {
  latest: { date: string; counts: FunnelCounts } | null;
  stages: ReturnType<typeof analyseFunnel>["stages"];
  overallConversion: number | null;
  weakestStep: ReturnType<typeof analyseFunnel>["weakestStep"];
  history: ({ date: string } & FunnelCounts)[];
};

const emptyCounts = (): FunnelCounts =>
  Object.fromEntries(FUNNEL_STAGES.map((stage) => [stage.key, 0])) as FunnelCounts;

function countsOf(row: Record<string, unknown>): FunnelCounts {
  return Object.fromEntries(
    FUNNEL_STAGES.map((stage) => [stage.key, Number(row[stage.key] ?? 0)])
  ) as FunnelCounts;
}

export async function getFunnel(ctx: MoshContext, days = 180): Promise<FunnelView> {
  const to = today();
  const from = addDays(to, -days);

  const rows = await prisma.moshFunnelSnapshot.findMany({
    where: { userId: ctx.userId, date: { gte: from, lte: to } },
    orderBy: { date: "asc" },
  });

  const history = rows.map((row) => ({ date: toIsoDate(row.date), ...countsOf(row) }));
  const last = rows[rows.length - 1];
  const counts = last ? countsOf(last) : emptyCounts();
  const analysis = analyseFunnel(counts);

  return {
    latest: last ? { date: toIsoDate(last.date), counts } : null,
    stages: analysis.stages,
    overallConversion: analysis.overallConversion,
    weakestStep: analysis.weakestStep,
    history,
  };
}

export async function saveSnapshot(
  ctx: MoshContext,
  input: z.infer<typeof funnelSnapshotSchema>
) {
  const date = fromIsoDate(input.date);
  const data = Object.fromEntries(
    FUNNEL_STAGES.map((stage) => [stage.key, input[stage.key as FunnelStageKey]])
  );

  return prisma.moshFunnelSnapshot.upsert({
    where: { userId_date: { userId: ctx.userId, date } },
    create: { userId: ctx.userId, date, ...data },
    update: data,
  });
}

export async function deleteSnapshot(ctx: MoshContext, isoDate: string) {
  await prisma.moshFunnelSnapshot.deleteMany({
    where: { userId: ctx.userId, date: fromIsoDate(isoDate) },
  });
  return { ok: true };
}
