import { prisma } from "@/lib/prisma";
import { toNumber } from "@/lib/cos/format";
import type { MoshContext } from "../context";
import {
  BRAND,
  ECLIPSE_PHASE_LABELS,
  LIFE_AREA_LABELS,
  MONTHLY_QUESTIONS,
  MOSH_HABITS,
  TIER_LABELS,
} from "../constants";
import { addDays, formatLongDate, formatMonth, fromIsoDate, toIsoDate, today } from "../dates";
import { renderPdf, type PdfBlock } from "../pdf";
import type { exportQuerySchema } from "../schemas";
import type { z } from "zod";
import { getAnalytics } from "./analytics";
import { getYearPlan } from "./plan";

/**
 * CSV and PDF exports.
 *
 * The CSV is the machine copy — one row per record, no derived prose. The PDF
 * is the human copy: a report you can print, hand to a mentor, or keep. Both
 * are generated on demand from the same records; nothing is cached, so an
 * export can never be stale.
 */

export type ExportQuery = z.infer<typeof exportQuerySchema>;

export type ExportResult = {
  filename: string;
  contentType: string;
  body: string | Uint8Array;
};

/** RFC 4180 quoting — commas, quotes and newlines all survive a round trip. */
function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(columns: string[], rows: unknown[][]): string {
  return [columns, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

type Dataset = {
  columns: string[];
  rows: unknown[][];
  title: string;
  blocks: PdfBlock[];
};

function resolveRange(query: ExportQuery): { from: Date; to: Date } {
  const to = query.to ? fromIsoDate(query.to) : today();
  const from = query.from ? fromIsoDate(query.from) : addDays(to, -364);
  return { from, to };
}

async function dailyDataset(ctx: MoshContext, query: ExportQuery): Promise<Dataset> {
  const range = resolveRange(query);
  const [entries, checkins] = await Promise.all([
    prisma.moshDailyEntry.findMany({
      where: { userId: ctx.userId, date: { gte: range.from, lte: range.to } },
      orderBy: { date: "asc" },
    }),
    prisma.moshPlaneCheckin.findMany({
      where: { userId: ctx.userId, date: { gte: range.from, lte: range.to } },
      orderBy: { date: "asc" },
    }),
  ]);

  const checkinsByDate = new Map<string, { attribute: string; score: number }[]>();
  for (const checkin of checkins) {
    const key = toIsoDate(checkin.date);
    const list = checkinsByDate.get(key) ?? [];
    list.push({ attribute: checkin.attribute, score: checkin.score });
    checkinsByDate.set(key, list);
  }

  const columns = [
    "date",
    ...MOSH_HABITS.map((habit) => habit.key),
    "completion",
    "alignment",
    "energy",
    "mood",
    "gratitude",
    "wins",
    "reflection",
    "plane_checkins",
  ];

  const rows = entries.map((entry) => [
    toIsoDate(entry.date),
    ...MOSH_HABITS.map((habit) =>
      (entry as unknown as Record<string, boolean>)[habit.key] ? "yes" : "no"
    ),
    entry.completion,
    entry.alignment,
    entry.energy ?? "",
    entry.mood ?? "",
    entry.gratitude ?? "",
    entry.wins ?? "",
    entry.reflection ?? "",
    (checkinsByDate.get(toIsoDate(entry.date)) ?? [])
      .map((checkin) => `${checkin.attribute}=${checkin.score}`)
      .join(" "),
  ]);

  const blocks: PdfBlock[] = [
    { type: "heading", text: "Daily tracker" },
    {
      type: "text",
      text: `${entries.length} day(s) recorded between ${formatLongDate(range.from)} and ${formatLongDate(range.to)}.`,
    },
    {
      type: "table",
      columns: ["Date", "Rhythm %", "Alignment", "Energy", "Mood"],
      rows: entries.map((entry) => [
        toIsoDate(entry.date),
        String(entry.completion),
        String(entry.alignment),
        entry.energy === null ? "-" : String(entry.energy),
        entry.mood === null ? "-" : String(entry.mood),
      ]),
    },
  ];

  for (const entry of entries) {
    if (!entry.gratitude && !entry.wins && !entry.reflection) continue;
    blocks.push({ type: "subheading", text: formatLongDate(entry.date) });
    if (entry.gratitude) blocks.push({ type: "row", label: "Gratitude", value: entry.gratitude });
    if (entry.wins) blocks.push({ type: "row", label: "Wins", value: entry.wins });
    if (entry.reflection) blocks.push({ type: "row", label: "Reflection", value: entry.reflection });
  }

  return { columns, rows, title: "Daily tracker", blocks };
}

async function weeklyDataset(ctx: MoshContext, query: ExportQuery): Promise<Dataset> {
  const range = resolveRange(query);
  const weeks = await prisma.moshWeeklyEntry.findMany({
    where: { userId: ctx.userId, weekStart: { gte: range.from, lte: range.to } },
    orderBy: { weekStart: "asc" },
    include: { goals: { orderBy: [{ area: "asc" }, { position: "asc" }] } },
  });

  const columns = ["week_start", "momentum", "area", "goal", "progress", "completion", "intention", "review"];
  const rows: unknown[][] = [];
  const blocks: PdfBlock[] = [{ type: "heading", text: "Weekly tracker" }];

  for (const week of weeks) {
    if (week.goals.length === 0) {
      rows.push([toIsoDate(week.weekStart), week.momentum, "", "", "", "", week.intention ?? "", week.review ?? ""]);
    }
    for (const goal of week.goals) {
      rows.push([
        toIsoDate(week.weekStart),
        week.momentum,
        LIFE_AREA_LABELS[goal.area],
        goal.goal,
        goal.progress ?? "",
        goal.completion,
        week.intention ?? "",
        week.review ?? "",
      ]);
    }

    blocks.push({
      type: "subheading",
      text: `Week of ${formatLongDate(week.weekStart)} — momentum ${week.momentum}%`,
    });
    if (week.intention) blocks.push({ type: "row", label: "Intention", value: week.intention });
    if (week.goals.length > 0) {
      blocks.push({
        type: "table",
        columns: ["Area", "Goal", "Done %"],
        rows: week.goals.map((goal) => [
          LIFE_AREA_LABELS[goal.area],
          goal.goal,
          String(goal.completion),
        ]),
      });
    }
    if (week.review) blocks.push({ type: "row", label: "Review", value: week.review });
  }

  return { columns, rows, title: "Weekly tracker", blocks };
}

async function monthlyDataset(ctx: MoshContext, query: ExportQuery): Promise<Dataset> {
  const range = resolveRange(query);
  const reviews = await prisma.moshMonthlyReview.findMany({
    where: { userId: ctx.userId, month: { gte: range.from, lte: range.to } },
    orderBy: { month: "asc" },
    include: { pillars: true },
  });

  const columns = [
    "month",
    "growth",
    "area",
    "goals",
    "achievements",
    "lessons",
    "score",
    ...MONTHLY_QUESTIONS.map((question) => question.key),
  ];

  const rows: unknown[][] = [];
  const blocks: PdfBlock[] = [{ type: "heading", text: "Monthly review" }];

  for (const review of reviews) {
    const answers = MONTHLY_QUESTIONS.map(
      (question) => (review as unknown as Record<string, string | null>)[question.key] ?? ""
    );

    if (review.pillars.length === 0) {
      rows.push([toIsoDate(review.month), review.growth, "", "", "", "", "", ...answers]);
    }
    for (const pillar of review.pillars) {
      rows.push([
        toIsoDate(review.month),
        review.growth,
        LIFE_AREA_LABELS[pillar.area],
        pillar.goals ?? "",
        pillar.achievements ?? "",
        pillar.lessons ?? "",
        pillar.score,
        ...answers,
      ]);
    }

    blocks.push({
      type: "subheading",
      text: `${formatMonth(review.month)} — growth ${review.growth}%`,
    });
    if (review.pillars.length > 0) {
      blocks.push({
        type: "table",
        columns: ["Pillar", "Achievements", "Score"],
        rows: review.pillars.map((pillar) => [
          LIFE_AREA_LABELS[pillar.area],
          pillar.achievements ?? "-",
          String(pillar.score),
        ]),
      });
    }
    for (const question of MONTHLY_QUESTIONS) {
      const answer = (review as unknown as Record<string, string | null>)[question.key];
      if (answer) blocks.push({ type: "row", label: question.question, value: answer });
    }
  }

  return { columns, rows, title: "Monthly review", blocks };
}

async function businessDataset(ctx: MoshContext, query: ExportQuery): Promise<Dataset> {
  const range = resolveRange(query);
  const metrics = await prisma.moshOfferMetric.findMany({
    where: { offer: { userId: ctx.userId }, month: { gte: range.from, lte: range.to } },
    orderBy: [{ month: "asc" }],
    include: { offer: true },
  });

  const columns = [
    "month", "tier", "offer", "price", "currency", "revenue", "leads", "conversions",
    "subscribers", "downloads", "students", "satisfaction", "completion_rate",
    "clients", "retention", "transformation",
  ];

  const rows = metrics.map((metric) => [
    toIsoDate(metric.month),
    TIER_LABELS[metric.offer.tier],
    metric.offer.name,
    toNumber(metric.offer.price),
    metric.offer.currency,
    toNumber(metric.revenue),
    metric.leads,
    metric.conversions,
    metric.subscribers,
    metric.downloads,
    metric.students,
    metric.satisfaction ?? "",
    metric.completionRate ?? "",
    metric.clients,
    metric.retention ?? "",
    metric.transformation ?? "",
  ]);

  const analytics = await getAnalytics(ctx, 365);
  const blocks: PdfBlock[] = [
    { type: "heading", text: "Business and wealth flow" },
    {
      type: "row",
      label: "Wealth Flow Index (current month)",
      value: `${Math.round(analytics.business.wealthIndex).toLocaleString()} ${analytics.business.currency}`,
    },
    {
      type: "table",
      columns: ["Tier", "Weight", "Revenue", "Weighted"],
      rows: analytics.business.tiers.map((tier) => [
        tier.label,
        `x${tier.weight}`,
        Math.round(tier.revenue).toLocaleString(),
        Math.round(tier.weightedRevenue).toLocaleString(),
      ]),
    },
    { type: "heading", text: "Reported months" },
    {
      type: "table",
      columns: ["Month", "Offer", "Revenue", "Leads", "Students", "Clients"],
      rows: metrics.map((metric) => [
        toIsoDate(metric.month),
        metric.offer.name,
        Math.round(toNumber(metric.revenue)).toLocaleString(),
        String(metric.leads),
        String(metric.students),
        String(metric.clients),
      ]),
    },
  ];

  return { columns, rows, title: "Business", blocks };
}

async function funnelDataset(ctx: MoshContext, query: ExportQuery): Promise<Dataset> {
  const range = resolveRange(query);
  const snapshots = await prisma.moshFunnelSnapshot.findMany({
    where: { userId: ctx.userId, date: { gte: range.from, lte: range.to } },
    orderBy: { date: "asc" },
  });

  const columns = ["date", "visitors", "leads", "subscribers", "customers", "students", "mentorship", "advocates"];
  const rows = snapshots.map((snapshot) => [
    toIsoDate(snapshot.date),
    snapshot.visitors,
    snapshot.leads,
    snapshot.subscribers,
    snapshot.customers,
    snapshot.students,
    snapshot.mentorship,
    snapshot.advocates,
  ]);

  return {
    columns,
    rows,
    title: "Customer funnel",
    blocks: [
      { type: "heading", text: "Customer funnel" },
      {
        type: "table",
        columns: ["Date", "Visitors", "Leads", "Subs", "Customers", "Students", "Mentors", "Advocates"],
        rows: rows.map((row) => row.map(String)),
      },
    ],
  };
}

async function eclipseDataset(ctx: MoshContext): Promise<Dataset> {
  const days = await prisma.moshEclipseDay.findMany({
    where: { userId: ctx.userId },
    orderBy: { day: "asc" },
  });

  const columns = ["day", "phase", "focus", "action", "done", "note", "completed_at"];
  const rows = days.map((day) => [
    day.day,
    ECLIPSE_PHASE_LABELS[day.phase],
    day.focus,
    day.action,
    day.done ? "yes" : "no",
    day.note ?? "",
    day.completedAt ? day.completedAt.toISOString() : "",
  ]);

  return {
    columns,
    rows,
    title: "50-Day Eclipse Growth Strategy",
    blocks: [
      { type: "heading", text: "50-Day Eclipse Growth Strategy" },
      {
        type: "table",
        columns: ["Day", "Phase", "Focus", "Done"],
        rows: days.map((day) => [
          String(day.day),
          ECLIPSE_PHASE_LABELS[day.phase],
          day.focus,
          day.done ? "yes" : "no",
        ]),
      },
    ],
  };
}

async function annualDataset(ctx: MoshContext): Promise<Dataset> {
  const plan = await getYearPlan(ctx);

  const columns = ["year", "quarter", "title", "focus", "goal", "progress", "milestone", "milestone_done", "due_date"];
  const rows: unknown[][] = [];

  for (const quarter of plan.quarters) {
    if (quarter.milestones.length === 0) {
      rows.push([plan.year, quarter.quarter, quarter.title, quarter.focus.join("; "), quarter.goal, quarter.progress, "", "", ""]);
    }
    for (const milestone of quarter.milestones) {
      rows.push([
        plan.year,
        quarter.quarter,
        quarter.title,
        quarter.focus.join("; "),
        quarter.goal,
        quarter.progress,
        milestone.title,
        milestone.done ? "yes" : "no",
        milestone.dueDate ?? "",
      ]);
    }
  }

  const blocks: PdfBlock[] = [
    { type: "heading", text: `${plan.year} master plan` },
    { type: "row", label: "Theme", value: plan.theme ?? "-" },
    { type: "row", label: "Vision", value: plan.vision ?? "-" },
    { type: "row", label: "Annual alignment", value: `${plan.annualAlignment}%` },
  ];

  for (const quarter of plan.quarters) {
    blocks.push({ type: "subheading", text: `Q${quarter.quarter} — ${quarter.title}` });
    blocks.push({ type: "row", label: "Focus", value: quarter.focus.join(", ") });
    blocks.push({ type: "row", label: "Goal", value: quarter.goal });
    blocks.push({
      type: "table",
      columns: ["Milestone", "Due", "Done"],
      rows: quarter.milestones.map((milestone) => [
        milestone.title,
        milestone.dueDate ?? "-",
        milestone.done ? "yes" : "no",
      ]),
    });
  }

  return { columns, rows, title: `${plan.year} master plan`, blocks };
}

async function buildDataset(ctx: MoshContext, query: ExportQuery): Promise<Dataset> {
  switch (query.dataset) {
    case "daily": return dailyDataset(ctx, query);
    case "weekly": return weeklyDataset(ctx, query);
    case "monthly": return monthlyDataset(ctx, query);
    case "business": return businessDataset(ctx, query);
    case "funnel": return funnelDataset(ctx, query);
    case "eclipse": return eclipseDataset(ctx);
    case "annual": return annualDataset(ctx);
  }
}

export async function buildExport(ctx: MoshContext, query: ExportQuery): Promise<ExportResult> {
  const dataset = await buildDataset(ctx, query);
  const stamp = toIsoDate(today());
  const base = `mosh-${query.dataset}-${stamp}`;

  if (query.format === "csv") {
    return {
      filename: `${base}.csv`,
      contentType: "text/csv; charset=utf-8",
      body: toCsv(dataset.columns, dataset.rows),
    };
  }

  const pdf = renderPdf({
    title: dataset.title,
    subtitle: `${BRAND.shortName} · ${ctx.displayName} · generated ${formatLongDate(today())}`,
    footer: `${BRAND.owner} — ${BRAND.philosophy}`,
    blocks: dataset.blocks,
  });

  return { filename: `${base}.pdf`, contentType: "application/pdf", body: pdf };
}

/** The full year report — every module in one PDF. */
export async function buildYearReport(ctx: MoshContext): Promise<ExportResult> {
  const analytics = await getAnalytics(ctx, 365);
  const plan = await getYearPlan(ctx);

  const blocks: PdfBlock[] = [
    { type: "heading", text: "Where you stand" },
    { type: "row", label: "Current streak", value: `${analytics.streak.current} day(s)` },
    { type: "row", label: "Longest streak", value: `${analytics.streak.longest} day(s)` },
    { type: "row", label: "Days recorded", value: String(analytics.daily.daysRecorded) },
    {
      type: "row",
      label: "Average daily alignment",
      value: analytics.daily.averageAlignment === null ? "-" : `${analytics.daily.averageAlignment}%`,
    },
    { type: "row", label: "Annual alignment", value: `${plan.annualAlignment}%` },
    {
      type: "row",
      label: "Wealth Flow Index",
      value: `${Math.round(analytics.business.wealthIndex).toLocaleString()} ${analytics.business.currency}`,
    },

    { type: "heading", text: "The daily rhythm" },
    {
      type: "table",
      columns: ["Habit", "Days done", "Days tracked", "Rate %"],
      rows: analytics.habits.map((habit) => [
        habit.label,
        String(habit.done),
        String(habit.total),
        String(habit.rate),
      ]),
    },

    { type: "heading", text: "The three planes" },
    ...analytics.planes.flatMap((plane): PdfBlock[] => [
      { type: "subheading", text: plane.label },
      {
        type: "table",
        columns: ["Attribute", "Average /10", "Check-ins"],
        rows: plane.attributes.map((attribute) => [
          attribute.label,
          attribute.average === null ? "-" : String(attribute.average),
          String(attribute.samples),
        ]),
      },
    ]),

    { type: "heading", text: "Momentum" },
    {
      type: "table",
      columns: ["Week starting", "Momentum %", "Goals"],
      rows: analytics.weekly.map((week) => [week.weekStart, String(week.momentum), String(week.goals)]),
    },
    {
      type: "table",
      columns: ["Month", "Growth %"],
      rows: analytics.monthly.map((month) => [month.month, String(month.growth)]),
    },

    { type: "heading", text: "Business" },
    {
      type: "table",
      columns: ["Tier", "Weight", "Revenue", "Weighted", "People"],
      rows: analytics.business.tiers.map((tier) => [
        tier.label,
        `x${tier.weight}`,
        Math.round(tier.revenue).toLocaleString(),
        Math.round(tier.weightedRevenue).toLocaleString(),
        String(tier.headcount),
      ]),
    },
    {
      type: "table",
      columns: ["Funnel stage", "Count", "From previous %"],
      rows: analytics.funnel.stages.map((stage) => [
        stage.label,
        String(stage.count),
        stage.conversionFromPrevious === null ? "-" : String(stage.conversionFromPrevious),
      ]),
    },

    { type: "heading", text: `${plan.year} master plan` },
    ...plan.quarters.flatMap((quarter): PdfBlock[] => [
      { type: "subheading", text: `Q${quarter.quarter} — ${quarter.title} (${quarter.effectiveProgress}%)` },
      { type: "row", label: "Goal", value: quarter.goal },
      {
        type: "table",
        columns: ["Milestone", "Done"],
        rows: quarter.milestones.map((milestone) => [milestone.title, milestone.done ? "yes" : "no"]),
      },
    ]),
  ];

  const pdf = renderPdf({
    title: `${plan.year} Alignment Report`,
    subtitle: `${BRAND.shortName} · ${ctx.displayName} · generated ${formatLongDate(today())}`,
    footer: `${BRAND.owner} — ${BRAND.philosophy}`,
    blocks,
  });

  return {
    filename: `mosh-year-report-${plan.year}.pdf`,
    contentType: "application/pdf",
    body: pdf,
  };
}
