import type Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { TaskOrigin } from "@/generated/prisma/enums";
import type { CosContext } from "../tenancy";
import { can } from "../tenancy";
import type { Permission } from "../access";
import { AppError } from "../errors";
import { recordAudit } from "../audit";
import { getExecutiveSnapshot } from "../dashboard";
import { toNumber } from "../format";
import { scoreDecision } from "../scoring";
import {
  automationCreateSchema, contentCreateSchema, decisionSchema, leadUpdateSchema,
  memoryCreateSchema, productCreateSchema, projectCreateSchema, taskCreateSchema, taskUpdateSchema,
} from "../schemas";
import { createTask, listTasks, updateTask } from "../services/tasks";
import { createProject, getProject, listProjects } from "../services/projects";
import { getClient, getPipeline, listClients, listLeads, updateLead } from "../services/crm";
import { listGoals } from "../services/goals";
import { createProduct, createContentItem, listContent, listProducts } from "../services/content";
import { searchKnowledge, retrieveMemories, upsertMemory } from "../services/knowledge";
import { createAutomation, detectAutomationCandidates, listAutomations } from "../services/automations";
import { getFinancialSummary } from "../services/finance";
import { clip } from "./guard";

/**
 * The AI's entire surface onto the business.
 *
 * The model has no database access. It can only call the functions declared
 * here, each of which validates its input with zod, checks the caller's
 * permission, and runs through the same service layer as the HTTP API. Adding a
 * capability to the AI means adding a tool here — there is no other path.
 */

export type ToolDefinition = {
  name: string;
  description: string;
  permission: Permission;
  /** Sensitive tools produce an approval request instead of acting. */
  sensitive?: boolean;
  inputSchema: Anthropic.Tool["input_schema"];
  validator: z.ZodTypeAny;
  run: (ctx: CosContext, input: never, meta: ToolMeta) => Promise<unknown>;
};

export type ToolMeta = {
  agentKey?: string;
  conversationId?: string;
};

const noInput: Anthropic.Tool["input_schema"] = { type: "object", properties: {} };
const emptyValidator = z.object({}).passthrough();

function str(description: string, extra: Record<string, unknown> = {}) {
  return { type: "string", description, ...extra };
}

