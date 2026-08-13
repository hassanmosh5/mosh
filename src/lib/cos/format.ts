import type { Decimal } from "@/generated/prisma/internal/prismaNamespace";

/** Prisma Decimal | number | string | null -> number. */
export function toNumber(value: Decimal | number | string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  const n = Number(value.toString());
  return Number.isFinite(n) ? n : 0;
}

export function formatMoney(value: number, currency = "GHS"): string {
  try {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency,
      maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString()}`;
  }
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-GH").format(value);
}

export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const DAY_MS = 86_400_000;

export function startOfDay(date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date = new Date()): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

export function daysBetween(from: Date, to: Date): number {
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY_MS);
}

/** "in 3 days" / "4 days overdue" / "today" */
export function relativeDays(target: Date | null | undefined, now = new Date()): string {
  if (!target) return "no date";
  const diff = daysBetween(now, target);
  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  if (diff === -1) return "1 day overdue";
  if (diff < 0) return `${Math.abs(diff)} days overdue`;
  return `in ${diff} days`;
}

export function titleCase(value: string): string {
  return value
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "item";
}

export function percent(part: number, total: number): number {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}
