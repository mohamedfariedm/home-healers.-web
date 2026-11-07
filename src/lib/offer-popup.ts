import type {
  MultilingualText,
  OfferPopup,
  OfferPopupDiscountType,
} from "@/types/offer-popup";

const STORAGE_PREFIX = "hh_offer_popup_";

function storageKey(id: string, suffix: string) {
  return `${STORAGE_PREFIX}${id}_${suffix}`;
}

/** Today's date in Asia/Riyadh as YYYY-MM-DD. */
export function riyadhToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Riyadh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function isWithinDateRange(popup: OfferPopup): boolean {
  const today = riyadhToday();
  if (popup.start_date && today < popup.start_date.slice(0, 10)) return false;
  if (popup.auto_hide_after_end && popup.end_date) {
    if (today > popup.end_date.slice(0, 10)) return false;
  }
  return true;
}

export function matchesUrlRules(
  popup: OfferPopup,
  pathname: string,
): boolean {
  const path = pathname || "/";
  const rules = popup.url_rules.filter((r) => r.value.trim());
  if (!rules.length) return false;
  return rules.some((rule) => {
    const value = rule.value.trim();
    if (rule.match === "equals") {
      return path === value || path === `${value}/` || `${path}/` === value;
    }
    return path.includes(value);
  });
}

export function matchesDevice(
  popup: OfferPopup,
  isMobile: boolean,
): boolean {
  if (popup.devices === "both") return true;
  if (popup.devices === "mobile") return isMobile;
  return !isMobile;
}

export function pickWinningPopup(
  popups: OfferPopup[],
  pathname: string,
  isMobile: boolean,
  previewId?: string | null,
): OfferPopup | null {
  const candidates = popups.filter((p) => {
    if (previewId) return p.id === previewId;
    if (p.status !== "active") return false;
    if (!isWithinDateRange(p)) return false;
    if (!matchesDevice(p, isMobile)) return false;
    if (!matchesUrlRules(p, pathname)) return false;
    return true;
  });

  if (!candidates.length) return null;

  candidates.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    const aStart = a.start_date || "";
    const bStart = b.start_date || "";
    return bStart.localeCompare(aStart);
  });

  return candidates[0];
}

export function canShowByFrequency(
  popup: OfferPopup,
  bypass = false,
): boolean {
  if (bypass || typeof window === "undefined") return true;

  try {
    if (
      popup.never_show_after_submit &&
      localStorage.getItem(storageKey(popup.id, "submitted")) === "1"
    ) {
      return false;
    }

    if (popup.hide_after_close_days > 0) {
      const closedAt = localStorage.getItem(storageKey(popup.id, "closed_at"));
      if (closedAt) {
        const ms =
          popup.hide_after_close_days * 24 * 60 * 60 * 1000;
        if (Date.now() - Number(closedAt) < ms) return false;
      }
    }

    if (popup.max_times_per_visitor === "once_per_session") {
      if (sessionStorage.getItem(storageKey(popup.id, "shown")) === "1") {
        return false;
      }
    }

    if (popup.max_times_per_visitor === "once_per_day") {
      if (
        localStorage.getItem(storageKey(popup.id, "day")) === riyadhToday()
      ) {
        return false;
      }
    }
  } catch {
    // ignore storage errors
  }

  return true;
}

export function markPopupShown(popup: OfferPopup) {
  try {
    sessionStorage.setItem(storageKey(popup.id, "shown"), "1");
    localStorage.setItem(storageKey(popup.id, "day"), riyadhToday());
  } catch {
    // ignore
  }
}

export function markPopupClosed(popup: OfferPopup) {
  try {
    localStorage.setItem(
      storageKey(popup.id, "closed_at"),
      String(Date.now()),
    );
  } catch {
    // ignore
  }
}

export function markPopupSubmitted(popup: OfferPopup) {
  try {
    localStorage.setItem(storageKey(popup.id, "submitted"), "1");
    sessionStorage.setItem(storageKey(popup.id, "shown"), "1");
  } catch {
    // ignore
  }
}

export function pickLangText(
  value: MultilingualText,
  locale: "ar" | "en",
): string {
  return value[locale] || value.ar || value.en || "";
}

export function formatDiscountDisplay(
  type: OfferPopupDiscountType,
  value: number | null,
  locale: "ar" | "en",
): { label: string; big: string } {
  if (type === "free_session") {
    return locale === "en"
      ? { label: "Assessment session", big: "Free" }
      : { label: "جلسة تقييم", big: "مجانًا" };
  }
  if (type === "fixed") {
    return locale === "en"
      ? { label: "Discount", big: `${value ?? 0} SAR` }
      : { label: "خصم", big: `${value ?? 0} ر.س` };
  }
  return locale === "en"
    ? { label: "Discount", big: `${value ?? 0}%` }
    : { label: "خصم", big: `${value ?? 0}%` };
}

export function getCountdownParts(endDate: string | null): {
  days: number;
  hours: number;
  minutes: number;
} | null {
  if (!endDate) return null;
  // End of day Riyadh ≈ treat end_date as 23:59:59 Asia/Riyadh via UTC offset +03
  const end = new Date(`${endDate.slice(0, 10)}T23:59:59+03:00`);
  const diff = end.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return { days, hours, minutes };
}

export function normalizeSaudiPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("966")) digits = digits.slice(3);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

export function isValidSaudiMobile(raw: string): boolean {
  const digits = normalizeSaudiPhone(raw);
  return /^5\d{8}$/.test(digits);
}

export function toStoredMobile(raw: string): string {
  const digits = normalizeSaudiPhone(raw);
  return `0${digits}`;
}

export function parsePreviewParams(search: string): {
  preview: boolean;
  popupId: string | null;
} {
  try {
    const params = new URLSearchParams(search);
    return {
      preview: params.get("popup_preview") === "1",
      popupId: params.get("popup_id"),
    };
  } catch {
    return { preview: false, popupId: null };
  }
}
