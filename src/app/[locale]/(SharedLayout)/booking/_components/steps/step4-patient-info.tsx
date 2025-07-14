"use client";
import { useState } from "react";
import type React from "react";

import { User, Plus, FileText, Mic, Paperclip } from "lucide-react";
import type { BookingData, Patient } from "@/types/booking";

interface Step4Props {
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  savedPatients: Patient[];
  onNext: () => void;
  onPrev: () => void;
  onOpenAddPatient: () => void;
}

export default function Step4PatientInfo({
  bookingData,
  updateBookingData,
  savedPatients,
  onNext,
  onPrev,
  onOpenAddPatient,
}: Step4Props) {
  const [attachments, setAttachments] = useState<File[]>([]);

  const handlePatientSelect = (patient: Patient) => {
    updateBookingData({ selectedPatient: patient });
  };

  const handleHealthInfoChange = (field: string, value: string) => {
    updateBookingData({
      healthInfo: {
        ...bookingData.healthInfo,
        [field]: value,
      },
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
    updateBookingData({
      healthInfo: {
        ...bookingData.healthInfo,
        attachments: [...bookingData.healthInfo.attachments, ...files],
      },
    });
  };

  const removeAttachment = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
    updateBookingData({
      healthInfo: {
        ...bookingData.healthInfo,
        attachments: newAttachments,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Selected Doctor Info */}
      {bookingData.selectedDoctor && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">بيانات الطبيب المختار</h2>
          <div className="flex items-center gap-4 p-4 bg-[#eff6fe] rounded-lg">
            <div className="w-16 h-16 bg-[#62a0f6] rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {bookingData.selectedDoctor.name}
              </h3>
              <p className="text-gray-600">
                {bookingData.selectedDoctor.specialist}
              </p>
              <p className="text-sm text-gray-500">
                {bookingData.selectedDoctor.clinic_name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Patient Selection */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">اختيار المريض</h2>
          <button
            onClick={onOpenAddPatient}
            className="flex items-center gap-2 px-4 py-2 bg-[#62a0f6] text-white rounded-lg hover:bg-[#5090e6]"
          >
            <Plus className="w-5 h-5" />
            إضافة مريض جديد
          </button>
        </div>

        {/* Current Selected Patient */}
        {bookingData.selectedPatient && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-1">
              المريض المختار:
            </h3>
            <p className="text-green-700">{bookingData.selectedPatient.name}</p>
            <p className="text-sm text-green-600">
              {bookingData.selectedPatient.relationship} -{" "}
              {bookingData.selectedPatient.gender === "male" ? "ذكر" : "أنثى"}
            </p>
          </div>
        )}

        {/* Saved Patients */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedPatients.map((patient) => (
            <button
              key={patient.id}
              onClick={() => handlePatientSelect(patient)}
              className={`p-4 rounded-lg border-2 text-right transition-all ${
                bookingData.selectedPatient?.id === patient.id
                  ? "border-[#62a0f6] bg-[#eff6fe]"
                  : "border-gray-200 hover:border-[#62a0f6]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#eff6fe] rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-[#62a0f6]" />
                </div>
                <div>
                  <h4 className="font-semibold">{patient.name}</h4>
                  <p className="text-sm text-gray-600">
                    {patient.relationship}
                  </p>
                  <p className="text-xs text-gray-500">
                    {patient.gender === "male" ? "ذكر" : "أنثى"}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Health Information */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">المعلومات الصحية</h2>

        <div className="space-y-6">
          {/* Pain Location */}
          <div>
            <label className="block font-semibold mb-2 text-red-500">
              * مكان الألم أو المشكلة الصحية
            </label>
            <input
              type="text"
              value={bookingData.healthInfo.painLocation}
              onChange={(e) =>
                handleHealthInfoChange("painLocation", e.target.value)
              }
              placeholder="مثال: ألم في الظهر، صداع، مشاكل في الهضم..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62a0f6] text-right"
              required
            />
          </div>

          {/* Symptoms */}
          <div>
            <label className="block font-semibold mb-2">الأعراض الحالية</label>
            <textarea
              value={bookingData.healthInfo.symptoms}
              onChange={(e) =>
                handleHealthInfoChange("symptoms", e.target.value)
              }
              placeholder="اشرح الأعراض التي تعاني منها بالتفصيل..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62a0f6] text-right resize-none"
            />
          </div>

          {/* Medical History */}
          <div>
            <label className="block font-semibold mb-2">التاريخ المرضي</label>
            <textarea
              value={bookingData.healthInfo.medicalHistory}
              onChange={(e) =>
                handleHealthInfoChange("medicalHistory", e.target.value)
              }
              placeholder="أي أمراض مزمنة أو عمليات جراحية سابقة..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62a0f6] text-right resize-none"
            />
          </div>

          {/* Current Medications */}
          <div>
            <label className="block font-semibold mb-2">الأدوية الحالية</label>
            <textarea
              value={bookingData.healthInfo.currentMedications}
              onChange={(e) =>
                handleHealthInfoChange("currentMedications", e.target.value)
              }
              placeholder="اذكر جميع الأدوية التي تتناولها حالياً..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62a0f6] text-right resize-none"
            />
          </div>

          {/* Allergies */}
          <div>
            <label className="block font-semibold mb-2">الحساسية</label>
            <input
              type="text"
              value={bookingData.healthInfo.allergies}
              onChange={(e) =>
                handleHealthInfoChange("allergies", e.target.value)
              }
              placeholder="أي حساسية من أدوية أو أطعمة..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62a0f6] text-right"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block font-semibold mb-2">ملاحظات إضافية</label>
            <textarea
              value={bookingData.healthInfo.notes}
              onChange={(e) => handleHealthInfoChange("notes", e.target.value)}
              placeholder="أي معلومات إضافية تريد إخبار الطبيب بها..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62a0f6] text-right resize-none"
            />
          </div>

          {/* File Attachments */}
          <div>
            <label className="block font-semibold mb-4">
              المرفقات (اختياري)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Text Notes */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#62a0f6] transition-colors">
                <FileText className="w-8 h-8 text-[#62a0f6] mx-auto mb-2" />
                <p className="text-sm font-medium mb-2">ملاحظة نصية</p>
                <input
                  type="file"
                  accept=".txt,.doc,.docx,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="text-upload"
                />
                <label
                  htmlFor="text-upload"
                  className="cursor-pointer text-[#62a0f6] text-sm hover:underline"
                >
                  إضافة ملف
                </label>
              </div>

              {/* Voice Notes */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#62a0f6] transition-colors">
                <Mic className="w-8 h-8 text-[#62a0f6] mx-auto mb-2" />
                <p className="text-sm font-medium mb-2">ملاحظة صوتية</p>
                <input
                  type="file"
                  accept=".mp3,.wav,.m4a"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="audio-upload"
                />
                <label
                  htmlFor="audio-upload"
                  className="cursor-pointer text-[#62a0f6] text-sm hover:underline"
                >
                  إضافة تسجيل
                </label>
              </div>

              {/* Image/Document Attachments */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#62a0f6] transition-colors">
                <Paperclip className="w-8 h-8 text-[#62a0f6] mx-auto mb-2" />
                <p className="text-sm font-medium mb-2">صور أو مستندات</p>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  multiple
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-[#62a0f6] text-sm hover:underline"
                >
                  إضافة ملفات
                </label>
              </div>
            </div>

            {/* Uploaded Files */}
            {attachments.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">الملفات المرفقة:</h4>
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm">{file.name}</span>
                      <button
                        onClick={() => removeAttachment(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          السابق
        </button>
        <button
          onClick={onNext}
          disabled={
            !bookingData.selectedPatient ||
            !bookingData.healthInfo.painLocation.trim()
          }
          className="px-6 py-3 bg-[#143087] text-white rounded-lg hover:bg-[#0f2470] disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          التالي
        </button>
      </div>
    </div>
  );
}
