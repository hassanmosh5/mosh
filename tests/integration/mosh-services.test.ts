import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { disconnect, hasDatabase, prisma } from "./setup";
import type { MoshContext } from "@/lib/mosh/context";
import { getDay, getStreak, habitBreakdown, saveDay } from "@/lib/mosh/services/daily";
import { getWeek, saveWeek, weeklyTrend } from "@/lib/mosh/services/weekly";
import { getMonth, saveMonth } from "@/lib/mosh/services/monthly";
import { createMilestone, getYearPlan, updateMilestone, updateQuarter } from "@/lib/mosh/services/plan";
import { getBusiness, saveOffer, saveOfferMetric, wealthFlowForMonth } from "@/lib/mosh/services/business";
import { getFunnel, saveSnapshot } from "@/lib/mosh/services/funnel";
import { startEclipse, updateEclipseDay } from "@/lib/mosh/services/eclipse";
import { listLetters, saveLetter } from "@/lib/mosh/services/legacy";
import { reflect } from "@/lib/mosh/services/coach";
import { getDashboard } from "@/lib/mosh/services/dashboard";
import { getAnalytics } from "@/lib/mosh/services/analytics";
import { buildExport, buildYearReport } from "@/lib/mosh/services/export";
import { addDays, monthStart, toIsoDate, today, weekStart } from "@/lib/mosh/dates";
import {
  dailyEntrySchema,
  funnelSnapshotSchema,
  letterSchema,
  monthlyReviewSchema,
  offerMetricSchema,
  offerSchema,
  weeklyEntrySchema,
} from "@/lib/mosh/schemas";

/**
 * MOSH services against a real database.
 *
 * These exercise the things unit tests cannot: the upsert-on-anchor behaviour
 * that keeps one row per period, the cascade when a goal is dropped from a
 * week, and — most importantly — that one user can never read another's
 * journal.
 */

const describeDb = hasDatabase ? describe : describe.skip;

let counter = 0;

async function createUser(): Promise<MoshContext> {
  const unique = `${Date.now().toString(36)}-${(counter += 1)}`;
  const user = await prisma.user.create({
    data: { email: `mosh-test-${unique}@example.test`, name: "Test Person" },
  });
  const profile = await prisma.moshProfile.create({
    data: { userId: user.id, displayName: "Test Person", planYear: today().getUTCFullYear() },
  });

  return {
    userId: user.id,
    userName: "Test Person",
    userEmail: user.email,
    displayName: "Test Person",
    currency: profile.currency,
    timezone: profile.timezone,
    philosophy: profile.philosophy,
    title: profile.title,
    planYear: profile.planYear!,
    eclipseStart: null,
  };
}

