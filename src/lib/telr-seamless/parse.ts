import { extractApiMessage } from "@/lib/payment-summary";
import type {
  TelrSeamlessConfig,
  TelrSeamlessPayData,
  TelrSeamlessPaymentStatus,
  TelrSeamlessVerifyData,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return null;
}

function asBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  return undefined;
}

function parseTestMode(data: Record<string, unknown>): boolean {
  return (
    asBoolean(data.test_mode) ??
    asBoolean(data.testMode) ??
    (asNumber(data.test_mode) === 1
      ? true
      : asNumber(data.test_mode) === 0
        ? false
        : true)
  );
}

/**
 * Parses config responses, including disabled payloads with null store_id.
 */
export function parseTelrSeamlessConfig(response: unknown): TelrSeamlessConfig | null {
  const root = asRecord(response);
  if (!root) return null;

  const data = asRecord(root.data) ?? root;
  const enabled = asBoolean(data.enabled);
  const storeId =
    asString(data.store_id) ??
    asString(data.storeId) ??
    (asNumber(data.store_id) != null ? String(data.store_id) : null);

  if (enabled === false) {
    return {
      enabled: false,
      store_id: storeId ?? "",
      currency: asString(data.currency) ?? "SAR",
      test_mode: parseTestMode(data),
      sdk_url: asString(data.sdk_url) ?? asString(data.sdkUrl),
    };
  }

  if (!storeId) return null;

  return {
    enabled: enabled ?? true,
    store_id: storeId,
    currency: asString(data.currency) ?? "SAR",
    test_mode: parseTestMode(data),
    sdk_url: asString(data.sdk_url) ?? asString(data.sdkUrl),
  };
}

function parsePayLikeData(
  root: Record<string, unknown>,
  data: Record<string, unknown>
): TelrSeamlessPayData {
  const challengeUrl =
    asString(data.challenge_url) ??
    asString(data.redirect_link) ??
    asString(data.redirect_url) ??
    asString(data.order_url);

  const paymentStatus =
    asString(data.payment_status) ??
    (challengeUrl ? "challenge_required" : "processing");

  return {
    payment_id: asString(data.payment_id) ?? asString(data.paymentId),
    attempt_id: asNumber(data.attempt_id) ?? asNumber(data.attemptId),
    payment_status: paymentStatus as TelrSeamlessPaymentStatus | string,
    challenge_url: challengeUrl,
    amount: asNumber(data.amount),
    currency: asString(data.currency),
    final: asBoolean(data.final),
    retry_allowed: asBoolean(data.retry_allowed) ?? asBoolean(data.retryAllowed),
    message: asString(data.message) ?? asString(root.message),
    error: asString(data.error),
  };
}

export function parseTelrSeamlessPayData(response: unknown): TelrSeamlessPayData {
  const root = asRecord(response);
  if (!root) {
    throw new Error("Invalid seamless payment response");
  }

  const data = asRecord(root.data) ?? root;
  return parsePayLikeData(root, data);
}

/** Safe parse for error bodies (e.g. 409 payment_in_progress). */
export function tryParseTelrSeamlessPayData(
  response: unknown
): TelrSeamlessPayData | null {
  try {
    return parseTelrSeamlessPayData(response);
  } catch {
    return null;
  }
}

export function parseTelrSeamlessVerifyData(
  response: unknown
): TelrSeamlessVerifyData {
  const root = asRecord(response);
  if (!root) {
    throw new Error("Invalid seamless verify response");
  }

  const data = asRecord(root.data) ?? root;
  const paymentStatus = asString(data.payment_status) ?? "processing";

  return {
    attempt_id: asNumber(data.attempt_id) ?? asNumber(data.attemptId),
    payment_status: paymentStatus as TelrSeamlessPaymentStatus | string,
    final: asBoolean(data.final),
    retry_allowed: asBoolean(data.retry_allowed) ?? asBoolean(data.retryAllowed),
    payable_id:
      asString(data.payable_id) ??
      asNumber(data.payable_id) ??
      asString(data.payableId) ??
      asNumber(data.payableId),
    payment_id: asString(data.payment_id) ?? asString(data.paymentId),
    challenge_url:
      asString(data.challenge_url) ??
      asString(data.redirect_link) ??
      asString(data.redirect_url),
    message: asString(data.message) ?? asString(root.message),
    error: asString(data.error),
  };
}

export function isPaymentInProgressError(error: unknown): boolean {
  const body =
    error && typeof error === "object" && "body" in error
      ? (error as { body?: unknown }).body
      : null;
  const parsed = tryParseTelrSeamlessPayData(body);
  if (parsed?.error === "payment_in_progress") return true;

  const status =
    error && typeof error === "object" && "status" in error
      ? Number((error as { status?: unknown }).status)
      : NaN;
  return status === 409;
}

export function isCustomerEmailRequiredError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as {
    status?: number;
    message?: string;
    errors?: Record<string, string[]>;
    body?: unknown;
  };
  if (err.status !== 422) return false;

  const message = String(err.message || "").toLowerCase();
  if (message.includes("email")) return true;

  if (err.errors?.customer_email?.length) return true;
  if (err.errors?.email?.length) return true;

  const body = asRecord(err.body);
  const data = body ? asRecord(body.data) : null;
  const code = asString(data?.error) ?? asString(body?.error);
  return code === "customer_email_required";
}

export function seamlessPayErrorMessage(
  response: unknown,
  fallback: string
): string {
  return extractApiMessage(response, fallback);
}

export function isTerminalFailureStatus(status: string): boolean {
  const s = status.toLowerCase();
  return (
    s === "failed" ||
    s === "declined" ||
    s === "cancelled" ||
    s === "expired_unused" ||
    s === "abandoned"
  );
}

export function isPaidStatus(status: string, finalFlag?: boolean): boolean {
  return status.toLowerCase() === "paid" && finalFlag !== false;
}
