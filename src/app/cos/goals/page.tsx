import { requireCosContext, can } from "@/lib/cos/context";
import { listGoals } from "@/lib/cos/services/goals";
import { formatDate, relativeDays } from "@/lib/cos/format";
import { GOAL_HORIZON, GOAL_STATUS, options, statusTone } from "@/lib/cos/options";
import { Badge, Card, EmptyState, Grid, PageHeader, ProgressBar, Stat } from "@/components/cos/ui";
import { CreatePanel } from "@/components/cos/disclosure";
import { EntityForm } from "@/components/cos/entity-form";
import { DeleteButton } from "@/components/cos/row-actions";

export const dynamic = "force-dynamic";

export default async function GoalsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const ctx = await requireCosContext();
  const goals = await listGoals(ctx);
  const writable = can(ctx, "goal:write");

  const active = goals.filter((goal) => goal.status === "ACTIVE" || goal.status === "AT_RISK");
  const behind = active.filter((goal) => goal.atRisk);
  const achieved = goals.filter((goal) => goal.status === "ACHIEVED");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Goals"
        description="Annual through daily. Progress and pace risk are computed from the recorded KPI values."
        actions={
          writable ? (
            <CreatePanel label="Set a goal" title="New goal" defaultOpen={params.new === "1"}>
              <EntityForm
                endpoint="/api/cos/goals"
                submitLabel="Create goal"
                fields={[
                  { name: "title", label: "Goal", required: true, span: 2, placeholder: "Generate GHS 100,000 in digital product revenue" },
                  { name: "description", label: "Description", type: "textarea", span: 2 },
                  { name: "horizon", label: "Horizon", type: "select", options: options(GOAL_HORIZON), defaultValue: "QUARTERLY", required: true },
                  { name: "parentId", label: "Parent goal", type: "select", options: goals.map((g) => ({ value: g.id, label: g.title })) },
                  { name: "kpi", label: "KPI", placeholder: "Digital product revenue" },
                  { name: "unit", label: "Unit", placeholder: "GHS" },
                  { name: "targetValue", label: "Target", type: "number", min: 0 },
                  { name: "currentValue", label: "Current value", type: "number", min: 0, defaultValue: 0 },
                  { name: "startDate", label: "Start", type: "date" },
                  { name: "deadline", label: "Deadline", type: "date" },
                ]}
              />
            </CreatePanel>
          ) : null
        }
      />

      <Grid cols={4}>
        <Stat label="Active goals" value={active.length} />
        <Stat label="Behind pace" value={behind.length} tone={behind.length > 0 ? "warn" : "good"} />
        <Stat label="Achieved" value={achieved.length} tone="good" />
        <Stat label="Linked tasks" value={goals.reduce((total, goal) => total + goal._count.tasks, 0)} />
      </Grid>

      {goals.length === 0 ? (
        <EmptyState
          title="No goals set"
          description="Goals are what let the Chief of Staff tie daily work to outcomes. Start with one annual goal and one quarterly goal."
        />
      ) : (
        GOAL_HORIZON.map((horizon) => {
          const bucket = goals.filter((goal) => goal.horizon === horizon);
          if (bucket.length === 0) return null;
          return (
            <Card key={horizon} title={`${horizon.charAt(0)}${horizon.slice(1).toLowerCase()} goals`}>
              <ul className="space-y-4">
                {bucket.map((goal) => (
                  <li key={goal.id} className="rounded-lg border border-line p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink">{goal.title}</p>
                        {goal.description ? (
                          <p className="mt-0.5 text-xs text-ink-muted">{goal.description}</p>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {goal.atRisk ? <Badge tone="warn">Behind pace</Badge> : null}
                        <Badge tone={statusTone(goal.status)}>{goal.status.replace("_", " ")}</Badge>
                        {can(ctx, "goal:delete") ? (
                          <DeleteButton endpoint={`/api/cos/goals/${goal.id}`} label="Delete" />
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-3">
                      <ProgressBar value={goal.progress} tone={goal.atRisk ? "warn" : "brand"} />
                      <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted">
                        <span>
                          {goal.kpi ? `${goal.kpi}: ` : ""}
                          {goal.current.toLocaleString()} / {goal.target?.toLocaleString() ?? "—"}
                          {goal.unit ? ` ${goal.unit}` : ""} ({goal.progress}%)
                        </span>
                        <span>
                          {goal.deadline ? `${formatDate(goal.deadline)} · ${relativeDays(goal.deadline)}` : "No deadline"}
                          {goal.expectedPct !== null ? ` · expected ${goal.expectedPct}%` : ""}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs text-ink-subtle">
                      <span>{goal._count.tasks} linked task{goal._count.tasks === 1 ? "" : "s"}</span>
                      <span>{goal.owner?.name ? `Owner: ${goal.owner.name}` : "Unowned"}</span>
                    </div>

                    {writable ? (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-xs text-brand">Update progress</summary>
                        <div className="mt-2">
                          <EntityForm
                            endpoint={`/api/cos/goals/${goal.id}`}
                            method="PATCH"
                            submitLabel="Save"
                            resetOnSuccess={false}
                            compact
                            fields={[
                              { name: "currentValue", label: "Current value", type: "number", defaultValue: goal.current },
                              { name: "targetValue", label: "Target", type: "number", defaultValue: goal.target ?? "" },
                              { name: "status", label: "Status", type: "select", options: options(GOAL_STATUS), defaultValue: goal.status, required: true },
                              { name: "deadline", label: "Deadline", type: "date", defaultValue: goal.deadline ? goal.deadline.toISOString().slice(0, 10) : "" },
                            ]}
                          />
                        </div>
                      </details>
                    ) : null}
                  </li>
                ))}
              </ul>
            </Card>
          );
        })
      )}
    </div>
  );
}
