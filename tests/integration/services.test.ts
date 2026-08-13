import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  createWorkspace, destroyWorkspace, disconnect, hasDatabase, prisma,
  type TestWorkspace,
} from "./setup";
import { createTask, deleteTask, getTask, listTasks, updateTask } from "@/lib/cos/services/tasks";
import { createProject, recomputeProjectHealth } from "@/lib/cos/services/projects";
import { createClient, createLead, getPipeline, updateLead } from "@/lib/cos/services/crm";
import { createKnowledgeDocument, searchKnowledge, upsertMemory, retrieveMemories } from "@/lib/cos/services/knowledge";
import { createAutomation, detectAutomationCandidates } from "@/lib/cos/services/automations";
import { refreshNotifications } from "@/lib/cos/notifications";
import { getBriefing, getExecutiveSnapshot } from "@/lib/cos/dashboard";
import { taskCreateSchema, projectCreateSchema, leadCreateSchema, knowledgeCreateSchema, memoryCreateSchema, automationCreateSchema, clientCreateSchema } from "@/lib/cos/schemas";
import { AppError } from "@/lib/cos/errors";

const describeDb = hasDatabase ? describe : describe.skip;

const day = (offset: number) => new Date(Date.now() + offset * 86_400_000);
const task = (input: Record<string, unknown>) => taskCreateSchema.parse(input);

