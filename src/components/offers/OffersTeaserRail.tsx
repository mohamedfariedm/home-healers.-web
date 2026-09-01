"use client";

import { useTranslation } from "react-i18next";
import type { OfferCard as OfferCardType } from "@/types/offers";
import { localePath, OFFERS_WEBSITE_BASE_PATH } from "@/lib/offers";
import OfferCard from "./OfferCard";

type OffersTeaserRailProps = {
  offers: OfferCardType[];
  locale: string;
  serverTime?: string;
};

export default function OffersTeaserRail({
  offers,
  locale,
  serverTime,
}: OffersTeaserRailProps) {
  const { t } = useTranslation("offers");
  if (!offers.length) return null;

  return (
    <section
      aria-labelledby="offers-teaser-heading"
      className="mx-auto mt-16 w-full max-w-[1280px] px-4"
    >
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2
          id="offers-teaser-heading"
          className="text-3xl font-semibold text-gray-900"
        >
          {t("title")}
        </h2>
        <a
          href={localePath(locale, OFFERS_WEBSITE_BASE_PATH)}
          className="text-sm font-semibold text-primary hover:underline"
        >
          {t("viewAll")}
        </a>
      </div>
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-4">
        {offers.slice(0, 8).map((offer, index) => (
          <div
            key={offer.id}
            className="min-w-[78%] snap-start sm:min-w-[60%] md:min-w-0"
          >
            <OfferCard
              offer={offer}
              locale={locale}
              serverTime={serverTime}
              priority={index < 4}
              headingLevel="h3"
              compact
            />
          </div>
        ))}
      </div>
    </section>
  );
}
