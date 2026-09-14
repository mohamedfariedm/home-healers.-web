"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Phone, ArrowLeft, ArrowRight, Headphones } from 'lucide-react';
import type { FaqTranslations } from "@/translations/faq";
import type { ContactInfo } from "@/types/faq";
import { buildWhatsAppUrl, WHATSAPP_DEFAULT_MESSAGE } from "@/constants/whatsapp";
import { useIsMobile } from "@/Hooks/use-mobile";

interface ContactCardProps {
  translations: FaqTranslations;
  locale: string;
  contactInfo?: ContactInfo;
}

const ContactCard: React.FC<ContactCardProps> = ({
  translations,
  locale,
  contactInfo = {
    phone: "966551172232",
    whatsappMessage: {
      ar: WHATSAPP_DEFAULT_MESSAGE,
      en: WHATSAPP_DEFAULT_MESSAGE,
    },
    image: "/assets/images/shared/contact/contact-card.svg"
  }
}) => {
  const isRTL = locale === "ar";
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const simplifyMotion = isMobile || !!prefersReducedMotion;
  const whatsappUrl = buildWhatsAppUrl(contactInfo.phone);
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const buttonVariants = {
    hover: simplifyMotion
      ? {}
      : {
          scale: 1.03,
          backgroundColor: "#1a3ca7",
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 10,
          },
        },
    tap: { scale: 0.97 },
  };

  const cardVariants = {
    initial: { opacity: 0, y: simplifyMotion ? 12 : 24 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: simplifyMotion ? 0.4 : 0.55, delay: 0.1 },
    },
    hover: simplifyMotion
      ? {}
      : {
          scale: 1.02,
          transition: { duration: 0.3 },
        },
  };

  return (
    <motion.div
      className="relative w-full max-w-md mx-auto"
      variants={cardVariants}
      initial="initial"
      whileInView="animate"
      whileHover="hover"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Background Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#f8faff] via-[#e8eaf3] to-[#dde4f0] p-5 shadow-lg sm:p-8">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 h-24 w-24 -translate-y-10 translate-x-10 rounded-full bg-[#62a0f6] opacity-5 sm:h-32 sm:w-32 sm:-translate-y-16 sm:translate-x-16" />
        <div className="absolute bottom-0 left-0 h-20 w-20 -translate-x-8 translate-y-8 rounded-full bg-[#143087] opacity-5 sm:h-24 sm:w-24 sm:-translate-x-12 sm:translate-y-12" />
        
        <div className="relative z-10 flex flex-col items-center space-y-5 text-center sm:space-y-6">
          {/* Support Icon/Image */}
          <div className="relative">
            <motion.div
              className="relative mx-auto h-24 w-24 sm:h-32 sm:w-32"
              animate={
                simplifyMotion
                  ? undefined
                  : {
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1],
                    }
              }
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {contactInfo.image ? (
                <div
                  className="w-full h-full bg-cover bg-center bg-no-repeat rounded-2xl shadow-lg"
                  style={{ backgroundImage: `url(${contactInfo.image})` }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#62a0f6] to-[#4f8ae8] rounded-2xl flex items-center justify-center shadow-lg">
                  <Headphones className="h-12 w-12 text-white sm:h-16 sm:w-16" />
                </div>
              )}
            </motion.div>
            
            {/* Floating Badge */}
            <motion.div
              className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-green-500 shadow-lg sm:h-8 sm:w-8"
              animate={simplifyMotion ? undefined : { scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-3 h-3 bg-white rounded-full" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#1e1e1e] sm:text-2xl">
              {translations.contactTitle}
            </h3>
            <p className="text-[#4a5568] leading-relaxed max-w-sm">
              {translations.contactDescription}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {/* WhatsApp Button */}
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-[#25D366] px-4 py-3 font-semibold text-white shadow-lg transition-colors duration-300 hover:bg-[#20b358] sm:px-6 sm:py-4"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              aria-label={translations.chatWhatsapp}
            >
              <MessageCircle className="w-5 h-5" />
              <span>{translations.chatWhatsapp}</span>
            </motion.a>

            {/* Call Button */}
            <motion.a
              href={`tel:+${contactInfo.phone}`}
              className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-[#143087] px-4 py-3 font-semibold text-white shadow-lg transition-colors duration-300 hover:bg-[#1a3ca7] sm:px-6 sm:py-4"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              aria-label={translations.callNow}
            >
              <Phone className="w-5 h-5" />
              <span>{translations.callNow}</span>
            </motion.a>
          </div>

          {/* Main Contact Button */}
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#143087] to-[#1a3ca7] px-6 py-3 text-base font-bold text-white shadow-xl sm:px-8 sm:py-4 sm:text-lg"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            aria-label={translations.contactButton}
          >
            <span>{translations.contactButton}</span>
            <ArrowIcon className="w-5 h-5" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactCard;
