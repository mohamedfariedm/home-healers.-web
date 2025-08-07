"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Clock } from 'lucide-react';
import type { Doctor } from "@/types/doctors";
import { getDoctorImage, getExperienceText, getDoctorRating } from "@/utils/doctor-helpers";
import type { DoctorsTranslations } from "@/translations/doctors";

interface DoctorCardProps {
  doctor: Doctor;
  onClick: () => void;
  translations: DoctorsTranslations;
  locale: string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ 
  doctor, 
  onClick, 
  translations,
  locale 
}) => {
  const doctorImage = getDoctorImage(doctor);
  const rating = getDoctorRating(doctor);
  const experienceText = getExperienceText(doctor.experience, locale);

  return (
    <motion.div
      className="relative w-full h-[520px] max-w-sm mx-auto cursor-pointer group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Doctor Image */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[85%] h-[400px] z-10">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat rounded-t-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
          style={{ backgroundImage: `url(${doctorImage})` }}
        />
        {/* Session Price Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
          <span className="text-sm font-semibold text-[#62a0f6]">
            {doctor.session_price} {translations.currency}
          </span>
        </div>
      </div>

      {/* Background Card */}
      <div className="absolute top-[15%] w-full h-[80%] bg-gradient-to-b from-[#eff6fe] to-white rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300" />

      {/* Content Section */}
      <div className="absolute bottom-0 w-full bg-gradient-to-r from-[#62a0f6] to-[#4f8ae8] rounded-b-2xl p-6 text-white z-20">
        {/* Doctor Name */}
        <h3 className="text-lg font-bold leading-6 text-center mb-2 line-clamp-1">
          {doctor.name}
        </h3>

        {/* Specialization */}
        <p className="text-sm font-light leading-5 text-center mb-3 opacity-90 line-clamp-1">
          {doctor.specialist || doctor.department}
        </p>

        {/* Experience and Clinic */}
        <div className="flex items-center justify-center gap-4 mb-3 text-xs">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{experienceText}</span>
          </div>
          {doctor.clinic_name && (
            <div className="flex items-center gap-1">
              <MapPin size={12} />
              <span className="line-clamp-1">{doctor.clinic_name}</span>
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`${
                  i < Math.floor(rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-yellow-200"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl z-30 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
          <span className="text-[#62a0f6] font-medium text-sm">
            {translations.viewProfile}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
