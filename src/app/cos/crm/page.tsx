import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireCosContext, can } from "@/lib/cos/context";
import { getPipeline, listClients, listLeads, listOpportunities, PIPELINE_ORDER } from "@/lib/cos/services/crm";
import { formatDate, formatMoney, relativeDays, toNumber } from "@/lib/cos/format";
import { CLIENT_STATUS, options, PIPELINE_STAGE, statusTone } from "@/lib/cos/options";
import { Badge, Card, EmptyState, Grid, PageHeader, Stat, Table, Td } from "@/components/cos/ui";
import { CreatePanel } from "@/components/cos/disclosure";
import { EntityForm } from "@/components/cos/entity-form";
import { StatusSelect } from "@/components/cos/row-actions";

export const dynamic = "force-dynamic";

export default async function CrmPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const ctx = await requireCosContext();
  const writable = can(ctx, "crm:write");

  const [pipeline, leads, clients, opportunities, areas] = await Promise.all([
    getPipeline(ctx),
    listLeads(ctx),
    listClients(ctx),
    listOpportunities(ctx),
    prisma.businessArea.findMany({
      where: { businessId: ctx.businessId, active: true },
      orderBy: { order: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const money = (value: number) => formatMoney(value, ctx.currency);

  return (
    <div className="space-y-6">
      <PageHeader
        title="CRM"
        description="Leads, clients and opportunities. Pipeline value is weighted by each deal's probability."
        actions={
          writable ? (
            <CreatePanel label="Add lead" title="New lead" defaultOpen={params.new === "1"}>
              <EntityForm
                endpoint="/api/cos/leads"
                submitLabel="Add lead"
                fields={[
                  { name: "name", label: "Name", required: true },
                  { name: "company", label: "Company" },
                  { name: "email", label: "Email", type: "email" },
                  { name: "phone", label: "Phone" },
                  { name: "source", label: "Source", hint: "Referral, Instagram, website…" },
                  { name: "serviceInterest", label: "Service interest" },
                  { name: "areaId", label: "Business area", type: "select", options: areas.map((a) => ({ value: a.id, label: a.name })) },
                  { name: "estimatedValue", label: "Estimated value", type: "number", min: 0 },
                  { name: "stage", label: "Stage", type: "select", options: options(PIPELINE_STAGE), defaultValue: "NEW_LEAD", required: true },
                  { name: "probability", label: "Probability %", type: "number", min: 0, max: 100, defaultValue: 10 },
                  { name: "followUpAt", label: "Follow up on", type: "date" },
                  { name: "nextAction", label: "Next action", span: 2 },
                ]}
              />
            </CreatePanel>
          ) : null
        }
      />

      <Grid cols={4}>
        <Stat label="Weighted pipeline" value={money(pipeline.totals.weightedValue)} tone="brand" hint={`${money(pipeline.totals.openValue)} gross`} />
        <Stat label="Open opportunities" value={pipeline.totals.openCount} hint={`${pipeline.totals.wonCount} won · ${pipeline.totals.lostCount} lost`} />
        <Stat label="Conversion rate" value={`${pipeline.totals.conversionRate}%`} tone={pipeline.totals.conversionRate >= 30 ? "good" : "warn"} />
        <Stat label="Average deal" value={money(pipeline.totals.averageDealValue)} />
      </Grid>

      <Card title="Pipeline by stage" description="Leads and opportunities combined.">
        <div className="grid gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {pipeline.stages.map((stage) => (
            <div key={stage.stage} className="rounded-lg border border-line p-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-ink-subtle">
                {stage.stage.replace("_", " ")}
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-ink">{stage.leads + stage.opportunities}</p>
              <p className="text-xs text-ink-muted">{money(stage.value)}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Leads" description={`${leads.length} in the pipeline`} padded={leads.length === 0}>
        {leads.length === 0 ? (
          <EmptyState title="No leads yet" description="Add your first lead to start tracking the pipeline." />
        ) : (
          <Table head={["Lead", "Stage", "Value", "Probability", "Follow-up", "Next action"]}>
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-surface-2">
                <Td>
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-xs text-ink-subtle">
                    {lead.company ?? "—"}
                    {lead.source ? ` · ${lead.source}` : ""}
                    {lead.area?.name ? ` · ${lead.area.name}` : ""}
                  </p>
                </Td>
                <Td>
                  {writable ? (
                    <StatusSelect
                      endpoint={`/api/cos/leads/${lead.id}`}
                      field="stage"
                      value={lead.stage}
                      options={options(PIPELINE_STAGE)}
                    />
                  ) : (
                    <Badge tone={statusTone(lead.stage)}>{lead.stage.replace("_", " ")}</Badge>
                  )}
                </Td>
                <Td className="whitespace-nowrap text-xs tabular-nums">{money(toNumber(lead.estimatedValue))}</Td>
                <Td className="text-xs tabular-nums">{lead.probability}%</Td>
                <Td className="whitespace-nowrap text-xs text-ink-muted">
                  <span title={formatDate(lead.followUpAt)}>{lead.followUpAt ? relativeDays(lead.followUpAt) : "—"}</span>
                </Td>
                <Td className="max-w-xs text-xs text-ink-muted">{lead.nextAction ?? "—"}</Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card
          title="Clients"
          description={`${clients.length} on the books`}
          padded={clients.length === 0}
          actions={
            writable ? (
              <CreatePanel label="Add client" title="New client">
                <EntityForm
                  endpoint="/api/cos/clients"
                  submitLabel="Add client"
                  compact
                  fields={[
                    { name: "name", label: "Name", required: true },
                    { name: "company", label: "Company" },
                    { name: "email", label: "Email", type: "email" },
                    { name: "phone", label: "Phone" },
                    { name: "status", label: "Status", type: "select", options: options(CLIENT_STATUS), defaultValue: "ACTIVE", required: true },
                    { name: "since", label: "Client since", type: "date" },
                  ]}
                />
              </CreatePanel>
            ) : null
          }
        >
          {clients.length === 0 ? (
            <EmptyState title="No clients yet" description="Convert a won lead or add a client directly." />
          ) : (
            <Table head={["Client", "Status", "Projects", "Opportunities"]}>
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-surface-2">
                  <Td>
                    <Link href={`/cos/crm/clients/${client.id}`} className="font-medium hover:underline">
                      {client.name}
                    </Link>
                    {client.company ? <p className="text-xs text-ink-subtle">{client.company}</p> : null}
                  </Td>
                  <Td><Badge tone={statusTone(client.status)}>{client.status}</Badge></Td>
                  <Td className="text-xs tabular-nums">{client._count.projects}</Td>
                  <Td className="text-xs tabular-nums">{client._count.opportunities}</Td>
                </tr>
              ))}
            </Table>
          )}
        </Card>

        <Card
          title="Opportunities"
          description={`${opportunities.length} tracked`}
          padded={opportunities.length === 0}
          actions={
            writable ? (
              <CreatePanel label="Add opportunity" title="New opportunity">
                <EntityForm
                  endpoint="/api/cos/opportunities"
                  submitLabel="Add opportunity"
                  compact
                  fields={[
                    { name: "title", label: "Title", required: true, span: 2 },
                    { name: "clientId", label: "Client", type: "select", options: clients.map((c) => ({ value: c.id, label: c.name })) },
                    { name: "leadId", label: "Lead", type: "select", options: leads.map((l) => ({ value: l.id, label: l.name })) },
                    { name: "value", label: "Value", type: "number", min: 0 },
                    { name: "probability", label: "Probability %", type: "number", min: 0, max: 100, defaultValue: 30 },
                    { name: "stage", label: "Stage", type: "select", options: options(PIPELINE_STAGE), defaultValue: "QUALIFIED", required: true },
                    { name: "expectedCloseAt", label: "Expected close", type: "date" },
                  ]}
                />
              </CreatePanel>
            ) : null
          }
        >
          {opportunities.length === 0 ? (
            <EmptyState title="No opportunities" description="Track deals separately from leads once they qualify." />
          ) : (
            <Table head={["Opportunity", "Stage", "Value", "Close"]}>
              {opportunities.map((opportunity) => (
                <tr key={opportunity.id} className="hover:bg-surface-2">
                  <Td>
                    <p className="font-medium">{opportunity.title}</p>
                    <p className="text-xs text-ink-subtle">
                      {opportunity.client?.name ?? opportunity.lead?.name ?? "Unassigned"}
                    </p>
                  </Td>
                  <Td><Badge tone={statusTone(opportunity.stage)}>{opportunity.stage.replace("_", " ")}</Badge></Td>
                  <Td className="whitespace-nowrap text-xs tabular-nums">{money(toNumber(opportunity.value))}</Td>
                  <Td className="text-xs text-ink-muted">{formatDate(opportunity.expectedCloseAt)}</Td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      </div>

      <p className="text-xs text-ink-subtle">
        Pipeline stages: {PIPELINE_ORDER.map((stage) => stage.replace("_", " ").toLowerCase()).join(" → ")}.
      </p>
    </div>
  );
}
