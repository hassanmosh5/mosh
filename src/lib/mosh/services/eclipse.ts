import { prisma } from "@/lib/prisma";
import type { MoshEclipsePhase } from "@/generated/prisma/enums";
import type { MoshContext } from "../context";
import { ECLIPSE_PHASES, ECLIPSE_PLAN, ECLIPSE_TOTAL_DAYS } from "../constants";
import { addDays, daysBetween, fromIsoDate, toIsoDate, today } from "../dates";
import type { eclipseStartSchema, eclipseUpdateSchema } from "../schemas";
import type { z } from "zod";

/**
 * The 50-Day Eclipse Growth Strategy.
 *
 * Fifty dated actions in five phases. The plan is materialised into rows on
 * first access so the user's notes and completions have somewhere to live, and
 * so a future edit to the template never rewrites history someone already
 * walked through.
 */

export type EclipseDayView = {
  day: number;
  phase: MoshEclipsePhase;
  focus: string;
  action: string;
  done: boolean;
  note: string | null;
  /** Calendar date this day falls on, once a start date is set. */
  date: string | null;
  isToday: boolean;
  isPast: boolean;
};

export type EclipsePhaseView = {
  phase: MoshEclipsePhase;
  number: number;
  label: string;
  promise: string;
  range: [number, number];
  done: number;
  total: number;
  progress: number;
  isCurrent: boolean;
};

export type EclipseView = {
  startDate: string | null;
  currentDay: number | null;
  days: EclipseDayView[];
  phases: EclipsePhaseView[];
  done: number;
  total: number;
  progress: number;
};

async function ensureDays(ctx: MoshContext) {
  const count = await prisma.moshEclipseDay.count({ where: { userId: ctx.userId } });
  if (count >= ECLIPSE_TOTAL_DAYS) return;

  await prisma.moshEclipseDay.createMany({
    data: ECLIPSE_PLAN.map((template) => ({
      userId: ctx.userId,
      day: template.day,
      phase: template.phase,
      focus: template.focus,
      action: template.action,
    })),
    skipDuplicates: true,
  });
}

export async function getEclipse(ctx: MoshContext): Promise<EclipseView> {
  await ensureDays(ctx);

  const rows = await prisma.moshEclipseDay.findMany({
    where: { userId: ctx.userId },
    orderBy: { day: "asc" },
  });

  const start = ctx.eclipseStart;
  const now = today();
  const currentDay = start ? Math.min(ECLIPSE_TOTAL_DAYS, daysBetween(start, now) + 1) : null;

  const days: EclipseDayView[] = rows.map((row) => {
    const date = start ? addDays(start, row.day - 1) : null;
    return {
      day: row.day,
      phase: row.phase,
      focus: row.focus,
      action: row.action,
      done: row.done,
      note: row.note,
      date: date ? toIsoDate(date) : null,
      isToday: date ? toIsoDate(date) === toIsoDate(now) : false,
      isPast: date ? date < now : false,
    };
  });

  const phases: EclipsePhaseView[] = ECLIPSE_PHASES.map((phase) => {
    const inPhase = days.filter((day) => day.day >= phase.range[0] && day.day <= phase.range[1]);
    const done = inPhase.filter((day) => day.done).length;
    return {
      phase: phase.phase,
      number: phase.number,
      label: phase.label,
      promise: phase.promise,
      range: phase.range,
      done,
      total: inPhase.length,
      progress: inPhase.length ? Math.round((done / inPhase.length) * 100) : 0,
      isCurrent:
        currentDay !== null && currentDay >= phase.range[0] && currentDay <= phase.range[1],
    };
  });

  const done = days.filter((day) => day.done).length;

  return {
    startDate: start ? toIsoDate(start) : null,
    currentDay: currentDay !== null && currentDay > 0 ? currentDay : null,
    days,
    phases,
    done,
    total: days.length,
    progress: days.length ? Math.round((done / days.length) * 100) : 0,
  };
}

export async function updateEclipseDay(
  ctx: MoshContext,
  input: z.infer<typeof eclipseUpdateSchema>
): Promise<EclipseView> {
  await ensureDays(ctx);

  await prisma.moshEclipseDay.update({
    where: { userId_day: { userId: ctx.userId, day: input.day } },
    data: {
      done: input.done,
      note: input.note,
      completedAt: input.done === undefined ? undefined : input.done ? new Date() : null,
    },
  });

  return getEclipse(ctx);
}

/** Set (or restart) the 50-day clock. */
export async function startEclipse(
  ctx: MoshContext,
  input: z.infer<typeof eclipseStartSchema>
): Promise<EclipseView> {
  await ensureDays(ctx);

  await prisma.moshProfile.update({
    where: { userId: ctx.userId },
    data: { eclipseStart: fromIsoDate(input.startDate) },
  });

  if (input.reset) {
    await prisma.moshEclipseDay.updateMany({
      where: { userId: ctx.userId },
      data: { done: false, note: null, completedAt: null },
    });
  }

  return getEclipse({ ...ctx, eclipseStart: fromIsoDate(input.startDate) });
}
