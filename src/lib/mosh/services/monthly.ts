import { prisma } from "@/lib/prisma";
import type { MoshLifeArea } from "@/generated/prisma/enums";
import type { MoshContext } from "../context";
import { LIFE_AREAS, MONTHLY_QUESTIONS } from "../constants";
import { addMonths, eachMonth, monthEnd, monthStart, toIsoDate, today } from "../dates";
import { scoreMonth } from "../scoring";
import type { MonthlyReviewInput } from "../schemas";
import { momentumInRange } from "./weekly";

/**
 * The monthly review.
 *
 * Five pillars (the three planes plus business and impact), each with goals,
 * achievements and lessons, and six reflection questions. The growth score
 * counts the reflection as well as the results — a month you did not examine
 * did not fully happen.
 */

export type MonthlyPillarView = {
  area: MoshLifeArea;
  label: string;
  goals: string | null;
  achievements: string | null;
  lessons: string | null;
  score: number;
};

export type MonthlyReviewView = {
  month: string;
  growth: number;
  answers: Record<string, string | null>;
  answered: number;
  totalQuestions: number;
  pillars: MonthlyPillarView[];
  weeklyMomentum: number[];
};

const QUESTION_KEYS = MONTHLY_QUESTIONS.map((question) => question.key);

function buildView(
  month: Date,
  review: {
    energyGivers: string | null;
    energyDrainers: string | null;
    proudOf: string | null;
    fearsOvercome: string | null;
    service: string | null;
    structuralImprovement: string | null;
    pillars: { area: MoshLifeArea; goals: string | null; achievements: string | null; lessons: string | null; score: number }[];
  } | null,
  weeklyMomentum: number[]
): MonthlyReviewView {
  const answers = Object.fromEntries(
    QUESTION_KEYS.map((key) => [key, review ? ((review as unknown as Record<string, string | null>)[key] ?? null) : null])
  );
  const answered = QUESTION_KEYS.filter((key) => {
    const value = answers[key];
    return typeof value === "string" && value.trim().length > 0;
  }).length;

  const pillars: MonthlyPillarView[] = LIFE_AREAS.map(({ area, label }) => {
    const stored = review?.pillars.find((pillar) => pillar.area === area);
    return {
      area,
      label,
      goals: stored?.goals ?? null,
      achievements: stored?.achievements ?? null,
      lessons: stored?.lessons ?? null,
      score: stored?.score ?? 0,
    };
  });

  const scored = review?.pillars.map((pillar) => pillar.score) ?? [];
  const growth = scoreMonth({
    pillarScores: scored,
    weeklyMomentum,
    answeredQuestions: answered,
    totalQuestions: QUESTION_KEYS.length,
  }).score;

  return {
    month: toIsoDate(month),
    growth,
    answers,
    answered,
    totalQuestions: QUESTION_KEYS.length,
    pillars,
    weeklyMomentum,
  };
}

export async function getMonth(ctx: MoshContext, anchor?: Date): Promise<MonthlyReviewView> {
  const month = monthStart(anchor ?? today());

  const [review, weeklyMomentum] = await Promise.all([
    prisma.moshMonthlyReview.findUnique({
      where: { userId_month: { userId: ctx.userId, month } },
      include: { pillars: true },
    }),
    momentumInRange(ctx, { from: month, to: monthEnd(month) }),
  ]);

  return buildView(month, review, weeklyMomentum);
}

export async function saveMonth(
  ctx: MoshContext,
  input: MonthlyReviewInput
): Promise<MonthlyReviewView> {
  const month = monthStart(new Date(`${input.month}T00:00:00.000Z`));
  const weeklyMomentum = await momentumInRange(ctx, { from: month, to: monthEnd(month) });

  const answered = QUESTION_KEYS.filter((key) => {
    const value = (input as unknown as Record<string, string | null>)[key];
    return typeof value === "string" && value.trim().length > 0;
  }).length;

  const growth = scoreMonth({
    pillarScores: input.pillars.map((pillar) => pillar.score),
    weeklyMomentum,
    answeredQuestions: answered,
    totalQuestions: QUESTION_KEYS.length,
  }).score;

  const data = {
    energyGivers: input.energyGivers,
    energyDrainers: input.energyDrainers,
    proudOf: input.proudOf,
    fearsOvercome: input.fearsOvercome,
    service: input.service,
    structuralImprovement: input.structuralImprovement,
    growth,
  };

  const review = await prisma.moshMonthlyReview.upsert({
    where: { userId_month: { userId: ctx.userId, month } },
    create: { userId: ctx.userId, month, ...data },
    update: data,
  });

  await prisma.$transaction(
    input.pillars.map((pillar) =>
      prisma.moshMonthlyPillar.upsert({
        where: { reviewId_area: { reviewId: review.id, area: pillar.area } },
        create: {
          reviewId: review.id,
          area: pillar.area,
          goals: pillar.goals,
          achievements: pillar.achievements,
          lessons: pillar.lessons,
          score: pillar.score,
        },
        update: {
          goals: pillar.goals,
          achievements: pillar.achievements,
          lessons: pillar.lessons,
          score: pillar.score,
        },
      })
    )
  );

  return getMonth(ctx, month);
}

export type MonthlyTrendPoint = { month: string; growth: number };

/** Growth score per month for the last `months` months, oldest first. */
export async function monthlyTrend(ctx: MoshContext, months = 12): Promise<MonthlyTrendPoint[]> {
  const end = monthStart(today());
  const start = addMonths(end, -(months - 1));

  const rows = await prisma.moshMonthlyReview.findMany({
    where: { userId: ctx.userId, month: { gte: start, lte: end } },
    select: { month: true, growth: true },
    orderBy: { month: "asc" },
  });
  const byMonth = new Map(rows.map((row) => [toIsoDate(row.month), row.growth]));

  return eachMonth(start, end).map((month) => ({
    month: toIsoDate(month),
    growth: byMonth.get(toIsoDate(month)) ?? 0,
  }));
}
