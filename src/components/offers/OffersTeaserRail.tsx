"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
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
  const [activeDot, setActiveDot] = useState(0);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  if (!offers.length) return null;

  const items = offers.slice(0, 8);

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

      <div className="md:hidden">
        <Swiper
          key={locale}
          dir={locale === "ar" ? "rtl" : "ltr"}
          spaceBetween={16}
          slidesPerView={1.15}
          onSwiper={setSwiper}
          onSlideChange={(instance) => setActiveDot(instance.realIndex)}
          breakpoints={{
            480: { slidesPerView: 1.25, spaceBetween: 16 },
            640: { slidesPerView: 1.6, spaceBetween: 18 },
          }}
          className="offers-teaser-swiper !overflow-visible"
        >
          {items.map((offer, index) => (
            <SwiperSlide key={offer.id} className="!h-auto">
              <div className="h-full pb-2 pt-3">
                <OfferCard
                  offer={offer}
                  locale={locale}
                  serverTime={serverTime}
                  priority={index < 2}
                  headingLevel="h3"
                  compact
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="mt-5 flex justify-center gap-2" role="tablist">
          {items.map((offer, index) => (
            <button
              key={offer.id}
              type="button"
              aria-label={`${index + 1}`}
              aria-current={index === activeDot}
              onClick={() => swiper?.slideTo(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === activeDot ? "w-6 bg-primary" : "w-2.5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="hidden gap-4 pt-3 md:grid md:grid-cols-2 lg:grid-cols-4">
        {items.map((offer, index) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            locale={locale}
            serverTime={serverTime}
            priority={index < 4}
            headingLevel="h3"
            compact
          />
        ))}
      </div>
    </section>
  );
}
