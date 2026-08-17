import Link from "next/link";
import { requireMoshContext } from "@/lib/mosh/context";
import { getAnalytics } from "@/lib/mosh/services/analytics";
import { formatShortDate, formatShortMonth, fromIsoDate } from "@/lib/mosh/dates";
import {
  AlignmentTrendChart,
  HorizontalBarChart,
  PlaneRadarChart,
  ScoreBarChart,
  WealthFlowChart,
} from "@/components/mosh/charts";
import {
  Card,
  EmptyState,
  Grid,
  PageHeader,
  Stat,
  TableWrap,
  buttonClass,
  tableClass,
  tdClass,
  thClass,
} from "@/components/mosh/ui";
import { ExportBar } from "./export-bar";

export const dynamic = "force-dynamic";

export const metadata = { title: "Analytics" };

const RANGES = [30, 90, 180, 365] as const;

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const ctx = await requireMoshContext();
  const params = await searchParams;
  const requested = typeof params.days === "string" ? Number(params.days) : 90;
  const days = RANGES.includes(requested as (typeof RANGES)[number]) ? requested : 90;

  const analytics = await getAnalytics(ctx, days);

  return (
    <>
      <PageHeader
        eyebrow="Analytics"
        title="What the record actually says"
        description="No new numbers here — the same entries you made, arranged so the pattern is visible. Streaks, habits, planes, momentum, money."
        actions={
          <div className="flex flex-wrap gap-2">
            {RANGES.map((range) => (
              <Link
                key={range}
                href={`/mosh/analytics?days=${range}`}
                className={buttonClass(range === days ? "primary" : "secondary", "sm")}
              >
                {range}d
              </Link>
            ))}
          </div>
        }
      />

      <Grid cols={4}>
        <Stat
          label="Current streak"
          value={`${analytics.streak.current}d`}
          hint={`Longest ${analytics.streak.longest} days`}
          tone={analytics.streak.current > 0 ? "brand" : "neutral"}
        />
        <Stat
          label="Average alignment"
          value={analytics.daily.averageAlignment === null ? "—" : `${analytics.daily.averageAlignment}%`}
          hint={
            analytics.daily.alignmentDelta === null
              ? `${analytics.daily.daysRecorded} days recorded`
              : `${analytics.daily.alignmentDelta > 0 ? "+" : ""}${analytics.daily.alignmentDelta} vs the window average`
          }
        />
        <Stat
          label="Average energy"
          value={analytics.daily.averageEnergy ?? "—"}
          hint="Out of 10"
        />
        <Stat label="Average mood" value={analytics.daily.averageMood ?? "—"} hint="Out of 10" />
      </Grid>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="Daily alignment"
          description="The score against the share of the rhythm that produced it."
        >
          {analytics.daily.series.length > 0 ? (
            <AlignmentTrendChart
              data={analytics.daily.series.map((point) => ({
                label: point.label,
                alignment: point.alignment,
                completion: point.completion,
              }))}
            />
          ) : (
            <EmptyState
              title="No days in this window"
              description="Record a few days in the daily tracker and every chart on this page fills in."
            />
          )}
        </Card>

        <Card title="Habit reliability" description="How often each of the seven actually happened.">
          {analytics.daily.daysRecorded > 0 ? (
            <>
              <HorizontalBarChart
                name="Completion"
                suffix="%"
                data={analytics.habits.map((habit) => ({ label: habit.label, value: habit.rate }))}
              />
              {/* Narrow column, so this table is sized to fit rather than to
                  the shared 32rem minimum — it never needs to scroll. */}
              <table className="mt-3 w-full border-collapse text-sm">
                  <caption className="sr-only">Habit completion rate over the window</caption>
                  <thead>
                    <tr>
                      <th className={thClass}>Habit</th>
                      <th className={thClass}>Days</th>
                      <th className={thClass}>Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.habits.map((habit) => (
                      <tr key={habit.key}>
                        <td className={tdClass}>{habit.label}</td>
                        <td className={`${tdClass} tabular-nums`}>
                          {habit.done}/{habit.total}
                        </td>
                        <td className={`${tdClass} tabular-nums`}>{habit.rate}%</td>
                      </tr>
                    ))}
                  </tbody>
              </table>
            </>
          ) : (
            <EmptyState title="Nothing tracked yet" description="The habit table needs at least one recorded day." />
          )}
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {analytics.planes.map((plane) => {
          const measured = plane.attributes.filter((attribute) => attribute.score !== null);
          return (
            <Card key={plane.plane} title={plane.label} description={plane.tagline}>
              {measured.length > 0 ? (
                <>
                  <PlaneRadarChart
                    data={plane.attributes.map((attribute) => ({
                      attribute: attribute.label,
                      score: attribute.score ?? 0,
                    }))}
                  />
                  <ul className="mt-2 space-y-1 text-xs">
                    {plane.attributes.map((attribute) => (
                      <li key={attribute.slug} className="flex justify-between gap-2">
                        <span className="text-mosh-ink-muted">{attribute.label}</span>
                        <span className="tabular-nums text-mosh-ink">
                          {attribute.average === null ? "—" : `${attribute.average}/10`}
                          <span className="ml-1 text-mosh-ink-subtle">({attribute.samples})</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <EmptyState
                  title="No check-ins yet"
                  description="Rate this plane's attributes in the daily tracker to see the shape of it."
                />
              )}
            </Card>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Weekly momentum" description="Every week in the window.">
          {analytics.weekly.some((week) => week.momentum > 0) ? (
            <ScoreBarChart
              name="Momentum"
              data={analytics.weekly.map((week) => ({
                label: formatShortDate(fromIsoDate(week.weekStart)),
                value: week.momentum,
              }))}
            />
          ) : (
            <EmptyState title="No weekly entries" description="Set goals in the weekly tracker to build this." />
          )}
        </Card>

        <Card title="Monthly growth" description="Reviews completed, scored.">
          {analytics.monthly.some((month) => month.growth > 0) ? (
            <ScoreBarChart
              name="Growth"
              data={analytics.monthly.map((month) => ({
                label: formatShortMonth(fromIsoDate(month.month)),
                value: month.growth,
              }))}
            />
          ) : (
            <EmptyState title="No monthly reviews" description="Complete a monthly review to build this." />
          )}
        </Card>
      </div>

      <Card
        className="mt-4"
        title="Wealth Flow, twelve months"
        description="Weighted revenue by tier — the shape of the money model."
      >
        {analytics.business.wealthTrend.some((point) => point.index > 0) ? (
          <WealthFlowChart
            currency={analytics.business.currency}
            data={analytics.business.wealthTrend.map((point) => ({
              label: formatShortMonth(fromIsoDate(point.month)),
              attraction: point.attraction * 1,
              core: point.core * 2,
              premium: point.premium * 3,
            }))}
          />
        ) : (
          <EmptyState
            title="No revenue reported"
            description="Report a month against an offer in the business module and the index appears here."
          />
        )}
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Funnel conversion" description="From the most recent snapshot.">
          <TableWrap>
            <table className={tableClass}>
              <caption className="sr-only">Funnel stages and conversion rates</caption>
              <thead>
                <tr>
                  <th className={thClass}>Stage</th>
                  <th className={thClass}>Count</th>
                  <th className={thClass}>From previous</th>
                  <th className={thClass}>Share of top</th>
                </tr>
              </thead>
              <tbody>
                {analytics.funnel.stages.map((stage) => (
                  <tr key={stage.key}>
                    <td className={tdClass}>{stage.label}</td>
                    <td className={`${tdClass} tabular-nums`}>{stage.count.toLocaleString()}</td>
                    <td className={`${tdClass} tabular-nums`}>
                      {stage.conversionFromPrevious === null ? "—" : `${stage.conversionFromPrevious}%`}
                    </td>
                    <td className={`${tdClass} tabular-nums`}>{stage.shareOfTop}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </Card>

        <Card title="Exports" description="Take the whole record with you.">
          <ExportBar />
        </Card>
      </div>
    </>
  );
}
