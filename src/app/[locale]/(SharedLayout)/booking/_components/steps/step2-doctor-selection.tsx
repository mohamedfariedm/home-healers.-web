"use client"
import { useState, useMemo } from "react"
import { Search, Star, Clock, User, Filter, MapPin } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import type { BookingData, Doctor, Package } from "@/types/booking"

interface Step2Props {
  doctorsData: any
  packagesData: any
  bookingData: BookingData
  updateBookingData: (updates: Partial<BookingData>) => void
  onNext: () => void
  onPrev: () => void
  onOpenProfile: (doctor: Doctor) => void
  isLoading: boolean
}

export default function Step2DoctorSelection({
  doctorsData,
  packagesData,
  bookingData,
  updateBookingData,
  onNext,
  onPrev,
  onOpenProfile,
  isLoading,
}: Step2Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Validate image URL
  const isValidImage = (attachment: string) => /\.(jpg|jpeg|png|gif)$/i.test(attachment)
  const getDoctorImage = (doctor: Doctor) =>
    doctor.upload_attachments && isValidImage(doctor.upload_attachments)
      ? doctor.upload_attachments
      : doctor.service?.image?.[0]?.original && isValidImage(doctor.service.image[0].original)
      ? doctor.service.image[0].original
      : "/default-doctor.png"

  // Filter doctors based on search and Step 1 selection
  const filteredDoctors = useMemo(() => {
    if (!doctorsData?.data) return []

    return doctorsData.data.filter((doctor: Doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.clinic_name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesFilters = [
        bookingData.searchFilters.city
          ? doctor.addresses.some((addr: any) => addr.city === bookingData.searchFilters.city)
          : true,
        bookingData.searchFilters.specialty
          ? doctor.specialist === bookingData.searchFilters.specialty
          : true,
        bookingData.searchFilters.experience
          ? doctor.experience >= parseInt(bookingData.searchFilters.experience)
          : true,
        bookingData.searchFilters.rating
          ? (doctor.rate ?? 4) >= bookingData.searchFilters.rating
          : true,
        bookingData.searchFilters.priceRange
          ? doctor.session_price >= bookingData.searchFilters.priceRange[0] &&
            doctor.session_price <= bookingData.searchFilters.priceRange[1]
          : true,
      ].every(Boolean)

      // Filter by selected category or service from Step 1
      const matchesStep1 =
        bookingData.selectedService
          ? doctor.service?.id === bookingData.selectedService.id
          : bookingData.selectedCategory
          ? doctor.specialist === bookingData.selectedCategory.name.ar ||
            doctor.department === bookingData.selectedCategory.name.ar
          : true

      return matchesSearch && matchesFilters && matchesStep1
    })
  }, [
    doctorsData,
    searchQuery,
    bookingData.searchFilters,
    bookingData.selectedCategory,
    bookingData.selectedService,
  ])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    updateBookingData({
      searchFilters: {
        ...bookingData.searchFilters,
        //@ts-ignore
        search: query,
      },
    })
  }

  const handleFilterChange = (key: string, value: any) => {
    updateBookingData({
      searchFilters: {
        ...bookingData.searchFilters,
        [key]: value,
      },
    })
    toast.info("تم تحديث الفلاتر")
  }

  const handleDoctorSelect = (doctor: Doctor) => {
    updateBookingData({ selectedDoctor: doctor })
    toast.success(`تم اختيار الطبيب: ${doctor.name}`)
    onNext()
  }

  const handlePackageSelect = (pkg: Package) => {
    updateBookingData({ selectedPackage: pkg })
    toast.success(`تم اختيار الباقة: ${pkg.name.ar}`)
  }

  // Handle empty state
  const isDoctorsEmpty = !doctorsData?.data?.length || !filteredDoctors.length
  const isPackagesEmpty = !packagesData?.data?.length

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن طبيب أو عيادة..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full p-4 pr-12 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#62a0f6]"
              aria-label="البحث عن طبيب أو عيادة"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              aria-label="فتح أو إغلاق الفلاتر"
            >
              <Filter className="w-4 h-4" />
              فلترة النتائج
            </button>

            <select
              value={bookingData.searchFilters.city}
              onChange={(e) => handleFilterChange("city", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              aria-label="اختيار المدينة"
            >
              <option value="">جميع المدن</option>
              <option value="riyadh">الرياض</option>
              <option value="jeddah">جدة</option>
              <option value="dammam">الدمام</option>
            </select>

            <select
              value={bookingData.searchFilters.specialty}
              onChange={(e) => handleFilterChange("specialty", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              aria-label="اختيار التخصص"
            >
              <option value="">جميع التخصصات</option>
              {bookingData.selectedCategory ? (
                <option value={bookingData.selectedCategory.name.ar}>
                  {bookingData.selectedCategory.name.ar}
                </option>
              ) : (
                <>
                  <option value="رعاية الأسنان">رعاية الأسنان</option>
                  <option value="طب الأسرة">طب الأسرة</option>
                  <option value="الباطنة">الباطنة</option>
                  <option value="الأطفال">الأطفال</option>
                </>
              )}
            </select>

            <select
              value={bookingData.searchFilters.experience}
              onChange={(e) => handleFilterChange("experience", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              aria-label="اختيار سنوات الخبرة"
            >
              <option value="">سنوات الخبرة</option>
              <option value="2">أكثر من سنتين</option>
              <option value="5">أكثر من 5 سنوات</option>
              <option value="10">أكثر من 10 سنوات</option>
            </select>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">التقييم</label>
                  <div className="flex gap-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleFilterChange("rating", rating)}
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg border ${
                          bookingData.searchFilters.rating === rating
                            ? "border-[#62a0f6] bg-[#eff6fe]"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                        aria-label={`تصفية حسب التقييم ${rating} نجوم`}
                      >
                        <span className="text-sm">{rating}</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">نطاق السعر</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="من"
                      value={bookingData.searchFilters.priceRange[0]}
                      onChange={(e) =>
                        handleFilterChange("priceRange", [
                          Number.parseInt(e.target.value) || 0,
                          bookingData.searchFilters.priceRange[1],
                        ])
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      aria-label="الحد الأدنى للسعر"
                    />
                    <input
                      type="number"
                      placeholder="إلى"
                      value={bookingData.searchFilters.priceRange[1]}
                      onChange={(e) =>
                        handleFilterChange("priceRange", [
                          bookingData.searchFilters.priceRange[0],
                          Number.parseInt(e.target.value) || 1000,
                        ])
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      aria-label="الحد الأقصى للسعر"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Packages Sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">الباقات المتاحة</h3>
            {isPackagesEmpty ? (
              <p className="text-gray-600 text-center">لا توجد باقات متاحة</p>
            ) : (
              <div className="space-y-3">
                {packagesData?.data?.map((pkg: Package) => (
                  <button
                    key={pkg.id}
                    onClick={() => handlePackageSelect(pkg)}
                    className={`w-full p-4 rounded-lg border-2 text-right transition-all ${
                      bookingData.selectedPackage?.id === pkg.id
                        ? "border-[#62a0f6] bg-[#eff6fe]"
                        : "border-gray-200 hover:border-[#62a0f6]"
                    }`}
                    aria-label={`اختيار الباقة ${pkg.name.ar}`}
                  >
                    <div className="font-semibold text-[#1e1e1e] mb-1">{pkg.name.ar}</div>
                    <div className="text-sm text-gray-600 mb-2">{pkg.description.ar}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-[#62a0f6]">{pkg.price} ريال</span>
                      {pkg.discount && (
                        <span className="text-sm text-green-600">خصم {pkg.discount} ريال</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Doctors List */}
        <div className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">نتائج البحث</h2>
            <span className="text-gray-600">({filteredDoctors.length} طبيب)</span>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#62a0f6]"></div>
            </div>
          ) : isDoctorsEmpty ? (
            <div className="text-center p-6 text-gray-600">
              لا توجد أطباء متاحين وفقًا للفلاتر المحددة. حاول تعديل الفلاتر أو العودة لاختيار تخصص آخر.
              <button
                onClick={onPrev}
                className="mt-4 px-6 py-3 bg-[#62a0f6] text-white rounded-lg hover:bg-[#5090e6]"
              >
                العودة إلى اختيار التخصص
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredDoctors.map((doctor: Doctor) => (
                <div
                  key={doctor.id}
                  className={`bg-white rounded-2xl shadow-md p-6 transition-all ${
                    bookingData.selectedDoctor?.id === doctor.id
                      ? "shadow-[0_0_10px_rgba(98,160,246,0.5)] bg-[#eff6fe] border-2 border-[#62a0f6]"
                      : "hover:shadow-lg cursor-pointer"
                  }`}
                  aria-selected={bookingData.selectedDoctor?.id === doctor.id}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Doctor Image */}
                    <div className="w-full md:w-48 h-40 rounded-lg overflow-hidden">
                      {/* <Image
                        src={getDoctorImage(doctor)}
                        alt={`صورة الطبيب ${doctor.name}`}
                        width={192}
                        height={160}
                        className="w-full h-full object-cover"
                      /> */}
                    </div>

                    {/* Doctor Info */}
                    <div className="flex-1">
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold text-[#1e1e1e]">{doctor.name}</h3>
                            <p className="text-sm text-gray-600">
                              {doctor.doctor_role !== "atque" ? doctor.doctor_role : doctor.specialist}
                            </p>
                          </div>
                          <div className="flex">
                            {Array.from({ length: doctor.rate ?? 4 }).map((_, i) => (
                              <Star
                                key={i}
                                className="w-5 h-5 text-yellow-400 fill-yellow-400"
                                aria-hidden="true"
                              />
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">الخبرة: {doctor.experience} سنوات</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">
                              التخصص: {doctor.specialist !== "doloremque" ? doctor.specialist : "غير محدد"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">العيادة: {doctor.clinic_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">
                              المواعيد: {doctor.from} - {doctor.to}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <div className="text-right">
                            <span className="text-sm text-gray-600">السعر: </span>
                            <span className="text-lg font-bold text-[#62a0f6]">
                              {doctor.session_price} ريال
                            </span>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => onOpenProfile(doctor)}
                              className="px-4 py-2 border border-[#62a0f6] text-[#62a0f6] rounded-lg hover:bg-[#eff6fe] transition-colors"
                              aria-label={`عرض ملف الطبيب ${doctor.name}`}
                            >
                              عرض الملف
                            </button>
                            <button
                              onClick={() => handleDoctorSelect(doctor)}
                              className="px-6 py-2 bg-[#143087] text-white rounded-lg hover:bg-[#0f2470] transition-colors"
                              aria-label={`اختيار الطبيب ${doctor.name}`}
                            >
                              اختيار الطبيب
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          aria-label="الرجوع إلى الخطوة السابقة"
        >
          السابق
        </button>
        <button
          onClick={() => {
            if (!bookingData.selectedDoctor) {
              toast.error("يرجى اختيار طبيب للمتابعة")
              return
            }
            onNext()
          }}
          className="px-6 py-3 bg-[#143087] text-white rounded-lg hover:bg-[#0f2470] disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!bookingData.selectedDoctor}
          aria-label="الانتقال إلى الخطوة التالية"
        >
          التالي
        </button>
      </div>
    </div>
  )
}