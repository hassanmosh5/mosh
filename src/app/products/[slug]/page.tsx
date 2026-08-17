/**
 * A single product page: the same argument the marketplace listings make,
 * at the URL the WhatsApp catalogue and the Meta feed point at.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { findProduct, loadCatalog } from "@/lib/fulfilment/catalog";

export function generateStaticParams() {
  return loadCatalog().products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) return { title: "Not found" };

  return {
    title: `${product.name} — ${product.tagline}`,
    description: product.oneLiner,
    openGraph: {
      title: product.name,
      description: product.oneLiner,
      images: [`/mockups/${product.slug}/cover.png`],
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();

  const catalog = loadCatalog();
  const category = catalog.categories.find((entry) => entry.id === product.category);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-20">
      <Link href="/products" className="text-sm underline">
        ← All tools
      </Link>

      <span className="mt-6 inline-block rounded-full bg-black/5 px-3 py-1 text-xs font-medium tracking-wide uppercase dark:bg-white/10">
        {category ? `${category.glyph} ${category.name}` : "Tool"}
      </span>

      <h1 className="mt-4 text-4xl font-semibold tracking-tight">{product.name}</h1>
      <p className="mt-3 text-xl text-black/60 dark:text-white/60">{product.tagline}</p>

      {/* The screenshot is of the product running, not a mock-up of one. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/mockups/${product.slug}/cover.png`}
        alt={`${product.name} — ${product.tagline}`}
        width={1280}
        height={720}
        className="mt-8 w-full rounded-2xl border border-black/10 dark:border-white/15"
      />

      <p className="mt-8 text-lg">{product.oneLiner}</p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">The problem</h2>
      <p className="mt-3 text-black/70 dark:text-white/70">{product.problem}</p>

      <h3 className="mt-6 text-sm font-semibold tracking-wide uppercase">It deals specifically with</h3>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-black/70 dark:text-white/70">
        {product.solves.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Who it is for</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-black/70 dark:text-white/70">
        {product.audience.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">What you get</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-black/70 dark:text-white/70">
        {product.inside.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">How you use it</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-black/70 dark:text-white/70">
        {product.usage.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">
        What should be true when you finish
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-black/70 dark:text-white/70">
        {product.outcomes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Do not buy this if</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-black/70 dark:text-white/70">
        {product.notFor.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">What it cannot do</h2>
      <p className="mt-3 text-black/70 dark:text-white/70">{product.proof}</p>

      <div className="mt-12 rounded-2xl border border-black/10 p-6 dark:border-white/15">
        <h2 className="text-xl font-semibold tracking-tight">Licences</h2>
        <ul className="mt-4 space-y-4">
          {catalog.tiers.map((tier) => (
            <li key={tier.id}>
              <p className="font-medium">
                {tier.name} — ${Math.round(product.priceUsd * tier.multiplier)}
                {tier.default && " · most people want this one"}
              </p>
              <p className="text-sm text-black/60 dark:text-white/60">{tier.summary}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-black/60 dark:text-white/60">
          {catalog.policies.refundText} {catalog.policies.updatePolicy}
        </p>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          Questions before you buy:{" "}
          <a className="underline" href={`mailto:${catalog.meta.supportEmail}`}>
            {catalog.meta.supportEmail}
          </a>
        </p>
      </div>

      <p className="mt-10 text-sm text-black/50 dark:text-white/50">{catalog.policies.disclaimer}</p>
    </main>
  );
}
