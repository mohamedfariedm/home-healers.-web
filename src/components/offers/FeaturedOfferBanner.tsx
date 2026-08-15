"use client";

import { useTranslation } from "react-i18next";
import type { OfferCard as OfferCardType } from "@/types/offers";
import { offerDisplayImage, offerHref, toNumber } from "@/lib/offers";
import Image from "next/image";

type FeaturedOfferBannerProps = {
  offer: OfferCardType;
  locale: string;
  headingId?: string;
};

export default function FeaturedOfferBanner({
  offer,
  locale,
  headingId = "featured-offer-heading",
}: FeaturedOfferBannerProps) {
  const { t } = useTranslation("offers");
  if (!offer.slug) return null;

  const href = offerHref(locale, offer.slug);
  const image = offerDisplayImage(offer);
  const discount = toNumber(offer.discount_percentage);

  return (
    <section
      aria-labelledby={headingId}
      className="w-full overflow-hidden bg-[#143087] text-white"
    >
      <div className="mx-auto grid w-full max-w-[1440px] lg:grid-cols-2">
        <div className="relative aspect-video w-full bg-[#0f2470] lg:aspect-auto lg:min-h-[360px]">
          {image ? (
            <Image
              src={image}
              alt={offer.name}
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : null}
        </div>
        <div className="flex flex-col justify-center gap-4 px-6 py-8 lg:px-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#9ec4ff]">
            {t("featured")}
          </p>
          <h2 id={headingId} className="text-3xl font-bold leading-tight">
            {offer.name}
          </h2>
          {offer.short_description ? (
            <p className="max-w-xl text-base text-white/85">
              {offer.short_description}
            </p>
          ) : null}
          {discount && discount > 0 ? (
            <span className="w-fit rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#143087]">
              {t("off", { percent: Math.round(discount) })}
            </span>
          ) : null}
          <a
            href={href}
            className="mt-2 inline-flex h-12 w-fit items-center justify-center rounded-xl bg-primary px-6 font-semibold text-white hover:bg-[#4f8ae8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {t("bookNow")}
          </a>
        </div>
      </div>
    </section>
  );
}
