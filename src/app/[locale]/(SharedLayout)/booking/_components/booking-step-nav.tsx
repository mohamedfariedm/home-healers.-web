"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

type BookingStepNavProps = {
  onPrev?: () => void;
  onNext?: () => void;
  showPrev?: boolean;
  showNext?: boolean;
  nextDisabled?: boolean;
  prevDisabled?: boolean;
  nextLabel?: string;
  prevLabel?: string;
  nextContent?: ReactNode;
  className?: string;
};

/**
 * Sticks to the bottom of the viewport only while its step section
 * is scrolling past — then leaves with the section (not fixed to the page).
 */
export default function BookingStepNav({
  onPrev,
  onNext,
  showPrev = true,
  showNext = true,
  nextDisabled = false,
  prevDisabled = false,
  nextLabel,
  prevLabel,
  nextContent,
  className = "",
}: BookingStepNavProps) {
  const { t } = useTranslation("booking");

  if (!showPrev && !showNext) return null;

  return (
    <div
      className={`sticky bottom-3 z-30 mt-8 sm:bottom-4 ${className}`}
      data-tour="booking-step-nav"
    >
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#dbe7f8] bg-white/95 px-3 py-3 shadow-[0_8px_24px_rgba(20,48,135,0.12)] backdrop-blur-md ring-1 ring-[#143087]/5 sm:px-5 sm:py-3.5">
        {showPrev ? (
          <button
            type="button"
            onClick={onPrev}
            disabled={prevDisabled || !onPrev}
            className="min-w-[7.5rem] shrink-0 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={prevLabel || t("step2.previous")}
          >
            {prevLabel || t("step2.previous")}
          </button>
        ) : (
          <span className="min-w-[7.5rem]" aria-hidden />
        )}

        {showNext ? (
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled || !onNext}
            className={`flex items-center justify-center gap-2 rounded-xl bg-[#143087] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0f2470] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none ${
              showPrev
                ? "min-w-[7.5rem]"
                : "w-full sm:ms-auto sm:w-auto sm:min-w-[10rem]"
            }`}
            aria-label={
              typeof nextLabel === "string" ? nextLabel : t("step2.next")
            }
          >
            {nextContent ?? (nextLabel || t("step2.next"))}
          </button>
        ) : null}
      </div>
    </div>
  );
}
