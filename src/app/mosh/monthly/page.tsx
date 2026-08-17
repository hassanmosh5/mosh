import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { requireMoshContext } from "@/lib/mosh/context";
import { getMonth, monthlyTrend } from "@/lib/mosh/services/monthly";
import {
  addMonths,
  formatMonth,
  formatShortMonth,
  fromIsoDate,
  monthStart,
  toIsoDate,
  today,
} from "@/lib/mosh/dates";
import { ScoreBarChart } from "@/components/mosh/charts";
import { Card, EmptyState, PageHeader, Stat, buttonClass } from "@/components/mosh/ui";
import { MonthlyReviewForm } from "./monthly-review";

export const dynamic = "force-dynamic";

export const metadata = { title: "Monthly review" };

export default async function MonthlyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const ctx = await requireMoshContext();
  const params = await searchParams;
  const raw = typeof params.month === "string" ? params.month : undefined;
  const valid = raw && /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : undefined;

  const anchor = monthStart(valid ? fromIsoDate(valid) : today());
  const iso = toIsoDate(anchor);

  const [review, trend] = await Promise.all([getMonth(ctx, anchor), monthlyTrend(ctx, 12)]);
  const isCurrent = iso === toIsoDate(monthStart(today()));

  return (
    <>
      <PageHeader
        eyebrow="Monthly review"
        title={formatMonth(anchor)}
        description="Five pillars, six questions. Thirty days of effort turned into something you can actually learn from."
        actions={
          <div className="flex items-center gap-2">
            <Link
              href={`/mosh/monthly?month=${toIsoDate(addMonths(anchor, -1))}`}
              className={buttonClass("secondary", "sm")}
            >
              <ChevronLeft size={14} aria-hidden />
              Previous
            </Link>
            {!isCurrent ? (
              <Link href="/mosh/monthly" className={buttonClass("secondary", "sm")}>
                This month
              </Link>
            ) : null}
            <Link
              href={`/mosh/monthly?month=${toIsoDate(addMonths(anchor, 1))}`}
              className={buttonClass("secondary", "sm")}
            >
              Next
              <ChevronRight size={14} aria-hidden />
            </Link>
          </div>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Growth score" value={`${review.growth}%`} tone="brand" hint="Derived" />
        <Stat
          label="Questions answered"
          value={`${review.answered}/${review.totalQuestions}`}
          hint="Reflection weight is 20%"
        />
        <Stat
          label="Weeks counted"
          value={review.weeklyMomentum.length}
          hint="Weekly entries inside this month"
        />
        <Stat
          label="Pillars scored"
          value={review.pillars.filter((pillar) => pillar.score > 0).length}
          hint="Out of five"
        />
      </div>

      <MonthlyReviewForm key={iso} review={review} month={iso} />

      <div className="mt-4">
        <Card title="Growth, twelve months" description="Months with no review are shown at zero.">
          {trend.some((point) => point.growth > 0) ? (
            <ScoreBarChart
              name="Growth"
              data={trend.map((point) => ({
                label: formatShortMonth(fromIsoDate(point.month)),
                value: point.growth,
              }))}
            />
          ) : (
            <EmptyState
              title="No monthly reviews yet"
              description="Complete this month's review and the chart starts here. A year of these is the most valuable document you will own."
            />
          )}
        </Card>
      </div>
    </>
  );
}
