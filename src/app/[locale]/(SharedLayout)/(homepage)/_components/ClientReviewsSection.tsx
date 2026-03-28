'use client';

import { useMemo } from "react";
import { Star } from "lucide-react";

type ClientReview = {
  id: number;
  name: string;
  text: string;
  image: null | Array<{ thumbnail: string; original: string; id: number }>;
  position?: { en?: string; ar?: string };
  rate?: number;
  title?: string;
  created_at?: string;
  updated_at?: string;
};

export default function ClientReviewsSection({
  locale,
  reviews,
}: {
  locale: string;
  reviews: ClientReview[];
}) {
  const isRTL = locale === "ar";

  const visibleReviews = useMemo(() => {
    return (reviews || []).filter((r) => !!r?.text);
  }, [reviews]);

  if (!visibleReviews || visibleReviews.length === 0) {
    return null;
  }

  const clampToFive = (n?: number) => {
    if (typeof n !== "number" || isNaN(n)) return 0;
    if (n < 0) return 0;
    if (n > 5) return 5;
    return Math.round(n);
  };

  // Split reviews across columns for a masonry-like layout
  const columnCount = 3; // will collapse responsively with CSS
  const columns: ClientReview[][] = Array.from({ length: columnCount }, () => []);
  visibleReviews.forEach((r, i) => {
    columns[i % columnCount].push(r);
  });

  const getAvatarUrl = (review: ClientReview) => {
    const provided = review.image?.[0]?.thumbnail || review.image?.[0]?.original;
    if (provided) return provided;
    const nameForAvatar = encodeURIComponent(review.name || (isRTL ? "عميل" : "Client"));
    // Solid, reliable fallback image
    return `https://ui-avatars.com/api/?name=${nameForAvatar}&background=EEF2F7&color=143087&bold=true&size=128`;
  };

  return (
    <section className="w-full xl:w-[1280px] gap-16 mx-auto  flex flex-col items-center relative z-[5] px-4" dir={isRTL ? "rtl" : "ltr"}>
      {/* Soft section background to match the reference */}
      <div className="absolute inset-0 -z-10" />

      <div className="flex w-full max-w-[610px] flex-col gap-[16px] items-end relative z-[24] mt-[60px] mx-auto">
        <div className="flex gap-[10px] justify-center items-center self-stretch relative z-[25]">
          <div className="w-[610px] text-[30px] font-semibold leading-[40px] relative text-center xl:text-center z-[26]">
            {isRTL ? (
              <>
                <span className="text-[30px] font-semibold leading-[40px] relative text-start text-[#1e1e1e]">
                  آراء{" "}
                </span>
                <span className="text-[30px] font-semibold leading-[40px] relative text-start text-[#62a0f6]">
                  عملائنا
                </span>
              </>
            ) : (
              <>
                <span className="text-[30px] font-semibold leading-[40px] relative text-start text-[#1e1e1e]">
                  What our{" "}
                </span>
                <span className="text-[30px] font-semibold leading-[40px] relative text-start text-[#62a0f6]">
                  clients
                </span>
                <span className="text-[30px] font-semibold leading-[40px] relative text-start text-[#1e1e1e]">
                  {" "}
                  say
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-[10px] justify-center items-center self-stretch relative z-[27]">
          <span className="flex w-[564px] justify-center items-start basis-auto text-[16px] font-medium leading-[24px] text-[#1e1e1e] relative text-center z-[28]">
            {isRTL
              ? "تجارب حقيقية لخدمات Home Healers المنزلية"
              : "Real experiences with Home Healers home care services"}
          </span>
        </div>
      </div>

      {/* Vertical auto-scrolling masonry-like grid */}
      <div className="relative w-full">
        <div className="overflow-hidden h-[440px] md:h-[480px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {columns.map((col, colIdx) => {
              // Duplicate column content to enable infinite marquee effect
              const looped = [...col, ...col];
              // Slightly different speeds per column for a natural feel
              const speedClass =
                colIdx === 0 ? "animate-scroll-slow" : colIdx === 1 ? "animate-scroll-med" : "animate-scroll-fast";
              return (
                <div key={colIdx} className="relative column-marquee">
                  <div className={`flex flex-col gap-6 marquee-track ${speedClass}`}>
                    {looped.map((review, i) => {
                      const rating = clampToFive(review.rate);
                      const avatarUrl = getAvatarUrl(review);
                      const role = review.position?.[isRTL ? "ar" : "en"] || (isRTL ? "عميل" : "Client");

                      return (
                        <article
                          key={`${review.id}-${i}`}
                          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 w-full transition-all duration-300 will-change-transform hover:scale-[1.02] hover:shadow-[0_14px_36px_rgba(20,48,135,0.14)]"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={avatarUrl}
                              alt={review.name}
                              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-gray-200"
                            />
                            <div className="min-w-0">
                              <p className="text-sm md:text-base font-semibold text-gray-900 truncate">
                                {review.name}
                              </p>
                              <p className="text-xs md:text-sm text-gray-500 truncate">
                                {review.title || role}
                              </p>
                            </div>
                          </div>

                          {rating > 0 && (
                            <div className="flex items-center gap-1.5 mb-3" dir="ltr">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-4 h-4 ${
                                    s <= rating ? "text-[#f8992f] fill-[#f8992f]" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          )}

                          <p className="text-gray-700 text-sm md:text-[15px] leading-relaxed">
                            {review.text}
                          </p>
                        </article>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Local styles for marquee animation */}
      <style jsx>{`
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        /* Faster speeds */
        .animate-scroll-slow {
          animation: scroll-up 14s linear infinite;
        }
        .animate-scroll-med {
          animation: scroll-up 12s linear infinite;
        }
        .animate-scroll-fast {
          animation: scroll-up 10s linear infinite;
        }
        /* Pause on hover anywhere inside the column */
        .column-marquee:hover .marquee-track {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

