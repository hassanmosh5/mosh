import type { MoshLifeArea, MoshOfferTier, MoshPlane } from "@/generated/prisma/enums";
import {
  HABIT_KEYS,
  MOSH_HABITS,
  MOSH_PLANES,
  SCORE_WEIGHTS,
  STREAK_THRESHOLD,
  TIER_WEIGHTS,
  type FunnelStageKey,
  type HabitKey,
} from "./constants";
import { FUNNEL_STAGES } from "./constants";
import { daysBetween, toIsoDate } from "./dates";

/**
 * Deterministic scoring engine.
 *
 * Every number the dashboard shows is produced here, from records the user
 * actually entered. The AI coach may *explain* a score; it never invents one.
 * These functions are pure so they can be unit tested and so a score can always
 * be traced back to the entries that produced it.
 *
 * Composite scores are built from weighted components (see SCORE_WEIGHTS). A
 * component with no data for the period is dropped and its weight is spread
 * across the remaining components, so a partly-filled day is scored on what was
 * recorded rather than punished for what was not.
 */

export const clamp = (value: number, min = 0, max = 100): number =>
  Math.min(max, Math.max(min, value));

export const round = (value: number): number => Math.round(value * 10) / 10;

/** Average of a list, or null when empty. */
export function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export type ScoreComponent = {
  key: string;
  label: string;
  /** 0-100, or null when there is no data for this component. */
  value: number | null;
  weight: number;
};

export type CompositeScore = {
  score: number; // 0-100
  components: (ScoreComponent & { contribution: number })[];
  /** Components that had no data and were excluded. */
  missing: string[];
};

/**
 * Combine weighted components, redistributing the weight of any component with
 * no data. Returns 0 when nothing at all was recorded.
 */
export function composite(components: ScoreComponent[]): CompositeScore {
  const present = components.filter((component) => component.value !== null);
  const missing = components
    .filter((component) => component.value === null)
    .map((component) => component.key);

  const totalWeight = present.reduce((sum, component) => sum + component.weight, 0);
  if (totalWeight === 0) {
    return {
      score: 0,
      components: components.map((component) => ({ ...component, contribution: 0 })),
      missing,
    };
  }

  let score = 0;
  const detailed = components.map((component) => {
    if (component.value === null) return { ...component, contribution: 0 };
    const contribution = (component.value * component.weight) / totalWeight;
    score += contribution;
    return { ...component, contribution: round(contribution) };
  });

  return { score: Math.round(clamp(score)), components: detailed, missing };
}

// ---------------------------------------------------------------------------
// Daily
// ---------------------------------------------------------------------------

export type DailyHabits = Record<HabitKey, boolean>;

export type DailyInput = {
  habits: DailyHabits;
  energy?: number | null; // 1-10
  mood?: number | null; // 1-10
  /** attribute slug -> 1-10 */
  checkins?: Record<string, number>;
};

/** Percentage of the seven-habit rhythm completed. */
export function habitCompletion(habits: DailyHabits): number {
  const done = HABIT_KEYS.filter((key) => habits[key]).length;
  return Math.round((done / HABIT_KEYS.length) * 100);
}

/**
 * Daily Alignment Score — how aligned the three planes were on one day.
 *
 *   55%  the seven-habit rhythm
 *   25%  the average of any plane self-ratings recorded that day
 *   20%  energy and mood (the body's own report)
 */
export function scoreDay(input: DailyInput): CompositeScore {
  const checkins = input.checkins ?? {};
  const checkinValues = Object.values(checkins).filter((value) => Number.isFinite(value));
  const vitals = [input.energy, input.mood].filter(
    (value): value is number => typeof value === "number" && value > 0
  );

  return composite([
    {
      key: "habits",
      label: "Daily rhythm",
      value: habitCompletion(input.habits),
      weight: SCORE_WEIGHTS.daily.habits,
    },
    {
      key: "planes",
      label: "Plane check-in",
      value: checkinValues.length ? (average(checkinValues) as number) * 10 : null,
      weight: SCORE_WEIGHTS.daily.planes,
    },
    {
      key: "vitals",
      label: "Energy and mood",
      value: vitals.length ? (average(vitals) as number) * 10 : null,
      weight: SCORE_WEIGHTS.daily.vitals,
    },
  ]);
}

/**
 * Per-plane alignment for a single day: the self-ratings for that plane's
 * attributes, blended with the habits that belong to the same plane.
 */
