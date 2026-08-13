import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Application errors carry a machine code, an HTTP status and a message that is
 * safe to show a user. Anything that is *not* an AppError is treated as an
 * internal fault: it is logged server-side and replaced with a generic message,
 * so stack traces and driver errors never reach the client.
 */
export class AppError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(message: string, options: { status?: number; code?: string; details?: unknown } = {}) {
    super(message);
    this.name = "AppError";
    this.status = options.status ?? 400;
    this.code = options.code ?? "bad_request";
    this.details = options.details;
  }
}

export const unauthorized = (message = "You need to sign in to do that.") =>
  new AppError(message, { status: 401, code: "unauthorized" });

export const forbidden = (message = "You do not have permission to do that.") =>
  new AppError(message, { status: 403, code: "forbidden" });

export const notFound = (message = "That record could not be found.") =>
  new AppError(message, { status: 404, code: "not_found" });

export const conflict = (message: string) => new AppError(message, { status: 409, code: "conflict" });

export const rateLimited = (message = "Too many requests. Try again shortly.") =>
  new AppError(message, { status: 429, code: "rate_limited" });

export const serviceUnavailable = (message: string) =>
  new AppError(message, { status: 503, code: "service_unavailable" });

export type ErrorBody = {
  error: { code: string; message: string; details?: unknown };
};

/** Convert any thrown value into a safe JSON response. */
export function toErrorResponse(error: unknown): NextResponse<ErrorBody> {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: "validation_failed",
          message: "Some of the information you sent is not valid.",
          details: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
      },
      { status: 422 }
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      { error: { code: error.code, message: error.message, details: error.details } },
      { status: error.status }
    );
  }

  console.error("[m-cos] unhandled error", error);
  return NextResponse.json(
    {
      error: {
        code: "internal_error",
        message: "Something went wrong on our side. The issue has been logged.",
      },
    },
    { status: 500 }
  );
}

/** Wrap a route handler so it can throw freely and still respond safely. */
export function handler<Args extends unknown[]>(
  fn: (...args: Args) => Promise<NextResponse | Response>
): (...args: Args) => Promise<NextResponse | Response> {
  return async (...args: Args) => {
    try {
      return await fn(...args);
    } catch (error) {
      return toErrorResponse(error);
    }
  };
}
