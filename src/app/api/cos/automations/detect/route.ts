import { route } from "@/lib/cos/api";
import { detectAutomationCandidates } from "@/lib/cos/services/automations";

export const GET = route({ permission: "automation:read" }, async (ctx) => ({
  candidates: await detectAutomationCandidates(ctx),
}));
