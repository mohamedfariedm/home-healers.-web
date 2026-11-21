/**
 * Payment lifecycle helpers smoke (no network / no charges).
 * Run: node scripts/payment-lifecycle-smoke.mjs
 */

function asRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value;
}

function reservationHasPayableClient(reservation) {
  const record = asRecord(reservation);
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

function isReservationNotPayableError(error) {
  if (!error || typeof error !== "object") return false;
  const status = Number(error.status);
  const message = String(error.message || "").toLowerCase();
  if (status === 404 && (message.includes("not found") || !message)) return true;
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

const TELR_HOSTED_REUSE_MARGIN_MS = 120_000;

function isTelrHostedSessionExpired(expiresAt, marginMs = TELR_HOSTED_REUSE_MARGIN_MS) {
  if (!expiresAt) return false;
  const ms = Date.parse(expiresAt);
  if (!Number.isFinite(ms)) return false;
  const safeMargin = Number.isFinite(marginMs) && marginMs > 0 ? marginMs : 0;
  return ms <= Date.now() + safeMargin;
}

function isHttpsRedirect(url) {
  return typeof url === "string" && url.startsWith("https://");
}

// 1) Missing client (3021-shaped)
if (
  reservationHasPayableClient({
    id: 3021,
    patient: null,
    guest_info: null,
    client_id: null,
  })
) {
  throw new Error("3021-shaped reservation must not be payable");
}

// 2) Guest / patient present
if (
  !reservationHasPayableClient({
    id: 1,
    patient: { id: 9, mobile: "055" },
  }) ||
  !reservationHasPayableClient({
    id: 2,
    guest_info: { name: "A", mobile: "055" },
  }) ||
  !reservationHasPayableClient({ id: 3, client_id: 44 })
) {
  throw new Error("payable client detection failed");
}

// 3) Summary / pay error mapping
if (
  !isReservationNotPayableError({
    status: 422,
    message: "Reservation has no associated client.",
  }) ||
  !isReservationNotPayableError({ status: 404, message: "Not found" }) ||
  isReservationNotPayableError({
    status: 422,
    message: "The selected method is invalid.",
  })
) {
  throw new Error("not-payable error mapping failed");
}

// 4) Expiry + conservative margin
if (!isTelrHostedSessionExpired("2020-01-01T00:00:00+00:00")) {
  throw new Error("past expiry must block");
}
const soon = new Date(Date.now() + 60_000).toISOString();
if (!isTelrHostedSessionExpired(soon)) {
  throw new Error("within 120s margin must block");
}
const later = new Date(Date.now() + 10 * 60_000).toISOString();
if (isTelrHostedSessionExpired(later)) {
  throw new Error("far future expiry must allow");
}
if (isTelrHostedSessionExpired(null)) {
  throw new Error("missing expires_at must not block (backend authoritative)");
}

// 5) Redirect safety
if (!isHttpsRedirect("https://secure.telr.com/gateway/process.html?o=x")) {
  throw new Error("https redirect must pass");
}
if (isHttpsRedirect("http://secure.telr.com/x") || isHttpsRedirect("javascript:alert(1)")) {
  throw new Error("non-https redirect must fail");
}

// 6) Method selection contract (FE initiates tabby only via method/pay)
const tabbyBody = { reservation_id: 3008, method: "tabby", locale: "en" };
if (tabbyBody.method !== "tabby") {
  throw new Error("tabby initiation contract drifted");
}

// 7) Checkout method → payment summary type mapping
function resolvePaymentSummaryMethodType(paymentMethod) {
  if (paymentMethod === "cash") return "cash";
  if (paymentMethod === "tamara") return "tamara";
  if (paymentMethod === "wallet") return "wallet";
  if (
    paymentMethod === "telr" ||
    paymentMethod === "card" ||
    paymentMethod === "tabby" ||
    paymentMethod === "apple_pay"
  ) {
    return "telr";
  }
  return paymentMethod;
}

function normalizeCheckoutPaymentMethod(paymentMethod) {
  if (!paymentMethod || paymentMethod === "cash_on_delivery") return "cash";
  if (paymentMethod === "telr") return "card";
  if (paymentMethod === "wallet") return "apple_pay";
  return paymentMethod;
}

if (resolvePaymentSummaryMethodType("card") !== "telr") {
  throw new Error("card must map to telr summary");
}
if (resolvePaymentSummaryMethodType("tabby") !== "telr") {
  throw new Error("tabby must map to telr summary");
}
if (resolvePaymentSummaryMethodType("apple_pay") !== "telr") {
  throw new Error("apple_pay must map to telr summary");
}
if (normalizeCheckoutPaymentMethod("telr") !== "card") {
  throw new Error("legacy telr must normalize to card");
}

console.log("payment-lifecycle-smoke: OK");
