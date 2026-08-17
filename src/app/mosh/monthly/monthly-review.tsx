"use client";

import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { api, ApiError } from "@/lib/mosh/client";
import { useMoshUi } from "@/lib/mosh/store";
import { LIFE_AREAS, MONTHLY_QUESTIONS } from "@/lib/mosh/constants";
import { labelForScore, scoreMonth, toneForScore } from "@/lib/mosh/scoring";
import type { MonthlyReviewView } from "@/lib/mosh/services/monthly";
import type { MoshLifeArea } from "@/generated/prisma/enums";
import { Card, Field, ScoreBar, buttonClass, inputClass, labelClass } from "@/components/mosh/ui";

/**
 * The monthly review.
 *
 * Five pillars and six questions. The growth score counts the questions as
 * well as the results — which is the point: a month you did not examine did
 * not fully happen.
 */

type PillarField = {
  area: MoshLifeArea;
  goals: string;
  achievements: string;
  lessons: string;
  score: number;
};

type FormValues = Record<string, unknown> & {
  pillars: PillarField[];
};

export function MonthlyReviewForm({
  review,
  month,
}: {
  review: MonthlyReviewView;
  month: string;
}) {
  const router = useRouter();
  const toast = useMoshUi((state) => state.toast);

  const defaults: FormValues = {
    pillars: LIFE_AREAS.map(({ area }) => {
      const stored = review.pillars.find((pillar) => pillar.area === area);
      return {
        area,
        goals: stored?.goals ?? "",
        achievements: stored?.achievements ?? "",
        lessons: stored?.lessons ?? "",
        score: stored?.score ?? 0,
      };
    }),
    ...Object.fromEntries(
      MONTHLY_QUESTIONS.map((question) => [question.key, review.answers[question.key] ?? ""])
    ),
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, isDirty },
  } = useForm<FormValues>({ defaultValues: defaults });

  // `useWatch` rather than `watch()` so the component stays memoizable.
  const values = useWatch({ control }) as FormValues;

  const growth = useMemo(() => {
    const pillars = (values.pillars ?? []) as PillarField[];
    const answered = MONTHLY_QUESTIONS.filter((question) => {
      const value = values[question.key];
      return typeof value === "string" && value.trim().length > 0;
    }).length;

    return scoreMonth({
      pillarScores: pillars.filter((pillar) => pillar.score > 0).map((pillar) => Number(pillar.score)),
      weeklyMomentum: review.weeklyMomentum,
      answeredQuestions: answered,
      totalQuestions: MONTHLY_QUESTIONS.length,
    }).score;
  }, [values, review.weeklyMomentum]);

  const onSubmit = handleSubmit(async (form) => {
    try {
      await api.post("/api/mosh/monthly", {
        month,
        ...Object.fromEntries(
          MONTHLY_QUESTIONS.map((question) => [question.key, form[question.key] ?? ""])
        ),
        pillars: (form.pillars as PillarField[]).map((pillar) => ({
          area: pillar.area,
          goals: pillar.goals,
          achievements: pillar.achievements,
          lessons: pillar.lessons,
          score: Number(pillar.score) || 0,
        })),
      });
      toast("The month is reviewed.");
      router.refresh();
    } catch (error) {
      toast(
        error instanceof ApiError ? error.message : "That did not save. Please try again.",
        "error"
      );
    }
  });

  const pillars = (values.pillars ?? []) as PillarField[];

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <ScoreBar
        label="Monthly Growth Score"
        value={growth}
        band={labelForScore(growth)}
        description="50% pillar progress, 30% weekly momentum, 20% the honesty of this review."
        detail={`${review.weeklyMomentum.length} week${review.weeklyMomentum.length === 1 ? "" : "s"} of momentum counted`}
        tone={toneForScore(growth) === "neutral" ? "brand" : toneForScore(growth)}
      />

      <Card
        title="The five pillars"
        description="Goals set, what was achieved, and what it taught you. Score each pillar honestly."
      >
        <div className="space-y-4">
          {LIFE_AREAS.map((area, index) => {
            const score = Number(pillars[index]?.score ?? 0);
            return (
              <div key={area.area} className="rounded-xl border border-mosh-line p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-sm font-semibold text-mosh-ink">{area.label}</h3>
                  <p className="text-xs text-mosh-ink-subtle">{area.prompt}</p>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
                  <Field label="Goals" htmlFor={`goals-${area.area}`}>
                    <textarea
                      id={`goals-${area.area}`}
                      rows={3}
                      className={inputClass}
                      {...register(`pillars.${index}.goals` as const)}
                    />
                  </Field>
                  <Field label="Achievements" htmlFor={`achievements-${area.area}`}>
                    <textarea
                      id={`achievements-${area.area}`}
                      rows={3}
                      className={inputClass}
                      {...register(`pillars.${index}.achievements` as const)}
                    />
                  </Field>
                  <Field label="Lessons" htmlFor={`lessons-${area.area}`}>
                    <textarea
                      id={`lessons-${area.area}`}
                      rows={3}
                      className={inputClass}
                      {...register(`pillars.${index}.lessons` as const)}
                    />
                  </Field>
                </div>

                <div className="mt-3">
                  <div className="flex items-baseline justify-between">
                    <label className={labelClass} htmlFor={`score-${area.area}`}>
                      {area.label} score
                    </label>
                    <span className="text-sm font-medium tabular-nums text-mosh-ink">{score}%</span>
                  </div>
                  <input
                    id={`score-${area.area}`}
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={score}
                    onChange={(event) =>
                      setValue(`pillars.${index}.score`, Number(event.target.value), {
                        shouldDirty: true,
                      })
                    }
                    className="mt-2 w-full accent-[var(--mosh-brand)]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card
        title="Six questions"
        description="Answer them in full sentences. This is the part that compounds."
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {MONTHLY_QUESTIONS.map((question) => (
            <Field key={question.key} label={question.question} htmlFor={question.key}>
              <textarea
                id={question.key}
                rows={3}
                className={inputClass}
                {...register(question.key)}
              />
            </Field>
          ))}
        </div>
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
          Save the review
        </button>
      </div>
    </form>
  );
}
