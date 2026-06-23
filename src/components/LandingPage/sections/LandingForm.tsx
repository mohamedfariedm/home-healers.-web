"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import ClientAPI from "@/app/api/api";

interface LandingFormProps {
  section: any;
  locale: string;
  settings?: any;
}

// Helper function to extract image URL from various data structures
const getImageUrl = (section: any): string | null => {
  // Try section.image first (direct string)
  if (section.image) {
    if (typeof section.image === "string" && section.image.trim() !== "") {
      return section.image.trim();
    }
  }
  
  // Try section.attachment.original
  if (section.attachment) {
    if (typeof section.attachment === "object" && section.attachment !== null) {
      if (section.attachment.original && typeof section.attachment.original === "string" && section.attachment.original.trim() !== "") {
        return section.attachment.original.trim();
      }
    }
  }
  
  return null;
};

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
  const image = getImageUrl(section);

  // Check if the API endpoint is actually a WhatsApp link
  const isWhatsAppLink = apiEndpoint && (
    apiEndpoint.includes("wa.me") || 
    apiEndpoint.includes("api.whatsapp.com") ||
    apiEndpoint.includes("whatsapp.com")
  );
  
  // Extract WhatsApp link or use alternative fields
  const whatsappLink = isWhatsAppLink 
    ? apiEndpoint 
    : (section.form_whatsapp_link || section.form_action_link || "");

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

    // If WhatsApp link is provided, redirect to WhatsApp instead of API
    if (whatsappLink) {
      try {
        // Format form data as a message
        const messageParts: string[] = [];
        
        formFields.forEach((field: any) => {
          const fieldId = field.id;
          const label = field.label?.[locale] || fieldId;
          const value = formData[fieldId];
          
          if (value && value.trim() !== "") {
            messageParts.push(`*${label}:* ${value}`);
          }
        });

        const message = messageParts.join("\n\n");
        
        // Encode the message for URL
        const encodedMessage = encodeURIComponent(message);
        
        // Format WhatsApp link (support multiple formats)
        let whatsappUrl = "";
        
        if (whatsappLink.includes("wa.me")) {
          // Format: https://wa.me/966118289771
          whatsappUrl = `${whatsappLink}${whatsappLink.includes("?") ? "&" : "?"}text=${encodedMessage}`;
        } else if (whatsappLink.includes("api.whatsapp.com")) {
          // Format: https://api.whatsapp.com/send/?phone=966118289771
          // Check if it already has query parameters
          const separator = whatsappLink.includes("?") ? "&" : "?";
          whatsappUrl = `${whatsappLink}${separator}text=${encodedMessage}`;
        } else if (whatsappLink.includes("whatsapp.com")) {
          // Generic WhatsApp URL
          whatsappUrl = `${whatsappLink}${whatsappLink.includes("?") ? "&" : "?"}text=${encodedMessage}`;
        } else {
          // If it's just a phone number, format it properly
          const phoneNumber = whatsappLink.replace(/[^\d]/g, ""); // Remove non-digits
          whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        }

        // Open WhatsApp in a new tab/window
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        
        // Show success message
        setSubmitStatus({
          type: "success",
          message: successMessage || (locale === "ar" 
            ? "سيتم فتح واتساب لإرسال الرسالة" 
            : "Opening WhatsApp to send your message..."),
        });
        
        // Reset form after a short delay
        setTimeout(() => {
          setFormData({});
        }, 1000);
        
      } catch (error) {
        console.error("WhatsApp redirect error:", error);
        setSubmitStatus({
          type: "error",
          message:
            locale === "ar"
              ? "حدث خطأ أثناء فتح واتساب. يرجى المحاولة مرة أخرى."
              : "An error occurred while opening WhatsApp. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Fallback to API endpoint if no WhatsApp link
      try {
        const response = await ClientAPI.getContactMessage(formData, locale);

        if (response) {
          setSubmitStatus({
            type: "success",
            message: successMessage,
          });
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
    }
  };

  const renderField = (field: any, index: number) => {
    const fieldId = field.id;
    const label = field.label?.[locale] || fieldId;
    const placeholder = field.placeholder?.[locale] || "";
    const isRequired = field.required || false;
    const fieldType = field.type || "text";
    const isPhoneField = fieldType === "tel" || fieldId.toLowerCase().includes("phone");

    if (fieldType === "textarea") {
      return (
        <motion.div
          key={fieldId}
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <label
            htmlFor={fieldId}
            className="block text-start text-sm font-semibold text-[#1e1e1e] mb-2"
          >
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            id={fieldId}
            name={fieldId}
            value={formData[fieldId] || ""}
            onChange={handleChange}
            className="w-full bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl px-5 py-4 text-sm text-start h-40 transition-all duration-300 focus:border-[#143087] focus:ring-4 focus:ring-[#143087]/10 focus:outline-none focus:shadow-lg placeholder:text-gray-400 resize-none"
            placeholder={placeholder}
            required={isRequired}
          />
        </motion.div>
      );
    }

    // Special handling for phone fields
    if (isPhoneField) {
      return (
        <motion.div
          key={fieldId}
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <label
            htmlFor={fieldId}
            className="block text-start text-sm font-semibold text-[#1e1e1e] mb-2"
          >
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-white transition-all duration-300 focus-within:border-[#143087] focus-within:ring-4 focus-within:ring-[#143087]/10 focus-within:shadow-lg">
            <div className="bg-gradient-to-br from-[#143087] to-[#0f245f] px-4 py-3 flex items-center gap-2 shadow-md">
              <img 
                src="/assets/images/shared/contact/sa-flag.png" 
                className="w-6 h-6" 
                alt="flag" 
              />
              <span className="text-sm font-semibold text-white">+966</span>
            </div>
            <input
              id={fieldId}
              name={fieldId}
              type="tel"
              value={formData[fieldId] || ""}
              onChange={handleChange}
              className="bg-transparent flex-1 px-5 py-4 text-sm text-start focus:outline-none placeholder:text-gray-400"
              placeholder={placeholder}
              required={isRequired}
            />
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={fieldId}
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <label
          htmlFor={fieldId}
          className="block text-start text-sm font-semibold text-[#1e1e1e] mb-2"
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
          className="bg-gradient-to-br from-gray-50 to-white w-full border-2 border-gray-200 rounded-xl px-5 py-4 text-sm text-start transition-all duration-300 focus:border-[#143087] focus:ring-4 focus:ring-[#143087]/10 focus:outline-none focus:shadow-lg placeholder:text-gray-400"
          placeholder={placeholder}
          required={isRequired}
        />
      </motion.div>
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
        {/* Form Container with Image Inside */}
        <motion.div
          className={`flex flex-col ${image ? "lg:flex-row" : ""} gap-8 bg-gradient-to-br from-white via-gray-50/50 to-white rounded-3xl border-2 border-gray-200/50 shadow-2xl backdrop-blur-sm p-6 md:p-12 relative overflow-hidden ${
            showContactInfo && !image ? "lg:w-1/2" : "w-full"
          }`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#143087]/5 to-transparent rounded-full blur-3xl -z-0" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#62a0f6]/5 to-transparent rounded-full blur-3xl -z-0" />
          
          {/* Image Section - Inside the form container */}
          {image && (
            <motion.div
              className="w-full lg:w-2/5 flex-shrink-0 relative z-10"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative w-full h-[400px] lg:h-full min-h-[500px] rounded-2xl overflow-hidden shadow-xl group">
                {/* Beautiful gradient overlay with animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#143087]/20 via-[#62a0f6]/10 to-transparent z-10 group-hover:from-[#143087]/30 transition-all duration-500" />
                
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-5 z-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_50%)] animate-pulse" />
                </div>
                
                {/* Image */}
                <Image
                  src={image}
                  alt={title || "Contact form image"}
                  fill
                  className="object-cover rounded-2xl transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  unoptimized={image.startsWith("http")}
                  onError={(e) => {
                    console.error("❌ Form image failed to load:", image);
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
                
                {/* Beautiful decorative elements */}
                <div className="absolute inset-0 border-2 border-white/30 rounded-2xl pointer-events-none z-20" />
                <div className="absolute top-4 right-4 w-20 h-20 bg-white/20 rounded-full blur-xl z-20" />
                <div className="absolute bottom-4 left-4 w-32 h-32 bg-[#62a0f6]/20 rounded-full blur-2xl z-20" />
              </div>
            </motion.div>
          )}

          {/* Form Content Section */}
          <div className={`flex flex-col items-center gap-10 relative z-10 ${
            image ? "lg:w-3/5" : "w-full"
          }`}>
            {(title || content) && (
              <motion.div
                className="text-center w-full"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {title && (
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#1e1e1e] to-[#143087] bg-clip-text text-transparent mb-3">
                    {title}
                  </h2>
                )}
                {content && (
                  <p className="text-base text-gray-600 leading-relaxed">{content}</p>
                )}
              </motion.div>
            )}

            <form
              className="w-full max-w-[590px] space-y-6"
              onSubmit={handleSubmit}
            >
              {formFields.map((field: any, index: number) => renderField(field, index))}

              {submitStatus.type && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-5 rounded-xl border-2 shadow-lg ${
                    submitStatus.type === "success"
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-300"
                      : "bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      submitStatus.type === "success" ? "bg-green-500" : "bg-red-500"
                    } animate-pulse`} />
                    <span className="font-medium">{submitStatus.message}</span>
                  </div>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-[#143087] to-[#0f245f] hover:from-[#0f245f] hover:to-[#143087] text-white py-4 rounded-xl flex justify-center items-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {isSubmitting
                    ? locale === "ar"
                      ? whatsappLink ? "جاري فتح واتساب..." : "جاري الإرسال..."
                      : whatsappLink ? "Opening WhatsApp..." : "Submitting..."
                    : submitText}
                  {!isSubmitting && <ArrowLeft className="w-6 h-6 group-hover:translate-x-1 transition-transform" />}
                </span>
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Contact Info - Only show if we have business info */}
        {showContactInfo && (
          <motion.div
            className={`flex flex-col gap-8 w-full ${
              image ? "lg:w-2/5 lg:max-w-[538px]" : "lg:w-1/2 lg:max-w-[538px]"
            }`}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {[
              businessAddress && {
                icon: "/assets/images/shared/contact/contact-icon-address.svg",
                title: locale === "ar" ? "زيارتنا" : "Visit Us",
                description: businessAddress,
              },
              businessEmail && {
                icon: "/assets/images/shared/contact/contact-icon-email.svg",
                title: locale === "ar" ? "أرسل لنا بريد إلكتروني" : "Send Us Email",
                description: businessEmail,
              },
              contactPhone && {
                icon: "/assets/images/shared/contact/contact-icon-phone.svg",
                title: locale === "ar" ? "اتصل بنا" : "Call Us",
                description: contactPhone,
              },
            ]
              .filter(Boolean)
              .map(({ icon, title, description }: any, i: number) => (
                <motion.div
                  key={i}
                  className="flex gap-4 items-center bg-gradient-to-br from-[#143087] via-[#1a3fa0] to-[#0f245f] rounded-2xl p-6 lg:p-8 text-white cursor-pointer shadow-xl hover:shadow-2xl relative overflow-hidden group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 12px 30px rgba(20, 48, 135, 0.4)",
                  }}
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#62a0f6]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Icon container with glow effect */}
                  <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-[#62a0f6] to-[#4a8ae8] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={icon}
                      alt={`${title} icon`}
                      className="w-7 h-7 filter brightness-0 invert"
                    />
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-[#62a0f6] rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  </div>
                  
                  <div className="flex flex-col items-start text-start gap-1 relative z-10">
                    <span className="text-lg lg:text-2xl font-bold">
                      {title}
                    </span>
                    <span className="text-sm lg:text-base text-blue-100">{description}</span>
                  </div>
                  
                  {/* Decorative corner element */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-full" />
                </motion.div>
              ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
