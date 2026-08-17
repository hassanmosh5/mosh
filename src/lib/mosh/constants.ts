import { MoshEclipsePhase, MoshLifeArea, MoshOfferTier, MoshPattern, MoshPlane } from "@/generated/prisma/enums";

/**
 * The vocabulary of the MOSH Self-Mastery & Wealth Alignment System.
 *
 * Everything the UI labels, scores or charts is declared here once. The
 * database stores slugs and enums; this file is what turns them into the
 * language of the system — planes, attributes, rhythms, quarters, phases.
 */

export const BRAND = {
  name: "MOSH Self-Mastery & Wealth Alignment System",
  shortName: "MOSH Self-Mastery",
  owner: "Hassan Mohammed",
  title: "Life Coach and Mindset Architect",
  philosophy: "Structure Creates Freedom.",
  mission: [
    "Help the poor and the needy.",
    "Reduce poverty through mindset transformation.",
    "Empower people to become self-reliant.",
    "Create peace, health, and power.",
  ],
} as const;

// ---------------------------------------------------------------------------
// The three planes
// ---------------------------------------------------------------------------

export type PlaneAttribute = {
  slug: string;
  label: string;
  hint: string;
};

export type PlaneDefinition = {
  plane: MoshPlane;
  label: string;
  tagline: string;
  attributes: PlaneAttribute[];
};

export const MOSH_PLANES: PlaneDefinition[] = [
  {
    plane: MoshPlane.MENTAL,
    label: "Mental Plane",
    tagline: "Clear thinking, made visible.",
    attributes: [
      { slug: "clarity", label: "Clarity", hint: "How clearly can you name today's one thing?" },
      { slug: "confidence", label: "Confidence", hint: "How steady is your self-trust today?" },
      { slug: "focus", label: "Focus", hint: "How well did attention stay where you put it?" },
      { slug: "learning", label: "Learning", hint: "Did you take in something that changes you?" },
      { slug: "creativity", label: "Creativity", hint: "Did new ideas arrive and get captured?" },
      { slug: "storytelling", label: "Storytelling", hint: "Could you explain your work so it moved someone?" },
      { slug: "productivity", label: "Productivity", hint: "Did output match intention?" },
    ],
  },
  {
    plane: MoshPlane.SPIRITUAL,
    label: "Spiritual Plane",
    tagline: "Peace and power, the same current.",
    attributes: [
      { slug: "gratitude", label: "Gratitude", hint: "Did you name what you already have?" },
      { slug: "meditation", label: "Meditation", hint: "Did you sit still long enough to hear yourself?" },
      { slug: "faith", label: "Faith", hint: "How settled is your trust in the unfolding?" },
      { slug: "service", label: "Service", hint: "Who was lighter because of you today?" },
      { slug: "purpose", label: "Purpose", hint: "Did today's work connect to why you started?" },
      { slug: "courage", label: "Courage", hint: "Did you do the thing that scared you?" },
      { slug: "innerPeace", label: "Inner peace", hint: "How quiet was the noise underneath?" },
    ],
  },
  {
    plane: MoshPlane.PHYSICAL,
    label: "Physical Plane",
    tagline: "The body carries the vision.",
    attributes: [
      { slug: "exercise", label: "Exercise", hint: "Did you move with intention?" },
      { slug: "sleep", label: "Sleep", hint: "Did you sleep deeply enough to rebuild?" },
      { slug: "nutrition", label: "Nutrition", hint: "Did you eat like someone with a mission?" },
      { slug: "energy", label: "Energy", hint: "How much fuel did the day actually have?" },
      { slug: "recovery", label: "Recovery", hint: "Did you let the body repair?" },
      { slug: "movement", label: "Movement", hint: "Did you avoid sitting still for hours?" },
    ],
  },
];

export const PLANE_BY_SLUG: Record<string, MoshPlane> = Object.fromEntries(
  MOSH_PLANES.flatMap((plane) => plane.attributes.map((attribute) => [attribute.slug, plane.plane]))
);

export const ATTRIBUTE_LABELS: Record<string, string> = Object.fromEntries(
  MOSH_PLANES.flatMap((plane) => plane.attributes.map((attribute) => [attribute.slug, attribute.label]))
);

export const ALL_ATTRIBUTE_SLUGS = MOSH_PLANES.flatMap((plane) =>
  plane.attributes.map((attribute) => attribute.slug)
);

