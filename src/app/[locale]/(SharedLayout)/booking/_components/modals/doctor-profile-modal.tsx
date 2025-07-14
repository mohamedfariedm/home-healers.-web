"use client";
import { X, Star, Clock, User, MapPin, Phone, Mail } from "lucide-react";
import Image from "next/image";
import type { Doctor } from "@/types/booking";

interface DoctorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
}

export default function DoctorProfileModal({
  isOpen,
  onClose,
  doctor,
}: DoctorProfileModalProps) {
  if (!isOpen || !doctor) return null;

  const conditions = [
    "التهاب الشعب الهوائية والجيوب الأنفية",
    "التهابات الأذن الداخلية والخارجية",
    "اضطرابات التبول والإفرازات",
    "مشاكل الجهاز الهضمي",
    "أمراض القلب والأوعية الدموية",
    "اضطرابات الغدد الصماء",
    "الأمراض الجلدية",
    "اضطرابات النوم",
  ];

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#1e1e1e]">
            الملف الشخصي للطبيب
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Doctor Main Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Doctor Image */}
              <div className="w-full lg:w-64 h-48 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=192&width=256"
                  alt={doctor.name}
                  width={256}
                  height={192}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Doctor Details */}
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-[#1e1e1e] mb-2">
                    {doctor.name}
                  </h3>
                  <p className="text-lg text-gray-600 mb-3">
                    {doctor.doctor_role}
                  </p>
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-5 h-5 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                    <span className="text-sm text-gray-600 mr-2">
                      (4.8 من 5)
                    </span>
                  </div>
                  <p className="text-gray-600">{doctor.degree}</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-[#62a0f6]" />
                    <div>
                      <p className="text-sm text-gray-600">سنوات الخبرة</p>
                      <p className="font-semibold">{doctor.experience} سنوات</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-[#62a0f6]" />
                    <div>
                      <p className="text-sm text-gray-600">التخصص</p>
                      <p className="font-semibold">{doctor.specialist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-[#62a0f6]" />
                    <div>
                      <p className="text-sm text-gray-600">العيادة</p>
                      <p className="font-semibold">{doctor.clinic_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-[#62a0f6]" />
                    <div>
                      <p className="text-sm text-gray-600">ساعات العمل</p>
                      <p className="font-semibold">
                        {doctor.from} - {doctor.to}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Special Offer */}
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎁</span>
                <div>
                  <p className="font-semibold text-teal-800">عرض خاص</p>
                  <p className="text-sm text-teal-600">
                    خصم 20% على باقة 5 جلسات علاج طبيعي حتى نهاية الشهر!
                  </p>
                </div>
              </div>
              <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                الاستفادة من العرض
              </button>
            </div>
          </div>

          {/* About Doctor */}
          <div className="space-y-6">
            <div>
              <div className="bg-[#eff6fe] rounded-t-xl inline-block px-4 py-3">
                <h3 className="text-lg font-bold text-[#62a0f6]">عن الطبيب</h3>
              </div>
              <div className="bg-[#eff6fe] rounded-xl rounded-tr-none p-4">
                <p className="text-[#1e1e1e] leading-relaxed">
                  {doctor.doctor_role} في {doctor.specialist} مع خبرة{" "}
                  {doctor.experience} سنوات في المجال الطبي. تخرج من{" "}
                  {doctor.medical_school || "كلية الطب"} وحاصل على{" "}
                  {doctor.certification || "البورد السعودي"}. يتميز بخبرته
                  الواسعة في علاج مختلف الحالات الطبية ويسعى دائماً لتقديم أفضل
                  رعاية طبية للمرضى.
                </p>
              </div>
            </div>

            {/* Medical License */}
            <div>
              <div className="bg-[#eff6fe] rounded-t-xl inline-block px-4 py-3">
                <h3 className="text-lg font-bold text-[#62a0f6]">
                  رقم الرخصة الطبية
                </h3>
              </div>
              <div className="bg-[#eff6fe] rounded-xl rounded-tr-none p-4">
                <p className="text-[#1e1e1e] font-mono text-lg">
                  {doctor.medical_registration_number}
                </p>
              </div>
            </div>

            {/* Specializations */}
            <div>
              <div className="bg-[#eff6fe] rounded-t-xl inline-block px-4 py-3">
                <h3 className="text-lg font-bold text-[#62a0f6]">
                  خبرة في الحالات التالية
                </h3>
              </div>
              <div className="bg-[#eff6fe] rounded-xl rounded-tr-none p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {conditions.map((condition, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#62a0f6] rounded-full"></div>
                      <span className="text-[#1e1e1e]">{condition}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <div className="bg-[#eff6fe] rounded-t-xl inline-block px-4 py-3">
                <h3 className="text-lg font-bold text-[#62a0f6]">
                  معلومات التواصل
                </h3>
              </div>
              <div className="bg-[#eff6fe] rounded-xl rounded-tr-none p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#62a0f6]" />
                    <div>
                      <p className="text-sm text-gray-600">رقم الهاتف</p>
                      <p className="font-semibold">
                        +966{doctor.mobile_number}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#62a0f6]" />
                    <div>
                      <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                      <p className="font-semibold">{doctor.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-[#1e1e1e] mb-2">
                سعر الاستشارة
              </h3>
              <div className="text-3xl font-bold text-[#62a0f6] mb-4">
                300 ريال
              </div>
              <p className="text-sm text-gray-600 mb-4">
                شامل الفحص والاستشارة الطبية
              </p>
              <button className="bg-[#143087] text-white px-8 py-3 rounded-lg hover:bg-[#0f2470] transition-colors">
                احجز موعد الآن
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
