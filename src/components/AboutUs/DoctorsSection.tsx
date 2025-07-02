"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import type SwiperCore from "swiper"
import { X, MapPin, Clock, Award, Languages, Phone, Mail } from "lucide-react"
import "swiper/css"

interface Doctor {
  id: number
  doctor_role: string
  name: string
  email: string
  nationality: {
    id: number
    name: {
      en: string
      ar: string
    }
  }
  national_id: string
  country_code: string
  mobile_number: string
  date_of_birth: string
  blood_group: string
  gender: string
  status: boolean
  degree: string
  languages_spoken: string
  classification: string
  department: string
  experience: number
  medical_school: string
  memberships: string
  specialized_in: string
  awards: string
  certification: string
  upload_attachments: string
  medical_registration_number: string
  medical_license_expiry: string
  specialist: string
  sub_specialist: string
  clinic_name: string
  from: string
  to: string
  addresses: any[]
  image: string
  created_at: string
  updated_at: string
}

interface DoctorCardProps {
  doctor: Doctor
  onClick: () => void
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onClick }) => {
  const doctorImage = doctor.image || "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/RvxhzCn35G.png"

  return (
    <motion.div
      className="relative w-full h-[500px] max-w-sm mx-auto cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[85%] h-[430px] bg-cover bg-center bg-no-repeat rounded-t-2xl z-10"
        style={{ backgroundImage: `url(${doctorImage})` }}
      />
      <div className="absolute top-[21%] w-full h-[73%] bg-[#eff6fe] rounded-2xl z-0" />
      <div className="absolute bottom-0 w-full bg-[#62a0f6] rounded-b-2xl pt-3 pb-3 px-6 flex flex-col gap-2 justify-center items-center z-20">
        <span className="text-white text-lg font-semibold leading-7 text-center">{doctor.name}</span>
        <span className="text-white text-base font-light leading-8 text-center">
          {doctor.specialist || doctor.department}
        </span>
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-sm">
                ★
              </span>
            ))}
          </div>
          <span className="text-white text-sm ml-1">5.0</span>
        </div>
      </div>
    </motion.div>
  )
}

interface DoctorModalProps {
  doctor: Doctor | null
  isOpen: boolean
  onClose: () => void
  locale: string
}

const DoctorModal: React.FC<DoctorModalProps> = ({ doctor, isOpen, onClose, locale }) => {
  if (!doctor) return null

  const doctorImage = doctor.image || "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/RvxhzCn35G.png"
  const nationalityName = locale === "ar" ? doctor.nationality.name.ar : doctor.nationality.name.en

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-[#62a0f6] rounded-t-2xl p-6 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div
                  className="w-32 h-32 bg-cover bg-center rounded-full border-4 border-white"
                  style={{ backgroundImage: `url(${doctorImage})` }}
                />
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold mb-2">{doctor.name}</h2>
                  <p className="text-lg opacity-90 mb-1">{doctor.specialist || doctor.department}</p>
                  <p className="opacity-80">{doctor.clinic_name}</p>
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                    <Award size={16} />
                    <span>{doctor.experience} years experience</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-[#62a0f6]" />
                      <span>{doctor.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={18} className="text-[#62a0f6]" />
                      <span>{doctor.mobile_number}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin size={18} className="text-[#62a0f6]" />
                      <span>{nationalityName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Languages size={18} className="text-[#62a0f6]" />
                      <span>{doctor.languages_spoken}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Professional Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-600">Degree:</span>
                      <p className="text-gray-800">{doctor.degree}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Medical School:</span>
                      <p className="text-gray-800">{doctor.medical_school}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Registration Number:</span>
                      <p className="text-gray-800">{doctor.medical_registration_number}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">License Expiry:</span>
                      <p className="text-gray-800">{new Date(doctor.medical_license_expiry).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specialization */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Specialization</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-600">Specialized In:</span>
                    <p className="text-gray-800">{doctor.specialized_in}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Sub-Specialist:</span>
                    <p className="text-gray-800">{doctor.sub_specialist}</p>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Working Hours</h3>
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-[#62a0f6]" />
                  <span>
                    {doctor.from} - {doctor.to}
                  </span>
                </div>
              </div>

              {/* Awards & Memberships */}
              {(doctor.awards || doctor.memberships) && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Awards & Memberships</h3>
                  {doctor.awards && (
                    <div>
                      <span className="font-medium text-gray-600">Awards:</span>
                      <p className="text-gray-800">{doctor.awards}</p>
                    </div>
                  )}
                  {doctor.memberships && (
                    <div>
                      <span className="font-medium text-gray-600">Memberships:</span>
                      <p className="text-gray-800">{doctor.memberships}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button className="flex-1 bg-[#62a0f6] text-white py-3 px-6 rounded-lg hover:bg-[#5090e6] transition-colors">
                  Book Appointment
                </button>
                <button className="flex-1 border border-[#62a0f6] text-[#62a0f6] py-3 px-6 rounded-lg hover:bg-[#62a0f6] hover:text-white transition-colors">
                  Contact Doctor
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const DoctorsSection = ({ data, locale, doctorsData }: { data: any; locale: string; doctorsData: Doctor[] }) => {
  console.log("doctorsData:", doctorsData)

  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const swiperRef = useRef<SwiperCore>()

  const handleDotClick = (index: number) => {
    swiperRef.current?.slideTo(index)
  }

  const handleDoctorClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedDoctor(null)
  }

  // Get the subtitle from the first post
  const subtitle = data.Posts?.[0]?.title || ""
  const words = subtitle.split(" ")

  const subtitleParts = {
    before: `${words[0] || ""} ${words[1] || ""} ${words[2] || ""} `,
    highlight: words[3] || "",
    after: words.slice(4).join(" ") || "",
  }

  return (
    <>
      <div className="w-full max-w-screen-xl mx-auto mt-24 px-4 flex flex-col gap-14 items-center">
        {/* Title Section */}
        <div className="flex flex-col items-center text-center gap-3">
          <span className="text-[#62a0f6] text-base font-medium leading-6">
            {data?.title || "أفضل أطباء العلاج الطبيعي"}
          </span>
          <h2 className="text-[28px] sm:text-[30px] font-semibold leading-10 text-[#1e1e1e]">
            <span>{subtitleParts.before}</span>
            <span className="text-[#62a0f6]">{subtitleParts.highlight} </span>
            <span>{subtitleParts.after}</span>
          </h2>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 2000 }}
          loop
          onSlideChange={(swiper:any) => setActiveIndex(swiper.realIndex)}
          onBeforeInit={(swiper:any) => {
            swiperRef.current = swiper
          }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1280: { slidesPerView: 3 },
          }}
          className="w-full"
        >
          {doctorsData?.map((doctor, index) => (
            <SwiperSlide key={doctor.id}>
              <DoctorCard doctor={doctor} onClick={() => handleDoctorClick(doctor)} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination Dots */}
        <div className="flex gap-3 mt-1">
          {Array.from({ length: Math.min(doctorsData?.length || 0, 5) }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeIndex === index ? "bg-[#62a0f6]" : "bg-[#cee2fc]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Doctor Modal */}
      <DoctorModal doctor={selectedDoctor} isOpen={isModalOpen} onClose={handleCloseModal} locale={locale} />
    </>
  )
}

export default DoctorsSection
