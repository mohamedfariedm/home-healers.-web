import type { BookingData } from "@/types/booking";

export type PaymentSummaryMethod = {
  type: string;
  discount: number;
  fees: number;
  total: number;
  available?: boolean;
  insufficient_balance?: boolean;
};

export type PaymentSummaryData = {
  reservation: {
    id: number;
    sub_total: number;
    coupon_discount: number;
    nationality_fee: number;
    coupon?: {
      id: string;
      name: string;
      code: string;
      type: string;
      value: number;
    } | null;
    coupon_code?: string | null;
  };
  methods: PaymentSummaryMethod[];
};

export function resolvePaymentSummaryMethodType(
  paymentMethod: string
): string {
  if (paymentMethod === "cash") return "cash";
  if (paymentMethod === "telr") return "telr";
  if (paymentMethod === "wallet" || paymentMethod === "apple_pay") return "wallet";
  return paymentMethod;
}

export function getPaymentMethodAvailability(
  methods: PaymentSummaryMethod[] | undefined,
  paymentMethod: string
): { available: boolean; insufficientBalance: boolean } {
  if (!methods?.length) {
    return { available: true, insufficientBalance: false };
  }

  const type = resolvePaymentSummaryMethodType(paymentMethod);
  const entry = methods.find((m) => m.type === type);
  if (!entry) {
    return { available: false, insufficientBalance: false };
  }

  return {
    available: entry.available !== false,
    insufficientBalance: entry.insufficient_balance === true,
  };
}

export function pickPaymentSummaryMethod(
  methods: PaymentSummaryMethod[],
  paymentMethod: string
): PaymentSummaryMethod | undefined {
  const preferred = resolvePaymentSummaryMethodType(paymentMethod);
  return (
    methods.find((m) => m.type === preferred) ??
    methods.find((m) => m.type === "cash") ??
    methods[0]
  );
}

function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/** Map payment summary API data onto booking state (authoritative totals). */
export function applyPaymentSummaryToBooking(
  prev: BookingData,
  summary: PaymentSummaryData,
  paymentMethod: string = prev.paymentMethod
): BookingData {
  const { reservation, methods } = summary;
  const selectedMethod = pickPaymentSummaryMethod(methods, paymentMethod);

  const coupon = reservation.coupon;
  const couponDiscount = toNumber(reservation.coupon_discount);
  const hasCouponDiscount = couponDiscount > 0;
  const couponCode =
    reservation.coupon_code ?? coupon?.code ?? prev.couponCode ?? "";

  return {
    ...prev,
    couponCode:
      coupon || hasCouponDiscount ? couponCode || prev.couponCode : "",
    couponId: coupon?.id ?? (hasCouponDiscount ? prev.couponId : undefined),
    couponType: coupon
      ? String(coupon.type).includes("percent")
        ? "percentage"
        : "fixed"
      : hasCouponDiscount
        ? prev.couponType
        : undefined,
    couponValue: coupon
      ? toNumber(coupon.value)
      : hasCouponDiscount
        ? prev.couponValue
        : undefined,
    paymentSummaryMethods: methods.map((m) => ({
      type: m.type,
      discount: toNumber(m.discount),
      fees: toNumber(m.fees),
      total: toNumber(m.total),
      available: m.available,
      insufficient_balance: m.insufficient_balance,
    })),
    pricing: {
      ...prev.pricing,
      subTotal: toNumber(reservation.sub_total),
      tax: toNumber(reservation.nationality_fee),
      couponDiscount: toNumber(reservation.coupon_discount),
      discount: toNumber(selectedMethod?.discount),
      fees: toNumber(selectedMethod?.fees),
      total: toNumber(selectedMethod?.total),
    },
  };
}

/** Refresh payable total when the user switches payment method. */
export function applyPaymentMethodToPricing(
  prev: BookingData,
  paymentMethod: string
): BookingData {
  const methods = prev.paymentSummaryMethods;
  if (!methods?.length) {
    return { ...prev, paymentMethod };
  }

  const selectedMethod = pickPaymentSummaryMethod(methods, paymentMethod);
  if (!selectedMethod) {
    return { ...prev, paymentMethod };
  }

  return {
    ...prev,
    paymentMethod,
    pricing: {
      ...prev.pricing,
      discount: selectedMethod.discount,
      fees: selectedMethod.fees,
      total: selectedMethod.total,
    },
  };
}

export function extractApiMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object" && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}
