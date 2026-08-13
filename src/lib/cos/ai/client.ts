import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { serviceUnavailable, AppError } from "../errors";
import { DEFAULT_MODEL, MODEL_PRICING_USD_PER_MTOK } from "../constants";
import type { CosContext } from "../tenancy";

let client: Anthropic | null = null;

/** True when the server is configured to call Anthropic. */
export function isAiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/**
 * The API key is read on the server only and is never sent to the browser.
 * Every AI entry point checks `isAiConfigured()` first and degrades to a clear
 * message rather than throwing an opaque SDK error.
 */
export function getAnthropic(): Anthropic {
  if (!isAiConfigured()) {
    throw serviceUnavailable(
      "The AI layer is not configured. Set ANTHROPIC_API_KEY on the server to enable it."
    );
  }
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export function resolveModel(preferred?: string | null): string {
  return preferred || process.env.MCOS_MODEL || DEFAULT_MODEL;
}

export function resolveEffort(): "low" | "medium" | "high" | "xhigh" | "max" {
  const value = process.env.MCOS_EFFORT;
  if (value === "low" || value === "medium" || value === "high" || value === "xhigh" || value === "max") {
    return value;
  }
  return "high";
}

export type UsageLike = {
  input_tokens?: number | null;
  output_tokens?: number | null;
  cache_read_input_tokens?: number | null;
  cache_creation_input_tokens?: number | null;
};

/**
 * Estimate request cost from the token counts the API reports.
 *
 * This is an estimate for the internal AI cost dashboard, priced from the
 * published list rates in constants.ts. It is not a billing record.
 */
export function estimateCostUsd(model: string, usage: UsageLike): number {
  const pricing = MODEL_PRICING_USD_PER_MTOK[model] ?? MODEL_PRICING_USD_PER_MTOK[DEFAULT_MODEL];
  const input = usage.input_tokens ?? 0;
  const output = usage.output_tokens ?? 0;
  const cacheRead = usage.cache_read_input_tokens ?? 0;
  const cacheWrite = usage.cache_creation_input_tokens ?? 0;

  const cost =
    (input / 1_000_000) * pricing.input +
    (output / 1_000_000) * pricing.output +
    (cacheRead / 1_000_000) * pricing.input * 0.1 +
    (cacheWrite / 1_000_000) * pricing.input * 1.25;

  return Math.round(cost * 1_000_000) / 1_000_000;
}

/** Persist a usage record for the AI cost dashboard. Never throws. */
export async function recordAiUsage(
  ctx: Pick<CosContext, "businessId" | "userId">,
  input: {
    model: string;
    purpose: string;
    usage: UsageLike;
    agentKey?: string | null;
    conversationId?: string | null;
    executionId?: string | null;
  }
): Promise<void> {
  try {
    await prisma.aiUsage.create({
      data: {
        businessId: ctx.businessId,
        userId: ctx.userId,
        conversationId: input.conversationId ?? null,
        executionId: input.executionId ?? null,
        agentKey: input.agentKey ?? null,
        model: input.model,
        purpose: input.purpose,
        inputTokens: input.usage.input_tokens ?? 0,
        outputTokens: input.usage.output_tokens ?? 0,
        cacheReadTokens: input.usage.cache_read_input_tokens ?? 0,
        cacheWriteTokens: input.usage.cache_creation_input_tokens ?? 0,
        estimatedCost: estimateCostUsd(input.model, input.usage),
      },
    });
  } catch (error) {
    console.error("[m-cos] failed to record AI usage", error);
  }
}

/** Map SDK failures onto safe, actionable application errors. */
export function toAiError(error: unknown): AppError {
  if (error instanceof Anthropic.RateLimitError) {
    return new AppError("The AI provider is rate limiting us. Try again in a moment.", {
      status: 429,
      code: "ai_rate_limited",
    });
  }
  if (error instanceof Anthropic.AuthenticationError) {
    return new AppError("The configured Anthropic API key was rejected.", {
      status: 503,
      code: "ai_auth_failed",
    });
  }
  if (error instanceof Anthropic.APIConnectionError) {
    return new AppError("Could not reach the AI provider.", { status: 503, code: "ai_unreachable" });
  }
  if (error instanceof Anthropic.APIError) {
    console.error("[m-cos] Anthropic API error", error.status, error.message);
    return new AppError("The AI provider returned an error. The issue has been logged.", {
      status: 502,
      code: "ai_provider_error",
    });
  }
  console.error("[m-cos] unexpected AI failure", error);
  return new AppError("The AI request failed unexpectedly.", { status: 500, code: "ai_failed" });
}

/** Concatenate the text blocks of a response, ignoring thinking blocks. */
export function textFromContent(content: Anthropic.ContentBlock[]): string {
  return content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
}
