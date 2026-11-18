import ClientAPI from "@/app/api/api";
import { isClientApiError } from "@/lib/client-api-error";
import {
  extractTelrMethodPayResult,
  extractTelrSeamlessVerifyResult,
  parseReservationRecord,
} from "@/lib/payment-api";
import {
  persistPendingPayment,
  persistReservationId,
  persistTelrAttemptId,
  type PendingPaymentState,
} from "@/lib/checkout-storage";
import { isPaidStatus, isPaymentInProgressError } from "./parse";

export type TelrReturnOutcome =
  | "paid"
  | "pending"
  | "unpaid"
  | "unavailable";

/**
 * Authoritative Telr (Card or Tabby) status for return pages.
 * Prefer Seamless verify (backend resolves Tabby attempts too),
 * fall back to reservation payment_status.
 */
export async function verifyTelrReturnOutcome(
  reservationId: number,
  locale: string,
  attemptId?: number | null
): Promise<TelrReturnOutcome> {
  try {
    const payload =
      attemptId != null
        ? { attempt_id: attemptId, reservation_id: reservationId }
        : { reservation_id: reservationId };
    const response = await ClientAPI.verifyTelrSeamlessPayment(payload, locale);
    const verified = extractTelrSeamlessVerifyResult(response);
    const status = String(verified.payment_status || "").toLowerCase();

    if (isPaidStatus(status, verified.final)) return "paid";

    // Actively processing / 3DS — keep polling.
    if (status === "processing" || status === "challenge_required") {
      return "pending";
    }

    // Hosted session created but never authorized (common after cancel,
    // abandoned Tabby, or invalid Telr page). Allow unpaid/retry UX.
    if (status === "created") {
      return "unpaid";
    }

    if (verified.final === false) {
      return "pending";
    }

    if (
      status === "failed" ||
      status === "declined" ||
      status === "cancelled" ||
      status === "canceled" ||
      status === "expired_unused" ||
      status === "abandoned"
    ) {
      return "unpaid";
    }
  } catch (error) {
    if (isClientApiError(error) && error.status === 503) {
      // Fall through to reservation check; may still be confirming.
    } else if (isClientApiError(error) && error.status === 404) {
      // No attempt yet — check reservation only.
    } else {
      // Keep going to reservation soft-check.
    }
  }

  try {
    const response = await ClientAPI.getReservation(reservationId, locale);
    const reservation = parseReservationRecord(response);
    if (reservation?.payment_status === "paid") return "paid";
    return "unpaid";
  } catch {
    return "unavailable";
  }
}

export async function pollTelrReturnOutcome(options: {
  reservationId: number;
  locale: string;
  attemptId?: number | null;
  attempts?: number;
  intervalMs?: number;
}): Promise<TelrReturnOutcome> {
  const attempts = options.attempts ?? 12;
  const intervalMs = options.intervalMs ?? 2500;
  let last: TelrReturnOutcome = "pending";

  for (let i = 0; i < attempts; i++) {
    last = await verifyTelrReturnOutcome(
      options.reservationId,
      options.locale,
      options.attemptId
    );
    if (last === "paid" || last === "unpaid") return last;
    if (i < attempts - 1) {
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }

  return last === "unavailable" ? "unavailable" : "pending";
}

export async function isReservationAlreadyPaid(
  reservationId: number,
  locale: string
): Promise<boolean> {
  try {
    const response = await ClientAPI.getReservation(reservationId, locale);
    return parseReservationRecord(response)?.payment_status === "paid";
  } catch {
    return false;
  }
}

/**
 * Start or reuse a Tabby hosted session and return the redirect URL.
 * Does not invent URLs. Throws ClientApiError / Error for UI handling.
 */
export async function startTabbyHostedRedirect(options: {
  reservationId: number;
  locale: string;
  previous?: PendingPaymentState | null;
}): Promise<{ redirectUrl: string; reused: boolean }> {
  const { reservationId, locale, previous } = options;

  if (await isReservationAlreadyPaid(reservationId, locale)) {
    const err = new Error("ALREADY_PAID");
    err.name = "TelrAlreadyPaidError";
    throw err;
  }

  try {
    const response = await ClientAPI.payReservationWithTelrMethod(
      reservationId,
      "tabby",
      locale
    );
    const result = extractTelrMethodPayResult(response);

    // Backend may reuse a session past Telr expiry; never send the customer
    // to an already-invalid hosted URL.
    if (isTelrHostedSessionExpired(result.expires_at)) {
      const err = new Error("SESSION_EXPIRED");
      err.name = "TelrSessionExpiredError";
      throw err;
    }

    if (!result.redirect_url.startsWith("https://")) {
      throw new Error("Invalid payment redirect URL");
    }

    const attemptId = result.attempt_id ?? previous?.attemptId ?? null;
    persistReservationId(reservationId);
    if (attemptId != null) {
      persistTelrAttemptId(attemptId);
    }
    persistPendingPayment({
      reservationId,
      provider: "telr",
      attemptId,
      method: "tabby",
      orderId: result.payment_id ?? previous?.orderId,
      expiresAt: result.expires_at ?? previous?.expiresAt,
    });
    return {
      redirectUrl: result.redirect_url,
      reused: Boolean(result.reused),
    };
  } catch (error) {
    if (isPaymentInProgressError(error)) {
      throw error;
    }
    if (isClientApiError(error) && error.status === 422) {
      if (await isReservationAlreadyPaid(reservationId, locale)) {
        const err = new Error("ALREADY_PAID");
        err.name = "TelrAlreadyPaidError";
        throw err;
      }
    }
    throw error;
  }
}

export function isTelrAlreadyPaidError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === "TelrAlreadyPaidError" || error.message === "ALREADY_PAID")
  );
}

/** True when method/pay `expires_at` is present and already in the past. */
export function isTelrHostedSessionExpired(
  expiresAt?: string | null
): boolean {
  if (!expiresAt) return false;
  const ms = Date.parse(expiresAt);
  if (!Number.isFinite(ms)) return false;
  return ms <= Date.now();
}

export function isTelrSessionExpiredError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === "TelrSessionExpiredError" ||
      error.message === "SESSION_EXPIRED")
  );
}
