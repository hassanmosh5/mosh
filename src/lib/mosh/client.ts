"use client";

/**
 * The browser-side API client.
 *
 * One place that knows how the server reports errors, so every form in the app
 * can show the same clear message instead of "Failed to fetch".
 */

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;

  constructor(message: string, options: { code: string; status: number; details?: unknown }) {
    super(message);
    this.name = "ApiError";
    this.code = options.code;
    this.status = options.status;
    this.details = options.details;
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    const error = (payload as { error?: { code?: string; message?: string; details?: unknown } })
      ?.error;
    throw new ApiError(error?.message ?? "Something went wrong. Please try again.", {
      code: error?.code ?? "unknown",
      status: response.status,
      details: error?.details,
    });
  }

  return payload as T;
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};

/** Trigger a browser download for one of the export endpoints. */
export function downloadExport(url: string): void {
  window.location.href = url;
}
