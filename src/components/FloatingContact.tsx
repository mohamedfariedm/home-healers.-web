"use client";

import { Phone, MessageCircle } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const contactInfo = {
  phone: "966551172232",
  whatsappMessage: {
    ar: "مرحبا، لدي استفسار",
    en: "Hello, I have a question",
  },
};

export default function FloatingContact() {
  const { locale } = useParams();
  const isArabic = locale === "ar";

  const phoneNumber = contactInfo.phone;
  const whatsappNumber = contactInfo.phone; // same number used for WhatsApp
  const message = contactInfo.whatsappMessage[isArabic ? "ar" : "en"];
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
