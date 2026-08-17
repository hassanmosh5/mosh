import { prisma } from "@/lib/prisma";
import type { MoshContext } from "../context";
import { HABIT_KEYS, MOSH_PLANES, PLANE_BY_SLUG, type HabitKey } from "../constants";
import { addDays, fromIsoDate, toIsoDate, today } from "../dates";
import {
  computeStreak,
  habitCompletion,
  scoreDay,
  scorePlanesForDay,
  type DailyHabits,
} from "../scoring";
import type { DailyEntryInput } from "../schemas";

/**
 * The daily tracker.
 *
 * One row per user per day, upserted on the `(userId, date)` unique key — the
 * tracker can be saved as many times as the day needs without ever forking.
 * `completion` and `alignment` are recomputed on every write so the stored
 * numbers can never drift from the entries behind them.
 */

export type DailyEntryView = {
  date: string;
  habits: DailyHabits;
  gratitude: string | null;
  wins: string | null;
  reflection: string | null;
  energy: number | null;
  mood: number | null;
  completion: number;
  alignment: number;
  checkins: Record<string, number>;
  planes: Record<string, number | null>;
};

type EntryRow = {
  date: Date;
  gratitude: string | null;
  wins: string | null;
  reflection: string | null;
  energy: number | null;
  mood: number | null;
  completion: number;
  alignment: number;
} & Record<HabitKey, boolean>;

function habitsOf(row: Record<HabitKey, boolean>): DailyHabits {
  return Object.fromEntries(HABIT_KEYS.map((key) => [key, row[key] ?? false])) as DailyHabits;
}

const emptyHabits = (): DailyHabits =>
  Object.fromEntries(HABIT_KEYS.map((key) => [key, false])) as DailyHabits;

function toView(row: EntryRow | null, date: Date, checkins: Record<string, number>): DailyEntryView {
  const habits = row ? habitsOf(row) : emptyHabits();
  const input = {
    habits,
    energy: row?.energy ?? null,
    mood: row?.mood ?? null,
    checkins,
  };
  return {
    date: toIsoDate(date),
    habits,
    gratitude: row?.gratitude ?? null,
    wins: row?.wins ?? null,
    reflection: row?.reflection ?? null,
    energy: row?.energy ?? null,
    mood: row?.mood ?? null,
    completion: habitCompletion(habits),
    alignment: scoreDay(input).score,
    checkins,
    planes: scorePlanesForDay(input),
  };
}

/** Load one day, returning an empty (but valid) view when nothing was saved. */
export async function getDay(ctx: MoshContext, isoDate?: string): Promise<DailyEntryView> {
  const date = isoDate ? fromIsoDate(isoDate) : today();

  const [row, checkins] = await Promise.all([
    prisma.moshDailyEntry.findUnique({
      where: { userId_date: { userId: ctx.userId, date } },
    }),
    prisma.moshPlaneCheckin.findMany({
      where: { userId: ctx.userId, date },
      select: { attribute: true, score: true },
    }),
  ]);

  const checkinMap = Object.fromEntries(checkins.map((row) => [row.attribute, row.score]));
  return toView(row as EntryRow | null, date, checkinMap);
}

/**
 * Save a day. Habits absent from the payload keep their stored value, so a
 * checkbox toggle does not have to send the whole form back.
 */
