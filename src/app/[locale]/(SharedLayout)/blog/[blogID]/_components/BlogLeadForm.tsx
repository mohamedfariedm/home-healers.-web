"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ClientAPI from "@/app/api/api";
import { isClientApiError } from "@/lib/client-api-error";

type Locale = "ar" | "en";

interface BlogLeadFormProps {
  locale: Locale;
  blogTitle?: string;
}

function normalizeSaudiPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("966")) digits = digits.slice(3);
  if (!digits.startsWith("0")) digits = `0${digits}`;
  return digits;
}

function isValidSaudiMobile(phone: string): boolean {
  return /^05\d{8}$/.test(phone);
}

export default function BlogLeadForm({ locale, blogTitle }: BlogLeadFormProps) {
  const { t } = useTranslation("blog");
  const isRTL = locale === "ar";

  const [formData, setFormData] = useState({
    name: "",
    mobile_phone: "",
    notes: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const notesFallback = useMemo(() => {
    if (blogTitle) {
      return locale === "ar"
        ? `طلب من المقال: ${blogTitle}`
        : `Lead from website: ${blogTitle}`;
    }
    return locale === "ar" ? "طلب من الموقع" : "Lead from website";
  }, [blogTitle, locale]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: "" });
    }
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = t("leadForm.required");
    }
    const phone = normalizeSaudiPhone(formData.mobile_phone);
    if (!formData.mobile_phone.trim()) {
      errors.mobile_phone = t("leadForm.required");
    } else if (!isValidSaudiMobile(phone)) {
      errors.mobile_phone = t("leadForm.invalidPhone");
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      await ClientAPI.submitCustomerSupport(
        {
          name: formData.name.trim(),
          mobile_phone: normalizeSaudiPhone(formData.mobile_phone),
          notes: formData.notes.trim() || notesFallback,
          type: "seo",
        },
        locale,
      );

      setSubmitStatus({
        type: "success",
        message: t("leadForm.success"),
      });
      setFormData({ name: "", mobile_phone: "", notes: "" });
      setFieldErrors({});
    } catch (error) {
      const apiErrors =
        isClientApiError(error) && error.errors
          ? Object.fromEntries(
              Object.entries(error.errors).map(([key, messages]) => [
                key,
                messages[0] || t("leadForm.error"),
              ]),
            )
          : {};

      if (Object.keys(apiErrors).length > 0) {
        setFieldErrors(apiErrors);
      }

      setSubmitStatus({
        type: "error",
        message:
          (isClientApiError(error) && error.message) || t("leadForm.error"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "bg-white w-full border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-sm text-start placeholder:text-[#98a2b3] focus:outline-none focus:border-[#143087] focus:ring-2 focus:ring-[#143087]/10 transition";

  return (
    <section
      className="w-full max-w-screen-xl mx-auto px-4 xl:px-0 mt-16 mb-20"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-[420px] mx-auto bg-white rounded-2xl border border-[#d0d5dd] shadow-[0_8px_30px_rgba(20,48,135,0.08)] overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#143087] to-[#62a0f6]" />

        <div className="p-6 md:p-7">
          <h2 className="text-xl font-semibold text-[#1e1e1e] text-center">
            {t("leadForm.title")}{" "}
            <span className="text-[#62a0f6]">{t("leadForm.highlight")}</span>
          </h2>
          <p className="text-sm text-[#736b7a] text-center mt-1.5 mb-6">
            {t("leadForm.subtitle")}
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="blog-lead-name"
                className="text-sm font-medium text-[#1e1e1e]"
              >
                {t("leadForm.name")}
              </label>
              <input
                id="blog-lead-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`${inputClass} ${fieldErrors.name ? "border-red-400" : ""}`}
                placeholder={t("leadForm.namePlaceholder")}
                autoComplete="name"
              />
              {fieldErrors.name && (
                <p className="text-xs text-red-500">{fieldErrors.name}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="blog-lead-phone"
                className="text-sm font-medium text-[#1e1e1e]"
              >
                {t("leadForm.phone")}
              </label>
              <div
                className={`flex items-center border rounded-lg overflow-hidden focus-within:border-[#143087] focus-within:ring-2 focus-within:ring-[#143087]/10 ${
                  fieldErrors.mobile_phone
                    ? "border-red-400"
                    : "border-[#d0d5dd]"
                }`}
              >
                <div className="bg-[#f2f4f8] px-3 py-2.5 flex items-center gap-1.5 shrink-0 border-e border-[#d0d5dd]">
                  <img
                    src="/assets/images/shared/contact/sa-flag.png"
                    className="w-5 h-5"
                    alt=""
                  />
                  <span className="text-xs font-medium text-[#1e1e1e]">
                    +966
                  </span>
                </div>
                <input
                  id="blog-lead-phone"
                  name="mobile_phone"
                  type="tel"
                  inputMode="tel"
                  value={formData.mobile_phone}
                  onChange={handleChange}
                  className="bg-white flex-1 min-w-0 px-3.5 py-2.5 text-sm text-start placeholder:text-[#98a2b3] focus:outline-none"
                  placeholder={t("leadForm.phonePlaceholder")}
                  autoComplete="tel"
                />
              </div>
              {fieldErrors.mobile_phone && (
                <p className="text-xs text-red-500">
                  {fieldErrors.mobile_phone}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="blog-lead-notes"
                className="text-sm font-medium text-[#1e1e1e]"
              >
                {t("leadForm.notes")}
              </label>
              <textarea
                id="blog-lead-notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder={t("leadForm.notesPlaceholder")}
              />
            </div>

            {submitStatus.type && (
              <p
                className={`text-sm text-center ${
                  submitStatus.type === "success"
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {submitStatus.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 w-full bg-[#143087] hover:bg-[#0f2d6a] text-white py-2.5 rounded-lg text-sm font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? t("leadForm.submitting") : t("leadForm.submit")}
              {!isSubmitting && <ArrowIcon className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
