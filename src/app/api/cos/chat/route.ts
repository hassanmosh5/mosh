import { route, readJson } from "@/lib/cos/api";
import { chatRequestSchema } from "@/lib/cos/schemas";
import { sendChatMessage } from "@/lib/cos/ai/orchestrator";

export const maxDuration = 300;

export const POST = route({ permission: "agent:run", limit: "ai" }, async (ctx, request) => {
  const input = await readJson(request, chatRequestSchema);
  return sendChatMessage(ctx, input);
});
