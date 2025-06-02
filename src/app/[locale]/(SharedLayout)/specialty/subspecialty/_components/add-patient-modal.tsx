"use client";

import type React from "react";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  relationship: string;
  nationality: string;
  idNumber: string;
  phone: string;
  email: string;
  gender: "male" | "female" | "";
  birthDate: string;
  bloodType: string;
}

export default function AddPatientModal({
  isOpen,
  onClose,
}: AddPatientModalProps) {
  const [formData, setFormData] = useState<FormData>({
    relationship: "",
    nationality: "",
    idNumber: "",
    phone: "",
    email: "",
    gender: "male", // Pre-selected as shown in the design
    birthDate: "",
    bloodType: "",
  });

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
    "أخرى",
  ];
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Patient data:", formData);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10">
          <div className="w-6 h-6 relative overflow-hidden">
            <div className="w-5 h-5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/pQccXt9sZH.png)] bg-[length:100%_100%] bg-no-repeat relative mt-0.5 ml-0.5" />
          </div>
        </button>

        <div className="flex flex-col gap-8 p-6 pt-16">
          {/* Title */}
          <div className="flex justify-center">
            <h2 className="text-xl font-bold text-[#1e1e1e]">
              اضافة مريض جديد
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Relationship */}
            <div className="flex flex-col gap-2 items-start">
              <label className="text-sm text-[#1e1e1e]">اختر صلة القرابة</label>
              <div className="relative w-full">
                <select
                  value={formData.relationship}
                  onChange={(e) =>
                    setFormData({ ...formData, relationship: e.target.value })
                  }
                  className="w-full p-3 border border-[#d0d5dd] rounded-lg text-right text-sm text-[#736b7a] bg-white appearance-none"
                >
                  <option value="">صلة القرابة</option>
                  {relationships.map((rel) => (
                    <option key={rel} value={rel}>
                      {rel}
                    </option>
                  ))}
                </select>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-6 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/iMw79yNVM8.png)] bg-cover bg-no-repeat" />
                </div>
              </div>
            </div>

            {/* Nationality */}
            <div className="flex flex-col gap-2 items-start">
              <label className="text-sm text-[#1e1e1e]">اختر الجنسية</label>
              <div className="relative w-full">
                <select
                  value={formData.nationality}
                  onChange={(e) =>
                    setFormData({ ...formData, nationality: e.target.value })
                  }
                  className="w-full p-3 border border-[#d0d5dd] rounded-lg text-right text-sm text-[#736b7a] bg-white appearance-none"
                >
                  <option value="">اختر الجنسية</option>
                  {nationalities.map((nat) => (
                    <option key={nat} value={nat}>
                      {nat}
                    </option>
                  ))}
                </select>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-6 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/svEp9z4XFj.png)] bg-cover bg-no-repeat" />
                </div>
              </div>
            </div>

            {/* ID Number */}
            <div className="flex flex-col gap-2 items-start">
              <label className="text-sm text-[#1e1e1e]">اكتب رقم الهوية</label>
              <input
                type="text"
                value={formData.idNumber}
                onChange={(e) =>
                  setFormData({ ...formData, idNumber: e.target.value })
                }
                placeholder="رقم الهوية"
                className="w-full p-3 border border-[#d0d5dd] rounded-lg text-right text-sm bg-white text-[#736b7a] placeholder-[#736b7a]"
              />
            </div>

            {/* Phone and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex flex-col gap-2 items-start">
                <label className="text-sm text-[#1e1e1e]">
                  البريد الالكتروني
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="ادخل البريد الالكتروني"
                  className="w-full p-3 border border-[#d0d5dd] rounded-lg text-right text-sm bg-white text-[#736b7a] placeholder-[#736b7a]"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2 items-start">
                <label className="text-sm text-[#1e1e1e]">رقم الهاتف</label>
                <div className="flex border border-[#d0d5dd] rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 bg-[rgba(232,234,243,0.5)] px-2">
                    <div className="w-6 h-6 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/rxyCJ8bmPE.png)] bg-cover bg-no-repeat" />
                    <span className="text-xs font-medium text-[#1e1e1e]">
                      +966
                    </span>
                    <div className="w-8 h-8 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/b9hjAwTpmf.png)] bg-cover bg-no-repeat" />
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="ادخل رقم الهاتف"
                    className="flex-1 p-3 text-right text-sm placeholder-[#736b7a] bg-white text-[#736b7a] border-none outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-2 items-start">
              <label className="text-sm text-[#1e1e1e]">اختر الجنس</label>
              <div className="flex gap-3 w-full p-3 border border-[#d0d5dd] rounded-lg">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: "female" })}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border transition-colors ${
                    formData.gender === "female"
                      ? "bg-[#cee2fc] text-[#62a0f6] border-[#62a0f6]"
                      : "bg-white text-[#1e1e1e] border-[#d0d5dd]"
                  }`}
                >
                  <span className="text-xs">أنثي</span>
                  <div className="w-6 h-6 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/xtJ4YwN9cu.png)] bg-cover bg-no-repeat" />
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: "male" })}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border transition-colors ${
                    formData.gender === "male"
                      ? "bg-[#cee2fc] text-[#62a0f6] border-[#62a0f6]"
                      : "bg-white text-[#1e1e1e] border-[#d0d5dd]"
                  }`}
                >
                  <span className="text-xs">ذكر</span>
                  <div className="w-6 h-6 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/BKiDWfQLFo.png)] bg-cover bg-no-repeat" />
                </button>
              </div>
            </div>

            {/* Birth Date */}
            <div className="flex flex-col gap-2 items-start">
              <label className="text-sm text-[#1e1e1e]">تاريخ الميلاد</label>
              <div className="relative w-full">
                <input
                  type="date"
                  value={formData.birthDate}
                  placeholder="تاريخ الميلاد"
                  onChange={(e) =>
                    setFormData({ ...formData, birthDate: e.target.value })
                  }
                  className="w-full p-3 border border-[#d0d5dd] bg-white rounded-lg text-right text-sm text-[#736b7a]"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-6 relative overflow-hidden">
                    <div className="w-5 h-5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/0YQF0na6Ci.png)] bg-[length:100%_100%] bg-no-repeat relative mt-0.5 ml-0.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Blood Type */}
            <div className="flex flex-col gap-2 items-start">
              <label className="text-sm text-[#1e1e1e]">اختر فصيلة الدم</label>
              <div className="relative w-full">
                <select
                  value={formData.bloodType}
                  onChange={(e) =>
                    setFormData({ ...formData, bloodType: e.target.value })
                  }
                  className="w-full p-3 border border-[#d0d5dd] rounded-lg text-right text-sm text-[#736b7a] bg-white appearance-none"
                >
                  <option value="">فصيلة الدم</option>
                  {bloodTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-6 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/Ww45Fo6PdE.png)] bg-cover bg-no-repeat" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-[#143087] text-white py-4 px-6 rounded-xl text-sm font-semibold hover:bg-[#0f2470] transition-colors w-full mt-4"
            >
              إضافة المريض
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
