"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/cos/controls";

/**
 * Marks an integration connected or disabled.
 *
 * The server refuses to mark an integration CONNECTED when its credentials are
 * absent, so this control can never be used to fake a working integration.
 */
export function IntegrationToggle({
  provider,
  status,
  disabled,
}: {
  provider: string;
  status: string;
  disabled: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function set(next: "CONNECTED" | "DISABLED" | "NOT_CONNECTED") {
    setPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/cos/integrations/${provider}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(body?.error?.message ?? "Could not change that.");
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      {status === "CONNECTED" ? (
        <Button type="button" size="sm" variant="secondary" onClick={() => set("DISABLED")} disabled={pending}>
          Disable
        </Button>
      ) : status === "DISABLED" ? (
        <Button type="button" size="sm" variant="secondary" onClick={() => set("NOT_CONNECTED")} disabled={pending}>
          Re-enable
        </Button>
      ) : (
        <Button
          type="button"
          size="sm"
          onClick={() => set("CONNECTED")}
          disabled={pending || disabled}
          title={disabled ? "Set the required environment variables on the server first." : undefined}
        >
          Connect
        </Button>
      )}
      {error ? <span className="max-w-48 text-[11px] text-bad">{error}</span> : null}
    </div>
  );
}
