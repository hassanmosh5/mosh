/**
 * The public catalogue.
 *
 * Every listing on every platform links back here, and the WhatsApp catalogue
 * feed points its `link` field at the product pages below it. Rendered from
 * packaging/catalog.json, so it cannot drift from what is actually for sale.
 */

import type { Metadata } from "next";
import Link from "next/link";
import {
  Bot,
  Building2,
  Compass,
  Landmark,
  Package,
  TrendingUp,
} from "lucide-react";

import { loadCatalog } from "@/lib/fulfilment/catalog";

export const metadata: Metadata = {
  title: "Tools — MOSH Digital Studios",
  description:
    "Single-file tools that run offline in any browser. One payment, no account, no subscription.",
};

function CategoryIcon({ id }: { id: string }) {
  const iconProps = { size: 20, strokeWidth: 1.8, "aria-hidden": true as const };

  switch (id) {
    case "decide":
      return <Compass {...iconProps} />;
    case "package":
      return <Package {...iconProps} />;
    case "agency":
      return <Building2 {...iconProps} />;
    case "growth":
      return <TrendingUp {...iconProps} />;
    case "agents":
      return <Bot {...iconProps} />;
    case "life":
      return <Landmark {...iconProps} />;
    default:
      return null;
  }
}

export default function ProductsPage() {
  const catalog = loadCatalog();
  const total = catalog.products.reduce((sum, product) => sum + product.priceUsd, 0);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-20">
      <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium tracking-wide uppercase dark:bg-white/10">
        {catalog.products.length} tools · {catalog.categories.length} categories
      </span>

      <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight">
        Tools that run offline, in any browser, with no account
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-black/60 dark:text-white/60">
        Each one is a single file. Open it and it works — no install, no build step, no subscription,
        and nothing you type leaves your device. One payment, yours permanently.
      </p>

      {catalog.categories.map((category) => {
        const products = catalog.products.filter((product) => product.category === category.id);
        if (!products.length) return null;

        return (
          <section key={category.id} className="mt-16">
            <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
              <CategoryIcon id={category.id} />
              <span>{category.name}</span>
            </h2>
            <p className="mt-1 text-sm text-black/50 dark:text-white/50">{category.blurb}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {products.map((product) => (
                <Link
                  key={product.slug}
                  href={`/products/${product.slug}`}
                  className="group rounded-2xl border border-black/10 p-5 transition hover:border-black/30 dark:border-white/15 dark:hover:border-white/40"
                >
                  <h3 className="font-semibold tracking-tight group-hover:underline">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-sm text-black/60 dark:text-white/60">{product.tagline}</p>
                  <p className="mt-4 text-sm font-medium">from ${product.priceUsd}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <section className="mt-20 rounded-2xl border border-black/10 p-6 dark:border-white/15">
        <h2 className="text-xl font-semibold tracking-tight">Bundles</h2>
        <p className="mt-1 text-sm text-black/50 dark:text-white/50">
          Bought one at a time the catalogue comes to ${total}.
        </p>
        <ul className="mt-5 space-y-4">
          {catalog.bundles.map((bundle) => (
            <li key={bundle.slug}>
              <p className="font-medium">
                {bundle.name} — ${bundle.priceUsd}
              </p>
              <p className="text-sm text-black/60 dark:text-white/60">{bundle.tagline}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-12 text-sm text-black/50 dark:text-white/50">
        {catalog.policies.refundText} {catalog.policies.disclaimer}
      </p>
    </main>
  );
}

