import { readQuery, route } from "@/lib/mosh/api";
import { exportQuerySchema } from "@/lib/mosh/schemas";
import { buildExport } from "@/lib/mosh/services/export";

/**
 * CSV and PDF exports.
 *
 * The response is streamed straight to a download with an explicit filename —
 * `Content-Disposition` is what turns a fetch into a file the user owns.
 */
export const GET = route({}, async (ctx, request) => {
  const query = readQuery(request, exportQuerySchema);
  const result = await buildExport(ctx, query);

  return new Response(result.body as BodyInit, {
    headers: {
      "Content-Type": result.contentType,
      "Content-Disposition": `attachment; filename="${result.filename}"`,
      "Cache-Control": "no-store",
    },
  });
});
