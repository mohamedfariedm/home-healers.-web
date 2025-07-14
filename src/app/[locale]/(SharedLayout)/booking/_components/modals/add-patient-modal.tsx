"use client";
import { useState } from "react";
import type React from "react";

import { X } from "lucide-react";
import type { Patient } from "@/types/booking";

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Patient) => void;
}

export default function AddPatientModal({
  isOpen,
  onClose,
  onSave,
}: AddPatientModalProps) {
  const [formData, setFormData] = useState<Omit<Patient, "id">>({
    name: "",
    relationship: "",
    nationality: "",
    idNumber: "",
    phone: "",
    email: "",
    gender: "male",
    birthDate: "",
    bloodType: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const relationships = [
    "الأب",
    "الأم",
    "الأخ",
    "الأخت",
    "الابن",
    "الابنة",
    "الزوج",
    "الزوجة",
    "الجد",
    "الجدة",
    "أخرى",
  ];

  const nationalities = [
    "السعودية",
    "الإمارات",
    "الكويت",
    "قطر",
    "البحرين",
    "عمان",
    "مصر",
    "الأردن",
    "لبنان",
    "سوريا",
    "أخرى",
  ];

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "الاسم مطلوب";
    if (!formData.relationship) newErrors.relationship = "صلة القرابة مطلوبة";
    if (!formData.nationality) newErrors.nationality = "الجنسية مطلوبة";
    if (!formData.idNumber.trim()) newErrors.idNumber = "رقم الهوية مطلوب";
    if (!formData.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب";
    if (!formData.email.trim()) newErrors.email = "البريد الإلكتروني مطلوب";
    if (!formData.birthDate) newErrors.birthDate = "تاريخ الميلاد مطلوب";

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    // Phone validation
    if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = "رقم الهاتف غير صحيح";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData as Patient);
      setFormData({
        name: "",
        relationship: "",
        nationality: "",
        idNumber: "",
        phone: "",
        email: "",
        gender: "male",
        birthDate: "",
        bloodType: "",
      });
      setErrors({});
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#1e1e1e]">إضافة مريض جديد</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-red-500">
              * الاسم الكامل
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="أدخل الاسم الكامل"
              className={`w-full p-3 border rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#62a0f6] ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Relationship and Nationality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-red-500">
                * صلة القرابة
              </label>
              <select
                value={formData.relationship}
                onChange={(e) =>
                  handleInputChange("relationship", e.target.value)
                }
                className={`w-full p-3 border rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#62a0f6] ${
                  errors.relationship ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">اختر صلة القرابة</option>
                {relationships.map((rel) => (
                  <option key={rel} value={rel}>
                    {rel}
                  </option>
                ))}
              </select>
              {errors.relationship && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.relationship}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-red-500">
                * الجنسية
              </label>
              <select
                value={formData.nationality}
                onChange={(e) =>
                  handleInputChange("nationality", e.target.value)
                }
                className={`w-full p-3 border rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#62a0f6] ${
                  errors.nationality ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">اختر الجنسية</option>
                {nationalities.map((nat) => (
                  <option key={nat} value={nat}>
                    {nat}
                  </option>
                ))}
              </select>
              {errors.nationality && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nationality}
                </p>
              )}
            </div>
          </div>

          {/* ID Number */}
          <div>
            <label className="block text-sm font-medium mb-2 text-red-500">
              * رقم الهوية
            </label>
            <input
              type="text"
              value={formData.idNumber}
              onChange={(e) => handleInputChange("idNumber", e.target.value)}
              placeholder="أدخل رقم الهوية"
              className={`w-full p-3 border rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#62a0f6] ${
                errors.idNumber ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.idNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>
            )}
          </div>

          {/* Phone and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-red-500">
                * رقم الهاتف
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="أدخل رقم الهاتف"
                className={`w-full p-3 border rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#62a0f6] ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-red-500">
                * البريد الإلكتروني
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="أدخل البريد الإلكتروني"
                className={`w-full p-3 border rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#62a0f6] ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-2">الجنس</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleInputChange("gender", "male")}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  formData.gender === "male"
                    ? "border-[#62a0f6] bg-[#eff6fe] text-[#62a0f6]"
                    : "border-gray-300 hover:border-[#62a0f6]"
                }`}
              >
                ذكر
              </button>
              <button
                type="button"
                onClick={() => handleInputChange("gender", "female")}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  formData.gender === "female"
                    ? "border-[#62a0f6] bg-[#eff6fe] text-[#62a0f6]"
                    : "border-gray-300 hover:border-[#62a0f6]"
                }`}
              >
                أنثى
              </button>
            </div>
          </div>

          {/* Birth Date and Blood Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-red-500">
                * تاريخ الميلاد
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                className={`w-full p-3 border rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#62a0f6] ${
                  errors.birthDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.birthDate && (
                <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                فصيلة الدم
              </label>
              <select
                value={formData.bloodType}
                onChange={(e) => handleInputChange("bloodType", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#62a0f6]"
              >
                <option value="">اختر فصيلة الدم</option>
                {bloodTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#143087] text-white rounded-lg hover:bg-[#0f2470]"
            >
              حفظ المريض
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
