"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Select } from "@/components/cos/controls";

const KINDS = [
  { value: "DAILY_BRIEFING", label: "Daily briefing" },
  { value: "WEEKLY_EXECUTIVE", label: "Weekly executive report" },
  { value: "MONTHLY_BUSINESS", label: "Monthly business report" },
  { value: "QUARTERLY_STRATEGY", label: "Quarterly strategy review" },
];

export function ReportGenerator({ configured, preselect }: { configured: boolean; preselect?: string }) {
  const router = useRouter();
  const [kind, setKind] = useState(
    KINDS.some((option) => option.value === preselect) ? (preselect as string) : "DAILY_BRIEFING"
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/cos/reports", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(body?.error?.message ?? "Could not generate that report.");
        return;
      }
      router.push(`/cos/reports?id=${body.id}`);
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        aria-label="Report type"
        value={kind}
        onChange={(event) => setKind(event.target.value)}
        className="w-56"
        disabled={pending}
      >
        {KINDS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Button type="button" onClick={generate} disabled={pending}>
        {pending ? "Generating…" : "Generate"}
      </Button>
      {!configured ? (
        <span className="text-xs text-ink-subtle">Data-only (no AI key configured)</span>
      ) : null}
      {error ? <span className="text-xs text-bad">{error}</span> : null}
    </div>
  );
}
