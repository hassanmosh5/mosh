/**
 * Deterministic scoring engines.
 *
 * These are pure functions on purpose: the AI *explains* scores, it does not
 * invent them. Every number shown in the UI or quoted by the Chief of Staff is
 * computed here from real records, which is what makes the output auditable.
 */

import { daysBetween } from "./format";

// ---------------------------------------------------------------------------
// Project health
// ---------------------------------------------------------------------------

export type ProjectHealthInput = {
  status: string;
  deadline: Date | null;
  completion: number; // 0-100
  overdueTasks: number;
  blockedTasks: number;
  openRisks: { severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" }[];
  budget: number | null;
  spend: number | null;
  now?: Date;
};

export type ProjectHealthResult = {
  health: "GREEN" | "YELLOW" | "RED";
  score: number; // 0-100, higher is healthier
  reasons: string[];
};

/**
 * Health starts at 100 and loses points for each real signal of trouble:
 * deadline pressure relative to completion, overdue and blocked work, open
 * risks, and budget burn.
 */
export function scoreProjectHealth(input: ProjectHealthInput): ProjectHealthResult {
  const now = input.now ?? new Date();
  const reasons: string[] = [];
  let score = 100;

  if (input.status === "COMPLETED" || input.status === "CANCELLED") {
    return { health: "GREEN", score: 100, reasons: ["Project is closed."] };
  }

  if (input.status === "ON_HOLD") {
    score -= 15;
    reasons.push("Project is on hold.");
  }

  // A missed deadline on unfinished work is red on its own, whatever else the
  // score says — it is the signal the founder must not be able to miss.
  let forceRed = false;

  if (input.deadline) {
    const daysLeft = daysBetween(now, input.deadline);
    const completion = Math.max(0, Math.min(100, input.completion));

    if (daysLeft < 0) {
      score -= 40;
      if (completion < 90) forceRed = true;
      reasons.push(`Deadline passed ${Math.abs(daysLeft)} days ago.`);
    } else if (daysLeft <= 7 && completion < 80) {
      score -= 25;
      reasons.push(`Only ${daysLeft} days left with ${completion}% complete.`);
    } else if (daysLeft <= 21 && completion < 40) {
      score -= 15;
      reasons.push(`${daysLeft} days left with ${completion}% complete.`);
    }
  }

  if (input.overdueTasks > 0) {
    score -= Math.min(25, input.overdueTasks * 5);
    reasons.push(`${input.overdueTasks} overdue task${input.overdueTasks === 1 ? "" : "s"}.`);
  }

  if (input.blockedTasks > 0) {
    score -= Math.min(20, input.blockedTasks * 7);
    reasons.push(`${input.blockedTasks} blocked task${input.blockedTasks === 1 ? "" : "s"}.`);
  }

  const riskPenalty = input.openRisks.reduce((total, risk) => {
    switch (risk.severity) {
      case "CRITICAL": return total + 20;
      case "HIGH": return total + 12;
      case "MEDIUM": return total + 6;
      default: return total + 2;
    }
  }, 0);
  if (riskPenalty > 0) {
    score -= Math.min(30, riskPenalty);
    reasons.push(`${input.openRisks.length} open risk${input.openRisks.length === 1 ? "" : "s"}.`);
  }

  if (input.budget && input.budget > 0 && input.spend !== null && input.spend !== undefined) {
    const burn = input.spend / input.budget;
    if (burn > 1) {
      score -= 20;
      reasons.push(`Over budget (${Math.round(burn * 100)}% spent).`);
    } else if (burn > 0.85 && input.completion < 85) {
      score -= 10;
      reasons.push(`${Math.round(burn * 100)}% of budget spent at ${input.completion}% complete.`);
    }
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const health = forceRed ? "RED" : score >= 75 ? "GREEN" : score >= 45 ? "YELLOW" : "RED";
  if (reasons.length === 0) reasons.push("No risk signals detected.");

  return { health, score, reasons };
}

// ---------------------------------------------------------------------------
// Task prioritisation
// ---------------------------------------------------------------------------

export type PrioritisableTask = {
  id: string;
  title: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: string;
  dueDate: Date | null;
  estimateMins: number | null;
  clientId: string | null;
  projectId: string | null;
  goalId: string | null;
  tags: string[];
};

export type TaskClassification =
  | "URGENT"
  | "IMPORTANT"
  | "HIGH_VALUE"
  | "DELEGATABLE"
  | "AUTOMATABLE"
  | "LOW_VALUE";

export type ScoredTask = {
  task: PrioritisableTask;
  score: number;
  classification: TaskClassification;
  reasons: string[];
};

const PRIORITY_WEIGHT: Record<PrioritisableTask["priority"], number> = {
  CRITICAL: 40,
  HIGH: 28,
  MEDIUM: 14,
  LOW: 5,
};

const AUTOMATABLE_HINTS = [
  "invoice", "report", "reminder", "follow-up", "follow up", "onboarding",
  "backup", "post", "schedule", "export", "sync", "data entry",
];
const DELEGATABLE_HINTS = [
  "edit", "format", "upload", "research", "draft", "design", "caption", "thumbnail",
];

/**
 * The founder's prioritisation model (see USER_GUIDE.md):
 *   critical client issues > revenue work > strategic work > deadlines >
 *   risks > operational work > automation > admin.
 */
export function scoreTask(task: PrioritisableTask, now = new Date()): ScoredTask {
  const reasons: string[] = [];
  let score = PRIORITY_WEIGHT[task.priority];
  reasons.push(`${task.priority.toLowerCase()} priority`);

  if (task.dueDate) {
    const daysLeft = daysBetween(now, task.dueDate);
    if (daysLeft < 0) {
      score += 35 + Math.min(15, Math.abs(daysLeft));
      reasons.push(`overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? "" : "s"}`);
    } else if (daysLeft === 0) {
      score += 30;
      reasons.push("due today");
    } else if (daysLeft <= 3) {
      score += 18;
      reasons.push(`due in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`);
    } else if (daysLeft <= 7) {
      score += 8;
      reasons.push("due this week");
    }
  }

  if (task.clientId) {
    score += 12;
    reasons.push("client-facing");
  }
  if (task.goalId) {
    score += 10;
    reasons.push("tied to a goal");
  }
  if (task.projectId) {
    score += 4;
  }
  if (task.status === "BLOCKED") {
    score += 6;
    reasons.push("blocked — needs unblocking");
  }
  if (task.status === "IN_PROGRESS") {
    score += 5;
    reasons.push("already in progress");
  }

  const haystack = `${task.title} ${task.tags.join(" ")}`.toLowerCase();
  const automatable = AUTOMATABLE_HINTS.some((hint) => haystack.includes(hint));
  const delegatable = DELEGATABLE_HINTS.some((hint) => haystack.includes(hint));

  let classification: TaskClassification;
  if (task.priority === "CRITICAL" || (task.dueDate && daysBetween(now, task.dueDate) < 0)) {
    classification = "URGENT";
  } else if (automatable) {
    classification = "AUTOMATABLE";
  } else if (delegatable) {
    classification = "DELEGATABLE";
  } else if (task.goalId || task.clientId) {
    classification = "HIGH_VALUE";
  } else if (task.priority === "LOW") {
    classification = "LOW_VALUE";
  } else {
    classification = "IMPORTANT";
  }

  if (classification === "AUTOMATABLE") reasons.push("looks automatable");
  if (classification === "DELEGATABLE") reasons.push("looks delegatable");

  return { task, score: Math.round(score), classification, reasons };
}

export function prioritiseTasks(tasks: PrioritisableTask[], now = new Date()): ScoredTask[] {
  return tasks
    .filter((t) => t.status !== "COMPLETED" && t.status !== "CANCELLED")
    .map((t) => scoreTask(t, now))
    .sort((a, b) => b.score - a.score);
}

// ---------------------------------------------------------------------------
// Decision engine
// ---------------------------------------------------------------------------

export type DecisionFactors = {
  revenueImpact: number; // 1-5, higher is better
  strategicFit: number; // 1-5, higher is better
  customerValue: number; // 1-5, higher is better
  automation: number; // 1-5, higher is better
  scalability: number; // 1-5, higher is better
  cost: number; // 1-5, higher means more expensive
  timeToValue: number; // 1-5, higher means slower
  complexity: number; // 1-5, higher means harder
  risk: number; // 1-5, higher means riskier
};

export type DecisionResult = {
  score: number; // 0-100
  verdict: "PURSUE" | "CONSIDER" | "DEFER" | "DECLINE";
  drivers: string[];
  drags: string[];
};

const POSITIVE_WEIGHTS: Record<string, number> = {
  revenueImpact: 0.24,
  strategicFit: 0.20,
  customerValue: 0.16,
  automation: 0.10,
  scalability: 0.12,
};
const NEGATIVE_WEIGHTS: Record<string, number> = {
  cost: 0.20,
  timeToValue: 0.14,
  complexity: 0.16,
  risk: 0.22,
};

const FACTOR_LABELS: Record<string, string> = {
  revenueImpact: "revenue impact",
  strategicFit: "strategic alignment",
  customerValue: "customer value",
  automation: "automation potential",
  scalability: "scalability",
  cost: "cost",
  timeToValue: "time to value",
  complexity: "complexity",
  risk: "risk",
};

/**
 * Weighted opportunity score out of 100. Positive factors pull the score up,
 * negative factors (cost, time, complexity, risk) pull it down.
 */
export function scoreDecision(factors: DecisionFactors): DecisionResult {
  const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));

  let positive = 0;
  let positiveWeight = 0;
  const drivers: string[] = [];
  for (const [key, weight] of Object.entries(POSITIVE_WEIGHTS)) {
    const value = clamp(factors[key as keyof DecisionFactors]);
    positive += ((value - 1) / 4) * weight;
    positiveWeight += weight;
    if (value >= 4) drivers.push(`strong ${FACTOR_LABELS[key]}`);
  }

  let negative = 0;
  let negativeWeight = 0;
  const drags: string[] = [];
  for (const [key, weight] of Object.entries(NEGATIVE_WEIGHTS)) {
    const value = clamp(factors[key as keyof DecisionFactors]);
    negative += ((value - 1) / 4) * weight;
    negativeWeight += weight;
    if (value >= 4) drags.push(`high ${FACTOR_LABELS[key]}`);
  }

  const normalisedPositive = positive / positiveWeight; // 0..1
  const normalisedNegative = negative / negativeWeight; // 0..1
  const raw = normalisedPositive * 0.68 + (1 - normalisedNegative) * 0.32;
  const score = Math.max(0, Math.min(100, Math.round(raw * 100)));

  const verdict =
    score >= 75 ? "PURSUE" : score >= 55 ? "CONSIDER" : score >= 35 ? "DEFER" : "DECLINE";

  if (drivers.length === 0) drivers.push("no standout upside");
  if (drags.length === 0) drags.push("no major blockers");

  return { score, verdict, drivers, drags };
}

