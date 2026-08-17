"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Check, Loader2, Plus, Save, Target, Trash2 } from "lucide-react";
import { api, ApiError } from "@/lib/mosh/client";
import { useMoshUi } from "@/lib/mosh/store";
import type { YearPlanView } from "@/lib/mosh/services/plan";
import { labelForScore } from "@/lib/mosh/scoring";
import {
  Badge,
  Card,
  Field,
  ScoreBar,
  buttonClass,
  cx,
  inputClass,
  labelClass,
} from "@/components/mosh/ui";

/**
 * The 365-day master plan.
 *
 * The four quarters arrive pre-written — Root and Routine, Visibility and
 * Credibility, Structure and Scale, Legacy and Leverage — and everything on
 * them is editable. Quarter progress is half what you claim and half what the
 * milestones prove, so the number cannot be talked upward.
 */

export function PlanBoard({ plan }: { plan: YearPlanView }) {
  const router = useRouter();
  const toast = useMoshUi((state) => state.toast);
  const [busy, setBusy] = useState<string | null>(null);

  const vision = useForm({
    defaultValues: {
      theme: plan.theme ?? "",
      vision: plan.vision ?? "",
      northStar: plan.northStar ?? "",
    },
  });

  const withErrors = async (key: string, work: () => Promise<unknown>, success: string) => {
    setBusy(key);
    try {
      await work();
      toast(success);
      router.refresh();
    } catch (error) {
      toast(
        error instanceof ApiError ? error.message : "That did not save. Please try again.",
        "error"
      );
    } finally {
      setBusy(null);
    }
  };

  const saveVision = vision.handleSubmit((form) =>
    withErrors(
      "vision",
      () => api.put("/api/mosh/plan", { year: plan.year, ...form }),
      "The year is set."
    )
  );

  return (
    <div className="space-y-4">
      <ScoreBar
        label="Annual Alignment"
        value={plan.annualAlignment}
        band={labelForScore(plan.annualAlignment)}
        description="60% quarter progress, 40% milestones actually completed."
        detail={`${plan.milestonesDone} of ${plan.milestonesTotal} milestones done`}
      />

      <Card
        title={`${plan.year} — the year in one place`}
        description="A theme you can say out loud, a vision you would recognise if you arrived at it, and the one number that matters."
      >
        <form onSubmit={saveVision} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Field label="Theme" htmlFor="theme">
              <input
                id="theme"
                className={inputClass}
                placeholder="Structure Creates Freedom"
                {...vision.register("theme")}
              />
            </Field>
            <Field label="North star" htmlFor="northStar">
              <input
                id="northStar"
                className={inputClass}
                placeholder="The single number or outcome this year is judged by"
                {...vision.register("northStar")}
              />
            </Field>
          </div>
          <Field label="Vision" htmlFor="vision">
            <textarea
              id="vision"
              rows={3}
              className={inputClass}
              placeholder="Where you will be standing in twelve months, described as if it already happened."
              {...vision.register("vision")}
            />
          </Field>
          <div className="flex justify-end">
            <button type="submit" className={buttonClass("primary", "sm")} disabled={busy === "vision"}>
              {busy === "vision" ? (
                <Loader2 size={14} className="animate-spin" aria-hidden />
              ) : (
                <Save size={14} aria-hidden />
              )}
              Save the year
            </button>
          </div>
        </form>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {plan.quarters.map((quarter) => (
          <QuarterCard
            key={quarter.id}
            quarter={quarter}
            busy={busy}
            onWork={withErrors}
          />
        ))}
      </div>
    </div>
  );
}

type QuarterProps = {
  quarter: YearPlanView["quarters"][number];
  busy: string | null;
  onWork: (key: string, work: () => Promise<unknown>, success: string) => Promise<void>;
};

