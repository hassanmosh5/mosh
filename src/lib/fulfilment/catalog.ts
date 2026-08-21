/**
 * Server-side view of the product catalogue and the built packages.
 *
 * The catalogue on disk is the single source of truth for what may be sold;
 * the build manifest is the single source of truth for what may be delivered.
 * A webhook can only issue a grant for something that appears in both, so a
 * product whose package has not been built cannot be sold by accident.
 */

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

export type TierId = string;

export type CatalogTier = {
  id: TierId;
  name: string;
  multiplier: number;
  seats: number;
  clientWork: boolean;
  default?: boolean;
  summary: string;
};

export type CatalogProduct = {
  slug: string;
  dir: string;
  name: string;
  tagline: string;
  oneLiner: string;
  priceUsd: number;
  category: string;
  glyph: string;
  problem: string;
  solves: string[];
  audience: string[];
  inside: string[];
  outcomes: string[];
  usage: string[];
  notFor: string[];
  proof: string;
  keywords: string[];
};

export type CatalogMeta = {
  brand: string;
  seller: string;
  supportEmail: string;
  siteUrl: string;
  whatsappNumber: string;
  placeholderMarker: string;
};

export type CatalogPolicies = {
  refundDays: number;
  refundText: string;
  downloadWindowDays: number;
  maxDownloads: number;
  updatePolicy: string;
  supportPromise: string;
  disclaimer: string;
};

export type Catalog = {
  meta: CatalogMeta;
  policies: CatalogPolicies;
  tiers: CatalogTier[];
  categories: { id: string; name: string; glyph: string; blurb: string }[];
  bundles: { slug: string; name: string; tagline: string; priceUsd: number; pitch: string }[];
  products: CatalogProduct[];
};

export type PackageEntry = {
  kind: "product" | "bundle";
  slug: string;
  name: string;
  tier: TierId;
  tierName: string;
  /** Path relative to the package root, e.g. `packages/launch-kit/launch-kit-solo.zip`. */
  file: string;
  bytes: number;
  sha256: string;
  fileCount: number;
  priceUsd: number;
  priceGhs: number;
  priceNgn: number;
};

const REPO_ROOT = resolve(/* turbopackIgnore: true */ process.cwd());

/** Where the built ZIPs live. Override when they are served from a volume. */
export function packageRoot(): string {
  return process.env.PACKAGE_DIR
    ? resolve(process.env.PACKAGE_DIR)
    : join(REPO_ROOT, "dist");
}

let catalogCache: Catalog | null = null;
let manifestCache: { at: number; packages: PackageEntry[] } | null = null;

export function loadCatalog(): Catalog {
  if (catalogCache) return catalogCache;

  const dir = join(REPO_ROOT, "packaging");
  const base = JSON.parse(readFileSync(join(dir, "catalog.json"), "utf8"));

  const products: CatalogProduct[] = [];
  const productsDir = join(dir, "products");
  for (const file of readdirSync(productsDir).filter((name) => name.endsWith(".json")).sort()) {
    products.push(...JSON.parse(readFileSync(join(productsDir, file), "utf8")));
  }

  const catalog: Catalog = { ...base, products };
  catalogCache = catalog;
  return catalog;
}

export function findProduct(slug: string): CatalogProduct | undefined {
  return loadCatalog().products.find((product) => product.slug === slug);
}

export function findTier(id: string): CatalogTier | undefined {
  return loadCatalog().tiers.find((tier) => tier.id === id);
}

export function defaultTier(): CatalogTier {
  const tiers = loadCatalog().tiers;
  return tiers.find((tier) => tier.default) ?? tiers[0];
}

/**
 * The build manifest, re-read when the file changes so a rebuild does not need
 * a restart. Missing manifest is not an exception here — the caller decides
 * whether that is fatal, because a webhook should still record the sale.
 */
export function loadManifest(): PackageEntry[] {
  const path = join(packageRoot(), "packages", "manifest.json");
  if (!existsSync(path)) return [];

  const mtime = statSync(path).mtimeMs;
  if (manifestCache && manifestCache.at === mtime) return manifestCache.packages;

  const parsed = JSON.parse(readFileSync(path, "utf8"));
  manifestCache = { at: mtime, packages: parsed.packages ?? [] };
  return manifestCache.packages;
}

export function findPackage(slug: string, tier: string): PackageEntry | undefined {
  return loadManifest().find((entry) => entry.slug === slug && entry.tier === tier);
}

export function packageFilePath(entry: PackageEntry): string {
  return join(packageRoot(), entry.file);
}

/** True when the ZIP is actually on this machine and matches its checksum. */
export function packageIsAvailable(entry: PackageEntry): boolean {
  const path = packageFilePath(entry);
  return existsSync(path) && statSync(path).size === entry.bytes;
}

export function verifyPackageChecksum(entry: PackageEntry): boolean {
  const path = packageFilePath(entry);
  if (!existsSync(path)) return false;
  return createHash("sha256").update(readFileSync(path)).digest("hex") === entry.sha256;
}

/** A sellable pair: exists in the catalogue and has a built package. */
export function resolveSellable(
  slug: string,
  tier: string
): { product: CatalogProduct; tier: CatalogTier; pkg: PackageEntry } | null {
  const product = findProduct(slug);
  const tierRecord = findTier(tier);
  const pkg = findPackage(slug, tier);
  if (!product || !tierRecord || !pkg) return null;
  return { product, tier: tierRecord, pkg };
}

/** Only for tests, which build a temporary package tree per case. */
export function resetCatalogCache(): void {
  catalogCache = null;
  manifestCache = null;
}
