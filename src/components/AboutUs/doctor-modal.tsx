"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Clock,
  Award,
  Languages,
  Phone,
  Mail,
  GraduationCap,
  Building,
  Calendar,
  Star,
  Stethoscope,
} from "lucide-react";
import type { Doctor } from "@/types/doctors";
import {
  getDoctorImage,
  getNationalityName,
  formatWorkingHours,
  formatDate,
  getExperienceText,
  getDoctorRating,
} from "@/utils/doctor-helpers";
import type { DoctorsTranslations } from "@/translations/doctors";

interface DoctorModalProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  locale: string;
  translations: DoctorsTranslations;
}

const DoctorModal: React.FC<DoctorModalProps> = ({
  doctor,
  isOpen,
  onClose,
  locale,
  translations,
}) => {
  if (!doctor) return null;

  const doctorImage = getDoctorImage(doctor);
  const nationalityName = getNationalityName(doctor.nationality, locale);
  const workingHours = formatWorkingHours(doctor.from, doctor.to, locale);
  const licenseExpiry = formatDate(doctor.medical_license_expiry, locale);
  const experienceText = getExperienceText(doctor.experience, locale);
  const rating = getDoctorRating(doctor);

  const InfoItem = ({
    icon: Icon,
    label,
    value,
    href,
  }: {
    icon: any;
    label: string;
    value: string;
    href?: string;
  }) => {
    const content = (
      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <Icon size={18} className="text-[#62a0f6] mt-0.5 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <span className="text-sm font-medium text-gray-600 block">
            {label}:
          </span>
          <span className="text-gray-800 break-words">
            {value || translations.notSpecified}
          </span>
        </div>
      </div>
    );

    if (href) {
      return (
        <a
          href={href}
          className="block hover:no-underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );
    }

    return content;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1500] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-[#62a0f6] to-[#4f8ae8] p-4 text-white sm:p-6">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors z-10"
                aria-label={translations.close}
              >
                <X size={24} />
              </button>

              <div className="flex flex-col items-center gap-4 sm:gap-6 lg:flex-row">
                <div className="relative">
                  <div
                    className="h-24 w-24 rounded-full border-4 border-white bg-cover bg-center shadow-lg sm:h-32 sm:w-32"
                    style={{ backgroundImage: `url(${doctorImage})` }}
                  />
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                    <Stethoscope size={20} className="text-[#62a0f6]" />
                  </div>
                </div>

                <div className="flex-1 text-center lg:text-left">
                  <h2 className="mb-2 text-2xl font-bold sm:text-3xl">{doctor.name}</h2>
                  <p className="mb-2 text-lg opacity-90 sm:text-xl">
                    {doctor.specialist || doctor.department}
                  </p>
                  <p className="opacity-80 mb-3">{doctor.clinic_name}</p>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Award size={16} />
                      <span>{experienceText}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star
                        size={16}
                        className="text-yellow-400 fill-yellow-400"
                      />
                      <span>
                        {rating} {translations.rating}
                      </span>
                    </div>
                    <div className="bg-white/20 px-3 py-1 rounded-full">
                      <span className="font-medium">
                        {doctor.session_price} {translations.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[calc(92vh-180px)] overflow-y-auto">
              <div className="space-y-6 p-4 sm:space-y-8 sm:p-6">
                {/* Basic Information & Professional Details */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 border-b-2 border-[#62a0f6] pb-2 flex items-center gap-2">
                      <Mail size={20} className="text-[#62a0f6]" />
                      {translations.basicInformation}
                    </h3>
                    <div className="space-y-2">
                      {/* <InfoItem
                        icon={Mail}
                        label={translations.email}
                        value={doctor.email}
                        href={`mailto:${doctor.email}`}
                      />
                      <InfoItem
                        icon={Phone}
                        label={translations.phone}
                        value={doctor.mobile_number}
                        href={`tel:${doctor.mobile_number}`}
                      /> */}
                      <InfoItem
                        icon={GraduationCap}
                        label={translations.degree}
                        value={doctor.degree}
                      />
                      <InfoItem
                        icon={MapPin}
                        label={translations.nationality}
                        value={nationalityName}
                      />
                      <InfoItem
                        icon={Languages}
                        label={translations.languages}
                        value={doctor.languages_spoken}
                      />
                    </div>
                  </div>

                  {/* Professional Details */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 border-b-2 border-[#62a0f6] pb-2 flex items-center gap-2">
                      <GraduationCap size={20} className="text-[#62a0f6]" />
                      {translations.professionalDetails}
                    </h3>
                    <div className="space-y-2">
                      
                      <InfoItem
                        icon={Building}
                        label={translations.medicalSchool}
                        value={doctor.medical_school}
                      />
                      <InfoItem
                        icon={Award}
                        label={translations.registrationNumber}
                        value={doctor.medical_registration_number}
                      />
                      <InfoItem
                        icon={Calendar}
                        label={translations.licenseExpiry}
                        value={licenseExpiry}
                      />
                    </div>
                  </div>
                </div>

                {/* Specialization */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 border-b-2 border-[#62a0f6] pb-2 flex items-center gap-2">
                    <Stethoscope size={20} className="text-[#62a0f6]" />
                    {translations.specialization}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <span className="font-semibold text-gray-700 block mb-1">
                        {translations.specializedIn}:
                      </span>
                      <p className="text-gray-800">
                        {doctor.specialized_in || translations.notSpecified}
                      </p>
                    </div>
                    {doctor.sub_specialist && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="font-semibold text-gray-700 block mb-1">
                          {translations.subSpecialist}:
                        </span>
                        <p className="text-gray-800">{doctor.sub_specialist}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Working Hours */}
                {/* <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 border-b-2 border-[#62a0f6] pb-2 flex items-center gap-2">
                    <Clock size={20} className="text-[#62a0f6]" />
                    {translations.workingHours}
                  </h3>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock size={18} className="text-[#62a0f6]" />
                      <span className="text-lg font-medium text-gray-800">
                        {workingHours}
                      </span>
                    </div>
                  </div>
                </div> */}

                {/* Awards & Memberships */}
                {(doctor.awards || doctor.memberships) && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 border-b-2 border-[#62a0f6] pb-2 flex items-center gap-2">
                      <Award size={20} className="text-[#62a0f6]" />
                      {translations.awardsAndMemberships}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {doctor.awards && (
                        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                          <span className="font-semibold text-gray-700 block mb-2">
                            {translations.awards}:
                          </span>
                          <p className="text-gray-800">{doctor.awards}</p>
                        </div>
                      )}
                      {doctor.memberships && (
                        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                          <span className="font-semibold text-gray-700 block mb-2">
                            {translations.memberships}:
                          </span>
                          <p className="text-gray-800">{doctor.memberships}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="sticky bottom-0 border-t bg-white p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.a
                    href={`${locale === "ar" ? "" : "/en"}/booking?doctorId=${
                      doctor.id
                    }`}
                    className="flex-1 rounded-xl bg-gradient-to-r from-[#62a0f6] to-[#4f8ae8] px-6 py-3 text-center font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl sm:py-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {translations.bookAppointment}
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DoctorModal;
