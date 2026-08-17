/**
 * Loads and validates the commercial catalogue.
 *
 * The catalogue is the single source of truth for everything sold: prices,
 * copy, licences and which files go in which package. Every other script in
 * this folder reads it and writes only into `dist/` or `packaging/listings/`.
 *
 * Validation is deliberately strict and fails loudly. A catalogue that is
 * missing a price or points at a directory that no longer exists must not
 * produce a half-built package that looks shippable.
 */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const PACKAGING_DIR = join(ROOT, "packaging");
export const DIST_DIR = join(ROOT, "dist");

const REQUIRED_PRODUCT_FIELDS = [
  "slug",
  "dir",
  "name",
  "category",
  "priceUsd",
  "tagline",
  "oneLiner",
  "audience",
  "problem",
  "solves",
  "inside",
  "outcomes",
  "usage",
  "notFor",
  "proof",
  "keywords",
];

/** Fields whose length we hold to a rule so listings never arrive truncated. */
const FIELD_LIMITS = {
  tagline: 62,
  oneLiner: 175,
};

/** Minimum counts. Thin copy is the main way a listing stops converting. */
const MIN_ITEMS = {
  audience: 2,
  solves: 3,
  inside: 4,
  outcomes: 3,
  usage: 4,
  notFor: 2,
  keywords: 8,
};

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(`Cannot parse ${path}: ${error.message}`);
  }
}

/** Rounds a converted price up to the nearest sensible unit for its currency. */
export function convertPrice(usd, currency, config) {
  if (currency === "USD") return Math.round(usd * 100) / 100;
  const rate = currency === "GHS" ? config.ghsPerUsd : config.ngnPerUsd;
  if (!rate) throw new Error(`No exchange rate configured for ${currency}`);
  const step = config.roundTo?.[currency] ?? 1;
  return Math.ceil((usd * rate) / step) * step;
}

export function formatMoney(amount, currency) {
  const symbols = { USD: "$", GHS: "GHS ", NGN: "NGN " };
  const symbol = symbols[currency] ?? `${currency} `;
  const formatted =
    currency === "USD"
      ? amount.toFixed(amount % 1 === 0 ? 0 : 2)
      : amount.toLocaleString("en-US");
  return `${symbol}${formatted}`;
}

/** Price for one product at one tier, in every currency we quote. */
export function tierPricing(product, tier, currency) {
  const usd = Math.round(product.priceUsd * tier.multiplier);
  return {
    tierId: tier.id,
    usd,
    ghs: convertPrice(usd, "GHS", currency),
    ngn: convertPrice(usd, "NGN", currency),
  };
}

function validateProduct(product, index, seen, categories) {
  const where = `products[${index}] (${product.slug ?? "no slug"})`;

  for (const field of REQUIRED_PRODUCT_FIELDS) {
    const value = product[field];
    const empty =
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);
    if (empty) throw new Error(`${where}: missing required field "${field}"`);
  }

  if (seen.has(product.slug)) throw new Error(`${where}: duplicate slug "${product.slug}"`);
  seen.add(product.slug);

  if (!categories.has(product.category)) {
    throw new Error(`${where}: unknown category "${product.category}"`);
  }

  const dir = join(ROOT, product.dir);
  if (!existsSync(dir) || !statSync(dir).isDirectory()) {
    throw new Error(`${where}: directory "${product.dir}" does not exist`);
  }

  const entry = product.entry ?? "index.html";
  if (!existsSync(join(dir, entry))) {
    throw new Error(`${where}: entry file "${product.dir}/${entry}" does not exist`);
  }

  for (const [field, max] of Object.entries(FIELD_LIMITS)) {
    if (product[field].length > max) {
      throw new Error(
        `${where}: "${field}" is ${product[field].length} characters, limit ${max}\n  ${product[field]}`
      );
    }
  }

  for (const [field, min] of Object.entries(MIN_ITEMS)) {
    if (product[field].length < min) {
      throw new Error(`${where}: "${field}" needs at least ${min} items, has ${product[field].length}`);
    }
  }

  for (const extra of product.extraFiles ?? []) {
    if (!existsSync(join(ROOT, extra.from))) {
      throw new Error(`${where}: extra file "${extra.from}" does not exist`);
    }
  }
}

export function loadCatalog() {
  const base = readJson(join(PACKAGING_DIR, "catalog.json"));
  const productsDir = join(PACKAGING_DIR, "products");

  const files = readdirSync(productsDir)
    .filter((name) => name.endsWith(".json"))
    .sort();

  const products = [];
  for (const file of files) {
    const entries = readJson(join(productsDir, file));
    if (!Array.isArray(entries)) throw new Error(`${file} must contain an array of products`);
    for (const entry of entries) products.push({ ...entry, sourceFile: file });
  }

  const categories = new Set(base.categories.map((c) => c.id));
  const seen = new Set();
  products.forEach((product, index) => validateProduct(product, index, seen, categories));

  // Resolve defaults once so no downstream script has to remember them.
  for (const product of products) {
    product.entry ??= "index.html";
    product.extraFiles ??= [];
    product.shots ??= [];
    product.tiers = base.tiers.map((tier) => ({
      ...tier,
      pricing: tierPricing(product, tier, base.currency),
    }));
    product.category = base.categories.find((c) => c.id === product.category);
  }

  for (const bundle of base.bundles) {
    const slugs =
      bundle.includes === "all"
        ? products.map((p) => p.slug)
        : bundle.includes;
    for (const slug of slugs) {
      if (!products.some((p) => p.slug === slug)) {
        throw new Error(`bundle "${bundle.slug}" includes unknown product "${slug}"`);
      }
    }
    bundle.productSlugs = slugs;
    bundle.sumUsd = slugs.reduce(
      (total, slug) => total + products.find((p) => p.slug === slug).priceUsd,
      0
    );
    bundle.savingUsd = bundle.sumUsd - bundle.priceUsd;
    bundle.savingPercent = Math.round((bundle.savingUsd / bundle.sumUsd) * 100);
    if (bundle.savingUsd <= 0) {
      throw new Error(
        `bundle "${bundle.slug}" costs $${bundle.priceUsd} but its parts total $${bundle.sumUsd} — a bundle that saves nothing should not exist`
      );
    }
  }

  return { ...base, products };
}

/** The default tier, used whenever a platform can only carry one price. */
export function defaultTier(catalog) {
  return catalog.tiers.find((tier) => tier.default) ?? catalog.tiers[0];
}

export function platform(catalog, id) {
  const found = catalog.platforms.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown platform "${id}"`);
  return found;
}

/** Substitutes {{meta.key}} placeholders in copy with catalogue values. */
export function interpolate(text, catalog) {
  return text.replace(/\{\{meta\.([a-zA-Z]+)\}\}/g, (match, key) => catalog.meta[key] ?? match);
}

/**
 * Enforces a platform's character limit. Truncating silently is the failure
 * mode this whole toolchain exists to prevent, so this throws instead.
 */
export function fit(text, max, label) {
  if (text.length > max) {
    throw new Error(
      `${label} is ${text.length} characters, limit ${max}:\n  ${text.slice(0, 120)}…`
    );
  }
  return text;
}

export function slugToTitle(slug) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
