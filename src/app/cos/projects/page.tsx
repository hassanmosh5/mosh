import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireCosContext, can } from "@/lib/cos/context";
import { listProjects } from "@/lib/cos/services/projects";
import { listClients } from "@/lib/cos/services/crm";
import { formatDate, formatMoney, relativeDays, toNumber } from "@/lib/cos/format";
import { options, PROJECT_STATUS, statusTone } from "@/lib/cos/options";
import { Badge, Card, EmptyState, Grid, HealthDot, PageHeader, ProgressBar, Stat, Table, Td } from "@/components/cos/ui";
import { CreatePanel } from "@/components/cos/disclosure";
import { EntityForm } from "@/components/cos/entity-form";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const ctx = await requireCosContext();
  const status = typeof params.status === "string" ? params.status : undefined;

  const [projects, clients, areas] = await Promise.all([
    listProjects(ctx, { status }),
    listClients(ctx),
    prisma.businessArea.findMany({
      where: { businessId: ctx.businessId, active: true },
      orderBy: { order: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const active = projects.filter((p) => p.status === "ACTIVE" || p.status === "REVIEW");
  const red = projects.filter((p) => p.health === "RED" && p.status !== "COMPLETED" && p.status !== "CANCELLED");
  const totalBudget = projects.reduce((total, p) => total + toNumber(p.budget), 0);
  const totalRevenue = projects.reduce((total, p) => total + toNumber(p.revenue), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Health is computed from deadline pressure, overdue and blocked work, open risks and budget burn."
        actions={
          can(ctx, "project:write") ? (
            <CreatePanel label="New project" title="Create project" defaultOpen={params.new === "1"}>
              <EntityForm
                endpoint="/api/cos/projects"
                submitLabel="Create project"
                fields={[
                  { name: "name", label: "Project name", required: true, span: 2 },
                  { name: "description", label: "Scope and objective", type: "textarea", span: 2 },
                  { name: "clientId", label: "Client", type: "select", options: clients.map((c) => ({ value: c.id, label: c.name })) },
                  { name: "areaId", label: "Business area", type: "select", options: areas.map((a) => ({ value: a.id, label: a.name })) },
                  { name: "status", label: "Status", type: "select", options: options(PROJECT_STATUS), defaultValue: "PLANNING", required: true },
                  { name: "startDate", label: "Start date", type: "date" },
                  { name: "deadline", label: "Deadline", type: "date" },
                  { name: "budget", label: "Budget", type: "number", min: 0 },
                ]}
              />
            </CreatePanel>
          ) : null
        }
      />

      <Grid cols={4}>
        <Stat label="Active" value={active.length} tone="brand" />
        <Stat label="Red health" value={red.length} tone={red.length > 0 ? "bad" : "good"} />
        <Stat label="Committed budget" value={formatMoney(totalBudget, ctx.currency)} />
        <Stat label="Recorded revenue" value={formatMoney(totalRevenue, ctx.currency)} tone="good" />
      </Grid>

      <Card padded={false}>
        <div className="flex flex-wrap gap-2 border-b border-line px-4 py-3 text-xs">
          <Link
            href="/cos/projects"
            className={`rounded-full border px-2.5 py-1 ${!status ? "border-brand bg-brand-soft text-brand" : "border-line text-ink-muted"}`}
          >
            All
          </Link>
          {PROJECT_STATUS.map((value) => (
            <Link
              key={value}
              href={`/cos/projects?status=${value}`}
              className={`rounded-full border px-2.5 py-1 capitalize ${
                status === value ? "border-brand bg-brand-soft text-brand" : "border-line text-ink-muted"
              }`}
            >
              {value.replace("_", " ").toLowerCase()}
            </Link>
          ))}
        </div>

        {projects.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title="No projects yet"
              description="Create a project to start tracking delivery, health and profitability."
            />
          </div>
        ) : (
          <Table head={["Project", "Client", "Status", "Health", "Progress", "Deadline", "Budget"]}>
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-surface-2">
                <Td>
                  <Link href={`/cos/projects/${project.id}`} className="font-medium hover:underline">
                    {project.name}
                  </Link>
                  <p className="text-xs text-ink-subtle">
                    {project.area?.name ?? "No area"} · {project._count.tasks} tasks
                    {project._count.risks > 0 ? ` · ${project._count.risks} risks` : ""}
                  </p>
                </Td>
                <Td className="text-xs text-ink-muted">{project.client?.name ?? "Internal"}</Td>
                <Td><Badge tone={statusTone(project.status)}>{project.status.replace("_", " ")}</Badge></Td>
                <Td>
                  <span className="inline-flex items-center gap-1.5 text-xs">
                    <HealthDot health={project.health} />
                    {project.health}
                  </span>
                </Td>
                <Td className="w-32">
                  <ProgressBar
                    value={project.completion}
                    tone={project.health === "RED" ? "bad" : project.health === "YELLOW" ? "warn" : "good"}
                  />
                  <span className="text-[11px] text-ink-subtle">{project.completion}%</span>
                </Td>
                <Td className="whitespace-nowrap text-xs text-ink-muted">
                  <span title={formatDate(project.deadline)}>{project.deadline ? relativeDays(project.deadline) : "—"}</span>
                </Td>
                <Td className="whitespace-nowrap text-xs tabular-nums text-ink-muted">
                  {project.budget ? formatMoney(toNumber(project.budget), ctx.currency) : "—"}
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
