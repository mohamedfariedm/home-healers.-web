import { CheckCircle, ChevronLeft } from "lucide-react"

export default function BookingConfirmation() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl" dir="rtl">
      <div className="flex flex-col gap-16 items-center">
        {/* Success Section */}
        <div className="flex flex-col gap-14 items-center w-full max-w-lg">
          {/* Success Illustration */}
          <div className="flex flex-col gap-1 items-center w-full">
            <div className="relative w-full max-w-[500px] h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
              {/* Main Illustration Container */}
              <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl flex items-center justify-center">
                {/* Success Phone Mockup */}
                <div className="relative w-48 h-80 md:w-56 md:h-96 bg-white rounded-3xl shadow-2xl border-8 border-gray-200">
                  {/* Phone Screen */}
                  <div className="w-full h-full bg-gradient-to-b from-blue-500 to-purple-600 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Success Checkmark */}
                    <div className="absolute top-8 right-8">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>

                    {/* Main Success Icon */}
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>

                    {/* Success Text */}
                    <div className="text-center text-white">
                      <h3 className="text-lg font-bold mb-2">تم بنجاح!</h3>
                      <p className="text-sm opacity-90">تم تأكيد حجزك</p>
                    </div>

                    {/* Done Button */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                      <div className="bg-[#62a0f6] text-white px-4 py-2 rounded text-xs font-bold">DONE</div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-4 left-4 w-8 h-8 bg-yellow-400 rounded-full opacity-80"></div>
                <div className="absolute bottom-8 right-8 w-6 h-6 bg-pink-400 rounded-full opacity-60"></div>
                <div className="absolute top-1/3 right-4 w-4 h-4 bg-green-400 rounded-full opacity-70"></div>
              </div>

              {/* Side Confirmation Text */}
              <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-center">
                <span className="text-lg font-medium text-[#1e1e1e] leading-7 block">
                  تم
                  <br />
                  تأكيد
                  <br />
                  الحجز
                </span>
              </div>
            </div>

            {/* Thank You Message */}
            <div className="flex flex-col gap-4 items-center w-full max-w-md text-center">
              <div className="text-2xl md:text-3xl font-bold leading-10">
                <span className="text-[#1e1e1e]">شكرا ليك لاستخدام </span>
                <span className="text-[#62a0f6]">هومهيليرز</span>
              </div>
              <p className="text-base text-[#1e1e1e] leading-6 max-w-sm">
                تم تأكيد الحجز بنجاح وسنتابع معك اخر التطورات
              </p>
            </div>
          </div>

          {/* Return to Homepage Button */}
          <button className="flex items-center justify-center gap-2 bg-[#143087] text-white rounded-xl px-10 py-4 text-lg font-medium w-full max-w-sm">
            <ChevronLeft className="w-6 h-6" />
            <span>عودة الي الصفحة الرئيسية</span>
          </button>
        </div>

        {/* Booking Details Section */}
        <div className="bg-white rounded-2xl border border-[#d0d5dd] p-5 w-full">
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-bold text-[#1e1e1e]">تفاصيل الحجز</h2>
          </div>

          <div className="bg-[#eff6fe] rounded-xl p-4">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[#1e1e1e]">احمد</span>
                <span className="text-sm text-[#1e1e1e]">اسم المريض</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[#1e1e1e]">مشاكل في العضلات</span>
                <span className="text-sm text-[#1e1e1e]">المشكلة الصحية</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[#1e1e1e]">Ahmed@gmail.com</span>
                <span className="text-sm text-[#1e1e1e]">ايميل التواصل</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[#1e1e1e]">+201155591759</span>
                <span className="text-sm text-[#1e1e1e]">رقم الهاتف</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
