import type { Location, Patient } from "@/types/booking";

export const OFFER_TIME_SLOTS = ["09:00", "11:30", "14:00", "16:30", "18:00"] as const;

export const NOTE_TAGS = [
  { en: "Elevator available", ar: "يوجد مصعد" },
  { en: "Elderly patient", ar: "مريض مسن" },
  { en: "Emergency case", ar: "حالة طارئة" },
] as const;

export const NOTES_MAX_LENGTH = 500;
export const SESSION_DURATION_MS = 60 * 60 * 1000;

export type OfferTimePeriod = "morning" | "afternoon" | "evening" | "night";

export type OfferBookingDraft = {
  offer_id: number;
  sessions_count: number;
  offer_name: string;
  offer_price: number;
  currency: string;
  address_id?: number | null;
  selected_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  notes?: string;
  ends_at?: string | null;
  guest_name?: string;
  guest_phone?: string;
  guest_email?: string;
  guest_nationality?: string;
  guest_nationality_id?: number;
  guest_gender?: "male" | "female";
};

export type OfferCheckoutState = {
  reservationId: number;
  phase: "payment" | "done";
};

export type OfferBookingValidationCode =
  | "name_required"
  | "phone_required"
  | "nationality_required"
  | "address_required"
  | "date_required"
  | "time_required"
  | "date_in_past"
  | "end_time_after_start";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function draftStorageKey(offerId: number) {
  return `offer_booking_draft_${offerId}`;
}

export function checkoutStorageKey(offerId: number) {
  return `offer_booking_checkout_${offerId}`;
}

export function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorage(key: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
}

export function serverClockOffset(serverTime?: string, now = Date.now()) {
  if (!serverTime) return 0;
  const serverMs = Date.parse(serverTime);
  return Number.isNaN(serverMs) ? 0 : serverMs - now;
}

export function serverNow(offset = 0, now = Date.now()) {
  return new Date(now + offset);
}

export function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function toDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDateKey(key: string, hours = 0, minutes = 0) {
  const [year, month, day] = key.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

export function parseTimeLabel(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return { hours, minutes };
}

export function combineDateAndTime(dateKey: string, time: string) {
  const parsed = parseTimeLabel(time);
  if (!parsed) return null;
  return parseDateKey(dateKey, parsed.hours, parsed.minutes);
}

export function formatLocalDateTime(date: Date) {
  return `${toDateKey(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}

export function addOneHour(date: Date) {
  return new Date(date.getTime() + SESSION_DURATION_MS);
}

export function timePeriodFromStart(date: Date): OfferTimePeriod {
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const value = hour + minutes / 60;
  if (value >= 5 && value < 12) return "morning";
  if (value >= 12 && value < 17) return "afternoon";
  if (value >= 17 && value < 21) return "evening";
  return "night";
}

export function isSlotInPast(
  dateKey: string,
  time: string,
  offset = 0,
  now = Date.now(),
) {
  const slot = combineDateAndTime(dateKey, time);
  if (!slot) return true;
  return slot.getTime() <= serverNow(offset, now).getTime();
}

export function resolveDefaultAddress(locations: Location[], preferredId?: number | null) {
  if (preferredId) {
    const fromDraft = locations.find((location) => location.id === preferredId);
    if (fromDraft) return fromDraft;
  }
  return locations.find((location) => location.id > 0) ?? locations[0] ?? null;
}

export function validateOfferBooking(input: {
  name: string;
  phone: string;
  nationality: string;
  address: Location | null;
  dateKey: string | null;
  time: string | null;
  clockOffset?: number;
}): OfferBookingValidationCode | null {
  if (!input.name.trim()) return "name_required";
  if (!input.phone.trim()) return "phone_required";
  if (!input.nationality.trim()) return "nationality_required";
  if (!input.address) return "address_required";
  if (!input.dateKey) return "date_required";
  if (!input.time) return "time_required";

  const start = combineDateAndTime(input.dateKey, input.time);
  if (!start) return "time_required";
  if (start.getTime() <= serverNow(input.clockOffset ?? 0).getTime()) {
    return "date_in_past";
  }
  const end = addOneHour(start);
  if (end.getTime() <= start.getTime()) return "end_time_after_start";
  return null;
}

export function buildOfferReservationPayload(input: {
  offerId: number;
  sessionsCount: number;
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
  };
}) {
  const start = combineDateAndTime(input.dateKey, input.time);
  if (!start) throw new Error("Invalid appointment");
  const end = addOneHour(start);
  const notes = input.notes.trim();
  const nationalityId = input.guest.nationalityId;

  return {
    type: "reservation",
    package_id: input.offerId,
    sessions_count: input.sessionsCount,
    notes,
    dates: [
      {
        start_time: formatLocalDateTime(start),
        end_time: formatLocalDateTime(end),
        time_period: timePeriodFromStart(start),
        ...(notes ? { notes } : {}),
      },
    ],
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
      date_of_birth: "",
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

export function guestFromPatient(patient?: Patient | null): Pick<
  OfferBookingDraft,
  | "guest_name"
  | "guest_phone"
  | "guest_email"
  | "guest_nationality"
  | "guest_nationality_id"
  | "guest_gender"
> {
  if (!patient) return {};
  return {
    guest_name: patient.name,
    guest_phone: patient.phone,
    guest_email: patient.email,
    guest_nationality: patient.nationality,
    guest_nationality_id: patient.nationality_id,
    guest_gender: patient.gender,
  };
}

export function toggleNoteTag(notes: string, tag: string) {
  const lines = notes
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const exists = lines.includes(tag);
  const next = exists ? lines.filter((line) => line !== tag) : [...lines, tag];
  return next.join("\n").slice(0, NOTES_MAX_LENGTH);
}

export function formatTimeLabel(time: string, locale: string) {
  const parsed = parseTimeLabel(time);
  if (!parsed) return time;
  const date = new Date();
  date.setHours(parsed.hours, parsed.minutes, 0, 0);
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatDayLabel(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}
