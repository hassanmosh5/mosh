import { prisma } from "@/lib/prisma";
import { toNumber } from "@/lib/cos/format";
import { notFound } from "@/lib/cos/errors";
import type { MoshContext } from "../context";
import { QUARTER_TEMPLATES } from "../constants";
import { fromIsoDate, quarterOf, quarterStart, toIsoDate, today } from "../dates";
import { scoreYear } from "../scoring";
import type {
  milestoneCreateSchema,
  milestoneUpdateSchema,
  quarterUpdateSchema,
  yearPlanSchema,
} from "../schemas";
import type { z } from "zod";

/**
 * The 365-day master plan.
 *
 * A year is four quarters, each with a focus, a goal and three monthly
 * milestones. A user's first visit seeds the year from QUARTER_TEMPLATES —
 * Root and Routine, Visibility and Credibility, Structure and Scale, Legacy
 * and Leverage — which they are then free to rewrite.
 */

export type MilestoneView = {
  id: string;
  monthOffset: number;
  title: string;
  detail: string | null;
  done: boolean;
  dueDate: string | null;
};

export type QuarterView = {
  id: string;
  quarter: number;
  title: string;
  focus: string[];
  goal: string;
  progress: number;
  revenueTarget: number | null;
  clientTarget: number | null;
  startsOn: string;
  milestones: MilestoneView[];
  milestonesDone: number;
  /** Derived: milestone completion blended with self-reported progress. */
  effectiveProgress: number;
  isCurrent: boolean;
};

export type YearPlanView = {
  id: string;
  year: number;
  theme: string | null;
  vision: string | null;
  northStar: string | null;
  quarters: QuarterView[];
  annualAlignment: number;
  milestonesTotal: number;
  milestonesDone: number;
};

/** Load the year plan, creating it from the templates on first access. */
export async function getYearPlan(ctx: MoshContext, year?: number): Promise<YearPlanView> {
  const targetYear = year ?? ctx.planYear ?? today().getUTCFullYear();

  const existing = await prisma.moshYearPlan.findUnique({
    where: { userId_year: { userId: ctx.userId, year: targetYear } },
    include: {
      quarters: {
        orderBy: { quarter: "asc" },
        include: { milestones: { orderBy: { monthOffset: "asc" } } },
      },
    },
  });

  const plan = existing ?? (await seedYearPlan(ctx, targetYear));
  return toView(plan, targetYear);
}

async function seedYearPlan(ctx: MoshContext, year: number) {
  await prisma.moshYearPlan.create({
    data: {
      userId: ctx.userId,
      year,
      theme: "Structure Creates Freedom",
      vision:
        "Align the mental, spiritual and physical planes while building a business that frees other people to believe again.",
      quarters: {
        create: QUARTER_TEMPLATES.map((template) => ({
          quarter: template.quarter,
          title: template.title,
          focus: template.focus,
          goal: template.goal,
          milestones: {
            create: template.milestones.map((milestone) => ({
              monthOffset: milestone.monthOffset,
              title: milestone.title,
              detail: milestone.detail,
              dueDate: new Date(
                Date.UTC(year, (template.quarter - 1) * 3 + milestone.monthOffset, 0)
              ),
            })),
          },
        })),
      },
    },
  });

  const created = await prisma.moshYearPlan.findUnique({
    where: { userId_year: { userId: ctx.userId, year } },
    include: {
      quarters: {
        orderBy: { quarter: "asc" },
        include: { milestones: { orderBy: { monthOffset: "asc" } } },
      },
    },
  });

  if (!created) throw notFound("The year plan could not be created.");
  return created;
}

type PlanRow = Awaited<ReturnType<typeof seedYearPlan>>;

