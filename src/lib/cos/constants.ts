/**
 * Static configuration for MOSH Chief of Staff.
 *
 * Business areas are *seeded* from this list but stored in the database
 * (`BusinessArea`), so the founder can add, rename or retire areas without a
 * code change. Nothing in the application may branch on a hard-coded area.
 */

export const DEFAULT_BUSINESS_SLUG = "mosh-digital-studios";

export const DEFAULT_BUSINESS_AREAS: ReadonlyArray<{
  slug: string;
  name: string;
  description: string;
}> = [
  { slug: "ai-automation", name: "AI Automation", description: "Workflow automation powered by AI for internal and client operations." },
  { slug: "website-design", name: "Website Design", description: "UI/UX and visual design for web properties." },
  { slug: "website-development", name: "Website Development", description: "Build and ship production websites and web apps." },
  { slug: "ecommerce", name: "E-commerce", description: "Online store setup, optimisation and operations." },
  { slug: "ai-agents", name: "AI Agents", description: "Custom autonomous and semi-autonomous AI agents." },
  { slug: "chatbots", name: "Chatbots", description: "Conversational assistants for sales and support." },
  { slug: "marketing-automation", name: "Marketing Automation", description: "Funnels, sequences and lifecycle marketing systems." },
  { slug: "prompt-engineering", name: "Prompt Engineering", description: "Prompt systems, packs and evaluation." },
  { slug: "digital-products", name: "Digital Products", description: "Templates, kits, packs and other digital goods." },
  { slug: "online-courses", name: "Online Courses", description: "Course production, hosting and sales." },
  { slug: "seo", name: "SEO", description: "Organic search strategy, technical SEO and content." },
  { slug: "branding", name: "Branding", description: "Brand strategy, identity and guidelines." },
  { slug: "graphic-design", name: "Graphic Design", description: "Visual assets for campaigns and products." },
  { slug: "video-production", name: "Video Production", description: "Shooting, editing and post for video content." },
  { slug: "content-creation", name: "Content Creation", description: "Written, audio and social content production." },
  { slug: "ai-consulting", name: "AI Consulting", description: "Advisory engagements on AI adoption and strategy." },
];

/** Navigation shown in the M-CoS sidebar. */
export const NAV_ITEMS: ReadonlyArray<{ href: string; label: string; icon: string }> = [
  { href: "/cos", label: "Dashboard", icon: "grid" },
  { href: "/cos/chat", label: "AI Chief of Staff", icon: "spark" },
  { href: "/cos/tasks", label: "Tasks", icon: "check" },
  { href: "/cos/projects", label: "Projects", icon: "layers" },
  { href: "/cos/crm", label: "CRM", icon: "users" },
  { href: "/cos/goals", label: "Goals", icon: "target" },
  { href: "/cos/content", label: "Content", icon: "play" },
  { href: "/cos/products", label: "Products", icon: "box" },
  { href: "/cos/knowledge", label: "Knowledge", icon: "book" },
  { href: "/cos/agents", label: "AI Agents", icon: "bot" },
  { href: "/cos/automations", label: "Automations", icon: "bolt" },
  { href: "/cos/analytics", label: "Analytics", icon: "chart" },
  { href: "/cos/reports", label: "Reports", icon: "doc" },
  { href: "/cos/settings", label: "Settings", icon: "cog" },
];

/**
 * Anthropic model pricing in USD per million tokens. Used only to produce an
 * *estimate* for the AI cost dashboard — it is not a billing source of truth.
 */
export const MODEL_PRICING_USD_PER_MTOK: Record<string, { input: number; output: number }> = {
  "claude-opus-5": { input: 5, output: 25 },
  "claude-sonnet-5": { input: 3, output: 15 },
  "claude-haiku-4-5": { input: 1, output: 5 },
};

export const DEFAULT_MODEL = "claude-opus-5";

/** Actions that must never run without an explicit human approval. */
export const SENSITIVE_ACTIONS = [
  "send_client_communication",
  "publish_content",
  "change_pricing",
  "make_financial_commitment",
  "delete_record",
  "modify_critical_settings",
] as const;

export type SensitiveAction = (typeof SENSITIVE_ACTIONS)[number];
