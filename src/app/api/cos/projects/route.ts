import { route, readJson } from "@/lib/cos/api";
import { listProjects, createProject } from "@/lib/cos/services/projects";
import { projectCreateSchema } from "@/lib/cos/schemas";

export const GET = route({ permission: "project:read" }, async (ctx) => ({
  items: await listProjects(ctx),
}));

export const POST = route({ permission: "project:write" }, async (ctx, request) => {
  const input = await readJson(request, projectCreateSchema);
  return createProject(ctx, input);
});
