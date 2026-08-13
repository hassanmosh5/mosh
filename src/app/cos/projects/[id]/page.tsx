import Link from "next/link";
import { notFound as nextNotFound } from "next/navigation";
import { requireCosContext, can } from "@/lib/cos/context";
import { getProject } from "@/lib/cos/services/projects";
import { AppError } from "@/lib/cos/errors";
import { formatDate, formatMoney, relativeDays, toNumber } from "@/lib/cos/format";
import { options, PROJECT_STATUS, RISK_SEVERITY, statusTone } from "@/lib/cos/options";
import { Badge, Card, EmptyState, Grid, HealthDot, PageHeader, ProgressBar, Stat, Table, Td } from "@/components/cos/ui";
import { CreatePanel } from "@/components/cos/disclosure";
import { EntityForm } from "@/components/cos/entity-form";
import { DeleteButton } from "@/components/cos/row-actions";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await requireCosContext();

  let project;
  try {
    project = await getProject(ctx, id);
  } catch (error) {
    if (error instanceof AppError && error.status === 404) nextNotFound();
    throw error;
  }

  const writable = can(ctx, "project:write");
  const openTasks = project.tasks.filter((t) => t.status !== "COMPLETED" && t.status !== "CANCELLED");
  const budget = toNumber(project.budget);
  const spend = toNumber(project.spend);

  return (
    <div className="space-y-6">
      <PageHeader
        title={project.name}
        description={project.description ?? undefined}
        actions={
          <>
            <Link href="/cos/projects" className="text-sm text-ink-muted hover:text-ink">
              ← All projects
            </Link>
            {can(ctx, "project:delete") ? (
              <DeleteButton endpoint={`/api/cos/projects/${project.id}`} redirectTo="/cos/projects" />
            ) : null}
          </>
        }
      />

      <Grid cols={4}>
        <Stat
          label="Health"
          value={project.health}
          tone={project.health === "RED" ? "bad" : project.health === "YELLOW" ? "warn" : "good"}
          hint={project.healthNote ?? undefined}
        />
        <Stat label="Completion" value={`${project.completion}%`} hint={`${openTasks.length} open tasks`} />
        <Stat
          label="Deadline"
          value={project.deadline ? relativeDays(project.deadline) : "None"}
          hint={formatDate(project.deadline)}
          tone={project.deadline && project.deadline < new Date() ? "bad" : "neutral"}
        />
        <Stat
          label="Budget"
          value={budget ? formatMoney(budget, ctx.currency) : "—"}
          hint={spend ? `${formatMoney(spend, ctx.currency)} spent` : "No spend recorded"}
          tone={budget > 0 && spend > budget ? "bad" : "neutral"}
        />
      </Grid>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card
            title="Tasks"
            description={`${project.tasks.length} total`}
            actions={<Link href={`/cos/tasks?projectId=${project.id}`} className="text-xs text-brand hover:underline">Open in tasks</Link>}
            padded={project.tasks.length === 0}
          >
            {project.tasks.length === 0 ? (
              <EmptyState title="No tasks on this project" description="Add tasks so health and completion can be computed." />
            ) : (
              <Table head={["Task", "Status", "Due", "Owner"]}>
                {project.tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-surface-2">
                    <Td>
                      <Link href={`/cos/tasks/${task.id}`} className="hover:underline">{task.title}</Link>
                    </Td>
                    <Td><Badge tone={statusTone(task.status)}>{task.status.replace("_", " ")}</Badge></Td>
                    <Td className="text-xs text-ink-muted">{task.dueDate ? relativeDays(task.dueDate) : "—"}</Td>
                    <Td className="text-xs text-ink-muted">{task.assignee?.name ?? "—"}</Td>
                  </tr>
                ))}
              </Table>
            )}
          </Card>

          <Card title="Milestones" padded>
            {project.milestones.length === 0 ? (
              <EmptyState title="No milestones" description="Milestones make deadline risk visible earlier." />
            ) : (
              <ul className="space-y-2">
                {project.milestones.map((milestone) => (
                  <li key={milestone.id} className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-ink">{milestone.title}</p>
                      {milestone.description ? (
                        <p className="text-xs text-ink-muted">{milestone.description}</p>
                      ) : null}
                    </div>
                    <div className="text-right text-xs">
                      {milestone.completedAt ? (
                        <Badge tone="good">Done {formatDate(milestone.completedAt)}</Badge>
                      ) : (
                        <span className="text-ink-muted">{milestone.dueDate ? relativeDays(milestone.dueDate) : "No date"}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {writable ? (
              <div className="mt-4">
                <CreatePanel label="Add milestone" title="New milestone">
                  <EntityForm
                    endpoint={`/api/cos/projects/${project.id}/milestones`}
                    submitLabel="Add milestone"
                    compact
                    fields={[
                      { name: "title", label: "Title", required: true, span: 2 },
                      { name: "description", label: "Description", type: "textarea", span: 2 },
                      { name: "dueDate", label: "Due date", type: "date" },
                    ]}
                  />
                </CreatePanel>
              </div>
            ) : null}
          </Card>

          <Card title="Risks">
            {project.risks.length === 0 ? (
              <EmptyState title="No risks recorded" description="Recorded risks feed the health score and the morning briefing." />
            ) : (
              <ul className="space-y-2">
                {project.risks.map((risk) => (
                  <li key={risk.id} className="rounded-lg border border-line px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-ink">{risk.title}</p>
                      <Badge tone={statusTone(risk.severity)}>{risk.severity}</Badge>
                    </div>
                    {risk.detail ? <p className="mt-1 text-xs text-ink-muted">{risk.detail}</p> : null}
                    {risk.mitigation ? (
                      <p className="mt-1 text-xs text-ink-subtle">Mitigation: {risk.mitigation}</p>
                    ) : null}
                    {risk.resolvedAt ? <Badge tone="good">Resolved {formatDate(risk.resolvedAt)}</Badge> : null}
                  </li>
                ))}
              </ul>
            )}
            {writable ? (
              <div className="mt-4">
                <CreatePanel label="Log risk" title="New risk">
                  <EntityForm
                    endpoint={`/api/cos/projects/${project.id}/risks`}
                    submitLabel="Log risk"
                    compact
                    fields={[
                      { name: "title", label: "Risk", required: true, span: 2 },
                      { name: "detail", label: "Detail", type: "textarea", span: 2 },
                      { name: "severity", label: "Severity", type: "select", options: options(RISK_SEVERITY), defaultValue: "MEDIUM", required: true },
                      { name: "mitigation", label: "Mitigation", type: "textarea", span: 2 },
                    ]}
                  />
                </CreatePanel>
              </div>
            ) : null}
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Details">
            <dl className="space-y-2 text-sm">
              <Row label="Status"><Badge tone={statusTone(project.status)}>{project.status.replace("_", " ")}</Badge></Row>
              <Row label="Client">{project.client?.name ?? "Internal"}</Row>
              <Row label="Area">{project.area?.name ?? "—"}</Row>
              <Row label="Start">{formatDate(project.startDate)}</Row>
              <Row label="Deadline">{formatDate(project.deadline)}</Row>
              <Row label="Revenue">{project.revenue ? formatMoney(toNumber(project.revenue), ctx.currency) : "—"}</Row>
            </dl>
            <div className="mt-3">
              <ProgressBar value={project.completion} />
              <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
                <HealthDot health={project.health} />
                {project.healthNote ?? "No health signals."}
              </p>
            </div>
          </Card>

          {project.members.length > 0 ? (
            <Card title="Team & agents">
              <ul className="space-y-1 text-sm">
                {project.members.map((member) => (
                  <li key={member.id} className="flex items-center justify-between">
                    <span>{member.user?.name ?? member.agent?.name ?? "Unknown"}</span>
                    <span className="text-xs text-ink-subtle">{member.roleLabel ?? (member.agent ? "AI agent" : "member")}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {writable ? (
            <Card title="Update project">
              <EntityForm
                endpoint={`/api/cos/projects/${project.id}`}
                method="PATCH"
                submitLabel="Save"
                resetOnSuccess={false}
                compact
                fields={[
                  { name: "status", label: "Status", type: "select", options: options(PROJECT_STATUS), defaultValue: project.status, required: true },
                  { name: "deadline", label: "Deadline", type: "date", defaultValue: project.deadline ? project.deadline.toISOString().slice(0, 10) : "" },
                  { name: "budget", label: "Budget", type: "number", defaultValue: budget || "" },
                  { name: "spend", label: "Spend to date", type: "number", defaultValue: spend || "" },
                  { name: "revenue", label: "Revenue", type: "number", defaultValue: toNumber(project.revenue) || "" },
                  { name: "notes", label: "Notes", type: "textarea", defaultValue: project.notes ?? "", span: 2 },
                ]}
              />
            </Card>
          ) : null}
        </div>
      </div>
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
