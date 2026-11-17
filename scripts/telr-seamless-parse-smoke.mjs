/**
 * Lightweight contract smoke checks for Telr Seamless parsers.
 * Run: node scripts/telr-seamless-parse-smoke.mjs
 *
 * Mirrors the TypeScript parse helpers (kept in sync manually with
 * src/lib/telr-seamless/parse.ts + config.ts).
 */

function asRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value;
}

function asString(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function asNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return null;
}

function asBoolean(value) {
  if (typeof value === "boolean") return value;
  return undefined;
}

function parseTelrSeamlessConfig(response) {
  const root = asRecord(response);
  if (!root) return null;
  const data = asRecord(root.data) ?? root;
  const enabled = asBoolean(data.enabled);
  const storeId =
    asString(data.store_id) ??
    (asNumber(data.store_id) != null ? String(data.store_id) : null);
  if (enabled === false) {
    return { enabled: false, store_id: storeId ?? "", currency: asString(data.currency) ?? "SAR" };
  }
  if (!storeId) return null;
  return { enabled: enabled ?? true, store_id: storeId, currency: asString(data.currency) ?? "SAR" };
}

function parsePay(response) {
  const root = asRecord(response);
  if (!root) throw new Error("bad pay");
  const data = asRecord(root.data) ?? root;
  return {
    attempt_id: asNumber(data.attempt_id),
    payment_status: asString(data.payment_status),
    challenge_url: asString(data.challenge_url),
    error: asString(data.error),
    final: asBoolean(data.final),
  };
}

function parseVerify(response) {
  const root = asRecord(response);
  if (!root) throw new Error("bad verify");
  const data = asRecord(root.data) ?? root;
  return {
    payment_status: asString(data.payment_status),
    final: asBoolean(data.final),
    attempt_id: asNumber(data.attempt_id),
  };
}

const CANDIDATE = "https://secure.telr.com/jssdk/v2/telr_sdk.js";

const disabled = parseTelrSeamlessConfig({
  status: true,
  data: { enabled: false, store_id: null, currency: "SAR", test_mode: true },
});
if (!disabled || disabled.enabled !== false) throw new Error("disabled config failed");

const pay = parsePay({
  status: true,
  data: {
    payment_status: "challenge_required",
    challenge_url: "https://secure.telr.com/x",
    attempt_id: 9,
    final: false,
  },
});
if (pay.challenge_url !== "https://secure.telr.com/x" || pay.attempt_id !== 9) {
  throw new Error("pay parse failed");
}

const conflict = parsePay({
  status: false,
  message: "Payment already in progress",
  data: {
    error: "payment_in_progress",
    attempt_id: 9,
    payment_status: "processing",
    challenge_url: "https://secure.telr.com/y",
  },
});
if (conflict.error !== "payment_in_progress" || !conflict.challenge_url) {
  throw new Error("409 parse failed");
}

const verified = parseVerify({
  status: true,
  data: {
    attempt_id: 9,
    payment_status: "paid",
    final: true,
    retry_allowed: false,
    payable_id: "456",
  },
});
if (verified.payment_status !== "paid" || verified.final !== true) {
  throw new Error("verify paid failed");
}

if (!CANDIDATE.includes("secure.telr.com/jssdk/v2/telr_sdk.js")) {
  throw new Error("sdk url candidate failed");
}

console.log("telr-seamless parse smoke: OK");
