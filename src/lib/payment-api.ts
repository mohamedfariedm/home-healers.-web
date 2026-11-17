import { extractApiMessage } from "@/lib/payment-summary";
import {
  parseTelrSeamlessPayData,
  parseTelrSeamlessVerifyData,
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

export type ReservationPaymentState = {
  id?: number;
  status?: number;
  payment_status?: string;
  payment_method?: string;
  paid?: boolean;
};

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
