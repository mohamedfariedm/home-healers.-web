"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import type { Patient } from "@/types/booking";

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Patient, isEditing?: boolean) => void;
  patient: Patient | null;
  nationalityOptions?: { id: number; name: string }[];
}

export default function AddPatientModal({
  isOpen,
  onClose,
  onSave,
  patient,
  nationalityOptions = [],
}: AddPatientModalProps) {
  const [formData, setFormData] = useState<Omit<Patient, "id">>({
    name: "",
    relationship: "",
    nationality: "",
    nationality_id: undefined,
    idNumber: "",
    phone: "",
    email: "",
    gender: "male",
    birthDate: "",
    bloodType: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const relationships = [
    "الأب", "الأم", "الأخ", "الأخت", "الابن", "الابنة",
    "الزوج", "الزوجة", "الجد", "الجدة", "أخرى"
  ];

  const fallbackNationalities = [
    "السعودية", "الإمارات", "الكويت", "قطر", "البحرين", "عمان",
    "مصر", "الأردن", "لبنان", "سوريا", "أخرى"
  ];

  const nationalityChoices =
    nationalityOptions.length > 0
      ? nationalityOptions
      : fallbackNationalities.map((name, index) => ({ id: index + 1, name }));

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name,
        relationship: patient.relationship,
        nationality: patient.nationality,
        nationality_id: patient.nationality_id,
        idNumber: patient.idNumber,
        phone: patient.phone,
        email: patient.email,
        gender: patient.gender,
        birthDate: patient.birthDate,
        bloodType: patient.bloodType,
      });
    } else {
      setFormData({
        name: "",
        relationship: "",
        nationality: "",
        nationality_id: undefined,
        idNumber: "",
        phone: "",
        email: "",
        gender: "male",
        birthDate: "",
        bloodType: "",
      });
      setErrors({});
    }
  }, [patient, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields only
    if (!formData.name.trim()) newErrors.name = "الاسم مطلوب";
    if (!formData.nationality) newErrors.nationality = "الجنسية مطلوبة";
    if (!formData.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب";
    if (!formData.birthDate) newErrors.birthDate = "تاريخ الميلاد مطلوب";

    // Optional: Email format check (if provided)
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    // Optional: Phone format check (if provided)
    if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = "رقم الهاتف غير صحيح";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const newPatient: Patient = {
        id: patient?.id || Date.now(),
        ...formData,
      };
      onSave(newPatient, !!patient);
      if (!patient) {
        setFormData({
          name: "",
          relationship: "",
          nationality: "",
          nationality_id: undefined,
          idNumber: "",
          phone: "",
          email: "",
          gender: "male",
          birthDate: "",
          bloodType: "",
        });
        setErrors({});
      }
      toast.success(patient ? "تم تعديل المريض بنجاح" : "تم إضافة المريض بنجاح");
      onClose();
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#1e1e1e]">
            {patient ? "تعديل بيانات المريض" : "إضافة مريض جديد"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Full Name - REQUIRED */}
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

          {/* Relationship & Nationality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* صلة القرابة - NOT REQUIRED */}
            <div>
              <label className="block text-sm font-medium mb-2">
                صلة القرابة
              </label>
              <select
                value={formData.relationship}
                onChange={(e) => handleInputChange("relationship", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#62a0f6]"
              >
                <option value="">اختر صلة القرابة (اختياري)</option>
                {relationships.map((rel) => (
                  <option key={rel} value={rel}>
                    {rel}
                  </option>
                ))}
              </select>
            </div>

            {/* الجنسية - REQUIRED */}
            <div>
              <label className="block text-sm font-medium mb-2 text-red-500">
                * الجنسية
              </label>
              <select
                value={
                  formData.nationality_id != null
                    ? String(formData.nationality_id)
                    : formData.nationality
                }
                onChange={(e) => {
                  const selected = nationalityChoices.find(
                    (option) => String(option.id) === e.target.value
                  );
                  if (selected) {
                    setFormData((prev) => ({
                      ...prev,
                      nationality: selected.name,
                      nationality_id: selected.id,
                    }));
                    if (errors.nationality) {
                      setErrors((prev) => ({ ...prev, nationality: "" }));
                    }
                  }
                }}
                className={`w-full p-3 border rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#62a0f6] ${
                  errors.nationality ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">اختر الجنسية</option>
                {nationalityChoices.map((nat) => (
                  <option key={nat.id} value={String(nat.id)}>
                    {nat.name}
                  </option>
                ))}
              </select>
              {errors.nationality && (
                <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>
              )}
            </div>
          </div>

          {/* رقم الهوية - NOT REQUIRED */}
          <div>
            <label className="block text-sm font-medium mb-2">
              رقم الهوية
            </label>
            <input
              type="text"
              value={formData.idNumber}
              onChange={(e) => handleInputChange("idNumber", e.target.value)}
              placeholder="أدخل رقم الهوية (اختياري)"
              className="w-full p-3 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#62a0f6]"
            />
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* رقم الهاتف - REQUIRED */}
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

            {/* البريد الإلكتروني - NOT REQUIRED */}
            <div>
              <label className="block text-sm font-medium mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="أدخل البريد الإلكتروني (اختياري)"
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

          {/* Birth Date & Blood Type */}
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
                <option value="">اختر فصيلة الدم (اختياري)</option>
                {bloodTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons */}
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
              {patient ? "حفظ التعديلات" : "حفظ المريض"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}