describeDb("service layer against a real database", () => {
  let alpha: TestWorkspace;
  let beta: TestWorkspace;

  beforeAll(async () => {
    alpha = await createWorkspace("Alpha Studio");
    beta = await createWorkspace("Beta Studio");
  });

  afterAll(async () => {
    await destroyWorkspace(alpha);
    await destroyWorkspace(beta);
    await disconnect();
  });

  describe("tasks", () => {
    it("creates, reads, updates and deletes a task", async () => {
      const created = await createTask(alpha.ctx, task({ title: "Write the proposal", priority: "HIGH" }));
      expect(created.title).toBe("Write the proposal");

      const fetched = await getTask(alpha.ctx, created.id);
      expect(fetched.id).toBe(created.id);

      const updated = await updateTask(alpha.ctx, created.id, { status: "COMPLETED" });
      expect(updated.status).toBe("COMPLETED");
      expect(updated.completedAt).not.toBeNull();

      await deleteTask(alpha.ctx, created.id);
      await expect(getTask(alpha.ctx, created.id)).rejects.toThrow(AppError);
    });

    it("refuses to read another workspace's task", async () => {
      const created = await createTask(alpha.ctx, task({ title: "Alpha only" }));
      await expect(getTask(beta.ctx, created.id)).rejects.toMatchObject({ status: 404 });
    });

    it("refuses to update another workspace's task", async () => {
      const created = await createTask(alpha.ctx, task({ title: "Alpha only 2" }));
      await expect(updateTask(beta.ctx, created.id, { status: "BLOCKED" })).rejects.toMatchObject({
        status: 404,
      });
    });

    it("refuses to link a task to another workspace's project", async () => {
      const project = await createProject(beta.ctx, projectCreateSchema.parse({ name: "Beta project" }));
      await expect(
        createTask(alpha.ctx, task({ title: "Cross link", projectId: project.id }))
      ).rejects.toMatchObject({ status: 404 });
    });

    it("rejects a self-referential dependency", async () => {
      const created = await createTask(alpha.ctx, task({ title: "Self dep" }));
      await expect(
        updateTask(alpha.ctx, created.id, { dependsOnIds: [created.id] })
      ).rejects.toThrow(/cannot depend on itself/);
    });

    it("rejects a circular dependency", async () => {
      const a = await createTask(alpha.ctx, task({ title: "Cycle A" }));
      const b = await createTask(alpha.ctx, task({ title: "Cycle B" }));
      await updateTask(alpha.ctx, b.id, { dependsOnIds: [a.id] });
      await expect(updateTask(alpha.ctx, a.id, { dependsOnIds: [b.id] })).rejects.toThrow(
        /circular dependency/
      );
    });

    it("spawns the next occurrence when a recurring task completes", async () => {
      const created = await createTask(
        alpha.ctx,
        task({ title: "Weekly review", recurrence: "WEEKLY", dueDate: day(0).toISOString() })
      );
      await updateTask(alpha.ctx, created.id, { status: "COMPLETED" });
      const { items } = await listTasks(alpha.ctx, { search: "Weekly review" });
      const upcoming = items.filter((item) => item.status !== "COMPLETED");
      expect(upcoming.length).toBeGreaterThan(0);
      expect(upcoming[0].origin).toBe("AUTOMATION");
    });

    it("filters overdue work", async () => {
      await createTask(alpha.ctx, task({ title: "Late thing", dueDate: day(-3).toISOString() }));
      const { items } = await listTasks(alpha.ctx, { overdue: true });
      expect(items.some((item) => item.title === "Late thing")).toBe(true);
      expect(items.every((item) => item.status !== "COMPLETED")).toBe(true);
    });
  });

  describe("projects", () => {
    it("recomputes completion and health from its tasks", async () => {
      const project = await createProject(
        alpha.ctx,
        projectCreateSchema.parse({ name: "Health project", status: "ACTIVE", deadline: day(30).toISOString() })
      );

      const one = await createTask(alpha.ctx, task({ title: "P1", projectId: project.id }));
      await createTask(alpha.ctx, task({ title: "P2", projectId: project.id }));
      await updateTask(alpha.ctx, one.id, { status: "COMPLETED" });

      const result = await recomputeProjectHealth(project.id);
      expect(result?.completion).toBe(50);
      expect(result?.health).toBe("GREEN");
    });

    it("turns red once its deadline passes with work outstanding", async () => {
      const project = await createProject(
        alpha.ctx,
        projectCreateSchema.parse({ name: "Late project", status: "ACTIVE", deadline: day(-5).toISOString() })
      );
      await createTask(alpha.ctx, task({ title: "Still open", projectId: project.id, dueDate: day(-4).toISOString() }));

      const result = await recomputeProjectHealth(project.id);
      expect(result?.health).toBe("RED");
      const stored = await prisma.project.findUnique({ where: { id: project.id } });
      expect(stored?.health).toBe("RED");
    });

    it("generates a unique slug for a duplicate project name", async () => {
      const first = await createProject(alpha.ctx, projectCreateSchema.parse({ name: "Same name" }));
      const second = await createProject(alpha.ctx, projectCreateSchema.parse({ name: "Same name" }));
      expect(first.slug).not.toBe(second.slug);
    });
  });

  describe("CRM", () => {
    it("weights the pipeline by probability", async () => {
      const workspace = await createWorkspace("Pipeline Studio");
      try {
        await createLead(
          workspace.ctx,
          leadCreateSchema.parse({ name: "Half", estimatedValue: 10000, probability: 50, stage: "PROPOSAL" })
        );
        const client = await createClient(workspace.ctx, clientCreateSchema.parse({ name: "Buyer" }));
        await prisma.opportunity.create({
          data: {
            businessId: workspace.businessId,
            clientId: client.id,
            title: "Deal",
            value: 20000,
            probability: 25,
            stage: "PROPOSAL",
            status: "OPEN",
          },
        });

        const pipeline = await getPipeline(workspace.ctx);
        expect(pipeline.totals.weightedValue).toBe(5000);
        expect(pipeline.totals.openValue).toBe(20000);
      } finally {
        await destroyWorkspace(workspace);
      }
    });

    it("refuses to update another workspace's lead", async () => {
      const lead = await createLead(alpha.ctx, leadCreateSchema.parse({ name: "Alpha lead" }));
      await expect(updateLead(beta.ctx, lead.id, { stage: "WON" })).rejects.toMatchObject({ status: 404 });
    });
  });

  describe("knowledge and memory", () => {
    it("finds a document by keyword and ranks title matches highest", async () => {
      const workspace = await createWorkspace("Knowledge Studio");
      try {
        await createKnowledgeDocument(
          workspace.ctx,
          knowledgeCreateSchema.parse({
            title: "Refund policy",
            category: "POLICY",
            body: "Refunds are issued within 14 days of purchase.",
            tags: ["refunds"],
          })
        );
        await createKnowledgeDocument(
          workspace.ctx,
          knowledgeCreateSchema.parse({
            title: "Shipping notes",
            category: "SOP",
            body: "Mentions refunds once in passing.",
          })
        );

        const results = await searchKnowledge(workspace.ctx, "refund policy");
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].title).toBe("Refund policy");
      } finally {
        await destroyWorkspace(workspace);
      }
    });

    it("returns nothing for a query with no usable terms", async () => {
      expect(await searchKnowledge(alpha.ctx, "an of")).toEqual([]);
    });

    it("updates a memory rather than duplicating it", async () => {
      const first = await upsertMemory(
        alpha.ctx,
        memoryCreateSchema.parse({ scope: "COMPANY", key: "Payment Terms", value: "50% up front." })
      );
      const second = await upsertMemory(
        alpha.ctx,
        memoryCreateSchema.parse({ scope: "COMPANY", key: "payment_terms", value: "60% up front." })
      );
      expect(second.id).toBe(first.id);
      expect(second.value).toBe("60% up front.");
    });

    it("excludes expired memories from retrieval", async () => {
      await upsertMemory(
        alpha.ctx,
        memoryCreateSchema.parse({
          scope: "OPERATIONAL",
          key: "stale_fact",
          value: "No longer true.",
          expiresAt: day(-1).toISOString(),
        })
      );
      const memories = await retrieveMemories(alpha.ctx, { scopes: ["OPERATIONAL"] });
      expect(memories.some((memory) => memory.key === "stale_fact")).toBe(false);
    });
  });

  describe("automations", () => {
    it("stores a computed score rather than an asserted one", async () => {
      const automation = await createAutomation(
        alpha.ctx,
        automationCreateSchema.parse({
          name: "Invoice reminders",
          process: "Manual monthly reminders",
          frequencyPerMonth: 12,
          minutesPerRun: 45,
          minutesAfter: 5,
          complexity: 2,
          businessValue: 5,
        })
      );
      expect(automation.score).toBeGreaterThan(50);
      expect(automation.analysis.monthlyHoursSaved).toBeCloseTo(8, 0);
    });

    it("detects repeated work from task history", async () => {
      const workspace = await createWorkspace("Repetition Studio");
      try {
        for (let i = 0; i < 4; i += 1) {
          const created = await createTask(
            workspace.ctx,
            task({ title: "Reconcile expenses", estimateMins: 40 })
          );
          await updateTask(workspace.ctx, created.id, { status: "COMPLETED" });
        }
        const candidates = await detectAutomationCandidates(workspace.ctx);
        expect(candidates.some((candidate) => candidate.name === "Reconcile expenses")).toBe(true);
      } finally {
        await destroyWorkspace(workspace);
      }
    });
  });

  describe("notifications", () => {
    it("creates alerts from real state and does not duplicate them", async () => {
      const workspace = await createWorkspace("Alerts Studio");
      try {
        await createTask(
          workspace.ctx,
          task({ title: "Overdue work", dueDate: day(-2).toISOString(), priority: "CRITICAL" })
        );

        const first = await refreshNotifications(workspace.ctx);
        expect(first).toBeGreaterThan(0);

        const second = await refreshNotifications(workspace.ctx);
        expect(second).toBe(0);

        const stored = await prisma.notification.findMany({ where: { businessId: workspace.businessId } });
        expect(stored.some((notification) => notification.kind === "TASK_OVERDUE")).toBe(true);
      } finally {
        await destroyWorkspace(workspace);
      }
    });
  });

  describe("dashboard", () => {
    it("builds a snapshot scoped to one workspace", async () => {
      const workspace = await createWorkspace("Snapshot Studio");
      try {
        await createTask(workspace.ctx, task({ title: "Only mine", dueDate: day(-1).toISOString() }));
        const snapshot = await getExecutiveSnapshot(workspace.ctx);
        expect(snapshot.tasks.overdue).toBe(1);
        expect(snapshot.tasks.open).toBe(1);
      } finally {
        await destroyWorkspace(workspace);
      }
    });

    it("builds a briefing that classifies work", async () => {
      const workspace = await createWorkspace("Briefing Studio");
      try {
        await createTask(
          workspace.ctx,
          task({ title: "Send monthly invoice reminders", dueDate: day(1).toISOString() })
        );
        await createTask(
          workspace.ctx,
          task({ title: "Fix the client's broken checkout", priority: "CRITICAL", dueDate: day(-1).toISOString() })
        );

        const briefing = await getBriefing(workspace.ctx);
        expect(briefing.topPriorities.length).toBeGreaterThan(0);
        expect(briefing.urgent.length).toBeGreaterThan(0);
        expect(briefing.automatable.some((item) => item.task.title.includes("invoice"))).toBe(true);
      } finally {
        await destroyWorkspace(workspace);
      }
    });
  });
});
