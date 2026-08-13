import { route, readJson } from "@/lib/cos/api";
import { listKnowledge, createKnowledgeDocument } from "@/lib/cos/services/knowledge";
import { knowledgeCreateSchema } from "@/lib/cos/schemas";

export const GET = route({ permission: "knowledge:read" }, async (ctx) => ({
  items: await listKnowledge(ctx),
}));

export const POST = route({ permission: "knowledge:write" }, async (ctx, request) => {
  const input = await readJson(request, knowledgeCreateSchema);
  return createKnowledgeDocument(ctx, input);
});
