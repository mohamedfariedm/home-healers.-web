import type { Location } from "@/types/booking";
import type { OfferPopupDiscountType } from "@/types/offer-popup";
import {
  addOneHour,
  combineDateAndTime,
  formatLocalDateTime,
  timePeriodFromStart,
} from "@/lib/offer-booking";

export const PENDING_CLAIM_KEY = "hh_pending_offer_claim";
/** Claims older than this are treated as expired. */
export const PENDING_CLAIM_TTL_MS = 2 * 60 * 60 * 1000;

export type PendingOfferClaim = {
  popupId: string;
  couponCode: string;
  couponId: string | null;
  name: string;
  mobile: string;
  locale: string;
  createdAt: number;
  discountType?: OfferPopupDiscountType;
  discountValue?: number | null;
  offerTitle?: string;
};

export function savePendingClaim(claim: PendingOfferClaim) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PENDING_CLAIM_KEY, JSON.stringify(claim));
  } catch {
    // ignore storage errors
  }
}

export function readPendingClaim(): PendingOfferClaim | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_CLAIM_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingOfferClaim;
    if (!parsed?.couponCode || !parsed.createdAt) return null;
    if (Date.now() - parsed.createdAt > PENDING_CLAIM_TTL_MS) {
      clearPendingClaim();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingClaim() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(PENDING_CLAIM_KEY);
  } catch {
    // ignore
  }
}

export function claimCheckoutStorageKey() {
  return "hh_claim_offer_checkout";
}

export type ClaimCheckoutState = {
  reservationId: number;
  phase: "payment" | "done";
  couponCode?: string;
  couponId?: string;
};

/** Soft-match a coupon row from ClientAPI.getCoupons list. */
export function matchCouponInList(
  list: unknown[],
  opts: { code?: string; couponId?: string | null },
): { id: string; code: string } | null {
  const code = (opts.code || "").trim().toLowerCase();
  const couponId = opts.couponId != null ? String(opts.couponId) : "";

  for (const item of list) {
    const row = item as {
      id?: string | number;
      code?: string;
      coupon_code?: string;
      name?: string;
    };
    if (!row?.id) continue;
    if (couponId && String(row.id) === couponId) {
      return {
        id: String(row.id),
        code: String(row.code ?? row.coupon_code ?? row.name ?? opts.code ?? ""),
      };
    }
    const candidate = String(
      row.code ?? row.coupon_code ?? row.name ?? "",
    )
      .trim()
      .toLowerCase();
    if (code && candidate === code) {
      return {
        id: String(row.id),
        code: String(row.code ?? row.coupon_code ?? row.name ?? opts.code ?? ""),
      };
    }
  }
  return null;
}

export function buildClaimReservationPayload(input: {
  categoryId: number;
  doctorId: number;
  sessionPrice: number;
  notes: string;
  dateKey: string;
  time: string;
  address: Location;
  guest: {
    name: string;
    phone: string;
    email?: string;
    nationality: string;
    nationalityId?: number;
    gender: "male" | "female";
    birthDate: string;
  };
}) {
  const start = combineDateAndTime(input.dateKey, input.time);
  if (!start) throw new Error("Invalid appointment");
  const end = addOneHour(start);
  const notes = input.notes.trim();
  const nationalityId = input.guest.nationalityId;
  const price = Number(input.sessionPrice) || 0;

  return {
    type: "reservation",
    service_id: null,
    category_id: input.categoryId,
    doctor_id: input.doctorId,
    sessions_count: 1,
    sub_total: price,
    total_amount: price,
    transaction_reference: `txn_${Date.now()}`,
    pain_location: "",
    notes,
    dates: [
      {
        start_time: formatLocalDateTime(start),
        end_time: formatLocalDateTime(end),
        time_period: timePeriodFromStart(start),
        ...(notes ? { notes } : {}),
      },
    ],
    attachments: [] as string[],
    ...(nationalityId != null ? { nationality_id: nationalityId } : {}),
    is_guest: true,
    guest_info: {
      name: input.guest.name.trim(),
      email: input.guest.email?.trim() || "",
      mobile: input.guest.phone.trim(),
      address: input.address.address || "N/A",
      city: input.address.city || "N/A",
      country: input.address.country || "N/A",
      nationality: input.guest.nationality,
      ...(nationalityId != null
        ? {
            nationality_id: nationalityId,
            guest_nationality_id: nationalityId,
          }
        : {}),
      date_of_birth: String(input.guest.birthDate || "").trim(),
      gender: input.guest.gender,
      national_id: "",
      blood_group: "",
      languages_spoken: "ar",
    },
    address_city: input.address.city || "N/A",
    address_country: input.address.country || "N/A",
    address_state: input.address.state || "N/A",
    address_link: input.address.link || "N/A",
  };
}
