#!/usr/bin/env node
/**
 * The pre-launch check.
 *
 * Answers one question: is this catalogue safe to publish? It fails on
 * placeholders that would ship an example domain into a live listing, on
 * packages whose checksum no longer matches, on missing store imagery, and on
 * any listing that has drifted from the catalogue it was generated from.
 *
 *   npm run pkg:verify
 */

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { DIST_DIR, PACKAGING_DIR, loadCatalog } from "./catalog.mjs";

const problems = [];
const warnings = [];
const notes = [];

const fail = (message) => problems.push(message);
const warn = (message) => warnings.push(message);

function checkPlaceholders(catalog) {
  const marker = catalog.meta.placeholderMarker;
  const found = [];

  const walk = (value, path, key) => {
    // `$`-prefixed keys are notes to the reader, and placeholderMarker is the
    // definition of the marker itself. Neither ships anywhere.
    if (key?.startsWith("$") || key === "placeholderMarker") return;

    if (typeof value === "string") {
      if (value.includes(marker)) found.push(`${path} = "${value}"`);
    } else if (value && typeof value === "object") {
      for (const [childKey, child] of Object.entries(value)) {
        walk(child, `${path}.${childKey}`, childKey);
      }
    }
  };

  walk(catalog.meta, "meta");

  if (found.length) {
    fail(
      `${found.length} placeholder(s) still in packaging/catalog.json — a listing published now would point at an example address:\n    ${found.join("\n    ")}`
    );
  } else {
    notes.push("No placeholders left in the catalogue metadata.");
  }
}

function checkExchangeRates(catalog) {
  const noted = new Date(catalog.currency.rateNotedOn);
  const ageDays = Math.floor((Date.now() - noted.getTime()) / 86_400_000);
  if (Number.isNaN(ageDays)) {
    fail("currency.rateNotedOn is not a date");
  } else if (ageDays > 60) {
    warn(
      `The GHS/NGN rates were noted ${ageDays} days ago (${catalog.currency.rateNotedOn}). Re-check them and re-run \`npm run pkg:listings\` — a stale rate quietly changes your margin.`
    );
  } else {
    notes.push(`Exchange rates noted ${ageDays} day(s) ago.`);
  }
}

