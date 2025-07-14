"use client"
import { useState } from "react"
import { Search, Star, Clock, User, Filter, MapPin } from "lucide-react"
import Image from "next/image"
import type { BookingData, Doctor, Package } from "@/types/booking"

interface Step2Props {
  doctorsData: any
  packagesData: any
  bookingData: BookingData
  updateBookingData: (updates: Partial<BookingData>) => void
  onNext: () => void
  onPrev: () => void
  onOpenProfile: () => void
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

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    updateBookingData({
      searchFilters: {
        ...bookingData.searchFilters,
        // @ts-ignore
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
  }

  const handleDoctorSelect = (doctor: Doctor) => {
    updateBookingData({ selectedDoctor: doctor })
    onNext()
  }

  const handlePackageSelect = (pkg: Package) => {
    updateBookingData({ selectedPackage: pkg })
  }

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
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              فلترة النتائج
            </button>

            <select
              value={bookingData.searchFilters.city}
              onChange={(e) => handleFilterChange("city", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
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
            >
              <option value="">جميع التخصصات</option>
              <option value="family">طب الأسرة</option>
              <option value="internal">الباطنة</option>
              <option value="pediatrics">الأطفال</option>
            </select>

            <select
              value={bookingData.searchFilters.experience}
              onChange={(e) => handleFilterChange("experience", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">سنوات الخبرة</option>
              <option value="2+">أكثر من سنتين</option>
              <option value="5+">أكثر من 5 سنوات</option>
              <option value="10+">أكثر من 10 سنوات</option>
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
                            : "border-gray-300"
                        }`}
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
                >
                  <div className="font-semibold text-[#1e1e1e] mb-1">{pkg.name.ar}</div>
                  <div className="text-sm text-gray-600 mb-2">{pkg.description.ar}</div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-[#62a0f6]">{pkg.price} ريال</span>
                    {pkg.discount && <span className="text-sm text-green-600">خصم {pkg.discount} ريال</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Doctors List */}
        <div className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">نتائج البحث</h2>
            <span className="text-gray-600">({doctorsData?.data?.length || 0} طبيب)</span>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#62a0f6]"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {doctorsData?.data?.map((doctor: Doctor) => (
                <div key={doctor.id} className="bg-white rounded-2xl shadow-md p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Doctor Image */}
                    <div className="w-full md:w-48 h-40 rounded-lg overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=160&width=192"
                        alt={doctor.name}
                        width={192}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Doctor Info */}
                    <div className="flex-1">
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold text-[#1e1e1e]">{doctor.name}</h3>
                            <p className="text-sm text-gray-600">{doctor.doctor_role}</p>
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
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
                            <span className="text-sm">التخصص: {doctor.specialist}</span>
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
                            <span className="text-lg font-bold text-[#62a0f6]">300 ريال</span>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={onOpenProfile}
                              className="px-4 py-2 border border-[#62a0f6] text-[#62a0f6] rounded-lg hover:bg-[#eff6fe] transition-colors"
                            >
                              عرض الملف
                            </button>
                            <button
                              onClick={() => handleDoctorSelect(doctor)}
                              className="px-6 py-2 bg-[#143087] text-white rounded-lg hover:bg-[#0f2470] transition-colors"
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
        <button onClick={onPrev} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
          السابق
        </button>
        {bookingData.selectedDoctor && (
          <button onClick={onNext} className="px-6 py-3 bg-[#143087] text-white rounded-lg hover:bg-[#0f2470]">
            التالي
          </button>
        )}
      </div>
    </div>
  )
}
