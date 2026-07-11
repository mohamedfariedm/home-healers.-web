"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Phone, ArrowLeft, ArrowRight, Headphones } from 'lucide-react';
import type { FaqTranslations } from "@/translations/faq";
import type { ContactInfo } from "@/types/faq";
import { buildWhatsAppUrl, WHATSAPP_DEFAULT_MESSAGE } from "@/constants/whatsapp";

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
  const whatsappUrl = buildWhatsAppUrl(contactInfo.phone);
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const buttonVariants = {
    hover: {
      scale: 1.05,
      backgroundColor: "#1a3ca7",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, delay: 0.3 }
    },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.3 }
    }
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
      <div className="bg-gradient-to-br from-[#f8faff] via-[#e8eaf3] to-[#dde4f0] rounded-3xl p-8 shadow-lg relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#62a0f6] opacity-5 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#143087] opacity-5 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          {/* Support Icon/Image */}
          <div className="relative">
            <motion.div
              className="w-32 h-32 mx-auto relative"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              {contactInfo.image ? (
                <div
                  className="w-full h-full bg-cover bg-center bg-no-repeat rounded-2xl shadow-lg"
                  style={{ backgroundImage: `url(${contactInfo.image})` }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#62a0f6] to-[#4f8ae8] rounded-2xl flex items-center justify-center shadow-lg">
                  <Headphones className="w-16 h-16 text-white" />
                </div>
              )}
            </motion.div>
            
            {/* Floating Badge */}
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-3 h-3 bg-white rounded-full" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#1e1e1e]">
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
              className="flex-1 bg-[#25D366] hover:bg-[#20b358] text-white flex items-center justify-center gap-3 rounded-xl px-6 py-4 font-semibold transition-colors duration-300 shadow-lg"
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
              className="flex-1 bg-[#143087] hover:bg-[#1a3ca7] text-white flex items-center justify-center gap-3 rounded-xl px-6 py-4 font-semibold transition-colors duration-300 shadow-lg"
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
            className="w-full bg-gradient-to-r from-[#143087] to-[#1a3ca7] text-white flex items-center justify-center gap-3 rounded-xl px-8 py-4 font-bold text-lg shadow-xl"
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
