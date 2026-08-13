"use client";

import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { Button, ErrorBanner, Field, Input, Select, Textarea } from "./controls";
import { cx } from "./ui";

export type FieldSpec = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "select" | "number" | "date" | "email" | "url" | "tags" | "checkbox";
  options?: { value: string; label: string }[];
  placeholder?: string;
  hint?: string;
  required?: boolean;
  defaultValue?: string | number | boolean | null;
  span?: 1 | 2;
  min?: number;
  max?: number;
};

type ApiError = { error?: { message?: string; details?: { path: string; message: string }[] } };

/**
 * Generic create/edit form.
 *
 * All M-CoS write endpoints accept the same JSON envelope and return the same
 * error shape, so one well-behaved form component (loading state, field-level
 * validation errors, safe error banner) serves every module instead of fifteen
 * near-identical bespoke forms.
 */
export function EntityForm({
  endpoint,
  method = "POST",
  fields,
  submitLabel = "Save",
  onSuccessRedirect,
  compact = false,
  resetOnSuccess = true,
  children,
}: {
  endpoint: string;
  method?: "POST" | "PATCH";
  fields: FieldSpec[];
  submitLabel?: string;
  onSuccessRedirect?: string;
  compact?: boolean;
  resetOnSuccess?: boolean;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const formId = useId();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [, startTransition] = useTransition();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setSubmitting(true);

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload: Record<string, unknown> = {};

    for (const spec of fields) {
      const raw = data.get(spec.name);
      if (spec.type === "checkbox") {
        payload[spec.name] = raw === "on";
        continue;
      }
      const value = typeof raw === "string" ? raw.trim() : "";
      if (value === "") {
        // Omit empty optional fields so the server applies its own defaults.
        if (spec.required) payload[spec.name] = "";
        continue;
      }
      if (spec.type === "number") payload[spec.name] = Number(value);
      else if (spec.type === "tags") payload[spec.name] = value.split(",").map((t) => t.trim()).filter(Boolean);
      else payload[spec.name] = value;
    }

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as ApiError;
        if (body.error?.details?.length) {
          const map: Record<string, string> = {};
          for (const detail of body.error.details) map[detail.path] = detail.message;
          setFieldErrors(map);
        }
        setError(body.error?.message ?? "That could not be saved. Please try again.");
        return;
      }

      if (resetOnSuccess) form.reset();
      startTransition(() => {
        if (onSuccessRedirect) router.push(onSuccessRedirect);
        router.refresh();
      });
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <ErrorBanner message={error} />
      <div className={cx("grid gap-3", compact ? "sm:grid-cols-2" : "sm:grid-cols-2")}>
        {fields.map((spec) => {
          const id = `${formId}-${spec.name}`;
          const common = {
            id,
            name: spec.name,
            required: spec.required,
            placeholder: spec.placeholder,
            defaultValue:
              spec.defaultValue === null || spec.defaultValue === undefined
                ? undefined
                : String(spec.defaultValue),
          };
          return (
            <Field
              key={spec.name}
              label={spec.label + (spec.required ? " *" : "")}
              hint={spec.hint}
              error={fieldErrors[spec.name]}
              htmlFor={id}
              className={spec.span === 2 ? "sm:col-span-2" : undefined}
            >
              {spec.type === "textarea" ? (
                <Textarea {...common} rows={compact ? 3 : 5} />
              ) : spec.type === "select" ? (
                <Select {...common}>
                  {!spec.required ? <option value="">—</option> : null}
                  {(spec.options ?? []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              ) : spec.type === "checkbox" ? (
                <input
                  id={id}
                  name={spec.name}
                  type="checkbox"
                  defaultChecked={Boolean(spec.defaultValue)}
                  className="h-4 w-4 rounded border-line"
                />
              ) : (
                <Input
                  {...common}
                  type={
                    spec.type === "number"
                      ? "number"
                      : spec.type === "date"
                        ? "date"
                        : spec.type === "email"
                          ? "email"
                          : spec.type === "url"
                            ? "url"
                            : "text"
                  }
                  min={spec.min}
                  max={spec.max}
                />
              )}
            </Field>
          );
        })}
      </div>
      {children}
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
