"use client";
import { useState, useRef } from "react";
import type React from "react";
import { User, Plus, FileText, Mic, Paperclip, Edit2, Trash2, Play, Pause } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { BookingData, Patient } from "@/types/booking";

interface Step4Props {
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  savedPatients: Patient[];
  updateSavedPatients: (patients: Patient[]) => void;
  onNext: () => void;
  onPrev: () => void;
  onOpenAddPatient: (patient?: Patient) => void;
}

export default function Step4PatientInfo({
  bookingData,
  updateBookingData,
  savedPatients,
  updateSavedPatients,
  onNext,
  onPrev,
  onOpenAddPatient,
}: Step4Props) {
  const { t } = useTranslation("booking");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingAudioIndex, setPlayingAudioIndex] = useState<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const MAX_RECORDING_DURATION = 300; // 5 minutes in seconds

  const handlePatientToggle = (patient: Patient) => {
    const isSelected = bookingData.selectedPatients.some((p) => p.id === patient.id);
    let updatedPatients: Patient[];
    if (isSelected) {
      updatedPatients = bookingData.selectedPatients.filter((p) => p.id !== patient.id);
    } else {
      updatedPatients = [...bookingData.selectedPatients, patient];
    }
    updateBookingData({ selectedPatients: updatedPatients });
    toast.success(isSelected ? t("step4.patientRemoved") : t("step4.patientSelected"));
  };

  const handleEditPatient = (patient: Patient) => {
    onOpenAddPatient(patient);
  };

  const handleDeletePatient = (patientId: number) => {
    const updatedPatients = savedPatients.filter((p) => p.id !== patientId);
    updateSavedPatients(updatedPatients);
    if (bookingData.selectedPatients.some((p) => p.id !== patientId)) {
      updateBookingData({
        selectedPatients: bookingData.selectedPatients.filter((p) => p.id !== patientId),
      });
    }
    toast.success(t("step4.patientDeleted"));
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
    toast.success(t("step4.filesAdded"));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, {
          type: "audio/webm",
        });
        setAttachments((prev) => [...prev, audioFile]);
        updateBookingData({
          healthInfo: {
            ...bookingData.healthInfo,
            attachments: [...bookingData.healthInfo.attachments, audioFile],
          },
        });
        toast.success(t("step4.audioSaved") || "تم حفظ التسجيل الصوتي بنجاح");

        // Clean up
        stream.getTracks().forEach((track) => track.stop());
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        setRecordingTime(0);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.info(t("step4.startRecording"));

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev + 1 >= MAX_RECORDING_DURATION) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      toast.error(t("step4.microphoneError") || "فشل في الوصول إلى الميكروفون. يرجى التحقق من الأذونات.");
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const removeAttachment = (index: number) => {
    if (playingAudioIndex === index) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingAudioIndex(null);
    }
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
    updateBookingData({
      healthInfo: {
        ...bookingData.healthInfo,
        attachments: newAttachments,
      },
    });
    toast.info(t("step4.fileRemoved") || "تم إزالة الملف");
  };

  const togglePlayAudio = (index: number, file: File) => {
    if (playingAudioIndex === index) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingAudioIndex(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const url = URL.createObjectURL(file);
      audioRef.current = new Audio(url);
      audioRef.current.play().catch((error) => {
        toast.error(t("step4.audioPlayError") || "فشل في تشغيل الصوت");
        console.error("Error playing audio:", error);
      });
      audioRef.current.onended = () => {
        setPlayingAudioIndex(null);
        URL.revokeObjectURL(url);
      };
      setPlayingAudioIndex(index);
    }
  };

  const getFileIcon = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png"].includes(extension || "")) {
      return <Paperclip className="w-6 h-6 text-[#62a0f6]" />;
    } else if (["txt", "doc", "docx", "pdf"].includes(extension || "")) {
      return <FileText className="w-6 h-6 text-[#62a0f6]" />;
    } else if (["webm", "mp3", "wav", "m4a"].includes(extension || "")) {
      return <Mic className="w-6 h-6 text-[#62a0f6]" />;
    }
    return <Paperclip className="w-6 h-6 text-[#62a0f6]" />;
  };

  const getFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6" data-tour="tour-patient">
      {bookingData.selectedDoctor && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">{t("step4.selectedDoctorInfo") || "بيانات الطبيب المختار"}</h2>
          <div className="flex items-center gap-4 p-4 bg-[#eff6fe] rounded-lg">
            <div className="w-16 h-16 bg-[#62a0f6] rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{bookingData.selectedDoctor.name}</h3>
              <p className="text-gray-600">{bookingData.selectedDoctor.specialist}</p>
              <p className="text-sm text-gray-500">{bookingData.selectedDoctor.clinic_name}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{t("step4.selectPatients")}</h2>
          <button
            onClick={() => onOpenAddPatient()}
            className="flex items-center gap-2 px-4 py-2 bg-[#62a0f6] text-white rounded-lg hover:bg-[#5090e6]"
          >
            <Plus className="w-5 h-5" />
            {t("step4.addPatient")}
          </button>
        </div>

        {bookingData.selectedPatients.length > 0 ? (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">{t("step4.selectedPatients") || "المرضى المختارون"}:</h3>
            <div className="space-y-2">
              {bookingData.selectedPatients.map((patient) => (
                <div key={patient.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-green-700">{patient.name}</p>
                    <p className="text-sm text-green-600">
                      {patient.relationship} - {patient.gender === "male" ? t("step1.male") : t("step1.female")} - {patient.nationality}
                    </p>
                  </div>
                  <button
                    onClick={() => handlePatientToggle(patient)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    {t("step3.remove")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-gray-600">{t("step4.noPatientsSelected") || "لم يتم اختيار مرضى بعد"}</p>
            <p className="text-sm text-gray-500">{t("step4.selectAtLeastOnePatient")}</p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="font-semibold mb-4">{t("step4.savedPatients") || "المرضى المحفوظون"}</h3>
          {savedPatients.length === 0 ? (
            <p className="text-gray-600">{t("step4.noSavedPatients") || "لا توجد مرضى محفوظون"}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={`p-4 rounded-lg border-2 text-right transition-all ${
                    bookingData.selectedPatients.some((p) => p.id === patient.id)
                      ? "border-[#62a0f6] bg-[#eff6fe]"
                      : "border-gray-200 hover:border-[#62a0f6]"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#eff6fe] rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-[#62a0f6]" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{patient.name}</h4>
                        <p className="text-sm text-gray-600">{patient.relationship}</p>
                        <p className="text-xs text-gray-500">
                          {patient.gender === "male" ? t("step1.male") : t("step1.female")} - {patient.nationality}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditPatient(patient)}
                        className="text-[#62a0f6] hover:text-[#5090e6]"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeletePatient(patient.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <input
                        type="checkbox"
                        checked={bookingData.selectedPatients.some((p) => p.id === patient.id)}
                        onChange={() => handlePatientToggle(patient)}
                        className="w-5 h-5 text-[#62a0f6] rounded focus:ring-[#62a0f6]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">{t("step4.healthInfo")}</h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-red-500">
                * {t("step4.painLocation")}
              </label>
              <input
                type="text"
                value={bookingData.healthInfo.painLocation}
                onChange={(e) => handleHealthInfoChange("painLocation", e.target.value)}
                placeholder={t("step4.painLocationPlaceholder") || "مثال: ألم في الظهر، صداع، مشاكل في الهضم..."}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62a0f6] text-right"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">{t("step4.symptoms")}</label>
              <textarea
                value={bookingData.healthInfo.symptoms}
                onChange={(e) => handleHealthInfoChange("symptoms", e.target.value)}
                placeholder={t("step4.symptomsPlaceholder") || "اشرح الأعراض التي تعاني منها بالتفصيل..."}
                rows={1}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62a0f6] text-right resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">{t("step4.medicalHistory")}</label>
              <textarea
                value={bookingData.healthInfo.medicalHistory}
                onChange={(e) => handleHealthInfoChange("medicalHistory", e.target.value)}
                placeholder={t("step4.medicalHistoryPlaceholder") || "أي أمراض مزمنة أو عمليات جراحية سابقة..."}
                rows={1}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62a0f6] text-right resize-none"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">{t("step4.currentMedications")}</label>
              <textarea
                value={bookingData.healthInfo.currentMedications}
                onChange={(e) => handleHealthInfoChange("currentMedications", e.target.value)}
                placeholder={t("step4.currentMedicationsPlaceholder") || "اذكر جميع الأدوية التي تتناولها حالياً..."}
                rows={1}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62a0f6] text-right resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">{t("step4.allergies")}</label>
              <input
                type="text"
                value={bookingData.healthInfo.allergies}
                onChange={(e) => handleHealthInfoChange("allergies", e.target.value)}
                placeholder={t("step4.allergiesPlaceholder") || "أي حساسية من أدوية أو أطعمة..."}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62a0f6] text-right"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">{t("step4.notes")}</label>
              <textarea
                value={bookingData.healthInfo.notes}
                onChange={(e) => handleHealthInfoChange("notes", e.target.value)}
                placeholder={t("step4.notesPlaceholder") || "أي معلومات إضافية تريد إخبار الطبيب بها..."}
                rows={1}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62a0f6] text-right resize-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-4">{t("step4.attachments")} ({t("step4.optional") || "اختياري"})</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#62a0f6] transition-colors bg-gray-50">
                <FileText className="w-10 h-10 text-[#62a0f6] mx-auto mb-3" />
                <p className="text-sm font-medium mb-3">{t("step4.textNote") || "ملاحظة نصية"}</p>
                <input
                  type="file"
                  accept=".txt,.doc,.docx,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="text-upload"
                />
                <label
                  htmlFor="text-upload"
                  className="cursor-pointer inline-block px-4 py-2 bg-[#62a0f6] text-white rounded-lg hover:bg-[#5090e6] text-sm"
                >
                  {t("step4.uploadFiles")}
                </label>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#62a0f6] transition-colors bg-gray-50">
                <Mic className="w-10 h-10 text-[#62a0f6] mx-auto mb-3" />
                <p className="text-sm font-medium mb-3">{t("step4.recordAudio")}</p>
                {isRecording ? (
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-sm text-red-600 font-medium">
                      {t("step4.recording") || "جاري التسجيل"}... {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, "0")} / 5:00
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${(recordingTime / MAX_RECORDING_DURATION) * 100}%` }}
                      />
                    </div>
                    <button
                      onClick={stopRecording}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      aria-label={t("step4.stopRecording")}
                    >
                      {t("step4.stopRecording")}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={startRecording}
                    className="px-4 py-2 bg-[#62a0f6] text-white rounded-lg hover:bg-[#5090e6]"
                    aria-label={t("step4.startRecording")}
                  >
                    {t("step4.startRecording")}
                  </button>
                )}
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#62a0f6] transition-colors bg-gray-50">
                <Paperclip className="w-10 h-10 text-[#62a0f6] mx-auto mb-3" />
                <p className="text-sm font-medium mb-3">{t("step4.imagesOrDocuments") || "صور أو مستندات"}</p>
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
                  className="cursor-pointer inline-block px-4 py-2 bg-[#62a0f6] text-white rounded-lg hover:bg-[#5090e6] text-sm"
                >
                  {t("step4.uploadFiles")}
                </label>
              </div>
            </div>

            {attachments.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-lg mb-4">{t("step4.attachedFiles") || "الملفات المرفقة"}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex-shrink-0">{getFileIcon(file)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{getFileSize(file.size)}</p>
                      </div>
                      {file.name.endsWith(".webm") && (
                        <button
                          onClick={() => togglePlayAudio(index, file)}
                          className="p-2 text-[#62a0f6] hover:text-[#5090e6]"
                          aria-label={playingAudioIndex === index ? `${t("step4.pause")} ${file.name}` : `${t("step4.play") || "تشغيل"} ${file.name}`}
                        >
                          {playingAudioIndex === index ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => removeAttachment(index)}
                        className="p-2 text-red-600 hover:text-red-800"
                        aria-label={`${t("step4.delete") || "حذف"} ${file.name}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          {t("step2.previous")}
        </button>
        <button
          onClick={onNext}
          disabled={!bookingData.selectedPatients.length || !bookingData.healthInfo.painLocation.trim()}
          className="px-6 py-3 bg-[#143087] text-white rounded-lg hover:bg-[#0f2470] disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {t("step2.next")}
        </button>
      </div>
    </div>
  );
}