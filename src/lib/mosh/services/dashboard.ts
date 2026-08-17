import { prisma } from "@/lib/prisma";
import type { MoshPlane } from "@/generated/prisma/enums";
import type { MoshContext } from "../context";
import { MOSH_HABITS, MOSH_PLANES, PLANE_LABELS } from "../constants";
import { addDays, formatShortDate, fromIsoDate, monthStart, toIsoDate, today } from "../dates";
import { labelForScore, toneForScore } from "../scoring";
import { recommendationsFrom } from "../coach";
import { getDay, getStreak, listDays } from "./daily";
import { getWeek } from "./weekly";
import { getMonth } from "./monthly";
import { getYearPlan } from "./plan";
import { wealthFlowForMonth } from "./business";
import { getEclipse } from "./eclipse";
import { gatherSignals } from "./coach";

/**
 * The main dashboard.
 *
 * One query set, one shape: four progress bars (daily, weekly, monthly,
 * wealth) and four meters (mental, spiritual, physical, annual), plus the
 * trend line and the day's rhythm. Every value comes from the same services
 * the individual modules use, so the dashboard and the page you drill into can
 * never disagree.
 */

export type ScoreBar = {
  key: string;
  label: string;
  description: string;
  value: number;
  tone: ReturnType<typeof toneForScore>;
  band: string;
  href: string;
  detail?: string;
};

export type PlaneMeter = {
  plane: MoshPlane | "ANNUAL";
  label: string;
  tagline: string;
  value: number;
  tone: ReturnType<typeof toneForScore>;
  band: string;
  samples: number;
};

export type DashboardView = {
  date: string;
  greetingName: string;
  philosophy: string;
  bars: ScoreBar[];
  meters: PlaneMeter[];
  streak: { current: number; longest: number; qualifyingDays: number };
  trend: { date: string; label: string; alignment: number; completion: number }[];
  todayHabits: { key: string; label: string; done: boolean }[];
  eclipse: { day: number | null; focus: string | null; action: string | null; progress: number };
  wealth: { index: number; target: number; progress: number; currency: string };
  recommendations: string[];
};

/** Average plane scores over a trailing window, blended from self-ratings. */
async function planeMeters(ctx: MoshContext, days = 14): Promise<PlaneMeter[]> {
  const to = today();
  const from = addDays(to, -(days - 1));

  const rows = await prisma.moshPlaneCheckin.groupBy({
    by: ["plane"],
    where: { userId: ctx.userId, date: { gte: from, lte: to } },
    _avg: { score: true },
    _count: { score: true },
  });

  const byPlane = new Map(rows.map((row) => [row.plane, row]));

  return MOSH_PLANES.map((definition) => {
    const row = byPlane.get(definition.plane);
    const value = row?._avg.score ? Math.round(row._avg.score * 10) : 0;
    return {
      plane: definition.plane,
      label: PLANE_LABELS[definition.plane],
      tagline: definition.tagline,
      value,
      tone: toneForScore(value),
      band: labelForScore(value),
      samples: row?._count.score ?? 0,
    };
  });
}

export async function getDashboard(ctx: MoshContext): Promise<DashboardView> {
  const now = today();

  const [day, week, month, plan, wealth, eclipse, streak, meters, history, signals] =
    await Promise.all([
      getDay(ctx),
      getWeek(ctx),
      getMonth(ctx),
      getYearPlan(ctx),
      wealthFlowForMonth(ctx, monthStart(now)),
      getEclipse(ctx),
      getStreak(ctx),
      planeMeters(ctx),
      listDays(ctx, { from: addDays(now, -13), to: now }),
      gatherSignals(ctx),
    ]);

  const bars: ScoreBar[] = [
    {
      key: "daily",
      label: "Daily Alignment Score",
      description: "Today's rhythm, plane check-in, energy and mood.",
      value: day.alignment,
      tone: toneForScore(day.alignment),
      band: labelForScore(day.alignment),
      href: "/mosh/daily",
      detail: `${day.completion}% of the seven-habit rhythm complete`,
    },
    {
      key: "weekly",
      label: "Weekly Momentum Score",
      description: "This week's goals across the five areas, and the days you actually lived.",
      value: week.momentum,
      tone: toneForScore(week.momentum),
      band: labelForScore(week.momentum),
      href: "/mosh/weekly",
      detail: `${week.goals.length} goal${week.goals.length === 1 ? "" : "s"} · ${week.daysRecorded}/7 days recorded`,
    },
    {
      key: "monthly",
      label: "Monthly Growth Score",
      description: "Pillar progress, weekly momentum and the honesty of the review.",
      value: month.growth,
      tone: toneForScore(month.growth),
      band: labelForScore(month.growth),
      href: "/mosh/monthly",
      detail: `${month.answered}/${month.totalQuestions} review questions answered`,
    },
    {
      key: "wealth",
      label: "Wealth Flow Index",
      description: "(Attraction × 1) + (Core × 2) + (Premium × 3), against this month's target.",
      value: wealth.progress,
      tone: toneForScore(wealth.progress),
      band: labelForScore(wealth.progress),
      href: "/mosh/business",
      detail: `Index ${Math.round(wealth.index).toLocaleString()} of ${Math.round(wealth.target).toLocaleString()} ${ctx.currency}`,
    },
  ];

  const annual: PlaneMeter = {
    plane: "ANNUAL",
    label: "Annual",
    tagline: `${plan.year} · ${plan.milestonesDone}/${plan.milestonesTotal} milestones`,
    value: plan.annualAlignment,
    tone: toneForScore(plan.annualAlignment),
    band: labelForScore(plan.annualAlignment),
    samples: plan.milestonesTotal,
  };

  const currentEclipseDay = eclipse.currentDay
    ? eclipse.days.find((entry) => entry.day === eclipse.currentDay)
    : null;

  return {
    date: toIsoDate(now),
    greetingName: ctx.displayName,
    philosophy: ctx.philosophy,
    bars,
    meters: [...meters, annual],
    streak: {
      current: streak.current,
      longest: streak.longest,
      qualifyingDays: streak.qualifyingDays,
    },
    trend: history.map((point) => ({
      date: point.date,
      label: formatShortDate(fromIsoDate(point.date)),
      alignment: point.alignment,
      completion: point.completion,
    })),
    todayHabits: MOSH_HABITS.map((habit) => ({
      key: habit.key,
      label: habit.label,
      done: day.habits[habit.key],
    })),
    eclipse: {
      day: eclipse.currentDay,
      focus: currentEclipseDay?.focus ?? null,
      action: currentEclipseDay?.action ?? null,
      progress: eclipse.progress,
    },
    wealth: {
      index: wealth.index,
      target: wealth.target,
      progress: wealth.progress,
      currency: ctx.currency,
    },
    recommendations: recommendationsFrom(signals),
  };
}
