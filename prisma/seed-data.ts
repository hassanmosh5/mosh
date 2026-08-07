// Curriculum derived from "The AI Income Blueprint" by Hassan Mohammed.
// Structure mirrors the book's five parts and seventeen chapters.

export type SeedQuestion = {
  prompt: string;
  choices: string[];
  answer: number; // index into choices
};

export type SeedLesson = {
  slug: string;
  title: string;
  summary: string;
  content: string; // markdown
  estMinutes: number;
  keyTakeaways: string[];
  actionStep?: string;
  caseStudy?: string;
  quiz: SeedQuestion[];
};

export type SeedModule = {
  slug: string;
  title: string;
  description: string;
  lessons: SeedLesson[];
};

export const course = {
  slug: "ai-income-blueprint",
  title: "The AI Income Blueprint",
  subtitle:
    "How Non-Tech Professionals Are Earning $1,000–$5,000 Per Month With Simple AI Tools",
  description:
    "A 17-lesson course adapted from Hassan Mohammed's book The AI Income Blueprint. You'll move through five parts — Mindset, The Toolkit, The Income Streams, The Launch Plan, and Scaling & Sustainability — learning the exact frameworks, tools, and step-by-step plans non-technical professionals are using to build real AI-powered income.",
};

export const modules: SeedModule[] = [
  {
    slug: "part-1-mindset",
    title: "Part One: Mindset",
    description:
      "Before the tools and the tactics, the book tackles the beliefs that keep capable people from starting.",
    lessons: [
      {
        slug: "ch1-not-behind-right-on-time",
        title: "Chapter 1: You Are Not Behind — You Are Right On Time",
        summary:
          "Why the fear of having 'missed the wave' on AI is misplaced, and how ordinary professionals are already earning with it.",
        estMinutes: 12,
        content: `Chapter 1 opens with the case of **Sandra Mensah**, a non-technical professional who started earning with AI tools despite feeling like she'd "missed the boat." Her story sets up the chapter's central argument: most people equate the AI opportunity with a closing window, when in fact adoption is still early relative to where it's headed.

The chapter names the **"Myth of the Tech Person"** — the false belief that you need a technical or programming background to earn money with AI. It argues the opposite: the people best positioned to profit from AI are often *subject-matter experts* who know a specific industry, workflow, or audience, and who can point AI tools at that expertise.

It introduces the **AI Leverage Loop** — a repeating cycle where a person uses AI to produce more output, uses that output to earn or learn faster, and reinvests the gains into sharper use of the tools, compounding their advantage over time.

The chapter also names the **Preparation Trap**: the tendency to keep "getting ready" — more courses, more research, more tool comparisons — instead of shipping a first paid offer. A short case study of **Marcus Thompson** illustrates someone who escaped the trap by taking action on an imperfect first offer rather than waiting to feel fully ready.

**Mindset Shift #1** frames the shift as moving from "I need to catch up" to "I am early enough to build a real advantage right now."`,
        keyTakeaways: [
          "You don't need a coding background — subject-matter expertise plus AI tools is a legitimate income path.",
          "The AI Leverage Loop: use AI to produce more → earn/learn faster → reinvest into sharper tool use.",
          "The Preparation Trap keeps people endlessly researching instead of shipping a first paid offer.",
          "Being 'early' is a mindset choice, not a fact about the calendar.",
        ],
        actionStep:
          "Write your own 'AI Income Declaration' — a short, specific statement of what you intend to build and by when.",
        caseStudy:
          "Sandra Mensah, who worried she'd missed the AI wave, and Marcus Thompson, who escaped the Preparation Trap by shipping an imperfect first offer.",
        quiz: [
          {
            prompt: "What does Chapter 1 call the false belief that you need to be technical to profit from AI?",
            choices: [
              "The Coding Requirement",
              "The Myth of the Tech Person",
              "The Programmer's Paradox",
              "The Developer Trap",
            ],
            answer: 1,
          },
          {
            prompt: "What is the 'Preparation Trap'?",
            choices: [
              "Spending money on AI tools you don't need",
              "Endlessly researching and preparing instead of shipping a first paid offer",
              "Preparing a portfolio before applying for jobs",
              "Over-automating a workflow before testing it",
            ],
            answer: 1,
          },
          {
            prompt: "The AI Leverage Loop describes a cycle of:",
            choices: [
              "Learning to code, then teaching others to code",
              "Producing more with AI, earning/learning faster, and reinvesting into sharper tool use",
              "Buying tools, cancelling them, then buying new ones",
              "Outsourcing work, then automating the outsourcing",
            ],
            answer: 1,
          },
        ],
      },
      {
        slug: "ch2-five-lies",
        title: "Chapter 2: The 5 Lies Keeping You Broke and Confused",
        summary:
          "Five specific, disempowering beliefs about AI income — named and dismantled one by one.",
        estMinutes: 12,
        content: `Chapter 2 identifies five specific lies that stop capable people from starting an AI-powered income stream:

1. **The coding requirement lie** — that you must be able to program to use AI professionally.
2. **The replacement fear** — the belief that AI will make your skills worthless, rather than amplify them.
3. **The saturation myth** — the idea that "everyone is already doing this" and the opportunity is gone.
4. **The audience requirement** — the assumption you need an existing following before you can earn.
5. **The cost/complexity lie** — that profiting from AI requires expensive tools or complicated technical setups.

For each lie, the chapter pairs the false belief with a more accurate reframe, grounded in the reality that most paying clients care about outcomes, not your tool stack or follower count.

The chapter includes a **Belief Audit** exercise: readers list which of the five lies they personally hold most strongly, rate how much each one is currently costing them, and write a one-sentence counter-belief to replace it.

**Mindset Shift #2** reframes the work ahead: your job isn't to become a technologist — it's to become someone who reliably turns AI output into a result a client or customer will pay for.`,
        keyTakeaways: [
          "The 5 lies: coding requirement, replacement fear, saturation myth, audience requirement, cost/complexity.",
          "Clients pay for outcomes, not your tool stack or your follower count.",
          "Saturation is a myth at the level of 'AI users' — it is not a myth at the level of a specific, well-served niche.",
          "You do not need an existing audience to land your first paying client.",
        ],
        actionStep:
          "Complete the Belief Audit: identify your strongest limiting belief among the 5 lies and write a one-sentence counter-belief.",
        quiz: [
          {
            prompt: "Which of these is NOT one of the '5 Lies' in Chapter 2?",
            choices: [
              "The replacement fear",
              "The saturation myth",
              "The audience requirement",
              "The certification requirement",
            ],
            answer: 3,
          },
          {
            prompt: "According to the chapter, what do most paying clients actually care about?",
            choices: [
              "Which AI tools you use",
              "How many followers you have",
              "Outcomes and results",
              "Your formal credentials",
            ],
            answer: 2,
          },
        ],
      },
      {
        slug: "ch3-ai-income-mindset-framework",
        title: "Chapter 3: The AI Income Mindset Framework",
        summary:
          "The 3P Framework (Position → Produce → Profit), a skills inventory, and the concept of the Hybrid Professional.",
        estMinutes: 15,
        content: `Chapter 3 introduces the book's core strategic framework: **Position → Produce → Profit (the 3P Framework)**.

- **Position** — get clear on the specific niche, audience, and problem you're best suited to serve, using your existing knowledge plus AI leverage.
- **Produce** — use AI tools to create the deliverables, content, or services that solve that problem, faster and at higher quality than you could unaided.
- **Profit** — package and price that output into an offer someone will actually pay for.

To find a Position, the chapter walks through a **Skills Inventory** across four categories: professional/career skills, hobbies and personal interests, life experience (including things like parenting, caregiving, or managing a household budget), and "boring" institutional knowledge (compliance, admin, scheduling, local business operations).

The **Skills Amplifier** exercise has readers cross their existing skills against AI capabilities to find where the two multiply each other — for example, someone with bookkeeping experience amplified by AI-assisted automation tools becomes able to serve far more small-business clients per month than they could manually.

The chapter names the **Hybrid Professional** as the winning identity: not "AI expert," but a domain expert who has fused their real-world experience with AI leverage. A table of "boring" niches (local services, professional trades, admin-heavy industries) makes the point that unglamorous, overlooked niches are often the least saturated and most profitable.

**Mindset Shift #3** and the chapter's Action Step ask readers to draft a **Position Statement** — a specific sentence naming who they serve, what problem they solve, and how AI helps them solve it better or faster.`,
        keyTakeaways: [
          "The 3P Framework: Position (who/what) → Produce (use AI to create) → Profit (package and price).",
          "Skills Inventory has four categories: professional skills, hobbies/interests, life experience, 'boring' institutional knowledge.",
          "The Skills Amplifier exercise finds where your existing skills and AI capabilities multiply each other.",
          "'Boring,' unglamorous niches are often the least saturated and most profitable.",
          "The winning identity is the 'Hybrid Professional': a domain expert fused with AI leverage — not a generic 'AI expert.'",
        ],
        actionStep:
          "Write your Position Statement: who you serve, what problem you solve, and how AI helps you solve it better or faster.",
        quiz: [
          {
            prompt: "What are the three stages of the 3P Framework, in order?",
            choices: [
              "Plan → Prototype → Publish",
              "Position → Produce → Profit",
              "Prepare → Practice → Profit",
              "Pitch → Produce → Promote",
            ],
            answer: 1,
          },
          {
            prompt: "What does the chapter call the ideal identity for someone monetizing AI skills?",
            choices: [
              "The AI Specialist",
              "The Prompt Engineer",
              "The Hybrid Professional",
              "The Tech Generalist",
            ],
            answer: 2,
          },
          {
            prompt: "According to the chapter, 'boring' niches tend to be:",
            choices: [
              "Oversaturated and low-margin",
              "The least saturated and often the most profitable",
              "Impossible to serve with AI tools",
              "Only viable for large agencies",
            ],
            answer: 1,
          },
        ],
      },
    ],
  },
  {
    slug: "part-2-toolkit",
    title: "Part Two: The Toolkit",
    description:
      "A curated, deliberately small set of tools, plus the single most important skill for using them well: prompting.",
    lessons: [
      {
        slug: "ch4-only-ai-tools-you-need",
        title: "Chapter 4: The Only AI Tools You Need (And the Ones to Ignore)",
        summary:
          "A tiered tool list — the Core Four, the Income Boosters, and the tools to deliberately ignore for now.",
        estMinutes: 14,
        content: `Chapter 4 pushes back on "tool overwhelm" by organizing the AI landscape into three deliberate tiers.

**Tier 1 — The Core Four**: a small, non-negotiable starter stack — ChatGPT and Claude (general-purpose reasoning and writing), Canva AI (design), and Midjourney or Adobe Firefly (image generation) — with Notion AI and Gemini mentioned as optional additions depending on workflow.

**Tier 2 — Income Boosters**: tools worth adding once you have a working income stream and a specific bottleneck to solve — Jasper (marketing copy at scale), ElevenLabs (AI voice), Descript (audio/video editing), and Zapier AI (automation).

**Tier 3 — Ignore for now**: tools that are trendy, technically impressive, or frequently recommended online, but that add complexity without adding income for a beginner — the chapter argues these should be avoided until a specific, proven need for them appears.

The chapter gives an **upgrade decision framework**: only add a new tool when an existing bottleneck is costing you time or money that the tool would clearly resolve — never "because it's new."

A **starter setup checklist** walks through getting the Core Four tools installed and configured in under an hour, and the chapter closes with three common tool mistakes: tool-hopping instead of mastering one tool, subscribing to tools before validating you need them, and choosing tools based on hype rather than the specific task at hand.

**Mindset Shift #4**: fewer tools, used deeply, beat many tools used shallowly.`,
        keyTakeaways: [
          "Tier 1 Core Four: ChatGPT, Claude, Canva AI, and Midjourney/Firefly (Notion AI, Gemini optional).",
          "Tier 2 Income Boosters: Jasper, ElevenLabs, Descript, Zapier AI — add only once you hit a real bottleneck.",
          "Tier 3: deliberately ignore trendy tools until you have a proven, specific need.",
          "Upgrade decision rule: add a tool only when it clearly resolves a bottleneck costing you time or money.",
          "The 3 common tool mistakes: tool-hopping, subscribing before validating, and choosing tools by hype.",
        ],
        actionStep:
          "Complete the starter setup checklist: install and configure the Core Four tools.",
        quiz: [
          {
            prompt: "Which four tools make up the book's 'Core Four' (Tier 1)?",
            choices: [
              "Jasper, ElevenLabs, Descript, Zapier AI",
              "ChatGPT, Claude, Canva AI, and Midjourney/Firefly",
              "Notion AI, Gemini, Zapier, Descript",
              "ChatGPT, Jasper, Firefly, Zapier AI",
            ],
            answer: 1,
          },
          {
            prompt: "According to the chapter's upgrade decision framework, when should you add a new tool?",
            choices: [
              "As soon as it's released",
              "When it's trending on social media",
              "Only when it clearly resolves a specific, proven bottleneck",
              "Whenever a competitor uses it",
            ],
            answer: 2,
          },
        ],
      },
      {
        slug: "ch5-art-of-the-prompt",
        title: "Chapter 5: The Art of the Prompt — How to Get Extraordinary Output",
        summary:
          "The CLEAR Formula, the 3-Pass Method, and a library of 50 starter prompt templates.",
        estMinutes: 18,
        content: `Chapter 5 is the book's most tactical chapter on the single highest-leverage skill in the toolkit: prompting.

It introduces the **CLEAR Formula**, a five-part structure for any high-quality prompt:
- **C — Context**: background the model needs (who you are, the situation, constraints).
- **L — Length**: how long the output should be.
- **E — Examples**: sample input/output or reference material to anchor tone and format.
- **A — Audience**: who the output is ultimately for.
- **R — Role**: what persona or expertise you want the model to adopt.

The chapter walks through a fully assembled CLEAR prompt and shows five before/after comparisons across different tasks (an email, a social caption, a product description, a client proposal, a blog outline), demonstrating how a vague one-line request produces generic output while a CLEAR-structured prompt produces something close to publish-ready.

It then introduces the **3-Pass Method** for refining output instead of accepting the first draft:
1. **Draft pass** — generate the initial version.
2. **Accuracy/Depth pass** — check facts, add missing detail, correct errors.
3. **Voice/Polish pass** — rewrite for tone, style, and the specific audience.

The chapter recommends building a **Prompt Library** — a personal, organized archive of prompts that worked, tagged by task type, so you never start from a blank page. It includes **50 starter prompt templates** across five sections (also reproduced in Appendix B), and closes with five common prompting mistakes: being too vague, over-stuffing a single prompt with unrelated requests, skipping the Audience component, accepting the first draft without a Depth or Polish pass, and never saving prompts that worked.

**Mindset Shift #5**: prompting is a skill you build through iteration, not a trick you either know or don't.`,
        keyTakeaways: [
          "The CLEAR Formula: Context, Length, Examples, Audience, Role.",
          "The 3-Pass Method: Draft → Accuracy/Depth → Voice/Polish — never stop at the first draft.",
          "Build a personal Prompt Library so you never start from a blank page.",
          "50 starter prompt templates are provided across five categories (see Appendix B).",
          "Common mistakes: vagueness, stuffing unrelated requests into one prompt, skipping Audience, and not saving working prompts.",
        ],
        actionStep:
          "Take one real task you need done this week and write a full CLEAR-structured prompt for it, then run it through all 3 passes.",
        quiz: [
          {
            prompt: "What does the 'A' in the CLEAR Formula stand for?",
            choices: ["Accuracy", "Audience", "Assumptions", "Automation"],
            answer: 1,
          },
          {
            prompt: "What are the three passes in the 3-Pass Method, in order?",
            choices: [
              "Draft → Accuracy/Depth → Voice/Polish",
              "Outline → Draft → Publish",
              "Research → Write → Edit",
              "Context → Content → Conversion",
            ],
            answer: 0,
          },
          {
            prompt: "What is a 'Prompt Library' as described in the chapter?",
            choices: [
              "A paid database of prompts sold online",
              "A personal, organized archive of prompts that worked, tagged by task",
              "A built-in ChatGPT feature",
              "A community forum for sharing prompts",
            ],
            answer: 1,
          },
        ],
      },
    ],
  },
  {
    slug: "part-3-income-streams",
    title: "Part Three: The Income Streams",
    description:
      "Seven fully-scoped income streams, each with positioning, pricing, workflow, and a real case study.",
    lessons: [
      {
        slug: "ch6-freelance-writing-content",
        title: "Chapter 6: AI-Assisted Freelance Writing & Content Creation",
        summary:
          "Using AI to deliver freelance writing and content services faster and at higher margin.",
        estMinutes: 16,
        content: `Chapter 6 opens Part Three's stream-by-stream breakdown, each following the same consistent structure: a snapshot table, what the stream is and why it works, who it's best suited for, a menu of sellable services, positioning advice, a table of platforms to find clients on, a pricing framework, a production workflow, red flags to avoid, an earnings table, scripts for handling common client objections, a case study, a Mindset Shift, an Action Step, and a chapter summary.

For freelance writing, AI is positioned as a force multiplier for research, first drafts, and editing — not a replacement for a writer's judgment, voice, or client relationship. The services menu spans blog posts, email sequences, website copy, case studies, and ghostwriting, with the CLEAR Formula and 3-Pass Method from Chapter 5 applied directly to production.

The case study follows **Priya Nair**, who used AI-assisted workflows to increase both her writing throughput and her effective hourly rate without lowering quality.`,
        keyTakeaways: [
          "AI acts as a force multiplier for research, drafting, and editing — not a replacement for a writer's judgment or voice.",
          "Every income-stream chapter follows the same structure: services menu, platforms, pricing, workflow, red flags, case study.",
          "Applying the CLEAR Formula and 3-Pass Method directly increases both throughput and effective hourly rate.",
        ],
        caseStudy:
          "Priya Nair, who increased her freelance writing throughput and effective hourly rate using AI-assisted drafting and editing.",
        actionStep:
          "Pick one writing service from the chapter's menu and draft a one-paragraph service description you could post today.",
        quiz: [
          {
            prompt: "In Chapter 6, AI is positioned as:",
            choices: [
              "A replacement for a writer's judgment and voice",
              "A force multiplier for research, drafting, and editing",
              "Only useful for grammar checking",
              "Unsuitable for professional freelance writing",
            ],
            answer: 1,
          },
        ],
      },
      {
        slug: "ch7-selling-ai-digital-products",
        title: "Chapter 7: Selling AI-Generated Digital Products",
        summary:
          "Eight product types, a 3-criteria test for winning products, and a 30-minute validation method.",
        estMinutes: 16,
        content: `Chapter 7 covers building and selling digital products created with AI assistance — templates, guides, planners, courses, and similar formats across eight product types identified in the chapter.

It gives **3 Criteria** for judging whether a product idea is worth building: it solves a specific, recurring problem; the target buyer is easy to reach; and it can be produced quickly enough with AI tools to test before investing significant time.

The **30-Minute Validation Method** has readers test demand for a product idea in half an hour — using quick searches, community posts, or direct outreach — before committing to full production. This is followed by an **8-step creation workflow** taking an idea from concept through AI-assisted drafting, design, and launch.

The case study follows **Denise Okafor**, who used the validation method to avoid building an unwanted product and pivoted to one with confirmed demand.`,
        keyTakeaways: [
          "8 digital product types are covered as viable formats.",
          "3 Criteria for a winning product: solves a specific recurring problem, easy-to-reach buyer, fast-enough to produce and test.",
          "The 30-Minute Validation Method tests demand before you invest real production time.",
          "An 8-step workflow takes a validated idea from concept to launch.",
        ],
        caseStudy:
          "Denise Okafor, who used the 30-Minute Validation Method to avoid building an unwanted product and pivoted to one with confirmed demand.",
        actionStep:
          "Run the 30-Minute Validation Method on one digital product idea before building anything.",
        quiz: [
          {
            prompt: "What is the purpose of the 30-Minute Validation Method?",
            choices: [
              "To design a product's cover art quickly",
              "To test demand for a product idea before investing real production time",
              "To write 30 minutes of ad copy",
              "To speed-run customer support responses",
            ],
            answer: 1,
          },
        ],
      },
      {
        slug: "ch8-ai-social-media-management",
        title: "Chapter 8: AI-Powered Social Media Management",
        summary:
          "Platform-by-platform playbooks and a production workflow for running social media services with AI.",
        estMinutes: 16,
        content: `Chapter 8 breaks down running a social media management service accelerated by AI tools, with platform-specific deep-dives covering Instagram, LinkedIn, Facebook, Google Business Profile, and TikTok/Shorts — including format norms and posting cadence for each.

A production workflow shows how to batch-plan, draft, and schedule a month of content using AI for captions, hooks, and repurposing, and the chapter lays out service packages (e.g., a base posting package vs. a full-management package with strategy and community response) that can be sold to local businesses and small brands.

The case study follows **Jerome Williams**, who packaged this stream into a recurring monthly service for small business clients.`,
        keyTakeaways: [
          "Platform playbooks cover Instagram, LinkedIn, Facebook, Google Business Profile, and TikTok/Shorts.",
          "A batching workflow lets you plan, draft, and schedule a month of content in a fraction of the usual time.",
          "Service packages typically range from a base posting tier to a full-management tier with strategy included.",
        ],
        caseStudy:
          "Jerome Williams, who packaged AI-accelerated social media management into a recurring monthly service.",
        quiz: [
          {
            prompt: "Which of these platforms does Chapter 8 NOT specifically deep-dive?",
            choices: ["Instagram", "LinkedIn", "Pinterest", "TikTok/Shorts"],
            answer: 2,
          },
        ],
      },
      {
        slug: "ch9-ai-automation-local-businesses",
        title: "Chapter 9: AI Automation Services for Local Businesses",
        summary:
          "Selling automation built with tools like Zapier and Make, using 10 proven templates and a Business Efficiency Audit.",
        estMinutes: 16,
        content: `Chapter 9 covers a higher-ticket service: building automations for local businesses using no-code tools like Zapier and Make. The chapter provides **10 proven automation templates** — recurring, repeatable workflows (such as automated lead follow-up, review requests, appointment reminders, and intake-form routing) that solve common small-business pain points.

The **Business Efficiency Audit** is the chapter's core sales tool: a structured set of questions a provider asks a prospective client to surface manual, repetitive tasks eating up staff time — tasks that can then be automated and sold as a project or retainer.

The case study follows **Sandra Okonkwo**, who used the Business Efficiency Audit as her core discovery call and used it to sell automation retainers to local businesses.`,
        keyTakeaways: [
          "This stream uses no-code automation tools like Zapier and Make rather than custom code.",
          "10 proven automation templates target common small-business pain points.",
          "The Business Efficiency Audit is both a discovery tool and a sales tool for landing automation clients.",
        ],
        caseStudy:
          "Sandra Okonkwo, who used the Business Efficiency Audit as a discovery call to sell automation retainers.",
        actionStep:
          "Pick one of the 10 automation templates and identify a local business it could realistically help.",
        quiz: [
          {
            prompt: "What no-code tools does Chapter 9 focus on for building automations?",
            choices: [
              "Python and SQL",
              "Zapier and Make",
              "WordPress plugins",
              "Excel macros",
            ],
            answer: 1,
          },
          {
            prompt: "What is the Business Efficiency Audit used for?",
            choices: [
              "Auditing a business's tax filings",
              "Surfacing manual, repetitive tasks that can be automated and sold as a service",
              "Reviewing a company's social media analytics",
              "Certifying a business as 'AI-ready'",
            ],
            answer: 1,
          },
        ],
      },
      {
        slug: "ch10-ai-prompt-packs",
        title: "Chapter 10: Creating and Selling AI Prompt Packs",
        summary:
          "Turning curated prompt collections into a sellable digital product across 50 niche ideas.",
        estMinutes: 14,
        content: `Chapter 10 treats prompt packs — curated, tested collections of prompts for a specific niche or task — as their own standalone product category. It lists **50 niche ideas** (by industry, role, or use case) and walks through a **pack creation workflow**: choosing a niche, drafting and testing each prompt, organizing the collection, and packaging it for sale.

Six **fully-scoped sample packs** are provided as concrete templates readers can adapt directly (e.g., a pack for real estate agents, one for coaches, one for small e-commerce sellers).

The case study follows **Terri Nakamura**, who built a prompt pack business targeting a specific professional niche.`,
        keyTakeaways: [
          "Prompt packs are curated, tested collections of prompts sold as a standalone digital product.",
          "50 niche ideas are provided to seed pack topics.",
          "6 fully-scoped sample packs are included as adaptable templates.",
        ],
        caseStudy: "Terri Nakamura, who built a prompt pack business around a specific professional niche.",
        quiz: [
          {
            prompt: "How many fully-scoped sample prompt packs does Chapter 10 provide?",
            choices: ["3", "6", "10", "50"],
            answer: 1,
          },
        ],
      },
      {
        slug: "ch11-ai-enhanced-coaching-consulting",
        title: "Chapter 11: AI-Enhanced Coaching & Consulting Services",
        summary:
          "Using AI to scale coaching delivery, across 8 niches and 3 programme structures, with outcome-anchored pricing.",
        estMinutes: 15,
        content: `Chapter 11 applies the book's framework to coaching and consulting, an income stream built on expertise rather than deliverables. It surveys **8 coaching niches** and **3 programme structures** (e.g., a self-paced track supported by AI-assisted resources, a hybrid group + AI-tools track, and a high-touch 1:1 track), showing how AI tools can support session prep, custom resource generation, and progress tracking without replacing the human relationship at the center of coaching.

Pricing is anchored to **outcomes** rather than time — the chapter argues coaches should price around the transformation or result delivered, not hours spent, and shows how AI-assisted efficiency supports higher-margin, outcome-based pricing.

The case study follows **David Osei**, who restructured his consulting offer around outcome-anchored pricing supported by AI-assisted delivery.`,
        keyTakeaways: [
          "AI supports coaching delivery (session prep, custom resources, progress tracking) without replacing the human relationship.",
          "8 coaching niches and 3 programme structures are covered.",
          "Pricing should be anchored to outcomes/transformation delivered, not hours spent.",
        ],
        caseStudy: "David Osei, who restructured his consulting pricing around outcomes rather than hours.",
        quiz: [
          {
            prompt: "What does Chapter 11 recommend anchoring coaching/consulting pricing to?",
            choices: [
              "Hours spent in session",
              "Number of AI tools used",
              "The outcome or transformation delivered",
              "Competitor pricing alone",
            ],
            answer: 2,
          },
        ],
      },
      {
        slug: "ch12-content-at-scale",
        title: "Chapter 12: Content Creation at Scale: YouTube, Newsletters, Blogs",
        summary:
          "Building durable, monetizable media properties across three formats, with monetization stacking.",
        estMinutes: 15,
        content: `Chapter 12 covers building longer-term media assets — YouTube channels, newsletters, and blogs — accelerated by AI tools for research, scripting, drafting, and repurposing across formats. Each of the three formats gets its own deep-dive covering format-specific production workflows.

The chapter introduces **monetization stacking**: layering multiple revenue sources (ads, sponsorships, affiliate links, digital products, and services) on top of a single content property, rather than relying on one channel of income.

The case study follows **Aiko Tanaka**, who used AI-assisted production to grow and monetize a content property across more than one format.`,
        keyTakeaways: [
          "Three format deep-dives: YouTube, newsletters, and blogs.",
          "AI accelerates research, scripting, drafting, and cross-format repurposing.",
          "Monetization stacking layers multiple revenue sources on a single content property.",
        ],
        caseStudy: "Aiko Tanaka, who grew and monetized a content property using AI-assisted production.",
        quiz: [
          {
            prompt: "What is 'monetization stacking' as described in Chapter 12?",
            choices: [
              "Using multiple AI tools at once",
              "Layering multiple revenue sources on top of a single content property",
              "Posting the same content on every platform",
              "Stacking ad breaks in a single video",
            ],
            answer: 1,
          },
        ],
      },
    ],
  },
  {
    slug: "part-4-launch-plan",
    title: "Part Four: The Launch Plan",
    description:
      "Choosing the right stream for you, then a concrete day-by-day plan to launch it in 30 days.",
    lessons: [
      {
        slug: "ch13-choosing-your-path",
        title: "Chapter 13: Choosing Your Path — The Income Stream Selector",
        summary:
          "An AI Income Fit Matrix, stream-combination profiles, and a 7-Day Validation Sprint.",
        estMinutes: 14,
        content: `Chapter 13 helps readers choose among the seven income streams from Part Three using the **AI Income Fit Matrix**, a scoring exercise that weighs each stream against the reader's skills, available time, risk tolerance, and income goals.

It presents **6 stream-combination profiles** — common ways readers pair two complementary streams (for example, freelance writing plus prompt packs, or social media management plus automation services) to diversify income and cross-sell between offers.

A **7-Day Validation Sprint** gives a compressed, day-by-day process for testing a chosen stream's demand before fully committing, and the chapter closes with a **12-month roadmap** and a **Commitment Statement template** for locking in a direction.`,
        keyTakeaways: [
          "The AI Income Fit Matrix scores each stream against your skills, time, risk tolerance, and goals.",
          "6 stream-combination profiles show common, complementary stream pairings.",
          "The 7-Day Validation Sprint tests real demand before you fully commit to a stream.",
          "A 12-month roadmap and Commitment Statement template close out the decision process.",
        ],
        actionStep:
          "Score yourself on the AI Income Fit Matrix and pick one stream (or combination) to commit to for the next 30 days.",
        quiz: [
          {
            prompt: "What does the AI Income Fit Matrix score a stream against?",
            choices: [
              "Only your available budget",
              "Your skills, available time, risk tolerance, and income goals",
              "The number of competitors in that niche",
              "How trendy the stream currently is",
            ],
            answer: 1,
          },
        ],
      },
      {
        slug: "ch14-30-day-launch-plan",
        title: "Chapter 14: Your 30-Day AI Income Launch Plan",
        summary:
          "A full day-by-day plan across four weeks: Foundation, Outreach, Convert, Deliver & Systematise.",
        estMinutes: 18,
        content: `Chapter 14 lays out a day-by-day, 30-day launch plan organized into four weekly phases:

- **Week 1 — Foundation**: finalize positioning, set up tools, prepare a portfolio or samples, and define the initial offer.
- **Week 2 — Outreach**: begin reaching prospective clients or customers directly, using the scripts provided in Appendix C.
- **Week 3 — Convert**: turn conversations and leads into the first paid engagements.
- **Week 4 — Deliver & Systematise**: deliver the first paid work at a high standard and begin turning the process into repeatable systems (templates, SOP notes) for the next round of clients.

A **progress tracker** lets readers check off each day's task, and a **troubleshooting table** addresses common stalls (no responses to outreach, freezing on pricing, second-guessing the offer). The chapter closes with adaptations of the 30-day plan for product-based and content-based streams, which follow a different cadence than service-based streams.`,
        keyTakeaways: [
          "The 30-day plan has four weekly phases: Foundation, Outreach, Convert, Deliver & Systematise.",
          "Week 2 outreach uses the scripts provided in Appendix C.",
          "Week 4 focuses on systematizing delivery, not just completing the first project.",
          "Product- and content-based streams follow adapted versions of the same 30-day cadence.",
        ],
        actionStep:
          "Start Week 1 today: finalize your positioning and prepare your first portfolio sample or offer draft.",
        quiz: [
          {
            prompt: "What is the focus of Week 4 in the 30-Day Launch Plan?",
            choices: [
              "Finalizing your niche",
              "Cold outreach to new leads",
              "Delivering the first paid work and systematising the process",
              "Raising your prices",
            ],
            answer: 2,
          },
        ],
      },
    ],
  },
  {
    slug: "part-5-scaling-sustainability",
    title: "Part Five: Scaling & Sustainability",
    description:
      "Turning a validated side income into a durable business, staying current as AI evolves, and the money mindset required to sustain it.",
    lessons: [
      {
        slug: "ch15-side-income-to-serious-business",
        title: "Chapter 15: From Side Income to Serious Business",
        summary:
          "Hustler → Operator → Owner stages, value-based pricing, SOPs, and building toward monthly recurring revenue.",
        estMinutes: 16,
        content: `Chapter 15 maps the growth path from a first paid win to a sustainable business, through three stages: **Hustler** (trading time for money, taking any client), **Operator** (systems and standards are in place, pricing has risen), and **Owner** (the business runs on documented processes and, potentially, other people's labor, not solely the founder's hours).

It lays out **rate-raising rules** for knowing when and how much to increase prices, and introduces the **Value Pricing System** — pricing based on the value delivered to the client rather than hours worked, extending the outcome-based pricing idea from Chapter 11 across all streams.

An **SOP framework** (standard operating procedures) shows how to document repeatable parts of the work so they can be delegated or handed off. The chapter also covers building an email list, hiring a virtual assistant (VA), productising services into fixed packages, and evolving toward a **monthly recurring revenue (MRR)** model for more predictable income.`,
        keyTakeaways: [
          "Three growth stages: Hustler → Operator → Owner.",
          "The Value Pricing System prices based on value delivered, not hours worked.",
          "An SOP framework documents repeatable work so it can be delegated.",
          "Growth levers include email list building, hiring a VA, productising services, and moving toward MRR.",
        ],
        quiz: [
          {
            prompt: "What are the three growth stages in Chapter 15?",
            choices: [
              "Beginner → Intermediate → Expert",
              "Hustler → Operator → Owner",
              "Freelancer → Agency → Enterprise",
              "Solo → Team → Franchise",
            ],
            answer: 1,
          },
          {
            prompt: "The Value Pricing System prices work based on:",
            choices: [
              "Hours worked",
              "Competitor rates",
              "The value delivered to the client",
              "The number of AI tools used on the project",
            ],
            answer: 2,
          },
        ],
      },
      {
        slug: "ch16-staying-ahead-as-ai-evolves",
        title: "Chapter 16: Staying Ahead as AI Evolves",
        summary:
          "A 10-minute daily briefing system, five permanently valuable skills, and a framework for evaluating new tools.",
        estMinutes: 14,
        content: `Chapter 16 addresses a real risk in an AI-based business: the tools themselves change fast. It proposes a **10-Minute Daily AI Briefing System** — a short, consistent daily habit of scanning curated sources to stay current without falling into constant tool-chasing, backed by a table of recommended information sources.

It names **5 permanently valuable skills** that remain useful regardless of which specific tools rise or fall: things like client communication, taste/judgment in evaluating AI output, structured problem-solving, positioning, and adaptability itself.

The chapter also covers building a **personal brand** around a set of core pillars (rather than around any single tool), the importance of **diversification** across income streams and tools, a **tool evaluation framework** for deciding whether a new tool is worth adopting, and a **weekly learning system** for deeper, less time-pressured skill development beyond the daily briefing.

**Mindset Shift #14** reframes constant AI change from a threat into the actual terrain of the opportunity.`,
        keyTakeaways: [
          "The 10-Minute Daily AI Briefing System keeps you current without constant tool-chasing.",
          "5 permanently valuable skills stay useful no matter which tools change.",
          "Build a personal brand around durable pillars, not around any single AI tool.",
          "Diversify both income streams and tools; use the tool evaluation framework before adopting anything new.",
        ],
        quiz: [
          {
            prompt: "What is the purpose of the 10-Minute Daily AI Briefing System?",
            choices: [
              "To learn a new tool every day",
              "To stay current on AI developments without constant tool-chasing",
              "To write ten prompts per day",
              "To review client feedback daily",
            ],
            answer: 1,
          },
        ],
      },
      {
        slug: "ch17-money-mindset-of-digital-earner",
        title: "Chapter 17: The Money Mindset of a Digital Earner",
        summary:
          "The psychological terrain of building income: the Trough of Disillusionment, the 90-Day Rule, and the Two-Goal System.",
        estMinutes: 15,
        content: `The book's closing chapter turns to the psychology of sustaining an income built this way. It names the **Trough of Disillusionment** — the predictable dip in motivation after the initial excitement of starting fades and before real traction shows up — and pairs it with the **90-Day Rule**: committing to a minimum 90-day runway before judging whether a stream is working.

It covers **3 pricing psychology patterns** that cause new earners to underprice their work, an **identity shift exercise** for internalizing "I am someone who gets paid for this" rather than treating it as a side experiment, and the **Two-Goal System** — setting both a **Survival Number** (the minimum needed to sustain the effort) and a **Freedom Number** (the number that would represent real financial change) as two distinct, motivating targets.

The chapter also introduces an **Anti-Comparison Protocol** for handling the discouragement of watching others' visible wins online, a **Celebration Practice** for acknowledging small progress, and a **6-Month Vision Letter** template — a letter to your future self used to anchor motivation through the inevitable slow stretches.

**Mindset Shift #15** closes the book: sustainable income comes from identity change and consistency, not from finding one more perfect tool or tactic.`,
        keyTakeaways: [
          "The Trough of Disillusionment is the predictable motivation dip after the initial excitement fades.",
          "The 90-Day Rule: commit to a minimum runway before judging whether a stream is working.",
          "The Two-Goal System sets both a Survival Number and a Freedom Number as separate targets.",
          "The Anti-Comparison Protocol and Celebration Practice protect motivation through slow stretches.",
        ],
        actionStep:
          "Write your own 6-Month Vision Letter to your future self, and set your Survival Number and Freedom Number.",
        quiz: [
          {
            prompt: "What is the '90-Day Rule'?",
            choices: [
              "A 90-day money-back guarantee for clients",
              "Committing to a minimum 90-day runway before judging whether a stream is working",
              "A rule limiting you to 90 days per project",
              "A 90-day free trial period for AI tools",
            ],
            answer: 1,
          },
          {
            prompt: "In the Two-Goal System, what are the two targets called?",
            choices: [
              "Minimum Number and Maximum Number",
              "Survival Number and Freedom Number",
              "Base Rate and Stretch Rate",
              "Starter Goal and Stretch Goal",
            ],
            answer: 1,
          },
        ],
      },
    ],
  },
];
