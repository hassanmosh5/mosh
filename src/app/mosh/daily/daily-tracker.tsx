"use client";

import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Check, Loader2, Save } from "lucide-react";
import { api, ApiError } from "@/lib/mosh/client";
import { useMoshUi } from "@/lib/mosh/store";
import { MOSH_HABITS, MOSH_PLANES, type HabitKey } from "@/lib/mosh/constants";
import { habitCompletion, labelForScore, scoreDay, scorePlanesForDay, toneForScore } from "@/lib/mosh/scoring";
import type { DailyEntryView } from "@/lib/mosh/services/daily";
import {
  Card,
  Field,
  Grid,
  Meter,
  ScoreBar,
  buttonClass,
  cx,
  inputClass,
} from "@/components/mosh/ui";

/**
 * The daily tracker.
 *
 * The scores at the top are recomputed in the browser from the same pure
 * functions the server uses, so the number moves the instant a box is ticked —
 * and then the server recomputes it on save. The client is a preview of the
 * truth, never the source of it.
 */

type FormValues = {
  habits: Record<HabitKey, boolean>;
  gratitude: string;
  wins: string;
  reflection: string;
  energy: number | "";
  mood: number | "";
  checkins: Record<string, number | "">;
};

function toFormValues(entry: DailyEntryView): FormValues {
  return {
    habits: { ...entry.habits },
    gratitude: entry.gratitude ?? "",
    wins: entry.wins ?? "",
    reflection: entry.reflection ?? "",
    energy: entry.energy ?? "",
    mood: entry.mood ?? "",
    checkins: Object.fromEntries(
      MOSH_PLANES.flatMap((plane) =>
        plane.attributes.map((attribute) => [attribute.slug, entry.checkins[attribute.slug] ?? ""])
      )
    ),
  };
}

