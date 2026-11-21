import type { Location } from "@/types/booking";
import type { OfferPopupDiscountType } from "@/types/offer-popup";
import {
  addOneHour,
  combineDateAndTime,
  formatLocalDateTime,
  timePeriodFromStart,
} from "@/lib/offer-booking";

export const PENDING_CLAIM_KEY = "hh_pending_offer_claim";
export const CLAIM_FORM_DRAFT_KEY = "hh_claim_offer_draft";
export const CLAIM_CHECKOUT_KEY = "hh_claim_offer_checkout";
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

export type ClaimFormDraft = {
  updatedAt: number;
  claim: PendingOfferClaim;
  guest: {
    name: string;
    phone: string;
    email: string;
    nationality: string;
    nationalityId?: number;
    gender: "male" | "female";
    birthDate: string;
  };
  selectedCategoryId: number | null;
  selectedDoctorId: number | null;
  selectedAddressId: number | null;
  dateKey: string | null;
  time: string | null;
  notes: string;
};

export type ClaimCheckoutState = {
  reservationId: number;
  phase: "payment" | "done";
  couponCode?: string;
  couponId?: string;
  offerTitle?: string;
  discountType?: OfferPopupDiscountType;
  discountValue?: number | null;
  popupId?: string;
  guestEmail?: string;
  updatedAt: number;
};

function readStorageJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeStorageJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(value);
  try {
    window.localStorage.setItem(key, raw);
  } catch {
    // ignore
  }
  try {
    window.sessionStorage.setItem(key, raw);
  } catch {
    // ignore
  }
}

function removeStorageKey(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function savePendingClaim(claim: PendingOfferClaim) {
  writeStorageJson(PENDING_CLAIM_KEY, claim);
}

export function readPendingClaim(): PendingOfferClaim | null {
  const parsed = readStorageJson<PendingOfferClaim>(PENDING_CLAIM_KEY);
  if (!parsed?.couponCode || !parsed.createdAt) return null;
  if (Date.now() - parsed.createdAt > PENDING_CLAIM_TTL_MS) {
    clearPendingClaim();
    return null;
  }
  return parsed;
}

export function clearPendingClaim() {
  removeStorageKey(PENDING_CLAIM_KEY);
}

export function claimCheckoutStorageKey() {
  return CLAIM_CHECKOUT_KEY;
}

export function claimFormDraftStorageKey() {
  return CLAIM_FORM_DRAFT_KEY;
}

export function saveClaimFormDraft(draft: ClaimFormDraft) {
  writeStorageJson(CLAIM_FORM_DRAFT_KEY, {
    ...draft,
    updatedAt: Date.now(),
  });
}

export function readClaimFormDraft(): ClaimFormDraft | null {
  const draft = readStorageJson<ClaimFormDraft>(CLAIM_FORM_DRAFT_KEY);
  if (!draft?.claim?.couponCode || !draft.updatedAt) return null;
  if (Date.now() - draft.updatedAt > PENDING_CLAIM_TTL_MS) {
    clearClaimFormDraft();
    return null;
  }
  return draft;
}

export function clearClaimFormDraft() {
  removeStorageKey(CLAIM_FORM_DRAFT_KEY);
}

export function saveClaimCheckout(state: ClaimCheckoutState) {
  writeStorageJson(CLAIM_CHECKOUT_KEY, {
    ...state,
    updatedAt: Date.now(),
  });
}

export function readClaimCheckout(): ClaimCheckoutState | null {
  const checkout = readStorageJson<ClaimCheckoutState>(CLAIM_CHECKOUT_KEY);
  if (!checkout?.reservationId || !checkout.phase) return null;
  if (
    checkout.updatedAt &&
    Date.now() - checkout.updatedAt > PENDING_CLAIM_TTL_MS
  ) {
    clearClaimCheckout();
    return null;
  }
  return checkout;
}

export function clearClaimCheckout() {
  removeStorageKey(CLAIM_CHECKOUT_KEY);
}

export function clearAllClaimOfferStorage() {
  clearPendingClaim();
  clearClaimFormDraft();
  clearClaimCheckout();
}

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