// ---------------------------------------------------------------------------
// Automation opportunity engine
// ---------------------------------------------------------------------------

export type AutomationInputs = {
  frequencyPerMonth: number;
  minutesPerRun: number;
  minutesAfter: number;
  complexity: number; // 1 (trivial) - 5 (hard)
  businessValue: number; // 1 (low) - 5 (high)
};

export type AutomationResult = {
  score: number; // 0-100
  rating: "LOW" | "MEDIUM" | "HIGH";
  monthlyMinutesNow: number;
  monthlyMinutesAfter: number;
  monthlyMinutesSaved: number;
  monthlyHoursSaved: number;
  annualHoursSaved: number;
  payoffNote: string;
};

/**
 * Automation priority combines *how much time it gives back* with *how hard it
 * is to build* and *how valuable the process is to the business*.
 */
export function scoreAutomation(input: AutomationInputs): AutomationResult {
  const frequency = Math.max(0, input.frequencyPerMonth);
  const before = Math.max(0, input.minutesPerRun);
  const after = Math.max(0, Math.min(input.minutesAfter, before));
  const complexity = Math.max(1, Math.min(5, input.complexity));
  const value = Math.max(1, Math.min(5, input.businessValue));

  const monthlyMinutesNow = frequency * before;
  const monthlyMinutesAfter = frequency * after;
  const monthlyMinutesSaved = monthlyMinutesNow - monthlyMinutesAfter;
  const monthlyHoursSaved = monthlyMinutesSaved / 60;

  // 20 saved hours per month saturates the time component.
  const timeComponent = Math.min(1, monthlyHoursSaved / 20);
  const valueComponent = (value - 1) / 4;
  const easeComponent = (5 - complexity) / 4;

  const score = Math.round(
    (timeComponent * 0.5 + valueComponent * 0.3 + easeComponent * 0.2) * 100
  );
  const rating = score >= 66 ? "HIGH" : score >= 36 ? "MEDIUM" : "LOW";

  const payoffNote =
    monthlyMinutesSaved <= 0
      ? "No measurable time saving — automate only if it removes errors."
      : `Frees ${monthlyHoursSaved.toFixed(1)}h/month (${(monthlyHoursSaved * 12).toFixed(0)}h/year).`;

  return {
    score: Math.max(0, Math.min(100, score)),
    rating,
    monthlyMinutesNow,
    monthlyMinutesAfter,
    monthlyMinutesSaved,
    monthlyHoursSaved: Number(monthlyHoursSaved.toFixed(2)),
    annualHoursSaved: Number((monthlyHoursSaved * 12).toFixed(2)),
    payoffNote,
  };
}

