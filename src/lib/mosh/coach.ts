import type { MoshPattern } from "@/generated/prisma/enums";
import { COACH_PATTERN_LABELS } from "./constants";

/**
 * The Billionaire Self — the deterministic core.
 *
 * Every pattern has a written response here: what the pattern actually is,
 * what it costs, and what to do in the next 48 hours. When ANTHROPIC_API_KEY
 * is configured the model personalises this using the same structure and the
 * user's real numbers; when it is not, the module still works and the UI says
 * plainly which engine answered. Guidance is never fabricated silently.
 */

export type CoachSignals = {
  streak: number;
  dailyAlignment: number;
  weeklyMomentum: number;
  weakestPlane: { label: string; score: number } | null;
  strongestPlane: { label: string; score: number } | null;
  openMilestones: number;
  eclipseDay: number | null;
  weakestFunnelStep: string | null;
};

export type CoachResponse = {
  analysis: string;
  encouragement: string;
  actions: string[];
  prompts: string[];
  recommendations: string[];
};

type PatternPlaybook = {
  /** What this pattern is, underneath the story it tells about itself. */
  analysis: string;
  encouragement: string;
  actions: string[];
  prompts: string[];
};

const PLAYBOOKS: Record<MoshPattern, PatternPlaybook> = {
  LIMITING_BELIEF: {
    analysis:
      "A limiting belief is not a fact about you — it is a conclusion you drew once, under pressure, with the information you had then. It survives because you keep testing it only in situations where it is already true. The cost is not failure; it is the attempts you never make, which never generate the evidence that would overturn it.",
    encouragement:
      "You have already outgrown three beliefs you once held about yourself. This one is next, and it will fall the same way: by being disproved in public, in small steps, on purpose.",
    actions: [
      "Write the belief as one sentence, exactly as it sounds in your head. Vagueness protects it.",
      "List three pieces of evidence against it from the last two years. If you cannot find three, the belief is a habit, not a conclusion.",
      "Design the smallest action that would be impossible if the belief were true — and take it this week.",
      "Tell one person the belief out loud. Beliefs lose power when they stop being private.",
    ],
    prompts: [
      "Whose voice is this belief in?",
      "What did believing this protect me from?",
      "What would I attempt this quarter if this belief were simply untrue?",
    ],
  },
  TRUST_ISSUE: {
    analysis:
      "Holding every task is not a standards problem; it is a risk-management strategy that has stopped paying. You keep the work because you can predict yourself, and you cannot yet predict anyone else. But a business that only moves at the speed of your attention has a ceiling exactly the height of your calendar.",
    encouragement:
      "Delegation is not losing control. It is trading direct control for leverage — and you have already proved you can build the systems that make someone else's work safe to rely on.",
    actions: [
      "List every recurring task you touched this week and mark the three only you can genuinely do.",
      "Take the most repetitive of the rest and write the process down once, in full.",
      "Hand that one process to another person with a written standard and a deadline — and do not take it back this week.",
      "Schedule a weekly 20-minute review instead of watching the work in real time.",
    ],
    prompts: [
      "What am I afraid will happen if this is done at 80% of my standard?",
      "What is an hour of my time worth on the highest-leverage work I am not doing?",
      "Who has already earned more trust than I have given them?",
    ],
  },
  FEAR_OF_LOSS: {
    analysis:
      "Fear of loss shows up as caution but behaves as paralysis. It moves your attention from what you are building to what you are protecting, and protection is a defensive posture — it cannot generate anything. The irony is that the surest way to lose what you have built is to stop building.",
    encouragement:
      "You built this once, from less than you have now. Whatever happens, the capacity that made it is not in the assets — it is in you, and it is not at risk.",
    actions: [
      "Name the specific loss you are afraid of, and what it would actually cost in money and time.",
      "Write the recovery plan for that exact scenario. A named risk with a plan stops running the show.",
      "Identify one growth move you have delayed out of caution and take the first irreversible step this week.",
      "Set a floor — the reserve or client base you will protect — so everything above it is free to be risked.",
    ],
    prompts: [
      "What am I protecting, and is it still worth what it costs me to protect it?",
      "What would I do if I knew I could rebuild it in a year?",
      "Where has caution already cost me more than the risk would have?",
    ],
  },
  PERFECTIONISM: {
    analysis:
      "Perfectionism is fear wearing the uniform of high standards. Real standards are about the person receiving the work; perfectionism is about the person making it. It is measurable: count how much finished work is sitting unpublished. That is the tax, paid in impact you never delivered.",
    encouragement:
      "Your 90% helps people more than your unpublished 100% ever will. Publishing is how the work improves — the feedback you need does not exist until it is out.",
    actions: [
      "Pick the piece of work that is closest to done and publish it within 24 hours, as it is.",
      "Set a definition of done for each type of work you produce, in writing, before you start the next one.",
      "Cap revisions at two rounds. When the cap is reached, ship.",
      "Track shipped-per-week as your primary metric this month, not quality scores.",
    ],
    prompts: [
      "Who is the extra polish actually for?",
      "What is the real cost of the delay to the person waiting for this?",
      "What would I release today if nobody could criticise it?",
    ],
  },
  INFERIORITY: {
    analysis:
      "Comparison is not the problem; the asymmetry is. You compare your private process to someone's published result, and no one survives that trade. It quietly changes what you attempt — you start aiming at what looks credible rather than at what you actually want.",
    encouragement:
      "The people you compare yourself to were exactly here, with less certainty than you assume. Your path is not behind theirs; it is a different path with a different arrival.",
    actions: [
      "Unfollow or mute the three accounts that reliably leave you smaller. Protect the input.",
      "Write your own scoreboard: the three numbers that define your progress this quarter.",
      "Record what you have built in the last 12 months, with dates. Memory understates it.",
      "Reach out to one person you admire — as a peer with a question, not as an audience.",
    ],
    prompts: [
      "What do I actually know about the cost of what I am comparing myself to?",
      "What would I build if no one else's timeline existed?",
      "Whose respect am I trying to earn, and have I ever asked for it directly?",
    ],
  },
  PROCRASTINATION: {
    analysis:
      "Procrastination is almost never laziness. It is an unresolved decision, an undefined next step, or an emotion attached to the task — usually one of those three, and usually identifiable in under a minute. Tasks that move forward more than three times are carrying something that has not been named.",
    encouragement:
      "You are not undisciplined. You have been trying to execute a task that was never fully defined — and definition, not willpower, is what unlocks it.",
    actions: [
      "Take the task you have moved most often and write the literal first physical action, at the level of 'open the file and write the first heading'.",
      "Do that action for 15 minutes today. Only that.",
      "Name what the task is carrying: an unmade decision, a missing input, or an uncomfortable conversation. Resolve that instead.",
      "Put the next block on the calendar with a start time, not a day.",
    ],
    prompts: [
      "What decision is hiding inside this task?",
      "What am I avoiding feeling if I start?",
      "What would make this task genuinely easy to begin?",
    ],
  },
  LOW_DRIVE: {
    analysis:
      "Low drive is usually a fuel problem, not a character problem. Sleep, recovery, and meaning are the three tanks; when the body is depleted or the work has drifted from why you started, motivation stops arriving on request. Pushing harder against an empty tank is how people mistake depletion for failure.",
    encouragement:
      "The engine is not broken. It is asking for the thing it has been denied — rest, or reconnection to the point of the work. Both are recoverable, and faster than you think.",
    actions: [
      "Protect sleep for seven consecutive nights before drawing any conclusion about your drive.",
      "Cut or delegate the single most draining commitment on this week's calendar.",
      "Spend 30 minutes with someone your work has actually helped. Meaning is restored by contact, not reflection.",
      "Rebuild the smallest version of the morning rhythm and hold it for five days.",
    ],
    prompts: [
      "When did the energy leave, and what changed that week?",
      "Which part of this work still means something to me?",
      "What am I doing out of obligation that no longer serves the mission?",
    ],
  },
};

