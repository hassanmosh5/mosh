import { describe, expect, it } from "vitest";
import {
  goalProgress,
  goalRisk,
  prioritiseTasks,
  scoreAutomation,
  scoreDecision,
  scoreProjectHealth,
  scoreTask,
  weightedPipeline,
  type PrioritisableTask,
} from "@/lib/cos/scoring";

const NOW = new Date("2026-06-15T09:00:00Z");
const day = (offset: number) => new Date(NOW.getTime() + offset * 86_400_000);

function task(overrides: Partial<PrioritisableTask> = {}): PrioritisableTask {
  return {
    id: "t1",
    title: "Do the thing",
    priority: "MEDIUM",
    status: "PLANNED",
    dueDate: null,
    estimateMins: null,
    clientId: null,
    projectId: null,
    goalId: null,
    tags: [],
    ...overrides,
  };
}

describe("scoreProjectHealth", () => {
  const base = {
    status: "ACTIVE",
    deadline: day(60),
    completion: 50,
    overdueTasks: 0,
    blockedTasks: 0,
    openRisks: [],
    budget: null,
    spend: null,
    now: NOW,
  };

  it("is green when nothing is wrong", () => {
    const result = scoreProjectHealth(base);
    expect(result.health).toBe("GREEN");
    expect(result.score).toBe(100);
  });

  it("goes red when the deadline has passed", () => {
    const result = scoreProjectHealth({ ...base, deadline: day(-5), completion: 40 });
    expect(result.health).toBe("RED");
    expect(result.reasons.join(" ")).toContain("Deadline passed");
  });

  it("penalises overdue and blocked work", () => {
    const result = scoreProjectHealth({ ...base, overdueTasks: 4, blockedTasks: 2 });
    expect(result.score).toBeLessThan(100);
    expect(result.reasons.some((reason) => reason.includes("overdue"))).toBe(true);
    expect(result.reasons.some((reason) => reason.includes("blocked"))).toBe(true);
  });

  it("penalises a critical risk more than a low one", () => {
    const critical = scoreProjectHealth({ ...base, openRisks: [{ severity: "CRITICAL" }] });
    const low = scoreProjectHealth({ ...base, openRisks: [{ severity: "LOW" }] });
    expect(critical.score).toBeLessThan(low.score);
  });

  it("flags being over budget", () => {
    const result = scoreProjectHealth({ ...base, budget: 1000, spend: 1400 });
    expect(result.reasons.some((reason) => reason.includes("Over budget"))).toBe(true);
  });

  it("treats a closed project as healthy regardless of its history", () => {
    const result = scoreProjectHealth({
      ...base,
      status: "COMPLETED",
      deadline: day(-90),
      overdueTasks: 10,
      openRisks: [{ severity: "CRITICAL" }],
    });
    expect(result.health).toBe("GREEN");
  });

  it("clamps the score into 0-100 under compounding failures", () => {
    const result = scoreProjectHealth({
      ...base,
      status: "ON_HOLD",
      deadline: day(-40),
      completion: 5,
      overdueTasks: 20,
      blockedTasks: 10,
      openRisks: [{ severity: "CRITICAL" }, { severity: "CRITICAL" }, { severity: "HIGH" }],
      budget: 1000,
      spend: 5000,
    });
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.health).toBe("RED");
  });
});

describe("scoreTask", () => {
  it("ranks an overdue critical task above a distant low-priority one", () => {
    const urgent = scoreTask(task({ priority: "CRITICAL", dueDate: day(-3) }), NOW);
    const later = scoreTask(task({ id: "t2", priority: "LOW", dueDate: day(30) }), NOW);
    expect(urgent.score).toBeGreaterThan(later.score);
    expect(urgent.classification).toBe("URGENT");
  });

  it("classifies obviously repetitive work as automatable", () => {
    const result = scoreTask(task({ title: "Send monthly invoice reminders" }), NOW);
    expect(result.classification).toBe("AUTOMATABLE");
  });

  it("classifies production work as delegatable", () => {
    const result = scoreTask(task({ title: "Edit the podcast audio" }), NOW);
    expect(result.classification).toBe("DELEGATABLE");
  });

  it("treats goal-linked and client work as high value", () => {
    const result = scoreTask(task({ title: "Prepare board deck", goalId: "g1" }), NOW);
    expect(result.classification).toBe("HIGH_VALUE");
  });

  it("gives a task with no signals a low score", () => {
    const result = scoreTask(task({ priority: "LOW" }), NOW);
    expect(result.score).toBeLessThan(15);
    expect(result.classification).toBe("LOW_VALUE");
  });
});

describe("prioritiseTasks", () => {
  it("drops completed and cancelled work and sorts by score", () => {
    const scored = prioritiseTasks(
      [
        task({ id: "a", priority: "LOW" }),
        task({ id: "b", priority: "CRITICAL", dueDate: day(-1) }),
        task({ id: "c", status: "COMPLETED", priority: "CRITICAL" }),
        task({ id: "d", status: "CANCELLED", priority: "CRITICAL" }),
      ],
      NOW
    );
    expect(scored.map((entry) => entry.task.id)).toEqual(["b", "a"]);
  });

  it("returns an empty list for an empty input", () => {
    expect(prioritiseTasks([], NOW)).toEqual([]);
  });
});

