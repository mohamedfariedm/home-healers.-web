"use client";

import { MessageCircle, MessagesSquare, Phone } from "lucide-react";
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
  const rowClass = isArabic ? "flex-row" : "flex-row-reverse";

  const btnClass =
    "flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full text-white shadow-md sm:shadow-lg transition-transform hover:scale-110";
  const iconClass = "h-4 w-4 sm:h-5 sm:w-5";
  const labelClass =
    "rounded-md sm:rounded-lg bg-white px-1.5 py-0.5 text-[10px] sm:px-2.5 sm:py-1 sm:text-xs font-medium text-gray-700 shadow-sm sm:shadow-md";

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
      className={`fixed z-[60] flex flex-col items-center gap-1.5 sm:gap-3 ${sideClass} bottom-4 sm:bottom-6`}
    >
      {actions.map((action) => (
        <div key={action.id} className={`flex items-center gap-1.5 sm:gap-2 ${rowClass}`}>
          <span className={labelClass}>{action.label}</span>

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
  );
}
