import { prisma } from "@/lib/prisma";
import type { CosContext } from "../tenancy";
import { assertOwned } from "../tenancy";
import { recordAudit } from "../audit";
import { notFound } from "../errors";
import { toNumber } from "../format";
import { weightedPipeline } from "../scoring";
import type {
  clientCreateSchema, clientUpdateSchema,
  contactCreateSchema, contactUpdateSchema,
  leadCreateSchema, leadUpdateSchema,
  opportunityCreateSchema, opportunityUpdateSchema,
} from "../schemas";
import type { z } from "zod";

export const PIPELINE_ORDER = [
  "NEW_LEAD", "QUALIFIED", "CONTACTED", "PROPOSAL", "NEGOTIATION", "WON", "LOST",
] as const;

// ---------- clients ----------

export async function listClients(ctx: CosContext) {
  return prisma.client.findMany({
    where: { businessId: ctx.businessId },
    orderBy: [{ status: "asc" }, { name: "asc" }],
    include: {
      _count: { select: { projects: true, contacts: true, opportunities: true } },
    },
  });
}

export async function getClient(ctx: CosContext, id: string) {
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      contacts: { orderBy: [{ isPrimary: "desc" }, { name: "asc" }] },
      projects: { orderBy: { updatedAt: "desc" }, select: { id: true, name: true, status: true, health: true, deadline: true } },
      opportunities: { orderBy: { updatedAt: "desc" } },
      invoices: { orderBy: { createdAt: "desc" }, take: 10 },
      memories: { orderBy: { updatedAt: "desc" }, take: 20 },
    },
  });
  if (!client || client.businessId !== ctx.businessId) throw notFound("That client could not be found.");
  return client;
}

export async function createClient(ctx: CosContext, input: z.infer<typeof clientCreateSchema>) {
  const client = await prisma.client.create({ data: { businessId: ctx.businessId, ...input } });
  await recordAudit(ctx, { action: "client.create", entityType: "client", entityId: client.id, detail: { name: client.name } });
  return client;
}

export async function updateClient(ctx: CosContext, id: string, input: z.infer<typeof clientUpdateSchema>) {
  const existing = await prisma.client.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "client");
  const client = await prisma.client.update({ where: { id }, data: input });
  await recordAudit(ctx, { action: "client.update", entityType: "client", entityId: id, detail: { fields: Object.keys(input) } });
  return client;
}

export async function deleteClient(ctx: CosContext, id: string) {
  const existing = await prisma.client.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "client");
  await prisma.client.delete({ where: { id } });
  await recordAudit(ctx, { action: "client.delete", entityType: "client", entityId: id, detail: { name: existing!.name } });
  return { ok: true };
}

// ---------- contacts ----------

export async function createContact(ctx: CosContext, input: z.infer<typeof contactCreateSchema>) {
  if (input.clientId) {
    const client = await prisma.client.findUnique({ where: { id: input.clientId } });
    await assertOwned(client, ctx, "client");
  }
  const contact = await prisma.contact.create({ data: { businessId: ctx.businessId, ...input } });
  await recordAudit(ctx, { action: "contact.create", entityType: "contact", entityId: contact.id });
  return contact;
}

export async function updateContact(ctx: CosContext, id: string, input: z.infer<typeof contactUpdateSchema>) {
  const existing = await prisma.contact.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "contact");
  const contact = await prisma.contact.update({ where: { id }, data: input });
  await recordAudit(ctx, { action: "contact.update", entityType: "contact", entityId: id });
  return contact;
}

export async function deleteContact(ctx: CosContext, id: string) {
  const existing = await prisma.contact.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "contact");
  await prisma.contact.delete({ where: { id } });
  await recordAudit(ctx, { action: "contact.delete", entityType: "contact", entityId: id });
  return { ok: true };
}

export async function listContacts(ctx: CosContext) {
  return prisma.contact.findMany({
    where: { businessId: ctx.businessId },
    orderBy: [{ name: "asc" }],
    include: { client: { select: { id: true, name: true } } },
    take: 200,
  });
}

// ---------- leads ----------

export async function listLeads(ctx: CosContext, options: { stage?: string } = {}) {
  return prisma.lead.findMany({
    where: { businessId: ctx.businessId, ...(options.stage ? { stage: options.stage as never } : {}) },
    orderBy: [{ stage: "asc" }, { followUpAt: "asc" }, { updatedAt: "desc" }],
    include: { area: { select: { id: true, name: true } } },
    take: 200,
  });
}

export async function createLead(ctx: CosContext, input: z.infer<typeof leadCreateSchema>) {
  if (input.areaId) {
    const area = await prisma.businessArea.findUnique({ where: { id: input.areaId } });
    await assertOwned(area, ctx, "business area");
  }
  const lead = await prisma.lead.create({ data: { businessId: ctx.businessId, ...input } });
  await recordAudit(ctx, { action: "lead.create", entityType: "lead", entityId: lead.id, detail: { name: lead.name, stage: lead.stage } });
  return lead;
}

