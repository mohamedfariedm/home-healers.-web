import ClientAPI from "@/app/api/api";
import {
  getPersistedPendingPayment,
  persistPendingPayment,
  persistReservationId,
} from "@/lib/checkout-storage";
import {
  extractTamaraPayResult,
  parseReservationRecord,
} from "@/lib/payment-api";
import {
  isTamaraPaymentInProgressError,
  isTamaraRejectedError,
  isTamaraUnavailableError,
} from "./parse";
import { verifyTamaraOutcome } from "./outcome";

export class TamaraAlreadyPaidError extends Error {
  constructor(message = "Reservation is already paid") {
    super(message);
    this.name = "TamaraAlreadyPaidError";
  }
}

export class TamaraPayInProgressError extends Error {
  constructor(message = "Tamara payment already in progress") {
    super(message);
    this.name = "TamaraPayInProgressError";
  }
}

export type StartTamaraPayOptions = {
  reservationId: number;
  locale: string;
  customerEmail?: string;
};

/**
 * Starts (or reuses) a Tamara web checkout session and redirects.
 * Backend reuses the same session within ~30 minutes for the same amount.
 * Never marks the reservation paid — only creates/reuses checkout_url.
 */
export async function startTamaraCheckoutRedirect(
  options: StartTamaraPayOptions
): Promise<void> {
  const { reservationId, locale, customerEmail } = options;
  persistReservationId(reservationId);

  const existingPending = getPersistedPendingPayment();
  const attemptId =
    existingPending?.provider === "tamara"
      ? existingPending.attemptId
      : undefined;

  // Recover interrupted sessions: if already paid, do not start another pay.
  try {
    const precheck = await verifyTamaraOutcome(
      reservationId,
      locale,
      attemptId
    );
    if (precheck.outcome === "paid") {
      throw new TamaraAlreadyPaidError();
    }
  } catch (error) {
    if (error instanceof TamaraAlreadyPaidError) throw error;
    // 404 / no attempt yet is normal before the first pay.
  }

  try {
    const reservationResponse = await ClientAPI.getReservation(
      reservationId,
      locale
    );
    const reservation = parseReservationRecord(reservationResponse);
    if (reservation?.payment_status === "paid") {
      throw new TamaraAlreadyPaidError();
    }
  } catch (error) {
    if (error instanceof TamaraAlreadyPaidError) throw error;
  }

  try {
    const response = await ClientAPI.payReservationWithTamara(
      reservationId,
      locale,
      { customerEmail }
    );
    const result = extractTamaraPayResult(response);
    persistPendingPayment({
      reservationId,
      provider: "tamara",
      attemptId: result.attempt_id,
      orderId: result.tamara_order_id,
      expiresAt: result.expires_at,
    });
    if (typeof window !== "undefined") {
      window.location.assign(result.checkout_url);
    }
  } catch (error: unknown) {
    if (isTamaraPaymentInProgressError(error)) {
      const verified = await verifyTamaraOutcome(
        reservationId,
        locale,
        attemptId
      );
      if (verified.outcome === "paid") {
        throw new TamaraAlreadyPaidError();
      }
      // Different live session — do not create a duplicate; surface in-progress.
      throw new TamaraPayInProgressError();
    }
    if (isTamaraRejectedError(error) || isTamaraUnavailableError(error)) {
      throw error;
    }
    throw error;
  }
}

export function mapTamaraStartError(
  error: unknown,
  messages: {
    alreadyPaid: string;
    inProgress: string;
    rejected: string;
    unavailable: string;
    fallback: string;
  }
): string {
  if (error instanceof TamaraAlreadyPaidError) return messages.alreadyPaid;
  if (error instanceof TamaraPayInProgressError) return messages.inProgress;
  if (isTamaraRejectedError(error)) return messages.rejected;
  if (isTamaraUnavailableError(error)) return messages.unavailable;
  if (error instanceof Error && error.message) return error.message;
  return messages.fallback;
}
