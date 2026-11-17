const RESERVATION_ID_KEY = "reservationId";
const TELR_ATTEMPT_ID_KEY = "telrAttemptId";

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

export function clearCheckoutStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(RESERVATION_ID_KEY);
  localStorage.removeItem("bookingData");
  localStorage.removeItem(TELR_ATTEMPT_ID_KEY);
}
