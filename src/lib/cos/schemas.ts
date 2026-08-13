import { z } from "zod";

/**
 * Every request body is parsed through one of these schemas before it reaches
 * the database. Client-side validation is a UX convenience only — the server
 * never trusts it.
 */

const trimmed = (max: number) => z.string().trim().min(1).max(max);
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v === "" ? undefined : v));

/** Accepts "", null, or an ISO/parsable date string. */
export const dateInput = z
  .union([z.string(), z.date(), z.null()])
  .optional()
  .transform((value, ctx) => {
    if (value === null || value === undefined || value === "") return null;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      ctx.addIssue({ code: "custom", message: "Not a valid date." });
      return null;
    }
    return date;
  });

export const moneyInput = z
  .union([z.number(), z.string(), z.null()])
  .optional()
  .transform((value, ctx) => {
    if (value === null || value === undefined || value === "") return null;
    const n = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(n)) {
      ctx.addIssue({ code: "custom", message: "Not a valid amount." });
      return null;
    }
    if (n < 0) {
      ctx.addIssue({ code: "custom", message: "Amount cannot be negative." });
      return null;
    }
    return Math.round(n * 100) / 100;
  });

export const idInput = z.string().trim().min(1).max(40);
export const optionalId = z
  .string()
  .trim()
  .max(40)
  .optional()
  .transform((v) => (v === "" ? undefined : v));

export const taskStatusEnum = z.enum([
  "BACKLOG", "PLANNED", "IN_PROGRESS", "BLOCKED", "REVIEW", "COMPLETED", "CANCELLED",
]);
export const taskPriorityEnum = z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]);
export const recurrenceEnum = z.enum(["NONE", "DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY", "QUARTERLY"]);
export const projectStatusEnum = z.enum([
  "PLANNING", "ACTIVE", "ON_HOLD", "REVIEW", "COMPLETED", "CANCELLED",
]);
export const pipelineStageEnum = z.enum([
  "NEW_LEAD", "QUALIFIED", "CONTACTED", "PROPOSAL", "NEGOTIATION", "WON", "LOST",
]);
export const clientStatusEnum = z.enum(["PROSPECT", "ACTIVE", "PAUSED", "CHURNED"]);
export const goalHorizonEnum = z.enum(["ANNUAL", "QUARTERLY", "MONTHLY", "WEEKLY", "DAILY"]);
export const goalStatusEnum = z.enum([
  "DRAFT", "ACTIVE", "AT_RISK", "ACHIEVED", "MISSED", "ARCHIVED",
]);
export const productStageEnum = z.enum([
  "IDEA", "RESEARCH", "VALIDATION", "PRODUCTION", "LAUNCH", "OPTIMIZATION", "SCALE", "RETIRED",
]);
export const contentPlatformEnum = z.enum([
  "YOUTUBE", "FACEBOOK", "INSTAGRAM", "TIKTOK", "LINKEDIN", "BLOG", "EMAIL", "X", "OTHER",
]);
export const contentStatusEnum = z.enum([
  "IDEA", "RESEARCH", "SCRIPT", "PRODUCTION", "REVIEW", "SCHEDULED", "PUBLISHED", "REPURPOSE",
]);
export const knowledgeCategoryEnum = z.enum([
  "COMPANY", "SERVICE", "PRICING", "SOP", "CLIENT", "PRODUCT", "BRAND", "MARKETING",
  "FAQ", "POLICY", "AI_INSTRUCTION", "PROMPT", "PROJECT", "OTHER",
]);
export const memoryScopeEnum = z.enum([
  "COMPANY", "STRATEGIC", "OPERATIONAL", "CLIENT", "PROJECT", "CONVERSATIONAL",
]);
export const financeKindEnum = z.enum(["REVENUE", "EXPENSE"]);
export const financeOriginEnum = z.enum(["REPORTED", "CALCULATED", "AI_ESTIMATE"]);
export const automationStatusEnum = z.enum([
  "IDENTIFIED", "EVALUATING", "APPROVED", "BUILDING", "LIVE", "REJECTED",
]);
export const reportKindEnum = z.enum([
  "DAILY_BRIEFING", "WEEKLY_EXECUTIVE", "MONTHLY_BUSINESS", "QUARTERLY_STRATEGY",
]);
export const cosRoleEnum = z.enum(["OWNER", "MANAGER", "MEMBER", "CLIENT", "VIEWER"]);

