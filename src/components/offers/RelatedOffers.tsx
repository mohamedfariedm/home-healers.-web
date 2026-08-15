"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ClientAPI from "@/app/api/api";
import type { OfferCard as OfferCardType } from "@/types/offers";
import { offerDisplayImage, offerHref, formatOfferPrice } from "@/lib/offers";
import Image from "next/image";
import { OfferCardSkeleton } from "./OfferCard";

type RelatedOffersProps = {
  locale: string;
  offerId: number;
  embedded?: OfferCardType[] | null;
};

export default function RelatedOffers({
  locale,
  offerId,
  embedded,
}: RelatedOffersProps) {
  const { t } = useTranslation("offers");
  const [offers, setOffers] = useState<OfferCardType[]>(embedded ?? []);
  const [loading, setLoading] = useState(!embedded?.length);

  useEffect(() => {
    if (embedded?.length) return;
    let cancelled = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        ClientAPI.getRelatedPackages(offerId, locale)
          .then((res) => {
            if (!cancelled) setOffers(res?.data ?? []);
          })
          .catch(() => {
            if (!cancelled) setOffers([]);
          })
          .finally(() => {
            if (!cancelled) setLoading(false);
          });
      },
      { rootMargin: "200px" },
    );
    const node = document.getElementById("related-offers");
    if (node) observer.observe(node);
    else setLoading(false);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [embedded, locale, offerId]);

  if (!loading && !offers.length) return null;

  return (
    <section id="related-offers">
      <h2 className="mb-4 text-2xl font-semibold text-[#143087]">
        {t("related")}
      </h2>
      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="min-w-[240px] flex-1">
              <OfferCardSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex snap-x gap-4 overflow-x-auto pb-2">
          {offers.map((offer) => {
            if (!offer.slug) return null;
            const href = offerHref(locale, offer.slug);
            const image = offerDisplayImage(offer);
            return (
              <a
                key={offer.id}
                href={href}
                className="min-w-[240px] snap-start overflow-hidden rounded-2xl border border-gray-100 bg-white"
              >
                <div className="relative aspect-[4/3] bg-[#eef4ff]">
                  {image ? (
                    <Image
                      src={image}
                      alt={offer.name}
                      fill
                      sizes="240px"
                      className="object-cover"
                      loading="lazy"
                    />
                  ) : null}
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 font-semibold text-[#1e1e1e]">
                    {offer.name}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#143087]">
                    {formatOfferPrice(offer.price, offer.currency, locale)}
                  </p>
                  <span className="mt-2 inline-flex text-sm font-semibold text-primary">
                    {t("bookNow")}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