// ---------------------------------------------------------------------------
// Pipeline
// ---------------------------------------------------------------------------

export type PipelineEntry = { value: number; probability: number; stage: string; status?: string };

/** Weighted pipeline value: sum(value * probability) over open opportunities. */
export function weightedPipeline(entries: PipelineEntry[]): number {
  return Math.round(
    entries
      .filter((e) => e.status !== "LOST" && e.stage !== "LOST")
      .reduce((total, e) => total + e.value * (Math.max(0, Math.min(100, e.probability)) / 100), 0)
  );
}

/** Goal progress as a percentage, clamped to 0-100. */
export function goalProgress(current: number, target: number | null): number {
  if (!target || target <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((current / target) * 100)));
}

/**
 * A goal is at risk when the time elapsed materially outpaces progress.
 * Returns null when there is not enough information to judge.
 */
export function goalRisk(
  progressPct: number,
  startDate: Date | null,
  deadline: Date | null,
  now = new Date()
): { atRisk: boolean; expectedPct: number } | null {
  if (!deadline) return null;
  const start = startDate ?? new Date(deadline.getTime() - 90 * 86_400_000);
  const total = deadline.getTime() - start.getTime();
  if (total <= 0) return null;
  const elapsed = Math.max(0, Math.min(total, now.getTime() - start.getTime()));
  const expectedPct = Math.round((elapsed / total) * 100);
  return { atRisk: progressPct + 15 < expectedPct, expectedPct };
}
