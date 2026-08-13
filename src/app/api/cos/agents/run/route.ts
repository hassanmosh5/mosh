import { route, readJson } from "@/lib/cos/api";
import { agentRunSchema } from "@/lib/cos/schemas";
import { orchestrate } from "@/lib/cos/ai/orchestrator";

export const maxDuration = 300;

export const POST = route({ permission: "agent:run", limit: "agent" }, async (ctx, request) => {
  const input = await readJson(request, agentRunSchema);
  return orchestrate(ctx, input);
});