export function scorePlanesForDay(input: DailyInput): Record<MoshPlane, number | null> {
  const checkins = input.checkins ?? {};
  const result = {} as Record<MoshPlane, number | null>;

  for (const definition of MOSH_PLANES) {
    const ratings = definition.attributes
      .map((attribute) => checkins[attribute.slug])
      .filter((value): value is number => typeof value === "number" && value > 0);

    const planeHabits = MOSH_HABITS.filter((habit) => habit.plane === definition.plane);
    const habitScore = planeHabits.length
      ? (planeHabits.filter((habit) => input.habits[habit.key]).length / planeHabits.length) * 100
      : null;
    const ratingScore = ratings.length ? (average(ratings) as number) * 10 : null;

    if (ratingScore === null && habitScore === null) {
      result[definition.plane] = null;
    } else if (ratingScore === null) {
      result[definition.plane] = Math.round(habitScore as number);
    } else if (habitScore === null) {
      result[definition.plane] = Math.round(ratingScore);
    } else {
      result[definition.plane] = Math.round(ratingScore * 0.6 + habitScore * 0.4);
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Weekly
// ---------------------------------------------------------------------------

export type WeeklyGoalInput = { area: MoshLifeArea; completion: number };

/**
 * Weekly Momentum Score.
 *
 *   60%  average completion of the week's goals, averaged per area first so a
 *        single area with six goals cannot dominate the week
 *   40%  average daily alignment across the days recorded in that week
 */
export function scoreWeek(input: {
  goals: WeeklyGoalInput[];
  dailyAlignments: number[];
}): CompositeScore {
  const byArea = new Map<MoshLifeArea, number[]>();
  for (const goal of input.goals) {
    const list = byArea.get(goal.area) ?? [];
    list.push(clamp(goal.completion));
    byArea.set(goal.area, list);
  }
  const areaAverages = [...byArea.values()].map((values) => average(values) as number);

  return composite([
    {
      key: "goals",
      label: "Weekly goals",
      value: areaAverages.length ? (average(areaAverages) as number) : null,
      weight: SCORE_WEIGHTS.weekly.goals,
    },
    {
      key: "days",
      label: "Daily alignment",
      value: input.dailyAlignments.length ? (average(input.dailyAlignments) as number) : null,
      weight: SCORE_WEIGHTS.weekly.days,
    },
  ]);
}

// ---------------------------------------------------------------------------
// Monthly
// ---------------------------------------------------------------------------

/**
 * Monthly Growth Score.
 *
 *   50%  average of the five pillar self-assessments
 *   30%  average weekly momentum for the weeks inside the month
 *   20%  reflection completeness — how many of the six review questions were
 *        answered, because an unexamined month does not compound
 */
export function scoreMonth(input: {
  pillarScores: number[];
  weeklyMomentum: number[];
  answeredQuestions: number;
  totalQuestions: number;
}): CompositeScore {
  return composite([
    {
      key: "pillars",
      label: "Pillar progress",
      value: input.pillarScores.length ? (average(input.pillarScores) as number) : null,
      weight: SCORE_WEIGHTS.monthly.pillars,
    },
    {
      key: "weeks",
      label: "Weekly momentum",
      value: input.weeklyMomentum.length ? (average(input.weeklyMomentum) as number) : null,
      weight: SCORE_WEIGHTS.monthly.weeks,
    },
    {
      key: "reflection",
      label: "Reflection",
      value:
        input.totalQuestions > 0
          ? (input.answeredQuestions / input.totalQuestions) * 100
          : null,
      weight: SCORE_WEIGHTS.monthly.reflection,
    },
  ]);
}

// ---------------------------------------------------------------------------
// Annual
// ---------------------------------------------------------------------------

/**
 * Annual Alignment — 60% quarter progress, 40% milestones actually completed.
 */
export function scoreYear(input: {
  quarterProgress: number[];
  milestonesTotal: number;
  milestonesDone: number;
}): CompositeScore {
  return composite([
    {
      key: "quarters",
      label: "Quarter progress",
      value: input.quarterProgress.length ? (average(input.quarterProgress) as number) : null,
      weight: SCORE_WEIGHTS.annual.quarters,
    },
    {
      key: "milestones",
      label: "Milestones",
      value:
        input.milestonesTotal > 0
          ? (input.milestonesDone / input.milestonesTotal) * 100
          : null,
      weight: SCORE_WEIGHTS.annual.milestones,
    },
  ]);
}

// ---------------------------------------------------------------------------
// Wealth Flow Index
// ---------------------------------------------------------------------------

export type TierRevenue = Record<MoshOfferTier, number>;

export type WealthFlowResult = {
  /** The raw index, in currency units. */
  index: number;
  /** Contribution of each tier after its multiplier. */
  weighted: TierRevenue;
  /** Unweighted revenue per tier. */
  revenue: TierRevenue;
  totalRevenue: number;
  /** 0-100 progress against the target, for the dashboard bar. */
  progress: number;
  target: number;
};

/**
 * Wealth Flow Index = (attraction × 1) + (core × 2) + (premium × 3).
 *
 * The multipliers are deliberate: a cedi earned through premium mentorship
 * represents three times the depth of relationship — and the durability — of a
 * cedi earned at the top of the funnel.
 */
export function wealthFlowIndex(revenue: Partial<TierRevenue>, target = 0): WealthFlowResult {
  const filled: TierRevenue = {
    ATTRACTION: revenue.ATTRACTION ?? 0,
    CORE: revenue.CORE ?? 0,
    PREMIUM: revenue.PREMIUM ?? 0,
  };

  const weighted: TierRevenue = {
    ATTRACTION: filled.ATTRACTION * TIER_WEIGHTS.ATTRACTION,
    CORE: filled.CORE * TIER_WEIGHTS.CORE,
    PREMIUM: filled.PREMIUM * TIER_WEIGHTS.PREMIUM,
  };

  const index = weighted.ATTRACTION + weighted.CORE + weighted.PREMIUM;
  const totalRevenue = filled.ATTRACTION + filled.CORE + filled.PREMIUM;

  return {
    index: Math.round(index * 100) / 100,
    weighted,
    revenue: filled,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    progress: target > 0 ? Math.round(clamp((index / target) * 100)) : 0,
    target,
  };
}

// ---------------------------------------------------------------------------
// Funnel
// ---------------------------------------------------------------------------

export type FunnelCounts = Record<FunnelStageKey, number>;

export type FunnelStageResult = {
  key: FunnelStageKey;
  label: string;
  meaning: string;
  count: number;
  /** Conversion from the previous stage, as a percentage. Null for the first. */
  conversionFromPrevious: number | null;
  /** Share of the top-of-funnel count. */
  shareOfTop: number;
};

/** Stage-by-stage conversion. Division by zero yields null, never Infinity. */
export function analyseFunnel(counts: Partial<FunnelCounts>): {
  stages: FunnelStageResult[];
  overallConversion: number | null;
  weakestStep: { from: FunnelStageKey; to: FunnelStageKey; rate: number } | null;
} {
  const top = counts[FUNNEL_STAGES[0].key] ?? 0;
  let previous: number | null = null;
  let weakest: { from: FunnelStageKey; to: FunnelStageKey; rate: number } | null = null;

  const stages = FUNNEL_STAGES.map((stage, index) => {
    const count = counts[stage.key] ?? 0;
    const conversionFromPrevious =
      previous === null || previous === 0 ? null : round((count / previous) * 100);

    if (conversionFromPrevious !== null && index > 0) {
      if (!weakest || conversionFromPrevious < weakest.rate) {
        weakest = {
          from: FUNNEL_STAGES[index - 1].key,
          to: stage.key,
          rate: conversionFromPrevious,
        };
      }
    }

    previous = count;
    return {
      key: stage.key,
      label: stage.label,
      meaning: stage.meaning,
      count,
      conversionFromPrevious,
      shareOfTop: top > 0 ? round((count / top) * 100) : 0,
    };
  });

  const advocates = counts.advocates ?? 0;
  return {
    stages,
    overallConversion: top > 0 ? round((advocates / top) * 100) : null,
    weakestStep: weakest,
  };
}

// ---------------------------------------------------------------------------
// Streaks
// ---------------------------------------------------------------------------

export type StreakInput = { date: Date; completion: number };

export type StreakResult = {
  current: number;
  longest: number;
  /** Days in the window that met the threshold. */
  qualifyingDays: number;
  /** ISO date of the last qualifying day, if any. */
  lastQualifyingDate: string | null;
};

/**
 * Streaks over days that met `threshold` completion.
 *
 * The current streak is allowed to end yesterday as well as today — a day that
 * is still in progress does not break a run.
 */
export function computeStreak(
  entries: StreakInput[],
  reference: Date,
  threshold = STREAK_THRESHOLD
): StreakResult {
  const qualifying = entries
    .filter((entry) => entry.completion >= threshold)
    .map((entry) => toIsoDate(entry.date))
    .sort();

  if (qualifying.length === 0) {
    return { current: 0, longest: 0, qualifyingDays: 0, lastQualifyingDate: null };
  }

  const unique = [...new Set(qualifying)];
  const dates = unique.map((iso) => new Date(`${iso}T00:00:00.000Z`));

  let longest = 1;
  let run = 1;
  for (let index = 1; index < dates.length; index += 1) {
    run = daysBetween(dates[index - 1], dates[index]) === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  const last = dates[dates.length - 1];
  const gap = daysBetween(last, reference);
  let current = 0;
  if (gap <= 1) {
    current = 1;
    for (let index = dates.length - 1; index > 0; index -= 1) {
      if (daysBetween(dates[index - 1], dates[index]) === 1) current += 1;
      else break;
    }
  }

  return {
    current,
    longest,
    qualifyingDays: unique.length,
    lastQualifyingDate: unique[unique.length - 1],
  };
}

// ---------------------------------------------------------------------------
// Trend helpers
// ---------------------------------------------------------------------------

/** Difference between the latest value and the mean of the ones before it. */
export function trendDelta(series: number[]): number | null {
  if (series.length < 2) return null;
  const latest = series[series.length - 1];
  const priorMean = average(series.slice(0, -1)) as number;
  return round(latest - priorMean);
}

export type Tone = "good" | "warn" | "bad" | "neutral";

/** Shared banding so every meter in the UI reads the same way. */
export function toneForScore(score: number): Tone {
  if (score >= 75) return "good";
  if (score >= 50) return "warn";
  if (score > 0) return "bad";
  return "neutral";
}

/** Plain-language label for a score band. */
export function labelForScore(score: number): string {
  if (score >= 90) return "Aligned";
  if (score >= 75) return "Strong";
  if (score >= 50) return "Building";
  if (score >= 25) return "Drifting";
  if (score > 0) return "Off rhythm";
  return "Not started";
}
