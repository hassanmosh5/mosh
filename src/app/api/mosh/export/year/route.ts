import { route } from "@/lib/mosh/api";
import { buildYearReport } from "@/lib/mosh/services/export";

/** The full-year PDF report: every module, one document. */
export const GET = route({}, async (ctx) => {
  const result = await buildYearReport(ctx);

  return new Response(result.body as BodyInit, {
    headers: {
      "Content-Type": result.contentType,
      "Content-Disposition": `attachment; filename="${result.filename}"`,
      "Cache-Control": "no-store",
    },
  });
});
