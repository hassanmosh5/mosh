import Link from "next/link";
import { notFound as nextNotFound } from "next/navigation";
import { requireCosContext, can } from "@/lib/cos/context";
import { getClient } from "@/lib/cos/services/crm";
import { AppError } from "@/lib/cos/errors";
import { formatDate, formatMoney, toNumber } from "@/lib/cos/format";
import { CLIENT_STATUS, options, statusTone } from "@/lib/cos/options";
import { Badge, Card, EmptyState, Grid, HealthDot, PageHeader, Stat } from "@/components/cos/ui";
import { EntityForm } from "@/components/cos/entity-form";
import { CreatePanel } from "@/components/cos/disclosure";
import { DeleteButton } from "@/components/cos/row-actions";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await requireCosContext();

  let client;
  try {
    client = await getClient(ctx, id);
  } catch (error) {
    if (error instanceof AppError && error.status === 404) nextNotFound();
    throw error;
  }

  const writable = can(ctx, "crm:write");
  const openValue = client.opportunities
    .filter((opportunity) => opportunity.status === "OPEN")
    .reduce((total, opportunity) => total + toNumber(opportunity.value), 0);
  const outstanding = client.invoices.reduce(
    (total, invoice) => total + toNumber(invoice.amount) - toNumber(invoice.amountPaid),
    0
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={client.name}
        description={[client.company, client.email, client.phone].filter(Boolean).join(" · ") || undefined}
        actions={
          <>
            <Link href="/cos/crm" className="text-sm text-ink-muted hover:text-ink">← CRM</Link>
            {can(ctx, "crm:delete") ? (
              <DeleteButton endpoint={`/api/cos/clients/${client.id}`} redirectTo="/cos/crm" />
            ) : null}
          </>
        }
      />

      <Grid cols={4}>
        <Stat label="Status" value={client.status} tone={statusTone(client.status)} hint={client.since ? `Since ${formatDate(client.since)}` : undefined} />
        <Stat label="Projects" value={client.projects.length} />
        <Stat label="Open opportunity value" value={formatMoney(openValue, ctx.currency)} tone="brand" />
        <Stat label="Outstanding invoices" value={formatMoney(outstanding, ctx.currency)} tone={outstanding > 0 ? "warn" : "good"} />
      </Grid>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Projects">
          {client.projects.length === 0 ? (
            <EmptyState title="No projects" description="Projects created for this client will appear here." />
          ) : (
            <ul className="space-y-2">
              {client.projects.map((project) => (
                <li key={project.id} className="flex items-center justify-between gap-2">
                  <Link href={`/cos/projects/${project.id}`} className="flex items-center gap-2 text-sm hover:underline">
                    <HealthDot health={project.health} />
                    {project.name}
                  </Link>
                  <span className="text-xs text-ink-muted">{project.status.replace("_", " ")}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          title="Contacts"
          actions={
            writable ? (
              <CreatePanel label="Add contact" title="New contact">
                <EntityForm
                  endpoint="/api/cos/contacts"
                  submitLabel="Add contact"
                  compact
                  fields={[
                    { name: "name", label: "Name", required: true },
                    { name: "role", label: "Role" },
                    { name: "email", label: "Email", type: "email" },
                    { name: "phone", label: "Phone" },
                    { name: "clientId", label: "Client", type: "select", options: [{ value: client.id, label: client.name }], defaultValue: client.id, required: true },
                  ]}
                />
              </CreatePanel>
            ) : null
          }
        >
          {client.contacts.length === 0 ? (
            <EmptyState title="No contacts" description="Add the people you actually deal with." />
          ) : (
            <ul className="space-y-2 text-sm">
              {client.contacts.map((contact) => (
                <li key={contact.id} className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-ink">
                      {contact.name}
                      {contact.isPrimary ? <Badge tone="brand">Primary</Badge> : null}
                    </p>
                    <p className="text-xs text-ink-muted">
                      {[contact.role, contact.email, contact.phone].filter(Boolean).join(" · ") || "No details"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Opportunities">
          {client.opportunities.length === 0 ? (
            <EmptyState title="No opportunities" description="Deals for this client will show here." />
          ) : (
            <ul className="space-y-2 text-sm">
              {client.opportunities.map((opportunity) => (
                <li key={opportunity.id} className="flex items-center justify-between gap-2">
                  <span>{opportunity.title}</span>
                  <span className="flex items-center gap-2">
                    <Badge tone={statusTone(opportunity.status)}>{opportunity.status}</Badge>
                    <span className="text-xs tabular-nums text-ink-muted">
                      {formatMoney(toNumber(opportunity.value), ctx.currency)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Client memory" description="What the Chief of Staff remembers about this client.">
          {client.memories.length === 0 ? (
            <EmptyState title="Nothing recorded" description="Memories about this client will appear here." />
          ) : (
            <ul className="space-y-2 text-sm">
              {client.memories.map((memory) => (
                <li key={memory.id} className="rounded-lg border border-line px-3 py-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">{memory.key}</p>
                  <p className="mt-0.5 text-ink">{memory.value}</p>
                  <p className="mt-1 text-[11px] text-ink-subtle">
                    {memory.source} · confidence {memory.confidence}%
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {writable ? (
        <Card title="Update client">
          <EntityForm
            endpoint={`/api/cos/clients/${client.id}`}
            method="PATCH"
            submitLabel="Save"
            resetOnSuccess={false}
            fields={[
              { name: "name", label: "Name", defaultValue: client.name, required: true },
              { name: "company", label: "Company", defaultValue: client.company ?? "" },
              { name: "email", label: "Email", type: "email", defaultValue: client.email ?? "" },
              { name: "phone", label: "Phone", defaultValue: client.phone ?? "" },
              { name: "status", label: "Status", type: "select", options: options(CLIENT_STATUS), defaultValue: client.status, required: true },
              { name: "healthNote", label: "Health note", type: "textarea", defaultValue: client.healthNote ?? "", span: 2 },
            ]}
          />
        </Card>
      ) : null}
    </div>
  );
}
