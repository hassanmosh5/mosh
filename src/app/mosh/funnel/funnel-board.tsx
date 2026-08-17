"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { api, ApiError } from "@/lib/mosh/client";
import { useMoshUi } from "@/lib/mosh/store";
import { FUNNEL_STAGES } from "@/lib/mosh/constants";
import type { FunnelView } from "@/lib/mosh/services/funnel";
import { Card, Field, buttonClass, inputClass } from "@/components/mosh/ui";

/**
 * Funnel snapshot entry.
 *
 * Cumulative counts on a date rather than an event stream — cheap enough to
 * keep up with weekly, which is what makes the conversion numbers real.
 */
export function FunnelForm({ funnel, date }: { funnel: FunnelView; date: string }) {
  const router = useRouter();
  const toast = useMoshUi((state) => state.toast);

  const defaults = Object.fromEntries(
    FUNNEL_STAGES.map((stage) => [stage.key, funnel.latest?.counts[stage.key] ?? 0])
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { date, ...defaults } as Record<string, string | number> });

  const submit = handleSubmit(async (values) => {
    try {
      await api.post("/api/mosh/funnel", {
        date: values.date,
        ...Object.fromEntries(
          FUNNEL_STAGES.map((stage) => [stage.key, Number(values[stage.key]) || 0])
        ),
      });
      toast("Snapshot recorded.");
      router.refresh();
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "That did not save.", "error");
    }
  });

  return (
    <Card
      title="Record a snapshot"
      description="The counts as they stand today. Saving twice on the same date updates that day rather than adding a second row."
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Field label="Date" htmlFor="snapshot-date">
            <input id="snapshot-date" type="date" className={inputClass} {...register("date")} />
          </Field>
          {FUNNEL_STAGES.map((stage) => (
            <Field key={stage.key} label={stage.label} htmlFor={`stage-${stage.key}`}>
              <input
                id={`stage-${stage.key}`}
                type="number"
                min={0}
                className={inputClass}
                {...register(stage.key)}
              />
            </Field>
          ))}
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={isSubmitting} className={buttonClass("primary", "sm")}>
            {isSubmitting ? (
              <Loader2 size={14} className="animate-spin" aria-hidden />
            ) : (
              <Save size={14} aria-hidden />
            )}
            Save snapshot
          </button>
        </div>
      </form>
    </Card>
  );
}
