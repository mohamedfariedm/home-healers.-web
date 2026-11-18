import ClientAPI from "@/app/api/api";
import {
  getPersistedPendingPayment,
  getPersistedReservationId,
  type PendingPaymentState,
} from "@/lib/checkout-storage";
import {
  extractTamaraVerifyResult,
  parseReservationRecord,
} from "@/lib/payment-api";
import {
  isTamaraPaidStatus,
  isTamaraPendingStatus,
  isTamaraTerminalFailure,
  isTamaraUnavailableError,
} from "./parse";
import type { TamaraVerifyData } from "./types";

export type TamaraUiOutcome =
  | "paid"
  | "pending"
  | "failed"
  | "cancelled"
  | "expired"
  | "unavailable"
  | "unknown";

export type TamaraCheckoutContext = {
  reservationId: number | null;
  pending: PendingPaymentState | null;
  isTamara: boolean;
};

export type TamaraVerifyOutcome = {
  outcome: TamaraUiOutcome;
  verify: TamaraVerifyData | null;
  reservationPaid: boolean;
};

export function resolveTamaraCheckoutContext(): TamaraCheckoutContext {
  const pending = getPersistedPendingPayment();
  const reservationId =
    pending?.reservationId ?? getPersistedReservationId();
  return {
    reservationId,
    pending,
    isTamara: pending?.provider === "tamara",
  };
}

export function classifyTamaraStatus(
  status: string,
  finalFlag?: boolean
): TamaraUiOutcome {
  if (isTamaraPaidStatus(status, finalFlag)) return "paid";
  if (isTamaraPendingStatus(status)) return "pending";
  const s = status.toLowerCase();
  if (s === "cancelled" || s === "canceled") return "cancelled";
  if (s === "expired") return "expired";
  if (s === "failed") return "failed";
  if (isTamaraTerminalFailure(status)) return "failed";
  return "unknown";
}

async function readReservationPaid(
  reservationId: number,
  locale: string
): Promise<boolean> {
  try {
    const response = await ClientAPI.getReservation(reservationId, locale);
    const reservation = parseReservationRecord(response);
    return reservation?.payment_status === "paid";
  } catch {
    return false;
  }
}

/**
 * Source-of-truth check for Tamara return pages.
 * Never treat redirect path alone as paid / failed / canceled.
 */
export async function verifyTamaraOutcome(
  reservationId: number,
  locale: string,
  attemptId?: number | null
): Promise<TamaraVerifyOutcome> {
  try {
    const response = await ClientAPI.verifyTamaraPayment(
      {
        reservation_id: reservationId,
        ...(attemptId != null ? { attempt_id: attemptId } : {}),
      },
      locale
    );
    const verify = extractTamaraVerifyResult(response);
    const outcome = classifyTamaraStatus(
      verify.payment_status,
      verify.final
    );

    if (outcome === "paid") {
      return { outcome: "paid", verify, reservationPaid: true };
    }

    const reservationPaid = await readReservationPaid(reservationId, locale);
    if (reservationPaid) {
      return { outcome: "paid", verify, reservationPaid: true };
    }

    return { outcome, verify, reservationPaid: false };
  } catch (error) {
    if (isTamaraUnavailableError(error)) {
      const reservationPaid = await readReservationPaid(reservationId, locale);
      if (reservationPaid) {
        return { outcome: "paid", verify: null, reservationPaid: true };
      }
      return { outcome: "unavailable", verify: null, reservationPaid: false };
    }

    const reservationPaid = await readReservationPaid(reservationId, locale);
    if (reservationPaid) {
      return { outcome: "paid", verify: null, reservationPaid: true };
    }

    throw error;
  }
}

export async function pollTamaraOutcome(options: {
  reservationId: number;
  locale: string;
  attemptId?: number | null;
  attempts?: number;
  intervalMs?: number;
  /** Stop early when status is a terminal non-paid outcome. */
  stopOnTerminal?: boolean;
}): Promise<TamaraVerifyOutcome> {
  const attempts = options.attempts ?? 12;
  const intervalMs = options.intervalMs ?? 2500;
  const stopOnTerminal = options.stopOnTerminal ?? true;

  let last: TamaraVerifyOutcome = {
    outcome: "unknown",
    verify: null,
    reservationPaid: false,
  };

  for (let i = 0; i < attempts; i++) {
    try {
      last = await verifyTamaraOutcome(
        options.reservationId,
        options.locale,
        options.attemptId
      );

      if (last.outcome === "paid") return last;

      const isOpen =
        last.outcome === "pending" ||
        last.outcome === "unavailable" ||
        last.outcome === "unknown";

      if (!isOpen && stopOnTerminal) return last;
    } catch (error) {
      if (i === attempts - 1) throw error;
    }

    if (i < attempts - 1) {
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }

  return last;
}

export function tamaraResultPath(
  locale: string,
  kind: "success" | "failed" | "canceled",
  orderRef?: string | null
): string {
  const ref = encodeURIComponent(orderRef?.trim() || "unknown");
  return `/${locale}/${kind}/${ref}`;
}