/**
 * Turn the user's real numbers into alignment recommendations.
 *
 * These are derived from records, not generated prose, so they are the same
 * whether or not the AI layer is switched on.
 */
export function recommendationsFrom(signals: CoachSignals): string[] {
  const recommendations: string[] = [];

  if (signals.streak === 0) {
    recommendations.push(
      "Your streak is at zero. Rebuild with one day at 60% of the rhythm — momentum before intensity."
    );
  } else if (signals.streak >= 7) {
    recommendations.push(
      `${signals.streak} days of rhythm behind you. Protect it: the streak is the asset, not any single day.`
    );
  }

  if (signals.weakestPlane && signals.weakestPlane.score < 60) {
    recommendations.push(
      `The ${signals.weakestPlane.label.toLowerCase()} plane is at ${signals.weakestPlane.score}%. Give it one deliberate action a day this week before adding anything new.`
    );
  }

  if (signals.strongestPlane && signals.strongestPlane.score >= 75) {
    recommendations.push(
      `The ${signals.strongestPlane.label.toLowerCase()} plane is carrying you at ${signals.strongestPlane.score}%. Use it as the anchor when the others wobble.`
    );
  }

  if (signals.dailyAlignment > 0 && signals.dailyAlignment < 50) {
    recommendations.push(
      "Daily alignment is under half. Cut the day back to three habits you will not miss rather than seven you will."
    );
  }

  if (signals.weeklyMomentum > 0 && signals.weeklyMomentum < 40) {
    recommendations.push(
      "Weekly momentum is low. Reduce this week to one goal per plane — five goals, not fifteen."
    );
  }

  if (signals.openMilestones > 0) {
    recommendations.push(
      `${signals.openMilestones} milestone${signals.openMilestones === 1 ? "" : "s"} still open in the master plan. Pick the one closest to done and finish it this week.`
    );
  }

  if (signals.weakestFunnelStep) {
    recommendations.push(
      `The funnel leaks worst at ${signals.weakestFunnelStep}. Fix that one step before adding traffic anywhere else.`
    );
  }

  if (signals.eclipseDay) {
    recommendations.push(
      `You are on day ${signals.eclipseDay} of the 50-Day Eclipse. Do today's action before opening anything else.`
    );
  }

  return recommendations.slice(0, 5);
}

