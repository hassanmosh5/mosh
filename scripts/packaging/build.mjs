#!/usr/bin/env node
/**
 * Builds the customer-ready download packages.
 *
 * For every product × tier it stages a folder, writes the documents a buyer
 * opens first, records a SHA-256 for every file, and zips it. Bundles are
 * staged the same way from the products they contain.
 *
 * The output manifest (dist/packages/manifest.json) is what the download
 * endpoint reads at fulfilment time, so a package that is not in the manifest
 * cannot be sold — which is the intended failure mode.
 *
 *   npm run pkg:build
 */

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, dirname, relative } from "node:path";

import { DIST_DIR, ROOT, loadCatalog, formatMoney } from "./catalog.mjs";
import {
  clientBrief,
  deliveryChecklist,
  licence,
  receiptNote,
  startHere,
  usageGuide,
  whiteLabelNotes,
} from "./documents.mjs";

const PACKAGES_DIR = join(DIST_DIR, "packages");

/** A fixed timestamp so rebuilding an unchanged product yields an identical zip. */
const EPOCH = "202601010000.00";

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function walk(dir, base = dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name)
  )) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, base));
    else out.push({ path: relative(base, full), full, size: statSync(full).size });
  }
  return out;
}

function write(path, contents) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents);
}

function humanSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/** The file list a buyer can check their download against. */
function manifestDocument(name, files, catalog) {
  const rows = files
    .map((file) => `${file.path.padEnd(42)} ${humanSize(file.size).padStart(10)}  ${file.sha256}`)
    .join("\n");
  const total = files.reduce((sum, file) => sum + file.size, 0);

  return `WHAT IS INCLUDED — ${name}
${"=".repeat(60)}

${files.length} files, ${humanSize(total)} unpacked.

Every file, its size, and its SHA-256 checksum. Publishing this before payment
is deliberate: you should know exactly what you are buying, and you should be
able to verify that what arrived is what was promised.

To check a file yourself:

  macOS / Linux:  shasum -a 256 <filename>
  Windows:        certutil -hashfile <filename> SHA256

FILE                                             SIZE  SHA-256
${"-".repeat(120)}
${rows}

Generated ${new Date().toISOString().slice(0, 10)} · ${catalog.meta.brand}
`;
}

function stageProduct(product, tier, catalog, stageDir) {
  const entry = product.entry ?? "index.html";
  const sourceDir = join(ROOT, product.dir);

  // The product itself, minus anything that is ours rather than the buyer's.
  cpSync(sourceDir, stageDir, {
    recursive: true,
    filter: (src) => {
      const name = src.split("/").pop();
      return !["build.mjs", "template.html", "sell", ".DS_Store"].includes(name);
    },
  });

  for (const extra of product.extraFiles) {
    const dest = join(stageDir, extra.to);
    mkdirSync(dirname(dest), { recursive: true });
    cpSync(join(ROOT, extra.from), dest);
  }

  write(join(stageDir, "START-HERE.md"), startHere(product, tier, catalog));
  write(join(stageDir, "USAGE.md"), usageGuide(product, tier, catalog));
  write(join(stageDir, "LICENCE.txt"), licence(product, tier, catalog));

  if (tier.clientWork) {
    write(join(stageDir, "client", "CLIENT-BRIEF.md"), clientBrief(product, catalog));
    write(join(stageDir, "client", "DELIVERY-CHECKLIST.md"), deliveryChecklist(product));
  }
  if (tier.id === "agency") {
    write(join(stageDir, "white-label", "WHITE-LABEL-NOTES.md"), whiteLabelNotes(product, catalog));
  }

  if (!existsSync(join(stageDir, entry))) {
    throw new Error(`${product.slug}: entry "${entry}" missing after staging`);
  }
}

function zipFolder(stageDir, zipPath, innerName) {
  rmSync(zipPath, { force: true });
  mkdirSync(dirname(zipPath), { recursive: true });

  // Fixed mtimes keep the archive byte-identical between builds.
  execFileSync("find", [stageDir, "-exec", "touch", "-t", EPOCH, "{}", "+"]);
  execFileSync("zip", ["-r", "-q", "-X", "-9", zipPath, innerName], {
    cwd: dirname(stageDir),
  });
}

function buildProduct(product, catalog, results) {
  for (const tier of product.tiers) {
    const innerName = `${product.slug}-${tier.id}`;
    const workDir = join(PACKAGES_DIR, ".stage", product.slug);
    const stageDir = join(workDir, innerName);

    rmSync(stageDir, { recursive: true, force: true });
    mkdirSync(stageDir, { recursive: true });

    stageProduct(product, tier, catalog, stageDir);

    // Checksums are computed before the manifest document is written, then the
    // document is added; it lists everything except itself, which is the only
    // file whose hash cannot include its own hash.
    const files = walk(stageDir).map((file) => ({ ...file, sha256: sha256(file.full) }));
    write(
      join(stageDir, "WHATS-INCLUDED.txt"),
      manifestDocument(`${product.name} — ${tier.name}`, files, catalog)
    );

    const zipPath = join(PACKAGES_DIR, product.slug, `${innerName}.zip`);
    zipFolder(stageDir, zipPath, innerName);

    write(
      join(PACKAGES_DIR, product.slug, `receipt-${tier.id}.txt`),
      receiptNote(product, tier, catalog)
    );

    results.push({
      kind: "product",
      slug: product.slug,
      name: product.name,
      tier: tier.id,
      tierName: tier.name,
      file: relative(DIST_DIR, zipPath),
      bytes: statSync(zipPath).size,
      sha256: sha256(zipPath),
      fileCount: files.length + 1,
      priceUsd: tier.pricing.usd,
      priceGhs: tier.pricing.ghs,
      priceNgn: tier.pricing.ngn,
    });

    rmSync(stageDir, { recursive: true, force: true });
  }
}

