/**
 * The page a buyer lands on after paying.
 *
 * It shows what they bought, how many downloads are left and when the link
 * expires, plus the first three things to do — because the moment after payment
 * is the only moment you are guaranteed their attention.
 */

import type { Metadata } from "next";

import { findProduct, findTier, loadCatalog } from "@/lib/fulfilment/catalog";
import { inspectGrant } from "@/lib/fulfilment/grants";
import { looksLikeToken } from "@/lib/fulfilment/tokens";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your download",
  robots: { index: false, follow: false },
};

const PROBLEMS: Record<string, { heading: string; detail: string }> = {
  "not-found": {
    heading: "This link is not valid",
    detail:
      "Check that you copied the whole thing — they are long, and chat apps sometimes break them across two lines.",
  },
  revoked: {
    heading: "This download was revoked",
    detail: "That usually means the order was refunded. If it was not, get in touch and we will sort it.",
  },
  expired: {
    heading: "This link has expired",
    detail:
      "Links stay live for a limited window. Email us from the address you bought with and we will issue a fresh one — you keep what you paid for.",
  },
  exhausted: {
    heading: "This link has been used up",
    detail:
      "It reached its download limit. Email us from the address you bought with and we will issue a fresh one.",
  },
};

export default async function DownloadPage({ params }: PageProps<"/d/[token]">) {
  const { token } = await params;
  const catalog = loadCatalog();
  const support = catalog.meta.supportEmail;

  const found = looksLikeToken(token)
    ? await inspectGrant(token)
    : ({ ok: false, reason: "not-found" } as const);

  if (!found.ok) {
    const problem = PROBLEMS[found.reason];
    return (
      <main className="mx-auto w-full max-w-xl px-6 py-24">
        <h1 className="text-2xl font-semibold tracking-tight">{problem.heading}</h1>
        <p className="mt-4 text-black/60 dark:text-white/60">{problem.detail}</p>
        <p className="mt-8 text-sm">
          <a className="underline" href={`mailto:${support}`}>
            {support}
          </a>{" "}
          — {catalog.policies.supportPromise}
        </p>
      </main>
    );
  }

  const grant = found.grant;
  const product = findProduct(grant.productSlug);
  const tier = findTier(grant.tier);
  const remaining = grant.maxDownloads - grant.downloadCount;

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-20">
      <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium tracking-wide uppercase dark:bg-white/10">
        Paid · ready to download
      </span>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight">
        {product?.name ?? grant.productSlug}
      </h1>
      {product && <p className="mt-3 text-lg text-black/60 dark:text-white/60">{product.tagline}</p>}

      <a
        href={`/api/downloads/${token}`}
        className="mt-8 inline-flex rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-85 dark:bg-white dark:text-black"
      >
        Download the ZIP
      </a>

      <p className="mt-4 text-sm text-black/50 dark:text-white/50">
        {tier?.name ?? grant.tier} · {remaining} of {grant.maxDownloads} downloads left · link valid
        until {grant.expiresAt.toISOString().slice(0, 10)}
      </p>

      <div className="mt-10 rounded-2xl border border-black/10 p-6 dark:border-white/15">
        <h2 className="text-sm font-semibold tracking-wide uppercase">Save it somewhere permanent</h2>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          Once the file is on your machine it is yours whether this link still works or not. The link
          exists to stop it being passed around, not to control your copy.
        </p>
      </div>

      {product && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold tracking-wide uppercase">First three things to do</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-black/70 dark:text-white/70">
            {product.usage.slice(0, 3).map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="mt-10 border-t border-black/10 pt-6 text-sm text-black/60 dark:border-white/15 dark:text-white/60">
        <p>
          Something wrong?{" "}
          <a className="underline" href={`mailto:${support}`}>
            {support}
          </a>{" "}
          — {catalog.policies.supportPromise}
        </p>
        <p className="mt-2">{catalog.policies.refundText}</p>
      </div>
    </main>
  );
}
