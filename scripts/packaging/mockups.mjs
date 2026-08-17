#!/usr/bin/env node
/**
 * Generates the store imagery for every product.
 *
 * The screenshots are of the real product, taken by driving headless Chromium
 * over the actual file — not a rendering of what the product might look like.
 * That matters commercially as well as ethically: a marketplace cover showing
 * the thing working outsells a stock photo of a laptop, and it cannot be
 * accused of misrepresenting what arrives.
 *
 *   npm run pkg:mockups            # all products
 *   npm run pkg:mockups launch-kit # one product
 */

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

import { Browser } from "./cdp.mjs";
import { DIST_DIR, ROOT, loadCatalog } from "./catalog.mjs";

const MOCKUPS_DIR = join(DIST_DIR, "mockups");

const ACCENTS = {
  decide: { base: "#c2601f", soft: "#f6e2d2", ink: "#2a1608" },
  package: { base: "#1f7a5a", soft: "#d8ece4", ink: "#0b241b" },
  agency: { base: "#2b5fa8", soft: "#dce6f5", ink: "#0d1d33" },
  growth: { base: "#a8342b", soft: "#f6dedb", ink: "#2e0f0c" },
  agents: { base: "#6b3fa0", soft: "#e7dcf4", ink: "#1f1230" },
  life: { base: "#8a6a12", soft: "#f2e8cc", ink: "#2a2005" },
};

const SERIF = `"Bitstream Charter","Liberation Serif",Georgia,"Times New Roman",serif`;
const SANS = `"Liberation Sans","DejaVu Sans",system-ui,-apple-system,"Segoe UI",sans-serif`;

const sizes = {
  cover: { width: 1280, height: 720 },
  square: { width: 1200, height: 1200 },
  story: { width: 1080, height: 1350 },
  gallery: { width: 1600, height: 1000 },
};

function escapeHtml(text) {
  return String(text).replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]
  );
}

