const RESERVATION_ID_KEY = "reservationId";
const TELR_ATTEMPT_ID_KEY = "telrAttemptId";
const PENDING_PAYMENT_KEY = "pendingPayment";

export type PendingPaymentProvider = "telr" | "tamara";

/** Telr channel used for recovery / retry (not eligibility). */
export type PendingTelrMethod = "card" | "tabby" | "apple_pay" | "hpp";

export type PendingPaymentState = {
  reservationId: number;
  provider: PendingPaymentProvider;
  attemptId?: number | null;
  /**
   * Telr sub-method for retry recovery after redirect.
   * `tabby` / `apple_pay` → method/pay; `hpp` → hosted pay; `card` → seamless (panel).
   */
  method?: PendingTelrMethod | null;
  /** Tamara order id when known (same as return orderRef). */
  orderId?: string | null;
  /** ISO expiry from Tamara pay response (session reuse window). */
  expiresAt?: string | null;
};

export function persistReservationId(id: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(RESERVATION_ID_KEY, String(id));
}

export function getPersistedReservationId(): number | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(RESERVATION_ID_KEY);
  if (!raw) return null;
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

/** Non-secret payment attempt id from Seamless pay (safe to keep until final). */
export function persistTelrAttemptId(attemptId: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TELR_ATTEMPT_ID_KEY, String(attemptId));
}

export function getPersistedTelrAttemptId(): number | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(TELR_ATTEMPT_ID_KEY);
  if (!raw) return null;
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

export function clearTelrAttemptId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TELR_ATTEMPT_ID_KEY);
}

export function persistPendingPayment(state: PendingPaymentState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PENDING_PAYMENT_KEY, JSON.stringify(state));
  persistReservationId(state.reservationId);
}

export function getPersistedPendingPayment(): PendingPaymentState | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PENDING_PAYMENT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") return null;

    const reservationRaw = parsed.reservationId;
    const reservationId =
      typeof reservationRaw === "number"
        ? reservationRaw
        : typeof reservationRaw === "string"
          ? Number(reservationRaw)
          : NaN;
    if (!Number.isFinite(reservationId)) return null;

    const provider = parsed.provider;
    if (provider !== "telr" && provider !== "tamara") return null;

    const attemptRaw = parsed.attemptId;
    const attemptId =
      typeof attemptRaw === "number"
        ? attemptRaw
        : typeof attemptRaw === "string" && attemptRaw.trim()
          ? Number(attemptRaw)
          : null;

    const methodRaw = parsed.method;
    const method =
      methodRaw === "card" ||
      methodRaw === "tabby" ||
      methodRaw === "apple_pay" ||
      methodRaw === "hpp"
        ? methodRaw
        : null;

    return {
      reservationId,
      provider,
      attemptId:
        attemptId != null && Number.isFinite(attemptId) ? attemptId : null,
      method,
      orderId:
        typeof parsed.orderId === "string" && parsed.orderId.trim()
          ? parsed.orderId.trim()
          : null,
      expiresAt:
        typeof parsed.expiresAt === "string" && parsed.expiresAt.trim()
          ? parsed.expiresAt.trim()
          : null,
    };
  } catch {
    return null;
  }
}

export function clearPendingPayment(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PENDING_PAYMENT_KEY);
}

export function clearCheckoutStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(RESERVATION_ID_KEY);
  localStorage.removeItem("bookingData");
  localStorage.removeItem(TELR_ATTEMPT_ID_KEY);
  localStorage.removeItem(PENDING_PAYMENT_KEY);
}
