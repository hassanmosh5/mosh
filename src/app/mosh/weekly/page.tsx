import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { requireMoshContext } from "@/lib/mosh/context";
import { getWeek, weeklyTrend } from "@/lib/mosh/services/weekly";
import { addDays, formatShortDate, formatWeek, fromIsoDate, toIsoDate, today, weekStart } from "@/lib/mosh/dates";
import { ScoreBarChart } from "@/components/mosh/charts";
import { Card, EmptyState, PageHeader, Stat, buttonClass } from "@/components/mosh/ui";
import { WeeklyTracker } from "./weekly-tracker";

export const dynamic = "force-dynamic";

export const metadata = { title: "Weekly momentum" };

export default async function WeeklyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const ctx = await requireMoshContext();
  const params = await searchParams;
  const raw = typeof params.week === "string" ? params.week : undefined;
  const valid = raw && /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : undefined;

  const anchor = weekStart(valid ? fromIsoDate(valid) : today());
  const iso = toIsoDate(anchor);

  const [week, trend] = await Promise.all([getWeek(ctx, anchor), weeklyTrend(ctx, 12)]);

  const isCurrent = iso === toIsoDate(weekStart(today()));

  return (
    <>
      <PageHeader
        eyebrow="Weekly tracker"
        title={formatWeek(anchor)}
        description="Five areas, one honest number each. Momentum is what turns a good week into a good quarter."
        actions={
          <div className="flex items-center gap-2">
            <Link
              href={`/mosh/weekly?week=${toIsoDate(addDays(anchor, -7))}`}
              className={buttonClass("secondary", "sm")}
            >
              <ChevronLeft size={14} aria-hidden />
              Previous
            </Link>
            {!isCurrent ? (
              <Link href="/mosh/weekly" className={buttonClass("secondary", "sm")}>
                This week
              </Link>
            ) : null}
            <Link
              href={`/mosh/weekly?week=${toIsoDate(addDays(anchor, 7))}`}
              className={buttonClass("secondary", "sm")}
            >
              Next
              <ChevronRight size={14} aria-hidden />
            </Link>
          </div>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {week.byArea.map((area) => (
          <Stat
            key={area.area}
            label={area.label}
            value={area.completion === null ? "—" : `${area.completion}%`}
            hint={`${area.goals} goal${area.goals === 1 ? "" : "s"}`}
            tone={area.completion !== null && area.completion >= 75 ? "brand" : "neutral"}
          />
        ))}
      </div>

      <WeeklyTracker key={iso} week={week} weekStart={iso} />

      <div className="mt-4">
        <Card title="Momentum, twelve weeks" description="Weeks with no entry are shown at zero — the gap is information too.">
          {trend.some((point) => point.momentum > 0) ? (
            <ScoreBarChart
              name="Momentum"
              data={trend.map((point) => ({
                label: formatShortDate(fromIsoDate(point.weekStart)),
                value: point.momentum,
              }))}
            />
          ) : (
            <EmptyState
              title="No momentum recorded yet"
              description="Set this week's goals and move the sliders as the week progresses. The bar chart fills in from there."
            />
          )}
        </Card>
      </div>
    </>
  );
}
