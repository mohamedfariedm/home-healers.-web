"use client";
import { useEffect, useState } from "react";
import { CreditCard, Receipt, Tag, Gift, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { BookingData } from "@/types/booking";
import { toast } from "sonner";
import ClientAPI from "@/app/api/api";

interface Step5Props {
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  reservationId?: number | null;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export default function Step5Payment({
  bookingData,
  updateBookingData,
  reservationId,
  onNext,
  onPrev,
  isLoading,
}: Step5Props) {
  const { t, i18n } = useTranslation("booking");
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isCouponsLoading, setIsCouponsLoading] = useState(false);

  const paymentMethods = [
    // { id: "cash_on_delivery", name: t("step5.cashOnDelivery"), icon: <FaCashRegister className="w-6 h-6" /> },
    { id: "apple_pay", name: "Apple Pay", icon: "🍎" },
    { id: "telr", name: t("step5.telrPayment"), icon: "💳" },
  ];

  const handlePaymentMethodChange = (method: string) => {
    updateBookingData({ paymentMethod: method });
  };

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        setIsCouponsLoading(true);
        const locale = i18n.language?.startsWith("en") ? "en" : "ar";
        const response = await ClientAPI.getCoupons(locale);
        const list = Array.isArray(response?.data) ? response.data : [];
        setCoupons(list);
        console.log("coupons response:", response);
      } catch (error) {
        console.error("Failed to load coupons:", error);
        setCoupons([]);
      } finally {
        setIsCouponsLoading(false);
      }
    };
    loadCoupons();
  }, [i18n.language]);

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

  const extractCouponTypeAndValue = (coupon: any) => {
    const rawType = String(
      coupon?.discount_type ??
      coupon?.type ??
      coupon?.value_type ??
      ""
    ).toLowerCase();
    const type: "percentage" | "fixed" =
      rawType.includes("percent") ||
      rawType.includes("percentage") ||
      rawType.includes("نسب") ||
      rawType.includes("مئوي") ||
      rawType.includes("مئويه")
        ? "percentage"
        : "fixed";

    const rawValue =
      coupon?.discount ??
      coupon?.value ??
      coupon?.amount ??
      coupon?.discount_value ??
      coupon?.percentage ??
      coupon?.percent ??
      0;

    return { type, value: Number(rawValue) || 0 };
  };

  const applyCoupon = async () => {
    if (bookingData.selectedPackage) {
      return;
    }

    const code = couponInput.trim();
    if (!code) {
      setCouponError(t("step5.enterCouponCode") || "Please enter coupon code");
      return;
    }

    const matched = coupons.find((coupon: any) => {
      const candidate = String(
        coupon?.code ?? coupon?.coupon_code ?? coupon?.name ?? ""
      ).trim();
      return candidate.toLowerCase() === code.toLowerCase();
    });

    if (!matched) {
      const message =
        t("step5.couponNotFound") || "Coupon doesn't exist";
      setCouponError(message);
      toast.error(message);
      return;
    }

    const { type, value } = extractCouponTypeAndValue(matched);
    if (value <= 0) {
      const message =
        t("step5.invalidCoupon") || "Coupon is invalid";
      setCouponError(message);
      toast.error(message);
      return;
    }

    const { subTotal, fees, tax, discount } = bookingData.pricing;
    const payableBeforeCoupon = Math.max(
      0,
      subTotal + fees + tax - discount
    );
    const potentialDiscount =
      type === "percentage"
        ? Math.round((subTotal * value) / 100)
        : value;
    if (
      payableBeforeCoupon <= 0 ||
      potentialDiscount >= payableBeforeCoupon
    ) {
      const message =
        t("step5.couponExceedsOrEqualsTotal") ||
        "This coupon cannot be applied because the discount is greater than or equal to your order total.";
      setCouponError(message);
      toast.error(message);
      return;
    }

    if (!reservationId) {
      const message =
        t("step5.reservationIdMissing") || "Reservation ID is required before applying coupon";
      setCouponError(message);
      toast.error(message);
      return;
    }

    const locale = i18n.language?.startsWith("en") ? "en" : "ar";
    const applyResponse = await ClientAPI.applyCouponOnReservation(
      { reservationId, coupon_id: matched.id },
      locale
    );
    console.log("apply coupon response:", applyResponse);

    updateBookingData({
      couponCode: code,
      couponId: matched.id,
      couponType: type,
      couponValue: value,
    });
    setCouponError("");
    toast.success(t("step5.couponApplied") || "Coupon applied successfully");
  };

  const removeCoupon = async () => {
    if (bookingData.selectedPackage) {
      return;
    }

    if (reservationId && bookingData.couponId) {
      const locale = i18n.language?.startsWith("en") ? "en" : "ar";
      const removeResponse = await ClientAPI.removeCouponFromReservation(
        { reservationId, coupon_id: bookingData.couponId },
        locale
      );
      console.log("remove coupon response:", removeResponse);
    }
    updateBookingData({
      couponCode: "",
      couponId: undefined,
      couponType: undefined,
      couponValue: undefined,
    });
    setCouponInput("");
    setCouponError("");
  };

  const couponDiscountRaw =
    bookingData.couponCode && bookingData.couponType && bookingData.couponValue
      ? bookingData.couponType === "percentage"
        ? Math.round((bookingData.pricing.subTotal * bookingData.couponValue) / 100)
        : bookingData.couponValue
      : 0;
  const payableBeforeCoupon = bookingData.selectedPackage
    ? Math.max(
        0,
        bookingData.pricing.subTotal +
          bookingData.pricing.fees +
          bookingData.pricing.tax
      )
    : Math.max(
        0,
        bookingData.pricing.subTotal +
          bookingData.pricing.fees +
          bookingData.pricing.tax -
          bookingData.pricing.discount
      );
  const couponOverTotal =
    !bookingData.selectedPackage &&
    Boolean(
      bookingData.couponCode &&
        bookingData.couponType &&
        bookingData.couponValue
    ) &&
    (payableBeforeCoupon <= 0 || couponDiscountRaw >= payableBeforeCoupon);
  const couponDiscountAmount = couponOverTotal
    ? 0
    : Math.max(
        0,
        Math.min(couponDiscountRaw, bookingData.pricing.subTotal)
      );

  /** Payable session amount (matches how fees and total are calculated in booking-flow). */
  const displayBaseAmount = bookingData.pricing.subTotal;

  const packageListPrice =
    bookingData.selectedPackage &&
    Number.parseFloat(String(bookingData.selectedPackage.discount)) > 0
      ? Number.parseFloat(String(bookingData.selectedPackage.discount))
      : 0;

  const invoiceTotal = bookingData.selectedPackage
    ? Math.max(
        0,
        bookingData.pricing.subTotal +
          bookingData.pricing.fees +
          bookingData.pricing.tax -
          couponDiscountAmount
      )
    : Math.max(
        0,
        payableBeforeCoupon - couponDiscountAmount
      );



  return (
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
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => handlePaymentMethodChange(method.id)}
                className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                  bookingData.paymentMethod === method.id
                    ? "border-[#62a0f6] bg-[#eff6fe]"
                    : "border-gray-200 hover:border-[#62a0f6]"
                }`}
              >
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  {bookingData.paymentMethod === method.id && (
                    <Check className="w-4 h-4 text-[#62a0f6]" />
                  )}
                </div>
                {method.icon}
                <span className="font-medium">{method.name}</span>
              </button>
            ))}
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
              <h2 className="text-xl font-bold">{t("step5.couponSection") || "Discount Coupon"}</h2>
            </div>
            {bookingData.couponCode && !couponOverTotal ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-green-800">
                      {t("step5.couponApplied") || "Coupon applied"}
                    </p>
                    <p className="text-sm text-green-600">
                      {bookingData.couponCode}
                    </p>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    {t("step5.removeCoupon") || "Remove"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                       type="text"
                       value={couponInput}
                       onChange={(e) => setCouponInput(e.target.value)}
                       placeholder={t("step5.enterCouponCode") || "Enter coupon code"}
                       className="flex-1 p-3 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#62a0f6]"
                     />
                     <button
                       onClick={applyCoupon}
                       className="px-6 py-3 bg-[#62a0f6] text-white rounded-lg hover:bg-[#5090e6]"
                     >
                       {t("step5.applyCoupon") || "Apply"}
                     </button>
                   </div>
                   {couponOverTotal && bookingData.couponCode && (
                     <p className="text-red-600 text-sm">
                       {t("step5.couponExceedsOrEqualsTotal")}
                     </p>
                   )}
                   {couponError && (
                     <p className="text-red-600 text-sm">{couponError}</p>
                   )}
                   
                 </div>
               )}
             </div>
        )}
   
           {/* Pricing Summary */}
           <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Gift className="w-6 h-6 text-[#62a0f6]" />
          <h2 className="text-xl font-bold">{t("step5.invoiceSummary")}</h2>
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

          {/* رسوم الزيارة فقط للغير سعوديين */}
          {bookingData.pricing.fees > 0 && (
            <div className="flex justify-between">
              <span className="font-medium">
                {bookingData.pricing.fees} {t("step5.currency")}
              </span>
              <span className="text-gray-600">{t("step5.visitFees")}</span>
            </div>
          )}

          {bookingData.selectedPackage && bookingData.pricing.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span className="font-medium">
                {bookingData.pricing.discount} {t("step5.currency")}
              </span>
              <span>{t("step5.packageSavings")}</span>
            </div>
          )}
          {!bookingData.selectedPackage && bookingData.pricing.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span className="font-medium">
                -{bookingData.pricing.discount} {t("step5.currency")}
              </span>
              <span>{t("step5.discount")}</span>
            </div>
          )}

          {couponDiscountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span className="font-medium">
                -{couponDiscountAmount} {t("step5.currency")}
              </span>
              <span>{t("step5.couponDiscount") || "Coupon Discount"}</span>
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
   
           {/* Payment Button */}
           <button
             onClick={onNext}
             disabled={!bookingData.paymentMethod || isLoading}
             className="w-full p-4 bg-[#143087] text-white rounded-lg font-semibold text-lg hover:bg-[#0f2470] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
           >
             {isLoading ? (
               <>
                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                 {t("step5.processing")}
               </>
             ) : (
               <>
                 <CreditCard className="w-5 h-5" />
                 {t("step5.confirmPayment")}
               </>
             )}
           </button>
         </div>
   
         {/* Navigation */}
         <div className="lg:col-span-2 flex justify-between">
           <button
             onClick={onPrev}
             disabled={isLoading}
             className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
           >
             {t("step2.previous")}
           </button>
         </div>
       </div>
     );
   }