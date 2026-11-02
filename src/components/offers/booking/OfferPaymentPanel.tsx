"use client";

import { useCallback, useEffect, useState } from "react";
import { Banknote, CreditCard, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import ClientAPI from "@/app/api/api";
import type { BookingData } from "@/types/booking";
import {
  applyPaymentMethodToPricing,
  applyPaymentSummaryToBooking,
  getPaymentMethodAvailability,
  type PaymentSummaryData,
} from "@/lib/payment-summary";
import { formatOfferPrice } from "@/lib/offers";
import { cn } from "@/lib/utils";

type OfferPaymentPanelProps = {
  locale: string;
  reservationId: number;
  bookingData: BookingData;
  updateBookingData: (
    updates:
      | Partial<BookingData>
      | ((prev: BookingData) => Partial<BookingData>),
  ) => void;
  onPay: () => void;
  isPaying: boolean;
};

export default function OfferPaymentPanel({
  locale,
  reservationId,
  bookingData,
  updateBookingData,
  onPay,
  isPaying,
}: OfferPaymentPanelProps) {
  const { t } = useTranslation(["offers", "booking"]);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  const refreshPaymentSummary = useCallback(async () => {
    setIsSummaryLoading(true);
    try {
      const response = await ClientAPI.getPaymentSummary(reservationId, locale);
      if (response?.data) {
        updateBookingData((prev) =>
          applyPaymentSummaryToBooking(
            prev,
            response.data as PaymentSummaryData,
            prev.paymentMethod,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to load payment summary:", error);
    } finally {
      setIsSummaryLoading(false);
    }
  }, [locale, reservationId, updateBookingData]);

  useEffect(() => {
    refreshPaymentSummary();
  }, [refreshPaymentSummary]);

  const methods = [
    {
      id: "telr",
      name: t("step5.telrPayment", { ns: "booking" }),
      icon: <CreditCard className="size-5" />,
      description: t("step5.telrDesc", { ns: "booking" }),
    },
    {
      id: "cash",
      name: t("step5.cash", { ns: "booking" }),
      icon: <Banknote className="size-5" />,
      description: t("step5.cashDesc", { ns: "booking" }),
    },
  ];

  const summaryMethods = bookingData.paymentSummaryMethods?.map((method) => ({
    type: method.type,
    discount: method.discount,
    fees: method.fees,
    total: method.total,
    available: method.available,
    insufficient_balance: method.insufficient_balance,
  }));

  const isMethodSelectable = (methodId: string) => {
    const { available, insufficientBalance } = getPaymentMethodAvailability(
      summaryMethods,
      methodId,
    );
    return available && !insufficientBalance;
  };

  const invoiceTotal = bookingData.pricing.total;

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:gap-6">
      <section className="rounded-[28px] border border-[#e8eef8] bg-white p-5 shadow-[0_12px_40px_rgba(20,48,135,0.06)] sm:p-6 md:col-span-2">
        <h2 className="mb-4 text-lg font-bold text-[#143087]">
          {t("booking.paymentMethods")}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:max-w-xl">
          {methods.map((method) => {
            const selectable = isMethodSelectable(method.id);
            const active = bookingData.paymentMethod === method.id;
            return (
              <button
                key={method.id}
                type="button"
                disabled={!selectable}
                onClick={() =>
                  updateBookingData((prev) =>
                    applyPaymentMethodToPricing(prev, method.id),
                  )
                }
                className={cn(
                  "flex min-h-[7rem] w-full flex-col items-start gap-3 rounded-2xl border p-4 text-start transition-all",
                  active
                    ? "border-[#143087] bg-[#143087] text-white shadow-md shadow-[#143087]/20"
                    : "border-[#e4ebf7] bg-[#f8faff] text-[#1e1e1e] hover:border-[#143087]/40 hover:bg-white",
                  !selectable && "cursor-not-allowed opacity-50",
                )}
              >
                <span className={cn("rounded-xl p-2", active ? "bg-white/15 text-white" : "bg-white text-primary")}>
                  {method.icon}
                </span>
                <span>
                  <span className="block font-semibold">{method.name}</span>
                  <span className={cn("text-sm", active ? "text-white/80" : "text-[#4a5568]")}>
                    {method.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-[28px] border border-[#e8eef8] bg-white p-5 shadow-[0_12px_40px_rgba(20,48,135,0.06)] sm:p-6 md:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#143087]">
            {t("booking.invoice")}
          </h2>
          {isSummaryLoading ? (
            <Loader2 className="size-4 animate-spin text-[#143087]" />
          ) : null}
        </div>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-[#4a5568]">{t("booking.offer")}</dt>
            <dd className="font-medium text-[#1e1e1e]">
              {bookingData.selectedPackage?.name}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[#4a5568]">{t("step5.baseAmount", { ns: "booking" })}</dt>
            <dd>
              {formatOfferPrice(bookingData.pricing.subTotal, "SAR", locale)}
            </dd>
          </div>
          {bookingData.pricing.tax > 0 ? (
            <div className="flex justify-between gap-3">
              <dt className="text-[#4a5568]">
                {t("step5.nationalityTax", { ns: "booking" })}
              </dt>
              <dd>{formatOfferPrice(bookingData.pricing.tax, "SAR", locale)}</dd>
            </div>
          ) : null}
          {bookingData.pricing.fees > 0 ? (
            <div className="flex justify-between gap-3">
              <dt className="text-[#4a5568]">{t("step5.fees", { ns: "booking" })}</dt>
              <dd>{formatOfferPrice(bookingData.pricing.fees, "SAR", locale)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-3 border-t pt-3 text-base font-bold text-[#143087]">
            <dt>{t("step5.total", { ns: "booking" })}</dt>
            <dd>{formatOfferPrice(invoiceTotal, "SAR", locale)}</dd>
          </div>
        </dl>
      </section>

      <button
        type="button"
        onClick={onPay}
        disabled={isPaying || !bookingData.paymentMethod}
        data-gtm-event="reservation_payment"
        data-gtm-location="offer_payment_panel"
        className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-base font-semibold text-white disabled:opacity-60 md:col-span-2"
      >
        {isPaying ? (
          <Loader2 className="size-5 animate-spin" />
        ) : bookingData.paymentMethod === "cash" ? (
          t("step5.confirmCash", { ns: "booking" })
        ) : (
          t("booking.goToPayment")
        )}
      </button>
    </div>
  );
}
