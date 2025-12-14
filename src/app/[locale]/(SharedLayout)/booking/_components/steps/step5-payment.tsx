"use client";
import { useEffect, useState } from "react";
import { CreditCard, Receipt, Tag, Gift, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { BookingData } from "@/types/booking";
import { FaCashRegister } from "react-icons/fa";

interface Step5Props {
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export default function Step5Payment({
  bookingData,
  updateBookingData,
  onNext,
  onPrev,
  isLoading,
}: Step5Props) {
  const { t } = useTranslation("booking");
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  const paymentMethods = [
    // { id: "cash_on_delivery", name: t("step5.cashOnDelivery"), icon: <FaCashRegister className="w-6 h-6" /> },
    { id: "apple_pay", name: "Apple Pay", icon: "🍎" },
    { id: "telr", name: t("step5.telrPayment"), icon: "💳" },
  ];

  const handlePaymentMethodChange = (method: string) => {
    updateBookingData({ paymentMethod: method });
  };




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
        {/* Coupon Section */}
        {/* <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Tag className="w-6 h-6 text-[#62a0f6]" />
            <h2 className="text-xl font-bold">كوبون الخصم</h2>
          </div>
          {bookingData.couponCode ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-green-800">
                    تم تطبيق كود الخصم
                  </p>
                  <p className="text-sm text-green-600">
                    {bookingData.couponCode}
                  </p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  إزالة
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
                     placeholder="أدخل كود الخصم"
                     className="flex-1 p-3 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#62a0f6]"
                   />
                   <button
                     onClick={applyCoupon}
                     className="px-6 py-3 bg-[#62a0f6] text-white rounded-lg hover:bg-[#5090e6]"
                   >
                     تطبيق
                   </button>
                 </div>
                 {couponError && (
                   <p className="text-red-600 text-sm">{couponError}</p>
                 )}
                 <div className="text-sm text-gray-600">
                   <p>أكواد الخصم المتاحة:</p>
                   <ul className="list-disc list-inside mt-1 space-y-1">
                     <li>SAVE20 - خصم 20%</li>
                     <li>FIRST10 - خصم 10% للعملاء الجد ب</li>
                   </ul>
                 </div>
               </div>
             )}
           </div> */}
   
           {/* Pricing Summary */}
           <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Gift className="w-6 h-6 text-[#62a0f6]" />
          <h2 className="text-xl font-bold">{t("step5.invoiceSummary")}</h2>
        </div>
        <div className="space-y-4 p-4 bg-[#eff6fe] rounded-lg">
          <div className="flex justify-between">
            <span className="font-medium">
              {bookingData.pricing.subTotal} {t("step5.currency")}
            </span>
            <span className="text-gray-600">{t("step5.baseAmount")}</span>
          </div>

          {/* رسوم الزيارة فقط للغير سعوديين */}
          {bookingData.pricing.fees > 0 && (
            <div className="flex justify-between">
              <span className="font-medium">
                {bookingData.pricing.fees} {t("step5.currency")}
              </span>
              <span className="text-gray-600">{t("step5.visitFees")}</span>
            </div>
          )}

          {bookingData.pricing.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span className="font-medium">
                -{bookingData.pricing.discount} {t("step5.currency")}
              </span>
              <span>{t("step5.discount")}</span>
            </div>
          )}

          <div className="border-t border-gray-300 pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-[#62a0f6]">
                {bookingData.pricing.total} {t("step5.currency")}
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