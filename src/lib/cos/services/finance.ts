import { prisma } from "@/lib/prisma";
import type { CosContext } from "../tenancy";
import { assertOwned } from "../tenancy";
import { recordAudit } from "../audit";
import { addDays, startOfDay, toNumber } from "../format";
import type { financeEntrySchema, invoiceSchema } from "../schemas";
import type { z } from "zod";

/**
 * Financial figures carry an `origin` so the UI can always distinguish
 * REPORTED data from CALCULATED aggregates and AI_ESTIMATE values. M-CoS does
 * not give accounting or tax advice; it summarises what has been recorded.
 */

export async function listFinanceEntries(ctx: CosContext, options: { months?: number } = {}) {
  const since = addDays(startOfDay(new Date()), -30 * (options.months ?? 6));
  return prisma.financeEntry.findMany({
    where: { businessId: ctx.businessId, occurredAt: { gte: since } },
    orderBy: { occurredAt: "desc" },
    include: {
      client: { select: { id: true, name: true } },
      project: { select: { id: true, name: true } },
    },
    take: 400,
  });
}

export async function createFinanceEntry(ctx: CosContext, input: z.infer<typeof financeEntrySchema>) {
  if (input.clientId) {
    const client = await prisma.client.findUnique({ where: { id: input.clientId } });
    await assertOwned(client, ctx, "client");
  }
  if (input.projectId) {
    const project = await prisma.project.findUnique({ where: { id: input.projectId } });
    await assertOwned(project, ctx, "project");
  }
  const entry = await prisma.financeEntry.create({
    data: {
      businessId: ctx.businessId,
      kind: input.kind,
      origin: input.origin,
      category: input.category,
      description: input.description,
      amount: input.amount,
      currency: ctx.currency,
      occurredAt: input.occurredAt ?? new Date(),
      clientId: input.clientId,
      projectId: input.projectId,
    },
  });
  await recordAudit(ctx, {
    action: "finance.create",
    entityType: "finance_entry",
    entityId: entry.id,
    detail: { kind: entry.kind, amount: input.amount, origin: entry.origin },
  });
  return entry;
}

export async function deleteFinanceEntry(ctx: CosContext, id: string) {
  const existing = await prisma.financeEntry.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "entry");
  await prisma.financeEntry.delete({ where: { id } });
  await recordAudit(ctx, { action: "finance.delete", entityType: "finance_entry", entityId: id });
  return { ok: true };
}

export async function listInvoices(ctx: CosContext) {
  const invoices = await prisma.invoice.findMany({
    where: { businessId: ctx.businessId },
    orderBy: [{ status: "asc" }, { dueAt: "asc" }],
    include: { client: { select: { id: true, name: true } }, payments: true },
    take: 200,
  });
  return invoices.map((invoice) => ({
    ...invoice,
    amountValue: toNumber(invoice.amount),
    paidValue: toNumber(invoice.amountPaid),
    outstanding: toNumber(invoice.amount) - toNumber(invoice.amountPaid),
  }));
}

export async function createInvoice(ctx: CosContext, input: z.infer<typeof invoiceSchema>) {
  if (input.clientId) {
    const client = await prisma.client.findUnique({ where: { id: input.clientId } });
    await assertOwned(client, ctx, "client");
  }
  const invoice = await prisma.invoice.create({
    data: {
      businessId: ctx.businessId,
      number: input.number,
      clientId: input.clientId,
      amount: input.amount,
      currency: ctx.currency,
      status: input.status,
      issuedAt: input.issuedAt,
      dueAt: input.dueAt,
      notes: input.notes,
    },
  });
  await recordAudit(ctx, {
    action: "invoice.create",
    entityType: "invoice",
    entityId: invoice.id,
    detail: { number: invoice.number, amount: input.amount },
  });
  return invoice;
}

/**
 * Monthly revenue / expense / profit series plus derived business metrics.
 * Everything returned here is CALCULATED from REPORTED entries.
 */
export async function getFinancialSummary(ctx: CosContext, months = 6, now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

  const [entries, invoices, productRevenue, clientRevenue] = await Promise.all([
    prisma.financeEntry.findMany({
      where: { businessId: ctx.businessId, occurredAt: { gte: start } },
      select: { kind: true, amount: true, occurredAt: true, origin: true },
    }),
    prisma.invoice.findMany({
      where: { businessId: ctx.businessId },
      select: { status: true, amount: true, amountPaid: true, dueAt: true },
    }),
    prisma.product.aggregate({
      where: { businessId: ctx.businessId },
      _sum: { revenue: true },
    }),
    prisma.financeEntry.groupBy({
      by: ["clientId"],
      where: { businessId: ctx.businessId, kind: "REVENUE", occurredAt: { gte: start }, clientId: { not: null } },
      _sum: { amount: true },
    }),
  ]);

  const buckets = new Map<string, { month: string; revenue: number; expenses: number }>();
  for (let i = 0; i < months; i += 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - (months - 1) + i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    buckets.set(key, {
      month: date.toLocaleDateString("en-GB", { month: "short", year: "2-digit" }),
      revenue: 0,
      expenses: 0,
    });
  }

  for (const entry of entries) {
    const key = `${entry.occurredAt.getFullYear()}-${String(entry.occurredAt.getMonth() + 1).padStart(2, "0")}`;
    const bucket = buckets.get(key);
    if (!bucket) continue;
    const amount = toNumber(entry.amount);
    if (entry.kind === "REVENUE") bucket.revenue += amount;
    else bucket.expenses += amount;
  }

  const series = [...buckets.values()].map((bucket) => ({
    ...bucket,
    profit: Math.round((bucket.revenue - bucket.expenses) * 100) / 100,
  }));

  const totals = series.reduce(
    (acc, bucket) => ({
      revenue: acc.revenue + bucket.revenue,
      expenses: acc.expenses + bucket.expenses,
    }),
    { revenue: 0, expenses: 0 }
  );

  const outstanding = invoices
    .filter((invoice) => ["SENT", "PARTIAL", "OVERDUE"].includes(invoice.status))
    .reduce((total, invoice) => total + toNumber(invoice.amount) - toNumber(invoice.amountPaid), 0);

  const collected = invoices
    .filter((invoice) => invoice.status === "PAID")
    .reduce((total, invoice) => total + toNumber(invoice.amount), 0);

  return {
    series,
    totals: {
      revenue: Math.round(totals.revenue * 100) / 100,
      expenses: Math.round(totals.expenses * 100) / 100,
      profit: Math.round((totals.revenue - totals.expenses) * 100) / 100,
      margin: totals.revenue === 0 ? 0 : Math.round(((totals.revenue - totals.expenses) / totals.revenue) * 100),
    },
    invoices: { outstanding: Math.round(outstanding * 100) / 100, collected: Math.round(collected * 100) / 100 },
    productRevenue: toNumber(productRevenue._sum.revenue),
    clientRevenue: clientRevenue
      .map((row) => ({ clientId: row.clientId!, revenue: toNumber(row._sum.amount) }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10),
    currency: ctx.currency,
  };
}
