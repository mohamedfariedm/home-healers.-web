const RESERVATION_ID_KEY = "reservationId";

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

export function clearCheckoutStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(RESERVATION_ID_KEY);
  localStorage.removeItem("bookingData");
}
