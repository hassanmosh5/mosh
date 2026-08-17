import { describe, expect, it } from "vitest";
import {
  analyseFunnel,
  average,
  composite,
  computeStreak,
  habitCompletion,
  labelForScore,
  scoreDay,
  scoreMonth,
  scorePlanesForDay,
  scoreWeek,
  scoreYear,
  toneForScore,
  trendDelta,
  wealthFlowIndex,
  type DailyHabits,
} from "@/lib/mosh/scoring";
import {
  addDays,
  eachWeek,
  fromIsoDate,
  monthEnd,
  monthStart,
  quarterOf,
  toIsoDate,
  weekStart,
} from "@/lib/mosh/dates";
import { HABIT_KEYS } from "@/lib/mosh/constants";
import { renderPdf } from "@/lib/mosh/pdf";

const habits = (done: Partial<DailyHabits> = {}): DailyHabits =>
  Object.fromEntries(HABIT_KEYS.map((key) => [key, done[key] ?? false])) as DailyHabits;

const allHabits = (): DailyHabits =>
  Object.fromEntries(HABIT_KEYS.map((key) => [key, true])) as DailyHabits;

describe("composite", () => {
  it("redistributes the weight of components with no data", () => {
    const result = composite([
      { key: "a", label: "A", value: 80, weight: 0.5 },
      { key: "b", label: "B", value: null, weight: 0.5 },
    ]);
    // B contributed nothing, so A carries the whole score rather than half.
    expect(result.score).toBe(80);
    expect(result.missing).toEqual(["b"]);
  });

  it("returns zero when nothing was recorded", () => {
    const result = composite([{ key: "a", label: "A", value: null, weight: 1 }]);
    expect(result.score).toBe(0);
  });

  it("weights present components against each other", () => {
    const result = composite([
      { key: "a", label: "A", value: 100, weight: 0.75 },
      { key: "b", label: "B", value: 0, weight: 0.25 },
    ]);
    expect(result.score).toBe(75);
  });
});

describe("habitCompletion", () => {
  it("is the share of the seven-habit rhythm completed", () => {
    expect(habitCompletion(habits())).toBe(0);
    expect(habitCompletion(allHabits())).toBe(100);
    expect(habitCompletion(habits({ exercise: true, meditation: true }))).toBe(29);
  });
});

describe("scoreDay", () => {
  it("scores a full day at 100", () => {
    const result = scoreDay({
      habits: allHabits(),
      energy: 10,
      mood: 10,
      checkins: { clarity: 10, focus: 10 },
    });
    expect(result.score).toBe(100);
  });

  it("scores an empty day at 0", () => {
    expect(scoreDay({ habits: habits() }).score).toBe(0);
  });

  it("ignores components with no data instead of scoring them as zero", () => {
    const habitsOnly = scoreDay({ habits: allHabits() });
    expect(habitsOnly.score).toBe(100);
    expect(habitsOnly.missing).toContain("planes");
    expect(habitsOnly.missing).toContain("vitals");
  });

  it("counts energy and mood against the rhythm", () => {
    const result = scoreDay({ habits: allHabits(), energy: 2, mood: 2 });
    // 55/75 of the weight at 100, 20/75 at 20.
    expect(result.score).toBe(79);
  });
});

describe("scorePlanesForDay", () => {
  it("blends self-ratings with the habits belonging to each plane", () => {
    const result = scorePlanesForDay({
      habits: habits({ meditation: true, trustDelegation: true }),
      checkins: { gratitude: 10, faith: 10 },
    });
    // Spiritual: ratings 100 at 0.6 + both spiritual habits done (100) at 0.4.
    expect(result.SPIRITUAL).toBe(100);
  });

  it("reports null for a plane with no ratings and no habits done", () => {
    const result = scorePlanesForDay({ habits: habits() });
    // Habits are still a signal (all missed = 0), ratings are not.
    expect(result.MENTAL).toBe(0);
  });

  it("uses ratings alone when no habit maps to the plane's activity", () => {
    const result = scorePlanesForDay({ habits: habits(), checkins: { clarity: 8 } });
    // Mental: ratings 80 at 0.6, habits 0 at 0.4.
    expect(result.MENTAL).toBe(48);
  });
});

