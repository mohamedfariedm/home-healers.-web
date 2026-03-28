'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { Star } from "lucide-react";

type ClientReview = {
  id: number;
  name: string;
  text: string;
  image: null | Array<{ thumbnail: string; original: string; id: number }>;
  position?: { en?: string; ar?: string };
  rate?: number;
  title?: string;
};

export default function ClientReviewsCarousel({
  locale,
  reviews,
}: {
  locale: string;
  reviews: ClientReview[];
}) {
  const isRTL = locale === "ar";
  const rowARef = useRef<HTMLDivElement | null>(null);
  const rowBRef = useRef<HTMLDivElement | null>(null);
  const [minCardsPerRow, setMinCardsPerRow] = useState<number>(16);

  const visibleReviews = useMemo(() => {
    return (reviews || []).filter((r) => !!r?.text);
  }, [reviews]);

  // Fallback content to ensure the section is always visible and scrolling
  const fallbackText =
    locale === "ar"
      ? "لا توجد مراجعات حالياً. هذه عينة توضيحية لعرض التصميم."
      : "No reviews yet. This is a sample to showcase the design.";
  const fallbackName = locale === "ar" ? "عميل هوم هيلرز" : "Home Healers Client";
  const fallbackRole = locale === "ar" ? "عميل" : "Client";
  const fallbackItems: ClientReview[] = Array.from({ length: 5 }).map((_, i) => ({
    id: 1000 + i,
    name: fallbackName,
    text: fallbackText,
    image: null,
    position: { en: "Client", ar: "عميل" },
    rate: 5,
    title: fallbackRole,
  }));
  const sourceReviews = (visibleReviews && visibleReviews.length > 0) ? visibleReviews : fallbackItems;

  const clampToFive = (n?: number) => {
    if (typeof n !== "number" || isNaN(n)) return 0;
    if (n < 0) return 0;
    if (n > 5) return 5;
    return Math.round(n);
  };

  const getAvatarUrl = (review: ClientReview) => {
    const provided = review.image?.[0]?.thumbnail || review.image?.[0]?.original;
    if (provided) return provided;
    const nameForAvatar = encodeURIComponent(review.name || (isRTL ? "عميل" : "Client"));
    return `https://ui-avatars.com/api/?name=${nameForAvatar}&background=EEF2F7&color=143087&bold=true&size=128`;
  };

  // Prepare two rows: split by even/odd for visual variety
  const rowA = sourceReviews.filter((_, i) => i % 2 === 0);
  const rowB = sourceReviews.filter((_, i) => i % 2 === 1);
  // Base arrays per row; fall back to all reviews if a row is empty
  const baseA = rowA.length > 0 ? rowA : visibleReviews;
  const baseB = rowB.length > 0 ? rowB : visibleReviews;
  // Build a minimum-length sequence so the row is fully filled on first paint,
  // then duplicate the entire sequence once more so the two halves are identical
  // which is necessary for a perfect -50% looping marquee.
  const repeatToLength = <T,>(arr: T[], min: number): T[] => {
    if (!arr || arr.length === 0) return [];
    const times = Math.ceil(min / arr.length);
    const out: T[] = [];
    for (let i = 0; i < times; i++) out.push(...arr);
    return out;
  };
  const seqA = repeatToLength(baseA, minCardsPerRow);
  const seqB = repeatToLength(baseB, minCardsPerRow);
  const renderA = [...seqA, ...seqA];
  const renderB = [...seqB, ...seqB];

  // Dynamically ensure rows are fully filled based on viewport/container width
  useEffect(() => {
    const compute = () => {
      // Estimated card width including gap: card w-[360px] + ~24px gap
      const estimatedCardPlusGap = 384; // px
      const containerWidthA = rowARef.current?.clientWidth || 1280;
      const needed = Math.ceil((containerWidthA * 1.1) / estimatedCardPlusGap); // 10% buffer
      // Need at least 8 for small screens, cap to avoid runaway values
      const finalMin = Math.min(Math.max(needed, 8), 40);
      setMinCardsPerRow(finalMin);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return (
    <section className="w-full relative py-16" dir={isRTL ? "rtl" : "ltr"}>
      {/* Section background using brand color with subtle overlay pattern */}
      <div className="absolute inset-0 -z-10 bg-primary" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.06]"
        style={{ backgroundImage: "radial-gradient(circle at 20% 10%, white 2px, transparent 2px)" }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/0 via-black/0 to-black/5" />

      <div className="w-full xl:w-[1280px] mx-auto flex flex-col items-center gap-10 px-4">
      {/* Header in your section style */}
      <div className="flex w-full max-w-[610px] flex-col gap-[16px] items-end relative z-[24] mx-auto">
        <div className="flex gap-[10px] justify-center items-center self-stretch relative z-[25]">
          <div className="w-[610px] text-[30px] font-semibold leading-[40px] relative text-center xl:text-center z-[26]">
            {isRTL ? (
              <>
                <span className="text-[30px] font-semibold leading-[40px] relative text-start text-[#1e1e1e]">آراء </span>
                <span className="text-[30px] font-semibold leading-[40px] relative text-start text-[#62a0f6]">عملائنا</span>
                <span className="text-[30px] font-semibold leading-[40px] relative text-start text-[#1e1e1e]"> — نمط أفقي</span>
              </>
            ) : (
              <>
                <span className="text-[30px] font-semibold leading-[40px] relative text-start text-[#1e1e1e]">What our </span>
                <span className="text-[30px] font-semibold leading-[40px] relative text-start text-[#62a0f6]">clients</span>
                <span className="text-[30px] font-semibold leading-[40px] relative text-start text-[#1e1e1e]"> say — Horizontal</span>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-[10px] justify-center items-center self-stretch relative z-[27]">
          <span className="flex w-[564px] justify-center items-start basis-auto text-[16px] font-medium leading-[24px] text-[#1e1e1e] relative text-center z-[28]">
            {isRTL ? "تصميم بديل للمقارنة مع النمط العمودي" : "Alternative design to compare with the vertical style"}
          </span>
        </div>
      </div>

      {/* Horizontal auto-scroll tracks, two rows */}
      <div className="relative w-full mt-4">
        {/* Row A */}
        <div className="overflow-hidden" ref={rowARef}>
          <div className="inline-flex gap-6 items-stretch marquee-x will-change-transform" dir="ltr">
            {renderA.map((review, i) => {
              const rating = clampToFive(review.rate);
              const avatarUrl = getAvatarUrl(review);
              const role = review.position?.[isRTL ? "ar" : "en"] || (isRTL ? "عميل" : "Client");

              return (
                <article
                  key={`${review.id}-${i}`}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-[360px] shrink-0 transition-all duration-300 will-change-transform hover:scale-[1.03] hover:shadow-[0_14px_36px_rgba(20,48,135,0.14)]"
                >
                  <div className="text-[#62a0f6] text-3xl mb-3" aria-hidden="true">“</div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-5">{review.text}</p>
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatarUrl}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{review.name}</p>
                      <p className="text-xs text-gray-500 truncate">{review.title || role}</p>
                      {rating > 0 && (
                        <div className="flex items-center gap-1 mt-1" dir="ltr">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= rating ? "text-[#f8992f] fill-[#f8992f]" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Row B (reverse direction) */}
        <div className="overflow-hidden mt-6" ref={rowBRef}>
          <div className="inline-flex gap-6 items-stretch marquee-x-reverse will-change-transform" dir="ltr">
            {renderB.map((review, i) => {
              const rating = clampToFive(review.rate);
              const avatarUrl = getAvatarUrl(review);
              const role = review.position?.[isRTL ? "ar" : "en"] || (isRTL ? "عميل" : "Client");

              return (
                <article
                  key={`${review.id}-b-${i}`}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-[360px] shrink-0 transition-all duration-300 will-change-transform hover:scale-[1.03] hover:shadow-[0_14px_36px_rgba(20,48,135,0.14)]"
                >
                  <div className="text-[#62a0f6] text-3xl mb-3" aria-hidden="true">“</div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-5">{review.text}</p>
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatarUrl}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{review.name}</p>
                      <p className="text-xs text-gray-500 truncate">{review.title || role}</p>
                      {rating > 0 && (
                        <div className="flex items-center gap-1 mt-1" dir="ltr">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= rating ? "text-[#f8992f] fill-[#f8992f]" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-x {
          width: max-content;
          transform: translateZ(0);
          animation-name: scroll-left;
          animation-duration: 24s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-delay: 0s;
          animation-fill-mode: both;
          animation-play-state: running;
        }
        .marquee-x-reverse {
          width: max-content;
          transform: translateZ(0);
          animation-name: scroll-right;
          animation-duration: 24s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-delay: 0s;
          animation-fill-mode: both;
          animation-play-state: running;
        }
        /* Faster on large screens for parity with vertical speed */
        @media (min-width: 1024px) {
          .marquee-x { animation-duration: 18s; }
          .marquee-x-reverse { animation-duration: 18s; }
        }
      `}</style>
      </div>
    </section>
  );
}

