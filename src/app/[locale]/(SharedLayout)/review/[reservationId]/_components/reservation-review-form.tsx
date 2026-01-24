"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  Star,
  Send,
  Stethoscope,
  Calendar,
  CheckCircle2,
  Sparkles,
  Heart,
} from "lucide-react";
import ClientAPI from "@/app/api/api";

interface ReservationReviewFormProps {
  reservationId: string;
  locale: string;
}

export default function ReservationReviewForm({
  reservationId,
  locale,
}: ReservationReviewFormProps) {
  const { t } = useTranslation("review");
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    doctor_rate: 0,
    doctor_comment: "",
    reservation_rate: 0,
    reservation_comment: "",
  });

  const [hoverRating, setHoverRating] = useState({
    doctor: 0,
    reservation: 0,
  });

  const handleStarClick = (
    type: "doctor_rate" | "reservation_rate",
    rating: number
  ) => {
    setFormData((prev) => ({ ...prev, [type]: rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.doctor_rate === 0) {
      toast.error(t("validation.doctorRateRequired"));
      return;
    }
    if (formData.reservation_rate === 0) {
      toast.error(t("validation.reservationRateRequired"));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await ClientAPI.submitReservationReview(
        reservationId,
        formData,
        locale
      );

      if (response?.success || response?.data) {
        setIsSubmitted(true);
        toast.success(t("messages.success"));
      } else {
        toast.error(t("messages.error"));
      }
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error(t("messages.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (
    type: "doctor_rate" | "reservation_rate",
    hoverKey: "doctor" | "reservation"
  ) => {
    const currentRating = formData[type];
    const currentHover = hoverRating[hoverKey];

    return (
      <div className="flex justify-center gap-1 sm:gap-2" dir="ltr">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= (currentHover || currentRating);
          return (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(type, star)}
              onMouseEnter={() =>
                setHoverRating((prev) => ({ ...prev, [hoverKey]: star }))
              }
              onMouseLeave={() =>
                setHoverRating((prev) => ({ ...prev, [hoverKey]: 0 }))
              }
              className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 transform hover:scale-110 ${
                isActive
                  ? "text-amber-400 bg-amber-50"
                  : "text-gray-300 hover:text-amber-300 hover:bg-amber-50/50"
              }`}
            >
              <Star
                className={`w-7 h-7 sm:w-9 sm:h-9 transition-all ${
                  isActive ? "fill-amber-400" : ""
                }`}
              />
            </button>
          );
        })}
      </div>
    );
  };

  const getRatingLabel = (rating: number) => {
    if (rating === 0) return t("rating.notSelected");
    if (rating === 1) return t("rating.poor");
    if (rating === 2) return t("rating.fair");
    if (rating === 3) return t("rating.good");
    if (rating === 4) return t("rating.veryGood");
    return t("rating.excellent");
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 text-center">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <Sparkles className="w-6 h-6 text-amber-400 absolute top-0 right-1/4 animate-pulse" />
          <Sparkles className="w-4 h-4 text-emerald-400 absolute top-4 left-1/4 animate-pulse delay-100" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
          {t("success.title")}
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          {t("success.message")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push(`/${locale}`)}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5" />
            {t("success.backToHome")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 p-6 sm:p-8 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle,_rgba(255,255,255,0.15)_1px,_transparent_1px)] bg-[length:20px_20px]" />
        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {t("title")}
          </h1>
          <p className="text-white/90 text-sm sm:text-base max-w-md mx-auto">
            {t("subtitle")}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm">
            <Calendar className="w-4 h-4" />
            {t("reservationId")}: #{reservationId}
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6">
        {/* Doctor Rating Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 sm:p-6 rounded-xl border border-blue-100">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              {t("doctor.title")}
            </h2>
          </div>

          <p className="text-gray-600 text-center text-sm mb-4">
            {t("doctor.subtitle")}
          </p>

          {renderStars("doctor_rate", "doctor")}

          <p
            className={`text-center mt-3 font-medium transition-all ${
              formData.doctor_rate > 0 ? "text-amber-500" : "text-gray-400"
            }`}
          >
            {getRatingLabel(formData.doctor_rate)}
          </p>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("doctor.commentLabel")}
            </label>
            <textarea
              value={formData.doctor_comment}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  doctor_comment: e.target.value,
                }))
              }
              placeholder={t("doctor.commentPlaceholder")}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 transition-all resize-none"
            />
          </div>
        </div>

        {/* Reservation Rating Section */}
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-5 sm:p-6 rounded-xl border border-purple-100">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              {t("reservation.title")}
            </h2>
          </div>

          <p className="text-gray-600 text-center text-sm mb-4">
            {t("reservation.subtitle")}
          </p>

          {renderStars("reservation_rate", "reservation")}

          <p
            className={`text-center mt-3 font-medium transition-all ${
              formData.reservation_rate > 0 ? "text-amber-500" : "text-gray-400"
            }`}
          >
            {getRatingLabel(formData.reservation_rate)}
          </p>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("reservation.commentLabel")}
            </label>
            <textarea
              value={formData.reservation_comment}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  reservation_comment: e.target.value,
                }))
              }
              placeholder={t("reservation.commentPlaceholder")}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 transition-all resize-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-14 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {t("submitting")}
            </>
          ) : (
            <>
              <Send className="w-6 h-6" />
              {t("submit")}
            </>
          )}
        </button>

        {/* Footer note */}
        <p className="text-center text-gray-500 text-sm">
          {t("footer.note")}
        </p>
      </form>
    </div>
  );
}
