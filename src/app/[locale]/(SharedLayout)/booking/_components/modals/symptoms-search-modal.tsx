"use client"
import { useState } from "react"
import { X, Search } from "lucide-react"

interface SymptomsSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (symptoms: string[]) => void
}

interface Symptom {
  id: number
  name: string
  category: string
  icon: string
}

export default function SymptomsSearchModal({ isOpen, onClose, onSelect }: SymptomsSearchModalProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const symptoms: Symptom[] = [
    { id: 1, name: "صداع", category: "الرأس", icon: "🤕" },
    { id: 2, name: "ألم في الظهر", category: "العظام", icon: "🦴" },
    { id: 3, name: "ارتجاع المريء", category: "الهضم", icon: "🫃" },
    { id: 4, name: "تساقط الشعر", category: "الجلد", icon: "💇" },
    { id: 5, name: "ألم في الصدر", category: "القلب", icon: "❤️" },
    { id: 6, name: "ضيق في التنفس", category: "الرئة", icon: "🫁" },
    { id: 7, name: "حب الشباب", category: "الجلد", icon: "😷" },
    { id: 8, name: "ألم في البطن", category: "الهضم", icon: "🤰" },
    { id: 9, name: "دوخة", category: "الرأس", icon: "😵" },
    { id: 10, name: "ألم في المفاصل", category: "العظام", icon: "🦴" },
    { id: 11, name: "حمى", category: "عام", icon: "🌡️" },
    { id: 12, name: "سعال", category: "الرئة", icon: "😷" },
  ]

  const filteredSymptoms = symptoms.filter(
    (symptom) =>
      symptom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      symptom.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleSymptom = (symptomId: number) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId) ? prev.filter((id) => id !== symptomId) : [...prev, symptomId],
    )
  }

  const handleConfirm = () => {
    const selectedSymptomNames = symptoms
      .filter((symptom) => selectedSymptoms.includes(symptom.id))
      .map((symptom) => symptom.name)

    onSelect(selectedSymptomNames)
  }
//@ts-ignore
  const categories = [...new Set(symptoms.map((s) => s.category))]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 overflow-y-auto" dir="rtl">
      <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#1e1e1e]">البحث حسب الأعراض</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن الأعراض..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 pr-12 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#62a0f6]"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Selected Symptoms Count */}
          {selectedSymptoms.length > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-medium">تم اختيار {selectedSymptoms.length} من الأعراض</p>
            </div>
          )}

          {/* Symptoms by Category */}
          {categories.map((category) => {
            const categorySymptoms = filteredSymptoms.filter((s) => s.category === category)
            if (categorySymptoms.length === 0) return null

            return (
              <div key={category} className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1e1e1e] border-b border-gray-200 pb-2">أعراض {category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorySymptoms.map((symptom) => {
                    const isSelected = selectedSymptoms.includes(symptom.id)
                    return (
                      <button
                        key={symptom.id}
                        onClick={() => toggleSymptom(symptom.id)}
                        className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                          isSelected
                            ? "border-[#62a0f6] bg-[#eff6fe] shadow-md"
                            : "border-gray-200 bg-white hover:border-[#62a0f6] shadow-sm hover:shadow-md"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className={`text-3xl p-3 rounded-full ${isSelected ? "bg-[#cee2fc]" : "bg-gray-100"}`}>
                            {symptom.icon}
                          </div>
                          <div className="text-center">
                            <h4 className={`font-medium ${isSelected ? "text-[#62a0f6]" : "text-[#1e1e1e]"}`}>
                              {symptom.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">{symptom.category}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {/* No Results */}
          {filteredSymptoms.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لم يتم العثور على أعراض مطابقة</p>
              <p className="text-sm text-gray-500 mt-2">جرب البحث بكلمات أخرى</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedSymptoms.length === 0}
              className="flex-1 px-6 py-3 bg-[#143087] text-white rounded-lg hover:bg-[#0f2470] disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              تأكيد الاختيار ({selectedSymptoms.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
