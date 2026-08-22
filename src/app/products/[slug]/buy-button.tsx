"use client";

import { useState } from "react";

export default function BuyButton({
  productSlug,
  tier,
  tierName,
  amountGhs,
}: {
  productSlug: string;
  tier: string;
  tierName: string;
  amountGhs: number;
}) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    setError("");
    if (!email.trim()) {
      setError("Enter your email address so we can send your download link.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/checkout/paystack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug, tier, email: email.trim() }),
      });
      const body = (await response.json().catch(() => null)) as {
        authorizationUrl?: string;
        error?: string;
      } | null;

      if (!response.ok || !body?.authorizationUrl) {
        throw new Error(body?.error ?? "Could not start payment. Please try again.");
      }

      window.location.assign(body.authorizationUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start payment. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 rounded-xl bg-black/[.03] p-4 dark:bg-white/[.06]">
      <p className="text-sm font-medium">Buy {tierName}</p>
      <p className="mt-1 text-2xl font-semibold">GHS {amountGhs.toLocaleString()}</p>
      <label className="mt-4 block text-sm font-medium" htmlFor={`email-${productSlug}-${tier}`}>
        Email for delivery
      </label>
      <input
        id={`email-${productSlug}-${tier}`}
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") void startCheckout();
        }}
        placeholder="you@example.com"
        autoComplete="email"
        className="mt-2 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:bg-black"
      />
      <button
        type="button"
        onClick={() => void startCheckout()}
        disabled={busy}
        className="mt-3 w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:opacity-85 disabled:cursor-wait disabled:opacity-60 dark:bg-white dark:text-black"
      >
        {busy ? "Opening secure payment…" : `Pay GHS ${amountGhs.toLocaleString()}`}
      </button>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      <p className="mt-2 text-xs text-black/50 dark:text-white/50">
        Secure payment by Paystack. Your download link is emailed after payment is confirmed.
      </p>
    </div>
  );
}
