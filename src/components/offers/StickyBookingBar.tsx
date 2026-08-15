"use client";

import { useTranslation } from "react-i18next";
import { formatOfferPrice } from "@/lib/offers";
import { cn } from "@/lib/utils";

type StickyBookingBarProps = {
  name: string;
  price: string | number;
  currency?: string | null;
  locale: string;
  href: string;
  ended?: boolean;
};

export default function StickyBookingBar({
  name,
  price,
  currency,
  locale,
  href,
  ended = false,
}: StickyBookingBarProps) {
  const { t } = useTranslation("offers");

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(16,24,40,0.08)] backdrop-blur lg:hidden",
      )}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#1e1e1e]">{name}</p>
          <p className="text-sm font-bold text-[#143087]">
            {formatOfferPrice(price, currency, locale)}
          </p>
        </div>
        {ended ? (
          <span className="shrink-0 rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-[#4a5568]">
            {t("ended")}
          </span>
        ) : (
          <a
            href={href}
            className="shrink-0 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
          >
            {t("bookNow")}
          </a>
        )}
      </div>
    </div>
  );
}
