import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  createWorkspace, destroyWorkspace, disconnect, hasDatabase, prisma, withRole,
  type TestWorkspace,
} from "./setup";
import { executeTool, TOOLS, toolsForContext } from "@/lib/cos/ai/tools";
import { selectAgents } from "@/lib/cos/ai/orchestrator";
import { AGENT_SEEDS } from "@/lib/cos/ai/prompts";
import { createTask } from "@/lib/cos/services/tasks";
import { taskCreateSchema } from "@/lib/cos/schemas";

const describeDb = hasDatabase ? describe : describe.skip;

describeDb("AI tool layer", () => {
  let workspace: TestWorkspace;

  beforeAll(async () => {
    workspace = await createWorkspace("AI Studio");
    await prisma.aIAgent.createMany({
      data: AGENT_SEEDS.map((agent) => ({
        businessId: workspace.businessId,
        key: agent.key,
        name: agent.name,
        role: agent.role,
        description: agent.description,
        systemPrompt: agent.systemPrompt,
        capabilities: agent.capabilities,
        allowedTools: agent.allowedTools,
      })),
    });
  });

  afterAll(async () => {
    await destroyWorkspace(workspace);
    await disconnect();
  });

  describe("tool exposure", () => {
    it("hides write tools from a viewer", () => {
      const names = toolsForContext(withRole(workspace, "VIEWER")).map((tool) => tool.name);
      expect(names).toContain("get_dashboard");
      expect(names).not.toContain("create_task");
      expect(names).not.toContain("update_lead");
    });

    it("gives the owner the full surface", () => {
      const names = toolsForContext(workspace.ctx).map((tool) => tool.name);
      expect(names).toContain("create_task");
      expect(names).toContain("get_financials");
      expect(names).toContain("request_approval");
    });

    it("narrows the surface to an agent's allow-list but always keeps approvals", () => {
      const names = toolsForContext(workspace.ctx, ["get_dashboard", "create_task"]).map((t) => t.name);
      expect(names.sort()).toEqual(["create_task", "get_dashboard", "request_approval"].sort());
    });

    it("declares an input schema for every tool", () => {
      for (const tool of TOOLS) {
        expect(tool.inputSchema.type).toBe("object");
        expect(tool.description.length).toBeGreaterThan(40);
      }
    });
  });

  describe("tool execution", () => {
    it("runs a read tool and returns real data", async () => {
      await createTask(workspace.ctx, taskCreateSchema.parse({ title: "Tool visible task" }));
      const result = await executeTool(workspace.ctx, "get_tasks", { take: 10 });
      expect(result.ok).toBe(true);
      const payload = result.result as { items: { title: string }[] };
      expect(payload.items.some((item) => item.title === "Tool visible task")).toBe(true);
    });

    it("creates a task through the tool layer and marks its origin as AI", async () => {
      const result = await executeTool(
        workspace.ctx,
        "create_task",
        { title: "Created by the agent", priority: "HIGH" },
        { agentKey: "strategy" }
      );
      expect(result.ok).toBe(true);
      const created = await prisma.task.findFirst({
        where: { businessId: workspace.businessId, title: "Created by the agent" },
      });
      expect(created?.origin).toBe("AI");
    });

    it("refuses a write tool for a viewer and records the denial", async () => {
      const viewer = withRole(workspace, "VIEWER");
      const result = await executeTool(viewer, "create_task", { title: "Should not exist" });
      expect(result.ok).toBe(false);
      expect(JSON.stringify(result.result)).toContain("Permission denied");

      const created = await prisma.task.findFirst({
        where: { businessId: workspace.businessId, title: "Should not exist" },
      });
      expect(created).toBeNull();

      const denial = await prisma.auditLog.findFirst({
        where: { businessId: workspace.businessId, action: "ai.tool.create_task", result: "DENIED" },
      });
      expect(denial).not.toBeNull();
    });

    it("rejects an unknown tool name instead of throwing", async () => {
      const result = await executeTool(workspace.ctx, "drop_database", {});
      expect(result.ok).toBe(false);
      expect(JSON.stringify(result.result)).toContain("Unknown tool");
    });

    it("rejects invalid arguments with field-level detail", async () => {
      const result = await executeTool(workspace.ctx, "create_task", { title: "" });
      expect(result.ok).toBe(false);
      expect(JSON.stringify(result.result)).toContain("Invalid arguments");
    });

    it("turns a service error into a tool error rather than a crash", async () => {
      const result = await executeTool(workspace.ctx, "get_project", { projectId: "does-not-exist" });
      expect(result.ok).toBe(false);
      expect(JSON.stringify(result.result)).toContain("could not be found");
    });

    it("records an audit entry for every successful tool call", async () => {
      await executeTool(workspace.ctx, "get_dashboard", {}, { agentKey: "finance" });
      const log = await prisma.auditLog.findFirst({
        where: { businessId: workspace.businessId, action: "ai.tool.get_dashboard" },
        orderBy: { createdAt: "desc" },
      });
      expect(log?.actorKind).toBe("AI");
      expect(log?.actorLabel).toBe("finance");
    });

    it("requests approval instead of performing a sensitive action", async () => {
      const result = await executeTool(
        workspace.ctx,
        "request_approval",
        {
          action: "send_client_communication",
          summary: "Email Akosua about the outstanding product photography and offer a paid shoot.",
        },
        { agentKey: "customer-success" }
      );
      expect(result.ok).toBe(true);

      const approval = await prisma.approvalRequest.findFirst({
        where: { businessId: workspace.businessId, action: "send_client_communication" },
      });
      expect(approval?.status).toBe("PENDING");
      expect(JSON.stringify(result.result)).toContain("has NOT been performed");
    });

    it("stores a computed decision score, not one the caller supplies", async () => {
      const result = await executeTool(workspace.ctx, "score_decision", {
        title: "Launch a retainer offer",
        revenueImpact: 5, strategicFit: 5, customerValue: 4,
        cost: 2, timeToValue: 2, complexity: 2, risk: 2, automation: 4, scalability: 5,
      });
      expect(result.ok).toBe(true);
      const payload = result.result as { score: number; verdict: string };
      expect(payload.score).toBeGreaterThan(70);
      expect(payload.verdict).toBe("PURSUE");
    });

    it("upserts memory through the tool layer", async () => {
      await executeTool(workspace.ctx, "save_memory", {
        scope: "STRATEGIC",
        key: "focus_quarter",
        value: "Digital products over bespoke websites this quarter.",
      });
      const memory = await prisma.memory.findFirst({
        where: { businessId: workspace.businessId, key: "focus_quarter" },
      });
      expect(memory?.source).toBe("AI");
    });
  });

  describe("agent routing", () => {
    it("routes a pipeline question to the sales agent", async () => {
      const agents = await selectAgents(workspace.ctx, "Analyse my sales pipeline and tell me which deals are stalled");
      expect(agents.map((agent) => agent.key)).toContain("sales");
    });

    it("routes an automation question to the automation agent", async () => {
      const agents = await selectAgents(workspace.ctx, "What repetitive manual work should I automate?");
      expect(agents.map((agent) => agent.key)).toContain("automation");
    });

    it("routes a product launch to several specialists", async () => {
      const agents = await selectAgents(
        workspace.ctx,
        "Create a launch plan and marketing campaign for my new digital product"
      );
      expect(agents.length).toBeGreaterThan(1);
    });

    it("falls back to strategy when nothing matches", async () => {
      const agents = await selectAgents(workspace.ctx, "zxqv wibble");
      expect(agents.map((agent) => agent.key)).toEqual(["strategy"]);
    });

    it("returns nothing when the workspace has no agents", async () => {
      const empty = await createWorkspace("No Agents");
      try {
        expect(await selectAgents(empty.ctx, "anything")).toEqual([]);
      } finally {
        await destroyWorkspace(empty);
      }
    });
  });
});
