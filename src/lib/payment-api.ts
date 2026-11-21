import { extractApiMessage } from "@/lib/payment-summary";
import {
  parseTamaraPayData,
  parseTamaraVerifyData,
  type TamaraPayData,
  type TamaraVerifyData,
} from "@/lib/tamara";
import {
  parseTelrMethodPayData,
  parseTelrSeamlessPayData,
  parseTelrSeamlessVerifyData,
  type TelrMethodPayData,
  type TelrSeamlessPayData,
  type TelrSeamlessVerifyData,
} from "@/lib/telr-seamless";

export function extractTelrRedirectUrl(response: unknown): string {
  if (!response || typeof response !== "object") {
    throw new Error("Invalid payment response");
  }

  const root = response as Record<string, unknown>;
  const data =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : undefined;

  const url = data?.redirect_url ?? root.redirect_url;
  if (typeof url === "string" && url.trim()) {
    return url;
  }

  throw new Error(extractApiMessage(response, "Payment redirect URL missing"));
}

/** Parses Seamless pay / 409 responses (challenge URL / status). */
export function extractTelrSeamlessPayResult(
  response: unknown
): TelrSeamlessPayData {
  return parseTelrSeamlessPayData(response);
}

/** Parses Seamless verify responses. */
export function extractTelrSeamlessVerifyResult(
  response: unknown
): TelrSeamlessVerifyData {
  return parseTelrSeamlessVerifyData(response);
}

/** Parses Tabby / Apple Pay method-pay redirect responses. */
export function extractTelrMethodPayResult(
  response: unknown
): TelrMethodPayData {
  return parseTelrMethodPayData(response);
}

export function extractTamaraPayResult(response: unknown): TamaraPayData {
  return parseTamaraPayData(response);
}

export function extractTamaraVerifyResult(response: unknown): TamaraVerifyData {
  return parseTamaraVerifyData(response);
}

export type ReservationPaymentState = {
  id?: number;
  status?: number;
  payment_status?: string;
  payment_method?: string;
  paid?: boolean;
  patient?: unknown;
  client?: unknown;
  client_id?: number | string | null;
  guest_info?: unknown;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

export function parseReservationRecord(response: unknown): ReservationPaymentState | null {
  if (!response || typeof response !== "object") return null;

  const root = response as Record<string, unknown>;
  const data = root.data;

  if (Array.isArray(data) && data[0] && typeof data[0] === "object") {
    return data[0] as ReservationPaymentState;
  }

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const record = data as Record<string, unknown>;
    if (record.reservation && typeof record.reservation === "object") {
      return record.reservation as ReservationPaymentState;
    }
    return record as ReservationPaymentState;
  }

  return null;
}

/**
 * Backend payment endpoints require a linked client or guest.
 * Reservations with null patient/guest (e.g. 3021) fail summary/pay with 422/404.
 */
export function reservationHasPayableClient(
  reservation: unknown
): boolean {
  const record = asRecord(reservation) ?? parseReservationRecord(reservation);
  if (!record) return false;

  if (asRecord(record.patient)) return true;
  if (asRecord(record.client)) return true;

  const clientId = Number(record.client_id);
  if (Number.isFinite(clientId) && clientId > 0) return true;

  const guest = asRecord(record.guest_info);
  if (!guest) return false;
  const name = typeof guest.name === "string" ? guest.name.trim() : "";
  const mobile =
    typeof guest.mobile === "string"
      ? guest.mobile.trim()
      : typeof guest.phone === "string"
        ? guest.phone.trim()
        : "";
  const email = typeof guest.email === "string" ? guest.email.trim() : "";
  return Boolean(name || mobile || email);
}

export function isReservationNotPayableError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const status = Number((error as { status?: number }).status);
  const message = String((error as { message?: string }).message || "").toLowerCase();
  if (status === 404 && (message.includes("not found") || !message)) {
    return true;
  }
  if (
    status === 422 &&
    (message.includes("no associated client") ||
      message.includes("associated client") ||
      message.includes("بدون عميل"))
  ) {
    return true;
  }
  return false;
}