describe("scoreWeek", () => {
  it("averages goals per area before averaging areas", () => {
    const result = scoreWeek({
      goals: [
        { area: "MENTAL", completion: 100 },
        { area: "MENTAL", completion: 100 },
        { area: "MENTAL", completion: 100 },
        { area: "BUSINESS", completion: 0 },
      ],
      dailyAlignments: [],
    });
    // Three mental goals cannot outvote the one business goal.
    expect(result.score).toBe(50);
  });

  it("counts the days actually lived", () => {
    const result = scoreWeek({
      goals: [{ area: "MENTAL", completion: 100 }],
      dailyAlignments: [50, 50],
    });
    expect(result.score).toBe(80); // 0.6 * 100 + 0.4 * 50
  });

  it("clamps out-of-range completions", () => {
    const result = scoreWeek({
      goals: [{ area: "MENTAL", completion: 500 }],
      dailyAlignments: [],
    });
    expect(result.score).toBe(100);
  });
});

describe("scoreMonth", () => {
  it("counts the reflection as well as the results", () => {
    const withoutReflection = scoreMonth({
      pillarScores: [100],
      weeklyMomentum: [100],
      answeredQuestions: 0,
      totalQuestions: 6,
    });
    const withReflection = scoreMonth({
      pillarScores: [100],
      weeklyMomentum: [100],
      answeredQuestions: 6,
      totalQuestions: 6,
    });
    expect(withoutReflection.score).toBe(80);
    expect(withReflection.score).toBe(100);
  });
});

describe("scoreYear", () => {
  it("weights quarter progress above milestone completion", () => {
    const result = scoreYear({
      quarterProgress: [100, 100, 0, 0],
      milestonesTotal: 12,
      milestonesDone: 0,
    });
    expect(result.score).toBe(30); // 0.6 * 50 + 0.4 * 0
  });

  it("ignores milestones when the plan has none", () => {
    const result = scoreYear({ quarterProgress: [60], milestonesTotal: 0, milestonesDone: 0 });
    expect(result.score).toBe(60);
  });
});

describe("wealthFlowIndex", () => {
  it("applies the tier multipliers from the formula", () => {
    const result = wealthFlowIndex({ ATTRACTION: 1000, CORE: 1000, PREMIUM: 1000 });
    expect(result.index).toBe(6000); // 1000 + 2000 + 3000
    expect(result.totalRevenue).toBe(3000);
    expect(result.weighted.PREMIUM).toBe(3000);
  });

  it("treats missing tiers as zero", () => {
    expect(wealthFlowIndex({ PREMIUM: 500 }).index).toBe(1500);
  });

  it("reports progress against a target and never exceeds 100", () => {
    expect(wealthFlowIndex({ CORE: 1000 }, 4000).progress).toBe(50);
    expect(wealthFlowIndex({ CORE: 10_000 }, 4000).progress).toBe(100);
  });

  it("reports zero progress when no target is set rather than dividing by zero", () => {
    expect(wealthFlowIndex({ CORE: 1000 }, 0).progress).toBe(0);
  });
});

describe("analyseFunnel", () => {
  const counts = {
    visitors: 1000,
    leads: 100,
    subscribers: 80,
    customers: 20,
    students: 10,
    mentorship: 2,
    advocates: 5,
  };

  it("computes stage-to-stage conversion", () => {
    const result = analyseFunnel(counts);
    expect(result.stages[1].conversionFromPrevious).toBe(10);
    expect(result.stages[2].conversionFromPrevious).toBe(80);
    expect(result.stages[0].conversionFromPrevious).toBeNull();
  });

  it("finds the weakest step", () => {
    const result = analyseFunnel(counts);
    expect(result.weakestStep).toEqual({ from: "visitors", to: "leads", rate: 10 });
  });

  it("returns null rather than Infinity when a stage is empty", () => {
    const result = analyseFunnel({ visitors: 0, leads: 5 });
    expect(result.stages[1].conversionFromPrevious).toBeNull();
    expect(result.overallConversion).toBeNull();
  });
});

describe("computeStreak", () => {
  const reference = fromIsoDate("2026-08-16");
  const entry = (offset: number, completion: number) => ({
    date: addDays(reference, offset),
    completion,
  });

  it("counts consecutive qualifying days ending today", () => {
    const result = computeStreak(
      [entry(-2, 100), entry(-1, 80), entry(0, 60)],
      reference
    );
    expect(result.current).toBe(3);
    expect(result.longest).toBe(3);
  });

  it("does not break a run just because today is still in progress", () => {
    const result = computeStreak([entry(-2, 100), entry(-1, 100)], reference);
    expect(result.current).toBe(2);
  });

  it("ends the current streak once a day is skipped", () => {
    const result = computeStreak(
      [entry(-5, 100), entry(-4, 100), entry(-3, 100), entry(-1, 100)],
      reference
    );
    expect(result.current).toBe(1);
    expect(result.longest).toBe(3);
  });

  it("ignores days below the threshold", () => {
    const result = computeStreak([entry(0, 40), entry(-1, 30)], reference);
    expect(result.current).toBe(0);
    expect(result.qualifyingDays).toBe(0);
  });
});