export const PLANE_LABELS: Record<MoshPlane, string> = {
  MENTAL: "Mental",
  SPIRITUAL: "Spiritual",
  PHYSICAL: "Physical",
};

// ---------------------------------------------------------------------------
// The daily rhythm
// ---------------------------------------------------------------------------

/**
 * The seven non-negotiables. `key` matches a boolean column on
 * MoshDailyEntry — the checkbox list and the score are generated from this
 * array, so adding a habit is a schema change plus one entry here.
 */
export type HabitDefinition = {
  key: HabitKey;
  label: string;
  description: string;
  plane: MoshPlane;
};

export type HabitKey =
  | "morningRhythm"
  | "exercise"
  | "creativeWork"
  | "journaling"
  | "meditation"
  | "contentCreation"
  | "trustDelegation";

export const MOSH_HABITS: HabitDefinition[] = [
  {
    key: "morningRhythm",
    label: "Morning rhythm",
    description: "Wake, water, light, and the first hour owned before the world asks for it.",
    plane: MoshPlane.PHYSICAL,
  },
  {
    key: "exercise",
    label: "Exercise",
    description: "Move the body on purpose — strength, walk, or sweat.",
    plane: MoshPlane.PHYSICAL,
  },
  {
    key: "creativeWork",
    label: "Creative work",
    description: "One deep block on the work only you can do.",
    plane: MoshPlane.MENTAL,
  },
  {
    key: "journaling",
    label: "Journaling",
    description: "Put the noise on paper so the mind has room.",
    plane: MoshPlane.MENTAL,
  },
  {
    key: "meditation",
    label: "Meditation",
    description: "Sit still. Breathe. Let the current settle.",
    plane: MoshPlane.SPIRITUAL,
  },
  {
    key: "contentCreation",
    label: "Content creation",
    description: "Ship one piece that helps someone you have not met.",
    plane: MoshPlane.MENTAL,
  },
  {
    key: "trustDelegation",
    label: "Trust and delegation practice",
    description: "Hand one thing to someone else — and let it be theirs.",
    plane: MoshPlane.SPIRITUAL,
  },
];

export const HABIT_KEYS: HabitKey[] = MOSH_HABITS.map((habit) => habit.key);

/** A day counts toward a streak once the rhythm is at least this complete. */
export const STREAK_THRESHOLD = 60;

// ---------------------------------------------------------------------------
// Life areas (weekly tracker + monthly review)
// ---------------------------------------------------------------------------

export const LIFE_AREAS: { area: MoshLifeArea; label: string; prompt: string }[] = [
  { area: MoshLifeArea.MENTAL, label: "Mental", prompt: "What will sharpen the mind this period?" },
  { area: MoshLifeArea.SPIRITUAL, label: "Spiritual", prompt: "What will deepen the inner life?" },
  { area: MoshLifeArea.PHYSICAL, label: "Physical", prompt: "What will strengthen the body?" },
  { area: MoshLifeArea.BUSINESS, label: "Business", prompt: "What will move the business forward?" },
  { area: MoshLifeArea.IMPACT, label: "Impact", prompt: "Who will be served, and how?" },
];

export const LIFE_AREA_LABELS: Record<MoshLifeArea, string> = {
  MENTAL: "Mental",
  SPIRITUAL: "Spiritual",
  PHYSICAL: "Physical",
  BUSINESS: "Business",
  IMPACT: "Impact",
};

/** The six questions every monthly review asks, in order. */
export const MONTHLY_QUESTIONS = [
  { key: "energyGivers", question: "What gave me energy this month?" },
  { key: "energyDrainers", question: "What drained my energy?" },
  { key: "proudOf", question: "What am I most proud of?" },
  { key: "fearsOvercome", question: "What fears did I overcome?" },
  { key: "service", question: "How did I serve others?" },
  { key: "structuralImprovement", question: "What structural improvement should I make next month?" },
] as const;

export type MonthlyQuestionKey = (typeof MONTHLY_QUESTIONS)[number]["key"];

// ---------------------------------------------------------------------------
// The 365-day master plan
// ---------------------------------------------------------------------------

export type QuarterTemplate = {
  quarter: 1 | 2 | 3 | 4;
  title: string;
  focus: string[];
  goal: string;
  milestones: { monthOffset: 1 | 2 | 3; title: string; detail: string }[];
};