describe("scoreDecision", () => {
  const neutral = {
    revenueImpact: 3, strategicFit: 3, customerValue: 3, cost: 3,
    timeToValue: 3, complexity: 3, risk: 3, automation: 3, scalability: 3,
  };

  it("recommends pursuing a strong, cheap, low-risk opportunity", () => {
    const result = scoreDecision({
      ...neutral,
      revenueImpact: 5, strategicFit: 5, customerValue: 5, automation: 5, scalability: 5,
      cost: 1, timeToValue: 1, complexity: 1, risk: 1,
    });
    expect(result.score).toBeGreaterThanOrEqual(90);
    expect(result.verdict).toBe("PURSUE");
  });

  it("declines an expensive, risky, low-value opportunity", () => {
    const result = scoreDecision({
      ...neutral,
      revenueImpact: 1, strategicFit: 1, customerValue: 1, automation: 1, scalability: 1,
      cost: 5, timeToValue: 5, complexity: 5, risk: 5,
    });
    expect(result.score).toBeLessThan(20);
    expect(result.verdict).toBe("DECLINE");
  });

  it("clamps out-of-range inputs instead of producing a nonsense score", () => {
    const result = scoreDecision({ ...neutral, revenueImpact: 99, risk: -8 });
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("names the strong factors as drivers and the costly ones as drags", () => {
    const result = scoreDecision({ ...neutral, revenueImpact: 5, risk: 5 });
    expect(result.drivers.join(" ")).toContain("revenue impact");
    expect(result.drags.join(" ")).toContain("risk");
  });
});

describe("scoreAutomation", () => {
  it("rates a frequent, slow, simple, valuable process highly", () => {
    const result = scoreAutomation({
      frequencyPerMonth: 20, minutesPerRun: 60, minutesAfter: 5,
      complexity: 1, businessValue: 5,
    });
    expect(result.rating).toBe("HIGH");
    expect(result.monthlyHoursSaved).toBeCloseTo(18.33, 1);
  });

  it("rates a rare, fast, complex process low", () => {
    const result = scoreAutomation({
      frequencyPerMonth: 1, minutesPerRun: 5, minutesAfter: 4,
      complexity: 5, businessValue: 1,
    });
    expect(result.rating).toBe("LOW");
  });

  it("never reports a negative saving when the automated time is larger", () => {
    const result = scoreAutomation({
      frequencyPerMonth: 4, minutesPerRun: 10, minutesAfter: 40,
      complexity: 2, businessValue: 3,
    });
    expect(result.monthlyMinutesSaved).toBe(0);
    expect(result.payoffNote).toContain("No measurable time saving");
  });

  it("handles a zero-frequency process without dividing by zero", () => {
    const result = scoreAutomation({
      frequencyPerMonth: 0, minutesPerRun: 30, minutesAfter: 5,
      complexity: 3, businessValue: 3,
    });
    expect(Number.isFinite(result.score)).toBe(true);
    expect(result.monthlyHoursSaved).toBe(0);
  });
});

describe("weightedPipeline", () => {
  it("weights each deal by its probability", () => {
    expect(
      weightedPipeline([
        { value: 10_000, probability: 50, stage: "PROPOSAL" },
        { value: 20_000, probability: 25, stage: "QUALIFIED" },
      ])
    ).toBe(10_000);
  });

  it("excludes lost deals", () => {
    expect(
      weightedPipeline([
        { value: 10_000, probability: 100, stage: "LOST" },
        { value: 10_000, probability: 100, stage: "WON", status: "WON" },
      ])
    ).toBe(10_000);
  });

  it("clamps out-of-range probabilities", () => {
    expect(weightedPipeline([{ value: 1_000, probability: 400, stage: "PROPOSAL" }])).toBe(1_000);
    expect(weightedPipeline([{ value: 1_000, probability: -50, stage: "PROPOSAL" }])).toBe(0);
  });
});

describe("goalProgress and goalRisk", () => {
  it("computes progress and clamps above target", () => {
    expect(goalProgress(50, 200)).toBe(25);
    expect(goalProgress(500, 200)).toBe(100);
  });

  it("returns zero progress when there is no target", () => {
    expect(goalProgress(50, null)).toBe(0);
    expect(goalProgress(50, 0)).toBe(0);
  });

  it("flags a goal that is materially behind the elapsed time", () => {
    const risk = goalRisk(20, day(-60), day(30), NOW);
    expect(risk?.atRisk).toBe(true);
    expect(risk?.expectedPct).toBeGreaterThan(50);
  });

  it("does not flag a goal that is ahead of pace", () => {
    const risk = goalRisk(90, day(-30), day(60), NOW);
    expect(risk?.atRisk).toBe(false);
  });

  it("returns null when there is no deadline to judge against", () => {
    expect(goalRisk(50, day(-30), null, NOW)).toBeNull();
  });
});
