export const BOOKING_TOUR_STORAGE_KEY = "home_healers_booking_tour_v1_completed";

export function isBookingTourCompleted(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(BOOKING_TOUR_STORAGE_KEY) === "true";
  } catch {
    return true;
  }
}

export function markBookingTourCompleted(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BOOKING_TOUR_STORAGE_KEY, "true");
  } catch {
    /* ignore */
  }
}

export function resetBookingTour(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(BOOKING_TOUR_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
