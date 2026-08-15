"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import type { OfferReview } from "@/types/offers";
import { isTruthyFlag } from "@/lib/offers";

type OfferReviewsProps = {
  reviews: OfferReview[];
  locale: string;
};

export default function OfferReviews({ reviews, locale }: OfferReviewsProps) {
  const { t } = useTranslation("offers");
  const [expanded, setExpanded] = useState(false);
  if (!reviews.length) return null;

  const visible = expanded ? reviews : reviews.slice(0, 3);
  const dateFmt = new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-GB", {
    dateStyle: "medium",
  });

  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold text-[#143087]">
        {t("reviews")}
      </h2>
      <div className="flex flex-col gap-4">
        {visible.map((review) => (
          <article
            key={review.id}
            className="rounded-2xl border border-gray-100 bg-white p-4"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <p className="font-semibold text-[#1e1e1e]">
                {review.patient_name || t("patient")}
              </p>
              {isTruthyFlag(review.is_verified) ? (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  {t("verified")}
                </span>
              ) : null}
            </div>
            {review.rating != null ? (
              <div className="mb-2 flex items-center gap-1 text-sm">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`size-4 ${
                      index < Number(review.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            ) : null}
            {review.date ? (
              <p className="mb-2 text-xs text-[#4a5568]">
                {dateFmt.format(new Date(review.date))}
              </p>
            ) : null}
            {review.body ? (
              <p className="text-sm leading-6 text-[#1e1e1e]">{review.body}</p>
            ) : null}
          </article>
        ))}
      </div>
      {reviews.length > 3 ? (
        <button
          type="button"
          className="mt-4 text-sm font-semibold text-primary"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? t("showFewerReviews") : t("showMoreReviews")}
        </button>
      ) : null}
    </section>
  );
}
