import { requireMoshContext } from "@/lib/mosh/context";
import { gatherSignals, isAiConfigured, listSessions } from "@/lib/mosh/services/coach";
import { PageHeader, Stat } from "@/components/mosh/ui";
import { CoachConsole } from "./coach-console";

export const dynamic = "force-dynamic";

export const metadata = { title: "The Billionaire Self" };

export default async function CoachPage() {
  const ctx = await requireMoshContext();
  const [sessions, signals] = await Promise.all([listSessions(ctx, 10), gatherSignals(ctx)]);

  return (
    <>
      <PageHeader
        eyebrow="Self-coaching"
        title="The Billionaire Self"
        description="The voice of the person you are becoming. It works with seven patterns — limiting beliefs, trust, fear of loss, perfectionism, inferiority, procrastination and low drive — and it reasons only from numbers you have actually recorded."
      />

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          label="Streak"
          value={`${signals.streak}d`}
          tone={signals.streak > 0 ? "brand" : "neutral"}
        />
        <Stat label="Daily alignment" value={`${signals.dailyAlignment}%`} hint="Last 7 days" />
        <Stat
          label="Weakest plane"
          value={signals.weakestPlane ? `${signals.weakestPlane.score}%` : "—"}
          hint={signals.weakestPlane?.label ?? "No check-ins yet"}
          tone={signals.weakestPlane && signals.weakestPlane.score < 60 ? "warn" : "neutral"}
        />
        <Stat
          label="Open milestones"
          value={signals.openMilestones}
          hint="Across the 365-day plan"
        />
      </div>

      <CoachConsole history={sessions} aiEnabled={isAiConfigured()} />
    </>
  );
}