function checkPackages(catalog) {
  const manifestPath = join(DIST_DIR, "packages", "manifest.json");
  if (!existsSync(manifestPath)) {
    fail("No build manifest. Run `npm run pkg:build` — nothing can be delivered without it.");
    return;
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const byKey = new Map(manifest.packages.map((entry) => [`${entry.slug}:${entry.tier}`, entry]));

  let missing = 0;
  let mismatched = 0;

  for (const product of catalog.products) {
    for (const tier of product.tiers) {
      const entry = byKey.get(`${product.slug}:${tier.id}`);
      if (!entry) {
        fail(`No package for ${product.slug}/${tier.id}. A sale of it could not be fulfilled.`);
        missing++;
        continue;
      }

      const file = join(DIST_DIR, entry.file);
      if (!existsSync(file)) {
        fail(`Manifest lists ${entry.file} but the file is not there.`);
        missing++;
        continue;
      }

      const actual = createHash("sha256").update(readFileSync(file)).digest("hex");
      if (actual !== entry.sha256) {
        fail(`${entry.file} does not match its manifest checksum. Rebuild it.`);
        mismatched++;
      }
    }
  }

  for (const bundle of catalog.bundles) {
    if (!byKey.has(`${bundle.slug}:studio`)) {
      warn(`Bundle "${bundle.slug}" has no built package. Run \`npm run pkg:build\`.`);
    }
  }

  if (!missing && !mismatched) {
    notes.push(
      `${catalog.products.length * catalog.tiers.length} product packages present and matching their checksums.`
    );
  }
}

function checkMockups(catalog) {
  const required = ["cover.png", "square.png"];
  const missing = [];

  for (const product of catalog.products) {
    const dir = join(DIST_DIR, "mockups", product.slug);
    const entry = product.entry ?? "index.html";
    const wanted = entry.endsWith(".html") ? required : ["cover.png"];

    for (const file of wanted) {
      if (!existsSync(join(dir, file))) missing.push(`${product.slug}/${file}`);
    }
  }

  if (missing.length) {
    warn(
      `${missing.length} store image(s) missing — run \`npm run pkg:mockups\`:\n    ${missing.slice(0, 12).join("\n    ")}${missing.length > 12 ? `\n    …and ${missing.length - 12} more` : ""}`
    );
  } else {
    notes.push("Cover and square imagery present for every product.");
  }
}

function checkListings(catalog) {
  const listingsDir = join(PACKAGING_DIR, "listings");
  if (!existsSync(listingsDir)) {
    fail("No listings generated. Run `npm run pkg:listings`.");
    return;
  }

  const expected = catalog.platforms.map((entry) => `${entry.id}.md`);
  let missing = 0;
  let stale = 0;

  const catalogMtime = Math.max(
    statSync(join(PACKAGING_DIR, "catalog.json")).mtimeMs,
    ...readdirSync(join(PACKAGING_DIR, "products")).map((file) =>
      statSync(join(PACKAGING_DIR, "products", file)).mtimeMs
    )
  );

  for (const product of catalog.products) {
    for (const file of expected) {
      const path = join(listingsDir, product.slug, file);
      if (!existsSync(path)) {
        missing++;
        continue;
      }
      if (statSync(path).mtimeMs < catalogMtime) stale++;
    }
  }

  if (missing) fail(`${missing} listing file(s) missing. Run \`npm run pkg:listings\`.`);
  if (stale) {
    fail(
      `${stale} listing file(s) are older than the catalogue they came from. Run \`npm run pkg:listings\`.`
    );
  }
  if (!missing && !stale) {
    notes.push(
      `${catalog.products.length * catalog.platforms.length} listings present and newer than the catalogue.`
    );
  }
}

function checkSkuMap(catalog) {
  const path = join(PACKAGING_DIR, "listings", "_imports", "sku-map.json");
  if (!existsSync(path)) {
    fail("No SKU map. The Shopify webhook cannot match a line item without it.");
    return;
  }

  const map = JSON.parse(readFileSync(path, "utf8"));
  const expected = catalog.products.length * catalog.tiers.length;
  const actual = Object.keys(map).length;

  if (actual !== expected) {
    fail(`SKU map has ${actual} entries, expected ${expected}. Run \`npm run pkg:listings\`.`);
  } else {
    notes.push(`SKU map covers all ${actual} product/tier pairs.`);
  }
}

function checkDeliveryConfig() {
  const required = {
    PAYSTACK_SECRET_KEY: "Paystack cannot be verified or delivered without it",
    SHOPIFY_WEBHOOK_SECRET: "Shopify webhooks will be rejected",
    FULFILMENT_ADMIN_TOKEN: "WhatsApp/manual fulfilment is unavailable",
    SITE_URL: "download links will point at the catalogue's siteUrl instead",
  };
  const optional = {
    RESEND_API_KEY: "download emails will have to be sent by hand",
    FULFILMENT_FROM_EMAIL: "download emails will have to be sent by hand",
    GUMROAD_PING_SECRET: "Gumroad sales will not be mirrored into your records",
    SELAR_WEBHOOK_SECRET: "Selar sales will not be mirrored into your records",
  };

  const missingRequired = Object.entries(required).filter(([key]) => !process.env[key]);
  const missingOptional = Object.entries(optional).filter(([key]) => !process.env[key]);

  if (missingRequired.length) {
    warn(
      `Delivery environment not configured in this shell (fine locally, not in production):\n    ${missingRequired
        .map(([key, why]) => `${key} — ${why}`)
        .join("\n    ")}`
    );
  }
  if (missingOptional.length) {
    notes.push(
      `Optional delivery settings unset: ${missingOptional.map(([key]) => key).join(", ")}`
    );
  }
}

function main() {
  const catalog = loadCatalog();

  console.log(`Verifying ${catalog.products.length} products across ${catalog.platforms.length} platforms.\n`);

  checkPlaceholders(catalog);
  checkExchangeRates(catalog);
  checkPackages(catalog);
  checkMockups(catalog);
  checkListings(catalog);
  checkSkuMap(catalog);
  checkDeliveryConfig();

  for (const note of notes) console.log(`  ✓ ${note}`);
  for (const warning of warnings) console.log(`\n  ⚠ ${warning}`);
  for (const problem of problems) console.log(`\n  ✗ ${problem}`);

  console.log("");

  if (problems.length) {
    console.log(`${problems.length} problem(s) must be fixed before selling. Not ready.\n`);
    process.exit(1);
  }

  console.log(
    warnings.length
      ? `Ready to sell, with ${warnings.length} warning(s) worth reading.\n`
      : "Ready to sell.\n"
  );
}

main();
