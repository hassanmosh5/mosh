/**
 * Serves the generated store imagery.
 *
 * Marketplaces and the WhatsApp catalogue feed need public image URLs, and the
 * images are build output rather than source, so they live in dist/ and are
 * served from here instead of being committed into public/.
 */

import { existsSync, readFileSync, statSync } from "node:fs";
import { join, normalize } from "node:path";
import { NextResponse } from "next/server";

import { findProduct, packageRoot } from "@/lib/fulfilment/catalog";

export const runtime = "nodejs";

const ALLOWED = /^(cover|square|story|gallery-[1-9])\.png$/;

export async function GET(_request: Request, ctx: RouteContext<"/mockups/[slug]/[file]">) {
  const { slug, file } = await ctx.params;

  // Both halves are checked against a whitelist, so no input reaches the path
  // join that has not already been proven to be a catalogue slug and one of a
  // fixed set of filenames.
  if (!findProduct(slug) || !ALLOWED.test(file)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const path = normalize(join(packageRoot(), "mockups", slug, file));
  if (!path.startsWith(join(packageRoot(), "mockups")) || !existsSync(path)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = readFileSync(path);
  return new NextResponse(new Uint8Array(body), {
    headers: {
      "Content-Type": "image/png",
      "Content-Length": String(statSync(path).size),
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
