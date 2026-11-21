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

function normalizeMethods(value) {
  const raw = [];
  if (Array.isArray(value)) {
    for (const item of value) if (typeof item === "string" && item.trim()) raw.push(item.trim());
  } else if (typeof value === "string" && value.trim()) {
    raw.push(...value.split(/[,|]/).map((s) => s.trim()).filter(Boolean));
  }
  const out = [];
  for (const token of raw) {
    const key = token.toLowerCase().replace(/-/g, "_");
    const mapped =
      key === "card" || key === "cards"
        ? "card"
        : key === "tabby"
          ? "tabby"
          : key === "apple_pay" || key === "applepay"
            ? "apple_pay"
            : null;
    if (mapped && !out.includes(mapped)) out.push(mapped);
  }
  return out;
}

function parseTelrSeamlessConfig(response) {
  const root = asRecord(response);
  if (!root) return null;
  const data = asRecord(root.data) ?? root;
  const enabled = asBoolean(data.enabled);
  const storeId =
    asString(data.store_id) ??
    (asNumber(data.store_id) != null ? String(data.store_id) : null);
  const methodsRaw = data.methods ?? data.payment_methods ?? data.panels;
  const methods =
    methodsRaw === undefined || methodsRaw === null
      ? undefined
      : normalizeMethods(methodsRaw);
  if (enabled === false) {
    return {
      enabled: false,
      store_id: storeId ?? "",
      currency: asString(data.currency) ?? "SAR",
      ...(methods?.length ? { methods } : {}),
    };
  }
  if (!storeId) return null;
  return {
    enabled: enabled ?? true,
    store_id: storeId,
    currency: asString(data.currency) ?? "SAR",
    ...(methods?.length ? { methods } : {}),
  };
}

function parseMethodPay(response) {
  const root = asRecord(response);
  if (!root) throw new Error("bad method pay");
  const data = asRecord(root.data) ?? root;
  const redirect =
    asString(data.redirect_url) ?? asString(data.redirect_link) ?? asString(data.order_url);
  if (!redirect) throw new Error("missing redirect");
  return { redirect_url: redirect, attempt_id: asNumber(data.attempt_id) };
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

const withMethods = parseTelrSeamlessConfig({
  status: true,
  data: {
    enabled: true,
    store_id: "12345",
    currency: "SAR",
    test_mode: true,
    methods: ["card", "applepay", "tabby"],
  },
});
if (
  !withMethods ||
  !withMethods.methods ||
  withMethods.methods.join(",") !== "card,apple_pay,tabby"
) {
  throw new Error("methods parse failed");
}

const withoutMethods = parseTelrSeamlessConfig({
  status: true,
  data: {
    enabled: true,
    store_id: "31787",
    currency: "SAR",
    test_mode: true,
  },
});
if (!withoutMethods || withoutMethods.methods) {
  throw new Error("omitted methods must stay undefined (UI is frontend-owned)");
}

function parseMethodPayFull(response) {
  const root = asRecord(response);
  if (!root) throw new Error("bad method pay");
  const data = asRecord(root.data) ?? root;
  const redirect =
    asString(data.redirect_url) ?? asString(data.redirect_link) ?? asString(data.order_url);
  if (!redirect) throw new Error("missing redirect");
  return {
    redirect_url: redirect,
    attempt_id: asNumber(data.attempt_id),
    payment_id: asString(data.payment_id),
    reused: asBoolean(data.reused),
    expires_at: asString(data.expires_at),
  };
}

const methodPay = parseMethodPayFull({
  status: true,
  data: {
    redirect_url: "https://secure.telr.com/gateway/process.html?o=x",
    attempt_id: 3,
    payment_id: "ORD123",
    payment_status: "processing",
    payment_mode: "hosted_method",
    reused: false,
    expires_at: "2026-11-18T12:30:00+00:00",
  },
});
if (
  methodPay.redirect_url !== "https://secure.telr.com/gateway/process.html?o=x" ||
  methodPay.attempt_id !== 3 ||
  methodPay.payment_id !== "ORD123" ||
  methodPay.reused !== false
) {
  throw new Error("method pay parse failed");
}

const TELR_HOSTED_REUSE_MARGIN_MS = 120_000;
function isTelrHostedSessionExpired(expiresAt, marginMs = TELR_HOSTED_REUSE_MARGIN_MS) {
  if (!expiresAt) return false;
  const ms = Date.parse(expiresAt);
  if (!Number.isFinite(ms)) return false;
  const safeMargin = Number.isFinite(marginMs) && marginMs > 0 ? marginMs : 0;
  return ms <= Date.now() + safeMargin;
}

if (!isTelrHostedSessionExpired("2020-01-01T00:00:00+00:00")) {
  throw new Error("expired session detection failed");
}
if (isTelrHostedSessionExpired("2099-01-01T00:00:00+00:00")) {
  throw new Error("future session must not be treated as expired");
}
if (isTelrHostedSessionExpired(null) || isTelrHostedSessionExpired("")) {
  throw new Error("missing expires_at must not block redirect");
}
const soon = new Date(Date.now() + 30_000).toISOString();
if (!isTelrHostedSessionExpired(soon)) {
  throw new Error("120s safety margin must treat near-expiry as expired");
}

console.log("telr-seamless parse smoke: OK");
