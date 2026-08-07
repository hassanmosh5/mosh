"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BuyButton({ courseSlug }: { courseSlug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setLoading(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseSlug }),
    });

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.url) {
      setLoading(false);
      setError(data.error ?? "Something went wrong. Try again.");
      return;
    }

    window.location.href = data.url;
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-block rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-85 disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {loading ? "Redirecting to checkout..." : "Buy course access"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
