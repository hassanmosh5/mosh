import { requireMoshContext } from "@/lib/mosh/context";
import { getEclipse } from "@/lib/mosh/services/eclipse";
import { PageHeader, ScoreBar, Stat } from "@/components/mosh/ui";
import { labelForScore } from "@/lib/mosh/scoring";
import { EclipseTimeline } from "./eclipse-timeline";

export const dynamic = "force-dynamic";

export const metadata = { title: "50-Day Eclipse" };

export default async function EclipsePage() {
  const ctx = await requireMoshContext();
  const eclipse = await getEclipse(ctx);

  const currentPhase = eclipse.phases.find((phase) => phase.isCurrent);

  return (
    <>
      <PageHeader
        eyebrow="50-Day Eclipse Growth Strategy"
        title="Fifty days, five phases, one action a day"
        description="Foundation in Flow. Core Offer Birth. Visibility Expansion. Money Model Architecture. Magnetic Authority. Nothing here takes more than a day — that is the design."
      />

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <ScoreBar
            label="Eclipse progress"
            value={eclipse.progress}
            band={labelForScore(eclipse.progress)}
            description="Actions completed across all fifty days."
            detail={`${eclipse.done} of ${eclipse.total} days`}
          />
        </div>
        <Stat
          label="Current day"
          value={eclipse.currentDay ?? "—"}
          hint={eclipse.startDate ? `Started ${eclipse.startDate}` : "Not started"}
          tone={eclipse.currentDay ? "brand" : "neutral"}
        />
        <Stat
          label="Current phase"
          value={currentPhase ? `Phase ${currentPhase.number}` : "—"}
          hint={currentPhase?.label ?? "Set a start date to begin"}
        />
      </div>

      <EclipseTimeline eclipse={eclipse} />
    </>
  );
}
