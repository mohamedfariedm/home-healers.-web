export type GtmEventParams = Record<
  string,
  string | number | boolean | null | undefined
>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Named events pushed to dataLayer.
 * In GTM: Triggers → Custom Event → Event name = these strings.
 *
 * Tip: create one catch-all trigger for `ui_click` to see every button/link,
 * plus specific triggers for the named events you care about (WhatsApp, booking, …).
 */
export const GTM_EVENTS = {
  /** Fired for every interactive click (button / link / role=button). */
  UI_CLICK: "ui_click",
  /** Fired for every form submit. */
  FORM_SUBMIT: "form_submit",

  WHATSAPP_CLICK: "whatsapp_click",
  PHONE_CLICK: "phone_click",
  EMAIL_CLICK: "email_click",
  LIVE_CHAT_CLICK: "live_chat_click",
  SOCIAL_CLICK: "social_click",
  DOWNLOAD_APP_CLICK: "download_app_click",

  NAV_CLICK: "nav_click",
  BLOG_CLICK: "blog_click",
  BOOKING_CLICK: "booking_click",
  OFFER_CLICK: "offer_click",
  OFFER_BOOK_CLICK: "offer_book_click",
  CATEGORY_CLICK: "category_click",
  DOCTOR_APPLY_CLICK: "doctor_apply_click",
  CONTACT_CLICK: "contact_click",
  ABOUT_CLICK: "about_click",
  LANGUAGE_SWITCH: "language_switch",
  DOCTOR_PROFILE_CLICK: "doctor_profile_click",
  GO_HOME_CLICK: "go_home_click",
  RECEIPT_DOWNLOAD: "receipt_download",
  INVOICE_DOWNLOAD: "invoice_download",
  PAYMENT_RETRY: "payment_retry",
  REVIEW_SUBMIT: "review_submit",
  OFFER_BOOK_CONFIRM: "offer_book_confirm",

  RESERVATION_CREATED: "reservation_created",
  RESERVATION_PAYMENT: "reservation_payment",
  CONTACT_FORM_SUBMIT: "contact_form_submit",
  BLOG_LEAD_SUBMIT: "blog_lead_submit",
  DOCTOR_APPLY_SUBMIT: "doctor_apply_submit",
  LANDING_FORM_SUBMIT: "landing_form_submit",
  CTA_CLICK: "cta_click",
} as const;

export type GtmEventName =
  | (typeof GTM_EVENTS)[keyof typeof GTM_EVENTS]
  | (string & {});

/** Ensure dataLayer exists before GTM script loads so early pushes are queued. */
export function ensureDataLayer(): Record<string, unknown>[] {
  if (typeof window === "undefined") return [];
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
}

/**
 * Push a Custom Event to GTM's dataLayer.
 * In GTM: Triggers → Custom Event → Event name = the `event` string below.
 */
export function trackEvent(
  event: GtmEventName,
  params: GtmEventParams = {},
): void {
  if (typeof window === "undefined") return;

  const payload: Record<string, unknown> = { event };
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) payload[key] = value;
  }

  ensureDataLayer().push(payload);

  if (process.env.NODE_ENV !== "production") {
    console.info("[GTM]", event, params);
  }
}

/** Map an internal path (locale stripped) to a specific event name when possible. */
export function eventNameFromPath(pathname: string): GtmEventName | null {
  const path = pathname.split("?")[0] || "/";

  if (path === "/booking" || path.startsWith("/booking/")) {
    return GTM_EVENTS.BOOKING_CLICK;
  }
  if (/^\/offers\/[^/]+\/book(?:\/|$)/.test(path)) {
    return GTM_EVENTS.OFFER_BOOK_CLICK;
  }
  if (path === "/offers" || path.startsWith("/offers/")) {
    return GTM_EVENTS.OFFER_CLICK;
  }
  if (path === "/blog" || path.startsWith("/blog/")) {
    return GTM_EVENTS.BLOG_CLICK;
  }
  if (path === "/doctors-apply" || path.startsWith("/doctors-apply/")) {
    return GTM_EVENTS.DOCTOR_APPLY_CLICK;
  }
  if (path === "/categories" || path.startsWith("/categories/")) {
    return GTM_EVENTS.CATEGORY_CLICK;
  }
  if (path === "/contact" || path.startsWith("/contact/")) {
    return GTM_EVENTS.CONTACT_CLICK;
  }
  if (path === "/about" || path.startsWith("/about/")) {
    return GTM_EVENTS.ABOUT_CLICK;
  }
  if (
    path === "/" ||
    path === "/terms" ||
    path === "/privacy" ||
    path.startsWith("/terms") ||
    path.startsWith("/privacy")
  ) {
    return GTM_EVENTS.NAV_CLICK;
  }

  return null;
}
