import { extractApiMessage } from "@/lib/payment-summary";
import type { TamaraConfig, TamaraPayData, TamaraVerifyData } from "./types";

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

export function parseTamaraConfig(response: unknown): TamaraConfig | null {
  const root = asRecord(response);
  if (!root) return null;
  const data = asRecord(root.data) ?? root;
  const enabled = asBoolean(data.enabled);
  if (enabled === false) {
    return {
      enabled: false,
      currency: asString(data.currency) ?? "SAR",
      country_code: asString(data.country_code) ?? asString(data.countryCode) ?? "SA",
      payment_type: asString(data.payment_type) ?? asString(data.paymentType),
      instalments: asNumber(data.instalments),
      test_mode:
        asBoolean(data.test_mode) ?? asBoolean(data.testMode) ?? true,
    };
  }

  return {
    enabled: enabled ?? true,
    currency: asString(data.currency) ?? "SAR",
    country_code: asString(data.country_code) ?? asString(data.countryCode) ?? "SA",
    payment_type: asString(data.payment_type) ?? asString(data.paymentType),
    instalments: asNumber(data.instalments),
    test_mode: asBoolean(data.test_mode) ?? asBoolean(data.testMode) ?? true,
  };
}

export function parseTamaraPayData(response: unknown): TamaraPayData {
  const root = asRecord(response);
  if (!root) throw new Error("Invalid Tamara pay response");
  const data = asRecord(root.data) ?? root;
  const checkoutUrl =
    asString(data.checkout_url) ??
    asString(data.checkoutUrl) ??
    asString(data.redirect_url);

  if (!checkoutUrl) {
    throw new Error(
      extractApiMessage(response, "Tamara checkout URL missing")
    );
  }

  return {
    attempt_id: asNumber(data.attempt_id) ?? asNumber(data.attemptId),
    payment_provider: asString(data.payment_provider) ?? asString(data.paymentProvider),
    checkout_url: checkoutUrl,
    tamara_order_id:
      asString(data.tamara_order_id) ?? asString(data.tamaraOrderId),
    amount: asNumber(data.amount),
    currency: asString(data.currency),
    expires_at: asString(data.expires_at) ?? asString(data.expiresAt),
    payment_status: asString(data.payment_status),
    error: asString(data.error),
    message: asString(data.message) ?? asString(root.message),
  };
}

export function tryParseTamaraPayData(response: unknown): TamaraPayData | null {
  try {
    return parseTamaraPayData(response);
  } catch {
    return null;
  }
}

export function parseTamaraVerifyData(response: unknown): TamaraVerifyData {
  const root = asRecord(response);
  if (!root) throw new Error("Invalid Tamara verify response");
  const data = asRecord(root.data) ?? root;
  const paymentStatus = asString(data.payment_status) ?? "created";

  return {
    attempt_id: asNumber(data.attempt_id) ?? asNumber(data.attemptId),
    payment_provider: asString(data.payment_provider) ?? asString(data.paymentProvider),
    payment_status: paymentStatus,
    final: asBoolean(data.final),
    reservation_id:
      asString(data.reservation_id) ??
      asNumber(data.reservation_id) ??
      asString(data.reservationId) ??
      asNumber(data.reservationId),
    needs_review: asBoolean(data.needs_review) ?? asBoolean(data.needsReview),
    message: asString(data.message) ?? asString(root.message),
    error: asString(data.error),
  };
}

export function isTamaraPaidStatus(status: string, finalFlag?: boolean): boolean {
  return status.toLowerCase() === "paid" && finalFlag !== false;
}

export function isTamaraPendingStatus(status: string): boolean {
  const s = status.toLowerCase();
  return s === "created" || s === "approved" || s === "processing";
}

export function isTamaraTerminalFailure(status: string): boolean {
  const s = status.toLowerCase();
  return s === "failed" || s === "cancelled" || s === "canceled" || s === "expired";
}

export function isTamaraPaymentInProgressError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as { status?: number; body?: unknown };
  if (err.status === 409) return true;
  const body = asRecord(err.body);
  const data = body ? asRecord(body.data) : null;
  return (
    asString(data?.error) === "payment_in_progress" ||
    asString(body?.error) === "payment_in_progress"
  );
}

export function isTamaraRejectedError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as { status?: number; body?: unknown };
  if (err.status !== 422) return false;
  const body = asRecord(err.body);
  const data = body ? asRecord(body.data) : null;
  return asString(data?.error) === "tamara_rejected";
}

export function isTamaraUnavailableError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as { status?: number; body?: unknown };
  if (err.status !== 503) return false;
  const body = asRecord(err.body);
  const data = body ? asRecord(body.data) : null;
  return (
    asString(data?.error) === "tamara_unavailable" ||
    asString(data?.error) === "payment_status_unavailable"
  );
}
