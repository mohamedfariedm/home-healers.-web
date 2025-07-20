"use client"
import { useState } from "react"
import { Search, ArrowRight } from "lucide-react"
import { toast } from "sonner"
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

  // Filter categories
  const filteredCategories =
    categoriesData?.data?.filter(
      (category: Category) =>
        category.name.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.name.en.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

  // Filter services, limited to the selected category if applicable
  const filteredServices =
    servicesData?.data?.filter(
      (service: Service) =>
        (bookingData.selectedCategory
          ? service.category?.id === bookingData.selectedCategory.id
          : true) &&
        (service.name.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.ar.replace(/<[^>]*>/g, "").toLowerCase().includes(searchQuery.toLowerCase()))
    ) || []

  const handleCategorySelect = (category: Category) => {
    updateBookingData({
      selectedCategory: category,
      selectedService: null,
    })

    // Check if the category has services
    const categoryServices = servicesData?.data?.filter(
      (service: Service) => service.category?.id === category.id
    ) || []

    if (categoryServices.length > 0) {
      // Switch to service selection
      setSelectedType("service")
      setSearchQuery("") // Reset search query for service selection
      toast.success(`تم اختيار التخصص: ${category.name.ar}. الآن اختر الخدمة المناسبة.`)
    } else {
      // No services available, proceed to next step
      toast.success(`تم اختيار التخصص: ${category.name.ar}. لا توجد خدمات متاحة لهذا التخصص.`)
      onNext()
    }
  }

  const handleServiceSelect = (service: Service) => {
    updateBookingData({
      selectedService: service,
      //@ts-ignore
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

  // Handle empty data states
  const isCategoriesEmpty = !categoriesData?.data?.length
  const isServicesEmpty = !servicesData?.data?.length || (selectedType === "service" && filteredServices.length === 0)

  // Handle going back to category selection
  const handleBackToCategories = () => {
    setSelectedType("category")
    setSearchQuery("")
    updateBookingData({
      selectedCategory: null,
      selectedService: null,
    })
  }

  return (
    <div className="flex flex-col gap-8 bg-white rounded-2xl shadow-md p-6">
      {/* Symptoms Search Section */}
      <div className="flex flex-col items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
        <h2 className="text-lg sm:text-xl font-bold leading-7 text-[#1e1e1e]">
          هل ترغب في الحصول على المساعدة لاختيار العيادة المناسبة؟
        </h2>
        <p className="text-base leading-6 text-[#1e1e1e] text-right">
          قم بإدخال الأعراض وسنوجهك إلى العيادة و الطبيب المناسبين
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
          disabled={selectedType === "category"}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            selectedType === "category"
              ? "bg-[#62a0f6] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          اختيار حسب التخصص
        </button>
        <button
          onClick={() => setSelectedType("service")}
          disabled={selectedType === "service"}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            selectedType === "service"
              ? "bg-[#62a0f6] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          اختيار حسب الخدمة
        </button>
      </div>

      {/* Back Button for Service Selection */}
      {selectedType === "service" && bookingData.selectedCategory && (
        <button
          onClick={handleBackToCategories}
          className="flex items-center gap-2 text-[#62a0f6] hover:text-[#5090e6] font-medium mb-4"
        >
          <ArrowRight className="w-5 h-5" />
          العودة إلى اختيار التخصص
        </button>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder={selectedType === "category" ? "ابحث عن التخصص..." : "ابحث عن الخدمة..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-4 pr-12 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#62a0f6] focus:border-transparent"
          aria-label={selectedType === "category" ? "البحث عن التخصص" : "البحث عن الخدمة"}
        />
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      {/* Empty State-handling */}
      {selectedType === "category" && isCategoriesEmpty && (
        <div className="text-center p-6 text-gray-600">
          لا توجد تخصصات متاحة حاليًا. حاول لاحقًا أو ابحث حسب الأعراض.
        </div>
      )}
      {selectedType === "service" && isServicesEmpty && (
        <div className="text-center p-6 text-gray-600">
          لا توجد خدمات متاحة لهذا التخصص. يمكنك العودة لاختيار تخصص آخر أو المتابعة.
          <button
            onClick={onNext}
            className="mt-4 px-6 py-3 bg-[#62a0f6] rounded-lg text-white font-medium"
          >
            المتابعة بدون خدمة
          </button>
        </div>
      )}

      {/* Categories/Services Grid */}
      {!isCategoriesEmpty && !isServicesEmpty && (
        <div>
          <h2 className="text-lg sm:text-xl font-bold leading-7 text-[#1e1e1e] mb-6">
            {selectedType === "category" ? "اختر التخصص المناسب" : "اختر الخدمة المناسبة"}
          </h2>

          {selectedType === "category" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                      <img
                        src={category.image?.[0]?.thumbnail || "/default-category.png"}
                        alt={category.name.ar}
                        className="w-8 h-8 object-cover"
                      />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <img
                        src={service.image?.[0]?.thumbnail || "/default-service.png"}
                        alt={service.name.ar}
                        className="w-6 h-6 object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1e1e1e] mb-2">
                        {service.name.ar}{service.name.en !== service.name.ar ? ` (${service.name.en})` : ""}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {service.description.ar.replace(/<[^>]*>/g, "")}
                      </p>
                      {service.category && (
                        <p className="text-xs text-[#62a0f6] mt-2">{service.category.name.ar}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Enhanced Selected Item Display */}
      {(bookingData.selectedCategory || bookingData.selectedService) && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            تم اختيار:{" "}
            {bookingData.selectedCategory && !bookingData.selectedService ? (
              <>
                {bookingData.selectedCategory.name.ar} (تخصص)
              </>
            ) : (
              <>
                {bookingData.selectedService?.name.ar}
                {bookingData.selectedService?.name.en !== bookingData.selectedService?.name.ar
                  ? ` (${bookingData.selectedService?.name.en})`
                  : ""}{" "}
                (خدمة)
                {bookingData.selectedService?.category && (
                  <> - التخصص: {bookingData.selectedService.category.name.ar}</>
                )}
              </>
            )}
          </p>
        </div>
      )}
    </div>
  )
}