// ---------- Tasks ----------

export const taskCreateSchema = z.object({
  title: trimmed(200),
  description: optionalText(5000),
  status: taskStatusEnum.default("BACKLOG"),
  priority: taskPriorityEnum.default("MEDIUM"),
  dueDate: dateInput,
  estimateMins: z.number().int().min(0).max(100_000).nullish(),
  actualMins: z.number().int().min(0).max(100_000).nullish(),
  projectId: optionalId,
  clientId: optionalId,
  goalId: optionalId,
  assigneeId: optionalId,
  agentId: optionalId,
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  recurrence: recurrenceEnum.default("NONE"),
  recurrenceUntil: dateInput,
  notes: optionalText(5000),
  dependsOnIds: z.array(idInput).max(20).default([]),
});

export const taskUpdateSchema = taskCreateSchema.partial();

export const taskQuerySchema = z.object({
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  projectId: optionalId,
  clientId: optionalId,
  assigneeId: optionalId,
  search: optionalText(120),
  overdue: z.coerce.boolean().optional(),
  dueBefore: dateInput,
  take: z.coerce.number().int().min(1).max(200).default(50),
  skip: z.coerce.number().int().min(0).default(0),
});

// ---------- Projects ----------

export const projectCreateSchema = z.object({
  name: trimmed(160),
  description: optionalText(8000),
  clientId: optionalId,
  areaId: optionalId,
  status: projectStatusEnum.default("PLANNING"),
  startDate: dateInput,
  deadline: dateInput,
  budget: moneyInput,
  revenue: moneyInput,
  spend: moneyInput,
  notes: optionalText(8000),
});

export const projectUpdateSchema = projectCreateSchema.partial();

export const milestoneSchema = z.object({
  title: trimmed(160),
  description: optionalText(2000),
  dueDate: dateInput,
  completedAt: dateInput,
  order: z.number().int().min(0).max(999).default(0),
});

export const riskSchema = z.object({
  title: trimmed(160),
  detail: optionalText(2000),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  mitigation: optionalText(2000),
  resolvedAt: dateInput,
});

// ---------- CRM ----------

export const clientCreateSchema = z.object({
  name: trimmed(160),
  company: optionalText(160),
  email: z.string().trim().email().max(200).optional().or(z.literal("").transform(() => undefined)),
  phone: optionalText(40),
  website: optionalText(200),
  country: optionalText(80),
  status: clientStatusEnum.default("ACTIVE"),
  healthNote: optionalText(2000),
  since: dateInput,
});
export const clientUpdateSchema = clientCreateSchema.partial();

export const contactCreateSchema = z.object({
  name: trimmed(160),
  clientId: optionalId,
  role: optionalText(120),
  email: z.string().trim().email().max(200).optional().or(z.literal("").transform(() => undefined)),
  phone: optionalText(40),
  notes: optionalText(2000),
  isPrimary: z.boolean().default(false),
});
export const contactUpdateSchema = contactCreateSchema.partial();

export const leadCreateSchema = z.object({
  name: trimmed(160),
  company: optionalText(160),
  email: z.string().trim().email().max(200).optional().or(z.literal("").transform(() => undefined)),
  phone: optionalText(40),
  source: optionalText(120),
  serviceInterest: optionalText(160),
  areaId: optionalId,
  estimatedValue: moneyInput,
  stage: pipelineStageEnum.default("NEW_LEAD"),
  probability: z.coerce.number().int().min(0).max(100).default(10),
  nextAction: optionalText(1000),
  followUpAt: dateInput,
  lastContactedAt: dateInput,
  notes: optionalText(4000),
});
export const leadUpdateSchema = leadCreateSchema.partial();

