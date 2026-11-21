"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Home, RefreshCw, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from "@/Hooks/use-local-storage";
import { useRouter } from "next/navigation";
import type { BookingData } from "@/types/booking";
import ClientAPI from "@/app/api/api";
import { extractTelrRedirectUrl } from "@/lib/payment-api";
import {
  clearPendingPayment,
  getPersistedPendingPayment,
  getPersistedReservationId,
  persistPendingPayment,
} from "@/lib/checkout-storage";
import {
  mapTamaraStartError,
  pollTamaraOutcome,
  resolveTamaraCheckoutContext,
  startTamaraCheckoutRedirect,
  tamaraResultPath,
  TamaraAlreadyPaidError,
} from "@/lib/tamara";
import {
  isPaymentInProgressError,
  isTelrAlreadyPaidError,
  isTelrReservationNotPayableError,
  isTelrSessionExpiredError,
  pollTelrReturnOutcome,
  startTabbyHostedRedirect,
  verifyTelrReturnOutcome,
} from "@/lib/telr-seamless";
import { useTranslation } from "react-i18next";

type PaymentFailProps = {
  orderRef?: string;
};

type ViewState = "checking" | "confirming" | "failed";

export default function PaymentFail({ orderRef }: PaymentFailProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation("booking");
  const locale = i18n.language?.startsWith("en") ? "en" : "ar";
  const [bookingData] = useLocalStorage<BookingData>("bookingData", {} as BookingData);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<ViewState>("checking");
  const [isTamaraFlow, setIsTamaraFlow] = useState(false);
  const [isTelrTabbyFlow, setIsTelrTabbyFlow] = useState(false);
  const [retryBlocked, setRetryBlocked] = useState(false);

  useEffect(() => {
    const checkMaybePaid = async () => {
      const { reservationId: persistedId, pending, isTamara } =
        resolveTamaraCheckoutContext();
      const id = persistedId ?? getPersistedReservationId();
      if (!id) {
        toast.error(t("messages.reservationIdMissing"));
        router.push("/");
        return;
      }
      setReservationId(id);
      setIsTamaraFlow(isTamara);
      setIsTelrTabbyFlow(pending?.provider === "telr" && pending?.method === "tabby");

      try {
        if (isTamara) {
          const result = await pollTamaraOutcome({
            reservationId: id,
            locale,
            attemptId: pending?.attemptId,
            attempts: 3,
            intervalMs: 2000,
            stopOnTerminal: true,
          });

          if (result.outcome === "paid") {
            clearPendingPayment();
            router.replace(
              tamaraResultPath(
                locale,
                "success",
                orderRef ?? pending?.orderId ?? String(id)
              )
            );
            return;
          }

          if (result.outcome === "cancelled") {
            router.replace(
              tamaraResultPath(
                locale,
                "canceled",
                orderRef ?? pending?.orderId ?? String(id)
              )
            );
            return;
          }

          if (
            result.outcome === "pending" ||
            result.outcome === "unavailable" ||
            result.outcome === "unknown"
          ) {
            setView("confirming");
            setRetryBlocked(true);
            toast.message(t("paymentReturn.confirmingMessage"));
            return;
          }

          setView("failed");
          return;
        }

        const telrOutcome = await pollTelrReturnOutcome({
          reservationId: id,
          locale,
          attemptId: pending?.attemptId,
          attempts: 3,
          intervalMs: 2000,
        });

        if (telrOutcome === "paid") {
          clearPendingPayment();
          router.replace(
            `/${locale}/success/${encodeURIComponent(orderRef ?? String(id))}`
          );
          return;
        }

        if (telrOutcome === "pending" || telrOutcome === "unavailable") {
          setView("confirming");
          setRetryBlocked(true);
          toast.message(t("paymentReturn.confirmingMessage"));
          return;
        }

        setRetryBlocked(false);
        setView("failed");
      } catch (error) {
        console.error("Failed payment re-check:", error);
        setView("failed");
      }
    };

    void checkMaybePaid();
  }, [locale, orderRef, router, t]);

  const handleRefreshStatus = async () => {
    if (!reservationId) return;
    const pending = getPersistedPendingPayment();
    setView("checking");
    try {
      if (pending?.provider === "tamara" || isTamaraFlow) {
        const result = await pollTamaraOutcome({
          reservationId,
          locale,
          attemptId: pending?.attemptId,
          attempts: 4,
          intervalMs: 2000,
          stopOnTerminal: true,
        });
        if (result.outcome === "paid") {
          clearPendingPayment();
          router.replace(
            tamaraResultPath(
              locale,
              "success",
              orderRef ?? pending?.orderId ?? String(reservationId)
            )
          );
          return;
        }
        if (result.outcome === "cancelled") {
          router.replace(
            tamaraResultPath(
              locale,
              "canceled",
              orderRef ?? pending?.orderId ?? String(reservationId)
            )
          );
          return;
        }
        if (
          result.outcome === "pending" ||
          result.outcome === "unavailable" ||
          result.outcome === "unknown"
        ) {
          setRetryBlocked(true);
          setView("confirming");
          return;
        }
        setRetryBlocked(false);
        setView("failed");
        return;
      }

      const telrOutcome = await pollTelrReturnOutcome({
        reservationId,
        locale,
        attemptId: pending?.attemptId,
        attempts: 4,
        intervalMs: 2000,
      });
      if (telrOutcome === "paid") {
        clearPendingPayment();
        router.replace(
          `/${locale}/success/${encodeURIComponent(orderRef ?? String(reservationId))}`
        );
        return;
      }
      if (telrOutcome === "pending" || telrOutcome === "unavailable") {
        setRetryBlocked(true);
        setView("confirming");
        return;
      }
      setRetryBlocked(false);
      setView("failed");
    } catch {
      setView("confirming");
      toast.error(t("paymentReturn.verifyFailed"));
    }
  };

  const handleRetryPayment = async () => {
    if (!reservationId || retryBlocked) {
      if (retryBlocked) {
        toast.message(t("seamless.paymentInProgress"));
      } else {
        toast.error(t("messages.reservationIdMissing"));
      }
      return;
    }

    try {
      setIsLoading(true);
      const precheck = await verifyTelrReturnOutcome(
        reservationId,
        locale,
        getPersistedPendingPayment()?.attemptId
      );
      if (precheck === "paid") {
        router.replace(
          `/${locale}/success/${encodeURIComponent(orderRef ?? String(reservationId))}`
        );
        return;
      }
      if (precheck === "pending") {
        setRetryBlocked(true);
        setView("confirming");
        toast.message(t("seamless.paymentInProgress"));
        return;
      }

      await ClientAPI.getPaymentSummary(reservationId, locale);
      const pending = getPersistedPendingPayment();
      if (isTamaraFlow || pending?.provider === "tamara") {
        await startTamaraCheckoutRedirect({
          reservationId,
          locale,
        });
        return;
      }

      if (isTelrTabbyFlow || pending?.method === "tabby") {
        const { redirectUrl } = await startTabbyHostedRedirect({
          reservationId,
          locale,
          previous: pending,
        });
        window.location.assign(redirectUrl);
        return;
      }

      persistPendingPayment({
        reservationId,
        provider: "telr",
        method: "hpp",
      });
      const response = await ClientAPI.payReservationWithTelr(
        reservationId,
        locale
      );
      const redirectUrl = extractTelrRedirectUrl(response);
      router.push(redirectUrl);
    } catch (error: unknown) {
      console.error("Retry Payment Error:", error);
      if (
        error instanceof TamaraAlreadyPaidError ||
        isTelrAlreadyPaidError(error)
      ) {
        router.replace(
          `/${locale}/success/${encodeURIComponent(orderRef ?? String(reservationId))}`
        );
        return;
      }
      if (isPaymentInProgressError(error)) {
        setRetryBlocked(true);
        setView("confirming");
        toast.error(t("seamless.paymentInProgress"));
        return;
      }
      if (isTelrSessionExpiredError(error)) {
        toast.error(t("seamless.sessionExpired"));
        return;
      }
      if (isTelrReservationNotPayableError(error)) {
        toast.error(t("messages.reservationWithoutClient"));
        return;
      }
      if (isTamaraFlow || getPersistedPendingPayment()?.provider === "tamara") {
        const message = mapTamaraStartError(error, {
          alreadyPaid: t("tamara.alreadyPaid"),
          inProgress: t("tamara.paymentInProgress"),
          rejected: t("tamara.rejected"),
          unavailable: t("tamara.unavailable"),
          fallback: t("messages.paymentFailed"),
        });
        toast.error(message);
        return;
      }
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
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-12 h-12 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-red-800 mb-4">
          {t("paymentReturn.failTitle")}
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          {t("paymentReturn.failMessage")}
        </p>
        {reservationId && (
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-red-800 font-medium">{t("step6.reservationNumber")}:</span>
            <span className="text-red-600 font-bold">HH-{reservationId}</span>
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
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">
                {bookingData.selectedPatients?.map((p) => p.name).join(", ") ||
                  t("step5.notSpecified")}
              </span>
              <span className="text-gray-600">{t("step5.patientName")}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">
                {bookingData.pricing?.total ?? 0} {t("step5.currency")}
              </span>
              <span className="text-gray-600">{t("step5.totalAmount")}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          type="button"
          onClick={handleRetryPayment}
          disabled={isLoading || !reservationId || retryBlocked}
          data-gtm-event="payment_retry"
          data-gtm-location="payment_failed"
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
          type="button"
          onClick={handleGoHome}
          data-gtm-event="go_home_click"
          data-gtm-location="payment_failed"
          className="flex items-center justify-center gap-2 px-8 py-3 bg-[#143087] text-white rounded-lg hover:bg-[#0f2470] transition-colors"
        >
          <Home className="w-5 h-5" />
          {t("step6.goHome")}
        </button>
      </div>
    </div>
  );
}
