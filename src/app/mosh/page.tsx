import Link from "next/link";
import { ArrowRight, Flame, Moon, Sparkles } from "lucide-react";
import { requireMoshContext } from "@/lib/mosh/context";
import { getDashboard } from "@/lib/mosh/services/dashboard";
import { BRAND } from "@/lib/mosh/constants";
import { AlignmentTrendChart } from "@/components/mosh/charts";
import {
  Badge,
  Card,
  EmptyState,
  Grid,
  Meter,
  PageHeader,
  ScoreBar,
  Stat,
  buttonClass,
  cx,
} from "@/components/mosh/ui";

export const dynamic = "force-dynamic";

export const metadata = { title: "Dashboard" };

export default async function MoshDashboardPage() {
  const ctx = await requireMoshContext();
  const dashboard = await getDashboard(ctx);

  const habitsDone = dashboard.todayHabits.filter((habit) => habit.done).length;

  return (
    <>
      <PageHeader
        eyebrow={`${BRAND.owner} · ${ctx.title}`}
        title={`Good to see you, ${dashboard.greetingName}.`}
        description={`${dashboard.philosophy} Everything below is computed from what you actually recorded — nothing here is estimated.`}
        actions={
          <Link href="/mosh/daily" className={buttonClass("primary")}>
            Open today&apos;s tracker
            <ArrowRight size={15} aria-hidden />
          </Link>
        }
      />

      <section aria-labelledby="scores-heading" className="mb-8">
        <h2 id="scores-heading" className="sr-only">
          Alignment scores
        </h2>
        <Grid cols={4}>
          {dashboard.bars.map((bar) => (
            <ScoreBar
              key={bar.key}
              label={bar.label}
              value={bar.value}
              description={bar.description}
              detail={bar.detail}
              band={bar.band}
              tone={bar.tone === "neutral" ? "brand" : bar.tone}
              href={bar.href}
            />
          ))}
        </Grid>
      </section>

      <section aria-labelledby="meters-heading" className="mb-8">
        <h2
          id="meters-heading"
          className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-mosh-ink-subtle"
        >
          Alignment meters
        </h2>
        <Grid cols={4}>
          {dashboard.meters.map((meter) => (
            <Meter
              key={meter.label}
              label={meter.label}
              value={meter.value}
              tone={meter.tone === "neutral" ? "brand" : meter.tone}
              caption={
                meter.samples === 0 && meter.plane !== "ANNUAL"
                  ? "No check-ins yet"
                  : `${meter.band} · ${meter.tagline}`
              }
            />
          ))}
        </Grid>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="Fourteen days of alignment"
          description="The daily score against the share of the seven-habit rhythm that produced it."
        >
          {dashboard.trend.length > 0 ? (
            <AlignmentTrendChart data={dashboard.trend} />
          ) : (
            <EmptyState
              title="No days recorded yet"
              description="Fill in today's tracker and this chart starts drawing itself. Two weeks of entries is enough to see a pattern."
              action={
                <Link href="/mosh/daily" className={buttonClass("primary", "sm")}>
                  Start today
                </Link>
              }
            />
          )}
        </Card>

        <div className="space-y-4">
          <Card title="Today's rhythm" description={`${habitsDone} of ${dashboard.todayHabits.length} complete.`}>
            <ul className="space-y-2">
              {dashboard.todayHabits.map((habit) => (
                <li key={habit.key} className="flex items-center gap-2.5 text-sm">
                  <span
                    aria-hidden
                    className={cx(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px]",
                      habit.done
                        ? "border-mosh-brand bg-mosh-brand text-mosh-brand-ink"
                        : "border-mosh-line-strong"
                    )}
                  >
                    {habit.done ? "✓" : ""}
                  </span>
                  <span className={habit.done ? "text-mosh-ink" : "text-mosh-ink-muted"}>
                    {habit.label}
                  </span>
                  <span className="sr-only">{habit.done ? "complete" : "not complete"}</span>
                </li>
              ))}
            </ul>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Stat
              label="Current streak"
              value={`${dashboard.streak.current}d`}
              hint={`Longest ${dashboard.streak.longest} days`}
              tone={dashboard.streak.current > 0 ? "brand" : "neutral"}
            />
            <Stat
              label="Days recorded"
              value={dashboard.streak.qualifyingDays}
              hint="At 60% of the rhythm or better"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card
          title="The 50-Day Eclipse"
          description="One action a day, five phases, no negotiation."
          actions={<Badge tone="brand">{dashboard.eclipse.progress}% done</Badge>}
        >
          {dashboard.eclipse.day ? (
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-mosh-ink-subtle">
                <Moon size={14} aria-hidden />
                Day {dashboard.eclipse.day} of 50
              </p>
              <p className="text-sm font-semibold text-mosh-ink">{dashboard.eclipse.focus}</p>
              <p className="text-sm leading-relaxed text-mosh-ink-muted">
                {dashboard.eclipse.action}
              </p>
              <Link
                href="/mosh/eclipse"
                className="inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-mosh-brand"
              >
                Open the strategy
                <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
          ) : (
            <EmptyState
              title="The clock has not started"
              description="Set a start date and the fifty days lay themselves out across your calendar, one action at a time."
              action={
                <Link href="/mosh/eclipse" className={buttonClass("primary", "sm")}>
                  Start the 50 days
                </Link>
              }
            />
          )}
        </Card>

        <Card
          title="What the numbers are telling you"
          description="Derived from your records — the same signals The Billionaire Self reasons about."
        >
          {dashboard.recommendations.length > 0 ? (
            <ul className="space-y-3">
              {dashboard.recommendations.map((recommendation) => (
                <li key={recommendation} className="flex gap-2.5 text-sm leading-relaxed text-mosh-ink-muted">
                  <Flame size={15} aria-hidden className="mt-0.5 shrink-0 text-mosh-accent" />
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm leading-relaxed text-mosh-ink-muted">
              Nothing to correct yet. Record a few days and the system will start telling you where
              the drift is.
            </p>
          )}
          <Link
            href="/mosh/coach"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-mosh-brand"
          >
            <Sparkles size={14} aria-hidden />
            Talk to The Billionaire Self
          </Link>
        </Card>
      </div>
    </>
  );
}