export const opportunityCreateSchema = z.object({
  title: trimmed(160),
  leadId: optionalId,
  clientId: optionalId,
  value: moneyInput,
  stage: pipelineStageEnum.default("QUALIFIED"),
  status: z.enum(["OPEN", "WON", "LOST"]).default("OPEN"),
  probability: z.coerce.number().int().min(0).max(100).default(30),
  expectedCloseAt: dateInput,
  lostReason: optionalText(1000),
  notes: optionalText(4000),
});
export const opportunityUpdateSchema = opportunityCreateSchema.partial();

// ---------- Goals ----------

export const goalCreateSchema = z.object({
  title: trimmed(200),
  description: optionalText(4000),
  horizon: goalHorizonEnum.default("QUARTERLY"),
  parentId: optionalId,
  ownerId: optionalId,
  kpi: optionalText(160),
  targetValue: moneyInput,
  currentValue: moneyInput,
  unit: optionalText(40),
  startDate: dateInput,
  deadline: dateInput,
  status: goalStatusEnum.default("ACTIVE"),
});
export const goalUpdateSchema = goalCreateSchema.partial();

// ---------- Products & content ----------

export const productCreateSchema = z.object({
  name: trimmed(160),
  category: optionalText(120),
  areaId: optionalId,
  description: optionalText(4000),
  price: moneyInput,
  platform: optionalText(120),
  landingPage: optionalText(300),
  stage: productStageEnum.default("IDEA"),
  unitsSold: z.coerce.number().int().min(0).max(10_000_000).default(0),
  revenue: moneyInput,
  feedback: optionalText(4000),
});
export const productUpdateSchema = productCreateSchema.partial();

export const contentCreateSchema = z.object({
  title: trimmed(200),
  platform: contentPlatformEnum.default("YOUTUBE"),
  format: optionalText(80),
  topic: optionalText(200),
  status: contentStatusEnum.default("IDEA"),
  publishAt: dateInput,
  script: optionalText(20000),
  caption: optionalText(4000),
  callToAction: optionalText(300),
  assetUrl: optionalText(400),
  productId: optionalId,
  campaignId: optionalId,
  views: z.coerce.number().int().min(0).default(0),
  engagements: z.coerce.number().int().min(0).default(0),
  conversions: z.coerce.number().int().min(0).default(0),
});
export const contentUpdateSchema = contentCreateSchema.partial();

// ---------- Knowledge & memory ----------

export const knowledgeCreateSchema = z.object({
  title: trimmed(200),
  category: knowledgeCategoryEnum.default("OTHER"),
  summary: optionalText(2000),
  body: z.string().trim().min(1).max(200_000),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  source: optionalText(200),
  projectId: optionalId,
  reviewAt: dateInput,
});
export const knowledgeUpdateSchema = knowledgeCreateSchema.partial();

export const memoryCreateSchema = z.object({
  scope: memoryScopeEnum,
  key: trimmed(120),
  value: z.string().trim().min(1).max(8000),
  source: z.enum(["HUMAN", "AI", "IMPORT", "SYSTEM"]).default("HUMAN"),
  confidence: z.coerce.number().int().min(0).max(100).default(70),
  clientId: optionalId,
  projectId: optionalId,
  reviewAt: dateInput,
  expiresAt: dateInput,
  pinned: z.boolean().default(false),
});
export const memoryUpdateSchema = memoryCreateSchema.partial();

// ---------- Finance ----------

export const financeEntrySchema = z.object({
  kind: financeKindEnum,
  origin: financeOriginEnum.default("REPORTED"),
  category: optionalText(120),
  description: optionalText(400),
  amount: z.coerce.number().min(0).max(1_000_000_000),
  occurredAt: dateInput,
  clientId: optionalId,
  projectId: optionalId,
});

