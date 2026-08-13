import Link from "next/link";
import { notFound as nextNotFound } from "next/navigation";
import Markdown from "react-markdown";
import { prisma } from "@/lib/prisma";
import { requireCosContext, can } from "@/lib/cos/context";
import { formatDateTime } from "@/lib/cos/format";
import { statusTone } from "@/lib/cos/options";
import { Badge, Card, EmptyState, PageHeader } from "@/components/cos/ui";
import { EntityForm } from "@/components/cos/entity-form";

export const dynamic = "force-dynamic";

export default async function AgentDetailPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const ctx = await requireCosContext();

  const agent = await prisma.aIAgent.findUnique({
    where: { businessId_key: { businessId: ctx.businessId, key } },
    include: { executions: { orderBy: { startedAt: "desc" }, take: 15 } },
  });
  if (!agent) nextNotFound();

  const editable = can(ctx, "agent:write");

  return (
    <div className="space-y-6">
      <PageHeader
        title={agent.name}
        description={agent.description}
        actions={
          <Link href="/cos/agents" className="text-sm text-ink-muted hover:text-ink">
            ← All agents
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Configuration" className="lg:col-span-1">
          <dl className="space-y-2 text-sm">
            <Row label="Key"><code className="text-xs">{agent.key}</code></Row>
            <Row label="Role">{agent.role}</Row>
            <Row label="Model"><code className="text-xs">{agent.model}</code></Row>
            <Row label="Status"><Badge tone={agent.status === "ACTIVE" ? "good" : "neutral"}>{agent.status}</Badge></Row>
          </dl>
          <div className="mt-3">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">Capabilities</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {agent.capabilities.map((capability) => (
                <Badge key={capability}>{capability}</Badge>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">Allowed tools</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {agent.allowedTools.length === 0 ? (
                <span className="text-xs text-ink-muted">All tools its role permits</span>
              ) : (
                agent.allowedTools.map((tool) => (
                  <Badge key={tool} tone="info">
                    {tool}
                  </Badge>
                ))
              )}
            </div>
          </div>
        </Card>

        <Card title="System prompt" className="lg:col-span-2">
          <pre className="cos-scroll max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-surface-2 p-3 text-xs text-ink-muted">
            {agent.systemPrompt}
          </pre>
        </Card>
      </div>

      {editable ? (
        <Card title="Edit agent" description="Prompts are stored in the database — changes take effect on the next run.">
          <EntityForm
            endpoint={`/api/cos/agents/${agent.key}`}
            method="PATCH"
            submitLabel="Save agent"
            resetOnSuccess={false}
            fields={[
              { name: "name", label: "Name", defaultValue: agent.name, required: true },
              { name: "role", label: "Role", defaultValue: agent.role, required: true },
              { name: "description", label: "Description", type: "textarea", defaultValue: agent.description, required: true, span: 2 },
              { name: "systemPrompt", label: "System prompt", type: "textarea", defaultValue: agent.systemPrompt, required: true, span: 2 },
              { name: "capabilities", label: "Capabilities", type: "tags", defaultValue: agent.capabilities.join(", "), span: 2 },
              { name: "allowedTools", label: "Allowed tools", type: "tags", defaultValue: agent.allowedTools.join(", "), span: 2, hint: "Leave empty to allow every tool the caller's role permits." },
              { name: "status", label: "Status", type: "select", options: [{ value: "ACTIVE", label: "Active" }, { value: "DISABLED", label: "Disabled" }], defaultValue: agent.status, required: true },
            ]}
          />
        </Card>
      ) : null}

      <Card title="Run history">
        {agent.executions.length === 0 ? (
          <EmptyState title="No runs yet" description="Delegate an objective to this agent from the agents page." />
        ) : (
          <ul className="space-y-3">
            {agent.executions.map((execution) => (
              <li key={execution.id} className="rounded-lg border border-line p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-ink">{execution.objective}</p>
                  <div className="flex items-center gap-2 text-[11px] text-ink-subtle">
                    <Badge tone={statusTone(execution.status === "SUCCEEDED" ? "COMPLETED" : execution.status)}>
                      {execution.status}
                    </Badge>
                    <span>{formatDateTime(execution.startedAt)}</span>
                  </div>
                </div>
                {execution.output ? (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-brand">View output</summary>
                    <div className="prose prose-sm mt-2 max-w-none dark:prose-invert">
                      <Markdown>{execution.output}</Markdown>
                    </div>
                  </details>
                ) : null}
                {execution.error ? <p className="mt-1 text-xs text-bad">{execution.error}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-xs uppercase tracking-wide text-ink-subtle">{label}</dt>
      <dd className="text-right text-ink">{children}</dd>
    </div>
  );
}
