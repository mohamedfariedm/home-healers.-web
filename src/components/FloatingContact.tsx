"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, MessagesSquare, Phone, X } from "lucide-react";
import Link from "next/link";
import { openTawkLiveChat } from "@/lib/tawk";
import { buildWhatsAppUrl, formatWhatsAppNumber } from "@/constants/whatsapp";

interface FloatingContactProps {
  settings?: any;
  locale?: string;
}

const labels = {
  ar: {
    whatsapp: "واتساب",
    phone: "اتصال",
    chat: "محادثة مباشرة",
    contact: "تواصل معنا",
  },
  en: {
    whatsapp: "WhatsApp",
    phone: "Call",
    chat: "Live chat",
    contact: "Contact us",
  },
};

export default function FloatingContact({
  settings,
  locale = "ar",
}: FloatingContactProps) {
  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isArabic = locale === "ar";
  const t = labels[isArabic ? "ar" : "en"];

  const settingsData = settings?.data?.[0]?.setting;
  const businessInfo = settingsData?.business_info || {};

  const whatsappPhone =
    businessInfo.whatsapp || businessInfo.contact || "0118289771";
  const contactPhone = businessInfo.contact || "0118289771";
  const phoneNumber = formatWhatsAppNumber(contactPhone);
  const whatsappUrl = buildWhatsAppUrl(whatsappPhone);

  const sideClass = isArabic ? "right-2 sm:right-4" : "left-2 sm:left-4";
  const labelSide = isArabic
    ? "right-full me-2 sm:me-3"
    : "left-full ms-2 sm:ms-3";

  const btnClass =
    "relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105";
  const iconClass = "h-5 w-5";

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleOpen = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const handleClose = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => () => clearCloseTimer(), []);

  const actions = [
    {
      id: "whatsapp",
      label: t.whatsapp,
      href: whatsappUrl,
      external: true,
      className: "bg-green-500 hover:bg-green-600",
      icon: MessageCircle,
    },
    {
      id: "chat",
      label: t.chat,
      onClick: openTawkLiveChat,
      className: "bg-teal-500 hover:bg-teal-600",
      icon: MessagesSquare,
    },
    {
      id: "phone",
      label: t.phone,
      href: `tel:${phoneNumber}`,
      className: "bg-blue-500 hover:bg-blue-600",
      icon: Phone,
    },
  ];

  return (
    <div
      className={`fixed z-[60] ${sideClass} bottom-4 sm:bottom-6`}
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      {/* Hover bridge: keeps pointer inside the menu while moving to icons */}
      <div className="relative flex flex-col items-center">
        <div
          className={`absolute bottom-full left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 pb-3 sm:gap-3 sm:pb-4 transition-all duration-200 ease-out ${
            open
              ? "pointer-events-auto visible translate-y-0 opacity-100"
              : "pointer-events-none invisible translate-y-1 opacity-0"
          }`}
        >
          {actions.map((action) => (
            <div key={action.id} className="relative shrink-0">
              <span
                className={`pointer-events-none absolute top-1/2 ${labelSide} -translate-y-1/2 whitespace-nowrap rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-md`}
              >
                {action.label}
              </span>

              {action.href ? (
                <Link
                  href={action.href}
                  target={action.external ? "_blank" : undefined}
                  rel={action.external ? "noopener noreferrer" : undefined}
                  aria-label={action.label}
                  className={`${btnClass} ${action.className}`}
                >
                  <action.icon className={iconClass} />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={action.onClick}
                  aria-label={action.label}
                  className={`${btnClass} ${action.className}`}
                >
                  <action.icon className={iconClass} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label={t.contact}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className={`${btnClass} bg-[#143087] hover:bg-[#0f2470]`}
        >
          {open ? (
            <X className={iconClass} />
          ) : (
            <MessagesSquare className={iconClass} />
          )}
        </button>
      </div>
    </div>
  );
}
