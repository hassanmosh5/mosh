#!/usr/bin/env node
/**
 * Generate the MOSH PWA icons.
 *
 * The mark is three concentric rings — mental, spiritual, physical — around a
 * solid centre: the planes aligned. It is drawn here rather than shipped as a
 * binary blob so the brand asset is reviewable, diffable, and regenerable at
 * any size with `node scripts/generate-mosh-icons.mjs`.
 *
 * PNGs are written with Node's built-in zlib; no image dependency is required.
 * Rendering is supersampled 4x and box-filtered down, which is what gives the
 * curves clean edges.
 */

import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "icons");

const EMERALD = [15, 118, 110]; // #0f766e
const DEEP = [11, 93, 86]; // #0b5d56
const CREAM = [250, 246, 238]; // #faf6ee
const GOLD = [224, 180, 99]; // #e0b463

const SS = 4; // supersampling factor

// ── PNG encoding ─────────────────────────────────────────────────────────────

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "latin1"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

/** Encode RGBA pixel data (Uint8Array, size*size*4) as a PNG buffer. */
function encodePng(pixels, size) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // bit depth
  header[9] = 6; // colour type: RGBA
  header[10] = 0; // deflate
  header[11] = 0; // adaptive filtering
  header[12] = 0; // no interlace

  // One filter byte (0 = None) in front of every scanline.
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y += 1) {
    const rowStart = y * (size * 4 + 1);
    raw[rowStart] = 0;
    pixels.copy(raw, rowStart + 1, y * size * 4, (y + 1) * size * 4);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ── Drawing ──────────────────────────────────────────────────────────────────

function blend(target, offset, colour, alpha) {
  if (alpha <= 0) return;
  const a = Math.min(1, alpha);
  for (let i = 0; i < 3; i += 1) {
    target[offset + i] = Math.round(target[offset + i] * (1 - a) + colour[i] * a);
  }
  target[offset + 3] = Math.round(target[offset + 3] * (1 - a) + 255 * a);
}

/**
 * Render the mark at `size` pixels.
 *
 * `maskable` fills the whole square (Android crops it to whatever shape the
 * launcher uses) and shrinks the mark into the 80% safe zone; otherwise the
 * background is a rounded square.
 */
function renderIcon(size, { maskable = false } = {}) {
  const dim = size * SS;
  const buffer = Buffer.alloc(dim * dim * 4, 0);

  const radius = maskable ? 0 : dim * 0.22;
  const centre = dim / 2;
  const markScale = maskable ? 0.62 : 0.78;

  // Ring geometry: outer -> inner, cream with a gold innermost accent.
  const rings = [
    { r: dim * 0.34 * markScale, width: dim * 0.055 * markScale, colour: CREAM, alpha: 1 },
    { r: dim * 0.235 * markScale, width: dim * 0.05 * markScale, colour: CREAM, alpha: 0.78 },
    { r: dim * 0.135 * markScale, width: dim * 0.045 * markScale, colour: GOLD, alpha: 0.95 },
  ];
  const core = dim * 0.055 * markScale;

  for (let y = 0; y < dim; y += 1) {
    for (let x = 0; x < dim; x += 1) {
      const offset = (y * dim + x) * 4;

      // Background: rounded square, with a soft vertical shade for depth.
      let inside = true;
      if (radius > 0) {
        const dx = Math.max(radius - x, x - (dim - radius), 0);
        const dy = Math.max(radius - y, y - (dim - radius), 0);
        inside = dx * dx + dy * dy <= radius * radius;
      }
      if (!inside) continue;

      const shade = y / dim;
      const background = [
        Math.round(EMERALD[0] * (1 - shade) + DEEP[0] * shade),
        Math.round(EMERALD[1] * (1 - shade) + DEEP[1] * shade),
        Math.round(EMERALD[2] * (1 - shade) + DEEP[2] * shade),
      ];
      buffer[offset] = background[0];
      buffer[offset + 1] = background[1];
      buffer[offset + 2] = background[2];
      buffer[offset + 3] = 255;

      const distance = Math.hypot(x - centre, y - centre);

      for (const ring of rings) {
        if (Math.abs(distance - ring.r) <= ring.width / 2) {
          blend(buffer, offset, ring.colour, ring.alpha);
        }
      }

      if (distance <= core) blend(buffer, offset, CREAM, 1);
    }
  }

  // Box-filter down to the requested size.
  const out = Buffer.alloc(size * size * 4, 0);
  const samples = SS * SS;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let sy = 0; sy < SS; sy += 1) {
        for (let sx = 0; sx < SS; sx += 1) {
          const offset = ((y * SS + sy) * dim + (x * SS + sx)) * 4;
          const alpha = buffer[offset + 3] / 255;
          r += buffer[offset] * alpha;
          g += buffer[offset + 1] * alpha;
          b += buffer[offset + 2] * alpha;
          a += alpha;
        }
      }
      const offset = (y * size + x) * 4;
      if (a > 0) {
        out[offset] = Math.round(r / a);
        out[offset + 1] = Math.round(g / a);
        out[offset + 2] = Math.round(b / a);
      }
      out[offset + 3] = Math.round((a / samples) * 255);
    }
  }

  return encodePng(out, size);
}

const targets = [
  { file: "icon-192.png", size: 192, options: {} },
  { file: "icon-512.png", size: 512, options: {} },
  { file: "maskable-512.png", size: 512, options: { maskable: true } },
  { file: "apple-touch-icon.png", size: 180, options: { maskable: true } },
];

mkdirSync(OUT_DIR, { recursive: true });
for (const target of targets) {
  const png = renderIcon(target.size, target.options);
  writeFileSync(join(OUT_DIR, target.file), png);
  console.log(`wrote public/icons/${target.file} (${png.length} bytes)`);
}
