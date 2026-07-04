"use client";

import { useEffect, useState } from "react";
import { Ban, Home, RefreshCw, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from "@/Hooks/use-local-storage";
import { useRouter } from "next/navigation";
import type { BookingData } from "@/types/booking";
import ClientAPI from "@/app/api/api";
import { extractTelrRedirectUrl } from "@/lib/payment-api";
import { getPersistedReservationId } from "@/lib/checkout-storage";
import { useTranslation } from "react-i18next";

type PaymentCanceledProps = {
  orderRef?: string;
};

export default function PaymentCanceled({ orderRef }: PaymentCanceledProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation("booking");
  const locale = i18n.language?.startsWith("en") ? "en" : "ar";
  const [bookingData] = useLocalStorage<BookingData>("bookingData", {} as BookingData);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const persistedId = getPersistedReservationId();
    if (!persistedId) {
      toast.error(t("messages.reservationIdMissing"));
      router.push("/");
      return;
    }
    setReservationId(persistedId);
    setIsChecking(false);
  }, [router, t]);

  const handleRetryPayment = async () => {
    if (!reservationId) {
      toast.error(t("messages.reservationIdMissing"));
      return;
    }

    try {
      setIsLoading(true);
      await ClientAPI.getPaymentSummary(reservationId, locale);
      const response = await ClientAPI.payReservationWithTelr(reservationId, locale);
      const redirectUrl = extractTelrRedirectUrl(response);
      router.push(redirectUrl);
    } catch (error: unknown) {
      console.error("Retry Payment Error:", error);
      const message =
        error instanceof Error ? error.message : t("messages.paymentFailed");
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };

  if (isChecking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-[#143087]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-12" dir="rtl">
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Ban className="w-12 h-12 text-amber-600" />
        </div>
        <h1 className="text-3xl font-bold text-amber-800 mb-4">
          {t("paymentReturn.canceledTitle")}
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          {t("paymentReturn.canceledMessage")}
        </p>
        {reservationId && (
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-50 border border-amber-200 rounded-lg">
            <span className="text-amber-800 font-medium">{t("step6.reservationNumber")}:</span>
            <span className="text-amber-700 font-bold">HH-{reservationId}</span>
          </div>
        )}
        {orderRef && (
          <p className="text-sm text-gray-500 mt-3">
            {t("paymentReturn.orderRef")}: {orderRef}
          </p>
        )}
      </div>

      {bookingData && Object.keys(bookingData).length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <User className="w-6 h-6 text-[#62a0f6]" />
            {t("paymentReturn.bookingSummary")}
          </h2>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">
              {bookingData.pricing?.total ?? 0} {t("step5.currency")}
            </span>
            <span className="text-gray-600">{t("step5.totalAmount")}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleRetryPayment}
          disabled={isLoading || !reservationId}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-[#62a0f6] text-white rounded-lg hover:bg-[#5090e6] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t("step5.processing")}
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              {t("paymentReturn.retryPayment")}
            </>
          )}
        </button>
        <button
          onClick={handleGoHome}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-[#143087] text-white rounded-lg hover:bg-[#0f2470] transition-colors"
        >
          <Home className="w-5 h-5" />
          {t("step6.goHome")}
        </button>
      </div>
    </div>
  );
}
