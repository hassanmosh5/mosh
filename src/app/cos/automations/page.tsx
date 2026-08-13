import { requireCosContext, can } from "@/lib/cos/context";
import { detectAutomationCandidates, listAutomations, listDecisions } from "@/lib/cos/services/automations";
import { AUTOMATION_STATUS, options, statusTone } from "@/lib/cos/options";
import { Badge, Card, DataNotice, EmptyState, Grid, PageHeader, Stat, Table, Td } from "@/components/cos/ui";
import { CreatePanel } from "@/components/cos/disclosure";
import { EntityForm } from "@/components/cos/entity-form";
import { StatusSelect } from "@/components/cos/row-actions";

export const dynamic = "force-dynamic";

export default async function AutomationsPage() {
  const ctx = await requireCosContext();
  const [automations, candidates, decisions] = await Promise.all([
    listAutomations(ctx),
    detectAutomationCandidates(ctx),
    listDecisions(ctx),
  ]);

  const writable = can(ctx, "automation:write");
  const live = automations.filter((item) => item.status === "LIVE");
  const savedHours = live.reduce((total, item) => total + item.analysis.monthlyHoursSaved, 0);
  const potentialHours = automations
    .filter((item) => item.status !== "LIVE" && item.status !== "REJECTED")
    .reduce((total, item) => total + item.analysis.monthlyHoursSaved, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Automations"
        description="Every repetitive process, scored on time saved, business value and how hard it is to build."
        actions={
          writable ? (
            <CreatePanel label="Log a process" title="New automation opportunity">
              <EntityForm
                endpoint="/api/cos/automations"
                submitLabel="Score it"
                fields={[
                  { name: "name", label: "Process name", required: true, span: 2, placeholder: "Client onboarding" },
                  { name: "process", label: "What happens today, manually", type: "textarea", required: true, span: 2 },
                  { name: "trigger", label: "What triggers it", span: 2 },
                  { name: "frequencyPerMonth", label: "Runs per month", type: "number", min: 1, defaultValue: 4, required: true },
                  { name: "minutesPerRun", label: "Minutes per run (today)", type: "number", min: 1, defaultValue: 60, required: true },
                  { name: "minutesAfter", label: "Minutes per run (automated)", type: "number", min: 0, defaultValue: 10, required: true },
                  { name: "complexity", label: "Complexity 1-5", type: "number", min: 1, max: 5, defaultValue: 3, required: true },
                  { name: "businessValue", label: "Business value 1-5", type: "number", min: 1, max: 5, defaultValue: 3, required: true },
                  { name: "tooling", label: "Suggested tooling", placeholder: "Make, n8n, custom API…" },
                  { name: "steps", label: "Proposed steps", type: "tags", hint: "Comma separated, in order", span: 2 },
                ]}
              />
            </CreatePanel>
          ) : null
        }
      />

      <Grid cols={4}>
        <Stat label="Live automations" value={live.length} tone="good" />
        <Stat label="Hours saved / month" value={savedHours.toFixed(1)} tone="good" />
        <Stat label="Candidates logged" value={automations.length - live.length} />
        <Stat label="Potential hours / month" value={potentialHours.toFixed(1)} tone="brand" />
      </Grid>

      <Card padded={automations.length === 0} title="Logged opportunities">
        {automations.length === 0 ? (
          <EmptyState
            title="Nothing logged yet"
            description="Log a process you repeat by hand, or take one of the detected candidates below."
          />
        ) : (
          <Table head={["Process", "Score", "Time saved", "Status", "Tooling"]}>
            {automations.map((automation) => (
              <tr key={automation.id} className="hover:bg-surface-2">
                <Td>
                  <p className="font-medium">{automation.name}</p>
                  <p className="max-w-lg text-xs text-ink-subtle">{automation.process}</p>
                </Td>
                <Td>
                  <Badge tone={automation.analysis.rating === "HIGH" ? "good" : automation.analysis.rating === "MEDIUM" ? "warn" : "neutral"}>
                    {automation.score}/100 · {automation.analysis.rating}
                  </Badge>
                </Td>
                <Td className="text-xs text-ink-muted">
                  {automation.analysis.monthlyHoursSaved}h/mo
                  <span className="block text-[11px] text-ink-subtle">
                    {automation.analysis.annualHoursSaved}h/year
                  </span>
                </Td>
                <Td>
                  {writable ? (
                    <StatusSelect
                      endpoint={`/api/cos/automations/${automation.id}`}
                      value={automation.status}
                      options={options(AUTOMATION_STATUS)}
                    />
                  ) : (
                    <Badge tone={statusTone(automation.status)}>{automation.status}</Badge>
                  )}
                </Td>
                <Td className="text-xs text-ink-muted">{automation.tooling ?? "—"}</Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Card
        title="Detected candidates"
        description="Found by scanning recurring tasks and repeated task titles in your history."
      >
        {candidates.length === 0 ? (
          <EmptyState
            title="No repetition detected yet"
            description="Once tasks start repeating, candidates will appear here automatically."
          />
        ) : (
          <ul className="space-y-2">
            {candidates.map((candidate) => (
              <li key={candidate.name} className="rounded-lg border border-line px-3 py-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-ink">{candidate.name}</p>
                  <Badge tone={candidate.analysis.rating === "HIGH" ? "good" : "warn"}>
                    {candidate.analysis.score}/100
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-ink-muted">{candidate.process}</p>
                <p className="mt-1 text-[11px] text-ink-subtle">
                  Evidence: {candidate.evidence} · {candidate.minutesPerRun} min × {candidate.frequencyPerMonth}/month ·{" "}
                  {candidate.analysis.payoffNote}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Decision log" description="Opportunity scores recorded by you or by the Chief of Staff.">
        {decisions.length === 0 ? (
          <EmptyState title="No decisions scored" description="Ask the Chief of Staff to score an opportunity and it will appear here." />
        ) : (
          <Table head={["Decision", "Score", "Recommendation", "Next step"]}>
            {decisions.map((decision) => (
              <tr key={decision.id} className="hover:bg-surface-2">
                <Td>
                  <p className="font-medium">{decision.title}</p>
                  {decision.context ? <p className="max-w-md text-xs text-ink-subtle">{decision.context}</p> : null}
                </Td>
                <Td>
                  <Badge tone={decision.score >= 75 ? "good" : decision.score >= 55 ? "warn" : "neutral"}>
                    {decision.score}/100
                  </Badge>
                </Td>
                <Td className="max-w-sm text-xs text-ink-muted">{decision.recommendation ?? decision.rationale ?? "—"}</Td>
                <Td className="max-w-xs text-xs text-ink-muted">{decision.nextStep ?? "—"}</Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <DataNotice>
        Scores are computed by the system from the inputs above, not generated by the AI. Time savings are
        ESTIMATES based on the minutes you record.
      </DataNotice>
    </div>
  );
}
