"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  Calendar,
  User,
  MapPin,
  CreditCard,
  Download,
  Home,
  Loader2,
} from "lucide-react";
import type { BookingData } from "@/types/booking";
import { toast } from "sonner";
import { useLocalStorage } from "@/Hooks/use-local-storage";
import { useRouter } from "next/navigation";
import {
  clearCheckoutStorage,
  clearPendingPayment,
  getPersistedPendingPayment,
  getPersistedReservationId,
} from "@/lib/checkout-storage";
import {
  pollTamaraOutcome,
  resolveTamaraCheckoutContext,
  tamaraResultPath,
} from "@/lib/tamara";
import { pollTelrReturnOutcome } from "@/lib/telr-seamless";
import { useTranslation } from "react-i18next";

type PaymentSuccessProps = {
  orderRef?: string;
};

const POLL_ATTEMPTS = 12;
const POLL_MS = 2500;

type ViewState = "checking" | "confirming" | "paid";

export default function PaymentSuccess({ orderRef }: PaymentSuccessProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation("booking");
  const locale = i18n.language?.startsWith("en") ? "en" : "ar";
  const [bookingData] = useLocalStorage<BookingData>("bookingData", {} as BookingData);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [view, setView] = useState<ViewState>("checking");

  useEffect(() => {
    const verifyPayment = async () => {
      const { reservationId: persistedId, pending, isTamara } =
        resolveTamaraCheckoutContext();
      const fallbackId = persistedId ?? getPersistedReservationId();
      if (!fallbackId) {
        toast.error(t("messages.reservationIdMissing"));
        router.push("/");
        return;
      }

      setReservationId(fallbackId);

      try {
        if (isTamara || pending?.provider === "tamara") {
          const result = await pollTamaraOutcome({
            reservationId: fallbackId,
            locale,
            attemptId: pending?.attemptId,
            attempts: POLL_ATTEMPTS,
            intervalMs: POLL_MS,
            stopOnTerminal: true,
          });

          if (result.outcome === "paid") {
            setView("paid");
            clearPendingPayment();
            clearCheckoutStorage();
            return;
          }

          if (result.outcome === "cancelled") {
            router.replace(
              tamaraResultPath(
                locale,
                "canceled",
                orderRef ?? pending?.orderId ?? String(fallbackId)
              )
            );
            return;
          }

          if (
            result.outcome === "failed" ||
            result.outcome === "expired"
          ) {
            router.replace(
              tamaraResultPath(
                locale,
                "failed",
                orderRef ?? pending?.orderId ?? String(fallbackId)
              )
            );
            return;
          }

          // Still pending / unavailable — never treat as failed from URL alone.
          setView("confirming");
          toast.message(t("paymentReturn.confirmingMessage"));
          return;
        }

        // Telr Card / Tabby / HPP — URL is not authoritative.
        const telrOutcome = await pollTelrReturnOutcome({
          reservationId: fallbackId,
          locale,
          attemptId: pending?.attemptId,
          attempts: POLL_ATTEMPTS,
          intervalMs: POLL_MS,
        });

        if (telrOutcome === "paid") {
          setView("paid");
          clearPendingPayment();
          clearCheckoutStorage();
          return;
        }

        if (telrOutcome === "unpaid") {
          router.replace(
            `/${locale}/failed/${encodeURIComponent(orderRef ?? String(fallbackId))}`
          );
          return;
        }

        // Pending / unavailable — keep confirming; do not force failed from URL alone.
        setView("confirming");
        toast.message(t("paymentReturn.confirmingMessage"));
      } catch (error) {
        console.error("Failed to verify payment:", error);
        toast.error(t("paymentReturn.verifyFailed"));
        setView("confirming");
      }
    };

    void verifyPayment();
  }, [locale, orderRef, router, t]);

  const handleDownloadReceipt = async () => {
    if (!bookingData?.pricing) return;
    try {
      const { downloadBookingReceipt } = await import("./success-receipt-pdf");
      await downloadBookingReceipt(bookingData, reservationId);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(t("step6.pdfError"));
    }
  };

  const handleGoHome = () => {
    clearCheckoutStorage();
    router.push("/");
  };

  const handleRefreshStatus = async () => {
    const pending = getPersistedPendingPayment();
    const id = reservationId ?? getPersistedReservationId();
    if (!id) return;
    setView("checking");
    try {
      if (pending?.provider === "tamara") {
        const result = await pollTamaraOutcome({
          reservationId: id,
          locale,
          attemptId: pending?.attemptId,
          attempts: 4,
          intervalMs: POLL_MS,
          stopOnTerminal: true,
        });
        if (result.outcome === "paid") {
          setView("paid");
          clearPendingPayment();
          clearCheckoutStorage();
          return;
        }
        if (result.outcome === "cancelled") {
          router.replace(
            tamaraResultPath(locale, "canceled", orderRef ?? pending?.orderId)
          );
          return;
        }
        if (result.outcome === "failed" || result.outcome === "expired") {
          router.replace(
            tamaraResultPath(locale, "failed", orderRef ?? pending?.orderId)
          );
          return;
        }
        setView("confirming");
        toast.message(t("paymentReturn.confirmingMessage"));
        return;
      }

      const telrOutcome = await pollTelrReturnOutcome({
        reservationId: id,
        locale,
        attemptId: pending?.attemptId,
        attempts: 4,
        intervalMs: POLL_MS,
      });
      if (telrOutcome === "paid") {
        setView("paid");
        clearPendingPayment();
        clearCheckoutStorage();
        return;
      }
      if (telrOutcome === "unpaid") {
        router.replace(
          `/${locale}/failed/${encodeURIComponent(orderRef ?? String(id))}`
        );
        return;
      }
      setView("confirming");
      toast.message(t("paymentReturn.confirmingMessage"));
    } catch {
      setView("confirming");
      toast.error(t("paymentReturn.verifyFailed"));
    }
  };

  const hasBookingDetails =
    bookingData &&
    Object.keys(bookingData).length > 0 &&
    bookingData.selectedPatients?.length;

  if (view === "checking" || view === "confirming") {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#143087]" />
        <h1 className="text-xl font-semibold text-[#143087]">
          {t("paymentReturn.confirmingTitle")}
        </h1>
        <p className="text-gray-600">{t("paymentReturn.confirmingMessage")}</p>
        {view === "confirming" && (
          <button
            type="button"
            onClick={() => void handleRefreshStatus()}
            className="mt-2 rounded-lg border border-[#62a0f6] px-6 py-2 text-[#62a0f6] hover:bg-[#eff6fe]"
          >
            {t("paymentReturn.refreshStatus")}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-12 sm:px-6" dir="rtl">
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          {t("paymentReturn.successTitle")}
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          {t("paymentReturn.successMessage")}
        </p>
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-green-800 font-medium">{t("step6.reservationNumber")}:</span>
          <span className="text-green-600 font-bold">HH-{reservationId}</span>
        </div>
        {orderRef && (
          <p className="text-sm text-gray-500 mt-3">
            {t("paymentReturn.orderRef")}: {orderRef}
          </p>
        )}
      </div>

      {hasBookingDetails && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-[#62a0f6]" />
              {t("step6.bookingDetails")}
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">
                  {bookingData.selectedPatients?.map((p) => p.name).join(", ")}
                </span>
                <span className="text-gray-600">{t("step5.patientName")}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">
                  {bookingData.selectedDoctor?.name || t("step5.notSpecified")}
                </span>
                <span className="text-gray-600">{t("step6.treatingDoctor")}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-[#62a0f6]" />
              {t("step6.locationAndSchedule")}
            </h2>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">
                  {bookingData.selectedLocation?.title || t("step5.notSpecified")}
                </p>
              </div>
              <div className="space-y-2">
                {bookingData.selectedDates?.map((dateTime, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{dateTime.date}</span>
                    <span>-</span>
                    <span>{dateTime.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 lg:col-span-2">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-[#62a0f6]" />
              {t("step6.paymentSummary")}
            </h2>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                ✅ {t("step6.paymentSuccess")} {t("step6.via")}{" "}
                {bookingData.paymentMethod === "tamara"
                  ? t("step5.tamaraPayment")
                  : t("step5.telrPayment")}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {hasBookingDetails && (
          <button
            type="button"
            onClick={handleDownloadReceipt}
            data-gtm-event="receipt_download"
            data-gtm-location="payment_success"
            className="flex items-center justify-center gap-2 px-8 py-3 border border-[#62a0f6] text-[#62a0f6] rounded-lg hover:bg-[#eff6fe] transition-colors"
          >
            <Download className="w-5 h-5" />
            {t("step6.downloadReceipt")}
          </button>
        )}
        <button
          type="button"
          onClick={handleGoHome}
          data-gtm-event="go_home_click"
          data-gtm-location="payment_success"
          className="flex items-center justify-center gap-2 px-8 py-3 bg-[#143087] text-white rounded-lg hover:bg-[#0f2470] transition-colors"
        >
          <Home className="w-5 h-5" />
          {t("step6.goHome")}
        </button>
      </div>
    </div>
  );
}