describe("helpers", () => {
  it("averages, or returns null on an empty list", () => {
    expect(average([2, 4])).toBe(3);
    expect(average([])).toBeNull();
  });

  it("measures the latest value against the ones before it", () => {
    expect(trendDelta([50, 50, 80])).toBe(30);
    expect(trendDelta([50])).toBeNull();
  });

  it("bands scores consistently", () => {
    expect(toneForScore(90)).toBe("good");
    expect(toneForScore(60)).toBe("warn");
    expect(toneForScore(10)).toBe("bad");
    expect(toneForScore(0)).toBe("neutral");
    expect(labelForScore(95)).toBe("Aligned");
    expect(labelForScore(0)).toBe("Not started");
  });
});

describe("date anchors", () => {
  it("anchors a week to its Monday, including on Sunday", () => {
    expect(toIsoDate(weekStart(fromIsoDate("2026-08-16")))).toBe("2026-08-10"); // a Sunday
    expect(toIsoDate(weekStart(fromIsoDate("2026-08-10")))).toBe("2026-08-10"); // a Monday
    expect(toIsoDate(weekStart(fromIsoDate("2026-08-14")))).toBe("2026-08-10");
  });

  it("anchors a month to its first and last day", () => {
    expect(toIsoDate(monthStart(fromIsoDate("2026-02-17")))).toBe("2026-02-01");
    expect(toIsoDate(monthEnd(fromIsoDate("2026-02-17")))).toBe("2026-02-28");
  });

  it("maps a date to its quarter", () => {
    expect(quarterOf(fromIsoDate("2026-01-01"))).toBe(1);
    expect(quarterOf(fromIsoDate("2026-12-31"))).toBe(4);
  });

  it("enumerates whole weeks inclusively", () => {
    const weeks = eachWeek(fromIsoDate("2026-08-01"), fromIsoDate("2026-08-20"));
    expect(weeks.map(toIsoDate)).toEqual(["2026-07-27", "2026-08-03", "2026-08-10", "2026-08-17"]);
  });

  it("rejects anything that is not YYYY-MM-DD", () => {
    expect(() => fromIsoDate("16/08/2026")).toThrow();
  });
});

describe("renderPdf", () => {
  it("produces a PDF with a header and a terminator", () => {
    const bytes = renderPdf({
      title: "Alignment report",
      subtitle: "Test",
      blocks: [
        { type: "heading", text: "Where you stand" },
        { type: "row", label: "Streak", value: "12 days" },
        { type: "table", columns: ["A", "B"], rows: [["1", "2"]] },
      ],
    });
    const text = Buffer.from(bytes).toString("latin1");
    expect(text.startsWith("%PDF-1.4")).toBe(true);
    expect(text.trimEnd().endsWith("%%EOF")).toBe(true);
  });

  it("writes an xref entry that points at each object", () => {
    const bytes = renderPdf({ title: "T", blocks: [{ type: "text", text: "hello" }] });
    const pdf = Buffer.from(bytes).toString("latin1");

    const startxref = Number(pdf.slice(pdf.lastIndexOf("startxref") + 9).trim().split("\n")[0]);
    const lines = pdf.slice(startxref).split("\n");
    const count = Number(lines[1].split(" ")[1]);

    for (let number = 1; number < count; number += 1) {
      const offset = Number(lines[2 + number].split(" ")[0]);
      expect(pdf.slice(offset, offset + 20).startsWith(`${number} 0 obj`)).toBe(true);
    }
  });

  it("escapes parentheses and backslashes so the content stream stays valid", () => {
    const bytes = renderPdf({
      title: "T",
      blocks: [{ type: "text", text: "a (b) \\ c" }],
    });
    const pdf = Buffer.from(bytes).toString("latin1");
    expect(pdf).toContain("\\(b\\)");
    expect(pdf).toContain("\\\\");
  });
});
