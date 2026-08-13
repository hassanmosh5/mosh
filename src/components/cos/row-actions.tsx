"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Select } from "./controls";

/**
 * Inline status switcher used across task, project, lead and content tables.
 * Optimistic UI is deliberately avoided: the row shows a pending state and
 * only changes once the server confirms, so the table never lies about state.
 */
export function StatusSelect({
  endpoint,
  field = "status",
  value,
  options,
  disabled,
}: {
  endpoint: string;
  field?: string;
  value: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [current, setCurrent] = useState(value);
  const [error, setError] = useState(false);

  async function update(next: string) {
    const previous = current;
    setCurrent(next);
    setPending(true);
    setError(false);
    try {
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ [field]: next }),
      });
      if (!response.ok) {
        setCurrent(previous);
        setError(true);
        return;
      }
      router.refresh();
    } catch {
      setCurrent(previous);
      setError(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <Select
      aria-label="Change status"
      className={`py-1 text-xs ${error ? "border-bad" : ""}`}
      value={current}
      disabled={disabled || pending}
      onChange={(event) => update(event.target.value)}
      title={error ? "Could not save — try again" : undefined}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
}

/**
 * Destructive action with a two-step confirmation. Deleting business records is
 * irreversible, so it never happens on a single click.
 */
export function DeleteButton({
  endpoint,
  label = "Delete",
  confirmLabel = "Confirm delete",
  redirectTo,
}: {
  endpoint: string;
  label?: string;
  confirmLabel?: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [armed, setArmed] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch(endpoint, { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(body?.error?.message ?? "Could not delete that record.");
        setArmed(false);
        return;
      }
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Could not reach the server.");
      setArmed(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      {armed ? (
        <>
          <Button type="button" variant="danger" size="sm" disabled={pending} onClick={remove}>
            {pending ? "Deleting…" : confirmLabel}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setArmed(false)}>
            Keep
          </Button>
        </>
      ) : (
        <Button type="button" variant="ghost" size="sm" onClick={() => setArmed(true)}>
          {label}
        </Button>
      )}
      {error ? <span className="text-xs text-bad">{error}</span> : null}
    </span>
  );
}
