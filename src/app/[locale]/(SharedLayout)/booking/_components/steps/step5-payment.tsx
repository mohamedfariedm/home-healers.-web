"use client";
import { useCallback, useEffect, useState } from "react";
import { CreditCard, Receipt, Tag, Gift, Check, Banknote, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { BookingData } from "@/types/booking";
import { toast } from "sonner";
import ClientAPI from "@/app/api/api";
import AcceptedCardBrands from "@/components/payments/AcceptedCardBrands";
import TamaraLogo from "@/components/payments/TamaraLogo";
import TabbyLogo from "@/components/payments/TabbyLogo";
import TelrSeamlessPanel from "@/components/payments/TelrSeamlessPanel";
import { parseTamaraConfig } from "@/lib/tamara";
import {
  isTelrAlreadyPaidError,
  isTelrReservationNotPayableError,
  isTelrSessionExpiredError,
  startTabbyHostedRedirect,
} from "@/lib/telr-seamless";
import { isClientApiError } from "@/lib/client-api-error";
import {
  applyPaymentMethodToPricing,
  applyPaymentSummaryToBooking,
  extractApiMessage,
  getPaymentMethodAvailability,
  normalizeCheckoutPaymentMethod,
  type PaymentSummaryData,
} from "@/lib/payment-summary";
import BookingStepNav from "../booking-step-nav";

interface Step5Props {
  bookingData: BookingData;
  updateBookingData: (
    updates:
      | Partial<BookingData>
      | ((prev: BookingData) => Partial<BookingData>)
  ) => void;
  reservationId?: number | null;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
  /** Hosted Telr HPP redirect (Tabby / Apple Pay / full Telr page) */
  onHostedTelrPay?: () => void | Promise<void>;
  /** Start Tamara BNPL checkout (full-page redirect) */
  onTamaraPay?: () => void | Promise<void>;
  /** After Seamless pay is backend-verified as paid */
  onSeamlessPaid?: (meta: {
    paymentId?: string | null;
    reservationId: number;
  }) => void;
}

export default function Step5Payment({
  bookingData,
  updateBookingData,
  reservationId,
  onNext,
  onPrev,
  isLoading,
  onHostedTelrPay,
  onTamaraPay,
  onSeamlessPaid,
}: Step5Props) {
  const { t, i18n } = useTranslation("booking");
  const authToken = undefined;

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isCouponsLoading, setIsCouponsLoading] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isRemovingCoupon, setIsRemovingCoupon] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [seamlessOpen, setSeamlessOpen] = useState(false);
  const [tamaraEnabled, setTamaraEnabled] = useState(false);
  const [tabbyBusy, setTabbyBusy] = useState(false);

  const locale = i18n.language?.startsWith("en") ? "en" : "ar";
  const selectedPaymentMethod = normalizeCheckoutPaymentMethod(
    bookingData.paymentMethod
  );
  const showCardCheckout =
    Boolean(reservationId) && selectedPaymentMethod === "card";
  const showTabbyCheckout =
    Boolean(reservationId) && selectedPaymentMethod === "tabby";
  const showApplePayCheckout =
    Boolean(reservationId) && selectedPaymentMethod === "apple_pay";
  const showTamaraCheckout =
    Boolean(reservationId) && selectedPaymentMethod === "tamara";

  const summaryHasTamara =
    !bookingData.paymentSummaryMethods?.length ||
    bookingData.paymentSummaryMethods.some((m) => m.type === "tamara");

  const paymentMethods = [
    {
      id: "card",
      name: t("step5.cardPayment"),
      icon: <CreditCard className="w-6 h-6 text-[#62a0f6]" />,
      description: t("step5.cardDesc"),
      brands: true as const,
    },
    {
      id: "tabby",
      name: t("step5.tabbyPayment"),
      icon: <TabbyLogo />,
      description: t("step5.tabbyDesc"),
    },
    {
      id: "apple_pay",
      name: t("step5.applePayPayment"),
      icon: (
        <span className="inline-flex h-6 min-w-[2.25rem] items-center justify-center rounded bg-black px-1.5 text-[10px] font-semibold text-white">
          Pay
        </span>
      ),
      description: t("step5.applePayDesc"),
    },
    ...(tamaraEnabled && summaryHasTamara
      ? [
          {
            id: "tamara",
            name: t("step5.tamaraPayment"),
            icon: <TamaraLogo className="rounded-lg" />,
            description: t("step5.tamaraDesc"),
          },
        ]
      : []),
    {
      id: "cash",
      name: t("step5.cash"),
      icon: <Banknote className="w-6 h-6 text-[#62a0f6]" />,
      description: t("step5.cashDesc"),
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
      methodId
    );
    return available && !insufficientBalance;
  };

  const getMethodDisabledReason = (methodId: string) => {
    const { available, insufficientBalance } = getPaymentMethodAvailability(
      summaryMethods,
      methodId
    );
    if (insufficientBalance) return t("step5.walletInsufficient");
    if (!available) return t("step5.methodUnavailable");
    return "";
  };

  const refreshPaymentSummary = useCallback(async () => {
    if (!reservationId) return;

    setIsSummaryLoading(true);
    try {
      const response = await ClientAPI.getPaymentSummary(
        reservationId,
        locale,
        authToken
      );
      if (response?.status === false || !response?.data) {
        if (response?.status === false) {
          toast.error(
            extractApiMessage(response, t("messages.reservationWithoutClient"))
          );
        }
        return;
      }
      updateBookingData((prev) =>
        applyPaymentSummaryToBooking(
          prev,
          response.data as PaymentSummaryData,
          prev.paymentMethod
        )
      );
    } catch (error) {
      console.error("Failed to load payment summary:", error);
    } finally {
      setIsSummaryLoading(false);
    }
  }, [reservationId, locale, authToken, updateBookingData, t]);

  useEffect(() => {
    if (bookingData.couponCode) {
      setCouponInput(bookingData.couponCode);
    }
  }, [bookingData.couponCode]);

  useEffect(() => {
    if (reservationId) {
      refreshPaymentSummary();
    }
    // Load summary once when reservation is ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservationId]);

  useEffect(() => {
    let cancelled = false;
    const loadTamara = async () => {
      try {
        const response = await ClientAPI.getTamaraConfig(locale);
        const config = parseTamaraConfig(response);
        if (!cancelled) {
          setTamaraEnabled(Boolean(config?.enabled));
        }
      } catch {
        if (!cancelled) setTamaraEnabled(false);
      }
    };
    void loadTamara();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        setIsCouponsLoading(true);
        const response = await ClientAPI.getCoupons(locale, undefined, authToken);
        const list = Array.isArray(response?.data) ? response.data : [];
        setCoupons(list);
      } catch (error) {
        console.error("Failed to load coupons:", error);
        setCoupons([]);
      } finally {
        setIsCouponsLoading(false);
      }
    };
    loadCoupons();
  }, [locale, authToken]);

  useEffect(() => {
    if (!bookingData.selectedPackage) return;
    if (
      bookingData.couponCode ||
      bookingData.couponId ||
      bookingData.couponType ||
      bookingData.couponValue
    ) {
      updateBookingData({
        couponCode: "",
        couponId: undefined,
        couponType: undefined,
        couponValue: undefined,
      });
    }
    setCouponInput("");
    setCouponError("");
  }, [
    bookingData.selectedPackage,
    bookingData.couponCode,
    bookingData.couponId,
    bookingData.couponType,
    bookingData.couponValue,
    updateBookingData,
  ]);

  const handlePaymentMethodChange = (method: string) => {
    if (!isMethodSelectable(method)) return;
    updateBookingData((prev) => applyPaymentMethodToPricing(prev, method));
  };

  useEffect(() => {
    if (bookingData.paymentMethod === "telr") {
      updateBookingData((prev) => applyPaymentMethodToPricing(prev, "card"));
    }
  }, [bookingData.paymentMethod, updateBookingData]);

  useEffect(() => {
    if (!bookingData.paymentSummaryMethods?.length) return;
    if (isMethodSelectable(selectedPaymentMethod)) return;

    const fallback = paymentMethods.find((method) =>
      isMethodSelectable(method.id)
    );
    if (fallback && fallback.id !== selectedPaymentMethod) {
      updateBookingData((prev) =>
        applyPaymentMethodToPricing(prev, fallback.id)
      );
    }
  }, [
    selectedPaymentMethod,
    bookingData.paymentSummaryMethods,
    updateBookingData,
  ]);

  const startTabbyPay = async () => {
    if (!reservationId || tabbyBusy) return;
    setTabbyBusy(true);
    try {
      const { redirectUrl } = await startTabbyHostedRedirect({
        reservationId,
        locale,
      });
      if (typeof window !== "undefined") {
        window.location.assign(redirectUrl);
      }
    } catch (error: unknown) {
      if (isTelrAlreadyPaidError(error)) {
        onSeamlessPaid?.({ paymentId: null, reservationId });
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
      toast.error(
        (isClientApiError(error) && error.message) ||
          (error instanceof Error ? error.message : t("messages.paymentFailed"))
      );
    } finally {
      setTabbyBusy(false);
    }
  };

  const findCouponByCode = (code: string) =>
    coupons.find((coupon: any) => {
      const candidate = String(
        coupon?.code ?? coupon?.coupon_code ?? coupon?.name ?? ""
      ).trim();
      return candidate.toLowerCase() === code.toLowerCase();
    });

  const applyCoupon = async () => {
    if (bookingData.selectedPackage) return;

    const code = couponInput.trim();
    if (!code) {
      setCouponError(t("step5.enterCouponCode"));
      return;
    }

    if (!reservationId) {
      const message = t("step5.reservationIdMissing");
      setCouponError(message);
      toast.error(message);
      return;
    }

    let matched = findCouponByCode(code);

    if (!matched) {
      try {
        const searchResponse = await ClientAPI.getCoupons(
          locale,
          { name: code, limit: 20, page: 1 },
          authToken
        );
        const searchList = Array.isArray(searchResponse?.data)
          ? searchResponse.data
          : [];
        matched =
          searchList.find(
            (coupon: any) =>
              String(coupon?.code ?? "").toLowerCase() === code.toLowerCase()
          ) ??
          searchList.find((coupon: any) =>
            String(coupon?.code ?? coupon?.name ?? "")
              .toLowerCase()
              .includes(code.toLowerCase())
          );
      } catch {
        // Fall through to not-found handling below
      }
    }

    if (!matched?.id) {
      const message = t("step5.couponNotFound");
      setCouponError(message);
      toast.error(message);
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError("");

    try {
      const applyResponse = await ClientAPI.applyCouponOnReservation(
        { reservationId, coupon_id: String(matched.id) },
        locale,
        authToken
      );

      const appliedCode = String(
        matched.code ?? matched.coupon_code ?? code
      );

      updateBookingData((prev) => ({
        ...prev,
        couponCode: appliedCode,
        couponId: String(matched.id),
      }));
      setCouponInput(appliedCode);

      const summaryResponse = await ClientAPI.getPaymentSummary(
        reservationId,
        locale,
        authToken
      );

      if (summaryResponse?.data) {
        updateBookingData((prev) =>
          applyPaymentSummaryToBooking(
            prev,
            summaryResponse.data as PaymentSummaryData,
            prev.paymentMethod
          )
        );
      }

      const successMessage = extractApiMessage(
        applyResponse,
        t("step5.couponApplied")
      );
      toast.success(successMessage);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : t("step5.couponApplyFailed");
      setCouponError(message);
      toast.error(message);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = async () => {
    if (bookingData.selectedPackage) return;

    if (!reservationId || !bookingData.couponId) {
      updateBookingData({
        couponCode: "",
        couponId: undefined,
        couponType: undefined,
        couponValue: undefined,
      });
      setCouponInput("");
      setCouponError("");
      return;
    }

    setIsRemovingCoupon(true);
    setCouponError("");

    try {
      const removeResponse = await ClientAPI.removeCouponFromReservation(
        { reservationId, coupon_id: bookingData.couponId },
        locale,
        authToken
      );

      const summaryResponse = await ClientAPI.getPaymentSummary(
        reservationId,
        locale,
        authToken
      );

      if (summaryResponse?.data) {
        updateBookingData((prev) =>
          applyPaymentSummaryToBooking(
            prev,
            summaryResponse.data as PaymentSummaryData,
            prev.paymentMethod
          )
        );
      } else {
        updateBookingData({
          couponCode: "",
          couponId: undefined,
          couponType: undefined,
          couponValue: undefined,
        });
      }

      const successMessage = extractApiMessage(
        removeResponse,
        t("step5.couponRemoved")
      );
      toast.success(successMessage);
      setCouponInput("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : t("step5.couponRemoveFailed");
      setCouponError(message);
      toast.error(message);
    } finally {
      setIsRemovingCoupon(false);
    }
  };

  const displayBaseAmount = bookingData.pricing.subTotal;
  const couponDiscountAmount = bookingData.pricing.couponDiscount ?? 0;
  const nationalityTax = bookingData.pricing.tax ?? 0;
  const providerDiscount = bookingData.pricing.discount ?? 0;
  const providerFees = bookingData.pricing.fees ?? 0;
  const invoiceTotal = bookingData.pricing.total;

  const packageListPrice =
    bookingData.selectedPackage &&
    Number.parseFloat(String(bookingData.selectedPackage.discount)) > 0
      ? Number.parseFloat(String(bookingData.selectedPackage.discount))
      : 0;

  const couponBusy = isApplyingCoupon || isRemovingCoupon;
  const hasAppliedCoupon =
    Boolean(bookingData.couponCode && bookingData.couponId) ||
    (bookingData.pricing.couponDiscount ?? 0) > 0;

  return (
    <div className="relative" data-tour="tour-payment" data-booking-step>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Booking Summary & Payment Methods */}
      <div className="space-y-6">
        {/* Booking Summary */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Receipt className="w-6 h-6 text-[#62a0f6]" />
            <h2 className="text-xl font-bold">{t("step5.bookingSummary")}</h2>
          </div>
          <div className="space-y-4 p-4 bg-[#eff6fe] rounded-lg">
            <div className="flex justify-between">
              <span className="font-medium">
                {bookingData.selectedPatients?.[0]?.name || t("step5.patient")}
              </span>
              <span className="text-gray-600">{t("step5.patientName")}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">
                {bookingData.selectedDoctor?.name || t("step5.doctor")}
              </span>
              <span className="text-gray-600">{t("step5.selectedDoctor")}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">
                {bookingData.healthInfo.painLocation || t("step5.notSpecified")}
              </span>
              <span className="text-gray-600">{t("step5.healthIssue")}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">
                {bookingData.selectedLocation?.title || t("step5.notSpecified")}
              </span>
              <span className="text-gray-600">{t("step5.visitLocation")}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">
                {bookingData.selectedDates.length} {t("step5.appointment")}
              </span>
              <span className="text-gray-600">{t("step5.appointmentsCount")}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">
                {bookingData.sessionsCount} {t("step5.session")}
              </span>
              <span className="text-gray-600">{t("step5.sessionsCount")}</span>
            </div>
            {bookingData.selectedPackage && (
              <div className="flex justify-between">
                <span className="font-medium">
                  {bookingData.selectedPackage.name || t("step5.notSpecified")}
                </span>
                <span className="text-gray-600">{t("step5.selectedPackage")}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-[#62a0f6]" />
            <h2 className="text-xl font-bold">{t("step5.paymentMethod")}</h2>
          </div>
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const selectable = isMethodSelectable(method.id);
              const disabledReason = getMethodDisabledReason(method.id);
              const isSelected = selectedPaymentMethod === method.id;

              return (
              <button
                key={method.id}
                type="button"
                onClick={() => handlePaymentMethodChange(method.id)}
                disabled={isSummaryLoading || couponBusy || !selectable}
                className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 text-start ${
                  isSelected
                    ? "border-[#62a0f6] bg-[#eff6fe]"
                    : selectable
                      ? "border-gray-200 hover:border-[#62a0f6]"
                      : "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center shrink-0">
                  {isSelected && (
                    <Check className="w-4 h-4 text-[#62a0f6]" />
                  )}
                </div>
                <span className="shrink-0">{method.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="flex flex-wrap items-center gap-2 font-medium">
                    <span>{method.name}</span>
                    {"brands" in method && method.brands ? (
                      <AcceptedCardBrands />
                    ) : null}
                  </span>
                  {method.description && (
                    <span className="text-sm text-gray-500 block mt-0.5">
                      {method.description}
                    </span>
                  )}
                  {disabledReason && (
                    <span className="text-sm text-red-600 block mt-0.5">
                      {disabledReason}
                    </span>
                  )}
                </div>
              </button>
            );
            })}
          </div>
        </div>
      </div>

      {/* Right Column - Pricing & Coupon */}
      <div className="space-y-6">
        {/* Coupon Section (hidden for package bookings) */}
        {!bookingData.selectedPackage && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <Tag className="w-6 h-6 text-[#62a0f6]" />
              <h2 className="text-xl font-bold">{t("step5.couponSection")}</h2>
            </div>
            <div className="space-y-4">
              <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => {
                    if (hasAppliedCoupon) return;
                    setCouponInput(e.target.value);
                    if (couponError) setCouponError("");
                  }}
                  placeholder={t("step5.enterCouponCode")}
                  readOnly={hasAppliedCoupon}
                  disabled={
                    couponBusy ||
                    !reservationId ||
                    isCouponsLoading ||
                    hasAppliedCoupon
                  }
                  className={`min-w-0 flex-1 p-3 border rounded-lg text-start focus:outline-none focus:ring-2 focus:ring-[#62a0f6] disabled:bg-gray-100 ${
                    hasAppliedCoupon
                      ? "border-green-300 bg-green-50 text-green-800"
                      : "border-gray-300"
                  }`}
                />
                {hasAppliedCoupon ? (
                  <button
                    type="button"
                    onClick={removeCoupon}
                    disabled={isRemovingCoupon || !reservationId}
                    className="shrink-0 px-4 sm:px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isRemovingCoupon && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    {t("step5.removeCoupon")}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={
                      couponBusy || !reservationId || isCouponsLoading
                    }
                    className="shrink-0 px-4 sm:px-6 py-3 bg-[#62a0f6] text-white rounded-lg hover:bg-[#5090e6] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isApplyingCoupon && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    {t("step5.applyCoupon")}
                  </button>
                )}
              </div>
              {hasAppliedCoupon && (
                <p className="text-sm text-green-600">{t("step5.couponApplied")}</p>
              )}
              {couponError && (
                <p className="text-red-600 text-sm">{couponError}</p>
              )}
            </div>
          </div>
        )}

        {/* Pricing Summary */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Gift className="w-6 h-6 text-[#62a0f6]" />
            <h2 className="text-xl font-bold">{t("step5.invoiceSummary")}</h2>
            {isSummaryLoading && (
              <Loader2 className="w-4 h-4 animate-spin text-[#62a0f6]" />
            )}
          </div>
          <div className="space-y-4 p-4 bg-[#eff6fe] rounded-lg">
            <div className="flex justify-between">
              <span className="font-medium">
                {displayBaseAmount} {t("step5.currency")}
              </span>
              <span className="text-gray-600">{t("step5.baseAmount")}</span>
            </div>
            {bookingData.selectedPackage &&
              packageListPrice > displayBaseAmount && (
                <p className="text-sm text-gray-500 text-right">
                  {t("step2.insteadOf")}{" "}
                  <span className="line-through">
                    {packageListPrice} {t("step5.currency")}
                  </span>
                </p>
              )}

            {bookingData.selectedPackage && bookingData.pricing.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="font-medium">
                  {bookingData.pricing.discount} {t("step5.currency")}
                </span>
                <span>{t("step5.packageSavings")}</span>
              </div>
            )}

            {!bookingData.selectedPackage && providerDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="font-medium">
                  -{providerDiscount} {t("step5.currency")}
                </span>
                <span>{t("step5.paymentMethodDiscount")}</span>
              </div>
            )}

            {couponDiscountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="font-medium">
                  -{couponDiscountAmount} {t("step5.currency")}
                </span>
                <span>{t("step5.couponDiscount")}</span>
              </div>
            )}

            {nationalityTax > 0 && (
              <div className="flex justify-between">
                <span className="font-medium">
                  {nationalityTax} {t("step5.currency")}
                </span>
                <span className="text-gray-600">{t("step5.nationalityTax")}</span>
              </div>
            )}

            {providerFees > 0 && (
              <div className="flex justify-between">
                <span className="font-medium">
                  {providerFees} {t("step5.currency")}
                </span>
                <span className="text-gray-600">{t("step5.providerFees")}</span>
              </div>
            )}

            <div className="border-t border-gray-300 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-[#62a0f6]">
                  {invoiceTotal} {t("step5.currency")}
                </span>
                <span>{t("step5.totalAmount")}</span>
              </div>
            </div>
          </div>
        </div>

        {showCardCheckout && reservationId ? (
          <TelrSeamlessPanel
            open={seamlessOpen}
            onOpenChange={setSeamlessOpen}
            reservationId={reservationId}
            amount={invoiceTotal}
            locale={locale}
            initialMethod="card"
            methodsFilter={["card"]}
            customerEmail={
              bookingData.selectedPatients?.find((p) => p.email?.trim())
                ?.email || null
            }
            onHostedFallback={async () => {
              if (onHostedTelrPay) {
                await onHostedTelrPay();
                return;
              }
              onNext();
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
              onNext();
            }}
          />
        ) : null}

        {/* Payment Button - moved to floating nav */}
      </div>
    </div>

    <BookingStepNav
      onPrev={onPrev}
      onNext={() => {
        if (showCardCheckout) {
          setSeamlessOpen(true);
          return;
        }
        if (showTabbyCheckout) {
          void startTabbyPay();
          return;
        }
        if (showApplePayCheckout && onHostedTelrPay) {
          void onHostedTelrPay();
          return;
        }
        if (showTamaraCheckout && onTamaraPay) {
          void onTamaraPay();
          return;
        }
        onNext();
      }}
      prevDisabled={isLoading || couponBusy || tabbyBusy}
      nextDisabled={
        !selectedPaymentMethod ||
        !isMethodSelectable(selectedPaymentMethod) ||
        isLoading ||
        couponBusy ||
        isSummaryLoading ||
        tabbyBusy
      }
        nextContent={
          isLoading || tabbyBusy ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              {t("step5.processing")}
            </>
          ) : selectedPaymentMethod === "cash" ? (
            <>
              <Banknote className="w-5 h-5" />
              {t("step5.confirmCash")}
            </>
          ) : showTamaraCheckout ? (
            <>
              <TamaraLogo light />
              {t("step5.payWithTamara")}
            </>
          ) : showTabbyCheckout ? (
            <>
              <TabbyLogo className="bg-white/20 [&_span:not(.sr-only)]:text-white" />
              {t("step5.payWithTabby")}
            </>
          ) : showApplePayCheckout ? (
            <>
              <span className="inline-flex h-5 items-center rounded bg-black/80 px-1.5 text-[10px] font-semibold">
                Pay
              </span>
              {t("step5.payWithApplePay")}
            </>
          ) : showCardCheckout ? (
            <>
              <CreditCard className="w-5 h-5" />
              {t("step5.payWithCard")}
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              {t("step5.confirmPayment")}
            </>
          )
        }
        nextLabel={
          selectedPaymentMethod === "cash"
            ? t("step5.confirmCash")
            : showTamaraCheckout
              ? t("step5.payWithTamara")
              : showTabbyCheckout
                ? t("step5.payWithTabby")
                : showApplePayCheckout
                  ? t("step5.payWithApplePay")
                  : showCardCheckout
                    ? t("step5.payWithCard")
                    : t("step5.confirmPayment")
        }
      />
    </div>
  );
}
