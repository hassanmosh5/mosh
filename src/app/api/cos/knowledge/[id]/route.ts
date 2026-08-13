import { route, readJson } from "@/lib/cos/api";
import { getKnowledgeDocument, updateKnowledgeDocument, deleteKnowledgeDocument } from "@/lib/cos/services/knowledge";
import { knowledgeUpdateSchema } from "@/lib/cos/schemas";

export const GET = route<{ id: string }>({ permission: "knowledge:read" }, async (ctx, _request, { id }) =>
  getKnowledgeDocument(ctx, id)
);

export const PATCH = route<{ id: string }>({ permission: "knowledge:write" }, async (ctx, request, { id }) => {
  const input = await readJson(request, knowledgeUpdateSchema);
  return updateKnowledgeDocument(ctx, id, input);
});

export const DELETE = route<{ id: string }>({ permission: "knowledge:delete" }, async (ctx, _request, { id }) =>
  deleteKnowledgeDocument(ctx, id)
);
