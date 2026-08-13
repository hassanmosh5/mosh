import Link from "next/link";
import { requireCosContext, can } from "@/lib/cos/context";
import { listTasks } from "@/lib/cos/services/tasks";
import { listProjects } from "@/lib/cos/services/projects";
import { listClients } from "@/lib/cos/services/crm";
import { listGoals } from "@/lib/cos/services/goals";
import { taskQuerySchema } from "@/lib/cos/schemas";
import { formatDate, relativeDays } from "@/lib/cos/format";
import { options, statusTone, TASK_PRIORITY, TASK_STATUS, RECURRENCE } from "@/lib/cos/options";
import { prioritiseTasks } from "@/lib/cos/scoring";
import { Badge, Card, EmptyState, PageHeader, Table, Td } from "@/components/cos/ui";
import { CreatePanel } from "@/components/cos/disclosure";
import { EntityForm } from "@/components/cos/entity-form";
import { StatusSelect } from "@/components/cos/row-actions";
import { LinkButton } from "@/components/cos/controls";

export const dynamic = "force-dynamic";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const ctx = await requireCosContext();

  const parsed = taskQuerySchema.partial().safeParse({
    status: typeof params.status === "string" ? params.status : undefined,
    priority: typeof params.priority === "string" ? params.priority : undefined,
    projectId: typeof params.projectId === "string" ? params.projectId : undefined,
    search: typeof params.search === "string" ? params.search : undefined,
    overdue: params.overdue === "1" ? "true" : undefined,
  });
  const query = parsed.success ? parsed.data : {};

  const [{ items, total }, projects, clients, goals] = await Promise.all([
    listTasks(ctx, { ...query, take: 100 }),
    listProjects(ctx, { take: 100 }),
    listClients(ctx),
    listGoals(ctx),
  ]);

  const scored = prioritiseTasks(
    items.map((task) => ({
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
    }))
  );
  const scoreById = new Map(scored.map((entry) => [entry.task.id, entry]));
  const writable = can(ctx, "task:write");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description={`${total} matching task${total === 1 ? "" : "s"}. Ranked by the prioritisation model, not just by date.`}
        actions={
          writable ? (
            <CreatePanel label="Add task" title="New task" defaultOpen={params.new === "1"}>
              <EntityForm
                endpoint="/api/cos/tasks"
                submitLabel="Create task"
                fields={[
                  { name: "title", label: "Title", required: true, span: 2, placeholder: "Draft the Q3 launch checklist" },
                  { name: "description", label: "Description", type: "textarea", span: 2 },
                  { name: "priority", label: "Priority", type: "select", options: options(TASK_PRIORITY), defaultValue: "MEDIUM", required: true },
                  { name: "status", label: "Status", type: "select", options: options(TASK_STATUS), defaultValue: "PLANNED", required: true },
                  { name: "dueDate", label: "Due date", type: "date" },
                  { name: "estimateMins", label: "Estimate (minutes)", type: "number", min: 0 },
                  { name: "projectId", label: "Project", type: "select", options: projects.map((p) => ({ value: p.id, label: p.name })) },
                  { name: "clientId", label: "Client", type: "select", options: clients.map((c) => ({ value: c.id, label: c.name })) },
                  { name: "goalId", label: "Goal", type: "select", options: goals.map((g) => ({ value: g.id, label: g.title })) },
                  { name: "recurrence", label: "Repeats", type: "select", options: options(RECURRENCE), defaultValue: "NONE" },
                  { name: "tags", label: "Tags", type: "tags", hint: "Comma separated", span: 2 },
                ]}
              />
            </CreatePanel>
          ) : null
        }
      />

      <Card padded={false}>
        <div className="flex flex-wrap gap-2 border-b border-line px-4 py-3 text-xs">
          <FilterLink href="/cos/tasks" active={!query.status && !query.overdue} label="All" />
          <FilterLink href="/cos/tasks?overdue=1" active={Boolean(query.overdue)} label="Overdue" />
          {TASK_STATUS.map((status) => (
            <FilterLink
              key={status}
              href={`/cos/tasks?status=${status}`}
              active={query.status === status}
              label={status.replace("_", " ").toLowerCase()}
            />
          ))}
        </div>

        {items.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title="No tasks match this view"
              description="Change the filter above, or add the first task."
            />
          </div>
        ) : (
          <Table head={["Task", "Priority", "Status", "Due", "Project / Client", "Score"]}>
            {items.map((task) => {
              const entry = scoreById.get(task.id);
              return (
                <tr key={task.id} className="hover:bg-surface-2">
                  <Td>
                    <Link href={`/cos/tasks/${task.id}`} className="font-medium hover:underline">
                      {task.title}
                    </Link>
                    {task.tags.length > 0 ? (
                      <span className="ml-2 text-xs text-ink-subtle">{task.tags.join(" · ")}</span>
                    ) : null}
                  </Td>
                  <Td>
                    <Badge tone={statusTone(task.priority)}>{task.priority}</Badge>
                  </Td>
                  <Td>
                    {writable ? (
                      <StatusSelect
                        endpoint={`/api/cos/tasks/${task.id}`}
                        value={task.status}
                        options={options(TASK_STATUS)}
                      />
                    ) : (
                      <Badge tone={statusTone(task.status)}>{task.status}</Badge>
                    )}
                  </Td>
                  <Td className="whitespace-nowrap text-xs text-ink-muted">
                    {task.dueDate ? (
                      <span title={formatDate(task.dueDate)}>{relativeDays(task.dueDate)}</span>
                    ) : (
                      "—"
                    )}
                  </Td>
                  <Td className="text-xs text-ink-muted">
                    {task.project?.name ?? "—"}
                    {task.client?.name ? ` · ${task.client.name}` : ""}
                  </Td>
                  <Td className="text-xs">
                    {entry ? (
                      <span title={entry.reasons.join(", ")}>
                        <Badge tone={entry.classification === "URGENT" ? "bad" : "neutral"}>
                          {entry.score}
                        </Badge>
                      </span>
                    ) : (
                      "—"
                    )}
                  </Td>
                </tr>
              );
            })}
          </Table>
        )}
      </Card>

      <p className="text-xs text-ink-subtle">
        Need this planned for you? <LinkButton href="/cos/chat" size="sm" variant="ghost">Ask the Chief of Staff</LinkButton>
      </p>
    </div>
  );
}

function FilterLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-2.5 py-1 capitalize transition ${
        active ? "border-brand bg-brand-soft text-brand" : "border-line text-ink-muted hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );
}
