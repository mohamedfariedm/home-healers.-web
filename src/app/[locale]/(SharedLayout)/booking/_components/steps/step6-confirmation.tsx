"use client";
import {
  CheckCircle,
  Calendar,
  User,
  MapPin,
  CreditCard,
  Download,
  Home,
} from "lucide-react";
import type { BookingData } from "@/types/booking";

interface Step6Props {
  bookingData: BookingData;
}

export default function Step6Confirmation({ bookingData }: Step6Props) {
  const handleDownloadReceipt = () => {
    // Generate and download receipt
    const receiptData = {
      bookingId: `HH-${Date.now()}`,
      date: new Date().toLocaleDateString("ar-SA"),
      patient: bookingData.selectedPatient?.name,
      doctor: bookingData.selectedDoctor?.name,
      total: bookingData.pricing.total,
    };

    console.log("Download receipt:", receiptData);
    // Implement actual download logic here
  };

  const handleGoHome = () => {
    // Clear booking data and redirect to home
    localStorage.removeItem("bookingData");
    window.location.href = "/";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Success Header */}
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          تم تأكيد حجزك بنجاح!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          شكراً لك لاستخدام منصة هوم هيلرز. سيتم التواصل معك قريباً لتأكيد موعد
          الزيارة.
        </p>
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-green-800 font-medium">رقم الحجز:</span>
          <span className="text-green-600 font-bold">HH-{Date.now()}</span>
        </div>
      </div>

      {/* Booking Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Patient & Doctor Info */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <User className="w-6 h-6 text-[#62a0f6]" />
            تفاصيل الحجز
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">
                {bookingData.selectedPatient?.name}
              </span>
              <span className="text-gray-600">اسم المريض</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">
                {bookingData.selectedDoctor?.name}
              </span>
              <span className="text-gray-600">الطبيب المعالج</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">
                {bookingData.selectedDoctor?.specialist}
              </span>
              <span className="text-gray-600">التخصص</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">
                {bookingData.healthInfo.painLocation}
              </span>
              <span className="text-gray-600">المشكلة الصحية</span>
            </div>

            {bookingData.selectedPackage && (
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-blue-800">
                  {bookingData.selectedPackage.name.ar}
                </span>
                <span className="text-blue-600">الباقة المختارة</span>
              </div>
            )}
          </div>
        </div>

        {/* Location & Schedule */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#62a0f6]" />
            الموقع والمواعيد
          </h2>

          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-600 mb-1">موقع الزيارة</h3>
              <p className="font-medium">
                {bookingData.selectedLocation?.title}
              </p>
              <p className="text-sm text-gray-600">
                {bookingData.selectedLocation?.address}
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-600 mb-2">
                المواعيد المحجوزة
              </h3>
              <div className="space-y-2">
                {bookingData.selectedDates.map((dateTime, index) => (
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
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#62a0f6]" />
            ملخص الدفع
          </h2>

          <div className="space-y-3 p-4 bg-[#eff6fe] rounded-lg">
            <div className="flex justify-between">
              <span className="font-medium">
                {bookingData.pricing.subTotal} ريال
              </span>
              <span className="text-gray-600">المبلغ الأساسي</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">
                {bookingData.pricing.fees} ريال
              </span>
              <span className="text-gray-600">رسوم الزيارة</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">
                {bookingData.pricing.tax} ريال
              </span>
              <span className="text-gray-600">الضريبة</span>
            </div>

            {bookingData.pricing.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="font-medium">
                  -{bookingData.pricing.discount} ريال
                </span>
                <span>الخصم</span>
              </div>
            )}

            <div className="border-t border-gray-300 pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-[#62a0f6]">
                  {bookingData.pricing.total} ريال
                </span>
                <span>المبلغ الإجمالي</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">
              ✅ تم الدفع بنجاح عبر {bookingData.paymentMethod}
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">الخطوات التالية</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h3 className="font-medium">تأكيد الموعد</h3>
                <p className="text-sm text-gray-600">
                  سيتم التواصل معك خلال 24 ساعة لتأكيد الموعد
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h3 className="font-medium">تحضير الزيارة</h3>
                <p className="text-sm text-gray-600">
                  تأكد من توفر جميع الأدوية والتقارير الطبية
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h3 className="font-medium">يوم الزيارة</h3>
                <p className="text-sm text-gray-600">
                  سيصل الطبيب في الموعد المحدد إلى الموقع المختار
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleDownloadReceipt}
          className="flex items-center justify-center gap-2 px-8 py-3 border border-[#62a0f6] text-[#62a0f6] rounded-lg hover:bg-[#eff6fe] transition-colors"
        >
          <Download className="w-5 h-5" />
          تحميل الإيصال
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