describeDb("MOSH services against a real database", () => {
  let alice: MoshContext;
  let bob: MoshContext;

  beforeAll(async () => {
    alice = await createUser();
    bob = await createUser();
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: { in: [alice.userId, bob.userId] } } });
    await disconnect();
  });

  describe("daily tracker", () => {
    it("upserts one row per day and derives the scores", async () => {
      const date = toIsoDate(today());

      const first = await saveDay(
        alice,
        dailyEntrySchema.parse({
          date,
          morningRhythm: true,
          exercise: true,
          gratitude: "Water and work.",
          energy: 8,
          mood: 8,
          checkins: { clarity: 9, focus: 8 },
        })
      );
      expect(first.completion).toBe(29);
      expect(first.alignment).toBeGreaterThan(0);

      // A second save of the same day updates it rather than forking a row.
      const second = await saveDay(alice, dailyEntrySchema.parse({ date, creativeWork: true }));
      expect(second.completion).toBe(43);
      // Fields absent from the payload keep their stored values.
      expect(second.gratitude).toBe("Water and work.");
      expect(second.energy).toBe(8);
      expect(second.checkins.clarity).toBe(9);

      const rows = await prisma.moshDailyEntry.count({ where: { userId: alice.userId } });
      expect(rows).toBe(1);
    });

    it("clears a plane check-in when null is sent", async () => {
      const date = toIsoDate(today());
      await saveDay(alice, dailyEntrySchema.parse({ date, checkins: { clarity: null } }));
      const entry = await getDay(alice, date);
      expect(entry.checkins.clarity).toBeUndefined();
      expect(entry.checkins.focus).toBe(8);
    });

    it("computes streaks and per-habit rates from stored days", async () => {
      for (let offset = 1; offset <= 3; offset += 1) {
        await saveDay(
          alice,
          dailyEntrySchema.parse({
            date: toIsoDate(addDays(today(), -offset)),
            morningRhythm: true,
            exercise: true,
            creativeWork: true,
            journaling: true,
            meditation: true,
          })
        );
      }

      const streak = await getStreak(alice);
      expect(streak.longest).toBeGreaterThanOrEqual(3);

      const habits = await habitBreakdown(alice, { from: addDays(today(), -7), to: today() });
      const morning = habits.find((habit) => habit.key === "morningRhythm");
      expect(morning?.rate).toBe(100);
    });

    it("distinguishes a field left out of a save from one the person cleared", async () => {
      const date = toIsoDate(addDays(today(), -6));

      await saveDay(alice, dailyEntrySchema.parse({ date, gratitude: "Rain, and quiet." }));

      // Toggling a habit must not wipe prose the form did not resend.
      const afterToggle = await saveDay(alice, dailyEntrySchema.parse({ date, exercise: true }));
      expect(afterToggle.gratitude).toBe("Rain, and quiet.");

      // An explicit empty string is a deletion and must stick.
      const afterClear = await saveDay(alice, dailyEntrySchema.parse({ date, gratitude: "" }));
      expect(afterClear.gratitude).toBeNull();
    });

    it("never returns another person's day", async () => {
      const date = toIsoDate(today());
      const mine = await getDay(bob, date);
      expect(mine.completion).toBe(0);
      expect(mine.gratitude).toBeNull();
    });
  });

  describe("weekly tracker", () => {
    it("saves goals, then deletes the ones dropped from the payload", async () => {
      const start = toIsoDate(weekStart(today()));

      const saved = await saveWeek(
        alice,
        weeklyEntrySchema.parse({
          weekStart: start,
          intention: "Root and routine.",
          goals: [
            { area: "MENTAL", goal: "Read 100 pages", completion: 60 },
            { area: "BUSINESS", goal: "Publish the offer", completion: 40 },
          ],
        })
      );
      expect(saved.goals).toHaveLength(2);
      expect(saved.momentum).toBeGreaterThan(0);

      const pruned = await saveWeek(
        alice,
        weeklyEntrySchema.parse({
          weekStart: start,
          goals: [{ id: saved.goals[0].id, area: "MENTAL", goal: "Read 100 pages", completion: 100 }],
        })
      );
      expect(pruned.goals).toHaveLength(1);
      expect(pruned.goals[0].completion).toBe(100);

      const trend = await weeklyTrend(alice, 4);
      expect(trend).toHaveLength(4);
      expect(trend[trend.length - 1].momentum).toBe(pruned.momentum);
    });

    it("counts the days recorded inside the week", async () => {
      const week = await getWeek(alice);
      expect(week.daysRecorded).toBeGreaterThan(0);
    });
  });

  describe("monthly review", () => {
    it("stores five pillars against one month and scores the reflection", async () => {
      const month = toIsoDate(monthStart(today()));

      const review = await saveMonth(
        alice,
        monthlyReviewSchema.parse({
          month,
          energyGivers: "Morning walks",
          proudOf: "Consistency",
          pillars: [
            { area: "MENTAL", achievements: "Deep work daily", score: 70 },
            { area: "BUSINESS", achievements: "Offer live", score: 55 },
          ],
        })
      );

      expect(review.answered).toBe(2);
      expect(review.growth).toBeGreaterThan(0);
      expect(review.pillars).toHaveLength(5); // all five are always returned

      // Saving again updates the same pillars rather than duplicating them.
      await saveMonth(
        alice,
        monthlyReviewSchema.parse({
          month,
          pillars: [{ area: "MENTAL", achievements: "Updated", score: 90 }],
        })
      );
      const stored = await prisma.moshMonthlyPillar.count({
        where: { review: { userId: alice.userId } },
      });
      expect(stored).toBe(2);

      const reloaded = await getMonth(alice);
      expect(reloaded.pillars.find((pillar) => pillar.area === "MENTAL")?.score).toBe(90);
    });
  });

  describe("365-day plan", () => {
    it("seeds four quarters with twelve milestones on first access", async () => {
      const plan = await getYearPlan(alice);
      expect(plan.quarters).toHaveLength(4);
      expect(plan.quarters[0].title).toBe("Root and Routine");
      expect(plan.milestonesTotal).toBe(12);
      expect(plan.quarters[3].goal).toContain("three scalable income streams");
    });

    it("blends self-reported progress with milestones completed", async () => {
      const plan = await getYearPlan(alice);
      const first = plan.quarters[0];

      await updateQuarter(alice, { id: first.id, progress: 100, revenueTarget: 9000 });
      const afterProgress = await getYearPlan(alice);
      // 100% claimed, 0 of 3 milestones done.
      expect(afterProgress.quarters[0].effectiveProgress).toBe(50);

      for (const milestone of afterProgress.quarters[0].milestones) {
        await updateMilestone(alice, { id: milestone.id, done: true });
      }
      const afterMilestones = await getYearPlan(alice);
      expect(afterMilestones.quarters[0].effectiveProgress).toBe(100);
      expect(afterMilestones.annualAlignment).toBeGreaterThan(0);
    });

    it("refuses to touch another person's quarter", async () => {
      const mine = await getYearPlan(alice);
      await expect(
        createMilestone(bob, { quarterId: mine.quarters[0].id, monthOffset: 1, title: "Sneaky", detail: null })
      ).rejects.toThrow(/could not be found/i);
    });
  });

  describe("business", () => {
    it("computes the Wealth Flow Index from reported revenue", async () => {
      const month = toIsoDate(monthStart(today()));

      // The index target comes from the *current* quarter's revenue target.
      const plan = await getYearPlan(alice);
      const currentQuarter = plan.quarters.find((quarter) => quarter.isCurrent);
      if (currentQuarter) {
        await updateQuarter(alice, { id: currentQuarter.id, revenueTarget: 9000 });
      }

      const attraction = await saveOffer(
        alice,
        offerSchema.parse({ tier: "ATTRACTION", name: "Alignment Starter", price: 0 })
      );
      const core = await saveOffer(
        alice,
        offerSchema.parse({ tier: "CORE", name: "Self-Mastery Program", price: 1200 })
      );
      const premium = await saveOffer(
        alice,
        offerSchema.parse({ tier: "PREMIUM", name: "Mentorship", price: 9000 })
      );

      await saveOfferMetric(
        alice,
        offerMetricSchema.parse({ offerId: attraction.id, month, revenue: 1000, leads: 400, conversions: 100 })
      );
      await saveOfferMetric(
        alice,
        offerMetricSchema.parse({ offerId: core.id, month, revenue: 1000, students: 12, satisfaction: 88 })
      );
      await saveOfferMetric(
        alice,
        offerMetricSchema.parse({ offerId: premium.id, month, revenue: 1000, clients: 3, retention: 92 })
      );

      const wealth = await wealthFlowForMonth(alice, today());
      expect(wealth.index).toBe(6000); // 1000×1 + 1000×2 + 1000×3
      expect(wealth.target).toBe(9000); // this quarter's revenue target
      expect(wealth.progress).toBe(67);

      const business = await getBusiness(alice, 12);
      expect(business.offers).toHaveLength(3);
      expect(business.tiers.find((tier) => tier.tier === "PREMIUM")?.weightedRevenue).toBe(3000);
      const attractionView = business.offers.find((offer) => offer.id === attraction.id);
      expect(attractionView?.totals.conversionRate).toBe(25);
    });

    it("rejects a metric for someone else's offer", async () => {
      const business = await getBusiness(alice, 12);
      await expect(
        saveOfferMetric(
          bob,
          offerMetricSchema.parse({
            offerId: business.offers[0].id,
            month: toIsoDate(monthStart(today())),
            revenue: 999,
          })
        )
      ).rejects.toThrow(/could not be found/i);
    });
  });

  describe("funnel", () => {
    it("analyses the latest snapshot and finds the weakest step", async () => {
      await saveSnapshot(
        alice,
        funnelSnapshotSchema.parse({
          date: toIsoDate(today()),
          visitors: 1000,
          leads: 100,
          subscribers: 80,
          customers: 20,
          students: 10,
          mentorship: 2,
          advocates: 5,
        })
      );

      const funnel = await getFunnel(alice);
      expect(funnel.latest?.counts.visitors).toBe(1000);
      expect(funnel.weakestStep?.from).toBe("visitors");
      expect(funnel.stages[1].conversionFromPrevious).toBe(10);
    });
  });

  describe("50-day eclipse", () => {
    it("materialises fifty days and tracks completion", async () => {
      const started = await startEclipse(alice, {
        startDate: toIsoDate(addDays(today(), -12)),
        reset: false,
      });
      expect(started.days).toHaveLength(50);
      expect(started.currentDay).toBe(13);
      expect(started.phases).toHaveLength(5);
      expect(started.phases[1].isCurrent).toBe(true);

      const ctx = { ...alice, eclipseStart: addDays(today(), -12) };
      const afterDone = await updateEclipseDay(ctx, { day: 1, done: true, note: "Named the season." });
      expect(afterDone.done).toBe(1);
      expect(afterDone.days[0].note).toBe("Named the season.");
      expect(afterDone.progress).toBe(2);

      // Re-opening a day keeps the note that explains what happened on it.
      const afterReopen = await updateEclipseDay(ctx, { day: 1, done: false });
      expect(afterReopen.days[0].done).toBe(false);
      expect(afterReopen.days[0].note).toBe("Named the season.");
    });
  });

  describe("legacy letters", () => {
    it("seeds the default letter on first read, then accepts new ones", async () => {
      const seeded = await listLetters(bob);
      expect(seeded).toHaveLength(1);
      expect(seeded[0].title).toBe("A Message From My 77-Year-Old Self");
      expect(seeded[0].body).toContain("peace and power are the same current");

      await saveLetter(
        bob,
        letterSchema.parse({ kind: "LEGACY_LESSON", title: "On patience", body: "It arrives." })
      );
      const all = await listLetters(bob);
      expect(all).toHaveLength(2);
      expect(all[0].pinned).toBe(true); // pinned letters stay on top
    });
  });

  describe("coaching", () => {
    it("answers from the written playbook and records the session", async () => {
      const session = await reflect(alice, {
        pattern: "PERFECTIONISM",
        situation: "Three finished pieces are still unpublished.",
      });

      expect(session.actions.length).toBeGreaterThan(0);
      expect(session.analysis).toContain("Perfectionism");
      // Without ANTHROPIC_API_KEY the deterministic engine answers, and says so.
      if (!process.env.ANTHROPIC_API_KEY) expect(session.source).toBe("RULES");

      const stored = await prisma.moshCoachSession.count({ where: { userId: alice.userId } });
      expect(stored).toBe(1);
    });
  });

  describe("dashboard, analytics and exports", () => {
    it("assembles the dashboard from every module", async () => {
      const dashboard = await getDashboard(alice);
      expect(dashboard.bars.map((bar) => bar.key)).toEqual(["daily", "weekly", "monthly", "wealth"]);
      expect(dashboard.meters).toHaveLength(4);
      expect(dashboard.todayHabits).toHaveLength(7);
      expect(dashboard.wealth.index).toBe(6000);
    });

    it("reports analytics across the window", async () => {
      const analytics = await getAnalytics(alice, 90);
      expect(analytics.habits).toHaveLength(7);
      expect(analytics.planes).toHaveLength(3);
      expect(analytics.daily.daysRecorded).toBeGreaterThan(0);
      expect(analytics.annual.milestonesTotal).toBe(12);
    });

    it("exports every dataset as CSV and PDF", async () => {
      for (const dataset of ["daily", "weekly", "monthly", "business", "funnel", "eclipse", "annual"] as const) {
        const csv = await buildExport(alice, { dataset, format: "csv" });
        expect(csv.filename.endsWith(".csv")).toBe(true);
        expect(typeof csv.body).toBe("string");
        expect((csv.body as string).split("\r\n")[0].length).toBeGreaterThan(0);

        const pdf = await buildExport(alice, { dataset, format: "pdf" });
        expect(pdf.contentType).toBe("application/pdf");
        expect(Buffer.from(pdf.body as Uint8Array).toString("latin1").startsWith("%PDF")).toBe(true);
      }

      const report = await buildYearReport(alice);
      expect(report.filename).toContain("mosh-year-report");
      expect((report.body as Uint8Array).length).toBeGreaterThan(1000);
    });

    it("quotes only the signed-in person's numbers", async () => {
      const dashboard = await getDashboard(bob);
      expect(dashboard.wealth.index).toBe(0);
      expect(dashboard.streak.current).toBe(0);
    });
  });
});
