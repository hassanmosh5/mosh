import { ArrowDown } from "lucide-react";
import { requireMoshContext } from "@/lib/mosh/context";
import { getFunnel } from "@/lib/mosh/services/funnel";
import { toIsoDate, today } from "@/lib/mosh/dates";
import { FUNNEL_STAGES } from "@/lib/mosh/constants";
import { HorizontalBarChart } from "@/components/mosh/charts";
import {
  Card,
  EmptyState,
  PageHeader,
  Stat,
  TableWrap,
  tableClass,
  tdClass,
  thClass,
} from "@/components/mosh/ui";
import { FunnelForm } from "./funnel-board";

export const dynamic = "force-dynamic";

export const metadata = { title: "Customer funnel" };

export default async function FunnelPage() {
  const ctx = await requireMoshContext();
  const funnel = await getFunnel(ctx, 180);

  const weakest = funnel.weakestStep;
  const weakestLabel = weakest
    ? `${FUNNEL_STAGES.find((stage) => stage.key === weakest.from)?.label} → ${
        FUNNEL_STAGES.find((stage) => stage.key === weakest.to)?.label
      }`
    : null;

  return (
    <>
      <PageHeader
        eyebrow="Customer funnel"
        title="Visitor to advocate"
        description="Seven stages, six conversions. The stage that leaks worst is the only one worth working on this week."
      />

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          label="Top of funnel"
          value={(funnel.latest?.counts.visitors ?? 0).toLocaleString()}
          hint={funnel.latest ? `As of ${funnel.latest.date}` : "No snapshot yet"}
        />
        <Stat
          label="Customers"
          value={(funnel.latest?.counts.customers ?? 0).toLocaleString()}
          tone="brand"
        />
        <Stat
          label="Visitor → advocate"
          value={funnel.overallConversion === null ? "—" : `${funnel.overallConversion}%`}
          hint="End to end"
        />
        <Stat
          label="Weakest step"
          value={weakest ? `${weakest.rate}%` : "—"}
          hint={weakestLabel ?? "Record two snapshots to see it"}
          tone={weakest ? "warn" : "neutral"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card
          title="The funnel"
          description="Counts at each stage from the most recent snapshot."
        >
          {funnel.latest ? (
            <>
              <HorizontalBarChart
                name="People"
                data={funnel.stages.map((stage) => ({ label: stage.label, value: stage.count }))}
              />
              <ol className="mt-4 space-y-1.5">
                {funnel.stages.map((stage, index) => (
                  <li key={stage.key} className="flex items-center gap-2 text-xs">
                    {index > 0 ? (
                      <ArrowDown size={12} aria-hidden className="text-mosh-ink-subtle" />
                    ) : (
                      <span className="w-3" aria-hidden />
                    )}
                    <span className="text-mosh-ink">{stage.label}</span>
                    <span className="text-mosh-ink-subtle">{stage.meaning}</span>
                    <span className="ml-auto tabular-nums text-mosh-ink-muted">
                      {stage.count.toLocaleString()}
                      {stage.conversionFromPrevious !== null
                        ? ` · ${stage.conversionFromPrevious}%`
                        : ""}
                    </span>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <EmptyState
              title="No snapshot yet"
              description="Record today's numbers below. One snapshot draws the funnel; two start showing you the trend."
            />
          )}
        </Card>

        <FunnelForm funnel={funnel} date={toIsoDate(today())} />
      </div>

      {funnel.history.length > 0 ? (
        <Card
          className="mt-4"
          title="Snapshot history"
          description="Every snapshot in the last 180 days."
        >
          <TableWrap>
            <table className={tableClass}>
              <caption className="sr-only">Funnel snapshots over the last 180 days</caption>
              <thead>
                <tr>
                  <th className={thClass}>Date</th>
                  {FUNNEL_STAGES.map((stage) => (
                    <th key={stage.key} className={thClass}>
                      {stage.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {funnel.history
                  .slice()
                  .reverse()
                  .map((snapshot) => (
                    <tr key={snapshot.date}>
                      <td className={tdClass}>{snapshot.date}</td>
                      {FUNNEL_STAGES.map((stage) => (
                        <td key={stage.key} className={`${tdClass} tabular-nums`}>
                          {snapshot[stage.key].toLocaleString()}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </TableWrap>
        </Card>
      ) : null}
    </>
  );
}
