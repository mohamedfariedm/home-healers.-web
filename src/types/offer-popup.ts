export type OfferPopupUrlMatchType = "contains" | "equals";
export type OfferPopupDevices = "both" | "desktop" | "mobile";
export type OfferPopupTriggerType =
  | "time_delay"
  | "scroll_depth"
  | "whichever_first"
  | "exit_intent";
export type OfferPopupDiscountType = "percentage" | "fixed" | "free_session";
export type OfferPopupFrequency =
  | "once_per_session"
  | "once_per_day"
  | "every_visit";

export interface MultilingualText {
  ar: string;
  en: string;
}

export interface OfferPopupUrlRule {
  match: OfferPopupUrlMatchType;
  value: string;
}

export interface OfferPopupTracking {
  meta_lead: boolean;
  snapchat_sign_up: boolean;
  ga4_generate_lead: boolean;
  tiktok_submit_form: boolean;
}

export type OfferPopupFormFieldKey = "name" | "mobile" | "service" | "consent";

export interface OfferPopupFormFieldConfig {
  visible: boolean;
  required: boolean;
}

export type OfferPopupFormFields = Record<
  OfferPopupFormFieldKey,
  OfferPopupFormFieldConfig
>;

export interface OfferPopup {
  id: string;
  name: string;
  status: "active" | "inactive";
  url_rules: OfferPopupUrlRule[];
  devices: OfferPopupDevices;
  priority: number;
  trigger_type: OfferPopupTriggerType;
  show_after_seconds: number;
  show_after_scroll_percent: number;
  offer_title: MultilingualText;
  badge_text: MultilingualText;
  discount_type: OfferPopupDiscountType;
  discount_value: number | null;
  start_date: string | null;
  end_date: string | null;
  coupon_id: string | null;
  coupon_code: string;
  show_countdown: boolean;
  auto_hide_after_end: boolean;
  form_fields: OfferPopupFormFields;
  button_text: MultilingualText;
  success_message: MultilingualText;
  max_times_per_visitor: OfferPopupFrequency;
  hide_after_close_days: number;
  never_show_after_submit: boolean;
  save_to_leads: boolean;
  notify_call_center: boolean;
  tracking: OfferPopupTracking;
}

function asMultilingual(
  value: unknown,
  fallbackAr = "",
  fallbackEn = "",
): MultilingualText {
  if (value && typeof value === "object" && ("ar" in value || "en" in value)) {
    const v = value as Partial<MultilingualText>;
    return {
      ar: typeof v.ar === "string" ? v.ar : fallbackAr,
      en: typeof v.en === "string" ? v.en : fallbackEn,
    };
  }
  if (typeof value === "string") {
    return { ar: value, en: fallbackEn || value };
  }
  return { ar: fallbackAr, en: fallbackEn };
}

function defaultFormFields(
  raw?: Partial<OfferPopupFormFields>,
  legacyServiceVisible = false,
): OfferPopupFormFields {
  return {
    name: {
      visible: raw?.name?.visible !== false,
      required: raw?.name?.required !== false,
    },
    mobile: {
      visible: raw?.mobile?.visible !== false,
      required: raw?.mobile?.required !== false,
    },
    service: {
      visible: raw?.service?.visible ?? legacyServiceVisible,
      required: Boolean(raw?.service?.required),
    },
    consent: {
      visible: raw?.consent?.visible !== false,
      required: raw?.consent?.required !== false,
    },
  };
}

/** Normalize admin settings payload (including older single-language shapes). */
export function normalizeOfferPopup(raw: any): OfferPopup | null {
  if (!raw || typeof raw !== "object" || !raw.id) return null;

  return {
    id: String(raw.id),
    name: String(raw.name || ""),
    status: raw.status === "inactive" ? "inactive" : "active",
    url_rules: Array.isArray(raw.url_rules)
      ? raw.url_rules.map((r: any) => ({
          match: r?.match === "equals" ? "equals" : "contains",
          value: String(r?.value || ""),
        }))
      : [{ match: "contains", value: "/offers" }],
    devices:
      raw.devices === "desktop" || raw.devices === "mobile"
        ? raw.devices
        : "both",
    priority: Number(raw.priority) || 1,
    trigger_type: ([
      "time_delay",
      "scroll_depth",
      "whichever_first",
      "exit_intent",
    ].includes(raw.trigger_type)
      ? raw.trigger_type
      : "whichever_first") as OfferPopupTriggerType,
    show_after_seconds: Number(raw.show_after_seconds) || 8,
    show_after_scroll_percent: Number(raw.show_after_scroll_percent) || 50,
    offer_title: asMultilingual(raw.offer_title ?? raw.offer_title_ar),
    badge_text: asMultilingual(
      raw.badge_text,
      "عرض لفترة محدودة",
      "Limited time offer",
    ),
    discount_type: ([
      "percentage",
      "fixed",
      "free_session",
    ].includes(raw.discount_type)
      ? raw.discount_type
      : "percentage") as OfferPopupDiscountType,
    discount_value:
      raw.discount_value == null || raw.discount_value === ""
        ? null
        : Number(raw.discount_value),
    start_date: raw.start_date || null,
    end_date: raw.end_date || null,
    coupon_id: raw.coupon_id || null,
    coupon_code: String(raw.coupon_code || raw.promo_code || ""),
    show_countdown: raw.show_countdown !== false,
    auto_hide_after_end: raw.auto_hide_after_end !== false,
    form_fields: defaultFormFields(
      raw.form_fields,
      Boolean(raw.show_service_field),
    ),
    button_text: asMultilingual(
      raw.button_text,
      "احصل على العرض",
      "Get the offer",
    ),
    success_message: asMultilingual(
      raw.success_message,
      "تم استلام طلبك، فريقنا بيتواصل معك قريبًا",
      "We received your request. Our team will contact you soon.",
    ),
    max_times_per_visitor: ([
      "once_per_session",
      "once_per_day",
      "every_visit",
    ].includes(raw.max_times_per_visitor)
      ? raw.max_times_per_visitor
      : "once_per_session") as OfferPopupFrequency,
    hide_after_close_days: Number(raw.hide_after_close_days) || 0,
    never_show_after_submit: raw.never_show_after_submit !== false,
    save_to_leads: raw.save_to_leads !== false,
    notify_call_center: raw.notify_call_center !== false,
    tracking: {
      meta_lead: raw.tracking?.meta_lead !== false,
      snapchat_sign_up: raw.tracking?.snapchat_sign_up !== false,
      ga4_generate_lead: raw.tracking?.ga4_generate_lead !== false,
      tiktok_submit_form: raw.tracking?.tiktok_submit_form !== false,
    },
  };
}

export function extractOfferPopups(settings: unknown): OfferPopup[] {
  const raw =
    (settings as { data?: Array<{ setting?: { offer_popups?: unknown } }> })
      ?.data?.[0]?.setting?.offer_popups ?? [];
  if (!Array.isArray(raw)) return [];
  return raw
    .map(normalizeOfferPopup)
    .filter((p): p is OfferPopup => Boolean(p));
}
