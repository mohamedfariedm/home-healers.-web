"use client"

import { useState } from "react"

interface SymptomsSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Symptom {
  id: number
  name: string
  iconUrl: string
  isSelected?: boolean
}

export default function SymptomsSearchModal({ isOpen, onClose }: SymptomsSearchModalProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<number[]>([3, 6, 9]) // Pre-select some symptoms

  if (!isOpen) return null

  const symptoms: Symptom[] = [
    {
      id: 1,
      name: "الكلي",
      iconUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/mP9SAY3boe.png",
    },
    {
      id: 2,
      name: "حب الشباب",
      iconUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/1MdAt5KzHX.png",
    },
    {
      id: 3,
      name: "ارتجاع المرئ",
      iconUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/NGZUfnz7iS.png",
    },
    {
      id: 4,
      name: "تساقط الشعر",
      iconUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/tJS2z8zfZ1.png",
    },
    {
      id: 5,
      name: "الكلي",
      iconUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/dQPOJG4LuC.png",
    },
    {
      id: 6,
      name: "ارتجاع المرئ",
      iconUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/bybCA66GKF.png",
    },
    {
      id: 7,
      name: "حب الشباب",
      iconUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/HRNv09PCwY.png",
    },
    {
      id: 8,
      name: "تساقط الشعر",
      iconUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/JDJMueqg8s.png",
    },
    {
      id: 9,
      name: "ارتجاع المرئ",
      iconUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/MgHe63rK0U.png",
    },
    {
      id: 10,
      name: "الكلي",
      iconUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/ce5YuU6uS9.png",
    },
    {
      id: 11,
      name: "تساقط الشعر",
      iconUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/t7TLe4H4RC.png",
    },
    {
      id: 12,
      name: "حب الشباب",
      iconUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/AK0koZfmxg.png",
    },
  ]

  const toggleSymptom = (symptomId: number) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId) ? prev.filter((id) => id !== symptomId) : [...prev, symptomId],
    )
  }

  const handleConfirm = () => {
    console.log("Selected symptoms:", selectedSymptoms)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto" dir="rtl">
      <div className="relative bg-white rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10">
          <div className="w-6 h-6 relative overflow-hidden">
            <div className="w-5 h-5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/OK53AUHzLg.png)] bg-[length:100%_100%] bg-no-repeat relative mt-0.5 ml-0.5" />
          </div>
        </button>

        <div className="flex flex-col gap-6 p-6 pt-16">
          {/* Title */}
          <div className="flex justify-center">
            <h2 className="text-xl font-bold text-[#1e1e1e]">بحث حسب الأعراض</h2>
          </div>

          {/* Symptoms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {symptoms.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom.id)
              return (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`relative flex flex-col items-center gap-4 p-6 rounded-3xl border transition-all duration-200 hover:scale-105 ${
                    isSelected
                      ? "bg-[#eff6fe] border-[#62a0f6] shadow-md"
                      : "bg-white border-[#d0d5dd] hover:border-[#62a0f6] shadow-sm hover:shadow-md"
                  }`}
                  style={{ minHeight: "160px" }}
                >
                  {/* Icon Container */}
                  <div
                    className={`flex items-center justify-center w-18 h-18 rounded-full p-4 ${
                      isSelected ? "bg-[#cee2fc]" : "bg-[#eff6fe]"
                    }`}
                  >
                    <div
                      className="w-12 h-12 bg-cover bg-no-repeat"
                      style={{ backgroundImage: `url(${symptom.iconUrl})` }}
                    />
                  </div>

                  {/* Symptom Name */}
                  <span
                    className={`text-base font-medium text-center ${isSelected ? "text-[#62a0f6]" : "text-[#1e1e1e]"}`}
                  >
                    {symptom.name}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            className="bg-[#143087] text-white py-4 px-6 rounded-xl text-sm font-semibold hover:bg-[#0f2470] transition-colors w-full"
          >
            تأكيد التحديد
          </button>
        </div>
      </div>
    </div>
  )
}
