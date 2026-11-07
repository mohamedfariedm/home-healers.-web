"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import ClientAPI from "@/app/api/api";
import { isClientApiError } from "@/lib/client-api-error";
import { trackEvent } from "@/lib/gtm";
import type { OfferPopup } from "@/types/offer-popup";
import {
  canShowByFrequency,
  formatDiscountDisplay,
  getCountdownParts,
  isValidSaudiMobile,
  markPopupClosed,
  markPopupShown,
  markPopupSubmitted,
  parsePreviewParams,
  pickLangText,
  pickWinningPopup,
  toStoredMobile,
} from "@/lib/offer-popup";

type Locale = "ar" | "en";

const SERVICE_OPTIONS = [
  { key: "homePhysiotherapy", ar: "علاج طبيعي منزلي", en: "Home physiotherapy" },
  { key: "homeDoctor", ar: "طبيب منزلي", en: "Home doctor" },
  { key: "homeNursing", ar: "تمريض منزلي", en: "Home nursing" },
  { key: "elderlyCare", ar: "رعاية كبار السن", en: "Elderly care" },
  { key: "other", ar: "أخرى", en: "Other" },
] as const;

interface OffersPopupProps {
  locale: Locale;
  popups: OfferPopup[];
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);
  return isMobile;
}

export default function OffersPopup({ locale, popups }: OffersPopupProps) {
  const pathname = usePathname() || "/";
  const isMobile = useIsMobile();
  const isRTL = locale === "ar";

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<OfferPopup | null>(null);
  const [triggerFired, setTriggerFired] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    service: "",
    consent: false,
    honeypot: "",
  });
  const [countdown, setCountdown] = useState(
    () => getCountdownParts(null),
  );

  const preview = useMemo(() => {
    if (typeof window === "undefined") {
      return { preview: false, popupId: null as string | null };
    }
    return parsePreviewParams(window.location.search);
  }, [pathname]);

  const candidate = useMemo(
    () =>
      pickWinningPopup(
        popups,
        pathname.replace(/^\/en(?=\/|$)/, "") || "/",
        isMobile,
        preview.preview ? preview.popupId : null,
      ),
    [popups, pathname, isMobile, preview.preview, preview.popupId],
  );

  const close = useCallback(
    (reason: "user" | "success" = "user") => {
      setOpen(false);
      if (active && reason === "user" && !preview.preview) {
        markPopupClosed(active);
        trackEvent("offer_popup_close", {
          popup_id: active.id,
          offer_title: pickLangText(active.offer_title, locale),
        });
      }
    },
    [active, locale, preview.preview],
  );

  const showPopup = useCallback(
    (popup: OfferPopup, fired: string) => {
      if (!preview.preview && !canShowByFrequency(popup, false)) return;
      setActive(popup);
      setTriggerFired(fired);
      setOpen(true);
      setSuccess(false);
      if (!preview.preview) markPopupShown(popup);
      trackEvent("offer_popup_view", {
        popup_id: popup.id,
        offer_title: pickLangText(popup.offer_title, locale),
        discount_type: popup.discount_type,
        discount_value: popup.discount_value,
        trigger: fired,
      });
      if (popup.tracking?.ga4_generate_lead) {
        trackEvent("popup_view", {
          popup_id: popup.id,
          offer_title: pickLangText(popup.offer_title, locale),
        });
      }
    },
    [locale, preview.preview],
  );

  // Trigger listeners
  useEffect(() => {
    if (!candidate) return;
    if (!preview.preview && !canShowByFrequency(candidate, false)) return;

    let shown = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let visibleElapsed = 0;
    let lastVisibleAt = document.visibilityState === "visible" ? Date.now() : 0;

    const showOnce = (fired: string) => {
      if (shown) return;
      shown = true;
      cleanup();
      showPopup(candidate, fired);
    };

    const onScroll = () => {
      if (
        candidate.trigger_type !== "scroll_depth" &&
        candidate.trigger_type !== "whichever_first"
      ) {
        return;
      }
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = (window.scrollY / scrollable) * 100;
      if (pct >= candidate.show_after_scroll_percent) {
        showOnce("scroll");
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      if (candidate.trigger_type !== "exit_intent") return;
      if (isMobile) return;
      if (e.clientY <= 0) showOnce("exit_intent");
    };

    const tickDelay = () => {
      if (
        candidate.trigger_type !== "time_delay" &&
        candidate.trigger_type !== "whichever_first"
      ) {
        return;
      }
      if (document.visibilityState !== "visible") return;
      const now = Date.now();
      if (lastVisibleAt) visibleElapsed += now - lastVisibleAt;
      lastVisibleAt = now;
      if (visibleElapsed >= candidate.show_after_seconds * 1000) {
        showOnce("time");
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        lastVisibleAt = Date.now();
      } else if (lastVisibleAt) {
        visibleElapsed += Date.now() - lastVisibleAt;
        lastVisibleAt = 0;
      }
    };

    const cleanup = () => {
      if (timer) clearInterval(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("visibilitychange", onVisibility);
    };

    if (preview.preview) {
      showOnce("preview");
      return cleanup;
    }

    if (
      candidate.trigger_type === "time_delay" ||
      candidate.trigger_type === "whichever_first"
    ) {
      timer = setInterval(tickDelay, 250);
    }
    if (
      candidate.trigger_type === "scroll_depth" ||
      candidate.trigger_type === "whichever_first"
    ) {
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
    if (candidate.trigger_type === "exit_intent") {
      document.addEventListener("mouseout", onMouseOut);
    }
    document.addEventListener("visibilitychange", onVisibility);

    return cleanup;
  }, [candidate, isMobile, preview.preview, showPopup]);

  // Countdown
  useEffect(() => {
    if (!open || !active?.show_countdown || !active.end_date) {
      setCountdown(null);
      return;
    }
    const update = () => setCountdown(getCountdownParts(active.end_date));
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, [open, active]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close("user");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Lock body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !active) return null;

  const discount = formatDiscountDisplay(
    active.discount_type,
    active.discount_value,
    locale,
  );
  const title = pickLangText(active.offer_title, locale);
  const badge = pickLangText(active.badge_text, locale);
  const button = pickLangText(active.button_text, locale);
  const successMsg = pickLangText(active.success_message, locale);
  const fields = active.form_fields;

  const errMsg = (key: string) => {
    if (locale === "ar") {
      if (key === "name") return "من فضلك اكتب اسمك";
      if (key === "mobile") return "من فضلك اكتب رقم جوال صحيح";
      if (key === "consent") return "لازم توافق على التواصل علشان نكمل";
      if (key === "service") return "من فضلك اختر الخدمة";
      return "حصل خطأ، حاول مرة تانية";
    }
    if (key === "name") return "Please enter your name";
    if (key === "mobile") return "Please enter a valid mobile number";
    if (key === "consent") return "Consent is required to continue";
    if (key === "service") return "Please select a service";
    return "Something went wrong. Please try again.";
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (fields.name.visible && fields.name.required) {
      if (form.name.trim().length < 2) next.name = errMsg("name");
    }
    if (fields.mobile.visible && fields.mobile.required) {
      if (!isValidSaudiMobile(form.mobile)) next.mobile = errMsg("mobile");
    } else if (fields.mobile.visible && form.mobile.trim()) {
      if (!isValidSaudiMobile(form.mobile)) next.mobile = errMsg("mobile");
    }
    if (fields.service.visible && fields.service.required && !form.service) {
      next.service = errMsg("service");
    }
    if (fields.consent.visible && fields.consent.required && !form.consent) {
      next.consent = errMsg("consent");
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.honeypot) return;
    if (!validate()) return;
    setSubmitting(true);
    try {
      const serviceLabel =
        SERVICE_OPTIONS.find((s) => s.key === form.service)?.[locale] ||
        form.service;
      const notes = [
        `Offer popup: ${active.name}`,
        `Offer: ${title}`,
        `Discount: ${active.discount_type} ${active.discount_value ?? ""}`,
        active.coupon_code ? `Coupon: ${active.coupon_code}` : "",
        serviceLabel ? `Service: ${serviceLabel}` : "",
        `Page: ${typeof window !== "undefined" ? window.location.href : pathname}`,
        `Device: ${isMobile ? "mobile" : "desktop"}`,
        `Trigger: ${triggerFired}`,
        `Locale: ${locale}`,
      ]
        .filter(Boolean)
        .join("\n");

      if (active.save_to_leads) {
        await ClientAPI.submitCustomerSupport(
          {
            name: form.name.trim() || "Guest",
            mobile_phone: fields.mobile.visible
              ? toStoredMobile(form.mobile)
              : "0500000000",
            notes,
            type: "seo",
          },
          locale,
        );
      }

      if (!preview.preview) markPopupSubmitted(active);

      trackEvent("offer_popup_submit", {
        popup_id: active.id,
        offer_title: title,
        discount_type: active.discount_type,
        discount_value: active.discount_value,
        coupon_code: active.coupon_code || undefined,
      });
      if (active.tracking?.ga4_generate_lead) {
        trackEvent("generate_lead", {
          popup_id: active.id,
          offer_title: title,
        });
      }

      setSuccess(true);
    } catch (error) {
      setErrors({
        submit:
          (isClientApiError(error) && error.message) || errMsg("submit"),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const shellClass = isMobile
    ? "fixed inset-x-0 bottom-0 z-[10050] max-h-[92vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl animate-in slide-in-from-bottom duration-300"
    : "relative z-[10050] w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 fade-in duration-200";

  return (
    <div
      className={`fixed inset-0 z-[10040] ${
        isMobile ? "flex items-end" : "flex items-center justify-center p-4"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <button
        type="button"
        aria-label="Close overlay"
        className="absolute inset-0 bg-black/55"
        onClick={() => close("user")}
      />

      <div className={shellClass} role="dialog" aria-modal="true">
        <button
          type="button"
          onClick={() => close("user")}
          className="absolute end-3 top-3 z-10 rounded-full bg-black/25 p-1.5 text-white backdrop-blur hover:bg-black/40"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="bg-gradient-to-br from-[#0d7377] to-[#14919b] px-5 pb-6 pt-5 text-white">
          {badge ? (
            <span className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
              {badge}
            </span>
          ) : null}
          <p className="text-sm opacity-90">{discount.label}</p>
          <p className="mt-1 text-5xl font-bold leading-none tracking-tight">
            {discount.big}
          </p>
          <p className="mt-4 text-base leading-snug opacity-95">{title}</p>
          {active.show_countdown && countdown ? (
            <p className="mt-4 text-xs opacity-85">
              {locale === "ar" ? "ينتهي العرض خلال" : "Offer ends in"}{" "}
              <span className="font-semibold">
                {countdown.days}d {countdown.hours}h {countdown.minutes}m
              </span>
            </p>
          ) : null}
        </div>

        <div className="space-y-3 bg-gray-50 px-5 py-5">
          {success ? (
            <div className="py-6 text-center">
              <p className="text-lg font-semibold text-gray-900">
                {locale === "ar" ? "تم استلام طلبك" : "Request received"}
              </p>
              <p className="mt-2 text-sm text-gray-600">{successMsg}</p>
              <button
                type="button"
                onClick={() => close("success")}
                className="mt-5 rounded-xl bg-[#0d7377] px-5 py-2.5 text-sm font-semibold text-white"
              >
                {locale === "ar" ? "حسناً" : "OK"}
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900">
                  {locale === "ar" ? "احجز عرضك الآن" : "Book your offer now"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {locale === "ar"
                    ? "سجّل بياناتك وفريقنا يتواصل معك خلال ساعات لتأكيد الموعد."
                    : "Leave your details and our team will contact you soon."}
                </p>
              </div>

              {/* honeypot */}
              <input
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                value={form.honeypot}
                onChange={(e) =>
                  setForm((p) => ({ ...p, honeypot: e.target.value }))
                }
              />

              {fields.name.visible ? (
                <div>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder={
                      locale === "ar" ? "اكتب اسمك" : "Enter your name"
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-[#0d7377]"
                  />
                  {errors.name ? (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  ) : null}
                </div>
              ) : null}

              {fields.mobile.visible ? (
                <div>
                  <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <span className="border-gray-200 bg-gray-100 px-3 py-3 text-sm text-gray-600 ltr:border-r rtl:border-l">
                      +966
                    </span>
                    <input
                      value={form.mobile}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, mobile: e.target.value }))
                      }
                      inputMode="tel"
                      placeholder="5X XXX XXXX"
                      className="flex-1 px-3 py-3 text-sm outline-none"
                    />
                  </div>
                  {errors.mobile ? (
                    <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>
                  ) : null}
                </div>
              ) : null}

              {fields.service.visible ? (
                <div>
                  <select
                    value={form.service}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, service: e.target.value }))
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-[#0d7377]"
                  >
                    <option value="">
                      {locale === "ar" ? "اختر الخدمة" : "Select a service"}
                    </option>
                    {SERVICE_OPTIONS.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s[locale]}
                      </option>
                    ))}
                  </select>
                  {errors.service ? (
                    <p className="mt-1 text-xs text-red-500">{errors.service}</p>
                  ) : null}
                </div>
              ) : null}

              {fields.consent.visible ? (
                <div>
                  <label className="flex items-start gap-2 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, consent: e.target.checked }))
                      }
                      className="mt-0.5 accent-[#0d7377]"
                    />
                    <span>
                      {locale === "ar"
                        ? "أوافق على التواصل معي بخصوص العروض"
                        : "I agree to be contacted about offers"}
                    </span>
                  </label>
                  {errors.consent ? (
                    <p className="mt-1 text-xs text-red-500">{errors.consent}</p>
                  ) : null}
                </div>
              ) : null}

              {errors.submit ? (
                <p className="text-xs text-red-500">{errors.submit}</p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-[#0d7377] py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {submitting
                  ? locale === "ar"
                    ? "جاري الإرسال…"
                    : "Sending…"
                  : button}
              </button>

              <p className="text-center text-[10px] text-gray-400">
                {locale === "ar"
                  ? "بياناتك محمية ولن تتم مشاركتها مع أي طرف."
                  : "Your data is protected and will not be shared."}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