export const TOOLS: ToolDefinition[] = [
  // ------------------------------------------------------------------ reads
  {
    name: "get_dashboard",
    description:
      "Executive snapshot: open/overdue/blocked tasks, project health, pipeline value, month-to-date finance, content, goals and unread alerts. Call this first for any 'how are we doing' or 'what should I focus on' question.",
    permission: "task:read",
    inputSchema: noInput,
    validator: emptyValidator,
    run: async (ctx) => getExecutiveSnapshot(ctx),
  },
  {
    name: "get_tasks",
    description:
      "List tasks with optional filters. Use overdue=true to find slipping work, or status/priority/projectId to narrow.",
    permission: "task:read",
    inputSchema: {
      type: "object",
      properties: {
        status: str("Task status", { enum: ["BACKLOG", "PLANNED", "IN_PROGRESS", "BLOCKED", "REVIEW", "COMPLETED", "CANCELLED"] }),
        priority: str("Priority", { enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] }),
        projectId: str("Restrict to one project"),
        overdue: { type: "boolean", description: "Only tasks past their due date" },
        search: str("Free-text match on title/description"),
        take: { type: "number", description: "Max results (default 25)" },
      },
    },
    validator: z.object({
      status: z.string().optional(),
      priority: z.string().optional(),
      projectId: z.string().optional(),
      overdue: z.boolean().optional(),
      search: z.string().max(120).optional(),
      take: z.number().int().min(1).max(50).optional(),
    }),
    run: async (ctx, input: { take?: number }) => {
      const result = await listTasks(ctx, { ...(input as object), take: input.take ?? 25 });
      return {
        total: result.total,
        items: result.items.map((task) => ({
          id: task.id,
          title: task.title,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
          project: task.project?.name ?? null,
          client: task.client?.name ?? null,
          tags: task.tags,
        })),
      };
    },
  },
  {
    name: "get_projects",
    description: "List projects with status, health, completion, deadline, client and budget.",
    permission: "project:read",
    inputSchema: {
      type: "object",
      properties: {
        status: str("Project status filter"),
        clientId: str("Restrict to one client"),
      },
    },
    validator: z.object({ status: z.string().optional(), clientId: z.string().optional() }),
    run: async (ctx, input: { status?: string; clientId?: string }) => {
      const projects = await listProjects(ctx, { ...input, take: 40 });
      return projects.map((project) => ({
        id: project.id,
        name: project.name,
        status: project.status,
        health: project.health,
        healthNote: project.healthNote,
        completion: project.completion,
        deadline: project.deadline,
        client: project.client?.name ?? null,
        area: project.area?.name ?? null,
        budget: toNumber(project.budget),
        revenue: toNumber(project.revenue),
        taskCount: project._count.tasks,
        openRisks: project._count.risks,
      }));
    },
  },
  {
    name: "get_project",
    description: "Full detail for one project: tasks, milestones, risks, team and AI agents.",
    permission: "project:read",
    inputSchema: {
      type: "object",
      properties: { projectId: str("The project id") },
      required: ["projectId"],
    },
    validator: z.object({ projectId: z.string().min(1) }),
    run: async (ctx, input: { projectId: string }) => {
      const project = await getProject(ctx, input.projectId);
      return {
        ...project,
        budget: toNumber(project.budget),
        revenue: toNumber(project.revenue),
        spend: toNumber(project.spend),
        description: clip(project.description, 1500),
      };
    },
  },
  {
    name: "get_clients",
    description: "List clients with status and counts of projects, contacts and opportunities.",
    permission: "crm:read",
    inputSchema: noInput,
    validator: emptyValidator,
    run: async (ctx) => {
      const clients = await listClients(ctx);
      return clients.map((client) => ({
        id: client.id,
        name: client.name,
        company: client.company,
        status: client.status,
        healthNote: clip(client.healthNote, 300),
        projects: client._count.projects,
        opportunities: client._count.opportunities,
      }));
    },
  },
  {
    name: "get_client",
    description: "Full detail for one client: contacts, projects, opportunities, invoices and client memory.",
    permission: "crm:read",
    inputSchema: {
      type: "object",
      properties: { clientId: str("The client id") },
      required: ["clientId"],
    },
    validator: z.object({ clientId: z.string().min(1) }),
    run: async (ctx, input: { clientId: string }) => getClient(ctx, input.clientId),
  },
  {
    name: "get_leads",
    description: "List leads with stage, estimated value, probability, next action and follow-up date.",
    permission: "crm:read",
    inputSchema: {
      type: "object",
      properties: { stage: str("Pipeline stage filter") },
    },
    validator: z.object({ stage: z.string().optional() }),
    run: async (ctx, input: { stage?: string }) => {
      const leads = await listLeads(ctx, input);
      return leads.map((lead) => ({
        id: lead.id,
        name: lead.name,
        company: lead.company,
        stage: lead.stage,
        estimatedValue: toNumber(lead.estimatedValue),
        probability: lead.probability,
        nextAction: clip(lead.nextAction, 200),
        followUpAt: lead.followUpAt,
        lastContactedAt: lead.lastContactedAt,
        source: lead.source,
      }));
    },
  },
  {
    name: "get_sales_pipeline",
    description:
      "Pipeline analytics: value by stage, weighted pipeline, conversion rate, average deal value, won/lost counts.",
    permission: "crm:read",
    inputSchema: noInput,
    validator: emptyValidator,
    run: async (ctx) => getPipeline(ctx),
  },
  {
    name: "get_goals",
    description: "Goals with KPI, target, current value, computed progress and whether they are behind pace.",
    permission: "goal:read",
    inputSchema: noInput,
    validator: emptyValidator,
    run: async (ctx) => {
      const goals = await listGoals(ctx);
      return goals.map((goal) => ({
        id: goal.id,
        title: goal.title,
        horizon: goal.horizon,
        status: goal.status,
        kpi: goal.kpi,
        unit: goal.unit,
        current: goal.current,
        target: goal.target,
        progress: goal.progress,
        atRisk: goal.atRisk,
        expectedPct: goal.expectedPct,
        deadline: goal.deadline,
        linkedTasks: goal._count.tasks,
      }));
    },
  },
  {
    name: "get_products",
    description: "Digital products with stage, price, units sold and revenue.",
    permission: "product:read",
    inputSchema: noInput,
    validator: emptyValidator,
    run: async (ctx) => {
      const products = await listProducts(ctx);
      return products.map((product) => ({
        id: product.id,
        name: product.name,
        stage: product.stage,
        category: product.category,
        price: product.priceValue,
        unitsSold: product.unitsSold,
        revenue: product.revenueValue,
        platform: product.platform,
      }));
    },
  },
  {
    name: "get_content_calendar",
    description: "Content items with platform, status, publish date and performance figures.",
    permission: "content:read",
    inputSchema: {
      type: "object",
      properties: { status: str("Content status filter"), platform: str("Platform filter") },
    },
    validator: z.object({ status: z.string().optional(), platform: z.string().optional() }),
    run: async (ctx, input: { status?: string; platform?: string }) => {
      const items = await listContent(ctx, input);
      return items.slice(0, 40).map((item) => ({
        id: item.id,
        title: item.title,
        platform: item.platform,
        status: item.status,
        publishAt: item.publishAt,
        views: item.views,
        engagements: item.engagements,
        conversions: item.conversions,
        product: item.product?.name ?? null,
      }));
    },
  },
  {
    name: "get_financials",
    description:
      "Monthly revenue, expenses, profit and margin, plus invoice position and product revenue. REPORTED data with CALCULATED aggregates — not accounting advice.",
    permission: "finance:read",
    inputSchema: {
      type: "object",
      properties: { months: { type: "number", description: "How many months of history (default 6)" } },
    },
    validator: z.object({ months: z.number().int().min(1).max(24).optional() }),
    run: async (ctx, input: { months?: number }) => getFinancialSummary(ctx, input.months ?? 6),
  },
  {
    name: "get_automation_opportunities",
    description:
      "Logged automation opportunities with their computed scores, plus freshly detected candidates from repetitive task history.",
    permission: "automation:read",
    inputSchema: noInput,
    validator: emptyValidator,
    run: async (ctx) => {
      const [logged, detected] = await Promise.all([
        listAutomations(ctx),
        detectAutomationCandidates(ctx),
      ]);
      return {
        logged: logged.map((item) => ({
          id: item.id,
          name: item.name,
          status: item.status,
          score: item.score,
          monthlyHoursSaved: item.analysis.monthlyHoursSaved,
          rating: item.analysis.rating,
        })),
        detected,
      };
    },
  },
  {
    name: "get_agents",
    description: "The AI agent registry: which specialist agents exist, what they do and which tools they may use.",
    permission: "agent:read",
    inputSchema: noInput,
    validator: emptyValidator,
    run: async (ctx) => {
      const agents = await prisma.aIAgent.findMany({
        where: { businessId: ctx.businessId, status: "ACTIVE" },
        select: { key: true, name: true, role: true, description: true, capabilities: true, allowedTools: true },
      });
      return agents;
    },
  },
  {
    name: "search_knowledge",
    description:
      "Search the company knowledge base (services, pricing, SOPs, brand, policies, FAQs). Use this before answering anything about how MOSH works.",
    permission: "knowledge:read",
    inputSchema: {
      type: "object",
      properties: {
        query: str("What to look for"),
        take: { type: "number", description: "Max documents (default 5)" },
      },
      required: ["query"],
    },
    validator: z.object({ query: z.string().min(2).max(200), take: z.number().int().min(1).max(10).optional() }),
    run: async (ctx, input: { query: string; take?: number }) =>
      searchKnowledge(ctx, input.query, input.take ?? 5),
  },
  {
    name: "get_memories",
    description:
      "Structured business memory (company, strategic, operational, client, project scopes) with confidence scores.",
    permission: "memory:read",
    inputSchema: {
      type: "object",
      properties: {
        scopes: { type: "array", items: { type: "string" }, description: "Memory scopes to include" },
        clientId: str("Restrict to a client"),
        projectId: str("Restrict to a project"),
      },
    },
    validator: z.object({
      scopes: z.array(z.string()).max(6).optional(),
      clientId: z.string().optional(),
      projectId: z.string().optional(),
    }),
    run: async (ctx, input: { scopes?: string[]; clientId?: string; projectId?: string }) =>
      retrieveMemories(ctx, { ...input, take: 30 }),
  },

  // ----------------------------------------------------------------- writes
  {
    name: "create_task",
    description:
      "Create a task. Use this when the founder asks you to capture work, or when a plan you produced needs to become real, trackable items.",
    permission: "task:write",
    inputSchema: {
      type: "object",
      properties: {
        title: str("Short imperative title"),
        description: str("What needs to happen and why"),
        priority: str("Priority", { enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] }),
        status: str("Initial status", { enum: ["BACKLOG", "PLANNED", "IN_PROGRESS"] }),
        dueDate: str("Due date, ISO 8601"),
        estimateMins: { type: "number", description: "Estimated effort in minutes" },
        projectId: str("Link to a project"),
        clientId: str("Link to a client"),
        goalId: str("Link to a goal"),
        tags: { type: "array", items: { type: "string" }, description: "Short tags" },
      },
      required: ["title"],
    },
    validator: taskCreateSchema,
    run: async (ctx, input: z.infer<typeof taskCreateSchema>, meta) => {
      const task = await createTask(ctx, input, { origin: TaskOrigin.AI, agentKey: meta.agentKey });
      return { id: task.id, title: task.title, status: task.status, priority: task.priority, dueDate: task.dueDate };
    },
  },
  {
    name: "update_task",
    description: "Update an existing task — status, priority, due date, assignment or notes.",
    permission: "task:write",
    inputSchema: {
      type: "object",
      properties: {
        taskId: str("The task id"),
        status: str("New status"),
        priority: str("New priority"),
        dueDate: str("New due date, ISO 8601"),
        notes: str("Notes to record"),
      },
      required: ["taskId"],
    },
    validator: z.object({ taskId: z.string().min(1) }).and(taskUpdateSchema),
    run: async (ctx, input: { taskId: string } & z.infer<typeof taskUpdateSchema>) => {
      const { taskId, ...rest } = input;
      const task = await updateTask(ctx, taskId, rest);
      return { id: task.id, title: task.title, status: task.status, priority: task.priority };
    },
  },
  {
    name: "create_project",
    description: "Create a project. Use when the founder commits to a new piece of work with a scope and a deadline.",
    permission: "project:write",
    inputSchema: {
      type: "object",
      properties: {
        name: str("Project name"),
        description: str("Scope and objective"),
        clientId: str("Client this is for"),
        areaId: str("Business area id"),
        deadline: str("Deadline, ISO 8601"),
        budget: { type: "number", description: "Budget in the business currency" },
      },
      required: ["name"],
    },
    validator: projectCreateSchema,
    run: async (ctx, input: z.infer<typeof projectCreateSchema>) => {
      const project = await createProject(ctx, input);
      return { id: project.id, name: project.name, status: project.status, deadline: project.deadline };
    },
  },
  {
    name: "create_content_item",
    description: "Add an item to the content calendar (idea, script, scheduled post).",
    permission: "content:write",
    inputSchema: {
      type: "object",
      properties: {
        title: str("Content title"),
        platform: str("Platform", { enum: ["YOUTUBE", "FACEBOOK", "INSTAGRAM", "TIKTOK", "LINKEDIN", "BLOG", "EMAIL", "X", "OTHER"] }),
        topic: str("Topic or angle"),
        format: str("Format, e.g. short-form video"),
        publishAt: str("Planned publish date, ISO 8601"),
        callToAction: str("The CTA"),
        productId: str("Product this promotes"),
      },
      required: ["title"],
    },
    validator: contentCreateSchema,
    run: async (ctx, input: z.infer<typeof contentCreateSchema>) => {
      const item = await createContentItem(ctx, input);
      return { id: item.id, title: item.title, platform: item.platform, status: item.status };
    },
  },
  {
    name: "create_product",
    description: "Register a digital product in the product pipeline.",
    permission: "product:write",
    inputSchema: {
      type: "object",
      properties: {
        name: str("Product name"),
        category: str("Category"),
        description: str("What it is and who it is for"),
        price: { type: "number", description: "Price in the business currency" },
        stage: str("Pipeline stage", { enum: ["IDEA", "RESEARCH", "VALIDATION", "PRODUCTION", "LAUNCH", "OPTIMIZATION", "SCALE"] }),
      },
      required: ["name"],
    },
    validator: productCreateSchema,
    run: async (ctx, input: z.infer<typeof productCreateSchema>) => {
      const product = await createProduct(ctx, input);
      return { id: product.id, name: product.name, stage: product.stage };
    },
  },
  {
    name: "create_automation",
    description:
      "Log an automation opportunity. The system computes its score from frequency, time saved, complexity and business value — do not invent a score.",
    permission: "automation:write",
    inputSchema: {
      type: "object",
      properties: {
        name: str("Short name for the process"),
        process: str("What happens today, manually"),
        trigger: str("What kicks the process off"),
        steps: { type: "array", items: { type: "string" }, description: "Proposed automated steps in order" },
        frequencyPerMonth: { type: "number", description: "How many times per month it runs" },
        minutesPerRun: { type: "number", description: "Minutes it takes today" },
        minutesAfter: { type: "number", description: "Minutes it would take once automated" },
        complexity: { type: "number", description: "1 trivial to 5 hard" },
        businessValue: { type: "number", description: "1 low to 5 high" },
        tooling: str("Suggested tooling"),
      },
      required: ["name", "process"],
    },
    validator: automationCreateSchema,
    run: async (ctx, input: z.infer<typeof automationCreateSchema>) => {
      const automation = await createAutomation(ctx, input);
      return {
        id: automation.id,
        name: automation.name,
        score: automation.score,
        rating: automation.analysis.rating,
        monthlyHoursSaved: automation.analysis.monthlyHoursSaved,
      };
    },
  },
  {
    name: "update_lead",
    description: "Update a lead's stage, probability, next action or follow-up date after a conversation.",
    permission: "crm:write",
    inputSchema: {
      type: "object",
      properties: {
        leadId: str("The lead id"),
        stage: str("New pipeline stage"),
        probability: { type: "number", description: "0-100" },
        nextAction: str("The next concrete step"),
        followUpAt: str("When to follow up, ISO 8601"),
        notes: str("Notes from the interaction"),
      },
      required: ["leadId"],
    },
    validator: z.object({ leadId: z.string().min(1) }).and(leadUpdateSchema),
    run: async (ctx, input: { leadId: string } & z.infer<typeof leadUpdateSchema>) => {
      const { leadId, ...rest } = input;
      const lead = await updateLead(ctx, leadId, rest);
      return { id: lead.id, name: lead.name, stage: lead.stage, followUpAt: lead.followUpAt };
    },
  },
  {
    name: "save_memory",
    description:
      "Record a durable fact about the business. Use sparingly and only for facts that will still matter next month. Re-using a key updates that memory instead of duplicating it.",
    permission: "memory:write",
    inputSchema: {
      type: "object",
      properties: {
        scope: str("Memory scope", { enum: ["COMPANY", "STRATEGIC", "OPERATIONAL", "CLIENT", "PROJECT", "CONVERSATIONAL"] }),
        key: str("Short stable key, e.g. preferred_project_kickoff_process"),
        value: str("The fact, stated plainly"),
        confidence: { type: "number", description: "0-100 confidence in this fact" },
        clientId: str("Client this relates to"),
        projectId: str("Project this relates to"),
      },
      required: ["scope", "key", "value"],
    },
    validator: memoryCreateSchema,
    run: async (ctx, input: z.infer<typeof memoryCreateSchema>, meta) => {
      const memory = await upsertMemory(
        ctx,
        { ...input, source: "AI" },
        { actorKind: "AI", actorLabel: meta.agentKey ?? "chief-of-staff" }
      );
      return { id: memory.id, scope: memory.scope, key: memory.key };
    },
  },
  {
    name: "score_decision",
    description:
      "Score an opportunity or decision on revenue impact, strategic fit, customer value, cost, time, complexity, risk, automation potential and scalability. Returns a 0-100 opportunity score and a verdict.",
    permission: "automation:write",
    inputSchema: {
      type: "object",
      properties: {
        title: str("What is being decided"),
        context: str("Background the score is based on"),
        revenueImpact: { type: "number", description: "1-5, higher is better" },
        strategicFit: { type: "number", description: "1-5, higher is better" },
        customerValue: { type: "number", description: "1-5, higher is better" },
        cost: { type: "number", description: "1-5, higher means more expensive" },
        timeToValue: { type: "number", description: "1-5, higher means slower" },
        complexity: { type: "number", description: "1-5, higher means harder" },
        risk: { type: "number", description: "1-5, higher means riskier" },
        automation: { type: "number", description: "1-5, higher automation potential" },
        scalability: { type: "number", description: "1-5, higher is better" },
        recommendation: str("Your recommended action"),
        nextStep: str("The single next step"),
      },
      required: ["title"],
    },
    validator: decisionSchema,
    run: async (ctx, input: z.infer<typeof decisionSchema>) => {
      const result = scoreDecision(input);
      const decision = await prisma.decision.create({
        data: { businessId: ctx.businessId, ...input, score: result.score },
      });
      await recordAudit(ctx, {
        action: "decision.score",
        entityType: "decision",
        entityId: decision.id,
        actorKind: "AI",
        detail: { score: result.score, verdict: result.verdict },
      });
      return { id: decision.id, ...result };
    },
  },

  // -------------------------------------------------------------- sensitive
  {
    name: "request_approval",
    description:
      "Request human approval for a high-impact action you are NOT allowed to perform yourself: sending client communications, publishing content, changing pricing, financial commitments, deleting data, or changing critical settings. Describe the plan precisely; the founder approves and executes.",
    permission: "task:read",
    sensitive: true,
    inputSchema: {
      type: "object",
      properties: {
        action: str("The action requiring approval", {
          enum: ["send_client_communication", "publish_content", "change_pricing", "make_financial_commitment", "delete_record", "modify_critical_settings"],
        }),
        summary: str("Exactly what would happen, in one paragraph the founder can approve at a glance"),
        payload: { type: "object", description: "Structured details of the proposed action" },
      },
      required: ["action", "summary"],
    },
    validator: z.object({
      action: z.enum([
        "send_client_communication", "publish_content", "change_pricing",
        "make_financial_commitment", "delete_record", "modify_critical_settings",
      ]),
      summary: z.string().min(10).max(4000),
      payload: z.record(z.string(), z.unknown()).optional(),
    }),
    run: async (ctx, input: { action: string; summary: string; payload?: Record<string, unknown> }, meta) => {
      const approval = await prisma.approvalRequest.create({
        data: {
          businessId: ctx.businessId,
          requestedById: ctx.userId,
          action: input.action,
          summary: input.summary,
          payload: (input.payload ?? {}) as never,
          agentKey: meta.agentKey ?? "chief-of-staff",
          expiresAt: new Date(Date.now() + 7 * 86_400_000),
        },
      });
      await recordAudit(ctx, {
        action: "approval.request",
        entityType: "approval",
        entityId: approval.id,
        actorKind: "AI",
        actorLabel: meta.agentKey ?? "chief-of-staff",
        detail: { action: input.action },
      });
      return {
        id: approval.id,
        status: "PENDING",
        note: "Approval requested. The action has NOT been performed. The founder must approve it in Settings → Approvals.",
      };
    },
  },
];

