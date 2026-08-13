import Link from "next/link";
import { notFound as nextNotFound } from "next/navigation";
import { requireCosContext, can } from "@/lib/cos/context";
import { getTask } from "@/lib/cos/services/tasks";
import { listProjects } from "@/lib/cos/services/projects";
import { AppError } from "@/lib/cos/errors";
import { formatDate, formatDateTime, relativeDays } from "@/lib/cos/format";
import { options, statusTone, TASK_PRIORITY, TASK_STATUS, RECURRENCE } from "@/lib/cos/options";
import { scoreTask } from "@/lib/cos/scoring";
import { Badge, Card, PageHeader } from "@/components/cos/ui";
import { EntityForm } from "@/components/cos/entity-form";
import { DeleteButton } from "@/components/cos/row-actions";

export const dynamic = "force-dynamic";

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await requireCosContext();

  let task;
  try {
    task = await getTask(ctx, id);
  } catch (error) {
    if (error instanceof AppError && error.status === 404) nextNotFound();
    throw error;
  }

  const projects = await listProjects(ctx, { take: 100 });
  const writable = can(ctx, "task:write");
  const scored = scoreTask({
    id: task.id,
    title: task.title,
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate,
    estimateMins: task.estimateMins,
    clientId: task.clientId,
    projectId: task.projectId,
    goalId: task.goalId,
    tags: task.tags,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={task.title}
        description={task.description ?? undefined}
        actions={
          <>
            <Link href="/cos/tasks" className="text-sm text-ink-muted hover:text-ink">
              ← All tasks
            </Link>
            {can(ctx, "task:delete") ? (
              <DeleteButton endpoint={`/api/cos/tasks/${task.id}`} redirectTo="/cos/tasks" />
            ) : null}
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Status" className="lg:col-span-1">
          <dl className="space-y-2 text-sm">
            <Row label="Status"><Badge tone={statusTone(task.status)}>{task.status}</Badge></Row>
            <Row label="Priority"><Badge tone={statusTone(task.priority)}>{task.priority}</Badge></Row>
            <Row label="Classification">
              <Badge tone={scored.classification === "URGENT" ? "bad" : "neutral"}>
                {scored.classification.replace("_", " ")}
              </Badge>
            </Row>
            <Row label="Priority score">{scored.score}</Row>
            <Row label="Due">{task.dueDate ? `${formatDate(task.dueDate)} (${relativeDays(task.dueDate)})` : "—"}</Row>
            <Row label="Estimate">{task.estimateMins ? `${task.estimateMins} min` : "—"}</Row>
            <Row label="Actual">{task.actualMins ? `${task.actualMins} min` : "—"}</Row>
            <Row label="Project">
              {task.project ? (
                <Link href={`/cos/projects/${task.project.id}`} className="text-brand hover:underline">
                  {task.project.name}
                </Link>
              ) : "—"}
            </Row>
            <Row label="Client">{task.client?.name ?? "—"}</Row>
            <Row label="Goal">{task.goal?.title ?? "—"}</Row>
            <Row label="Assignee">{task.assignee?.name ?? "Unassigned"}</Row>
            <Row label="AI agent">{task.agent?.name ?? "—"}</Row>
            <Row label="Origin">{task.origin}</Row>
            <Row label="Repeats">{task.recurrence}</Row>
            <Row label="Created">{formatDateTime(task.createdAt)}</Row>
            {task.completedAt ? <Row label="Completed">{formatDateTime(task.completedAt)}</Row> : null}
          </dl>
          <p className="mt-3 text-xs text-ink-subtle">Why this score: {scored.reasons.join(", ")}.</p>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          {task.dependsOn.length > 0 ? (
            <Card title="Blocked by">
              <ul className="space-y-1 text-sm">
                {task.dependsOn.map(({ dependsOn }) => (
                  <li key={dependsOn.id} className="flex items-center justify-between">
                    <Link href={`/cos/tasks/${dependsOn.id}`} className="hover:underline">
                      {dependsOn.title}
                    </Link>
                    <Badge tone={statusTone(dependsOn.status)}>{dependsOn.status}</Badge>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {task.notes ? (
            <Card title="Notes">
              <p className="whitespace-pre-wrap text-sm text-ink-muted">{task.notes}</p>
            </Card>
          ) : null}

          {writable ? (
            <Card title="Update task">
              <EntityForm
                endpoint={`/api/cos/tasks/${task.id}`}
                method="PATCH"
                submitLabel="Save changes"
                resetOnSuccess={false}
                fields={[
                  { name: "title", label: "Title", defaultValue: task.title, span: 2 },
                  { name: "description", label: "Description", type: "textarea", defaultValue: task.description ?? "", span: 2 },
                  { name: "status", label: "Status", type: "select", options: options(TASK_STATUS), defaultValue: task.status, required: true },
                  { name: "priority", label: "Priority", type: "select", options: options(TASK_PRIORITY), defaultValue: task.priority, required: true },
                  { name: "dueDate", label: "Due date", type: "date", defaultValue: task.dueDate ? task.dueDate.toISOString().slice(0, 10) : "" },
                  { name: "estimateMins", label: "Estimate (minutes)", type: "number", defaultValue: task.estimateMins ?? "" },
                  { name: "actualMins", label: "Actual (minutes)", type: "number", defaultValue: task.actualMins ?? "" },
                  { name: "projectId", label: "Project", type: "select", options: projects.map((p) => ({ value: p.id, label: p.name })), defaultValue: task.projectId ?? "" },
                  { name: "recurrence", label: "Repeats", type: "select", options: options(RECURRENCE), defaultValue: task.recurrence },
                  { name: "notes", label: "Notes", type: "textarea", defaultValue: task.notes ?? "", span: 2 },
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
