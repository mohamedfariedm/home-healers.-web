"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import "swiper/css";
import "swiper/css/pagination";

interface Review {
  id: number;
  reservation_id: number;
  client_id: number;
  doctor_id: number;
  doctor_rate: number | null;
  doctor_comment: string | null;
  reservation_rate: number | null;
  reservation_comment: string | null;
  status: boolean;
  client: {
    id: number;
    name: string;
  };
  doctor: {
    id: number;
    name: string;
  };
  reservation: {
    id: number;
    status: number;
  };
  created_at: string;
  updated_at: string;
}

interface ReservationReviewsSectionProps {
  reviews: Review[];
  locale: string;
}

function ReservationReviewsSection({
  reviews,
  locale,
}: ReservationReviewsSectionProps) {
  const { t } = useTranslation("homepage");
  const [activeDot, setActiveDot] = useState(0);

  // Filter reviews that have at least one rating or comment
  const validReviews =
    reviews?.filter(
      (review) =>
        review.doctor_rate ||
        review.doctor_comment ||
        review.reservation_rate ||
        review.reservation_comment
    ) || [];

  if (!validReviews || validReviews.length === 0) {
    return null;
  }

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex gap-1 justify-center items-center" dir="ltr">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-[#f8992f] fill-[#f8992f]" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getReviewText = (review: Review) => {
    // Prioritize doctor comment, then reservation comment
    if (review.doctor_comment) {
      return review.doctor_comment;
    }
    if (review.reservation_comment) {
      return review.reservation_comment;
    }
    return "";
  };

  const getReviewRating = (review: Review) => {
    // Use doctor rating if available, otherwise reservation rating
    return review.doctor_rate || review.reservation_rate || 0;
  };

  return (
    <section className="w-full xl:w-[1280px] mx-auto mt-16 flex flex-col items-center relative z-[5]">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-semibold text-gray-900">
          {t("reservationReviews.title")}
        </h2>
        <p className="text-gray-500 mt-3 text-base max-w-xl mx-auto">
          {t("reservationReviews.description")}
        </p>
      </motion.div>

      {/* Swiper */}
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{ delay: 4000 }}
        pagination={{
          clickable: true,
          el: ".reviews-dots",
        }}
        loop={validReviews.length > 3}
        onSlideChange={(swiper) => setActiveDot(swiper.realIndex)}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 3 },
        }}
        className="w-full h-auto"
      >
        {validReviews.map((review) => {
          const reviewText = getReviewText(review);
          const reviewRating = getReviewRating(review);

          return (
            <SwiperSlide key={review.id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative bg-white shadow-lg rounded-3xl overflow-hidden w-[300px] h-[420px] flex flex-col mx-auto border border-gray-100 hover:shadow-xl transition-shadow"
              >
                {/* Header with Avatar */}
                <div className="relative w-full h-[120px] bg-gradient-to-br from-primary to-[#143087] flex flex-col items-center justify-center pt-6">
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-3 shadow-lg">
                    <span className="text-primary font-bold text-2xl">
                      {review.client?.name?.charAt(0)?.toUpperCase() || "C"}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-lg">
                    {review.client?.name || t("reservationReviews.anonymous")}
                  </h3>
                  {review.doctor?.name && (
                    <p className="text-white/80 text-sm mt-1">
                      {locale === "ar" ? "مع" : "With"} {review.doctor.name}
                    </p>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div className="flex-1">
                    {/* Rating Stars */}
                    {reviewRating > 0 && (
                      <div className="flex justify-center mb-4">
                        {renderStars(reviewRating)}
                      </div>
                    )}

                    {/* Review Text */}
                    {reviewText && (
                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-6 text-center">
                        "{reviewText}"
                      </p>
                    )}

                    {/* Doctor Info */}
                    {review.doctor?.name && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-primary"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <span className="text-gray-600 text-sm font-medium">
                            {review.doctor.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {locale === "ar" ? "الحجز" : "Reservation"} #
                        {review.reservation_id}
                      </span>
                      <span>
                        {new Date(review.created_at).toLocaleDateString(
                          locale === "ar" ? "ar-SA" : "en-US",
                          {
                            year: "numeric",
                            month: "short",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Pagination Dots */}
      {validReviews.length > 1 && (
        <div className="flex gap-3 mt-6 reviews-dots justify-center">
          {validReviews
            .slice(0, validReviews.length > 3 ? 3 : validReviews.length)
            .map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === activeDot ? "bg-primary" : "bg-gray-300"
                }`}
              />
            ))}
        </div>
      )}
    </section>
  );
}

export default ReservationReviewsSection;
