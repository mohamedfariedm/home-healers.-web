"use client";
import { useEffect, useState } from "react";
import { AlertTriangle, Home, RefreshCw, User } from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from "@/Hooks/use-local-storage";
import { useRouter, useSearchParams } from "next/navigation";
import type { BookingData } from "@/types/booking";
import ClientAPI from "@/app/api/api";

export default function PaymentFail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingData, setBookingData] = useLocalStorage<BookingData>("bookingData", {} as BookingData);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Retrieve reservationId from query parameters or localStorage
    const resId = searchParams.get("reservationId");
    if (resId) {
      setReservationId(Number(resId));
    } else if (localStorage.getItem("reservationId")) {
      setReservationId(Number(localStorage.getItem("reservationId")));
    }

    // Check if bookingData is available
    if (!bookingData || !Object.keys(bookingData).length) {
      toast.error("لم يتم العثور على بيانات الحجز. يرجى المحاولة مرة أخرى.");
      router.push("/");
    }
  }, [bookingData, router, searchParams]);

  const handleRetryPayment = async () => {
    if (!reservationId) {
      toast.error("معرف الحجز غير متوفر. يرجى المحاولة مرة أخرى.");
      return;
    }

    try {
      setIsLoading(true);
      if (bookingData.paymentMethod === "telr") {
        const response = await ClientAPI.payReservationWithTelr(reservationId, "ar");
        router.push(response.data.redirect_url);
      } else {
        const response = await ClientAPI.payReservation(reservationId, "ar");
        router.push(response.data.redirect_url);
      }
    } catch (error: any) {
      console.error("Retry Payment Error:", error);
      toast.error(error.message || "فشل في إعادة محاولة الدفع. حاول مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoHome = () => {
    localStorage.removeItem("bookingData");
    localStorage.removeItem("reservationId");
    router.push("/");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-12" dir="rtl">
      {/* Failure Header */}
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-12 h-12 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-red-800 mb-4">
          فشل عملية الدفع
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          عذراً، لم يتم إكمال عملية الدفع بنجاح. يرجى المحاولة مرة أخرى أو التواصل مع فريق الدعم.
        </p>
        {reservationId && (
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-red-800 font-medium">رقم الحجز:</span>
            <span className="text-red-600 font-bold">HH-{reservationId}</span>
          </div>
        )}
      </div>

      {/* Booking Summary (Optional) */}
      {bookingData && Object.keys(bookingData).length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <User className="w-6 h-6 text-[#62a0f6]" />
            ملخص الحجز
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">
                {bookingData.selectedPatients?.map((p) => p.name).join(", ") || "غير محدد"}
              </span>
              <span className="text-gray-600">اسم المريض</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">
                {bookingData.selectedDoctor?.name || "غير محدد"}
              </span>
              <span className="text-gray-600">الطبيب المعالج</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">
                {bookingData.healthInfo.painLocation || "غير محدد"}
              </span>
              <span className="text-gray-600">المشكلة الصحية</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">
                {bookingData.selectedLocation?.title || "غير محدد"}
              </span>
              <span className="text-gray-600">موقع الزيارة</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">
                {bookingData.pricing.total} ريال
              </span>
              <span className="text-gray-600">المبلغ الإجمالي</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleRetryPayment}
          disabled={isLoading || !reservationId}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-[#62a0f6] text-white rounded-lg hover:bg-[#5090e6] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              جاري المعالجة...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              إعادة محاولة الدفع
            </>
          )}
        </button>
        <button
          onClick={handleGoHome}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-[#143087] text-white rounded-lg hover:bg-[#0f2470] transition-colors"
        >
          <Home className="w-5 h-5" />
          العودة للرئيسية
        </button>
      </div>

      {/* Contact Info */}
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <h3 className="font-bold mb-2">هل تحتاج مساعدة؟</h3>
        <p className="text-gray-600 mb-4">
          فريق خدمة العملاء متاح على مدار الساعة لمساعدتك
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:+966500000000"
            className="text-[#62a0f6] hover:underline"
          >
            📞 +966 50 000 0000
          </a>
          <a
            href="mailto:support@homehealers.com"
            className="text-[#62a0f6] hover:underline"
          >
            ✉️ support@homehealers.com
          </a>
        </div>
      </div>
    </div>
  );
}