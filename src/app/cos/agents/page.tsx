import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireCosContext, can } from "@/lib/cos/context";
import { isAiConfigured } from "@/lib/cos/ai/client";
import { formatDateTime } from "@/lib/cos/format";
import { statusTone } from "@/lib/cos/options";
import { Badge, Card, DataNotice, EmptyState, Grid, PageHeader, Stat } from "@/components/cos/ui";
import { AgentRunner } from "./agent-runner";

export const dynamic = "force-dynamic";

export default async function AgentsPage() {
  const ctx = await requireCosContext();

  const [agents, executions, usage] = await Promise.all([
    prisma.aIAgent.findMany({
      where: { businessId: ctx.businessId },
      orderBy: [{ status: "asc" }, { name: "asc" }],
      include: { _count: { select: { executions: true } } },
    }),
    prisma.agentExecution.findMany({
      where: { businessId: ctx.businessId },
      orderBy: { startedAt: "desc" },
      take: 12,
      include: { agent: { select: { name: true, key: true } } },
    }),
    prisma.aiUsage.aggregate({
      where: { businessId: ctx.businessId },
      _sum: { estimatedCost: true },
      _count: true,
    }),
  ]);

  const active = agents.filter((agent) => agent.status === "ACTIVE");

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI agents"
        description="Specialist agents the Chief of Staff can route work to. Each one has its own prompt and a restricted tool set."
      />

      <Grid cols={4}>
        <Stat label="Registered agents" value={agents.length} hint={`${active.length} active`} />
        <Stat label="Total runs" value={agents.reduce((total, agent) => total + agent._count.executions, 0)} />
        <Stat label="AI requests" value={usage._count} />
        <Stat
          label="Estimated AI spend"
          value={`$${Number(usage._sum.estimatedCost ?? 0).toFixed(2)}`}
          hint="All time, list-price estimate"
        />
      </Grid>

      {can(ctx, "agent:run") ? (
        <AgentRunner
          configured={isAiConfigured()}
          agents={active.map((agent) => ({ key: agent.key, name: agent.name, role: agent.role }))}
        />
      ) : null}

      {agents.length === 0 ? (
        <EmptyState
          title="No agents registered"
          description="Run the database seed to install the default MOSH agent registry."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent) => (
            <Card key={agent.id} title={agent.name} description={agent.role}>
              <p className="text-sm text-ink-muted">{agent.description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {agent.capabilities.slice(0, 6).map((capability) => (
                  <Badge key={capability}>{capability}</Badge>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-ink-subtle">
                <Badge tone={agent.status === "ACTIVE" ? "good" : "neutral"}>{agent.status}</Badge>
                <span>{agent._count.executions} runs</span>
                <Link href={`/cos/agents/${agent.key}`} className="text-brand hover:underline">
                  Open
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card title="Recent agent activity">
        {executions.length === 0 ? (
          <EmptyState title="No runs yet" description="Delegate an objective above to see agent activity here." />
        ) : (
          <ul className="space-y-2">
            {executions.map((execution) => (
              <li key={execution.id} className="rounded-lg border border-line px-3 py-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-ink">{execution.agent.name}</p>
                  <div className="flex items-center gap-2 text-[11px] text-ink-subtle">
                    <Badge tone={statusTone(execution.status === "SUCCEEDED" ? "COMPLETED" : execution.status)}>
                      {execution.status}
                    </Badge>
                    {execution.durationMs ? <span>{Math.round(execution.durationMs / 100) / 10}s</span> : null}
                    <span>{formatDateTime(execution.startedAt)}</span>
                  </div>
                </div>
                <p className="mt-0.5 text-xs text-ink-muted">{execution.objective}</p>
                {execution.error ? <p className="mt-1 text-xs text-bad">{execution.error}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <DataNotice>
        Agents can read business data and create internal records. They cannot send client communications,
        publish content, change pricing or delete data — those go through Settings → Approvals.
      </DataNotice>
    </div>
  );
}
