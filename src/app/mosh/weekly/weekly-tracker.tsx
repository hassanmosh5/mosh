"use client";

import { useMemo } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { api, ApiError } from "@/lib/mosh/client";
import { useMoshUi } from "@/lib/mosh/store";
import { LIFE_AREAS } from "@/lib/mosh/constants";
import { labelForScore, scoreWeek, toneForScore } from "@/lib/mosh/scoring";
import type { WeeklyEntryView } from "@/lib/mosh/services/weekly";
import type { MoshLifeArea } from "@/generated/prisma/enums";
import {
  Card,
  Field,
  ScoreBar,
  buttonClass,
  inputClass,
  labelClass,
} from "@/components/mosh/ui";

/**
 * The weekly tracker.
 *
 * Goals are a field array so a week can carry as many or as few as it needs;
 * the momentum bar above recomputes as the completion sliders move, using the
 * same weighting the server applies on save.
 */

type GoalField = {
  id?: string;
  area: MoshLifeArea;
  goal: string;
  progress: string;
  completion: number;
};

type FormValues = {
  intention: string;
  review: string;
  goals: GoalField[];
};

export function WeeklyTracker({
  week,
  weekStart,
}: {
  week: WeeklyEntryView;
  weekStart: string;
}) {
  const router = useRouter();
  const toast = useMoshUi((state) => state.toast);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      intention: week.intention ?? "",
      review: week.review ?? "",
      goals: week.goals.map((goal) => ({
        id: goal.id,
        area: goal.area,
        goal: goal.goal,
        progress: goal.progress ?? "",
        completion: goal.completion,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "goals" });
  // `useWatch` rather than `watch()` so the component stays memoizable.
  const goals = useWatch({ control, name: "goals" });

  const momentum = useMemo(
    () =>
      scoreWeek({
        goals: (goals ?? []).map((goal) => ({
          area: goal.area,
          completion: Number(goal.completion) || 0,
        })),
        dailyAlignments: week.dailyAlignment === null ? [] : [week.dailyAlignment],
      }).score,
    [goals, week.dailyAlignment]
  );

  const onSubmit = handleSubmit(async (form) => {
    try {
      await api.post("/api/mosh/weekly", {
        weekStart,
        intention: form.intention,
        review: form.review,
        goals: form.goals.map((goal, index) => ({
          id: goal.id,
          area: goal.area,
          goal: goal.goal,
          progress: goal.progress,
          completion: Number(goal.completion) || 0,
          position: index,
        })),
      });
      toast("The week is saved.");
      router.refresh();
    } catch (error) {
      toast(
        error instanceof ApiError ? error.message : "That did not save. Please try again.",
        "error"
      );
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <ScoreBar
        label="Weekly Momentum Score"
        value={momentum}
        band={labelForScore(momentum)}
        description="60% goal completion across the five areas, 40% the days you actually lived."
        detail={`${week.daysRecorded}/7 days recorded${
          week.dailyAlignment === null ? "" : ` · ${week.dailyAlignment}% average alignment`
        }`}
        tone={toneForScore(momentum) === "neutral" ? "brand" : toneForScore(momentum)}
      />

      <Card title="This week" description="One sentence of intention. One of honest review at the end.">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Field label="Intention" htmlFor="intention">
            <textarea
              id="intention"
              rows={3}
              placeholder="What is this week actually for?"
              className={inputClass}
              {...register("intention")}
            />
          </Field>
          <Field label="Review" htmlFor="review">
            <textarea
              id="review"
              rows={3}
              placeholder="What happened, what did not, and why?"
              className={inputClass}
              {...register("review")}
            />
          </Field>
        </div>
      </Card>

      <Card
        title="Goals"
        description="Mental, spiritual, physical, business, impact. Five real goals beat fifteen hopeful ones."
        actions={
          <button
            type="button"
            onClick={() =>
              append({ area: "MENTAL", goal: "", progress: "", completion: 0 })
            }
            className={buttonClass("secondary", "sm")}
          >
            <Plus size={14} aria-hidden />
            Add goal
          </button>
        }
      >
        {fields.length === 0 ? (
          <div className="rounded-xl border border-dashed border-mosh-line-strong px-4 py-8 text-center">
            <p className="text-sm text-mosh-ink-muted">
              No goals yet for this week. Add one per area you are working on.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {LIFE_AREAS.map((area) => (
                <button
                  key={area.area}
                  type="button"
                  onClick={() =>
                    append({ area: area.area, goal: "", progress: "", completion: 0 })
                  }
                  className={buttonClass("secondary", "sm")}
                >
                  <Plus size={13} aria-hidden />
                  {area.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {fields.map((field, index) => {
              const completion = Number(goals?.[index]?.completion ?? 0);
              return (
                <li
                  key={field.id}
                  className="rounded-xl border border-mosh-line p-4"
                >
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-[10rem_1fr_auto]">
                    <div>
                      <label className={labelClass} htmlFor={`area-${field.id}`}>
                        Area
                      </label>
                      <select
                        id={`area-${field.id}`}
                        className={`${inputClass} mt-1.5`}
                        {...register(`goals.${index}.area` as const)}
                      >
                        {LIFE_AREAS.map((area) => (
                          <option key={area.area} value={area.area}>
                            {area.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass} htmlFor={`goal-${field.id}`}>
                        Goal
                      </label>
                      <input
                        id={`goal-${field.id}`}
                        className={`${inputClass} mt-1.5`}
                        placeholder="What will be true by Sunday?"
                        {...register(`goals.${index}.goal` as const, { required: true })}
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        aria-label="Remove goal"
                        className={buttonClass("danger", "sm")}
                      >
                        <Trash2 size={14} aria-hidden />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <label className={labelClass} htmlFor={`progress-${field.id}`}>
                        Progress
                      </label>
                      <input
                        id={`progress-${field.id}`}
                        className={`${inputClass} mt-1.5`}
                        placeholder="Where it actually stands"
                        {...register(`goals.${index}.progress` as const)}
                      />
                    </div>
                    <div>
                      <div className="flex items-baseline justify-between">
                        <label className={labelClass} htmlFor={`completion-${field.id}`}>
                          Completion
                        </label>
                        <span className="text-sm font-medium tabular-nums text-mosh-ink">
                          {completion}%
                        </span>
                      </div>
                      <input
                        id={`completion-${field.id}`}
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={completion}
                        onChange={(event) =>
                          setValue(`goals.${index}.completion`, Number(event.target.value), {
                            shouldDirty: true,
                          })
                        }
                        className="mt-2.5 w-full accent-[var(--mosh-brand)]"
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-mosh-line bg-mosh-surface/95 px-4 py-3 shadow-[var(--mosh-shadow)] backdrop-blur">
        <p className="text-xs text-mosh-ink-muted">
          {isDirty ? "Unsaved changes." : "Everything here is saved."}
        </p>
        <button type="submit" disabled={isSubmitting} className={buttonClass("primary")}>
          {isSubmitting ? (
            <Loader2 size={15} className="animate-spin" aria-hidden />
          ) : (
            <Save size={15} aria-hidden />
          )}
          Save the week
        </button>
      </div>
    </form>
  );
}
