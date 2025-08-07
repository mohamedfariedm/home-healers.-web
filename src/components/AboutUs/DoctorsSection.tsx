"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import type SwiperCore from "swiper";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import DoctorCard from "./doctor-card";
import DoctorModal from "./doctor-modal";
import { doctorsTranslations } from "@/translations/doctors";
import { Doctor, DoctorsSectionData } from "@/types/doctors";

interface DoctorsSectionProps {
  data?: DoctorsSectionData;
  locale: string;
  doctorsData: Doctor[];
}

const DoctorsSection: React.FC<DoctorsSectionProps> = ({
  data,
  locale = "ar",
  doctorsData = [],
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const swiperRef = useRef<SwiperCore>();

  const translations = doctorsTranslations[locale as keyof typeof doctorsTranslations] || doctorsTranslations.ar;
  const isRTL = locale === "ar";

  const handleDotClick = (index: number) => {
    swiperRef.current?.slideTo(index);
  };

  const handleDoctorClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  // Parse subtitle for highlighting
  const subtitle = data?.Posts?.[0]?.title || translations.sectionTitle;
  const words = subtitle.split(" ");
  const subtitleParts = {
    before: words.slice(0, 3).join(" "),
    highlight: words[3] || "",
    after: words.slice(4).join(" "),
  };

  if (!doctorsData || doctorsData.length === 0) {
    return (
      <div className="w-full max-w-screen-xl mx-auto mt-24 px-4 py-16 text-center">
        <div className="text-gray-500 text-lg">{translations.noData}</div>
      </div>
    );
  }

  return (
    <>
      <section className="w-full max-w-screen-xl mx-auto mt-24 px-4 py-8">
        <div className="flex flex-col gap-16 items-center">
          {/* Title Section */}
          <motion.div
            className="flex flex-col items-center text-center gap-4 max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#62a0f6] text-base font-semibold leading-6 tracking-wide uppercase">
              {data?.title || translations.sectionTitle}
            </span>
            <h2 className="text-3xl sm:text-3xl lg:text-3xl font-bold leading-tight text-[#1e1e1e]">
              {subtitleParts.before && <span>{subtitleParts.before} </span>}
              {subtitleParts.highlight && (
                <span className="text-[#62a0f6] relative">
                  {subtitleParts.highlight}
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-[#62a0f6] opacity-30"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </span>
              )}
              {subtitleParts.after && <span> {subtitleParts.after}</span>}
            </h2>
          </motion.div>

          {/* Swiper Container */}
          <div className="w-full relative">
            {/* Navigation Buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:bg-[#62a0f6]"
                aria-label="Previous doctor"
              >
                <ChevronLeft size={20} className="text-[#62a0f6] group-hover:text-white transition-colors" />
              </button>
            </div>
            
            <div className="absolute top-1/2 -translate-y-1/2 right-4 z-10">
              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:bg-[#62a0f6]"
                aria-label="Next doctor"
              >
                <ChevronRight size={20} className="text-[#62a0f6] group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Swiper */}
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ 
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              loop={doctorsData.length > 3}
              dir={isRTL ? "rtl" : "ltr"}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              onBeforeInit={(swiper) => {
                swiperRef.current = swiper;
              }}
              breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 25 },
                1024: { slidesPerView: 3, spaceBetween: 30 },
                1280: { slidesPerView: 3, spaceBetween: 35 },
              }}
              className="w-full !pb-16"
            >
              {doctorsData.map((doctor) => (
                <SwiperSlide key={doctor.id} className="!h-auto">
                  <DoctorCard
                    doctor={doctor}
                    onClick={() => handleDoctorClick(doctor)}
                    translations={translations}
                    locale={locale}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Pagination Dots */}
            <div className="flex justify-center gap-3 mt-8">
              {Array.from({ 
                length: Math.min(doctorsData.length, doctorsData.length > 3 ? doctorsData.length : doctorsData.length) 
              }).map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeIndex === index 
                      ? "bg-[#62a0f6] scale-125" 
                      : "bg-[#cee2fc] hover:bg-[#a8c8f0]"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Modal */}
      <DoctorModal
        doctor={selectedDoctor}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        locale={locale}
        translations={translations}
      />
    </>
  );
};

export default DoctorsSection;
