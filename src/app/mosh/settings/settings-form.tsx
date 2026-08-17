"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { api, ApiError } from "@/lib/mosh/client";
import { useMoshUi } from "@/lib/mosh/store";
import { Card, Field, buttonClass, inputClass } from "@/components/mosh/ui";
import { InstallButton } from "@/components/mosh/pwa";

type Profile = {
  displayName: string;
  title: string;
  philosophy: string;
  mission: string;
  currency: string;
  timezone: string;
  planYear: number;
  email: string;
};

/** Who the system thinks you are, and the words it uses back at you. */
export function SettingsForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const toast = useMoshUi((state) => state.toast);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      displayName: profile.displayName,
      title: profile.title,
      philosophy: profile.philosophy,
      mission: profile.mission,
      currency: profile.currency,
      timezone: profile.timezone,
      planYear: profile.planYear,
    },
  });

  const submit = handleSubmit(async (values) => {
    try {
      await api.patch("/api/mosh/profile", {
        ...values,
        planYear: Number(values.planYear),
        currency: values.currency.toUpperCase(),
      });
      toast("Settings saved.");
      router.refresh();
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "That did not save.", "error");
    }
  });

  return (
    <div className="space-y-4">
      <Card title="Your framing" description="Names and words the system uses when it speaks to you.">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Display name" htmlFor="displayName">
              <input id="displayName" className={inputClass} {...register("displayName")} />
            </Field>
            <Field label="Title" htmlFor="title">
              <input id="title" className={inputClass} {...register("title")} />
            </Field>
            <Field label="Philosophy" htmlFor="philosophy">
              <input id="philosophy" className={inputClass} {...register("philosophy")} />
            </Field>
            <Field label="Plan year" htmlFor="planYear">
              <input
                id="planYear"
                type="number"
                min={2000}
                max={2100}
                className={inputClass}
                {...register("planYear")}
              />
            </Field>
            <Field label="Currency (3 letters)" htmlFor="currency">
              <input id="currency" maxLength={3} className={inputClass} {...register("currency")} />
            </Field>
            <Field label="Timezone" htmlFor="timezone">
              <input id="timezone" className={inputClass} {...register("timezone")} />
            </Field>
          </div>

          <Field label="Mission" htmlFor="mission" hint="Why any of this exists. It prints on your year report.">
            <textarea id="mission" rows={4} className={inputClass} {...register("mission")} />
          </Field>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-mosh-ink-subtle">
              Signed in as {profile.email}. {isDirty ? "Unsaved changes." : "All saved."}
            </p>
            <button type="submit" disabled={isSubmitting} className={buttonClass("primary", "sm")}>
              {isSubmitting ? (
                <Loader2 size={14} className="animate-spin" aria-hidden />
              ) : (
                <Save size={14} aria-hidden />
              )}
              Save settings
            </button>
          </div>
        </form>
      </Card>

      <Card
        title="Install on this device"
        description="MOSH is a Progressive Web App: install it and it opens like any other app, works offline for reading, and keeps your session."
      >
        <InstallButton />
      </Card>
    </div>
  );
}
