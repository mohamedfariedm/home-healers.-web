import { Clock, FileText, Mic, Paperclip, Plus, Star, User, Video } from "lucide-react"
import Image from "next/image"

export default function BookingForm() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl" dir="rtl">
      <div className="flex flex-col gap-10">
        {/* Doctor Information Section */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <h2 className="text-xl font-bold text-[#1e1e1e] text-center">بيانات الدكتور</h2>
          </div>

          <div className="bg-white rounded-2xl border border-[#d0d5dd] p-5">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Doctor Photo and Info */}
              <div className="flex flex-col md:flex-row gap-6 items-center lg:order-2">
                <div className="w-[216px] h-[160px] rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src="/placeholder.svg?height=160&width=216"
                    alt="Doctor"
                    width={216}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col gap-3 items-end text-right">
                  <h3 className="text-xl font-semibold text-[#1e1e1e]">د / أحمد عاطف</h3>
                  <p className="text-sm text-[#1e1e1e]">أخصائي أول</p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-[#736b7a]">وصف بسيط جدا هنا</p>
                </div>
              </div>

              {/* Doctor Details */}
              <div className="flex flex-col gap-6 lg:order-1 w-full lg:flex-1">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-sm">
                      <span className="text-[#b5b5b5]">استشارة طبية فيديو : </span>
                      <span className="text-[#1e1e1e]">15 دقيقة</span>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center bg-white">
                      <Video className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-sm">
                      <span className="text-[#b5b5b5]">التخصص العام : </span>
                      <span className="text-[#1e1e1e]">طب أسرة</span>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center bg-white">
                      <User className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-end md:justify-start">
                  <div className="text-sm">
                    <span className="text-[#b5b5b5]">الخبرة : </span>
                    <span className="text-[#1e1e1e]">4 سنوات</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center bg-white">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Information Section */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <h2 className="text-xl font-bold text-[#1e1e1e] text-center">بيانات المريض</h2>
          </div>

          <div className="flex flex-col gap-4">
            {/* Add Patient Section */}
            <div className="bg-white rounded-2xl border border-[#d0d5dd] p-5">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col gap-3 items-end text-right ">
                  <h3 className="text-lg font-semibold text-[#62a0f6]">اسم المريض</h3>
                  <p className="text-sm text-[#1e1e1e]">يمكنك اضافة مزيد من المرضي</p>
                </div>
                <button className="flex items-center gap-2 bg-[#62a0f6] text-white rounded-lg px-3 py-3 text-sm font-medium ">
                  <Plus className="w-6 h-6" />
                  <span>اضافة المزيد من المرضي</span>
                </button>

                
              </div>

              <div className="flex items-center justify-center gap-4 mt-8">
                <div className="w-12 h-12 bg-[#eff6fe] rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-[#62a0f6]" />
                </div>
                <span className="text-sm font-bold text-[#1e1e1e]">احمد عاطف</span>
              </div>
            </div>

            {/* Health Problem Description */}
            <div className="bg-white rounded-2xl border border-[#d0d5dd] p-5">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-3 items-end text-right">
                  <h3 className="text-lg font-semibold text-[#62a0f6] text-center">
                    اشرح المشكلة الصحية التي تعاني منها
                  </h3>
                  <p className="text-sm text-[#1e1e1e] text-center">
                    الرجاء إخبار الطبيب اذا كنت تعاني من أي مرض مزمن أو حساسية أو إذا كنت تتناول أي أدوية
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Text Note */}
                  <div className="flex items-center justify-between bg-white border border-[#d0d5dd] rounded-2xl p-6">
                    <button className="bg-[#62a0f6] text-white rounded-lg px-3 py-2 text-sm font-medium">اضافة</button>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-right">
                        <span className="text-[#1e1e1e]">ملاحظة نصية </span>
                        <span className="text-[#736b7a]">( اختياري )</span>
                      </div>
                      <div className="w-9 h-9 bg-[#eff6fe] rounded-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-[#62a0f6]" />
                      </div>
                    </div>
                  </div>

                  {/* Voice Note */}
                  <div className="flex items-center justify-between bg-white border border-[#d0d5dd] rounded-2xl p-6">
                    <button className="bg-[#62a0f6] text-white rounded-lg px-3 py-2 text-sm font-medium">اضافة</button>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-right">
                        <span className="text-[#1e1e1e]">ملاحظة صوتية </span>
                        <span className="text-[#736b7a]">( اختياري )</span>
                      </div>
                      <div className="w-9 h-9 bg-[#eff6fe] rounded-full flex items-center justify-center">
                        <Mic className="w-6 h-6 text-[#62a0f6]" />
                      </div>
                    </div>
                  </div>

                  {/* Attachments */}
                  <div className="flex items-center justify-between bg-white border border-[#d0d5dd] rounded-2xl p-6">
                    <button className="bg-[#62a0f6] text-white rounded-lg px-3 py-2 text-sm font-medium">اضافة</button>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-right">
                        <span className="text-[#1e1e1e]">المرفقات </span>
                        <span className="text-[#736b7a]">( اختياري )</span>
                      </div>
                      <div className="w-9 h-9 bg-[#eff6fe] rounded-full flex items-center justify-center">
                        <Paperclip className="w-6 h-6 text-[#62a0f6]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Booking Button */}
        <div className="flex justify-center">
          <button className="bg-[#143087] text-white rounded-xl px-6 py-4 text-sm font-semibold">
            متابعة الحجز الان
          </button>
        </div>
      </div>
    </div>
  )
}
