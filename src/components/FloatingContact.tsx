"use client";

import { Phone, MessageCircle } from "lucide-react";
import Link from "next/link";

interface FloatingContactProps {
  settings?: any;
  locale?: string;
}

const whatsappMessage = {
  ar: "مرحبا، لدي استفسار",
  en: "Hello, I have a question",
};

// Helper function to format phone number for WhatsApp (remove leading 0 and add country code)
const formatWhatsAppNumber = (phone: string) => {
  if (!phone) return "";
  const cleaned = phone.replace(/^0+/, ""); // Remove leading zeros
  return `966${cleaned}`; // Add Saudi Arabia country code
};

export default function FloatingContact({
  settings,
  locale = "ar",
}: FloatingContactProps) {
  const isArabic = locale === "ar";

  // Extract business info from settings
  const settingsData = settings?.data?.[0]?.setting;
  const businessInfo = settingsData?.business_info || {};

  // Get phone numbers with fallbacks
  const contactPhone = businessInfo.contact || "0118289771";
  const whatsappPhone = businessInfo.whatsapp || "0118289771";

  // Format phone numbers
  const phoneNumber = formatWhatsAppNumber(contactPhone);
  const whatsappNumber = formatWhatsAppNumber(whatsappPhone);

  const message = whatsappMessage[isArabic ? "ar" : "en"];
  const encodedMsg = encodeURIComponent(message);

  return (
    <div
      className={`fixed z-50 flex flex-col gap-3 ${
        isArabic ? "right-4" : "left-4"
      } bottom-6`}
    >
      {/* ✅ WhatsApp Floating Button */}
      <Link
        href={`https://wa.me/${whatsappNumber}?text=${encodedMsg}`}
        target="_blank"
        aria-label="Chat on WhatsApp"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-green-600"
      >
        <MessageCircle className="h-7 w-7" />
      </Link>

      {/* ✅ Phone Floating Button */}
      <Link
        href={`tel:${phoneNumber}`}
        aria-label="Call us"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-blue-600"
      >
        <Phone className="h-7 w-7" />
      </Link>
    </div>
  );
}