export async function updateLead(ctx: CosContext, id: string, input: z.infer<typeof leadUpdateSchema>) {
  const existing = await prisma.lead.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "lead");
  const lead = await prisma.lead.update({ where: { id }, data: input });
  await recordAudit(ctx, {
    action: "lead.update",
    entityType: "lead",
    entityId: id,
    detail: { fields: Object.keys(input), stage: lead.stage },
  });
  return lead;
}

export async function deleteLead(ctx: CosContext, id: string) {
  const existing = await prisma.lead.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "lead");
  await prisma.lead.delete({ where: { id } });
  await recordAudit(ctx, { action: "lead.delete", entityType: "lead", entityId: id });
  return { ok: true };
}

// ---------- opportunities ----------

export async function listOpportunities(ctx: CosContext) {
  return prisma.opportunity.findMany({
    where: { businessId: ctx.businessId },
    orderBy: [{ status: "asc" }, { expectedCloseAt: "asc" }],
    include: {
      client: { select: { id: true, name: true } },
      lead: { select: { id: true, name: true } },
      proposals: { orderBy: { createdAt: "desc" }, take: 3 },
    },
    take: 200,
  });
}

export async function createOpportunity(ctx: CosContext, input: z.infer<typeof opportunityCreateSchema>) {
  if (input.clientId) {
    const client = await prisma.client.findUnique({ where: { id: input.clientId } });
    await assertOwned(client, ctx, "client");
  }
  if (input.leadId) {
    const lead = await prisma.lead.findUnique({ where: { id: input.leadId } });
    await assertOwned(lead, ctx, "lead");
  }
  const opportunity = await prisma.opportunity.create({
    data: { businessId: ctx.businessId, ...input, value: input.value ?? 0 },
  });
  await recordAudit(ctx, { action: "opportunity.create", entityType: "opportunity", entityId: opportunity.id });
  return opportunity;
}

export async function updateOpportunity(ctx: CosContext, id: string, input: z.infer<typeof opportunityUpdateSchema>) {
  const existing = await prisma.opportunity.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "opportunity");
  const closing = input.status && input.status !== "OPEN" && existing!.status === "OPEN";
  const opportunity = await prisma.opportunity.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.leadId !== undefined ? { leadId: input.leadId || null } : {}),
      ...(input.clientId !== undefined ? { clientId: input.clientId || null } : {}),
      ...(input.value !== undefined ? { value: input.value ?? 0 } : {}),
      ...(input.stage !== undefined ? { stage: input.stage } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.probability !== undefined ? { probability: input.probability } : {}),
      ...(input.expectedCloseAt !== undefined ? { expectedCloseAt: input.expectedCloseAt } : {}),
      ...(input.lostReason !== undefined ? { lostReason: input.lostReason } : {}),
      ...(input.notes !== undefined ? { notes: input.notes } : {}),
      ...(closing ? { closedAt: new Date() } : {}),
    },
  });
  await recordAudit(ctx, { action: "opportunity.update", entityType: "opportunity", entityId: id, detail: { fields: Object.keys(input) } });
  return opportunity;
}

export async function deleteOpportunity(ctx: CosContext, id: string) {
  const existing = await prisma.opportunity.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "opportunity");
  await prisma.opportunity.delete({ where: { id } });
  await recordAudit(ctx, { action: "opportunity.delete", entityType: "opportunity", entityId: id });
  return { ok: true };
}

// ---------- pipeline analytics ----------

export async function getPipeline(ctx: CosContext) {
  const [leads, opportunities] = await Promise.all([
    prisma.lead.findMany({
      where: { businessId: ctx.businessId },
      select: { id: true, name: true, company: true, stage: true, estimatedValue: true, probability: true, followUpAt: true },
    }),
    prisma.opportunity.findMany({
      where: { businessId: ctx.businessId },
      select: { id: true, title: true, stage: true, status: true, value: true, probability: true, expectedCloseAt: true },
    }),
  ]);

  const stages = PIPELINE_ORDER.map((stage) => {
    const stageLeads = leads.filter((lead) => lead.stage === stage);
    const stageOpps = opportunities.filter((opp) => opp.stage === stage);
    const value =
      stageLeads.reduce((total, lead) => total + toNumber(lead.estimatedValue), 0) +
      stageOpps.reduce((total, opp) => total + toNumber(opp.value), 0);
    return { stage, leads: stageLeads.length, opportunities: stageOpps.length, value };
  });

  const open = opportunities.filter((opp) => opp.status === "OPEN");
  const won = opportunities.filter((opp) => opp.status === "WON");
  const lost = opportunities.filter((opp) => opp.status === "LOST");
  const closed = won.length + lost.length;

  return {
    stages,
    totals: {
      openValue: open.reduce((total, opp) => total + toNumber(opp.value), 0),
      weightedValue: weightedPipeline(
        open.map((opp) => ({ value: toNumber(opp.value), probability: opp.probability, stage: opp.stage }))
      ),
      wonValue: won.reduce((total, opp) => total + toNumber(opp.value), 0),
      conversionRate: closed === 0 ? 0 : Math.round((won.length / closed) * 100),
      averageDealValue: won.length === 0 ? 0 : Math.round(won.reduce((t, o) => t + toNumber(o.value), 0) / won.length),
      openCount: open.length,
      wonCount: won.length,
      lostCount: lost.length,
    },
  };
}
