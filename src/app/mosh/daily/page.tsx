import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { requireMoshContext } from "@/lib/mosh/context";
import { getDay, getStreak, listDays } from "@/lib/mosh/services/daily";
import { addDays, formatLongDate, formatShortDate, fromIsoDate, toIsoDate, today } from "@/lib/mosh/dates";
import { AlignmentTrendChart } from "@/components/mosh/charts";
import { Card, EmptyState, Stat, buttonClass } from "@/components/mosh/ui";
import { PageHeader } from "@/components/mosh/ui";
import { DailyTracker } from "./daily-tracker";

export const dynamic = "force-dynamic";

export const metadata = { title: "Daily rhythm" };

export default async function DailyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const ctx = await requireMoshContext();
  const params = await searchParams;
  const raw = typeof params.date === "string" ? params.date : undefined;

  const valid = raw && /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : undefined;
  const date = valid ?? toIsoDate(today());
  const anchor = fromIsoDate(date);

  const [entry, streak, history] = await Promise.all([
    getDay(ctx, date),
    getStreak(ctx),
    listDays(ctx, { from: addDays(anchor, -13), to: anchor }),
  ]);

  const previous = toIsoDate(addDays(anchor, -1));
  const next = toIsoDate(addDays(anchor, 1));
  const isToday = date === toIsoDate(today());

  return (
    <>
      <PageHeader
        eyebrow="Daily tracker"
        title={isToday ? "Today" : formatLongDate(anchor)}
        description="Seven habits, two vitals, three journals and a check-in across the planes. It takes four minutes and it is the whole foundation."
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/mosh/daily?date=${previous}`} className={buttonClass("secondary", "sm")}>
              <ChevronLeft size={14} aria-hidden />
              {formatShortDate(fromIsoDate(previous))}
            </Link>
            {!isToday ? (
              <Link href="/mosh/daily" className={buttonClass("secondary", "sm")}>
                Today
              </Link>
            ) : null}
            <Link href={`/mosh/daily?date=${next}`} className={buttonClass("secondary", "sm")}>
              {formatShortDate(fromIsoDate(next))}
              <ChevronRight size={14} aria-hidden />
            </Link>
          </div>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          label="Current streak"
          value={`${streak.current}d`}
          hint="Days at 60% of the rhythm or better"
          tone={streak.current > 0 ? "brand" : "neutral"}
        />
        <Stat label="Longest streak" value={`${streak.longest}d`} hint="Your own record" />
        <Stat label="Energy" value={entry.energy ?? "—"} hint="Out of 10" />
        <Stat label="Mood" value={entry.mood ?? "—"} hint="Out of 10" />
      </div>

      <DailyTracker key={date} entry={entry} date={date} />

      <div className="mt-4">
        <Card
          title="The last fourteen days"
          description="Alignment against the rhythm that produced it."
        >
          {history.length > 0 ? (
            <AlignmentTrendChart
              data={history.map((point) => ({
                label: formatShortDate(fromIsoDate(point.date)),
                alignment: point.alignment,
                completion: point.completion,
              }))}
            />
          ) : (
            <EmptyState
              title="Nothing recorded in this window"
              description="Save today and the line starts here."
            />
          )}
        </Card>
      </div>
    </>
  );
}
