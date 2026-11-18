"use client";

import { useCallback, useEffect, useState } from "react";
import { Banknote, CreditCard, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import ClientAPI from "@/app/api/api";
import TamaraLogo from "@/components/payments/TamaraLogo";
import TelrLogo from "@/components/payments/TelrLogo";
import TelrSeamlessPanel from "@/components/payments/TelrSeamlessPanel";
import type { BookingData } from "@/types/booking";
import {
  applyPaymentMethodToPricing,
  applyPaymentSummaryToBooking,
  getPaymentMethodAvailability,
  type PaymentSummaryData,
} from "@/lib/payment-summary";
import { parseTamaraConfig } from "@/lib/tamara";
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
  onHostedTelrPay?: () => void | Promise<void>;
  onTamaraPay?: () => void | Promise<void>;
  onSeamlessPaid?: (meta: {
    paymentId?: string | null;
    reservationId: number;
  }) => void;
  customerEmail?: string | null;
};

export default function OfferPaymentPanel({
  locale,
  reservationId,
  bookingData,
  updateBookingData,
  onPay,
  isPaying,
  onHostedTelrPay,
  onTamaraPay,
  onSeamlessPaid,
  customerEmail,
}: OfferPaymentPanelProps) {
  const { t } = useTranslation(["offers", "booking"]);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [seamlessOpen, setSeamlessOpen] = useState(false);
  const [tamaraEnabled, setTamaraEnabled] = useState(false);

  const showSeamlessCheckout = bookingData.paymentMethod === "telr";
  const showTamaraCheckout = bookingData.paymentMethod === "tamara";

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

  useEffect(() => {
    let cancelled = false;
    const loadTamara = async () => {
      try {
        const response = await ClientAPI.getTamaraConfig(locale);
        const config = parseTamaraConfig(response);
        if (!cancelled) setTamaraEnabled(Boolean(config?.enabled));
      } catch {
        if (!cancelled) setTamaraEnabled(false);
      }
    };
    void loadTamara();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const summaryHasTamara =
    !bookingData.paymentSummaryMethods?.length ||
    bookingData.paymentSummaryMethods.some((m) => m.type === "tamara");

  const methods = [
    {
      id: "telr",
      name: t("step5.telrPayment", { ns: "booking" }),
      icon: <CreditCard className="size-5" />,
      description: t("step5.telrDesc", { ns: "booking" }),
    },
    ...(tamaraEnabled && summaryHasTamara
      ? [
          {
            id: "tamara",
            name: t("step5.tamaraPayment", { ns: "booking" }),
            icon: <TamaraLogo />,
            description: t("step5.tamaraDesc", { ns: "booking" }),
          },
        ]
      : []),
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

      {showSeamlessCheckout ? (
        <TelrSeamlessPanel
          open={seamlessOpen}
          onOpenChange={setSeamlessOpen}
          reservationId={reservationId}
          amount={invoiceTotal}
          locale={locale}
          customerEmail={
            customerEmail ||
            bookingData.selectedPatients?.find((p) => p.email?.trim())
              ?.email ||
            null
          }
          onHostedFallback={async () => {
            if (onHostedTelrPay) {
              await onHostedTelrPay();
              return;
            }
            onPay();
          }}
          onMethodRedirect={(url) => {
            if (typeof window !== "undefined") {
              window.location.assign(url);
            }
          }}
          onPaid={(meta) => {
            setSeamlessOpen(false);
            if (onSeamlessPaid) {
              onSeamlessPaid(meta);
              return;
            }
            onPay();
          }}
        />
      ) : null}

      <button
        type="button"
        onClick={() => {
          if (showSeamlessCheckout) {
            setSeamlessOpen(true);
            return;
          }
          if (showTamaraCheckout && onTamaraPay) {
            void onTamaraPay();
            return;
          }
          onPay();
        }}
        disabled={isPaying || !bookingData.paymentMethod}
        data-gtm-event="reservation_payment"
        data-gtm-location="offer_payment_panel"
        className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#62a0f6_0%,#2f6fd6_55%,#143087_100%)] text-base font-semibold text-white shadow-[0_14px_30px_rgba(47,111,214,0.28)] transition hover:brightness-105 disabled:opacity-60 md:col-span-2"
      >
        {isPaying ? (
          <Loader2 className="size-5 animate-spin" />
        ) : bookingData.paymentMethod === "cash" ? (
          t("step5.confirmCash", { ns: "booking" })
        ) : showTamaraCheckout ? (
          <>
            <TamaraLogo light />
            {t("step5.payWithTamara", { ns: "booking" })}
          </>
        ) : (
          <>
            <TelrLogo light showWordmark={false} className="[&_svg]:size-6" />
            {t("seamless.payWithTelr", { ns: "booking" })}
          </>
        )}
      </button>
    </div>
  );
}
