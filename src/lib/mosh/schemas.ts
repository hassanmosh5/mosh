import { z } from "zod";
import { ALL_ATTRIBUTE_SLUGS, HABIT_KEYS } from "./constants";

/**
 * Request validation for every MOSH endpoint.
 *
 * The client validates with React Hook Form for the sake of the person typing;
 * the server validates here because that is the only validation that counts.
 */

const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value === "" ? null : (value ?? null)));

const requiredText = (max: number) => z.string().trim().min(1).max(max);

/** YYYY-MM-DD only — the anchor format used by every period in the system. */
export const isoDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the YYYY-MM-DD format.");

export const percent = z.coerce.number().int().min(0).max(100);
export const rating = z.coerce.number().int().min(1).max(10);
export const count = z.coerce.number().int().min(0).max(100_000_000);
export const money = z.coerce.number().min(0).max(1_000_000_000);

export const planeEnum = z.enum(["MENTAL", "SPIRITUAL", "PHYSICAL"]);
export const lifeAreaEnum = z.enum(["MENTAL", "SPIRITUAL", "PHYSICAL", "BUSINESS", "IMPACT"]);
export const offerTierEnum = z.enum(["ATTRACTION", "CORE", "PREMIUM"]);
export const patternEnum = z.enum([
  "LIMITING_BELIEF",
  "TRUST_ISSUE",
  "FEAR_OF_LOSS",
  "PERFECTIONISM",
  "INFERIORITY",
  "PROCRASTINATION",
  "LOW_DRIVE",
]);
export const letterKindEnum = z.enum(["FUTURE_WISDOM", "LEGACY_LESSON", "ADVICE_TO_YOUNGER_SELF"]);

// ---------------------------------------------------------------------------
// Daily
// ---------------------------------------------------------------------------

const habitShape = Object.fromEntries(
  HABIT_KEYS.map((key) => [key, z.boolean().optional()])
) as Record<(typeof HABIT_KEYS)[number], z.ZodOptional<z.ZodBoolean>>;

export const dailyEntrySchema = z.object({
  date: isoDate,
  ...habitShape,
  gratitude: text(4000),
  wins: text(4000),
  reflection: text(4000),
  energy: rating.nullable().optional(),
  mood: rating.nullable().optional(),
  /** Plane self-ratings for the day, keyed by attribute slug. */
  checkins: z
    .record(z.enum(ALL_ATTRIBUTE_SLUGS as [string, ...string[]]), rating.nullable())
    .optional(),
});

export type DailyEntryInput = z.infer<typeof dailyEntrySchema>;

export const dailyQuerySchema = z.object({
  date: isoDate.optional(),
  from: isoDate.optional(),
  to: isoDate.optional(),
});

// ---------------------------------------------------------------------------
// Weekly
// ---------------------------------------------------------------------------

export const weeklyGoalSchema = z.object({
  id: z.string().trim().max(40).optional(),
  area: lifeAreaEnum,
  goal: requiredText(500),
  progress: text(2000),
  completion: percent.default(0),
  position: z.coerce.number().int().min(0).max(50).default(0),
});

export const weeklyEntrySchema = z.object({
  weekStart: isoDate,
  intention: text(2000),
  review: text(4000),
  goals: z.array(weeklyGoalSchema).max(25).default([]),
});

export type WeeklyEntryInput = z.infer<typeof weeklyEntrySchema>;

export const weeklyQuerySchema = z.object({
  weekStart: isoDate.optional(),
  weeks: z.coerce.number().int().min(1).max(104).optional(),
});

// ---------------------------------------------------------------------------
// Monthly
// ---------------------------------------------------------------------------

export const monthlyPillarSchema = z.object({
  area: lifeAreaEnum,
  goals: text(2000),
  achievements: text(2000),
  lessons: text(2000),
  score: percent.default(0),
});

export const monthlyReviewSchema = z.object({
  month: isoDate,
  energyGivers: text(2000),
  energyDrainers: text(2000),
  proudOf: text(2000),
  fearsOvercome: text(2000),
  service: text(2000),
  structuralImprovement: text(2000),
  pillars: z.array(monthlyPillarSchema).max(5).default([]),
});

export type MonthlyReviewInput = z.infer<typeof monthlyReviewSchema>;

export const monthlyQuerySchema = z.object({
  month: isoDate.optional(),
  months: z.coerce.number().int().min(1).max(36).optional(),
});

