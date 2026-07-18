"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
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
  currentBookingStep: BookingTourBookingStep;
  onBookingStepChange: (step: BookingTourBookingStep) => void;
}

function waitForElement(
  selector: string,
  timeoutMs = 2500
): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    const existing = document.querySelector(selector);
    if (existing instanceof HTMLElement) {
      resolve(existing);
      return;
    }
    const start = Date.now();
    const tick = window.setInterval(() => {
      const el = document.querySelector(selector);
      if (el instanceof HTMLElement) {
        window.clearInterval(tick);
        resolve(el);
        return;
      }
      if (Date.now() - start >= timeoutMs) {
        window.clearInterval(tick);
        resolve(null);
      }
    }, 40);
  });
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export default function BookingReservationTour({
  active,
  onClose,
  currentBookingStep: _currentBookingStep,
  onBookingStepChange,
}: BookingReservationTourProps) {
  const { t, i18n } = useTranslation("booking");
  const isRtl = (i18n.language || "ar").startsWith("ar");
  const [tourIndex, setTourIndex] = useState(0);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [busy, setBusy] = useState(false);
  const scrollLockRef = useRef(0);
  const runIdRef = useRef(0);

  const step = TOUR_STEPS[tourIndex];
  const isWelcome = step?.target == null;
  const isLast = tourIndex >= TOUR_STEPS.length - 1;
  const isFirst = tourIndex === 0;

  const finishTour = useCallback(() => {
    runIdRef.current += 1;
    markBookingTourCompleted();
    onBookingStepChange(1);
    setTourIndex(0);
    setSpotlight(null);
    setBusy(false);
    onClose();
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [onClose, onBookingStepChange]);

  const measureTarget = useCallback((el: HTMLElement | null) => {
    if (!el) {
      setSpotlight(null);
      return;
    }
    const pad = 8;
    const r = el.getBoundingClientRect();
    const maxH = Math.min(r.height + pad * 2, window.innerHeight * 0.52);
    setSpotlight({
      top: Math.max(8, r.top - pad),
      left: Math.max(8, r.left - pad),
      width: Math.min(r.width + pad * 2, window.innerWidth - 16),
      height: maxH,
    });
  }, []);

  const revealStep = useCallback(
    async (index: number) => {
      const next = TOUR_STEPS[index];
      if (!next) return;

      const runId = ++runIdRef.current;
      setBusy(true);
      setSpotlight(null);
      setTourIndex(index);
      onBookingStepChange(next.bookingStep);

      const smooth = !prefersReducedMotion();

      // Welcome — top of page, centered card
      if (!next.target) {
        window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
        await sleep(smooth ? 300 : 40);
        if (runId !== runIdRef.current) return;
        setBusy(false);
        return;
      }

      // Wait for the booking step UI to mount
      await sleep(100);
      if (runId !== runIdRef.current) return;

      const selector = `[data-tour="${next.target}"]`;
      const el = await waitForElement(selector);
      if (runId !== runIdRef.current) return;

      if (!el) {
        setSpotlight(null);
        setBusy(false);
        return;
      }

      scrollLockRef.current += 1;
      el.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "center",
        inline: "nearest",
      });

      await sleep(smooth ? 480 : 60);
      if (runId !== runIdRef.current) {
        scrollLockRef.current = Math.max(0, scrollLockRef.current - 1);
        return;
      }

      measureTarget(el);
      await sleep(80);
      if (runId !== runIdRef.current) {
        scrollLockRef.current = Math.max(0, scrollLockRef.current - 1);
        return;
      }

      const again = document.querySelector(selector);
      if (again instanceof HTMLElement) measureTarget(again);

      scrollLockRef.current = Math.max(0, scrollLockRef.current - 1);
      setBusy(false);
    },
    [measureTarget, onBookingStepChange]
  );

  useEffect(() => {
    if (!active) return;
    void revealStep(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const sync = () => {
      if (!step?.target) {
        setSpotlight(null);
        return;
      }
      const el = document.querySelector(`[data-tour="${step.target}"]`);
      if (el instanceof HTMLElement) measureTarget(el);
    };
    window.addEventListener("resize", sync);
    window.addEventListener("scroll", sync, true);
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("scroll", sync, true);
    };
  }, [active, step?.target, measureTarget]);

  useEffect(() => {
    if (!active) return;

    const blockWheel = (e: WheelEvent) => {
      if (scrollLockRef.current > 0) return;
      e.preventDefault();
    };
    const blockTouch = (e: TouchEvent) => {
      if (scrollLockRef.current > 0) return;
      e.preventDefault();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        finishTour();
        return;
      }
      if (busy) return;
      if (e.key === "Enter" || e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const nextDir = isRtl ? e.key === "ArrowLeft" : e.key === "ArrowRight";
        const goNext = e.key === "Enter" || nextDir;
        if (goNext) {
          if (isLast) finishTour();
          else void revealStep(tourIndex + 1);
        } else if (!isFirst) {
          void revealStep(tourIndex - 1);
        }
        return;
      }
      if (
        ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(
          e.key
        )
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", blockWheel, { passive: false });
    window.addEventListener("touchmove", blockTouch, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", blockWheel);
      window.removeEventListener("touchmove", blockTouch);
      window.removeEventListener("keydown", onKey);
    };
  }, [
    active,
    busy,
    finishTour,
    revealStep,
    tourIndex,
    isFirst,
    isLast,
    isRtl,
  ]);

  if (!active || !step) return null;

  const handleNext = () => {
    if (busy) return;
    if (isLast) {
      finishTour();
      return;
    }
    void revealStep(tourIndex + 1);
  };

  const handleBack = () => {
    if (busy || isFirst) return;
    void revealStep(tourIndex - 1);
  };

  const BackIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  // Keep tooltip on screen: prefer below spotlight, flip above if needed
  let tooltipStyle: CSSProperties | undefined;
  if (isWelcome) {
    tooltipStyle = undefined;
  } else if (spotlight) {
    const cardH = 220;
    const gap = 14;
    const below = spotlight.top + spotlight.height + gap;
    const spaceBelow = window.innerHeight - below;
    const top =
      spaceBelow < cardH && spotlight.top > cardH + gap
        ? Math.max(12, spotlight.top - cardH - gap)
        : Math.min(below, window.innerHeight - cardH - 12);
    tooltipStyle = { top };
  }

  return (
    <div
      className="fixed inset-0 z-[20000] pointer-events-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-tour-title"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {isWelcome || !spotlight ? (
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            busy ? "opacity-70" : "opacity-100"
          }`}
          aria-hidden
        />
      ) : (
        <div
          className="absolute rounded-2xl pointer-events-none transition-all duration-300 ease-out"
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

      <div
        className={`absolute z-[20001] w-[min(420px,calc(100vw-2rem))] rounded-2xl border border-gray-100 bg-white p-5 shadow-2xl transition-all duration-300 ${
          isWelcome
            ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            : "left-1/2 -translate-x-1/2"
        } ${busy ? "opacity-80" : "opacity-100"}`}
        style={tooltipStyle}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
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
              <h2
                id="booking-tour-title"
                className="text-lg font-bold leading-snug"
              >
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

        <p className="mb-5 text-sm leading-relaxed text-gray-600">
          {t(step.descKey)}
        </p>

        <div className="mb-5 flex justify-center gap-1.5">
          {TOUR_STEPS.map((_, i) => (
            <button
              key={i}
              type="button"
              disabled={busy}
              onClick={() => void revealStep(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === tourIndex
                  ? "w-6 bg-[#62a0f6]"
                  : i < tourIndex
                    ? "w-1.5 bg-[#12b669]"
                    : "w-1.5 bg-gray-200 hover:bg-gray-300"
              }`}
              aria-label={`${t("tour.badge")} ${i + 1}`}
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
                disabled={busy}
                className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <BackIcon className="h-4 w-4" />
                {t("tour.back")}
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={busy}
              className="inline-flex items-center gap-1 rounded-xl bg-[#143087] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#0f2470] disabled:opacity-50"
            >
              {isLast ? t("tour.finish") : t("tour.next")}
              {!isLast && <NextIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
