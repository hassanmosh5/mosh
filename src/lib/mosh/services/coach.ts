import { prisma } from "@/lib/prisma";
import type { MoshPattern } from "@/generated/prisma/enums";
import { getAnthropic, isAiConfigured, resolveModel } from "@/lib/cos/ai/client";
import type { MoshContext } from "../context";
import { FUNNEL_STAGES, PLANE_LABELS } from "../constants";
import { addDays, today, weekStart } from "../dates";
import {
  coachSystemPrompt,
  coachWithRules,
  parseCoachResponse,
  signalsBlock,
  type CoachResponse,
  type CoachSignals,
} from "../coach";
import type { CoachRequestInput } from "../schemas";
import { getStreak } from "./daily";
import { analyseFunnel } from "../scoring";

/**
 * The self-coaching module.
 *
 * Two engines, one contract. The deterministic playbook always answers; the
 * model personalises it when a key is configured. Either way the response is
 * grounded in signals computed from the user's own records, and the stored
 * session records which engine produced it.
 */

const MAX_TOKENS = 2000;

/** Gather the numbers The Billionaire Self is allowed to reason about. */
export async function gatherSignals(ctx: MoshContext): Promise<CoachSignals> {
  const now = today();
  const weekAgo = addDays(now, -6);

  const [streak, days, checkins, milestones, funnel, week] = await Promise.all([
    getStreak(ctx, 120),
    prisma.moshDailyEntry.findMany({
      where: { userId: ctx.userId, date: { gte: weekAgo, lte: now } },
      select: { alignment: true },
    }),
    prisma.moshPlaneCheckin.groupBy({
      by: ["plane"],
      where: { userId: ctx.userId, date: { gte: addDays(now, -29), lte: now } },
      _avg: { score: true },
    }),
    prisma.moshMilestone.count({
      where: { done: false, quarter: { yearPlan: { userId: ctx.userId } } },
    }),
    prisma.moshFunnelSnapshot.findFirst({
      where: { userId: ctx.userId },
      orderBy: { date: "desc" },
    }),
    prisma.moshWeeklyEntry.findUnique({
      where: { userId_weekStart: { userId: ctx.userId, weekStart: weekStart(now) } },
      select: { momentum: true },
    }),
  ]);

  const dailyAlignment = days.length
    ? Math.round(days.reduce((sum, day) => sum + day.alignment, 0) / days.length)
    : 0;

  const planeScores = checkins
    .filter((row) => row._avg.score !== null)
    .map((row) => ({
      label: PLANE_LABELS[row.plane],
      score: Math.round((row._avg.score as number) * 10),
    }))
    .sort((a, b) => a.score - b.score);

  let weakestFunnelStep: string | null = null;
  if (funnel) {
    const counts = Object.fromEntries(
      FUNNEL_STAGES.map((stage) => [
        stage.key,
        Number((funnel as unknown as Record<string, number>)[stage.key] ?? 0),
      ])
    );
    const analysis = analyseFunnel(counts);
    if (analysis.weakestStep) {
      const from = FUNNEL_STAGES.find((stage) => stage.key === analysis.weakestStep!.from);
      const to = FUNNEL_STAGES.find((stage) => stage.key === analysis.weakestStep!.to);
      weakestFunnelStep = `${from?.label} → ${to?.label} (${analysis.weakestStep.rate}%)`;
    }
  }

  const eclipseDay = ctx.eclipseStart
    ? Math.min(50, Math.max(0, Math.round((now.getTime() - ctx.eclipseStart.getTime()) / 86_400_000) + 1))
    : null;

  return {
    streak: streak.current,
    dailyAlignment,
    weeklyMomentum: week?.momentum ?? 0,
    weakestPlane: planeScores[0] ?? null,
    strongestPlane: planeScores.length ? planeScores[planeScores.length - 1] : null,
    openMilestones: milestones,
    eclipseDay: eclipseDay && eclipseDay > 0 && eclipseDay <= 50 ? eclipseDay : null,
    weakestFunnelStep,
  };
}

export type CoachSessionView = CoachResponse & {
  id: string;
  pattern: MoshPattern;
  situation: string;
  source: "AI" | "RULES";
  model: string | null;
  createdAt: string;
  signals: CoachSignals;
};

/**
 * Produce a coaching session.
 *
 * If the AI call fails for any reason — no key, rate limit, malformed reply —
 * the deterministic playbook answers instead and the session is labelled
 * RULES. The module never returns an error page to someone who came here for
 * help.
 */
export async function reflect(
  ctx: MoshContext,
  input: CoachRequestInput
): Promise<CoachSessionView> {
  const signals = await gatherSignals(ctx);
  const fallback = coachWithRules(input.pattern, signals);

  let response = fallback;
  let source: "AI" | "RULES" = "RULES";
  let model: string | null = null;

  if (isAiConfigured()) {
    try {
      const chosen = resolveModel(process.env.MOSH_MODEL);
      const message = await getAnthropic().messages.create({
        model: chosen,
        max_tokens: MAX_TOKENS,
        system: coachSystemPrompt(input.pattern),
        messages: [
          {
            role: "user",
            content: `${signalsBlock(signals, ctx.currency)}\n\nWhat they wrote:\n"""\n${input.situation}\n"""`,
          },
        ],
      });

      const text = message.content
        .map((block) => (block.type === "text" ? block.text : ""))
        .join("\n");

      const parsed = parseCoachResponse(text);
      if (parsed) {
        response = {
          ...parsed,
          // Recommendations stay derived from real records even when the model
          // supplies its own, so the numbers quoted can always be traced.
          recommendations: parsed.recommendations.length
            ? parsed.recommendations
            : fallback.recommendations,
        };
        source = "AI";
        model = chosen;
      }
    } catch (error) {
      console.error("[mosh] coach AI call failed, using the rules engine", error);
    }
  }

  const session = await prisma.moshCoachSession.create({
    data: {
      userId: ctx.userId,
      pattern: input.pattern,
      situation: input.situation,
      analysis: response.analysis,
      encouragement: response.encouragement,
      actions: response.actions,
      prompts: response.prompts,
      recommendations: response.recommendations,
      source,
      model,
    },
  });

  return {
    id: session.id,
    pattern: session.pattern,
    situation: session.situation,
    source,
    model,
    createdAt: session.createdAt.toISOString(),
    signals,
    ...response,
  };
}

function stringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export async function listSessions(ctx: MoshContext, take = 20) {
  const rows = await prisma.moshCoachSession.findMany({
    where: { userId: ctx.userId },
    orderBy: { createdAt: "desc" },
    take,
  });

  return rows.map((row) => ({
    id: row.id,
    pattern: row.pattern,
    situation: row.situation,
    analysis: row.analysis,
    encouragement: row.encouragement,
    actions: stringList(row.actions),
    prompts: stringList(row.prompts),
    recommendations: stringList(row.recommendations),
    source: row.source,
    model: row.model,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function deleteSession(ctx: MoshContext, id: string) {
  await prisma.moshCoachSession.deleteMany({ where: { id, userId: ctx.userId } });
  return { ok: true };
}

export { isAiConfigured };
