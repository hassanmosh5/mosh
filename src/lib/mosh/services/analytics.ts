import type { MoshContext } from "../context";
import { MOSH_HABITS } from "../constants";
import { addDays, formatShortDate, fromIsoDate, today } from "../dates";
import { average, trendDelta } from "../scoring";
import { getStreak, habitBreakdown, listDays, planeBreakdown } from "./daily";
import { weeklyTrend } from "./weekly";
import { monthlyTrend } from "./monthly";
import { getBusiness } from "./business";
import { getFunnel } from "./funnel";
import { getYearPlan } from "./plan";

/**
 * Analytics.
 *
 * Nothing here is a new source of truth — it is the same records the trackers
 * write, arranged so patterns are visible: which habit is actually carrying
 * the streak, which plane is quietly draining, whether momentum is rising.
 */

export type AnalyticsView = {
  window: { from: string; to: string; days: number };
  streak: { current: number; longest: number; qualifyingDays: number };
  daily: {
    series: { date: string; label: string; alignment: number; completion: number; energy: number | null; mood: number | null }[];
    averageAlignment: number | null;
    averageCompletion: number | null;
    averageEnergy: number | null;
    averageMood: number | null;
    alignmentDelta: number | null;
    daysRecorded: number;
  };
  habits: { key: string; label: string; done: number; total: number; rate: number }[];
  planes: Awaited<ReturnType<typeof planeBreakdown>>;
  weekly: Awaited<ReturnType<typeof weeklyTrend>>;
  monthly: Awaited<ReturnType<typeof monthlyTrend>>;
  business: {
    currency: string;
    wealthTrend: Awaited<ReturnType<typeof getBusiness>>["wealthTrend"];
    tiers: Awaited<ReturnType<typeof getBusiness>>["tiers"];
    wealthIndex: number;
    totalRevenue: number;
  };
  funnel: {
    stages: Awaited<ReturnType<typeof getFunnel>>["stages"];
    overallConversion: number | null;
    weakestStep: Awaited<ReturnType<typeof getFunnel>>["weakestStep"];
  };
  annual: { year: number; alignment: number; milestonesDone: number; milestonesTotal: number };
};

const roundOrNull = (value: number | null): number | null =>
  value === null ? null : Math.round(value * 10) / 10;

export async function getAnalytics(ctx: MoshContext, days = 90): Promise<AnalyticsView> {
  const to = today();
  const from = addDays(to, -(days - 1));
  const range = { from, to };

  const [series, habits, planes, weekly, monthly, business, funnel, plan, streak] =
    await Promise.all([
      listDays(ctx, range),
      habitBreakdown(ctx, range),
      planeBreakdown(ctx, range),
      weeklyTrend(ctx, Math.min(52, Math.ceil(days / 7))),
      monthlyTrend(ctx, Math.min(24, Math.ceil(days / 30) + 1)),
      getBusiness(ctx, 12),
      getFunnel(ctx, days),
      getYearPlan(ctx),
      getStreak(ctx),
    ]);

  const labels = MOSH_HABITS.reduce<Record<string, string>>((map, habit) => {
    map[habit.key] = habit.label;
    return map;
  }, {});

  const alignments = series.map((point) => point.alignment);

  return {
    window: { from: series[0]?.date ?? to.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10), days },
    streak: {
      current: streak.current,
      longest: streak.longest,
      qualifyingDays: streak.qualifyingDays,
    },
    daily: {
      series: series.map((point) => ({
        ...point,
        label: formatShortDate(fromIsoDate(point.date)),
      })),
      averageAlignment: roundOrNull(average(alignments)),
      averageCompletion: roundOrNull(average(series.map((point) => point.completion))),
      averageEnergy: roundOrNull(
        average(series.map((point) => point.energy).filter((value): value is number => value !== null))
      ),
      averageMood: roundOrNull(
        average(series.map((point) => point.mood).filter((value): value is number => value !== null))
      ),
      alignmentDelta: trendDelta(alignments),
      daysRecorded: series.length,
    },
    habits: habits.map((habit) => ({ ...habit, label: labels[habit.key] ?? habit.key })),
    planes,
    weekly,
    monthly,
    business: {
      currency: business.currency,
      wealthTrend: business.wealthTrend,
      tiers: business.tiers,
      wealthIndex: business.wealth.index,
      totalRevenue: business.wealth.totalRevenue,
    },
    funnel: {
      stages: funnel.stages,
      overallConversion: funnel.overallConversion,
      weakestStep: funnel.weakestStep,
    },
    annual: {
      year: plan.year,
      alignment: plan.annualAlignment,
      milestonesDone: plan.milestonesDone,
      milestonesTotal: plan.milestonesTotal,
    },
  };
}
