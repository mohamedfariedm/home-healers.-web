import type { BookingData } from "@/types/booking";

type ReservationPricingFields = {
  sub_total?: number | string;
  fees?: number | string;
  total_amount?: number | string;
};

/** Apply authoritative sub_total, fees, and total_amount from a reservation API record. */
export function applyReservationPricingFromApi(
  prev: BookingData,
  reservation: ReservationPricingFields
): BookingData {
  const subTotal = Number(reservation.sub_total);
  const fees = Number(reservation.fees);
  const total = Number(reservation.total_amount);

  if (!Number.isFinite(subTotal) || !Number.isFinite(fees) || !Number.isFinite(total)) {
    return prev;
  }

  return {
    ...prev,
    pricing: {
      ...prev.pricing,
      subTotal,
      fees,
      tax: 0,
      total,
    },
  };
}
