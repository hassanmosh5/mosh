import Link from "next/link";
import { requireCosContext } from "@/lib/cos/context";
import { getBriefing } from "@/lib/cos/dashboard";
import { formatDate, formatMoney, relativeDays } from "@/lib/cos/format";
import { Badge, Card, EmptyState, Grid, HealthDot, PageHeader, ProgressBar, Stat } from "@/components/cos/ui";
import { LinkButton } from "@/components/cos/controls";
import { RefreshNotificationsButton } from "./notifications-button";

export const dynamic = "force-dynamic";

const CLASSIFICATION_TONE = {
  URGENT: "bad",
  IMPORTANT: "info",
  HIGH_VALUE: "brand",
  DELEGATABLE: "warn",
  AUTOMATABLE: "warn",
  LOW_VALUE: "neutral",
} as const;

export default async function DashboardPage() {
  const ctx = await requireCosContext();
  const briefing = await getBriefing(ctx);
  const s = briefing.snapshot;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Good day, ${ctx.userName.split(" ")[0]}`}
        description={`Executive snapshot for ${ctx.businessName} — generated ${formatDate(s.generatedAt)}.`}
        actions={
          <>
            <RefreshNotificationsButton />
            <LinkButton href="/cos/reports?generate=DAILY_BRIEFING" variant="primary">
              Morning briefing
            </LinkButton>
          </>
        }
      />

      <Grid cols={4}>
        <Stat
          label="Overdue tasks"
          value={s.tasks.overdue}
          tone={s.tasks.overdue > 0 ? "bad" : "good"}
          hint={`${s.tasks.dueToday} due today · ${s.tasks.open} open`}
          href="/cos/tasks?overdue=1"
        />
        <Stat
          label="Active projects"
          value={s.projects.active}
          tone={s.projects.atRisk > 0 ? "warn" : "good"}
          hint={`${s.projects.atRisk} need attention`}
          href="/cos/projects"
        />
        <Stat
          label="Weighted pipeline"
          value={formatMoney(s.crm.weightedPipelineValue, s.currency)}
          tone="brand"
          hint={`${s.crm.openOpportunities} open · ${formatMoney(s.crm.pipelineValue, s.currency)} gross`}
          href="/cos/crm"
        />
        <Stat
          label="Profit this month"
          value={formatMoney(s.finance.monthProfit, s.currency)}
          tone={s.finance.monthProfit >= 0 ? "good" : "bad"}
          hint={`${formatMoney(s.finance.monthRevenue, s.currency)} in · ${formatMoney(s.finance.monthExpenses, s.currency)} out`}
          href="/cos/analytics"
        />
      </Grid>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card
          title="Today's priorities"
          description="Ranked by the founder prioritisation model."
          className="lg:col-span-2"
        >
          {briefing.topPriorities.length === 0 ? (
            <EmptyState
              title="Nothing is competing for your attention"
              description="No open work is due, critical or blocked. Add tasks or let the Chief of Staff plan your day."
              action={<LinkButton href="/cos/tasks?new=1">Add a task</LinkButton>}
            />
          ) : (
            <ol className="space-y-2">
              {briefing.topPriorities.map(({ task, score, classification, reasons, context }) => (
                <li
                  key={task.id}
                  className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-line px-3 py-2"
                >
                  <div className="min-w-0">
                    <Link href={`/cos/tasks/${task.id}`} className="text-sm font-medium text-ink hover:underline">
                      {task.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {reasons.join(" · ")}
                      {context?.project?.name ? ` · ${context.project.name}` : ""}
                      {context?.client?.name ? ` · ${context.client.name}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge tone={CLASSIFICATION_TONE[classification]}>{classification.replace("_", " ")}</Badge>
                    <span className="text-xs tabular-nums text-ink-subtle" title="Priority score">
                      {score}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Card>

        <Card title="Notifications" description="Derived from live business data.">
          {s.notifications.length === 0 ? (
            <EmptyState title="All clear" description="No unread alerts." />
          ) : (
            <ul className="space-y-2">
              {s.notifications.map((notification) => (
                <li key={notification.id} className="rounded-lg border border-line px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-ink">{notification.title}</p>
                    <Badge
                      tone={
                        notification.severity === "CRITICAL"
                          ? "bad"
                          : notification.severity === "WARNING"
                            ? "warn"
                            : "info"
                      }
                    >
                      {notification.severity}
                    </Badge>
                  </div>
                  {notification.body ? (
                    <p className="mt-0.5 text-xs text-ink-muted">{notification.body}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Projects needing attention" actions={<LinkButton href="/cos/projects" size="sm">All projects</LinkButton>}>
          {briefing.projectsNeedingAttention.length === 0 ? (
            <EmptyState title="Every project is green" description="No health warnings across active projects." />
          ) : (
            <ul className="space-y-3">
              {briefing.projectsNeedingAttention.map((project) => (
                <li key={project.id}>
                  <div className="flex items-center justify-between gap-2">
                    <Link href={`/cos/projects/${project.id}`} className="flex items-center gap-2 text-sm font-medium text-ink hover:underline">
                      <HealthDot health={project.health} />
                      {project.name}
                    </Link>
                    <span className="text-xs text-ink-muted">{relativeDays(project.deadline)}</span>
                  </div>
                  <div className="mt-1.5">
                    <ProgressBar
                      value={project.completion}
                      tone={project.health === "RED" ? "bad" : project.health === "YELLOW" ? "warn" : "good"}
                    />
                  </div>
                  {project.healthNote ? (
                    <p className="mt-1 text-xs text-ink-muted">{project.healthNote}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Follow-ups & revenue opportunities" actions={<LinkButton href="/cos/crm" size="sm">Open CRM</LinkButton>}>
          {briefing.followUps.length === 0 && briefing.overdueInvoices.length === 0 ? (
            <EmptyState title="No follow-ups due" description="Nothing in the pipeline needs chasing right now." />
          ) : (
            <div className="space-y-4">
              {briefing.followUps.length > 0 ? (
                <ul className="space-y-2">
                  {briefing.followUps.map((lead) => (
                    <li key={lead.id} className="flex items-start justify-between gap-3 text-sm">
                      <div className="min-w-0">
                        <p className="font-medium text-ink">
                          {lead.name}
                          {lead.company ? <span className="text-ink-muted"> · {lead.company}</span> : null}
                        </p>
                        <p className="text-xs text-ink-muted">{lead.nextAction ?? "No next action recorded."}</p>
                      </div>
                      <span className="shrink-0 text-xs text-ink-subtle">{relativeDays(lead.followUpAt)}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {briefing.overdueInvoices.length > 0 ? (
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-subtle">
                    Overdue invoices
                  </p>
                  <ul className="space-y-1">
                    {briefing.overdueInvoices.map((invoice) => (
                      <li key={invoice.id} className="flex items-center justify-between text-sm">
                        <span className="text-ink">
                          {invoice.number}
                          {invoice.client?.name ? ` · ${invoice.client.name}` : ""}
                        </span>
                        <span className="text-bad tabular-nums">
                          {formatMoney(invoice.outstanding, s.currency)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Strategic goals" actions={<LinkButton href="/cos/goals" size="sm">All goals</LinkButton>} className="lg:col-span-2">
          {s.goals.length === 0 ? (
            <EmptyState
              title="No active goals"
              description="Set an annual or quarterly goal so the Chief of Staff can tie work to outcomes."
              action={<LinkButton href="/cos/goals?new=1">Set a goal</LinkButton>}
            />
          ) : (
            <ul className="space-y-3">
              {s.goals.map((goal) => (
                <li key={goal.id}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link href="/cos/goals" className="text-sm font-medium text-ink hover:underline">
                      {goal.title}
                    </Link>
                    <div className="flex items-center gap-2">
                      {goal.atRisk ? <Badge tone="warn">Behind pace</Badge> : null}
                      <Badge>{goal.horizon}</Badge>
                      <span className="text-xs tabular-nums text-ink-muted">{goal.progress}%</span>
                    </div>
                  </div>
                  <div className="mt-1.5">
                    <ProgressBar value={goal.progress} tone={goal.atRisk ? "warn" : "brand"} />
                  </div>
                  {goal.kpi ? (
                    <p className="mt-1 text-xs text-ink-muted">
                      {goal.kpi}: {goal.current.toLocaleString()} / {goal.target?.toLocaleString() ?? "—"}
                      {goal.unit ? ` ${goal.unit}` : ""}
                      {goal.expectedPct !== null ? ` · expected ${goal.expectedPct}% by now` : ""}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Automation opportunities" actions={<LinkButton href="/cos/automations" size="sm">Open</LinkButton>}>
          {s.automations.length === 0 ? (
            <EmptyState title="Nothing logged yet" description="Log a repetitive process to score it." />
          ) : (
            <ul className="space-y-2">
              {s.automations.map((automation) => (
                <li key={automation.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="min-w-0 truncate text-ink">{automation.name}</span>
                  <Badge tone={automation.score >= 66 ? "good" : automation.score >= 36 ? "warn" : "neutral"}>
                    {automation.score}/100
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Grid cols={4}>
        <Stat label="Active clients" value={s.crm.activeClients} hint={`${s.crm.openLeads} open leads`} href="/cos/crm" />
        <Stat label="Content in flight" value={s.content.scheduled} tone={s.content.overdue > 0 ? "warn" : "neutral"} hint={`${s.content.overdue} past publish date`} href="/cos/content" />
        <Stat label="Products live" value={s.products.live} href="/cos/products" />
        <Stat label="Agent runs (7d)" value={s.ai.executionsLast7Days} href="/cos/agents" />
      </Grid>
    </div>
  );
}