export async function saveDay(ctx: MoshContext, input: DailyEntryInput): Promise<DailyEntryView> {
  const date = fromIsoDate(input.date);

  const existing = await prisma.moshDailyEntry.findUnique({
    where: { userId_date: { userId: ctx.userId, date } },
  });

  const habits = Object.fromEntries(
    HABIT_KEYS.map((key) => {
      const incoming = input[key];
      const current = existing ? (existing as unknown as Record<HabitKey, boolean>)[key] : false;
      return [key, typeof incoming === "boolean" ? incoming : current];
    })
  ) as DailyHabits;

  // Plane check-ins are written first so the day's alignment score is computed
  // from the same values that will be read back.
  const incomingCheckins = input.checkins ?? {};
  const checkinEntries = Object.entries(incomingCheckins);
  if (checkinEntries.length > 0) {
    await prisma.$transaction(
      checkinEntries.map(([attribute, score]) =>
        score === null || score === undefined
          ? prisma.moshPlaneCheckin.deleteMany({
              where: { userId: ctx.userId, date, attribute },
            })
          : prisma.moshPlaneCheckin.upsert({
              where: { userId_date_attribute: { userId: ctx.userId, date, attribute } },
              create: {
                userId: ctx.userId,
                date,
                attribute,
                plane: PLANE_BY_SLUG[attribute],
                score,
              },
              update: { score },
            })
      )
    );
  }

  const storedCheckins = await prisma.moshPlaneCheckin.findMany({
    where: { userId: ctx.userId, date },
    select: { attribute: true, score: true },
  });
  const checkinMap = Object.fromEntries(storedCheckins.map((row) => [row.attribute, row.score]));

  const energy = input.energy === undefined ? (existing?.energy ?? null) : input.energy;
  const mood = input.mood === undefined ? (existing?.mood ?? null) : input.mood;

  const completion = habitCompletion(habits);
  const alignment = scoreDay({ habits, energy, mood, checkins: checkinMap }).score;

  const data = {
    ...habits,
    gratitude: input.gratitude ?? existing?.gratitude ?? null,
    wins: input.wins ?? existing?.wins ?? null,
    reflection: input.reflection ?? existing?.reflection ?? null,
    energy,
    mood,
    completion,
    alignment,
  };

  const row = await prisma.moshDailyEntry.upsert({
    where: { userId_date: { userId: ctx.userId, date } },
    create: { userId: ctx.userId, date, ...data },
    update: data,
  });

  return toView(row as EntryRow, date, checkinMap);
}

export type DailyHistoryPoint = {
  date: string;
  completion: number;
  alignment: number;
  energy: number | null;
  mood: number | null;
};

/** Day-by-day history, oldest first, for charts and exports. */
export async function listDays(
  ctx: MoshContext,
  range: { from: Date; to: Date }
): Promise<DailyHistoryPoint[]> {
  const rows = await prisma.moshDailyEntry.findMany({
    where: { userId: ctx.userId, date: { gte: range.from, lte: range.to } },
    orderBy: { date: "asc" },
    select: { date: true, completion: true, alignment: true, energy: true, mood: true },
  });

  return rows.map((row) => ({
    date: toIsoDate(row.date),
    completion: row.completion,
    alignment: row.alignment,
    energy: row.energy,
    mood: row.mood,
  }));
}

/** Streak over the trailing `days` window (default one year). */
export async function getStreak(ctx: MoshContext, days = 365) {
  const to = today();
  const from = addDays(to, -days);
  const rows = await prisma.moshDailyEntry.findMany({
    where: { userId: ctx.userId, date: { gte: from, lte: to } },
    select: { date: true, completion: true },
    orderBy: { date: "asc" },
  });
  return computeStreak(rows, to);
}

/** Per-habit completion rate across a window — the habit analytics table. */
export async function habitBreakdown(ctx: MoshContext, range: { from: Date; to: Date }) {
  const rows = await prisma.moshDailyEntry.findMany({
    where: { userId: ctx.userId, date: { gte: range.from, lte: range.to } },
  });

  const total = rows.length;
  return HABIT_KEYS.map((key) => {
    const done = rows.filter((row) => (row as unknown as Record<HabitKey, boolean>)[key]).length;
    return {
      key,
      done,
      total,
      rate: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  });
}

/** Average self-rating per attribute over a window, grouped by plane. */
export async function planeBreakdown(ctx: MoshContext, range: { from: Date; to: Date }) {
  const rows = await prisma.moshPlaneCheckin.groupBy({
    by: ["attribute"],
    where: { userId: ctx.userId, date: { gte: range.from, lte: range.to } },
    _avg: { score: true },
    _count: { score: true },
  });

  const byAttribute = new Map(rows.map((row) => [row.attribute, row]));

  return MOSH_PLANES.map((plane) => ({
    plane: plane.plane,
    label: plane.label,
    tagline: plane.tagline,
    attributes: plane.attributes.map((attribute) => {
      const row = byAttribute.get(attribute.slug);
      const avg = row?._avg.score ?? null;
      return {
        slug: attribute.slug,
        label: attribute.label,
        hint: attribute.hint,
        average: avg === null ? null : Math.round(avg * 10) / 10,
        samples: row?._count.score ?? 0,
        /** 0-100 so it can share the meter component with every other score. */
        score: avg === null ? null : Math.round(avg * 10),
      };
    }),
  }));
}