// ---------------------------------------------------------------------------
// 365-day master plan
// ---------------------------------------------------------------------------

export const yearPlanSchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  theme: text(200),
  vision: text(4000),
  northStar: text(2000),
});

export const quarterUpdateSchema = z.object({
  id: z.string().trim().min(1).max(40),
  title: requiredText(120).optional(),
  goal: requiredText(1000).optional(),
  focus: z.array(requiredText(60)).max(8).optional(),
  progress: percent.optional(),
  revenueTarget: money.nullable().optional(),
  clientTarget: count.nullable().optional(),
});

export const milestoneCreateSchema = z.object({
  quarterId: z.string().trim().min(1).max(40),
  monthOffset: z.coerce.number().int().min(1).max(3),
  title: requiredText(200),
  detail: text(2000),
  dueDate: isoDate.nullable().optional(),
});

export const milestoneUpdateSchema = z.object({
  id: z.string().trim().min(1).max(40),
  title: requiredText(200).optional(),
  detail: text(2000),
  done: z.boolean().optional(),
  dueDate: isoDate.nullable().optional(),
});

// ---------------------------------------------------------------------------
// Business
// ---------------------------------------------------------------------------

export const offerSchema = z.object({
  id: z.string().trim().max(40).optional(),
  tier: offerTierEnum,
  name: requiredText(160),
  promise: text(1000),
  price: money.default(0),
  currency: z.string().trim().length(3).default("GHS"),
  active: z.boolean().default(true),
});

export const offerMetricSchema = z.object({
  offerId: z.string().trim().min(1).max(40),
  month: isoDate,
  revenue: money.default(0),
  leads: count.default(0),
  conversions: count.default(0),
  subscribers: count.default(0),
  downloads: count.default(0),
  students: count.default(0),
  satisfaction: percent.nullable().optional(),
  completionRate: percent.nullable().optional(),
  clients: count.default(0),
  retention: percent.nullable().optional(),
  transformation: percent.nullable().optional(),
});

export const businessQuerySchema = z.object({
  months: z.coerce.number().int().min(1).max(36).optional(),
});

// ---------------------------------------------------------------------------
// Funnel
// ---------------------------------------------------------------------------

export const funnelSnapshotSchema = z.object({
  date: isoDate,
  visitors: count.default(0),
  leads: count.default(0),
  subscribers: count.default(0),
  customers: count.default(0),
  students: count.default(0),
  mentorship: count.default(0),
  advocates: count.default(0),
});

// ---------------------------------------------------------------------------
// Eclipse
// ---------------------------------------------------------------------------

export const eclipseUpdateSchema = z.object({
  day: z.coerce.number().int().min(1).max(50),
  done: z.boolean().optional(),
  note: text(2000),
});

export const eclipseStartSchema = z.object({
  startDate: isoDate,
  /** Wipe progress and rebuild the 50 days from the template. */
  reset: z.boolean().default(false),
});

// ---------------------------------------------------------------------------
// Coach
// ---------------------------------------------------------------------------

export const coachRequestSchema = z.object({
  pattern: patternEnum,
  situation: requiredText(4000),
});

export type CoachRequestInput = z.infer<typeof coachRequestSchema>;

// ---------------------------------------------------------------------------
// Legacy letters
// ---------------------------------------------------------------------------

export const letterSchema = z.object({
  id: z.string().trim().max(40).optional(),
  kind: letterKindEnum.default("FUTURE_WISDOM"),
  title: requiredText(200),
  body: requiredText(20_000),
  pinned: z.boolean().default(false),
});

// ---------------------------------------------------------------------------
// Profile & exports
// ---------------------------------------------------------------------------

export const profileSchema = z.object({
  displayName: text(120),
  title: text(160),
  philosophy: text(200),
  mission: text(2000),
  currency: z.string().trim().length(3).optional(),
  timezone: z.string().trim().max(60).optional(),
  planYear: z.coerce.number().int().min(2000).max(2100).nullable().optional(),
});

export const exportQuerySchema = z.object({
  dataset: z.enum(["daily", "weekly", "monthly", "business", "funnel", "eclipse", "annual"]),
  format: z.enum(["csv", "pdf"]).default("csv"),
  from: isoDate.optional(),
  to: isoDate.optional(),
});

export const analyticsQuerySchema = z.object({
  days: z.coerce.number().int().min(7).max(730).default(90),
});