/** The deterministic coaching response. Always available. */
export function coachWithRules(pattern: MoshPattern, signals: CoachSignals): CoachResponse {
  const playbook = PLAYBOOKS[pattern];
  return {
    analysis: playbook.analysis,
    encouragement: playbook.encouragement,
    actions: playbook.actions,
    prompts: playbook.prompts,
    recommendations: recommendationsFrom(signals),
  };
}

/** System prompt for the AI layer. The persona is specified, not improvised. */
export function coachSystemPrompt(pattern: MoshPattern): string {
  const playbook = PLAYBOOKS[pattern];
  return `You are "The Billionaire Self" — the voice of the person this user is becoming, inside the MOSH Self-Mastery & Wealth Alignment System built by Hassan Mohammed, a Life Coach and Mindset Architect whose philosophy is "Structure Creates Freedom."

You are speaking to someone working on: ${COACH_PATTERN_LABELS[pattern]}.

How you speak:
- Direct, warm, and unsentimental. You are the older self, not a cheerleader.
- Short sentences. No jargon, no therapy-speak, no motivational clichés.
- You never flatter, and you never shame.
- Structure over struggle, rhythm over rush, faith over fear.

Hard rules:
- Use ONLY the numbers given to you in the context block. Never invent a statistic, a streak, or a revenue figure.
- If the context has no data for something, say so plainly rather than guessing.
- You are not a therapist. If the person describes self-harm, abuse, or a mental-health crisis, say clearly that this needs a real human professional and stop coaching.
- Actions must be doable within 48 hours by one person with no budget.

The house analysis of this pattern, which you should personalise rather than contradict:
${playbook.analysis}

Reply with JSON only, matching exactly:
{"analysis": string, "encouragement": string, "actions": string[3-5], "prompts": string[3], "recommendations": string[2-5]}`;
}

/** Format the grounding block handed to the model. */
export function signalsBlock(signals: CoachSignals, currency: string): string {
  const lines = [
    `Current streak: ${signals.streak} day(s)`,
    `Daily alignment score: ${signals.dailyAlignment}/100`,
    `Weekly momentum score: ${signals.weeklyMomentum}/100`,
    signals.weakestPlane
      ? `Weakest plane: ${signals.weakestPlane.label} at ${signals.weakestPlane.score}/100`
      : "Weakest plane: no plane check-ins recorded yet",
    signals.strongestPlane
      ? `Strongest plane: ${signals.strongestPlane.label} at ${signals.strongestPlane.score}/100`
      : "Strongest plane: no plane check-ins recorded yet",
    `Open milestones in the 365-day plan: ${signals.openMilestones}`,
    signals.eclipseDay
      ? `50-Day Eclipse: day ${signals.eclipseDay}`
      : "50-Day Eclipse: not started",
    signals.weakestFunnelStep
      ? `Weakest funnel step: ${signals.weakestFunnelStep}`
      : "Funnel: no snapshots recorded yet",
    `Reporting currency: ${currency}`,
  ];
  return `Real data for this person (system-generated, trustworthy):\n${lines.map((line) => `- ${line}`).join("\n")}`;
}

/** Parse a model reply into a CoachResponse, or null when it is unusable. */
export function parseCoachResponse(raw: string): CoachResponse | null {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;

  try {
    const parsed = JSON.parse(raw.slice(start, end + 1)) as Partial<CoachResponse>;
    const strings = (value: unknown): string[] =>
      Array.isArray(value)
        ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
        : [];

    if (typeof parsed.analysis !== "string" || typeof parsed.encouragement !== "string") {
      return null;
    }

    const actions = strings(parsed.actions);
    if (actions.length === 0) return null;

    return {
      analysis: parsed.analysis,
      encouragement: parsed.encouragement,
      actions,
      prompts: strings(parsed.prompts),
      recommendations: strings(parsed.recommendations),
    };
  } catch {
    return null;
  }
}