export function DailyTracker({ entry, date }: { entry: DailyEntryView; date: string }) {
  const router = useRouter();
  const toast = useMoshUi((state) => state.toast);
  const [saved, setSaved] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, isDirty },
  } = useForm<FormValues>({ defaultValues: toFormValues(entry) });

  // `useWatch` rather than `watch()` so the component stays memoizable.
  const values = useWatch({ control }) as FormValues;

  // Live preview of the day's scores, computed with the server's own engine.
  const preview = useMemo(() => {
    const checkins = Object.fromEntries(
      Object.entries(values.checkins ?? {})
        .filter(([, score]) => score !== "" && score !== null)
        .map(([slug, score]) => [slug, Number(score)])
    );
    const input = {
      habits: values.habits,
      energy: values.energy === "" ? null : Number(values.energy),
      mood: values.mood === "" ? null : Number(values.mood),
      checkins,
    };
    return {
      completion: habitCompletion(values.habits),
      alignment: scoreDay(input).score,
      planes: scorePlanesForDay(input),
    };
  }, [values]);

  const onSubmit = handleSubmit(async (form) => {
    try {
      const checkins = Object.fromEntries(
        Object.entries(form.checkins).map(([slug, score]) => [
          slug,
          score === "" ? null : Number(score),
        ])
      );

      await api.post("/api/mosh/daily", {
        date,
        ...form.habits,
        gratitude: form.gratitude,
        wins: form.wins,
        reflection: form.reflection,
        energy: form.energy === "" ? null : Number(form.energy),
        mood: form.mood === "" ? null : Number(form.mood),
        checkins,
      });

      setSaved(true);
      toast("Today is recorded.");
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
      <Grid cols={2}>
        <ScoreBar
          label="Daily Alignment Score"
          value={preview.alignment}
          band={labelForScore(preview.alignment)}
          description="Rhythm, plane check-in, energy and mood."
          tone={toneForScore(preview.alignment) === "neutral" ? "brand" : toneForScore(preview.alignment)}
        />
        <ScoreBar
          label="Rhythm completion"
          value={preview.completion}
          band={`${MOSH_HABITS.filter((habit) => values.habits[habit.key]).length} of ${MOSH_HABITS.length} habits`}
          description="The seven non-negotiables."
          tone="brand"
        />
      </Grid>

      <Card
        title="The seven non-negotiables"
        description="Tick what actually happened. Honesty is the whole mechanism."
      >
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {MOSH_HABITS.map((habit) => {
            const checked = values.habits[habit.key];
            return (
              <li key={habit.key}>
                <label
                  className={cx(
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition",
                    checked
                      ? "border-mosh-brand bg-mosh-brand-soft/60"
                      : "border-mosh-line hover:border-mosh-line-strong"
                  )}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={(event) =>
                      setValue(`habits.${habit.key}`, event.target.checked, { shouldDirty: true })
                    }
                  />
                  <span
                    aria-hidden
                    className={cx(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition",
                      checked
                        ? "border-mosh-brand bg-mosh-brand text-mosh-brand-ink"
                        : "border-mosh-line-strong"
                    )}
                  >
                    {checked ? <Check size={13} strokeWidth={3} /> : null}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-mosh-ink">{habit.label}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-mosh-ink-muted">
                      {habit.description}
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Energy and mood" description="The body's own report, 1 to 10." className="lg:col-span-1">
          <div className="space-y-5">
            <RatingRow
              label="Energy"
              value={values.energy}
              onChange={(next) => setValue("energy", next, { shouldDirty: true })}
            />
            <RatingRow
              label="Mood"
              value={values.mood}
              onChange={(next) => setValue("mood", next, { shouldDirty: true })}
            />
          </div>
        </Card>

        <Card title="Gratitude, wins, reflection" className="lg:col-span-2">
          <div className="space-y-4">
            <Field label="Gratitude journal" htmlFor="gratitude">
              <textarea
                id="gratitude"
                rows={2}
                placeholder="Three things that were already yours today."
                className={inputClass}
                {...register("gratitude")}
              />
            </Field>
            <Field label="Daily wins" htmlFor="wins">
              <textarea
                id="wins"
                rows={2}
                placeholder="What moved? However small."
                className={inputClass}
                {...register("wins")}
              />
            </Field>
            <Field label="Daily reflection" htmlFor="reflection">
              <textarea
                id="reflection"
                rows={3}
                placeholder="What did today teach you, and what will tomorrow do differently?"
                className={inputClass}
                {...register("reflection")}
              />
            </Field>
          </div>
        </Card>
      </div>

      <Card
        title="Plane check-in"
        description="Rate each attribute from 1 to 10. Leave any of them blank — a blank is not a zero, it is simply not measured today."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {MOSH_PLANES.map((plane) => (
            <div key={plane.plane} className="space-y-3">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold text-mosh-ink">{plane.label}</h3>
                <span className="text-xs tabular-nums text-mosh-brand">
                  {preview.planes[plane.plane] === null ? "—" : `${preview.planes[plane.plane]}%`}
                </span>
              </div>
              <p className="text-xs italic text-mosh-ink-subtle">{plane.tagline}</p>
              <div className="space-y-3">
                {plane.attributes.map((attribute) => (
                  <RatingRow
                    key={attribute.slug}
                    label={attribute.label}
                    hint={attribute.hint}
                    value={values.checkins?.[attribute.slug] ?? ""}
                    onChange={(next) =>
                      setValue(`checkins.${attribute.slug}`, next, { shouldDirty: true })
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-mosh-line bg-mosh-surface/95 px-4 py-3 shadow-[var(--mosh-shadow)] backdrop-blur">
        <p className="text-xs text-mosh-ink-muted">
          {isDirty
            ? "Unsaved changes."
            : saved
              ? "Saved. The dashboard has been updated."
              : "Everything here is saved."}
        </p>
        <button type="submit" disabled={isSubmitting} className={buttonClass("primary")}>
          {isSubmitting ? (
            <Loader2 size={15} className="animate-spin" aria-hidden />
          ) : (
            <Save size={15} aria-hidden />
          )}
          Save the day
        </button>
      </div>
    </form>
  );
}

/** A 1-10 rating rendered as a range input with the value shown as text. */
function RatingRow({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number | "";
  onChange: (value: number | "") => void;
}) {
  const id = `rating-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm text-mosh-ink">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium tabular-nums text-mosh-ink">
            {value === "" ? "—" : value}
          </span>
          {value !== "" ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs text-mosh-ink-subtle hover:text-mosh-ink"
            >
              clear
            </button>
          ) : null}
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={1}
        max={10}
        step={1}
        value={value === "" ? 5 : value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className="mt-1.5 w-full accent-[var(--mosh-brand)]"
      />
      {hint ? (
        <p id={`${id}-hint`} className="mt-0.5 text-xs text-mosh-ink-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function PlaneSummary({ entry }: { entry: DailyEntryView }) {
  return (
    <Grid cols={3}>
      {MOSH_PLANES.map((plane) => {
        const score = entry.planes[plane.plane];
        return (
          <Meter
            key={plane.plane}
            label={plane.label}
            value={score ?? 0}
            caption={score === null ? "Not measured today" : plane.tagline}
          />
        );
      })}
    </Grid>
  );
}
