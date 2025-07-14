"use client"
import { useState } from "react"
import { Search } from "lucide-react"
import type { BookingData, Category, Service } from "@/types/booking"

interface Step1Props {
  categoriesData: any
  servicesData: any
  bookingData: BookingData
  updateBookingData: (updates: Partial<BookingData>) => void
  onNext: () => void
  onOpenSymptoms: () => void
}

export default function Step1SpecialtySelection({
  categoriesData,
  servicesData,
  bookingData,
  updateBookingData,
  onNext,
  onOpenSymptoms,
}: Step1Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<"category" | "service">("category")

  const filteredCategories =
    categoriesData?.data?.filter((category: Category) =>
      category.name.ar.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  const filteredServices =
    servicesData?.data?.filter((service: Service) =>
      service.name.ar.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  const handleCategorySelect = (category: Category) => {
    updateBookingData({
      selectedCategory: category,
      selectedService: null,
    })
    onNext()
  }

  const handleServiceSelect = (service: Service) => {
    updateBookingData({
      selectedService: service,
      selectedCategory: service.category
        ? {
            id: service.category.id,
            name: service.category.name,
            services: [],
          }
        : null,
    })
    onNext()
  }

  return (
    <div className="flex flex-col gap-8 bg-white rounded-2xl shadow-md p-6">
      {/* Symptoms Search Section */}
      <div className="flex flex-col items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
        <h2 className="text-lg sm:text-xl font-bold leading-7 text-[#1e1e1e]">
          هل ترغب في الحصول على المساعدة لاختيار العيادة المناسبة؟
        </h2>
        <p className="text-base leading-6 text-[#1e1e1e] text-right">
          قم بإدخال الأعراض وسنوجهك إلى العيادة والطبيب المناسبين
        </p>
        <button
          onClick={onOpenSymptoms}
          className="px-6 py-3 bg-[#62a0f6] rounded-lg text-white font-medium text-base flex items-center gap-2 hover:bg-[#5090e6] transition-colors"
        >
          <Search className="w-5 h-5" />
          ابحث عن طبيب حسب الأعراض
        </button>
      </div>

      <div className="w-full h-px bg-gray-200" />

      {/* Selection Type Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedType("category")}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            selectedType === "category" ? "bg-[#62a0f6] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          اختيار حسب التخصص
        </button>
        <button
          onClick={() => setSelectedType("service")}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            selectedType === "service" ? "bg-[#62a0f6] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          اختيار حسب الخدمة
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder={selectedType === "category" ? "ابحث عن التخصص..." : "ابحث عن الخدمة..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-4 pr-12 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#62a0f6] focus:border-transparent"
        />
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      {/* Categories/Services Grid */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold leading-7 text-[#1e1e1e] mb-6">
          {selectedType === "category" ? "اختر التخصص المناسب" : "اختر الخدمة المناسبة"}
        </h2>

        {selectedType === "category" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category: Category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category)}
                className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                  bookingData.selectedCategory?.id === category.id
                    ? "border-[#62a0f6] bg-[#eff6fe]"
                    : "border-gray-200 bg-white hover:border-[#62a0f6]"
                }`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-[#eff6fe] rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-[url('/placeholder.svg?height=32&width=32')] bg-cover" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-[#1e1e1e] mb-1">{category.name.ar}</h3>
                    <p className="text-sm text-gray-600">{category.services?.length || 0} خدمة</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service: Service) => (
              <button
                key={service.id}
                onClick={() => handleServiceSelect(service)}
                className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg text-right ${
                  bookingData.selectedService?.id === service.id
                    ? "border-[#62a0f6] bg-[#eff6fe]"
                    : "border-gray-200 bg-white hover:border-[#62a0f6]"
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div className="w-12 h-12 bg-[#eff6fe] rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-[url('/placeholder.svg?height=24&width=24')] bg-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1e1e1e] mb-2">{service.name.ar}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {service.description.ar.replace(/<[^>]*>/g, "")}
                    </p>
                    {service.category && <p className="text-xs text-[#62a0f6] mt-2">{service.category.name.ar}</p>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Item Display */}
      {(bookingData.selectedCategory || bookingData.selectedService) && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            تم اختيار: {bookingData.selectedCategory?.name.ar || bookingData.selectedService?.name.ar}
          </p>
        </div>
      )}
    </div>
  )
}
