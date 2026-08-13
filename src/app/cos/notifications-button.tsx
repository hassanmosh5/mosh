"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/cos/controls";

/**
 * Recomputes derived notifications on demand. In production this is also worth
 * running on a schedule (see DEPLOYMENT.md → scheduled jobs); the endpoint is
 * idempotent so both paths are safe.
 */
export function RefreshNotificationsButton() {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "working" | "error">("idle");

  async function run() {
    setState("working");
    try {
      const response = await fetch("/api/cos/notifications/refresh", { method: "POST" });
      setState(response.ok ? "idle" : "error");
      if (response.ok) router.refresh();
    } catch {
      setState("error");
    }
  }

  return (
    <Button type="button" variant="secondary" onClick={run} disabled={state === "working"}>
      {state === "working" ? "Scanning…" : state === "error" ? "Retry scan" : "Scan for alerts"}
    </Button>
  );
}
