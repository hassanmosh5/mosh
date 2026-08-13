import { route, readJson } from "@/lib/cos/api";
import { reportRequestSchema } from "@/lib/cos/schemas";
import { generateReport, listReports } from "@/lib/cos/services/reports";

export const maxDuration = 300;

export const GET = route({ permission: "report:read" }, async (ctx) => ({
  items: await listReports(ctx),
}));

export const POST = route({ permission: "report:write", limit: "ai" }, async (ctx, request) => {
  const input = await readJson(request, reportRequestSchema);
  return generateReport(ctx, input);
});
