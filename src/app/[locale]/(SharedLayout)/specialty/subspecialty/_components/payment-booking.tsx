import { Check, ChevronDown, CreditCard, Gift, Receipt, Tag } from "lucide-react"

export default function PaymentBooking() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Discount & Payment Summary */}
        <div className="flex flex-col gap-12 order-2 lg:order-1">
          {/* Discount Coupon Section */}
          <div className="bg-white rounded-2xl border border-[#d0d5dd] p-5">
            <div className="flex justify-center mb-6">
              <h2 className="text-xl font-bold text-[#1e1e1e]">كوبون الخصم</h2>
            </div>

            <div className="bg-[#eff6fe] rounded-xl p-4">
              <div className="flex justify-between items-center gap-4">
                <button className="bg-[#62a0f6] text-white rounded-lg px-3 py-2 text-sm font-medium">استخدام</button>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm text-[#b5b5b5] text-right">أضف كوبون الخصم هنا</span>
                  <Tag className="w-6 h-6 text-[#62a0f6]" />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary Section */}
          <div className="bg-white rounded-2xl border border-[#d0d5dd] p-5">
            <div className="flex justify-center mb-6">
              <h2 className="text-xl font-bold text-[#1e1e1e]">ملخص الدفع</h2>
            </div>

            <div className="bg-[#eff6fe] rounded-xl p-4">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[#1e1e1e]">احمد</span>
                  <span className="text-sm text-[#1e1e1e]">الاجمالي الفرعي ( 1 عنصر )</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[#1e1e1e]">100 ريال</span>
                  <span className="text-sm text-[#1e1e1e]">رسوم الزيارة المنزلية</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[#1e1e1e]">20 ريال</span>
                  <div className="text-sm text-right">
                    <span className="text-[#1e1e1e]">قمية الضريبة المضافة </span>
                    <span className="text-[#f04437]">( + )</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[#12b669]">-15 ريال</span>
                  <span className="text-sm text-[#12b669]">قيمة الخصم</span>
                </div>

                <div className="border-t border-gray-200 my-2"></div>

                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-[#62a0f6]">120 ريال</span>
                  <span className="text-sm font-semibold text-[#1e1e1e]">المبلغ الاجمالي</span>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Payment Button */}
          <button className="bg-[#143087] text-white rounded-xl px-4 py-4 text-lg font-medium flex items-center justify-center gap-2 w-full">
            <span>متابعة الدفع</span>
            <ChevronDown className="w-6 h-6 rotate-90" />
          </button>
        </div>

        {/* Right Column - Booking Details & Payment Methods */}
        <div className="flex flex-col gap-8 order-1 lg:order-2">
          {/* Booking Details Section */}
          <div className="bg-white rounded-2xl border border-[#d0d5dd] p-5">
            <div className="flex justify-between items-center mb-6">
              <div className="w-8 h-8 bg-[#62a0f6] rounded-2xl flex items-center justify-center">
                <Receipt className="w-5 h-5 text-white" />
              </div>
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

          {/* Payment Methods Section */}
          <div className="bg-white rounded-2xl border border-[#d0d5dd] p-5">
            <div className="flex justify-between items-center mb-6">
              <div className="w-8 h-8 bg-[#62a0f6] rounded-2xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-[#1e1e1e]">طريقة الدفع</h2>
            </div>

            <div className="flex flex-col gap-4">
              {/* Apple Pay - Selected */}
              <div className="bg-[#eff6fe] rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <Check className="w-6 h-6 text-[#62a0f6]" />
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-8 bg-black rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">Pay</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1e1e1e]">Apple Pay</span>
                  </div>
                </div>
              </div>

              {/* Master Card */}
              <div className="bg-white border border-[#d0d5dd] rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 border border-gray-300 rounded"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-8 bg-gradient-to-r from-red-500 to-yellow-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">MC</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1e1e1e]">Master card</span>
                  </div>
                </div>
              </div>

              {/* Visa */}
              <div className="bg-white border border-[#d0d5dd] rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 border border-gray-300 rounded"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1e1e1e]">Visa</span>
                  </div>
                </div>
              </div>

              {/* STC Pay */}
              <div className="bg-white border border-[#d0d5dd] rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 border border-gray-300 rounded"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-8 bg-purple-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">STC</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1e1e1e]">Stc Pay</span>
                  </div>
                </div>
              </div>

              {/* PayPal */}
              <div className="bg-white border border-[#d0d5dd] rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 border border-gray-300 rounded"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-8 bg-blue-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">PP</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1e1e1e]">PayPal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Points Usage Section */}
          <div className="bg-white rounded-2xl border border-[#d0d5dd] p-5">
            <div className="flex justify-between items-center mb-6">
              <div className="w-8 h-8 bg-[#62a0f6] rounded-2xl flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-[#1e1e1e]">استخدام نقاط</h2>
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-[138px] h-[78px] bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">نقاط المكافآت</span>
              </div>
            </div>

            <div className="bg-[#eff6fe] rounded-xl p-4">
              <div className="flex flex-col gap-3">
                <span className="text-sm text-[#1e1e1e] text-right">رقم الهاتف</span>
                <div className="flex">
                  <div className="flex items-center bg-[rgba(232,234,243,0.5)] rounded-r-lg px-2 py-3 border border-[#d0d5dd]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[#1e1e1e]">+966</span>
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-white text-xs">🇸🇦</span>
                      </div>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                  <input
                    type="text"
                    className="flex-1 px-3 py-3 border border-[#d0d5dd] rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#62a0f6]"
                    placeholder="أدخل رقم الهاتف"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
