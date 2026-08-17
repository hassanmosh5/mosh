import { prisma } from "@/lib/prisma";
import type { MoshLifeArea } from "@/generated/prisma/enums";
import type { MoshContext } from "../context";
import { LIFE_AREAS } from "../constants";
import { addDays, eachWeek, toIsoDate, weekStart, today } from "../dates";
import { scoreWeek } from "../scoring";
import type { WeeklyEntryInput } from "../schemas";

/**
 * The weekly tracker.
 *
 * A week holds one goal set across the five life areas. Momentum is derived
 * from those goals *and* from the days inside the week, so a week of good
 * intentions with no lived days cannot score as well as a week that was
 * actually walked.
 */

export type WeeklyGoalView = {
  id: string;
  area: MoshLifeArea;
  goal: string;
  progress: string | null;
  completion: number;
  position: number;
};

export type WeeklyEntryView = {
  weekStart: string;
  weekEnd: string;
  intention: string | null;
  review: string | null;
  momentum: number;
  goals: WeeklyGoalView[];
  /** Average daily alignment for the days recorded inside the week. */
  dailyAlignment: number | null;
  daysRecorded: number;
  byArea: { area: MoshLifeArea; label: string; completion: number | null; goals: number }[];
};

async function dailyAlignmentsForWeek(ctx: MoshContext, start: Date): Promise<number[]> {
  const rows = await prisma.moshDailyEntry.findMany({
    where: { userId: ctx.userId, date: { gte: start, lte: addDays(start, 6) } },
    select: { alignment: true },
  });
  return rows.map((row) => row.alignment);
}

function summarise(
  start: Date,
  goals: WeeklyGoalView[],
  intention: string | null,
  review: string | null,
  alignments: number[]
): WeeklyEntryView {
  const momentum = scoreWeek({ goals, dailyAlignments: alignments }).score;

  const byArea = LIFE_AREAS.map(({ area, label }) => {
    const areaGoals = goals.filter((goal) => goal.area === area);
    const completion =
      areaGoals.length === 0
        ? null
        : Math.round(
            areaGoals.reduce((sum, goal) => sum + goal.completion, 0) / areaGoals.length
          );
    return { area, label, completion, goals: areaGoals.length };
  });

  return {
    weekStart: toIsoDate(start),
    weekEnd: toIsoDate(addDays(start, 6)),
    intention,
    review,
    momentum,
    goals,
    dailyAlignment:
      alignments.length === 0
        ? null
        : Math.round(alignments.reduce((sum, value) => sum + value, 0) / alignments.length),
    daysRecorded: alignments.length,
    byArea,
  };
}

export async function getWeek(ctx: MoshContext, anchor?: Date): Promise<WeeklyEntryView> {
  const start = weekStart(anchor ?? today());

  const [entry, alignments] = await Promise.all([
    prisma.moshWeeklyEntry.findUnique({
      where: { userId_weekStart: { userId: ctx.userId, weekStart: start } },
      include: { goals: { orderBy: [{ area: "asc" }, { position: "asc" }] } },
    }),
    dailyAlignmentsForWeek(ctx, start),
  ]);

  const goals: WeeklyGoalView[] =
    entry?.goals.map((goal) => ({
      id: goal.id,
      area: goal.area,
      goal: goal.goal,
      progress: goal.progress,
      completion: goal.completion,
      position: goal.position,
    })) ?? [];

  return summarise(start, goals, entry?.intention ?? null, entry?.review ?? null, alignments);
}

/**
 * Save a week and its goals.
 *
 * The goal list is authoritative: goals missing from the payload are deleted,
 * which is what makes "remove a goal" work with a single save.
 */
export async function saveWeek(
  ctx: MoshContext,
  input: WeeklyEntryInput
): Promise<WeeklyEntryView> {
  const start = weekStart(new Date(`${input.weekStart}T00:00:00.000Z`));
  const alignments = await dailyAlignmentsForWeek(ctx, start);

  const momentum = scoreWeek({ goals: input.goals, dailyAlignments: alignments }).score;

  const entry = await prisma.moshWeeklyEntry.upsert({
    where: { userId_weekStart: { userId: ctx.userId, weekStart: start } },
    create: {
      userId: ctx.userId,
      weekStart: start,
      intention: input.intention,
      review: input.review,
      momentum,
    },
    update: { intention: input.intention, review: input.review, momentum },
  });

  const keepIds = input.goals.map((goal) => goal.id).filter((id): id is string => Boolean(id));

  await prisma.$transaction([
    prisma.moshWeeklyGoal.deleteMany({
      where: { weeklyId: entry.id, ...(keepIds.length ? { id: { notIn: keepIds } } : {}) },
    }),
    ...input.goals.map((goal, index) =>
      goal.id
        ? prisma.moshWeeklyGoal.update({
            where: { id: goal.id },
            data: {
              area: goal.area,
              goal: goal.goal,
              progress: goal.progress,
              completion: goal.completion,
              position: index,
            },
          })
        : prisma.moshWeeklyGoal.create({
            data: {
              weeklyId: entry.id,
              area: goal.area,
              goal: goal.goal,
              progress: goal.progress,
              completion: goal.completion,
              position: index,
            },
          })
    ),
  ]);

  return getWeek(ctx, start);
}

export type WeeklyTrendPoint = { weekStart: string; momentum: number; goals: number };

/** Momentum for the last `weeks` weeks, oldest first, with gaps filled at 0. */
export async function weeklyTrend(ctx: MoshContext, weeks = 12): Promise<WeeklyTrendPoint[]> {
  const end = weekStart(today());
  const start = addDays(end, -(weeks - 1) * 7);

  const rows = await prisma.moshWeeklyEntry.findMany({
    where: { userId: ctx.userId, weekStart: { gte: start, lte: end } },
    include: { _count: { select: { goals: true } } },
    orderBy: { weekStart: "asc" },
  });

  const byWeek = new Map(rows.map((row) => [toIsoDate(row.weekStart), row]));

  return eachWeek(start, end).map((week) => {
    const iso = toIsoDate(week);
    const row = byWeek.get(iso);
    return { weekStart: iso, momentum: row?.momentum ?? 0, goals: row?._count.goals ?? 0 };
  });
}

/** Momentum values for every week that starts inside a month. */
export async function momentumInRange(
  ctx: MoshContext,
  range: { from: Date; to: Date }
): Promise<number[]> {
  const rows = await prisma.moshWeeklyEntry.findMany({
    where: { userId: ctx.userId, weekStart: { gte: range.from, lte: range.to } },
    select: { momentum: true },
  });
  return rows.map((row) => row.momentum);
}