function toView(plan: PlanRow, year: number): YearPlanView {
  const now = today();
  const currentQuarter = now.getUTCFullYear() === year ? quarterOf(now) : 0;

  const quarters: QuarterView[] = plan.quarters.map((quarter) => {
    const done = quarter.milestones.filter((milestone) => milestone.done).length;
    const milestoneProgress =
      quarter.milestones.length > 0 ? (done / quarter.milestones.length) * 100 : 0;

    return {
      id: quarter.id,
      quarter: quarter.quarter,
      title: quarter.title,
      focus: quarter.focus,
      goal: quarter.goal,
      progress: quarter.progress,
      revenueTarget: quarter.revenueTarget === null ? null : toNumber(quarter.revenueTarget),
      clientTarget: quarter.clientTarget,
      startsOn: toIsoDate(quarterStart(year, quarter.quarter)),
      milestones: quarter.milestones.map((milestone) => ({
        id: milestone.id,
        monthOffset: milestone.monthOffset,
        title: milestone.title,
        detail: milestone.detail,
        done: milestone.done,
        dueDate: milestone.dueDate ? toIsoDate(milestone.dueDate) : null,
      })),
      milestonesDone: done,
      effectiveProgress: Math.round(quarter.progress * 0.5 + milestoneProgress * 0.5),
      isCurrent: quarter.quarter === currentQuarter,
    };
  });

  const milestonesTotal = quarters.reduce((sum, quarter) => sum + quarter.milestones.length, 0);
  const milestonesDone = quarters.reduce((sum, quarter) => sum + quarter.milestonesDone, 0);

  return {
    id: plan.id,
    year: plan.year,
    theme: plan.theme,
    vision: plan.vision,
    northStar: plan.northStar,
    quarters,
    milestonesTotal,
    milestonesDone,
    annualAlignment: scoreYear({
      quarterProgress: quarters.map((quarter) => quarter.effectiveProgress),
      milestonesTotal,
      milestonesDone,
    }).score,
  };
}

export async function saveYearPlan(
  ctx: MoshContext,
  input: z.infer<typeof yearPlanSchema>
): Promise<YearPlanView> {
  await getYearPlan(ctx, input.year); // ensures the plan exists before updating
  await prisma.moshYearPlan.update({
    where: { userId_year: { userId: ctx.userId, year: input.year } },
    data: { theme: input.theme, vision: input.vision, northStar: input.northStar },
  });
  return getYearPlan(ctx, input.year);
}

/** Verify a quarter belongs to the signed-in user before touching it. */
async function assertQuarterOwned(ctx: MoshContext, quarterId: string) {
  const quarter = await prisma.moshQuarter.findFirst({
    where: { id: quarterId, yearPlan: { userId: ctx.userId } },
    include: { yearPlan: { select: { year: true } } },
  });
  if (!quarter) throw notFound("That quarter could not be found.");
  return quarter;
}

export async function updateQuarter(
  ctx: MoshContext,
  input: z.infer<typeof quarterUpdateSchema>
): Promise<YearPlanView> {
  const quarter = await assertQuarterOwned(ctx, input.id);

  await prisma.moshQuarter.update({
    where: { id: input.id },
    data: {
      title: input.title,
      goal: input.goal,
      focus: input.focus,
      progress: input.progress,
      revenueTarget: input.revenueTarget ?? undefined,
      clientTarget: input.clientTarget ?? undefined,
    },
  });

  return getYearPlan(ctx, quarter.yearPlan.year);
}

export async function createMilestone(
  ctx: MoshContext,
  input: z.infer<typeof milestoneCreateSchema>
): Promise<YearPlanView> {
  const quarter = await assertQuarterOwned(ctx, input.quarterId);

  await prisma.moshMilestone.create({
    data: {
      quarterId: input.quarterId,
      monthOffset: input.monthOffset,
      title: input.title,
      detail: input.detail,
      dueDate: input.dueDate ? fromIsoDate(input.dueDate) : null,
    },
  });

  return getYearPlan(ctx, quarter.yearPlan.year);
}

export async function updateMilestone(
  ctx: MoshContext,
  input: z.infer<typeof milestoneUpdateSchema>
): Promise<YearPlanView> {
  const milestone = await prisma.moshMilestone.findFirst({
    where: { id: input.id, quarter: { yearPlan: { userId: ctx.userId } } },
    include: { quarter: { include: { yearPlan: { select: { year: true } } } } },
  });
  if (!milestone) throw notFound("That milestone could not be found.");

  await prisma.moshMilestone.update({
    where: { id: input.id },
    data: {
      title: input.title,
      detail: input.detail,
      done: input.done,
      completedAt: input.done === undefined ? undefined : input.done ? new Date() : null,
      dueDate: input.dueDate === undefined ? undefined : input.dueDate ? fromIsoDate(input.dueDate) : null,
    },
  });

  return getYearPlan(ctx, milestone.quarter.yearPlan.year);
}

export async function deleteMilestone(ctx: MoshContext, id: string): Promise<YearPlanView> {
  const milestone = await prisma.moshMilestone.findFirst({
    where: { id, quarter: { yearPlan: { userId: ctx.userId } } },
    include: { quarter: { include: { yearPlan: { select: { year: true } } } } },
  });
  if (!milestone) throw notFound("That milestone could not be found.");

  await prisma.moshMilestone.delete({ where: { id } });
  return getYearPlan(ctx, milestone.quarter.yearPlan.year);
}
