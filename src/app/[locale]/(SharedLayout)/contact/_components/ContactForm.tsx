"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRightIcon } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ContactSection({ settings }: { settings?: any }) {
  const { t } = useTranslation("contactUs");
  
  // Extract dynamic content from settings
  const settingsData = settings?.data?.[0]?.setting;
  const businessInfo = settingsData?.business_info || {};

  const contactPhone = businessInfo.contact;
  const businessEmail = businessInfo.email ;
  const businessAddress = businessInfo.address;

  // You can add form state handling here if needed
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your submit logic here (e.g. API call)
    alert(t("successMessage"));
  };

  return (
    <motion.div
      className="mx-auto mt-12 flex w-full max-w-[1280px] flex-col items-start gap-10 px-4 lg:mt-16 lg:flex-row lg:gap-14 xl:px-0"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Form Container */}
      <motion.div
        className="flex w-full flex-col items-center gap-8 rounded-3xl border border-[#d7e4f8] bg-white p-5 shadow-[0_16px_40px_rgba(20,48,135,0.06)] md:p-10 lg:p-12"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1e1e1e] mb-2">{t("formSection.title")}</h2>
          <p className="text-sm text-[#736b7a]">{t("formSection.subtitle")}</p>
        </div>

        <form className="w-full max-w-[590px] space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="name" className="block text-start text-sm font-medium text-[#1e1e1e]">{t("formSection.name")}</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#d7e4f8] bg-white px-4 py-3 text-start text-sm transition focus:border-[#62a0f6] focus:outline-none focus:ring-2 focus:ring-[#62a0f6]/30"
              placeholder={t("formSection.namePlaceholder")}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-start text-sm font-medium text-[#1e1e1e]">{t("formSection.emailLabel")}</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#d7e4f8] bg-white px-4 py-3 text-start text-sm transition focus:border-[#62a0f6] focus:outline-none focus:ring-2 focus:ring-[#62a0f6]/30"
              placeholder={t("formSection.emailPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-start text-sm font-medium text-[#1e1e1e]">{t("formSection.phoneLabel")}</label>
            <div className="flex items-center overflow-hidden rounded-xl border border-[#d7e4f8]">
              <div className="bg-[#e8eaf3]/50 px-3 py-2 flex items-center gap-2">
                <img src="/assets/images/shared/contact/sa-flag.png" className="w-6 h-6" alt="flag" />
                <span className="text-sm font-medium">+966</span>
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="bg-white flex-1 px-4 py-3 text-sm text-start"
                placeholder={t("formSection.phonePlaceholder")}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-start text-sm font-medium text-[#1e1e1e]">{t("formSection.messageLabel")}</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="h-40 w-full rounded-xl border border-[#d7e4f8] bg-white px-4 py-3 text-start text-sm transition focus:border-[#62a0f6] focus:outline-none focus:ring-2 focus:ring-[#62a0f6]/30"
              placeholder={t("formSection.messagePlaceholder")}
              required
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#143087] py-3.5 text-white shadow-[0_12px_28px_rgba(20,48,135,0.22)] transition duration-300 hover:bg-[#0f2d6a] hover:scale-[1.02]"
          >
            
            <span className="text-lg font-medium">{t("formSection.submitButton")}</span>
            <ArrowLeft className="w-6 h-6" />
          </button>
        </form>
      </motion.div>

      {/* Contact Info */}
      <motion.div
        className="flex flex-col gap-8 w-full lg:max-w-[538px]"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        {[
          {
            icon: "/assets/images/shared/contact/contact-icon-address.svg",
            title: t("contactInfo.visitUs"),
            description: businessAddress,
          },
          {
            icon: "/assets/images/shared/contact/contact-icon-email.svg",
            title: t("contactInfo.sendEmail"),
            description: businessEmail,
          },
          {
            icon: "/assets/images/shared/contact/contact-icon-phone.svg",
            title: t("contactInfo.callUs"),
            description: contactPhone,
          },
        ].map(({ icon, title, description }, i) => (
          <motion.div
    key={i}
    className="flex cursor-pointer flex-col gap-2 rounded-2xl bg-[#143087] p-6 text-white shadow-[0_12px_28px_rgba(20,48,135,0.16)] sm:p-8"
    whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(98, 160, 246, 0.5)" }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <div className="flex gap-4 items-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#62a0f6]">
        <img src={icon} alt={`${title} icon`} className="w-5 h-5" />
      </div>
      <div className="flex flex-col items-start text-start gap-2">
        <span className="text-lg lg:text-2xl font-semibold">{title}</span>
        <span className="text-sm lg:text-base">{description}</span>
      </div>
    </div>
  </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
