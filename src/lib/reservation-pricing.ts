import type { BookingData } from "@/types/booking";

type ReservationPricingFields = {
  sub_total?: number | string;
  fees?: number | string;
  total_amount?: number | string;
  nationality_fee?: number | string;
  coupon_discount?: number | string;
};

/** Apply authoritative sub_total and total_amount from a reservation API record. */
export function applyReservationPricingFromApi(
  prev: BookingData,
  reservation: ReservationPricingFields
): BookingData {
  const subTotal = Number(reservation.sub_total);
  const total = Number(reservation.total_amount);
  const nationalityFee = Number(reservation.nationality_fee);
  const couponDiscount = Number(reservation.coupon_discount);
  const providerFees = Number(reservation.fees);

  if (!Number.isFinite(subTotal) || !Number.isFinite(total)) {
    return prev;
  }

  return {
    ...prev,
    pricing: {
      ...prev.pricing,
      subTotal,
      fees: Number.isFinite(providerFees) ? providerFees : prev.pricing.fees,
      tax: Number.isFinite(nationalityFee) ? nationalityFee : prev.pricing.tax,
      couponDiscount: Number.isFinite(couponDiscount)
        ? couponDiscount
        : prev.pricing.couponDiscount,
      total,
    },
  };
}