const TOOL_MAP = new Map(TOOLS.map((tool) => [tool.name, tool]));

/** Tool definitions the model may see, filtered by role and by agent allow-list. */
export function toolsForContext(ctx: CosContext, allowed?: string[]): Anthropic.Tool[] {
  return TOOLS.filter((tool) => can(ctx, tool.permission))
    .filter((tool) => !allowed || allowed.includes(tool.name) || tool.sensitive)
    .map((tool) => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.inputSchema,
    }));
}

export type ToolExecution = {
  ok: boolean;
  result: unknown;
};

/**
 * Execute a tool call from the model.
 *
 * Three gates, in order: the tool must exist, the caller's role must grant its
 * permission, and the arguments must satisfy its schema. A failure at any gate
 * is returned to the model as an error result rather than thrown, so the model
 * can correct itself instead of the whole turn collapsing.
 */
export async function executeTool(
  ctx: CosContext,
  name: string,
  rawInput: unknown,
  meta: ToolMeta = {}
): Promise<ToolExecution> {
  const tool = TOOL_MAP.get(name);
  if (!tool) {
    return { ok: false, result: { error: `Unknown tool "${name}".` } };
  }

  if (!can(ctx, tool.permission)) {
    await recordAudit(ctx, {
      action: `ai.tool.${name}`,
      result: "DENIED",
      actorKind: "AI",
      actorLabel: meta.agentKey ?? "chief-of-staff",
      detail: { reason: "permission_denied", permission: tool.permission },
    });
    return {
      ok: false,
      result: { error: `Permission denied: your role cannot use "${name}".` },
    };
  }

  let parsed: unknown;
  try {
    parsed = tool.validator.parse(rawInput ?? {});
  } catch (error) {
    const issues =
      error instanceof z.ZodError
        ? error.issues.map((issue) => `${issue.path.join(".") || "input"}: ${issue.message}`)
        : ["invalid input"];
    return { ok: false, result: { error: "Invalid arguments.", issues } };
  }

  try {
    const result = await tool.run(ctx, parsed as never, meta);
    await recordAudit(ctx, {
      action: `ai.tool.${name}`,
      actorKind: "AI",
      actorLabel: meta.agentKey ?? "chief-of-staff",
      detail: { conversationId: meta.conversationId },
    });
    return { ok: true, result };
  } catch (error) {
    const message =
      error instanceof AppError ? error.message : "That operation failed. It has been logged.";
    if (!(error instanceof AppError)) console.error(`[m-cos] tool ${name} failed`, error);
    await recordAudit(ctx, {
      action: `ai.tool.${name}`,
      result: "FAILURE",
      actorKind: "AI",
      actorLabel: meta.agentKey ?? "chief-of-staff",
      detail: { message },
    });
    return { ok: false, result: { error: message } };
  }
}
