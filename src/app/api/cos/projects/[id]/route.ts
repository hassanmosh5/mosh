import { route, readJson } from "@/lib/cos/api";
import { getProject, updateProject, deleteProject } from "@/lib/cos/services/projects";
import { projectUpdateSchema } from "@/lib/cos/schemas";

export const GET = route<{ id: string }>({ permission: "project:read" }, async (ctx, _request, { id }) =>
  getProject(ctx, id)
);

export const PATCH = route<{ id: string }>({ permission: "project:write" }, async (ctx, request, { id }) => {
  const input = await readJson(request, projectUpdateSchema);
  return updateProject(ctx, id, input);
});

export const DELETE = route<{ id: string }>({ permission: "project:delete" }, async (ctx, _request, { id }) =>
  deleteProject(ctx, id)
);
