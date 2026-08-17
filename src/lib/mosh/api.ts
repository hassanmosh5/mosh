import { NextResponse } from "next/server";
import type { z } from "zod";
import { AppError, handler } from "@/lib/cos/errors";
import { consumeRateLimit, RATE_LIMITS } from "@/lib/cos/rate-limit";
import { requireMoshContext, type MoshContext } from "./context";

type Limit = keyof typeof RATE_LIMITS;

/**
 * Standard MOSH route wrapper: authenticate → rate limit → run.
 *
 * Authorisation is implicit and total: the handler only ever receives the
 * signed-in user's context, and every service query is scoped to
 * `ctx.userId`, so an endpoint cannot accidentally read another person's
 * journal.
 */
export function route<T = Record<string, string>>(
  options: { limit?: Limit } = {},
  fn: (ctx: MoshContext, request: Request, params: T) => Promise<unknown>
) {
  return handler(async (request: Request, context?: { params: Promise<T> }) => {
    const ctx = await requireMoshContext();
    const limit = options.limit ?? (request.method === "GET" ? "read" : "write");
    consumeRateLimit(`mosh:${limit}:${ctx.userId}`, RATE_LIMITS[limit]);

    const params = context?.params ? await context.params : ({} as T);
    const result = await fn(ctx, request, params);

    if (result instanceof Response) return result;
    return NextResponse.json(result ?? { ok: true });
  }) as (request: Request, context?: { params: Promise<T> }) => Promise<Response>;
}

/** Parse and validate a JSON body. Rejects anything that is not an object. */
export async function readJson<S extends z.ZodTypeAny>(
  request: Request,
  schema: S
): Promise<z.infer<S>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new AppError("The request body must be valid JSON.", { code: "invalid_json" });
  }
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    throw new AppError("The request body must be a JSON object.", { code: "invalid_json" });
  }
  return schema.parse(body);
}

/** Parse and validate query-string parameters. */
export function readQuery<S extends z.ZodTypeAny>(request: Request, schema: S): z.infer<S> {
  const url = new URL(request.url);
  const raw: Record<string, string> = {};
  for (const [key, value] of url.searchParams.entries()) raw[key] = value;
  return schema.parse(raw);
}
