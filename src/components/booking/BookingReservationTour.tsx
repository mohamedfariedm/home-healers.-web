"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { X, ChevronRight, ChevronLeft, Compass, Sparkles } from "lucide-react";
import { markBookingTourCompleted } from "@/lib/booking-tour-storage";

export type BookingTourBookingStep = 1 | 2 | 3 | 4 | 5 | 6;

type TourStepConfig = {
  id: string;
  bookingStep: BookingTourBookingStep;
  target: string | null;
  titleKey: string;
  descKey: string;
};

const TOUR_STEPS: TourStepConfig[] = [
  {
    id: "welcome",
    bookingStep: 1,
    target: null,
    titleKey: "tour.welcomeTitle",
    descKey: "tour.welcomeDesc",
  },
  {
    id: "stepper",
    bookingStep: 1,
    target: "booking-stepper",
    titleKey: "tour.stepperTitle",
    descKey: "tour.stepperDesc",
  },
  {
    id: "specialty",
    bookingStep: 1,
    target: "tour-specialty",
    titleKey: "tour.specialtyTitle",
    descKey: "tour.specialtyDesc",
  },
  {
    id: "doctor",
    bookingStep: 2,
    target: "tour-doctor-filters",
    titleKey: "tour.doctorTitle",
    descKey: "tour.doctorDesc",
  },
  {
    id: "location",
    bookingStep: 3,
    target: "tour-location",
    titleKey: "tour.locationTitle",
    descKey: "tour.locationDesc",
  },
  {
    id: "patient",
    bookingStep: 4,
    target: "tour-patient",
    titleKey: "tour.patientTitle",
    descKey: "tour.patientDesc",
  },
  {
    id: "payment",
    bookingStep: 5,
    target: "tour-payment",
    titleKey: "tour.paymentTitle",
    descKey: "tour.paymentDesc",
  },
  {
    id: "confirmation",
    bookingStep: 6,
    target: "tour-confirmation",
    titleKey: "tour.confirmationTitle",
    descKey: "tour.confirmationDesc",
  },
];

type SpotlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

interface BookingReservationTourProps {
  active: boolean;
  onClose: () => void;
  /** Kept for re-measure when parent step changes */
  currentBookingStep: BookingTourBookingStep;
  onBookingStepChange: (step: BookingTourBookingStep) => void;
}

export default function BookingReservationTour({
  active,
  onClose,
  currentBookingStep,
  onBookingStepChange,
}: BookingReservationTourProps) {
  const { t } = useTranslation("booking");
  const [tourIndex, setTourIndex] = useState(0);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);

  const step = TOUR_STEPS[tourIndex];
  const isWelcome = step?.target == null;
  const isLast = tourIndex >= TOUR_STEPS.length - 1;
  const isFirst = tourIndex === 0;

  const finishTour = useCallback(() => {
    markBookingTourCompleted();
    onBookingStepChange(1);
    setTourIndex(0);
    onClose();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [onClose, onBookingStepChange]);

  useEffect(() => {
    if (!active) return;
    setTourIndex(0);
    onBookingStepChange(1);
    // Only re-run when the tour opens/closes, not when parent re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const goToTourStep = useCallback(
    (index: number) => {
      const next = TOUR_STEPS[index];
      if (!next) return;
      setTourIndex(index);
      onBookingStepChange(next.bookingStep);
    },
    [onBookingStepChange]
  );

  const measureTarget = useCallback(() => {
    if (!active || !step?.target) {
      setSpotlight(null);
      return;
    }
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (!el) {
      setSpotlight(null);
      return;
    }
    const pad = 8;
    const r = el.getBoundingClientRect();
    setSpotlight({
      top: r.top - pad,
      left: r.left - pad,
      width: r.width + pad * 2,
      height: r.height + pad * 2,
    });
  }, [active, step?.target]);

  useEffect(() => {
    if (!active) return;
    const id = window.setTimeout(measureTarget, 350);
    return () => window.clearTimeout(id);
  }, [active, tourIndex, currentBookingStep, measureTarget]);

  useEffect(() => {
    if (!active) return;
    const onResize = () => measureTarget();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [active, measureTarget]);

  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  if (!active || !step) return null;

  const handleNext = () => {
    if (isLast) {
      finishTour();
      return;
    }
    goToTourStep(tourIndex + 1);
  };

  const handleBack = () => {
    if (!isFirst) goToTourStep(tourIndex - 1);
  };

  const tooltipTop = spotlight
    ? Math.min(spotlight.top + spotlight.height + 16, window.innerHeight - 220)
    : undefined;

  return (
    <div
      className="fixed inset-0 z-[20000] pointer-events-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-tour-title"
    >
      {/* Dim overlay — welcome uses full screen; steps use box-shadow cutout */}
      {isWelcome || !spotlight ? (
        <div className="absolute inset-0 bg-black/60" aria-hidden />
      ) : (
        <div
          className="absolute rounded-2xl pointer-events-none transition-all duration-300"
          style={{
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
            boxShadow:
              "0 0 0 4px rgba(98,160,246,0.95), 0 0 0 9999px rgba(0, 0, 0, 0.58)",
          }}
          aria-hidden
        />
      )}

      {/* Tooltip / welcome card */}
      <div
        className={`absolute z-[20001] w-[min(420px,calc(100vw-2rem))] rounded-2xl bg-white p-5 shadow-2xl border border-gray-100 ${
          isWelcome
            ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            : "left-1/2 -translate-x-1/2"
        }`}
        style={!isWelcome && tooltipTop != null ? { top: tooltipTop } : undefined}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-[#143087]">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eff6fe]">
              {isWelcome ? (
                <Sparkles className="h-5 w-5 text-[#62a0f6]" />
              ) : (
                <Compass className="h-5 w-5 text-[#62a0f6]" />
              )}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#62a0f6]">
                {t("tour.badge")} · {tourIndex + 1}/{TOUR_STEPS.length}
              </p>
              <h2 id="booking-tour-title" className="text-lg font-bold leading-snug">
                {t(step.titleKey)}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={finishTour}
            className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label={t("tour.skip")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-5">{t(step.descKey)}</p>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 mb-5">
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === tourIndex ? "w-6 bg-[#62a0f6]" : "w-1.5 bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={finishTour}
            className="text-sm font-medium text-gray-500 hover:text-gray-800"
          >
            {t("tour.skip")}
          </button>
          <div className="flex gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4" />
                {t("tour.back")}
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1 rounded-xl bg-[#143087] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0f2470] shadow-md"
            >
              {isLast ? t("tour.finish") : t("tour.next")}
              {!isLast && <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