function QuarterCard({ quarter, busy, onWork }: QuarterProps) {
  const [progress, setProgress] = useState(quarter.progress);
  const [newMilestone, setNewMilestone] = useState("");

  const form = useForm({
    defaultValues: {
      title: quarter.title,
      goal: quarter.goal,
      focus: quarter.focus.join(", "),
      revenueTarget: quarter.revenueTarget ?? "",
      clientTarget: quarter.clientTarget ?? "",
    },
  });

  const save = form.handleSubmit((values) =>
    onWork(
      `quarter-${quarter.id}`,
      () =>
        api.patch("/api/mosh/plan/quarters", {
          id: quarter.id,
          title: values.title,
          goal: values.goal,
          focus: values.focus
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          progress,
          revenueTarget: values.revenueTarget === "" ? null : Number(values.revenueTarget),
          clientTarget: values.clientTarget === "" ? null : Number(values.clientTarget),
        }),
      `Q${quarter.quarter} updated.`
    )
  );

  return (
    <Card
      title={`Q${quarter.quarter} — ${quarter.title}`}
      description={`Starts ${quarter.startsOn}`}
      actions={
        <div className="flex items-center gap-2">
          {quarter.isCurrent ? <Badge tone="brand">Current</Badge> : null}
          <Badge>{quarter.effectiveProgress}%</Badge>
        </div>
      }
      className={cx(quarter.isCurrent && "border-mosh-brand/50")}
    >
      <div className="mb-4 flex flex-wrap gap-1.5">
        {quarter.focus.map((item) => (
          <span
            key={item}
            className="rounded-full bg-mosh-surface-2 px-2.5 py-1 text-xs text-mosh-ink-muted"
          >
            {item}
          </span>
        ))}
      </div>

      <form onSubmit={save} className="space-y-3">
        <Field label="Quarter title" htmlFor={`title-${quarter.id}`}>
          <input id={`title-${quarter.id}`} className={inputClass} {...form.register("title")} />
        </Field>
        <Field label="Goal" htmlFor={`goal-${quarter.id}`}>
          <textarea
            id={`goal-${quarter.id}`}
            rows={2}
            className={inputClass}
            {...form.register("goal")}
          />
        </Field>
        <Field label="Focus (comma separated)" htmlFor={`focus-${quarter.id}`}>
          <input id={`focus-${quarter.id}`} className={inputClass} {...form.register("focus")} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Revenue target" htmlFor={`revenue-${quarter.id}`}>
            <input
              id={`revenue-${quarter.id}`}
              type="number"
              min={0}
              step="0.01"
              className={inputClass}
              {...form.register("revenueTarget")}
            />
          </Field>
          <Field label="Client target" htmlFor={`clients-${quarter.id}`}>
            <input
              id={`clients-${quarter.id}`}
              type="number"
              min={0}
              className={inputClass}
              {...form.register("clientTarget")}
            />
          </Field>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label className={labelClass} htmlFor={`progress-${quarter.id}`}>
              Self-reported progress
            </label>
            <span className="text-sm font-medium tabular-nums text-mosh-ink">{progress}%</span>
          </div>
          <input
            id={`progress-${quarter.id}`}
            type="range"
            min={0}
            max={100}
            step={5}
            value={progress}
            onChange={(event) => setProgress(Number(event.target.value))}
            className="mt-2 w-full accent-[var(--mosh-brand)]"
          />
          <p className="mt-1 text-xs text-mosh-ink-subtle">
            Shown progress ({quarter.effectiveProgress}%) is the average of this and the milestones
            completed.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className={buttonClass("secondary", "sm")}
            disabled={busy === `quarter-${quarter.id}`}
          >
            {busy === `quarter-${quarter.id}` ? (
              <Loader2 size={14} className="animate-spin" aria-hidden />
            ) : (
              <Save size={14} aria-hidden />
            )}
            Save quarter
          </button>
        </div>
      </form>

      <div className="mt-5 border-t border-mosh-line pt-4">
        <h4 className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-mosh-ink-subtle">
          <Target size={13} aria-hidden />
          Monthly milestones
        </h4>

        <ul className="space-y-2">
          {quarter.milestones.map((milestone) => (
            <li key={milestone.id} className="flex items-start gap-2.5">
              <button
                type="button"
                aria-label={milestone.done ? "Mark as not done" : "Mark as done"}
                aria-pressed={milestone.done}
                onClick={() =>
                  onWork(
                    `milestone-${milestone.id}`,
                    () =>
                      api.patch("/api/mosh/plan/milestones", {
                        id: milestone.id,
                        done: !milestone.done,
                      }),
                    milestone.done ? "Milestone reopened." : "Milestone complete."
                  )
                }
                className={cx(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition",
                  milestone.done
                    ? "border-mosh-brand bg-mosh-brand text-mosh-brand-ink"
                    : "border-mosh-line-strong hover:border-mosh-brand"
                )}
              >
                {milestone.done ? <Check size={13} strokeWidth={3} aria-hidden /> : null}
              </button>

              <div className="min-w-0 flex-1">
                <p
                  className={cx(
                    "text-sm",
                    milestone.done ? "text-mosh-ink-subtle line-through" : "text-mosh-ink"
                  )}
                >
                  Month {milestone.monthOffset} · {milestone.title}
                </p>
                {milestone.detail ? (
                  <p className="text-xs leading-relaxed text-mosh-ink-muted">{milestone.detail}</p>
                ) : null}
              </div>

              <button
                type="button"
                aria-label="Delete milestone"
                onClick={() =>
                  onWork(
                    `delete-${milestone.id}`,
                    () => api.delete(`/api/mosh/plan/milestones?id=${milestone.id}`),
                    "Milestone removed."
                  )
                }
                className="text-mosh-ink-subtle transition hover:text-mosh-bad"
              >
                <Trash2 size={14} aria-hidden />
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex gap-2">
          <input
            value={newMilestone}
            onChange={(event) => setNewMilestone(event.target.value)}
            placeholder="Add a milestone"
            aria-label={`Add a milestone to quarter ${quarter.quarter}`}
            className={inputClass}
          />
          <button
            type="button"
            disabled={newMilestone.trim().length === 0 || busy === `add-${quarter.id}`}
            onClick={async () => {
              const title = newMilestone.trim();
              setNewMilestone("");
              await onWork(
                `add-${quarter.id}`,
                () =>
                  api.post("/api/mosh/plan/milestones", {
                    quarterId: quarter.id,
                    monthOffset: Math.min(3, quarter.milestones.length + 1),
                    title,
                  }),
                "Milestone added."
              );
            }}
            className={buttonClass("secondary", "sm")}
          >
            <Plus size={14} aria-hidden />
            Add
          </button>
        </div>
      </div>
    </Card>
  );
}
