import { prisma } from "@/lib/prisma";
import { requireCosContext, can } from "@/lib/cos/context";
import { listIntegrations } from "@/lib/cos/services/integrations";
import { listApprovals } from "@/lib/cos/services/approvals";
import { formatDateTime } from "@/lib/cos/format";
import { options } from "@/lib/cos/options";
import { Badge, Card, DataNotice, EmptyState, PageHeader, Table, Td } from "@/components/cos/ui";
import { EntityForm } from "@/components/cos/entity-form";
import { CreatePanel } from "@/components/cos/disclosure";
import { StatusSelect } from "@/components/cos/row-actions";
import { ApprovalActions } from "./approval-actions";
import { IntegrationToggle } from "./integration-toggle";

export const dynamic = "force-dynamic";

const COS_ROLES = ["OWNER", "MANAGER", "MEMBER", "CLIENT", "VIEWER"] as const;

export default async function SettingsPage() {
  const ctx = await requireCosContext();
  const isOwner = can(ctx, "settings:write");

  const [business, areas, members, integrations, approvals, auditLogs] = await Promise.all([
    prisma.business.findUnique({ where: { id: ctx.businessId } }),
    prisma.businessArea.findMany({
      where: { businessId: ctx.businessId },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    }),
    prisma.membership.findMany({
      where: { businessId: ctx.businessId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    }),
    listIntegrations(ctx),
    can(ctx, "approval:read") ? listApprovals(ctx) : Promise.resolve([]),
    can(ctx, "audit:read")
      ? prisma.auditLog.findMany({
          where: { businessId: ctx.businessId },
          orderBy: { createdAt: "desc" },
          take: 40,
        })
      : Promise.resolve([]),
  ]);

  const pendingApprovals = approvals.filter((approval) => approval.status === "PENDING");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Workspace, business areas, people, approvals, integrations and the audit trail."
      />

      {can(ctx, "approval:read") ? (
        <Card
          title="Approvals"
          description="PLAN → APPROVE → EXECUTE. The AI can only produce the plan; you approve and carry it out."
        >
          {approvals.length === 0 ? (
            <EmptyState
              title="No approval requests"
              description="When the Chief of Staff proposes a high-impact action, it lands here instead of happening."
            />
          ) : (
            <ul className="space-y-2">
              {approvals.map((approval) => (
                <li key={approval.id} className="rounded-lg border border-line px-3 py-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge tone={approval.status === "PENDING" ? "warn" : approval.status === "APPROVED" ? "info" : approval.status === "EXECUTED" ? "good" : "neutral"}>
                        {approval.status}
                      </Badge>
                      <span className="font-mono text-xs text-ink-muted">{approval.action}</span>
                      {approval.agentKey ? <span className="text-[11px] text-ink-subtle">by {approval.agentKey}</span> : null}
                    </div>
                    <span className="text-[11px] text-ink-subtle">{formatDateTime(approval.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink">{approval.summary}</p>
                  {can(ctx, "approval:decide") ? (
                    <div className="mt-2">
                      <ApprovalActions id={approval.id} status={approval.status} />
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
          {pendingApprovals.length > 0 ? (
            <p className="mt-3 text-xs text-warn">
              {pendingApprovals.length} request{pendingApprovals.length === 1 ? "" : "s"} waiting on you.
            </p>
          ) : null}
        </Card>
      ) : null}

      {isOwner && business ? (
        <Card title="Business" description="Name, currency and timezone used across the product.">
          <EntityForm
            endpoint="/api/cos/settings/business"
            method="PATCH"
            submitLabel="Save business"
            resetOnSuccess={false}
            fields={[
              { name: "name", label: "Business name", defaultValue: business.name, required: true },
              { name: "tagline", label: "Tagline", defaultValue: business.tagline ?? "" },
              { name: "currency", label: "Currency (ISO 4217)", defaultValue: business.currency, required: true, hint: "e.g. GHS, USD" },
              { name: "timezone", label: "Timezone", defaultValue: business.timezone, required: true },
            ]}
          />
        </Card>
      ) : null}

      <Card
        title="Business areas"
        description="Areas are data, not code — add or retire them as the studio changes."
        actions={
          isOwner ? (
            <CreatePanel label="Add area" title="New business area">
              <EntityForm
                endpoint="/api/cos/settings/areas"
                submitLabel="Add area"
                compact
                fields={[
                  { name: "name", label: "Name", required: true },
                  { name: "description", label: "Description", type: "textarea", span: 2 },
                ]}
              />
            </CreatePanel>
          ) : null
        }
      >
        <div className="flex flex-wrap gap-1.5">
          {areas.map((area) => (
            <Badge key={area.id} tone={area.active ? "brand" : "neutral"}>
              {area.name}
            </Badge>
          ))}
        </div>
      </Card>

      <Card title="People" description="Roles decide what each person — and the AI acting on their behalf — can do.">
        <Table head={["Person", "Email", "Role", "Active"]}>
          {members.map((member) => (
            <tr key={member.id}>
              <Td className="text-sm">{member.user.name ?? "Unnamed"}</Td>
              <Td className="text-xs text-ink-muted">{member.user.email}</Td>
              <Td>
                {isOwner ? (
                  <StatusSelect
                    endpoint={`/api/cos/settings/members/${member.id}`}
                    field="role"
                    value={member.role}
                    options={options(COS_ROLES)}
                  />
                ) : (
                  <Badge>{member.role}</Badge>
                )}
              </Td>
              <Td className="text-xs">{member.active ? "Yes" : "No"}</Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card
        title="Integrations"
        description="An integration is CONNECTED only when its credentials are actually present on the server."
      >
        <Table head={["Integration", "Category", "Status", "Requirements", ""]}>
          {integrations.map((integration) => (
            <tr key={integration.provider}>
              <Td>
                <p className="text-sm font-medium">{integration.displayName}</p>
                <p className="text-xs text-ink-subtle">{integration.description}</p>
              </Td>
              <Td className="text-xs text-ink-muted">{integration.category}</Td>
              <Td>
                <Badge
                  tone={
                    integration.status === "CONNECTED"
                      ? "good"
                      : integration.status === "ERROR"
                        ? "bad"
                        : integration.status === "DISABLED"
                          ? "neutral"
                          : "warn"
                  }
                >
                  {integration.status.replace("_", " ")}
                </Badge>
              </Td>
              <Td className="text-[11px] text-ink-subtle">
                {integration.missingEnv.length === 0
                  ? "All credentials present"
                  : `Missing: ${integration.missingEnv.join(", ")}`}
              </Td>
              <Td>
                {isOwner ? (
                  <IntegrationToggle
                    provider={integration.provider}
                    status={integration.status}
                    disabled={integration.missingEnv.length > 0 && integration.status !== "CONNECTED"}
                  />
                ) : null}
              </Td>
            </tr>
          ))}
        </Table>
        <DataNotice>
          M-CoS never stores integration secrets in the database. Credentials live in server environment
          variables; only non-secret configuration is persisted.
        </DataNotice>
      </Card>

      {can(ctx, "audit:read") ? (
        <Card title="Audit log" description="The last 40 recorded actions by people, the AI and agents.">
          {auditLogs.length === 0 ? (
            <EmptyState title="Nothing recorded yet" description="Every write, agent run and integration change is logged here." />
          ) : (
            <Table head={["When", "Actor", "Action", "Object", "Result"]}>
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <Td className="whitespace-nowrap text-xs text-ink-muted">{formatDateTime(log.createdAt)}</Td>
                  <Td className="text-xs">
                    <Badge tone={log.actorKind === "AI" || log.actorKind === "AGENT" ? "info" : "neutral"}>
                      {log.actorKind}
                    </Badge>{" "}
                    {log.actorLabel ?? "—"}
                  </Td>
                  <Td className="font-mono text-xs">{log.action}</Td>
                  <Td className="text-xs text-ink-muted">
                    {log.entityType ? `${log.entityType}${log.entityId ? `:${log.entityId.slice(0, 6)}` : ""}` : "—"}
                  </Td>
                  <Td className="text-xs">
                    <Badge tone={log.result === "SUCCESS" ? "good" : log.result === "DENIED" ? "warn" : "bad"}>
                      {log.result}
                    </Badge>
                  </Td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      ) : null}
    </div>
  );
}
