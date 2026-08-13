"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function MarkCompleteButton({
  lessonId,
  completed,
}: {
  lessonId: string;
  completed: boolean;
}) {
  const router = useRouter();
  const [done, setDone] = useState(completed);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId,
        status: done ? "IN_PROGRESS" : "COMPLETED",
      }),
    });
    setLoading(false);
    if (res.ok) {
      setDone(!done);
      router.refresh();
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`rounded-full px-5 py-2 text-sm font-medium transition disabled:opacity-50 ${
        done
          ? "border border-black/15 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          : "bg-black text-white hover:opacity-85 dark:bg-white dark:text-black"
      }`}
    >
      {done ? "✓ Completed" : "Mark as complete"}
    </button>
  );
}
