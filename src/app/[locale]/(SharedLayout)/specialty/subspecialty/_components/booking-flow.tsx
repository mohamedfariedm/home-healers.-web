"use client"

import { useState } from "react"
import {
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  Clock,
  CreditCard,
  FileText,
  Gift,
  Mic,
  Paperclip,
  Plus,
  Receipt,
  Star,
  Tag,
  User,
  Video,
} from "lucide-react"
import Image from "next/image"
import AddPatientModal from "./add-patient-modal"
import AppointmentDatePickerModal from "./appointment-date-picker-modal"
import LocationPickerModal from "./location-picker-modal"
import SessionSelectorModal from "./session-selector-modal"
import SymptomsSearchModal from "./symptoms-search-modal"
import DoctorProfileDetailed from "./doctor-profile-detailed"

type BookingStep = 1 | 2 | 3 | 4 | 5

interface BookingData {
  selectedSpecialty: string
  selectedDoctor: any
  patientInfo: any
  appointmentDate: string
  paymentMethod: string
  totalAmount: number
}

export default function BookingFlow() {
  const [currentStep, setCurrentStep] = useState<BookingStep>(1)
  const [bookingData, setBookingData] = useState<BookingData>({
    selectedSpecialty: "",
    selectedDoctor: null,
    patientInfo: null,
    appointmentDate: "",
    paymentMethod: "",
    totalAmount: 300,
  })

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isDetailedProfileOpen, setIsDetailedProfileOpen] = useState(false)
  const [isLocationsOpen, setIsLocationsOpen] = useState(false)
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false)
  const [isSymptomsSearchOpen, setIsSymptomsSearchOpen] = useState(false)
  const [isSessionSelectorOpen, setIsSessionSelectorOpen] = useState(false)
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false)

  // Search states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")

  const steps = [
    {
      step: "الخطوة الأولي",
      desc: "(اختيار التخصص)",
      color: currentStep >= 1 ? "bg-[#12b669]" : "bg-white",
      textColor: currentStep >= 1 ? "text-[#12b669]" : "text-white",
      barColor: currentStep >= 1 ? "bg-[#12b669]" : "bg-white",
      iconUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/7u7JoCvVJN.png",
    },
    {
      step: "الخطوة الثانية",
      desc: "(اختيار الطبيب)",
      color: currentStep >= 2 ? "bg-[#12b669]" : "bg-white",
      textColor: currentStep >= 2 ? "text-[#12b669]" : "text-white",
      barColor: currentStep >= 2 ? "bg-[#12b669]" : "bg-white",
      iconUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/Zf0NYybddq.png",
    },
    {
      step: "الخطوة الثالثة",
      desc: "(بيانات المريض)",
      color: currentStep >= 3 ? "bg-[#12b669]" : "bg-white",
      textColor: currentStep >= 3 ? "text-[#12b669]" : "text-white",
      barColor: currentStep >= 3 ? "bg-[#12b669]" : "bg-white",
      iconUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/YMhmXMOqwu.png",
    },
    {
      step: "الخطوة الرابعة",
      desc: "(الدفع)",
      color: currentStep >= 4 ? "bg-[#12b669]" : "bg-white",
      textColor: currentStep >= 4 ? "text-[#12b669]" : "text-white",
      barColor: currentStep >= 4 ? "bg-[#12b669]" : "bg-white",
      iconUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/YMhmXMOqwu.png",
    },
  ]

  const handleSearch = () => {
    console.log("Searching with:", { searchQuery, selectedCity, selectedDistrict, selectedSpecialty })
    setCurrentStep(2)
  }

  const handleDoctorSelect = (doctor: any) => {
    setBookingData({ ...bookingData, selectedDoctor: doctor })
    setCurrentStep(3)
  }

  const handlePatientInfoComplete = () => {
    setCurrentStep(4)
  }

  const handlePaymentComplete = () => {
    setCurrentStep(5)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1SpecialtySelection
        onOpenSymptoms={() => setIsSymptomsSearchOpen(true)}
        onNext={() => setCurrentStep(2)} />
      case 2:
        return <Step2DoctorSelection
      onOpenLocations={() => setIsLocationPickerOpen(true)}
      onOpenDetailedProfile={() => setIsDetailedProfileOpen(true)}
        onDoctorSelect={handleDoctorSelect} />
      case 3:
        return <Step3PatientInfo
        onOpenAddPatient={() => setIsAddPatientOpen(true)}
        onNext={handlePatientInfoComplete} />
      case 4:
        return <Step4Payment onNext={handlePaymentComplete} bookingData={bookingData} />
      case 5:
        return <Step5Confirmation bookingData={bookingData} />
      default:
        return <Step1SpecialtySelection
        onOpenSymptoms={() => setIsSymptomsSearchOpen(true)}
        onNext={() => setCurrentStep(2)} />
    }
  }

  return (
    <div
      className="main-container w-full mx-auto flex flex-col items-center relative my-0 px-4 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="w-full h-[247px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/dw6xSVLu5N.png)] bg-[length:100%_100%] bg-no-repeat absolute top-0 left-0 -z-10" />

      {/* Breadcrumbs */}
      <div className="w-full flex flex-wrap gap-1 justify-start items-center relative z-10 mt-8 px-2 sm:px-0">
        <span className="text-sm font-normal leading-5 text-white whitespace-nowrap">اختيار الدكتور</span>
        <div className="w-4 h-4 bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/VdrOBac2PR.png')] bg-cover bg-no-repeat" />
        <span className="text-sm font-normal leading-5 text-white whitespace-nowrap">التخصصات الطبية</span>
        <div className="w-4 h-4 bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/8CE4QNSbXz.png')] bg-cover bg-no-repeat" />
        <span className="text-sm font-normal leading-5 text-white whitespace-nowrap">الرئيسية</span>
      </div>

      {/* Steps Progress */}
      <div className="relative w-full max-w-[600px] mt-8">
        <div className="flex flex-wrap justify-center gap-6">
          {steps.map(({ step, desc, color, textColor, barColor, iconUrl }, i) => (
            <div key={i} className="flex items-center justify-center gap-2 w-24 shrink-0">
              <div className="flex flex-col items-center gap-2 w-24 shrink-0">
                <span className={`text-sm font-semibold leading-5 whitespace-nowrap text-center ${textColor}`}>
                  {step}
                </span>
                <span className={`text-xs font-normal leading-4 whitespace-nowrap text-center ${textColor}`}>
                  {desc}
                </span>
                <div className={`h-1 w-full rounded-full ${barColor} mb-2`} />
              </div>
              <div className="w-4 h-4 shrink-0 bg-cover bg-no-repeat" style={{ backgroundImage: `url(${iconUrl})` }} />
            </div>
          ))}
        </div>
      </div>

      {/* Search Container - Only show in step 1 and 2 */}
      {(currentStep === 1 || currentStep === 2|| currentStep === 3|| currentStep === 4) && (
        <div className="w-full bg-white rounded-2xl shadow-md mt-10 p-6 flex flex-col gap-6 max-w-[1280px]">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <button
              onClick={() => setIsLocationPickerOpen(true)}
              className="flex justify-between items-center gap-2 w-48 h-12 bg-[#fff] rounded-lg border border-gray-300 px-3"
            >
              <span className="text-sm text-[#1e1e1e]">اختر الحي</span>
              <div className="w-4 h-4 bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/08wBGQac9C.png')] bg-cover bg-no-repeat" />
            </button>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-48 h-12 bg-[#fff] rounded-lg border border-gray-300 px-3 text-sm text-[#1e1e1e]"
            >
              <option value="">اختر المدينة</option>
              <option value="riyadh">الرياض</option>
              <option value="jeddah">جدة</option>
              <option value="dammam">الدمام</option>
            </select>

            <input
              type="text"
              placeholder="او اكتب اسم المنطقة هنا...."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow bg-white min-w-[200px] h-12 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 placeholder-gray-400"
            />

            <button
              onClick={() => setIsLocationsOpen(true)}
              className="bg-blue-100 text-blue-500 rounded-lg px-2 py-2 text-sm font-medium whitespace-nowrap"
            >
              عنوان ســـابـــق
            </button>
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-between">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-48 h-12 bg-white rounded-lg border border-gray-300 px-3 text-sm text-[#1e1e1e]"
            >
              <option value="">اختر التخصص</option>
              <option value="family">طب الأسرة</option>
              <option value="internal">الباطنة</option>
              <option value="pediatrics">الأطفال</option>
            </select>

            <input
              type="text"
              placeholder="ابحث عن طبيب او مستشفي هنا"
              className="flex-grow bg-white min-w-[250px] h-12 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 placeholder-gray-400"
            />

            <button
              onClick={handleSearch}
              className="flex items-center gap-1 w-[117px] h-12 bg-[#143087] rounded-lg px-2 text-white"
            >
              ابحث الان
              <div className="w-6 h-6 bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/7VU326WoYM.png')] bg-cover bg-no-repeat" />
            </button>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="w-full max-w-[1280px] mt-10">{renderStepContent()}</div>

      {/* Modals */}
      <AddPatientModal isOpen={isAddPatientOpen} onClose={() => setIsAddPatientOpen(false)} />
      <AppointmentDatePickerModal
        onDateSelect={(date: string) => {
    // 1) Save selected date
    setBookingData((prev) => ({ ...prev, appointmentDate: date }));
    // 2) Advance to Step 3: Patient Info
    setCurrentStep(3);
    // 3) Close the date picker
    setIsDatePickerOpen(false);
  }}
      isOpen={isDatePickerOpen} onClose={() => setIsDatePickerOpen(false)} />
      <LocationPickerModal
         onConfirmLocation={() => {
     setIsLocationPickerOpen(false);
     setIsDatePickerOpen(true);
 }}
      isOpen={isLocationPickerOpen} onClose={() => setIsLocationPickerOpen(false)} />
      <SessionSelectorModal isOpen={isSessionSelectorOpen} onClose={() => setIsSessionSelectorOpen(false)} />
      <SymptomsSearchModal isOpen={isSymptomsSearchOpen} onClose={() => setIsSymptomsSearchOpen(false)} />
      <DoctorProfileDetailed isOpen={isDetailedProfileOpen} onClose={() => setIsDetailedProfileOpen(false)} />
    </div>
  )
}

// Step 1: Specialty Selection
function Step1SpecialtySelection({ onNext,onOpenSymptoms }: { onNext: () => void, onOpenSymptoms: () => void }) {

  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-4">
        <h2 className="text-lg sm:text-xl font-bold leading-7 text-[#1e1e1e]">
          هل ترغب في الحصول على المساعدة لاختيار العيادة المناسبة؟
        </h2>
        <p className="text-base leading-6 text-[#1e1e1e] text-right">
          قم بإدخال الاعراض وسنوجهك إلى العيادة والطبيب المناسبين يتم البحث عن أطباء حسب الأعراض
        </p>
        <button
          onClick={onOpenSymptoms} // ← هنا يتم فتح المودال
          className="px-6 py-3 bg-[#62a0f6] rounded-lg text-white font-normal text-base flex items-center gap-2"
        >
          ابحث عن طبيب حسب الاعراض
          <div className="w-6 h-6 bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/PGJRK1y8BJ.png')] bg-cover bg-no-repeat" />
        </button>
      </div>

      <div className="w-full h-px bg-gray-200" />

      <div>
        <h2 className="text-lg sm:text-xl font-bold leading-7 text-[#1e1e1e] mb-6">
          من فضلك ساعدنا باختيار نوع الاستشارة ومن ثم أكمل الخطوات
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "استشارة فورية", icon: "yvpSVLkvXh", bgColor: "bg-white border border-[#f2f4f7]" },
            { title: "طب الأسرة", icon: "94VmCEPAbF", bgColor: "bg-[#62a0f6]", textColor: "text-white" },
            { title: "الباطنة", icon: "QEdToK4EUj", bgColor: "bg-white border border-[#f2f4f7]" },
            { title: "الأطفال", icon: "82NaGR4d0s", bgColor: "bg-white border border-[#f2f4f7]" },
            { title: "النساء والولادة", icon: "yvpSVLkvXh", bgColor: "bg-white border border-[#f2f4f7]" },
            { title: "الجراحة", icon: "94VmCEPAbF", bgColor: "bg-white border border-[#f2f4f7]" },
          ].map(({ title, icon, bgColor, textColor = "text-[#1e1e1e]" }, i) => (
            <button
              key={i}
              onClick={onNext}
              className={`${bgColor} rounded-3xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition-shadow`}
            >
              <div className="w-12 h-12 bg-[#eff6fe] rounded-full flex items-center justify-center">
                <div
                  className="w-8 h-8 bg-no-repeat bg-contain"
                  style={{
                    backgroundImage: `url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/${icon}.png)`,
                  }}
                />
              </div>
              <span className={`${textColor} text-base font-medium`}>{title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Step 2: Doctor Selection
function Step2DoctorSelection({
  onDoctorSelect,
  onOpenLocations,
  onOpenDetailedProfile,
}: {
  onDoctorSelect: (doctor: any) => void
  onOpenLocations: () => void
  onOpenDetailedProfile: () => void
}) {
  const doctors = [
    {
      id: 1,
      name: "د / أحمد عاطف",
      title: "أخصائي أول",
      experience: "4 سنوات",
      specialty: "طب أسرة",
      price: 300,
      rating: 5,
      description: "وصف بسيط جدا هنا",
      videoDuration: "15 دقيقة",
    },
    {
      id: 2,
      name: "د / سارة محمد",
      title: "استشاري",
      experience: "8 سنوات",
      specialty: "طب أسرة",
      price: 450,
      rating: 5,
      description: "خبرة واسعة في طب الأسرة",
      videoDuration: "20 دقيقة",
    },
  ]

  return (
    <div className="w-full max-w-[1280px] relative z-20 mt-10 sm:px-6 lg:px-0 mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar */}
        <div className="w-full lg:w-1/4 bg-[rgba(239,246,254,0.5)] rounded-xl p-6 order-2 lg:order-1">
          <div className="flex flex-col gap-6">
            {/* Filter by Rating */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#1e1e1e]">بواسطة التقييم</h3>
                <ChevronDown className="w-6 h-6 text-black" />
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="flex flex-col gap-5">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex justify-start items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div
                      className={`w-5 h-5 rounded ${
                        rating === 4 ? "bg-[#143087]" : "border border-[#98a2b3]"
                      }`}
                    >
                      {rating === 4 && <Check className="w-5 h-5 text-white" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter by Experience */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#1e1e1e]">سنوات الخبرة</h3>
                <Clock className="w-6 h-6 text-black" />
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="flex flex-col gap-5">
                {[
                  { label: "أكثر من سنتين +2", selected: false },
                  { label: "أكثر من 3 سنوات +3", selected: true },
                  { label: "أكثر من 5 سنوات +5", selected: false },
                ].map(({ label, selected }) => (
                  <div key={label} className="flex justify-start items-center gap-2">
                    <span className="text-xs text-[#1e1e1e]">{label}</span>
                    <div
                      className={`w-5 h-5 rounded ${
                        selected ? "bg-[#143087]" : "border border-[#98a2b3]"
                      }`}
                    >
                      {selected && <Check className="w-5 h-5 text-white" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Search Results Content */}
        <div className="w-full lg:w-3/4 flex flex-col gap-6 order-1 lg:order-2">
          {/* Search Results Header */}
          <div className="flex justify-start mb-6">
            <div className="text-center">
              <span className="text-lg font-bold text-[#1e1e1e]">نتيجة البحث </span>
              <span className="text-sm font-normal text-[#736b7a]">({doctors.length} نتيجة)</span>
            </div>
          </div>

          {/* Map over doctors array */}
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl border border-[#d0d5dd] p-6"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className="w-full md:w-[216px] h-[160px] rounded-lg overflow-hidden">
                  <Image
                    src="https://placehold.co/600x400/png"
                    alt="Doctor"
                    width={216}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Doctor Info */}
                <div className="flex flex-col gap-3 items-start flex-1">
                  <h2 className="text-xl font-semibold text-[#1e1e1e]">{doctor.name}</h2>
                  <p className="text-sm text-[#1e1e1e]">{doctor.title}</p>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < doctor.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-[#736b7a]">{doctor.description}</p>
                </div>

                <div className="hidden md:block w-px h-32 bg-gray-200 mx-4"></div>

                {/* Additional Details */}
                <div className="flex flex-col gap-4 items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#1e1e1e]" />
                    </div>
                    <div className="text-sm">
                      <span className="text-[#b5b5b5]">الخبرة : </span>
                      <span className="text-[#1e1e1e]">{doctor.experience}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                      <Video className="w-5 h-5 text-[#1e1e1e]" />
                    </div>
                    <div className="text-sm">
                      <span className="text-[#b5b5b5]">استشارة طبية فيديو : </span>
                      <span className="text-[#1e1e1e]">{doctor.videoDuration}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                      <User className="w-5 h-5 text-[#1e1e1e]" />
                    </div>
                    <div className="text-sm">
                      <span className="text-[#b5b5b5]">التخصص العام : </span>
                      <span className="text-[#1e1e1e]">{doctor.specialty}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promotion Banner */}
              <div className="mt-6 bg-[rgba(0,181,180,0.15)] rounded-xl py-1 px-4 relative flex justify-between items-center">
                <div className="text-sm text-black">
                  🎁 عرض خاص: خصم 20% على باقة 5 جلسات علاج طبيعي حتى نهاية الشهر!
                </div>
                <div className="bg-[#00b5b4] text-white px-3 py-2 rounded-lg text-sm">
                  الاستمتاع بالعرض
                </div>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              {/* Price and Actions */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-right">
                  <span className="text-sm text-[#1e1e1e]">السعر : </span>
                  <span className="text-lg font-bold text-[#62a0f6]">{doctor.price} ريال</span>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => onOpenLocations()}
                    className="bg-[#143087] text-white rounded-xl px-4 py-3 text-sm font-semibold"
                  >
                    احجز ميعاد الان
                  </button>
                  <button
                  onClick={() => onOpenDetailedProfile()}
                  className="bg-[#eff6fe] text-[#62a0f6] rounded-xl px-4 py-3 text-sm font-semibold">
                    رؤية الملف الشخصي
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Step 3: Patient Information
function Step3PatientInfo({ onNext,onOpenAddPatient }: { onNext: () => void, onOpenAddPatient: () => void }) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
                <div className="flex justify-start">
                  <h2 className="text-xl font-bold text-[#1e1e1e] text-center">بيانات الدكتور</h2>
                </div>
      
                <div className="bg-white rounded-2xl border border-[#d0d5dd] p-5">
                  <div className="flex flex-col lg:flex-row gap-6 items-center">
                    {/* Doctor Photo and Info */}
                    <div className="flex flex-col md:flex-row gap-6 items-center lg:order-1">
                      <div className="w-[216px] h-[160px] rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src="https://placehold.co/600x400/png"
                          alt="Doctor"
                          width={216}
                          height={160}
                          className="w-full h-full object-cover"
                        />
                      </div>
      
                      <div className="flex flex-col gap-3 items-start text-right">
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
                    <div className="flex flex-col items-center gap-6 lg:order-2 w-full lg:flex-1">
                      <div className="flex flex-col md:flex-row gap-4 justify-center  items-start">
                        <div className="flex flex-col gap-4 items-start">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center bg-white">
                            <Video className="w-5 h-5 text-[#1e1e1e]" />
                          </div>
                          <div className="text-sm">
                            <span className="text-[#b5b5b5]">استشارة طبية فيديو : </span>
                            <span className="text-[#1e1e1e]">15 دقيقة</span>
                          </div>
                          
                        </div>
      
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center bg-white">
                            <User className="w-5 h-5 text-[#1e1e1e]" />
                          </div>
                          <div className="text-sm">
                            <span className="text-[#b5b5b5]">التخصص العام : </span>
                            <span className="text-[#1e1e1e]">طب أسرة</span>
                          </div>
                          
                        </div>
      
                        </div>
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center bg-white">
                          <Clock className="w-5 h-5 text-[#1e1e1e]" />
                        </div>
                        <div className="text-sm">
                          <span className="text-[#b5b5b5]">الخبرة : </span>
                          <span className="text-[#1e1e1e]">4 سنوات</span>
                        </div>
                        
                      </div>
                      </div>
      
                    </div>
                    
                    
      
                    
                  </div>
                </div>
              </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-[#1e1e1e]">بيانات المريض</h2>

        <div className="bg-white rounded-2xl border border-[#d0d5dd] p-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col gap-3 items-start text-right">
              <h3 className="text-lg font-semibold text-[#62a0f6]">اسم المريض</h3>
              <p className="text-sm text-[#1e1e1e]">يمكنك اضافة مزيد من المرضي</p>
            </div>
            <button
            onClick={onOpenAddPatient}
            className="flex items-center gap-2 bg-[#62a0f6] text-white rounded-lg px-3 py-3 text-sm font-medium">
              <Plus className="w-6 h-6" />
              <span>اضافة المزيد من المرضي</span>
            </button>

            
          </div>

          <div className="flex items-center justify-start gap-4 mt-8">
            <div className="w-12 h-12 bg-[#eff6fe] rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-[#62a0f6]" />
            </div>
            <span className="text-sm font-bold text-[#1e1e1e]">احمد عاطف</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#d0d5dd] p-5">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3 items-start text-right">
              <h3 className="text-lg font-semibold text-[#62a0f6] text-center">اشرح المشكلة الصحية التي تعاني منها</h3>
              <p className="text-sm text-[#1e1e1e] text-center">
                الرجاء إخبار الطبيب اذا كنت تعاني من أي مرض مزمن أو حساسية أو إذا كنت تتناول أي أدوية
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { icon: FileText, label: "ملاحظة نصية", optional: true },
                { icon: Mic, label: "ملاحظة صوتية", optional: true },
                { icon: Paperclip, label: "المرفقات", optional: true },
              ].map(({ icon: Icon, label, optional }) => (
                <div
                  key={label}
                  className="flex items-center justify-between bg-white border border-[#d0d5dd] rounded-2xl p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 bg-[#eff6fe] rounded-full flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#62a0f6]" />
                    </div>
                    <div className="text-sm text-right">
                      <span className="text-[#1e1e1e]">{label} </span>
                      {optional && <span className="text-[#736b7a]">( اختياري )</span>}
                    </div>
                  </div>
                  <button className="bg-[#62a0f6] text-white rounded-lg px-3 py-2 text-sm font-medium">اضافة</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button onClick={onNext} className="bg-[#143087] text-white rounded-xl px-6 py-4 text-sm font-semibold">
          متابعة الحجز الان
        </button>
      </div>
    </div>
  )
}

// Step 4: Payment
function Step4Payment({ onNext, bookingData }: { onNext: () => void; bookingData: BookingData }) {
  return (
   <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Right Column - Booking Details & Payment Methods */}
        <div className="flex flex-col gap-8 order-2 lg:order-1">
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
        
        
        {/* Left Column - Discount & Payment Summary */}
        <div className="flex flex-col gap-12 order-1 lg:order-2">
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
          <button
          onClick={onNext}
          className="bg-[#143087] text-white rounded-xl px-4 py-4 text-lg font-medium flex items-center justify-center gap-2 w-full">
            <span>متابعة الدفع</span>
            <ChevronDown className="w-6 h-6 rotate-90" />
          </button>
        </div>

        
      </div>
    </div>
  )
}

// Step 5: Confirmation
function Step5Confirmation({ bookingData }: { bookingData: BookingData }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl" dir="rtl">
      <div className="flex flex-col gap-16 items-center">
        {/* Success Section */}
        <div className="flex flex-col gap-14 items-center w-full max-w-lg">
          {/* Success Illustration */}
          <div className="flex flex-col gap-1 items-center w-full">
            <div
            style={{ backgroundImage: 'url(/assets/images/homehellers/order_confirmed.svg)' }}
            className="relative w-full max-w-[500px] h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden"/>

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
