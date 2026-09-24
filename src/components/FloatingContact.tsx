"use client";

import { MessagesSquare, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
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
  },
  en: {
    whatsapp: "WhatsApp",
    phone: "Call",
    chat: "Live chat",
  },
};

export default function FloatingContact({
  settings,
  locale = "ar",
}: FloatingContactProps) {
  const isArabic = locale === "ar" || locale.startsWith("ar");
  const t = labels[isArabic ? "ar" : "en"];

  const settingsData = settings?.data?.[0]?.setting;
  const businessInfo = settingsData?.business_info || {};

  const whatsappPhone =
    businessInfo.whatsapp || businessInfo.contact || "0118289771";
  const contactPhone = businessInfo.contact || "0118289771";
  const phoneNumber = formatWhatsAppNumber(contactPhone);
  const whatsappUrl = buildWhatsAppUrl(whatsappPhone);

  const btnClass =
    "relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105";
  const iconClass = "h-5 w-5";

  const actions = [
    {
      id: "whatsapp",
      label: t.whatsapp,
      href: whatsappUrl,
      external: true,
      className: "bg-[#25D366] hover:bg-[#1ebe5d]",
      icon: <FaWhatsapp className="h-6 w-6" aria-hidden />,
    },
    {
      id: "chat",
      label: t.chat,
      onClick: openTawkLiveChat,
      className: "bg-teal-500 hover:bg-teal-600",
      icon: <MessagesSquare className={iconClass} aria-hidden />,
    },
    {
      id: "phone",
      label: t.phone,
      href: `tel:${phoneNumber}`,
      className: "bg-blue-500 hover:bg-blue-600",
      icon: <Phone className={iconClass} aria-hidden />,
    },
  ];

  return (
    <div className="fixed end-2 bottom-[10%] z-[60] flex flex-col items-center gap-2 sm:end-4 sm:gap-3">
      {actions.map((action) => (
        <div key={action.id} className="group/action relative shrink-0">
          <span
            className="pointer-events-none absolute top-1/2 end-full me-2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-gray-700 opacity-0 shadow-md transition-opacity duration-200 group-hover/action:opacity-100 group-focus-within/action:opacity-100 sm:me-3"
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
              {action.icon}
            </Link>
          ) : (
            <button
              type="button"
              onClick={action.onClick}
              aria-label={action.label}
              className={`${btnClass} ${action.className}`}
            >
              {action.icon}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
