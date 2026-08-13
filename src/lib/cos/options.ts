import { titleCase } from "./format";

/** Turn an enum-like list into `<select>` options with readable labels. */
export function options(values: readonly string[]) {
  return values.map((value) => ({ value, label: titleCase(value) }));
}

export const TASK_STATUS = ["BACKLOG", "PLANNED", "IN_PROGRESS", "BLOCKED", "REVIEW", "COMPLETED", "CANCELLED"] as const;
export const TASK_PRIORITY = ["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;
export const RECURRENCE = ["NONE", "DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY", "QUARTERLY"] as const;
export const PROJECT_STATUS = ["PLANNING", "ACTIVE", "ON_HOLD", "REVIEW", "COMPLETED", "CANCELLED"] as const;
export const PIPELINE_STAGE = ["NEW_LEAD", "QUALIFIED", "CONTACTED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"] as const;
export const CLIENT_STATUS = ["PROSPECT", "ACTIVE", "PAUSED", "CHURNED"] as const;
export const GOAL_HORIZON = ["ANNUAL", "QUARTERLY", "MONTHLY", "WEEKLY", "DAILY"] as const;
export const GOAL_STATUS = ["DRAFT", "ACTIVE", "AT_RISK", "ACHIEVED", "MISSED", "ARCHIVED"] as const;
export const PRODUCT_STAGE = ["IDEA", "RESEARCH", "VALIDATION", "PRODUCTION", "LAUNCH", "OPTIMIZATION", "SCALE", "RETIRED"] as const;
export const CONTENT_PLATFORM = ["YOUTUBE", "FACEBOOK", "INSTAGRAM", "TIKTOK", "LINKEDIN", "BLOG", "EMAIL", "X", "OTHER"] as const;
export const CONTENT_STATUS = ["IDEA", "RESEARCH", "SCRIPT", "PRODUCTION", "REVIEW", "SCHEDULED", "PUBLISHED", "REPURPOSE"] as const;
export const KNOWLEDGE_CATEGORY = ["COMPANY", "SERVICE", "PRICING", "SOP", "CLIENT", "PRODUCT", "BRAND", "MARKETING", "FAQ", "POLICY", "AI_INSTRUCTION", "PROMPT", "PROJECT", "OTHER"] as const;
export const MEMORY_SCOPE = ["COMPANY", "STRATEGIC", "OPERATIONAL", "CLIENT", "PROJECT", "CONVERSATIONAL"] as const;
export const AUTOMATION_STATUS = ["IDENTIFIED", "EVALUATING", "APPROVED", "BUILDING", "LIVE", "REJECTED"] as const;
export const FINANCE_KIND = ["REVENUE", "EXPENSE"] as const;
export const RISK_SEVERITY = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

/** Tone mapping used consistently across every status badge in the product. */
export function statusTone(value: string): "neutral" | "good" | "warn" | "bad" | "info" | "brand" {
  switch (value) {
    case "CRITICAL":
    case "BLOCKED":
    case "LOST":
    case "CHURNED":
    case "MISSED":
    case "RED":
    case "REJECTED":
    case "OVERDUE":
      return "bad";
    case "HIGH":
    case "AT_RISK":
    case "ON_HOLD":
    case "YELLOW":
    case "REVIEW":
    case "NEGOTIATION":
    case "PARTIAL":
      return "warn";
    case "COMPLETED":
    case "ACHIEVED":
    case "WON":
    case "ACTIVE":
    case "GREEN":
    case "PUBLISHED":
    case "LIVE":
    case "PAID":
    case "CONNECTED":
      return "good";
    case "IN_PROGRESS":
    case "PRODUCTION":
    case "PROPOSAL":
    case "SCHEDULED":
    case "BUILDING":
      return "info";
    case "SCALE":
    case "LAUNCH":
    case "QUALIFIED":
      return "brand";
    default:
      return "neutral";
  }
}
