"use client"
import { X, Star, Clock, User, MapPin, Phone, Mail, Award } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import type { BookingData, Doctor } from "@/types/booking"

interface DoctorProfileModalProps {
  isOpen: boolean
  onClose: () => void
  doctor: Doctor | null
  updateBookingData: (updates: Partial<BookingData>) => void
  onSelectDoctor: () => void
}

export default function DoctorProfileModal({
  isOpen,
  onClose,
  doctor,
  updateBookingData,
  onSelectDoctor,
}: DoctorProfileModalProps) {
  if (!isOpen || !doctor) return null

  console.log("Doctor Profile Modal Data:", doctor)

  // Default specializations
  const defaultConditions = [
    "التهاب الشعب الهوائية والجيوب الأنفية",
    "التهابات الأذن الداخلية والخارجية",
    "اضطرابات التبول والإفرازات",
    "مشاكل الجهاز الهضمي",
    "أمراض القلب والأوعية الدموية",
    "اضطرابات الغدد الصماء",
    "الأمراض الجلدية",
    "اضطرابات النوم",
  ]

  // Parse specializations
  const specializations = doctor.specialized_in && doctor.specialized_in !== "minus"
    ? doctor.specialized_in.split(",").map(s => s.trim()).filter(s => s.length > 0)
    : defaultConditions

  // Validate phone number
  const isValidPhone = (phone: string) => /^[0-9+\-() ]+$/.test(phone)
  const phoneNumber = isValidPhone(doctor.mobile_number) ? `+966${doctor.mobile_number}` : "غير متوفر"

  // Validate image
  const isValidImage = (attachment: string) => /\.(jpg|jpeg|png|gif)$/i.test(attachment)
  const doctorImage = doctor.upload_attachments && isValidImage(doctor.upload_attachments)
    ? doctor.upload_attachments
    : doctor.service?.image?.[0]?.original || "/default-doctor.png"

  // Validate placeholder fields
  const displayRole = doctor.doctor_role !== "atque" ? doctor.doctor_role : doctor.specialist
  const displaySpecialist = doctor.specialist !== "doloremque" ? doctor.specialist : "غير محدد"
  const displayDegree = doctor.degree !== "quaerat" ? doctor.degree : "بكالوريوس الطب"
  const displayMedicalSchool = doctor.medical_school !== "mollitia" ? doctor.medical_school : "كلية الطب"
  const displayCertification = doctor.certification !== "rerum" ? doctor.certification : "البورد السعودي"
  const displayEmail = doctor.email !== "ansel25@example.org" ? doctor.email : "غير متوفر"
  const displayLanguages = doctor.languages_spoken !== "velit" ? doctor.languages_spoken : "العربية، الإنجليزية"

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      dir="rtl"
      role="dialog"
      aria-labelledby="doctor-profile-title"
    >
      <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 id="doctor-profile-title" className="text-xl font-bold text-[#1e1e1e]">
            الملف الشخصي للطبيب
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="إغلاق نافذة الملف الشخصي"
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
                {/* <Image
                  src={doctorImage}
                  alt={`صورة الطبيب ${doctor.name}`}
                  width={256}
                  height={192}
                  className="w-full h-full object-cover"
                /> */}
              </div>

              {/* Doctor Details */}
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-[#1e1e1e] mb-2">
                    {doctor.name}
                  </h3>
                  <p className="text-lg text-gray-600 mb-3">
                    {displayRole}
                  </p>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: doctor.rate || 4 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-yellow-400"
                        aria-hidden="true"
                      />
                    ))}
                    <span className="text-sm text-gray-600 mr-2">
                      ({doctor.rate || 4} من 5)
                    </span>
                  </div>
                  <p className="text-gray-600">{displayDegree}</p>
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
                      <p className="font-semibold">{displaySpecialist}</p>
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

          {/* Offers */}
          {doctor.offers && doctor.offers.length > 0 && (
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-teal-800 mb-4">العروض المتاحة</h3>
              {doctor.offers.map((offer) => (
                <div key={offer.id} className="flex justify-between items-center mb-3 last:mb-0">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎁</span>
                    <div>
                      <p className="font-semibold text-teal-800">{offer.name}</p>
                      <p className="text-sm text-teal-600">{offer.description}</p>
                      <p className="text-sm text-teal-600">عدد الجلسات: {offer.sessions_count}</p>
                      <p className="text-sm font-semibold text-teal-800">
                        السعر: {offer.price} ريال {offer.discount ? `(خصم ${offer.discount} ريال)` : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      updateBookingData({ selectedPackage: { ...offer, type: offer.type || "offer" } })
                      toast.success(`تم اختيار العرض: ${offer.name}`)
                    }}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                    aria-label={`الاستفادة من عرض ${offer.name}`}
                  >
                    الاستفادة من العرض
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* About Doctor */}
          <div className="space-y-6">
            <div>
              <div className="bg-[#eff6fe] rounded-t-xl inline-block px-4 py-3">
                <h3 className="text-lg font-bold text-[#62a0f6]">عن الطبيب</h3>
              </div>
              <div className="bg-[#eff6fe] rounded-xl rounded-tr-none p-4">
                <p className="text-[#1e1e1e] leading-relaxed">
                  {displayRole} في {displaySpecialist} مع خبرة {doctor.experience} سنوات في المجال الطبي. تخرج من {displayMedicalSchool} وحاصل على {displayCertification}. يتميز بخبرته الواسعة في علاج مختلف الحالات الطبية ويسعى دائماً لتقديم أفضل رعاية طبية للمرضى. يتحدث {displayLanguages}.
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
                <p className="text-sm text-gray-600">
                  تنتهي الرخصة في: {new Date(doctor.medical_license_expiry).toLocaleDateString("ar-SA")}
                </p>
              </div>
            </div>

            {/* Awards and Memberships */}
            {(doctor.awards !== "qui" || doctor.memberships !== "earum") && (
              <div>
                <div className="bg-[#eff6fe] rounded-t-xl inline-block px-4 py-3">
                  <h3 className="text-lg font-bold text-[#62a0f6]">
                    الجوائز والعضويات
                  </h3>
                </div>
                <div className="bg-[#eff6fe] rounded-xl rounded-tr-none p-4">
                  {doctor.awards !== "qui" && (
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-[#62a0f6]" />
                      <p className="text-[#1e1e1e]">{doctor.awards}</p>
                    </div>
                  )}
                  {doctor.memberships !== "earum" && (
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#62a0f6]" />
                      <p className="text-[#1e1e1e]">{doctor.memberships}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Specializations */}
            <div>
              <div className="bg-[#eff6fe] rounded-t-xl inline-block px-4 py-3">
                <h3 className="text-lg font-bold text-[#62a0f6]">
                  خبرة في الحالات التالية
                </h3>
              </div>
              <div className="bg-[#eff6fe] rounded-xl rounded-tr-none p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {specializations.map((condition, index) => (
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
                      <p className="font-semibold">{phoneNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#62a0f6]" />
                    <div>
                      <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                      <p className="font-semibold">{displayEmail}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Information */}
            {doctor.service && (
              <div>
                <div className="bg-[#eff6fe] rounded-t-xl inline-block px-4 py-3">
                  <h3 className="text-lg font-bold text-[#62a0f6]">
                    الخدمة الطبية
                  </h3>
                </div>
                <div className="bg-[#eff6fe] rounded-xl rounded-tr-none p-4">
                  <p className="text-[#1e1e1e] font-semibold">{doctor.service.name}</p>
                  <p 
                  className="editor-content"
                  dangerouslySetInnerHTML={{ __html: doctor.service.description }} />
                </div>
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-[#1e1e1e] mb-2">
                سعر الاستشارة
              </h3>
              <div className="text-3xl font-bold text-[#62a0f6] mb-4">
                {doctor.session_price} ريال
              </div>
              <p className="text-sm text-gray-600 mb-4">
                شامل الفحص والاستشارة الطبية
              </p>
              <button
                onClick={() => {
                  updateBookingData({ selectedDoctor: doctor })
                  onSelectDoctor()
                  onClose()
                  toast.success(`تم اختيار الطبيب: ${doctor.name}`)
                }}
                className="bg-[#143087] text-white px-8 py-3 rounded-lg hover:bg-[#0f2470] transition-colors"
                aria-label={`حجز موعد مع الطبيب ${doctor.name}`}
              >
                احجز موعد الآن
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}