/** Shared chrome for every composed image: fonts, palette, browser frame. */
function shell(accent, width, height, body) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{width:${width}px;height:${height}px;overflow:hidden}
body{
  background:
    radial-gradient(1200px 700px at 88% -10%, ${accent.base}44, transparent 60%),
    radial-gradient(900px 600px at -10% 110%, ${accent.base}22, transparent 55%),
    #14110d;
  color:#f6f2ec; font-family:${SANS}; -webkit-font-smoothing:antialiased;
  display:flex; position:relative;
}
body::after{
  content:""; position:absolute; inset:0; pointer-events:none;
  background:linear-gradient(115deg, transparent 55%, #00000055 100%);
}
.chip{
  display:inline-flex; align-items:center; align-self:flex-start; gap:.45em;
  background:${accent.base}; color:#fff; font-weight:700;
  font-size:15px; letter-spacing:.09em; text-transform:uppercase;
  padding:.42em .95em; border-radius:999px;
}
h1{font-family:${SERIF}; font-weight:700; letter-spacing:-.02em; line-height:1.03}
.tagline{color:#e8dfd2; line-height:1.35}
.badges{display:flex; flex-wrap:wrap; gap:10px}
.badge{
  border:1px solid #ffffff33; border-radius:10px; padding:.5em .8em;
  font-size:16px; color:#efe7db; background:#ffffff0d; white-space:nowrap;
}
.brand{
  display:flex; align-items:center; gap:.6em; color:#b9ae9d; font-size:17px;
  letter-spacing:.02em;
}
.brand .dot{width:9px;height:9px;border-radius:50%;background:${accent.base}}
.window{
  border-radius:14px; overflow:hidden; background:#0e0c09;
  box-shadow:0 40px 90px #000000a8, 0 0 0 1px #ffffff1f;
}
.window .bar{
  height:34px; background:#211d18; display:flex; align-items:center; gap:8px;
  padding:0 14px; border-bottom:1px solid #ffffff14;
}
.window .bar i{width:11px;height:11px;border-radius:50%;display:block}
.window .bar i:nth-child(1){background:#e05f52}
.window .bar i:nth-child(2){background:#e0b23f}
.window .bar i:nth-child(3){background:#4fb168}
.window .bar span{
  margin-left:10px; font-size:13px; color:#9b9083; font-family:${SANS};
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}
.window img{display:block; width:100%; height:auto}
.phone{
  border-radius:34px; padding:10px; background:#25211b;
  box-shadow:0 34px 80px #000000a8, 0 0 0 1px #ffffff1f;
}
.phone img{display:block; width:100%; border-radius:26px}
.price{font-family:${SERIF}; color:#fff}
.price small{font-family:${SANS}; color:#b9ae9d; font-weight:400}
</style></head><body>${body}</body></html>`;
}

function coverHtml(product, shotPath, accent) {
  const badges = ["Runs offline", "No account", "14-day refund"];
  return shell(
    accent,
    1280,
    720,
    `<div style="flex:0 0 45%; padding:54px 34px 46px 60px; display:flex; flex-direction:column; position:relative; z-index:2">
      <div class="chip">${escapeHtml(product.category.glyph)} ${escapeHtml(product.category.name)}</div>
      <h1 style="font-size:${product.name.length > 34 ? 42 : 52}px; margin:24px 0 16px; max-width:100%; overflow-wrap:break-word">${escapeHtml(product.name)}</h1>
      <p class="tagline" style="font-size:21px">${escapeHtml(product.tagline)}</p>
      <div class="badges" style="margin:auto 0 24px">
        ${badges.map((badge) => `<span class="badge">${escapeHtml(badge)}</span>`).join("")}
      </div>
      <div class="brand"><span class="dot"></span>${escapeHtml(product.brand)}</div>
    </div>
    <div style="flex:1; position:relative; z-index:2; display:flex; align-items:center">
      <div class="window" style="width:800px; margin-left:-6px">
        <div class="bar"><i></i><i></i><i></i><span>${escapeHtml(product.slug)}/index.html</span></div>
        <img src="${shotPath}" style="height:512px; object-fit:cover; object-position:top left">
      </div>
    </div>`
  );
}

function squareHtml(product, shotPath, accent) {
  return shell(
    accent,
    1200,
    1200,
    `<div style="width:100%; padding:70px 68px 62px; display:flex; flex-direction:column; gap:34px; position:relative; z-index:2">
      <div>
        <div class="chip">${escapeHtml(product.category.glyph)} ${escapeHtml(product.category.name)}</div>
        <h1 style="font-size:${product.name.length > 30 ? 54 : 64}px; margin:26px 0 16px">${escapeHtml(product.name)}</h1>
        <p class="tagline" style="font-size:26px; max-width:34ch">${escapeHtml(product.tagline)}</p>
      </div>
      <div class="window" style="width:100%">
        <div class="bar"><i></i><i></i><i></i><span>${escapeHtml(product.slug)}/index.html</span></div>
        <img src="${shotPath}" style="height:600px; object-fit:cover; object-position:top left">
      </div>
      <div style="margin-top:auto; display:flex; align-items:flex-end; justify-content:space-between; gap:20px">
        <div class="brand"><span class="dot"></span>${escapeHtml(product.brand)}</div>
        <div class="price" style="font-size:32px">${escapeHtml(product.priceLabel)} <small style="font-size:19px">one payment</small></div>
      </div>
    </div>`
  );
}

function storyHtml(product, mobileShotPath, accent) {
  return shell(
    accent,
    1080,
    1350,
    `<div style="width:100%; padding:72px 64px; display:flex; flex-direction:column; align-items:center; text-align:center; gap:38px; position:relative; z-index:2">
      <div class="chip">${escapeHtml(product.category.glyph)} ${escapeHtml(product.category.name)}</div>
      <h1 style="font-size:${product.name.length > 30 ? 52 : 62}px">${escapeHtml(product.name)}</h1>
      <p class="tagline" style="font-size:27px; max-width:24ch">${escapeHtml(product.tagline)}</p>
      <div class="phone" style="width:376px">
        <img src="${mobileShotPath}" style="height:600px; object-fit:cover; object-position:top center">
      </div>
      <div class="brand" style="margin-top:auto"><span class="dot"></span>${escapeHtml(product.brand)}</div>
    </div>`
  );
}

function galleryHtml(product, shotPath, caption, accent) {
  return shell(
    accent,
    1600,
    1000,
    `<div style="width:100%; padding:52px 60px; display:flex; flex-direction:column; gap:30px; position:relative; z-index:2">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:24px">
        <div>
          <div style="font-size:15px; letter-spacing:.14em; text-transform:uppercase; color:${accent.base}; font-weight:700">${escapeHtml(product.name)}</div>
          <div style="font-family:${SERIF}; font-size:38px; margin-top:8px">${escapeHtml(caption)}</div>
        </div>
        <div class="brand"><span class="dot"></span>${escapeHtml(product.brand)}</div>
      </div>
      <div class="window" style="width:100%">
        <div class="bar"><i></i><i></i><i></i><span>${escapeHtml(product.slug)}/index.html</span></div>
        <img src="${shotPath}" style="height:760px; object-fit:cover; object-position:top left">
      </div>
    </div>`
  );
}

/** For products that are documents rather than apps — nothing to screenshot. */
function documentCoverHtml(product, accent) {
  return shell(
    accent,
    1280,
    720,
    `<div style="width:100%; padding:70px 76px; display:flex; flex-direction:column; justify-content:space-between; position:relative; z-index:2">
      <div>
        <div class="chip">${escapeHtml(product.category.glyph)} ${escapeHtml(product.category.name)}</div>
        <h1 style="font-size:60px; margin:30px 0 20px; max-width:18ch">${escapeHtml(product.name)}</h1>
        <p class="tagline" style="font-size:26px; max-width:34ch">${escapeHtml(product.tagline)}</p>
      </div>
      <div style="display:flex; gap:14px; flex-wrap:wrap; max-width:70%">
        ${product.inside
          .slice(0, 3)
          .map(
            (item) =>
              `<span class="badge" style="font-size:17px; max-width:100%; white-space:normal">${escapeHtml(
                item.split("—")[0].trim()
              )}</span>`
          )
          .join("")}
      </div>
      <div class="brand"><span class="dot"></span>${escapeHtml(product.brand)}</div>
    </div>`
  );
}

async function compose(browser, html, outPath, size, tmpPath) {
  writeFileSync(tmpPath, html);
  await browser.setViewport(size.width, size.height, 1);
  await browser.goto(`file://${tmpPath}`, { settleMs: 300 });
  const png = await browser.screenshot({ width: size.width, height: size.height });
  writeFileSync(outPath, png);
  return png.length;
}

async function captureProduct(browser, product, catalog) {
  const outDir = join(MOCKUPS_DIR, product.slug);
  const rawDir = join(outDir, "screens");
  mkdirSync(rawDir, { recursive: true });

  const context = {
    ...product,
    brand: catalog.meta.brand,
    priceLabel: `$${product.priceUsd}`,
  };
  const accent = ACCENTS[product.category.id];
  const tmpPath = join(MOCKUPS_DIR, `.compose-${product.slug}.html`);
  const written = [];
  const warnings = [];

  const entry = product.entry ?? "index.html";
  const isApp = entry.endsWith(".html");

  if (!isApp) {
    written.push(
      await compose(browser, documentCoverHtml(context, accent), join(outDir, "cover.png"), sizes.cover, tmpPath)
    );
    rmSync(tmpPath, { force: true });
    return { slug: product.slug, images: 1, warnings: ["no screenshots — document product"] };
  }

  const url = `file://${join(ROOT, product.dir, entry)}`;

  // Desktop hero.
  await browser.setViewport(1440, 900, 1);
  await browser.goto(url, { settleMs: 900 });
  const heroPath = join(rawDir, "hero.png");
  writeFileSync(heroPath, await browser.screenshot({ width: 1440, height: 900 }));

  // One screenshot per named tab, clicked in the real app.
  const galleries = [];
  for (const [index, shot] of product.shots.entries()) {
    // Reload between shots. In apps where a choice replaces the screen rather
    // than switching a tab — the children's workbook, for one — the second
    // label does not exist until you are back at the start.
    if (index > 0) await browser.goto(url, { settleMs: 700 });
    const clicked = await browser.clickByLabel(shot.label);
    if (!clicked) {
      warnings.push(`tab "${shot.label}" not found`);
      continue;
    }
    const shotPath = join(rawDir, `shot-${index + 1}.png`);
    writeFileSync(shotPath, await browser.screenshot({ width: 1440, height: 900 }));
    galleries.push({ path: shotPath, caption: shot.label });
  }

  // Phone view — most buyers in these markets open things on a phone first.
  await browser.setViewport(390, 844, 2);
  await browser.goto(url, { settleMs: 900 });
  const mobilePath = join(rawDir, "mobile.png");
  writeFileSync(mobilePath, await browser.screenshot({ width: 390, height: 844 }));

  written.push(
    await compose(browser, coverHtml(context, `file://${heroPath}`, accent), join(outDir, "cover.png"), sizes.cover, tmpPath),
    await compose(browser, squareHtml(context, `file://${heroPath}`, accent), join(outDir, "square.png"), sizes.square, tmpPath),
    await compose(browser, storyHtml(context, `file://${mobilePath}`, accent), join(outDir, "story.png"), sizes.story, tmpPath)
  );

  for (const [index, gallery] of galleries.entries()) {
    written.push(
      await compose(
        browser,
        galleryHtml(context, `file://${gallery.path}`, gallery.caption, accent),
        join(outDir, `gallery-${index + 1}.png`),
        sizes.gallery,
        tmpPath
      )
    );
  }

  rmSync(tmpPath, { force: true });
  return { slug: product.slug, images: written.length, warnings };
}

async function main() {
  const catalog = loadCatalog();
  const only = process.argv.slice(2).filter((arg) => !arg.startsWith("-"));
  const products = only.length
    ? catalog.products.filter((p) => only.includes(p.slug))
    : catalog.products;

  if (!products.length) throw new Error(`No products matched: ${only.join(", ")}`);

  mkdirSync(MOCKUPS_DIR, { recursive: true });
  const browser = await Browser.launch();
  const report = [];

  try {
    for (const product of products) {
      const result = await captureProduct(browser, product, catalog);
      report.push(result);
      const flag = result.warnings.length ? ` ⚠ ${result.warnings.join("; ")}` : "";
      process.stdout.write(`  ✓ ${product.slug} (${result.images} images)${flag}\n`);
    }
  } finally {
    await browser.close();
  }

  writeFileSync(
    join(MOCKUPS_DIR, "report.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), products: report }, null, 2) + "\n"
  );

  const images = report.reduce((sum, entry) => sum + entry.images, 0);
  const missing = report.filter((entry) => entry.warnings.length);
  console.log(`\n${images} images → ${relative(ROOT, MOCKUPS_DIR)}`);
  if (missing.length) {
    console.log(
      `\n${missing.length} product(s) had a tab label that did not match. Fix the "shots" labels in packaging/products/*.json:`
    );
    for (const entry of missing) console.log(`  ${entry.slug}: ${entry.warnings.join("; ")}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
