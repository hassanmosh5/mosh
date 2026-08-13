"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Input } from "@/components/cos/controls";

/**
 * Human decision on an AI-proposed sensitive action.
 *
 * Approving records authorisation. It does not make M-CoS perform the action —
 * the founder carries it out and then marks it executed, which closes the audit
 * loop with a named person against every irreversible step.
 */
export function ApprovalActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(decision: "APPROVED" | "REJECTED") {
    setPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/cos/approvals/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ decision, note: note || undefined }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(body?.error?.message ?? "Could not record that decision.");
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setPending(false);
    }
  }

  async function markExecuted() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/cos/approvals/${id}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ note: note || undefined }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(body?.error?.message ?? "Could not mark that as executed.");
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setPending(false);
    }
  }

  if (status === "REJECTED" || status === "EXECUTED" || status === "EXPIRED") {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Optional note"
        className="max-w-xs py-1 text-xs"
      />
      {status === "PENDING" ? (
        <>
          <Button type="button" size="sm" onClick={() => decide("APPROVED")} disabled={pending}>
            Approve
          </Button>
          <Button type="button" size="sm" variant="danger" onClick={() => decide("REJECTED")} disabled={pending}>
            Reject
          </Button>
        </>
      ) : (
        <Button type="button" size="sm" variant="secondary" onClick={markExecuted} disabled={pending}>
          Mark executed
        </Button>
      )}
      {error ? <span className="text-xs text-bad">{error}</span> : null}
    </div>
  );
}