export const QUARTER_TEMPLATES: QuarterTemplate[] = [
  {
    quarter: 1,
    title: "Root and Routine",
    focus: ["Clarity", "Healing", "Energy discipline"],
    goal: "Launch an attraction offer and acquire the first 10 clients.",
    milestones: [
      {
        monthOffset: 1,
        title: "Install the daily rhythm",
        detail: "Seven habits tracked every day; energy and mood logged without exception.",
      },
      {
        monthOffset: 2,
        title: "Build and publish the attraction offer",
        detail: "One free asset that solves a real, narrow problem, with an email capture behind it.",
      },
      {
        monthOffset: 3,
        title: "First 10 clients served",
        detail: "Ten paid conversations, each one documented as a case story.",
      },
    ],
  },
  {
    quarter: 2,
    title: "Visibility and Credibility",
    focus: ["Storytelling", "Courage", "Consistency"],
    goal: "Launch a coaching program and acquire 50 clients.",
    milestones: [
      {
        monthOffset: 1,
        title: "Publish daily for 30 days",
        detail: "One piece a day. Volume builds voice; voice builds trust.",
      },
      {
        monthOffset: 2,
        title: "Open the core coaching program",
        detail: "Curriculum, price, promise and proof — enrolment live.",
      },
      {
        monthOffset: 3,
        title: "50 clients inside the program",
        detail: "Fifty people paying attention, paying money, and getting results.",
      },
    ],
  },
  {
    quarter: 3,
    title: "Structure and Scale",
    focus: ["Systems", "Delegation", "Endurance"],
    goal: "Launch mentorship and membership programs.",
    milestones: [
      {
        monthOffset: 1,
        title: "Document every repeatable process",
        detail: "If it happens twice, it becomes a written system.",
      },
      {
        monthOffset: 2,
        title: "Hand over three responsibilities",
        detail: "Delegate delivery, support and publishing — and stop taking them back.",
      },
      {
        monthOffset: 3,
        title: "Mentorship and membership live",
        detail: "Premium mentorship open, membership recurring, both with onboarding.",
      },
    ],
  },
  {
    quarter: 4,
    title: "Legacy and Leverage",
    focus: ["Writing", "Gratitude", "Service"],
    goal: "Build three scalable income streams.",
    milestones: [
      {
        monthOffset: 1,
        title: "Write the book that carries the philosophy",
        detail: "Structure Creates Freedom, in a form that outlives the launch.",
      },
      {
        monthOffset: 2,
        title: "Three income streams running",
        detail: "Attraction, coaching and mentorship each producing without daily rescue.",
      },
      {
        monthOffset: 3,
        title: "Give it away",
        detail: "Fund or teach one cohort who could never have paid. Close the loop.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Business: the three-tier offer ecosystem
// ---------------------------------------------------------------------------

export type TierDefinition = {
  tier: MoshOfferTier;
  label: string;
  role: string;
  /** Metric columns the UI collects for this tier. */
  metrics: { key: OfferMetricKey; label: string; kind: "count" | "percent" | "money" }[];
  /** Multiplier applied to this tier's revenue in the Wealth Flow Index. */
  weight: number;
};

export type OfferMetricKey =
  | "revenue"
  | "leads"
  | "conversions"
  | "subscribers"
  | "downloads"
  | "students"
  | "satisfaction"
  | "completionRate"
  | "clients"
  | "retention"
  | "transformation";

export const OFFER_TIERS: TierDefinition[] = [
  {
    tier: MoshOfferTier.ATTRACTION,
    label: "Tier 1 — Attraction offer",
    role: "The door. Free or low-priced, solves one narrow problem, collects an email.",
    weight: 1,
    metrics: [
      { key: "revenue", label: "Revenue", kind: "money" },
      { key: "leads", label: "Leads", kind: "count" },
      { key: "conversions", label: "Conversions", kind: "count" },
      { key: "subscribers", label: "Email subscribers", kind: "count" },
      { key: "downloads", label: "Downloads", kind: "count" },
    ],
  },
  {
    tier: MoshOfferTier.CORE,
    label: "Tier 2 — Core coaching program",
    role: "The engine. A structured program that produces a repeatable transformation.",
    weight: 2,
    metrics: [
      { key: "revenue", label: "Revenue", kind: "money" },
      { key: "students", label: "Students", kind: "count" },
      { key: "satisfaction", label: "Satisfaction", kind: "percent" },
      { key: "completionRate", label: "Completion rate", kind: "percent" },
    ],
  },
  {
    tier: MoshOfferTier.PREMIUM,
    label: "Tier 3 — Premium mentorship",
    role: "The depth. Few people, close access, the largest transformation per client.",
    weight: 3,
    metrics: [
      { key: "revenue", label: "Revenue", kind: "money" },
      { key: "clients", label: "Clients", kind: "count" },
      { key: "retention", label: "Retention", kind: "percent" },
      { key: "transformation", label: "Transformation score", kind: "percent" },
    ],
  },
];

export const TIER_WEIGHTS: Record<MoshOfferTier, number> = {
  ATTRACTION: 1,
  CORE: 2,
  PREMIUM: 3,
};

export const TIER_LABELS: Record<MoshOfferTier, string> = {
  ATTRACTION: "Attraction",
  CORE: "Core program",
  PREMIUM: "Premium mentorship",
};

// ---------------------------------------------------------------------------
// Customer funnel
// ---------------------------------------------------------------------------

export type FunnelStageKey =
  | "visitors"
  | "leads"
  | "subscribers"
  | "customers"
  | "students"
  | "mentorship"
  | "advocates";

export const FUNNEL_STAGES: { key: FunnelStageKey; label: string; meaning: string }[] = [
  { key: "visitors", label: "Visitor", meaning: "Someone found you." },
  { key: "leads", label: "Lead", meaning: "They raised a hand." },
  { key: "subscribers", label: "Subscriber", meaning: "They let you keep talking." },
  { key: "customers", label: "Customer", meaning: "They paid you once." },
  { key: "students", label: "Student", meaning: "They enrolled in the program." },
  { key: "mentorship", label: "Mentorship client", meaning: "They chose depth." },
  { key: "advocates", label: "Advocate", meaning: "They send you people." },
];

// ---------------------------------------------------------------------------
// 50-Day Eclipse Growth Strategy
// ---------------------------------------------------------------------------

export const ECLIPSE_PHASES: {
  phase: MoshEclipsePhase;
  number: 1 | 2 | 3 | 4 | 5;
  label: string;
  range: [number, number];
  promise: string;
}[] = [
  {
    phase: MoshEclipsePhase.FOUNDATION_IN_FLOW,
    number: 1,
    label: "Foundation in Flow",
    range: [1, 10],
    promise: "Fix the rhythm before touching the revenue.",
  },
  {
    phase: MoshEclipsePhase.CORE_OFFER_BIRTH,
    number: 2,
    label: "Core Offer Birth",
    range: [11, 20],
    promise: "One promise, one price, one person it is for.",
  },
  {
    phase: MoshEclipsePhase.VISIBILITY_EXPANSION,
    number: 3,
    label: "Visibility Expansion",
    range: [21, 30],
    promise: "Be seen daily by the people you were built to serve.",
  },
  {
    phase: MoshEclipsePhase.MONEY_MODEL_ARCHITECTURE,
    number: 4,
    label: "Money Model Architecture",
    range: [31, 40],
    promise: "Turn attention into an ecosystem that compounds.",
  },
  {
    phase: MoshEclipsePhase.MAGNETIC_AUTHORITY,
    number: 5,
    label: "Magnetic Authority",
    range: [41, 50],
    promise: "Stop chasing. Become the obvious choice.",
  },
];

export const ECLIPSE_PHASE_LABELS: Record<MoshEclipsePhase, string> = {
  FOUNDATION_IN_FLOW: "Foundation in Flow",
  CORE_OFFER_BIRTH: "Core Offer Birth",
  VISIBILITY_EXPANSION: "Visibility Expansion",
  MONEY_MODEL_ARCHITECTURE: "Money Model Architecture",
  MAGNETIC_AUTHORITY: "Magnetic Authority",
};

export type EclipseDayTemplate = {
  day: number;
  phase: MoshEclipsePhase;
  focus: string;
  action: string;
};

const ECLIPSE_ACTIONS: { focus: string; action: string }[] = [
  // Phase 1 — Foundation in Flow (1-10)
  { focus: "Name the season", action: "Write one page: where you are, where you are going, and what you refuse to carry there." },
  { focus: "Set the morning rhythm", action: "Design the first hour of the day and commit to it for the full 50 days." },
  { focus: "Audit your energy", action: "List everything that gives energy and everything that drains it. Cut one drain today." },
  { focus: "Clear the physical space", action: "Reset the room you work in. Structure begins where you sit." },
  { focus: "Choose the one person", action: "Describe the single person your work is for, in their own words." },
  { focus: "Heal one old story", action: "Name a belief you inherited about money, then write the truer version." },
  { focus: "Set the health floor", action: "Fix sleep, water and movement minimums you will not go below." },
  { focus: "Build the capture system", action: "One place for every idea, task and lead. One. Not four." },
  { focus: "Baseline the numbers", action: "Record today's real numbers: audience, leads, revenue. No rounding up." },
  { focus: "Declare the promise", action: "Write the sentence that says what changes for someone who works with you." },
  // Phase 2 — Core Offer Birth (11-20)
  { focus: "Interview five people", action: "Ask five ideal clients what they have already tried and why it failed." },
  { focus: "Find the expensive problem", action: "Name the problem they would pay to end this month, not someday." },
  { focus: "Design the transformation", action: "Map the journey from their current state to the outcome, in stages." },
  { focus: "Draft the core offer", action: "Write the offer: promise, stages, duration, inclusions, price." },
  { focus: "Price with conviction", action: "Set the price on value delivered, then write why it is fair." },
  { focus: "Build the delivery skeleton", action: "Outline every session, resource and touchpoint. Delivery before marketing." },
  { focus: "Create the attraction asset", action: "Build the free asset that proves you can solve a slice of the problem." },
  { focus: "Write the sales page", action: "Promise, proof, process, price, objections, invitation. In that order." },
  { focus: "Test with three humans", action: "Walk three real people through the offer and record their exact words." },
  { focus: "Refine and lock", action: "Cut what confused them. Then stop editing and open the doors." },
  // Phase 3 — Visibility Expansion (21-30)
  { focus: "Choose one channel", action: "Pick the single platform where your person already spends attention." },
  { focus: "Define three content pillars", action: "Mindset, method, and proof. Every post belongs to one of them." },
  { focus: "Tell the origin story", action: "Publish the story of why this work exists. Whole, not polished." },
  { focus: "Publish a teaching piece", action: "Give away the framework people expect you to hide." },
  { focus: "Publish a proof piece", action: "Show one real result with the numbers and the timeline." },
  { focus: "Go live once", action: "Speak unscripted for twenty minutes. Courage compounds faster than editing." },
  { focus: "Start the daily thread", action: "One short daily post for the rest of the 50 days. No exceptions." },
  { focus: "Reach out to ten people", action: "Ten personal conversations. Serve first, sell only if invited." },
  { focus: "Collect the first testimonials", action: "Ask everyone you have already helped for one honest paragraph." },
  { focus: "Review what travelled", action: "Find the three pieces that moved people and make more of those." },
  // Phase 4 — Money Model Architecture (31-40)
  { focus: "Map the ecosystem", action: "Draw the three tiers and how someone moves from one to the next." },
  { focus: "Build the email engine", action: "Welcome sequence, weekly letter, and one clear invitation in each." },
  { focus: "Instrument the funnel", action: "Track visitor → lead → subscriber → customer weekly. Numbers, not feelings." },
  { focus: "Add the ascension path", action: "Create the natural next step for every finishing client." },
  { focus: "Design the recurring layer", action: "Build the membership or retainer that pays whether or not you launch." },
  { focus: "Remove the leak", action: "Find the worst conversion step in the funnel and fix that one only." },
  { focus: "Systemise fulfilment", action: "Write the delivery SOP so a trained person could run it without you." },
  { focus: "Delegate one function", action: "Hand over support, editing or scheduling. Pay for it. Let go of it." },
  { focus: "Set the wealth targets", action: "Set monthly revenue targets per tier and a Wealth Flow Index goal." },
  { focus: "Run the money review", action: "Review every number against the target and write the one correction." },
  // Phase 5 — Magnetic Authority (41-50)
  { focus: "Publish the manifesto", action: "State what you believe about structure, freedom and wealth. Sign it." },
  { focus: "Teach publicly", action: "Run a free workshop that leaves people better whether or not they buy." },
  { focus: "Partner with one voice", action: "Collaborate with someone whose audience you deserve to meet." },
  { focus: "Turn clients into advocates", action: "Give your best clients something to share that makes them look good." },
  { focus: "Raise the standard", action: "Upgrade one thing customers touch — page, onboarding, or delivery." },
  { focus: "Write the case study", action: "Document one transformation end to end, with numbers and quotes." },
  { focus: "Build the referral loop", action: "Make it obvious, easy and rewarding for advocates to send people." },
  { focus: "Protect the calendar", action: "Rebuild the week around deep work, delivery, and rest. Defend it." },
  { focus: "Serve without invoice", action: "Help someone who cannot pay you. Keep the mission in the machine." },
  { focus: "Close the eclipse", action: "Review all 50 days, keep what worked, and set the next 50-day cycle." },
];

export const ECLIPSE_PLAN: EclipseDayTemplate[] = ECLIPSE_ACTIONS.map((item, index) => {
  const day = index + 1;
  const phase = ECLIPSE_PHASES.find(
    (candidate) => day >= candidate.range[0] && day <= candidate.range[1]
  )!;
  return { day, phase: phase.phase, focus: item.focus, action: item.action };
});

export const ECLIPSE_TOTAL_DAYS = ECLIPSE_PLAN.length;

// ---------------------------------------------------------------------------
// The Billionaire Self — patterns
// ---------------------------------------------------------------------------

export const COACH_PATTERNS: {
  pattern: MoshPattern;
  label: string;
  tell: string;
  question: string;
}[] = [
  {
    pattern: MoshPattern.LIMITING_BELIEF,
    label: "Limiting beliefs",
    tell: "A sentence about yourself you treat as a fact.",
    question: "What do you believe about yourself that decides what you attempt?",
  },
  {
    pattern: MoshPattern.TRUST_ISSUE,
    label: "Trust issues",
    tell: "You keep the work because handing it over feels unsafe.",
    question: "What are you holding that someone else could carry?",
  },
  {
    pattern: MoshPattern.FEAR_OF_LOSS,
    label: "Fear of loss",
    tell: "You protect what you have instead of building what is next.",
    question: "What are you afraid of losing if this works?",
  },
  {
    pattern: MoshPattern.PERFECTIONISM,
    label: "Perfectionism",
    tell: "Finished work sits unpublished while you polish.",
    question: "What is 90% ready and still hidden?",
  },
  {
    pattern: MoshPattern.INFERIORITY,
    label: "Inferiority complex",
    tell: "You measure your inside against someone else's outside.",
    question: "Who are you comparing yourself to, and what do you actually know about them?",
  },
  {
    pattern: MoshPattern.PROCRASTINATION,
    label: "Procrastination",
    tell: "The important thing keeps moving to tomorrow's list.",
    question: "What have you moved forward more than three times?",
  },
  {
    pattern: MoshPattern.LOW_DRIVE,
    label: "Low drive",
    tell: "The engine is quiet — not lazy, depleted.",
    question: "When did the energy leave, and what took it?",
  },
];

export const COACH_PATTERN_LABELS: Record<MoshPattern, string> = {
  LIMITING_BELIEF: "Limiting beliefs",
  TRUST_ISSUE: "Trust issues",
  FEAR_OF_LOSS: "Fear of loss",
  PERFECTIONISM: "Perfectionism",
  INFERIORITY: "Inferiority complex",
  PROCRASTINATION: "Procrastination",
  LOW_DRIVE: "Low drive",
};

// ---------------------------------------------------------------------------
// A Message From My 77-Year-Old Self
// ---------------------------------------------------------------------------

export const DEFAULT_LEGACY_LETTER = {
  title: "A Message From My 77-Year-Old Self",
  body: `You finally understood that peace and power are the same current running through different wires.

You stopped proving and started embodying.

Every system you built freed someone else to believe again.

The world didn't need your perfection.

It needed your presence.

I am proud of you for choosing structure over struggle, rhythm over rush, and faith over fear.`,
} as const;

export const LEGACY_PROMPTS = [
  "What did the years teach you that you cannot learn any faster?",
  "Which fear turned out to be smaller than it looked?",
  "What did you build that outlived you?",
  "Who did you free, and how?",
  "What would you tell yourself on the hardest morning?",
] as const;

// ---------------------------------------------------------------------------
// Scoring configuration
// ---------------------------------------------------------------------------

/**
 * Weights for the composite scores. They are declared here rather than buried
 * in the maths so the meaning of a score can be read and argued with. Any
 * component with no data for the period is dropped and its weight redistributed
 * across the rest (see `scoring.ts`).
 */
export const SCORE_WEIGHTS = {
  daily: { habits: 0.55, planes: 0.25, vitals: 0.2 },
  weekly: { goals: 0.6, days: 0.4 },
  monthly: { pillars: 0.5, weeks: 0.3 , reflection: 0.2 },
  annual: { quarters: 0.6, milestones: 0.4 },
} as const;

/** Fallback monthly Wealth Flow Index target used before one is configured. */
export const DEFAULT_WEALTH_TARGET = 10_000;

export const DEFAULT_CURRENCY = "GHS";
