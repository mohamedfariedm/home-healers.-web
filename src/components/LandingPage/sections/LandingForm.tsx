"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import ClientAPI from "@/app/api/api";

interface LandingFormProps {
  section: any;
  locale: string;
  settings?: any;
}

export default function LandingForm({ section, locale, settings }: LandingFormProps) {
  const ref = useRef(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const title = section.title?.[locale] || "";
  const content = section.content?.[locale] || "";
  const formFields = section.form_fields || [];
  const submitText = section.form_submit_text?.[locale] || "Submit";
  const successMessage =
    section.form_success_message?.[locale] || "Thank you! Your message has been sent successfully.";
  const apiEndpoint = section.form_api_endpoint || "/api/contact-form";

  // Extract contact info from settings if available
  const settingsData = settings?.data?.[0]?.setting;
  const businessInfo = settingsData?.business_info || {};
  const contactPhone = businessInfo.contact;
  const businessEmail = businessInfo.email;
  const businessAddress = businessInfo.address;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Use the API endpoint from section config or default
      const response = await ClientAPI.getContactMessage(formData, locale);

      if (response) {
        setSubmitStatus({
          type: "success",
          message: successMessage,
        });
        // Reset form
        setFormData({});
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus({
        type: "error",
        message:
          locale === "ar"
            ? "حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى."
            : "An error occurred while submitting the form. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: any) => {
    const fieldId = field.id;
    const label = field.label?.[locale] || fieldId;
    const placeholder = field.placeholder?.[locale] || "";
    const isRequired = field.required || false;
    const fieldType = field.type || "text";
    const isPhoneField = fieldType === "tel" || fieldId.toLowerCase().includes("phone");

    if (fieldType === "textarea") {
      return (
        <div key={fieldId} className="space-y-2">
          <label
            htmlFor={fieldId}
            className="block text-start text-sm font-medium text-[#1e1e1e]"
          >
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            id={fieldId}
            name={fieldId}
            value={formData[fieldId] || ""}
            onChange={handleChange}
            className="w-full bg-white border border-[#d0d5dd] rounded-md px-4 py-3 text-sm text-start h-40"
            placeholder={placeholder}
            required={isRequired}
          />
        </div>
      );
    }

    // Special handling for phone fields
    if (isPhoneField) {
      return (
        <div key={fieldId} className="space-y-2">
          <label
            htmlFor={fieldId}
            className="block text-start text-sm font-medium text-[#1e1e1e]"
          >
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="flex items-center border border-[#d0d5dd] rounded-md overflow-hidden">
            <div className="bg-[#e8eaf3]/50 px-3 py-2 flex items-center gap-2">
              <img 
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/SUr7AzvBDd.png" 
                className="w-6 h-6" 
                alt="flag" 
              />
              <span className="text-sm font-medium">+966</span>
            </div>
            <input
              id={fieldId}
              name={fieldId}
              type="tel"
              value={formData[fieldId] || ""}
              onChange={handleChange}
              className="bg-white flex-1 px-4 py-3 text-sm text-start"
              placeholder={placeholder}
              required={isRequired}
            />
          </div>
        </div>
      );
    }

    return (
      <div key={fieldId} className="space-y-2">
        <label
          htmlFor={fieldId}
          className="block text-start text-sm font-medium text-[#1e1e1e]"
        >
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          id={fieldId}
          name={fieldId}
          type={fieldType}
          value={formData[fieldId] || ""}
          onChange={handleChange}
          className="bg-white w-full border border-[#d0d5dd] rounded-md px-4 py-3 text-sm text-start"
          placeholder={placeholder}
          required={isRequired}
        />
      </div>
    );
  };

  // Check if we should show contact info (if we have business info)
  const showContactInfo = businessAddress || businessEmail || contactPhone;

  return (
    <section
      ref={ref}
      className="w-full max-w-[1280px] mx-auto py-16 px-4 xl:px-0"
    >
      <motion.div
        className="flex flex-col lg:flex-row gap-14 items-start w-full"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Form Container */}
        <motion.div
          className="flex flex-col items-center gap-10 bg-white rounded-xl border border-[#d0d5dd] p-6 md:p-12 w-full"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {(title || content) && (
            <div className="text-center w-full">
              {title && (
                <h2 className="text-2xl font-bold text-[#1e1e1e] mb-2">
                  {title}
                </h2>
              )}
              {content && (
                <p className="text-sm text-[#736b7a]">{content}</p>
              )}
            </div>
          )}

          <form
            className="w-full max-w-[590px] space-y-6"
            onSubmit={handleSubmit}
          >
            {formFields.map(renderField)}

            {submitStatus.type && (
              <div
                className={`p-4 rounded-md ${
                  submitStatus.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#143087] hover:scale-105 text-white py-3 rounded-md flex justify-center items-center gap-2 hover:bg-[#0f2d6a] transition-colors duration-1000 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-lg font-medium">
                {isSubmitting
                  ? locale === "ar"
                    ? "جاري الإرسال..."
                    : "Submitting..."
                  : submitText}
              </span>
              {!isSubmitting && <ArrowLeft className="w-6 h-6" />}
            </button>
          </form>
        </motion.div>

        {/* Contact Info - Only show if we have business info */}
        {showContactInfo && (
          <motion.div
            className="flex flex-col gap-8 w-full lg:max-w-[538px]"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {[
              businessAddress && {
                icon: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/fxFV5KXUD4.png",
                title: locale === "ar" ? "زيارتنا" : "Visit Us",
                description: businessAddress,
              },
              businessEmail && {
                icon: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/RKCBiHeaWM.png",
                title: locale === "ar" ? "أرسل لنا بريد إلكتروني" : "Send Us Email",
                description: businessEmail,
              },
              contactPhone && {
                icon: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/pyxgUkH7d4.png",
                title: locale === "ar" ? "اتصل بنا" : "Call Us",
                description: contactPhone,
              },
            ]
              .filter(Boolean)
              .map(({ icon, title, description }: any, i: number) => (
                <motion.div
                  key={i}
                  className="flex flex-col gap-2 bg-[#143087] rounded-xl p-8 text-white cursor-pointer"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 8px 20px rgba(98, 160, 246, 0.5)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-[#62a0f6] rounded-md flex items-center justify-center">
                      <img
                        src={icon}
                        alt={`${title} icon`}
                        className="w-5 h-5"
                      />
                    </div>
                    <div className="flex flex-col items-start text-start gap-2">
                      <span className="text-lg lg:text-2xl font-semibold">
                        {title}
                      </span>
                      <span className="text-sm lg:text-base">{description}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
