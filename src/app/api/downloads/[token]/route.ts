/**
 * The download itself.
 *
 * Streams the ZIP from disk after claiming one use of the grant. The claim
 * happens before the stream opens, so an interrupted download still counts —
 * which is why the limit is generous rather than tight, and why the page that
 * links here says how many are left.
 */

import { createReadStream, existsSync } from "node:fs";
import type { ReadableOptions } from "node:stream";
import { NextResponse } from "next/server";

import { findPackage, packageFilePath } from "@/lib/fulfilment/catalog";
import { claimDownload } from "@/lib/fulfilment/grants";
import { looksLikeToken } from "@/lib/fulfilment/tokens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MESSAGES: Record<string, { status: number; message: string }> = {
  "not-found": { status: 404, message: "This download link is not valid." },
  revoked: { status: 410, message: "This download was revoked, usually because the order was refunded." },
  expired: { status: 410, message: "This link has expired. Email support and we will issue a new one." },
  exhausted: {
    status: 429,
    message: "This link has been used its maximum number of times. Email support for a new one.",
  },
};

function toWebStream(path: string, options?: ReadableOptions): ReadableStream<Uint8Array> {
  const nodeStream = createReadStream(path, options);
  return new ReadableStream({
    start(controller) {
      nodeStream.on("data", (chunk) => controller.enqueue(new Uint8Array(chunk as Buffer)));
      nodeStream.on("end", () => controller.close());
      nodeStream.on("error", (error) => controller.error(error));
    },
    cancel() {
      nodeStream.destroy();
    },
  });
}

export async function GET(request: Request, ctx: RouteContext<"/api/downloads/[token]">) {
  const { token } = await ctx.params;

  if (!looksLikeToken(token)) {
    return NextResponse.json({ error: MESSAGES["not-found"].message }, { status: 404 });
  }

  const claim = await claimDownload(token, {
    ip:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip"),
    userAgent: request.headers.get("user-agent"),
  });

  if (!claim.ok) {
    const { status, message } = MESSAGES[claim.reason];
    return NextResponse.json({ error: message }, { status });
  }

  const grant = claim.grant;
  const entry = findPackage(grant.productSlug, grant.tier);

  if (!entry) {
    console.error(
      `[download] grant ${grant.id} points at ${grant.productSlug}/${grant.tier}, which is not in the build manifest`
    );
    return NextResponse.json(
      { error: "That file is temporarily unavailable. Email support — your link is still valid." },
      { status: 503 }
    );
  }

  const path = packageFilePath(entry);
  if (!existsSync(path)) {
    console.error(`[download] manifest lists ${entry.file} but it is not on this server`);
    return NextResponse.json(
      { error: "That file is temporarily unavailable. Email support — your link is still valid." },
      { status: 503 }
    );
  }

  const filename = entry.file.split("/").pop() ?? `${grant.productSlug}.zip`;

  return new NextResponse(toWebStream(path), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Length": String(entry.bytes),
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store, private",
      "X-Content-Type-Options": "nosniff",
      // Lets a buyer verify the download against WHATS-INCLUDED.txt.
      "X-Checksum-Sha256": entry.sha256,
    },
  });
}