function bundleIndex(bundle, products, catalog) {
  const rows = products
    .map(
      (product) =>
        `| ${product.category.glyph} ${product.name} | \`${product.slug}/\` | ${product.tagline} |`
    )
    .join("\n");

  return `# ${bundle.name}

**${bundle.tagline}**

${bundle.pitch}

${products.length} tools. Bought separately they come to ${formatMoney(bundle.sumUsd, "USD")};
this bundle is ${formatMoney(bundle.priceUsd, "USD")}.

## Where to start

Do not open all of them. Pick the one that matches the decision in front of you
this week, use it properly, and come back for the next one when there is a next
one. A folder of thirty-eight tools opened at once is a folder of thirty-eight
tabs closed at once.

| Tool | Folder | What it is for |
|---|---|---|
${rows}

## Every folder is the same shape

\`START-HERE.md\` first, then \`index.html\` for the tool itself, \`USAGE.md\` for the
full instructions, \`LICENCE.txt\` for what you may do with it.

## Support

${catalog.meta.supportEmail} — ${catalog.policies.supportPromise}

${catalog.policies.refundText}

---
*${catalog.meta.brand} · ${catalog.meta.seller}*
`;
}

function buildBundle(bundle, catalog, results) {
  const tier = catalog.tiers.find((t) => t.default) ?? catalog.tiers[0];
  const products = bundle.productSlugs.map((slug) =>
    catalog.products.find((p) => p.slug === slug)
  );

  const innerName = `${bundle.slug}-bundle`;
  const workDir = join(PACKAGES_DIR, ".stage", `bundle-${bundle.slug}`);
  const stageDir = join(workDir, innerName);

  rmSync(stageDir, { recursive: true, force: true });
  mkdirSync(stageDir, { recursive: true });

  for (const product of products) {
    stageProduct(product, tier, catalog, join(stageDir, product.slug));
  }

  write(join(stageDir, "README.md"), bundleIndex(bundle, products, catalog));
  write(
    join(stageDir, "LICENCE.txt"),
    licence({ name: bundle.name, proof: "" }, tier, catalog)
  );

  const files = walk(stageDir).map((file) => ({ ...file, sha256: sha256(file.full) }));
  write(join(stageDir, "WHATS-INCLUDED.txt"), manifestDocument(bundle.name, files, catalog));

  const zipPath = join(PACKAGES_DIR, "bundles", `${innerName}.zip`);
  zipFolder(stageDir, zipPath, innerName);

  results.push({
    kind: "bundle",
    slug: bundle.slug,
    name: bundle.name,
    tier: tier.id,
    tierName: tier.name,
    file: relative(DIST_DIR, zipPath),
    bytes: statSync(zipPath).size,
    sha256: sha256(zipPath),
    fileCount: files.length + 1,
    priceUsd: bundle.priceUsd,
    priceGhs: Math.ceil((bundle.priceUsd * catalog.currency.ghsPerUsd) / 10) * 10,
    priceNgn: Math.ceil((bundle.priceUsd * catalog.currency.ngnPerUsd) / 500) * 500,
    includes: bundle.productSlugs,
  });

  rmSync(stageDir, { recursive: true, force: true });
}

function main() {
  const catalog = loadCatalog();
  const only = process.argv.slice(2).filter((arg) => !arg.startsWith("-"));
  const skipBundles = process.argv.includes("--no-bundles");

  const products = only.length
    ? catalog.products.filter((p) => only.includes(p.slug))
    : catalog.products;

  if (only.length && products.length !== only.length) {
    const missing = only.filter((slug) => !catalog.products.some((p) => p.slug === slug));
    throw new Error(`Unknown product slug(s): ${missing.join(", ")}`);
  }

  rmSync(join(PACKAGES_DIR, ".stage"), { recursive: true, force: true });
  mkdirSync(PACKAGES_DIR, { recursive: true });

  const results = [];
  for (const product of products) {
    buildProduct(product, catalog, results);
    process.stdout.write(`  ✓ ${product.slug}\n`);
  }

  if (!only.length && !skipBundles) {
    for (const bundle of catalog.bundles) {
      buildBundle(bundle, catalog, results);
      process.stdout.write(`  ✓ bundle: ${bundle.slug}\n`);
    }
  }

  rmSync(join(PACKAGES_DIR, ".stage"), { recursive: true, force: true });

  const manifestPath = join(PACKAGES_DIR, "manifest.json");
  const previous =
    !only.length || !existsSync(manifestPath)
      ? { packages: [] }
      : JSON.parse(readFileSync(manifestPath, "utf8"));

  // A partial build must not delete the entries it did not rebuild.
  const merged = [
    ...previous.packages.filter(
      (entry) => !results.some((r) => r.slug === entry.slug && r.tier === entry.tier)
    ),
    ...results,
  ].sort((a, b) => `${a.slug}${a.tier}`.localeCompare(`${b.slug}${b.tier}`));

  write(
    manifestPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        brand: catalog.meta.brand,
        packages: merged,
      },
      null,
      2
    ) + "\n"
  );

  const totalBytes = results.reduce((sum, entry) => sum + entry.bytes, 0);
  console.log(
    `\n${results.length} packages built (${humanSize(totalBytes)}) → ${relative(ROOT, PACKAGES_DIR)}`
  );
  console.log(`Manifest: ${relative(ROOT, manifestPath)} (${merged.length} entries)`);
}

main();
