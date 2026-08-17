/**
 * MOSH Self-Mastery seed.
 *
 * MOSH is a personal system: every record belongs to a signed-in user, and the
 * modules that need structure (the year plan, the fifty Eclipse days, the
 * 77-year-old-self letter) create themselves the first time someone opens
 * them. So there is nothing this seed *must* do.
 *
 * What it does instead is optional demo data — thirty days of rhythm, four
 * weeks of goals, a month reviewed, three offers with reported revenue and a
 * funnel — attached to the first user in the database, so a fresh deployment
 * can be shown to someone with the dashboard already alive. It is skipped
 * unless MOSH_SEED_DEMO=true, and it never overwrites existing entries.
 */

import type { PrismaClient } from "../src/generated/prisma/client";
import { ECLIPSE_PLAN, MOSH_HABITS, MOSH_PLANES, QUARTER_TEMPLATES } from "../src/lib/mosh/constants";
import { DEFAULT_LEGACY_LETTER } from "../src/lib/mosh/constants";
import { habitCompletion, scoreDay, scoreWeek, scoreMonth } from "../src/lib/mosh/scoring";
import { addDays, monthStart, toDayStart, weekStart } from "../src/lib/mosh/dates";
import type { HabitKey } from "../src/lib/mosh/constants";

const DEMO_DAYS = 30;