export const invoiceSchema = z.object({
  number: trimmed(40),
  clientId: optionalId,
  amount: z.coerce.number().min(0).max(1_000_000_000),
  status: z.enum(["DRAFT", "SENT", "PARTIAL", "PAID", "OVERDUE", "VOID"]).default("DRAFT"),
  issuedAt: dateInput,
  dueAt: dateInput,
  notes: optionalText(2000),
});

// ---------- Automations & decisions ----------

export const automationCreateSchema = z.object({
  name: trimmed(160),
  process: z.string().trim().min(1).max(4000),
  trigger: optionalText(1000),
  steps: z.array(z.string().trim().min(1).max(300)).max(30).default([]),
  frequencyPerMonth: z.coerce.number().int().min(1).max(100_000).default(1),
  minutesPerRun: z.coerce.number().int().min(1).max(10_000).default(30),
  minutesAfter: z.coerce.number().int().min(0).max(10_000).default(5),
  complexity: z.coerce.number().int().min(1).max(5).default(3),
  businessValue: z.coerce.number().int().min(1).max(5).default(3),
  status: automationStatusEnum.default("IDENTIFIED"),
  tooling: optionalText(200),
  notes: optionalText(4000),
});
export const automationUpdateSchema = automationCreateSchema.partial();

const score1to5 = z.coerce.number().int().min(1).max(5);

export const decisionSchema = z.object({
  title: trimmed(200),
  context: optionalText(4000),
  revenueImpact: score1to5.default(3),
  strategicFit: score1to5.default(3),
  customerValue: score1to5.default(3),
  cost: score1to5.default(3),
  timeToValue: score1to5.default(3),
  complexity: score1to5.default(3),
  risk: score1to5.default(3),
  automation: score1to5.default(3),
  scalability: score1to5.default(3),
  rationale: optionalText(4000),
  risks: optionalText(4000),
  recommendation: optionalText(4000),
  nextStep: optionalText(1000),
});

// ---------- AI ----------

export const chatRequestSchema = z.object({
  conversationId: optionalId,
  message: z.string().trim().min(1).max(8000),
});

export const agentRunSchema = z.object({
  agentKey: z.string().trim().min(1).max(60).optional(),
  objective: z.string().trim().min(1).max(4000),
  conversationId: optionalId,
});

export const agentUpsertSchema = z.object({
  key: z.string().trim().regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes.").max(60),
  name: trimmed(120),
  role: trimmed(160),
  description: z.string().trim().min(1).max(4000),
  systemPrompt: z.string().trim().min(1).max(40_000),
  capabilities: z.array(z.string().trim().min(1).max(80)).max(30).default([]),
  allowedTools: z.array(z.string().trim().min(1).max(80)).max(40).default([]),
  model: z.string().trim().max(60).default("claude-opus-5"),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
});

export const approvalDecisionSchema = z.object({
  decision: z.enum(["APPROVED", "REJECTED"]),
  note: optionalText(1000),
});

export const searchSchema = z.object({
  q: z.string().trim().min(2).max(120),
  take: z.coerce.number().int().min(1).max(50).default(8),
});

export const reportRequestSchema = z.object({
  kind: reportKindEnum,
  periodStart: dateInput,
  periodEnd: dateInput,
});

export const membershipUpdateSchema = z.object({
  role: cosRoleEnum,
  active: z.boolean().optional(),
});

export const businessSettingsSchema = z.object({
  name: trimmed(160),
  tagline: optionalText(300),
  currency: z.string().trim().length(3).toUpperCase(),
  timezone: z.string().trim().min(1).max(60),
});

export const businessAreaSchema = z.object({
  name: trimmed(120),
  description: optionalText(1000),
  active: z.boolean().default(true),
});

export const integrationUpdateSchema = z.object({
  status: z.enum(["NOT_CONNECTED", "CONNECTED", "ERROR", "DISABLED"]).optional(),
  config: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
});

export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type LeadCreateInput = z.infer<typeof leadCreateSchema>;
export type GoalCreateInput = z.infer<typeof goalCreateSchema>;
export type DecisionInput = z.infer<typeof decisionSchema>;
export type AutomationInput = z.infer<typeof automationCreateSchema>;