/** Deterministic pseudo-randomness, so re-seeding produces the same story. */
function seededRandom(seed: number): () => number {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

export type MoshSeedResult = { seeded: boolean; reason: string };

export async function seedSelfMastery(prisma: PrismaClient): Promise<MoshSeedResult> {
  if (process.env.MOSH_SEED_DEMO !== "true") {
    return { seeded: false, reason: "MOSH_SEED_DEMO is not set to \"true\"." };
  }

  const user = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
  if (!user) {
    return { seeded: false, reason: "No user account exists yet — register first, then re-run." };
  }

  const existing = await prisma.moshDailyEntry.count({ where: { userId: user.id } });
  if (existing > 0) {
    return { seeded: false, reason: "This account already has daily entries." };
  }

  const userId = user.id;
  const today = toDayStart(new Date());
  const random = seededRandom(20260814);

  // The profile may already exist — it is created the first time someone opens
  // MOSH — so the Eclipse start date is set on update as well as on create.
  // Without it the demo would show twelve completed days against a clock that
  // never started.
  await prisma.moshProfile.upsert({
    where: { userId },
    update: { eclipseStart: addDays(today, -12), planYear: today.getUTCFullYear() },
    create: {
      userId,
      displayName: user.name ?? "Founder",
      planYear: today.getUTCFullYear(),
      eclipseStart: addDays(today, -12),
    },
  });

  // ---- thirty days of rhythm ------------------------------------------------
  for (let offset = DEMO_DAYS - 1; offset >= 0; offset -= 1) {
    const date = addDays(today, -offset);
    // Consistency improves over the month — the shape a real practice makes.
    const discipline = 0.45 + ((DEMO_DAYS - offset) / DEMO_DAYS) * 0.4;

    const habits = Object.fromEntries(
      MOSH_HABITS.map((habit) => [habit.key, random() < discipline])
    ) as Record<HabitKey, boolean>;

    const energy = Math.max(3, Math.min(10, Math.round(5 + discipline * 4 + (random() - 0.5) * 2)));
    const mood = Math.max(3, Math.min(10, Math.round(5 + discipline * 3 + (random() - 0.5) * 2)));

    const checkins: Record<string, number> = {};
    for (const plane of MOSH_PLANES) {
      for (const attribute of plane.attributes) {
        if (random() < 0.6) {
          checkins[attribute.slug] = Math.max(
            2,
            Math.min(10, Math.round(5 + discipline * 4 + (random() - 0.5) * 3))
          );
        }
      }
    }

    const completion = habitCompletion(habits);
    const alignment = scoreDay({ habits, energy, mood, checkins }).score;

    await prisma.moshDailyEntry.create({
      data: {
        userId,
        date,
        ...habits,
        energy,
        mood,
        completion,
        alignment,
        gratitude: offset % 3 === 0 ? "Health, work that matters, and people who answer." : null,
        wins: offset % 4 === 0 ? "Published without rewriting it four times." : null,
        reflection:
          offset % 5 === 0 ? "The morning decided the day. Protect the first hour." : null,
      },
    });

    for (const [attribute, score] of Object.entries(checkins)) {
      const plane = MOSH_PLANES.find((entry) =>
        entry.attributes.some((candidate) => candidate.slug === attribute)
      );
      if (!plane) continue;
      await prisma.moshPlaneCheckin.create({
        data: { userId, date, attribute, plane: plane.plane, score },
      });
    }
  }

  // ---- four weeks of goals --------------------------------------------------
  const goalsByArea = [
    { area: "MENTAL" as const, goal: "One deep-work block before noon, every weekday." },
    { area: "SPIRITUAL" as const, goal: "Ten minutes of stillness before the phone." },
    { area: "PHYSICAL" as const, goal: "Train four times and sleep seven hours." },
    { area: "BUSINESS" as const, goal: "Publish daily and open the coaching program." },
    { area: "IMPACT" as const, goal: "Coach two people who cannot pay." },
  ];

  for (let week = 3; week >= 0; week -= 1) {
    const start = weekStart(addDays(today, -week * 7));
    const completions = goalsByArea.map(() => Math.round((0.4 + random() * 0.55) * 20) * 5);

    const alignments = await prisma.moshDailyEntry.findMany({
      where: { userId, date: { gte: start, lte: addDays(start, 6) } },
      select: { alignment: true },
    });

    const momentum = scoreWeek({
      goals: goalsByArea.map((goal, index) => ({ area: goal.area, completion: completions[index] })),
      dailyAlignments: alignments.map((entry) => entry.alignment),
    }).score;

    await prisma.moshWeeklyEntry.create({
      data: {
        userId,
        weekStart: start,
        intention: week === 0 ? "Root and routine. Nothing new until the rhythm holds." : null,
        review: week > 0 ? "Held the mornings. Lost two evenings to other people's urgency." : null,
        momentum,
        goals: {
          create: goalsByArea.map((goal, index) => ({
            area: goal.area,
            goal: goal.goal,
            progress: completions[index] >= 80 ? "Done." : "In motion.",
            completion: completions[index],
            position: index,
          })),
        },
      },
    });
  }

  // ---- last month reviewed --------------------------------------------------
  const lastMonth = monthStart(addDays(monthStart(today), -1));
  const pillars = [
    { area: "MENTAL" as const, achievements: "Wrote every morning for 22 days.", score: 75 },
    { area: "SPIRITUAL" as const, achievements: "Stillness became automatic.", score: 70 },
    { area: "PHYSICAL" as const, achievements: "Sleep finally above seven hours.", score: 65 },
    { area: "BUSINESS" as const, achievements: "Attraction offer live, 310 subscribers.", score: 60 },
    { area: "IMPACT" as const, achievements: "Two people coached free to a first sale.", score: 80 },
  ];

  const monthMomentum = await prisma.moshWeeklyEntry.findMany({
    where: { userId, weekStart: { gte: lastMonth, lte: addDays(monthStart(today), -1) } },
    select: { momentum: true },
  });

  await prisma.moshMonthlyReview.create({
    data: {
      userId,
      month: lastMonth,
      energyGivers: "Mornings, teaching, and finishing things.",
      energyDrainers: "Unstructured days and other people's emergencies.",
      proudOf: "Publishing on the days it felt pointless.",
      fearsOvercome: "Went live unscripted and raised the price.",
      service: "Coached two people at no charge and gave away the framework.",
      structuralImprovement: "Batch content on Sunday so weekdays stay clear.",
      growth: scoreMonth({
        pillarScores: pillars.map((pillar) => pillar.score),
        weeklyMomentum: monthMomentum.map((entry) => entry.momentum),
        answeredQuestions: 6,
        totalQuestions: 6,
      }).score,
      pillars: {
        create: pillars.map((pillar) => ({
          area: pillar.area,
          goals: "Set at the start of the month.",
          achievements: pillar.achievements,
          lessons: "Structure beat motivation every single time.",
          score: pillar.score,
        })),
      },
    },
  });

  // ---- the year plan --------------------------------------------------------
  const year = today.getUTCFullYear();
  await prisma.moshYearPlan.create({
    data: {
      userId,
      year,
      theme: "Structure Creates Freedom",
      vision:
        "A business that runs on systems instead of adrenaline, and a life where peace and power are the same current.",
      northStar: "Three scalable income streams and 500 people served.",
      quarters: {
        create: QUARTER_TEMPLATES.map((template, index) => ({
          quarter: template.quarter,
          title: template.title,
          focus: template.focus,
          goal: template.goal,
          progress: index === 0 ? 70 : index === 1 ? 35 : 0,
          revenueTarget: [9000, 18000, 30000, 45000][index],
          clientTarget: [10, 50, 80, 120][index],
          milestones: {
            create: template.milestones.map((milestone) => ({
              monthOffset: milestone.monthOffset,
              title: milestone.title,
              detail: milestone.detail,
              done: index === 0 && milestone.monthOffset < 3,
              completedAt: index === 0 && milestone.monthOffset < 3 ? new Date() : null,
              dueDate: new Date(
                Date.UTC(year, (template.quarter - 1) * 3 + milestone.monthOffset, 0)
              ),
            })),
          },
        })),
      },
    },
  });

  // ---- the offer ecosystem --------------------------------------------------
  const offers = [
    {
      tier: "ATTRACTION" as const,
      name: "The Alignment Starter",
      promise: "Seven days of rhythm that make the next month possible.",
      price: 0,
      metrics: { revenue: 1800, leads: 620, conversions: 148, subscribers: 512, downloads: 940 },
    },
    {
      tier: "CORE" as const,
      name: "Self-Mastery Coaching Program",
      promise: "Twelve weeks to align the three planes and build the first real offer.",
      price: 1200,
      metrics: { revenue: 14400, students: 12, satisfaction: 88, completionRate: 71 },
    },
    {
      tier: "PREMIUM" as const,
      name: "Mindset Architect Mentorship",
      promise: "Six months of close access while the business is rebuilt around systems.",
      price: 9000,
      metrics: { revenue: 27000, clients: 3, retention: 92, transformation: 84 },
    },
  ];

  for (const [index, offer] of offers.entries()) {
    const created = await prisma.moshOffer.create({
      data: {
        userId,
        tier: offer.tier,
        name: offer.name,
        promise: offer.promise,
        price: offer.price,
        position: index,
      },
    });

    // Three months of reported metrics, growing toward the present.
    for (let back = 2; back >= 0; back -= 1) {
      const month = monthStart(addDays(monthStart(today), -back * 28));
      const scale = 1 - back * 0.25;
      await prisma.moshOfferMetric.create({
        data: {
          offerId: created.id,
          month,
          revenue: Math.round((offer.metrics.revenue ?? 0) * scale),
          leads: Math.round((offer.metrics.leads ?? 0) * scale),
          conversions: Math.round((offer.metrics.conversions ?? 0) * scale),
          subscribers: Math.round((offer.metrics.subscribers ?? 0) * scale),
          downloads: Math.round((offer.metrics.downloads ?? 0) * scale),
          students: Math.round((offer.metrics.students ?? 0) * scale),
          satisfaction: offer.metrics.satisfaction ?? null,
          completionRate: offer.metrics.completionRate ?? null,
          clients: Math.round((offer.metrics.clients ?? 0) * scale),
          retention: offer.metrics.retention ?? null,
          transformation: offer.metrics.transformation ?? null,
        },
      });
    }
  }

  // ---- funnel snapshots -----------------------------------------------------
  for (let week = 6; week >= 0; week -= 1) {
    const scale = 1 - week * 0.1;
    await prisma.moshFunnelSnapshot.create({
      data: {
        userId,
        date: addDays(today, -week * 7),
        visitors: Math.round(5200 * scale),
        leads: Math.round(620 * scale),
        subscribers: Math.round(512 * scale),
        customers: Math.round(148 * scale),
        students: Math.round(12 * scale),
        mentorship: Math.round(3 * scale),
        advocates: Math.round(9 * scale),
      },
    });
  }

  // ---- the fifty days -------------------------------------------------------
  await prisma.moshEclipseDay.createMany({
    data: ECLIPSE_PLAN.map((template) => ({
      userId,
      day: template.day,
      phase: template.phase,
      focus: template.focus,
      action: template.action,
      done: template.day <= 12,
      completedAt: template.day <= 12 ? new Date() : null,
    })),
    skipDuplicates: true,
  });

  // ---- the letter -----------------------------------------------------------
  await prisma.moshLegacyLetter.create({
    data: {
      userId,
      kind: "FUTURE_WISDOM",
      title: DEFAULT_LEGACY_LETTER.title,
      body: DEFAULT_LEGACY_LETTER.body,
      pinned: true,
    },
  });

  return { seeded: true, reason: `Demo data attached to ${user.email}.` };
}
