"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { Search, Star, Clock, User, Filter, MapPin } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import type { BookingData, Doctor, Package } from "@/types/booking";
import { doctorMatchesCategoryId } from "@/lib/doctor-matches-category";

// ===== Helpers for the new data shape =====
const isImageUrl = (url?: string | null) =>
  !!url && /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(url);

const pickFirstImageFromServices = (services?: any[]) => {
  if (!Array.isArray(services)) return null;
  for (const srv of services) {
    const original = srv?.image?.[0]?.original as string | undefined;
    if (isImageUrl(original)) return original!;
  }
  return null;
};

const pickFirstImageFromAttachments = (attachments?: string | null) => {
  if (!attachments) return null;
  // attachments may be: "url1, url2, file.pdf"
  const parts = attachments.split(",").map((s) => s.trim());
  const firstImg = parts.find((p) => isImageUrl(p));
  return firstImg ?? null;
};

const toNum = (val: any, fallback = 0) => {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
};

interface Step2Props {
  doctorsData: any;
  packagesData: any;
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  onOpenProfile: (doctor: Doctor) => void;
  isLoading: boolean;
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
  const { t } = useTranslation("booking");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const searchParams = useSearchParams();
  const packageProcessedRef = useRef<string | null>(null);

  // Auto-select package from URL parameter
  useEffect(() => {
    const packageId = searchParams.get("packageId") || searchParams.get("packageid");
    
    if (!packageId || !packagesData?.data || !Array.isArray(packagesData.data)) {
      return;
    }

    // Skip if already processed this package ID
    if (packageProcessedRef.current === packageId) {
      return;
    }

    const pkgId = Number.parseInt(packageId, 10);
    if (Number.isNaN(pkgId)) {
      console.warn("Invalid package ID:", packageId);
      return;
    }

    // Check if this package is already selected
    const currentPkgId = bookingData.selectedPackage?.id ? Number(bookingData.selectedPackage.id) : null;
    if (currentPkgId === pkgId) {
      // Already selected, mark as processed
      packageProcessedRef.current = packageId;
      return;
    }

    console.log("🔍 Step2 - Looking for package ID:", pkgId);
    console.log("📦 Step2 - Available packages:", packagesData.data.map((p: Package) => ({ id: p.id, name: p.name })));

    // Find package with matching ID
    const selectedPkg = packagesData.data.find((pkg: Package) => {
      const pkgIdNum = Number(pkg.id);
      const targetIdNum = Number(pkgId);
      return pkgIdNum === targetIdNum;
    });

    if (selectedPkg) {
      console.log("✅ Step2 - Found package:", { id: selectedPkg.id, name: selectedPkg.name });
      
      // Mark as processed
      packageProcessedRef.current = packageId;
      
      // Update bookingData with the selected package and sessions count
      updateBookingData({ 
        selectedPackage: selectedPkg,
        sessionsCount: selectedPkg.sessions_count || 1
      });
      console.log("💾 Step2 - Package saved to bookingData:", { 
        id: selectedPkg.id, 
        name: selectedPkg.name,
        sessionsCount: selectedPkg.sessions_count 
      });
      
      toast.success(`${t("step2.packageSelected")}: ${selectedPkg.name}`);
    } else {
      console.warn("❌ Step2 - Package not found with ID:", pkgId, "Available IDs:", packagesData.data.map((p: Package) => p.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, packagesData]);

  // Build a robust image picker for the doctor
  const getDoctorImage = (doctor: any) => {
    // 1) doctor.image
    const doctorOriginal = doctor?.image?.[0]?.original as string | undefined;
    if (isImageUrl(doctorOriginal)) return doctorOriginal!;

    // 2) any service image
    // const fromService = pickFirstImageFromServices(doctor?.services);
    // if (fromService) return fromService;

    // // 3) upload_attachments (first imageish URL)
    // const fromAttachments = pickFirstImageFromAttachments(doctor?.upload_attachments);
    // if (fromAttachments) return fromAttachments;

    // 4) fallback
    if (doctor?.gender?.toLowerCase() === "male") {
      return "/assets/images/doctorMale.jpeg";
    }

    if (doctor?.gender?.toLowerCase() === "female") {
      return "/assets/images/doctorFemale.jpeg";
    }

    return "/default-doctor.png";
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateBookingData({
      searchFilters: {
        ...bookingData.searchFilters,
      },
    });
  };

  const handleFilterChange = (key: string, value: any) => {
    const currentRange = bookingData.searchFilters?.priceRange ?? [0, 1000];
    updateBookingData({
      searchFilters: {
        ...bookingData.searchFilters,
        priceRange: currentRange,
        [key]: value,
      },
    });
    toast.info(t("step2.filtersUpdated"));
  };

  const handleDoctorSelect = (doctor: any) => {
    updateBookingData({ selectedDoctor: doctor });
    toast.success(`${t("step2.doctorSelected")}: ${doctor?.name ?? ""}`);
    onNext();
  };

const handlePackageSelect = (pkg: Package) => {
  const currentPkgId = bookingData.selectedPackage?.id ? Number(bookingData.selectedPackage.id) : null;
  const pkgId = Number(pkg.id);
  
  if (currentPkgId === pkgId) {
    // If already selected → unselect it
    updateBookingData({ 
      selectedPackage: null,
      sessionsCount: 1 // Reset to default
    });
    toast.info(`${t("step2.packageUnselected")}: ${pkg.name}`);
  } else {
    // Otherwise → select it and update sessions count
    updateBookingData({ 
      selectedPackage: pkg,
      sessionsCount: pkg.sessions_count || 1
    });
    toast.success(`${t("step2.packageSelected")}: ${pkg.name}`);
  }
};

  // Main filtering
  const filteredDoctors = useMemo(() => {
    const list: any[] = doctorsData?.data ?? [];
    if (!Array.isArray(list)) return [];

    const q = searchQuery.trim().toLowerCase();

    const selectedCategory = bookingData?.selectedCategory;
    const categoryId = selectedCategory?.id;

    console.log("=== Step2 Filtering ===", {
      totalDoctors: list.length,
      selectedCategory: selectedCategory
        ? { id: selectedCategory.id, name: selectedCategory.name }
        : null,
      filterByCategoryId: categoryId ?? null,
    });

    const cityFilter = bookingData?.searchFilters?.city || "";
    const specialtyFilter = bookingData?.searchFilters?.specialty || "";
    const expFilter = bookingData?.searchFilters?.experience
      ? parseInt(String(bookingData.searchFilters.experience))
      : null;
    const ratingFilter = bookingData?.searchFilters?.rating ?? null;
    const priceRange = bookingData?.searchFilters?.priceRange ?? [0, 100000];

    return list.filter((doc) => {
      // --- Text search (name / clinic_name) ---
      const name = String(doc?.name ?? "").toLowerCase();
      const clinic = String(doc?.clinic_name ?? "").toLowerCase();
      const matchesSearch = q === "" || name.includes(q) || clinic.includes(q);

      // --- City filter (addresses[].city exact match) ---
      const matchesCity =
        !cityFilter ||
        (Array.isArray(doc?.addresses) &&
          doc.addresses.some((a: any) => String(a?.city ?? "").toLowerCase() === String(cityFilter).toLowerCase()));

      // --- Specialty filter (specialist exact match) ---
      const matchesSpecialty =
        !specialtyFilter ||
        String(doc?.specialist ?? doc?.department ?? "").toLowerCase() ===
          String(specialtyFilter).toLowerCase();

      // --- Experience filter (>= expFilter) ---
      const exp = toNum(doc?.experience, 0);
      const matchesExp = !expFilter || exp >= expFilter;

      // --- Rating filter (>= rating) ---
      const rateNum = toNum(doc?.rate, 4);
      const matchesRating = !ratingFilter || rateNum >= ratingFilter;

      // --- Price range filter ---
      const price = toNum(doc?.session_price, 0);
      const matchesPrice = price >= toNum(priceRange[0], 0) && price <= toNum(priceRange[1], 100000);

      // --- Step 1: always by selected category id (not selected service id) ---
      let matchesStep1 = true;
      if (categoryId != null && selectedCategory) {
        matchesStep1 = doctorMatchesCategoryId(doc, categoryId);
      }

      return (
        matchesSearch &&
        matchesCity &&
        matchesSpecialty &&
        matchesExp &&
        matchesRating &&
        matchesPrice &&
        matchesStep1
      );
    });
  }, [doctorsData, searchQuery, bookingData]);

  // Log filtered results
  useEffect(() => {
    console.log("=== Step2 Filtered Results ===", {
      filteredCount: filteredDoctors.length,
      filteredDoctors: filteredDoctors.map((d: any) => ({ id: d.id, name: d.name })),
    });
  }, [filteredDoctors]);

  const isDoctorsEmpty = !doctorsData?.data?.length || !filteredDoctors.length;
  const isPackagesEmpty = !packagesData?.data?.length;
console.log("packagesData",packagesData?.data);

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filters */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder={t("step2.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full p-4 pr-12 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#62a0f6]"
              aria-label={t("step2.searchLabel")}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={() => setShowFilters((s) => !s)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              aria-label={t("step2.toggleFilters")}
            >
              <Filter className="w-4 h-4" />
              {t("step2.filters")}
            </button>

            <select
              value={bookingData.searchFilters.city}
              onChange={(e) => handleFilterChange("city", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              aria-label={t("step2.city")}
            >
              <option value="">{t("step2.allCities")}</option>
              <option value="riyadh">{t("step2.riyadh")}</option>
              <option value="jeddah">{t("step2.jeddah")}</option>
              <option value="dammam">{t("step2.dammam")}</option>
            </select>

            <select
              value={bookingData.searchFilters.specialty}
              onChange={(e) => handleFilterChange("specialty", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              aria-label={t("step2.specialty")}
            >
              <option value="">{t("step2.allSpecialties")}</option>
              {bookingData.selectedCategory ? (
                <option value={bookingData.selectedCategory.name}>
                  {bookingData.selectedCategory.name}
                </option>
              ) : (
                <>
                  <option value="علاج طبيعي">{t("step2.physiotherapy")}</option>
                  <option value="عظام">{t("step2.orthopedics")}</option>
                  <option value="أعصاب">{t("step2.neurology")}</option>
                  <option value="أطفال">{t("step2.pediatrics")}</option>
                </>
              )}
            </select>

            <select
              value={bookingData.searchFilters.experience}
              onChange={(e) => handleFilterChange("experience", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              aria-label={t("step2.experience")}
            >
              <option value="">{t("step2.experienceYears")}</option>
              <option value="2">{t("step2.moreThan2")}</option>
              <option value="5">{t("step2.moreThan5")}</option>
              <option value="10">{t("step2.moreThan10")}</option>
            </select>
          </div>

          {showFilters && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t("step2.rating")}</label>
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
                        aria-label={`${t("step2.filterByRating")} ${rating}`}
                      >
                        <span className="text-sm">{rating}</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t("step2.priceRange")}</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder={t("step2.from")}
                      value={(bookingData.searchFilters.priceRange ?? [0, 1000])[0]}
                      onChange={(e) =>
                        handleFilterChange("priceRange", [
                          Number.parseInt(e.target.value) || 0,
                          (bookingData.searchFilters.priceRange ?? [0, 1000])[1],
                        ])
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      aria-label={t("step2.minPrice")}
                    />
                    <input
                      type="number"
                      placeholder={t("step2.to")}
                      value={(bookingData.searchFilters.priceRange ?? [0, 1000])[1]}
                      onChange={(e) =>
                        handleFilterChange("priceRange", [
                          (bookingData.searchFilters.priceRange ?? [0, 1000])[0],
                          Number.parseInt(e.target.value) || 1000,
                        ])
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      aria-label={t("step2.maxPrice")}
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
            <h3 className="text-lg font-bold mb-4">{t("step2.packages")}</h3>
            {isPackagesEmpty ? (
              <p className="text-gray-600 text-center">{t("step2.noPackages")}</p>
            ) : (
              <div className="space-y-3">
                {packagesData?.data?.map((pkg: Package) => {
                  const currentPkgId = bookingData.selectedPackage?.id ? Number(bookingData.selectedPackage.id) : null;
                  const pkgId = Number(pkg.id);
                  const isSelected = currentPkgId === pkgId;
                  
                  return (
  <button
    key={pkg.id}
    onClick={() => handlePackageSelect(pkg)}
    className={`w-full p-4 rounded-lg border-2 text-right transition-all ${
      isSelected
        ? "border-[#62a0f6] bg-[#eff6fe]"
        : "border-gray-200 hover:border-[#62a0f6]"
    }`}
    aria-label={`${t("step2.selectPackage")} ${pkg.name}`}
  >
    {/* Image */}
    {pkg.image?.length > 0 && (
      <img
        src={pkg.image[0]?.thumbnail || pkg.image[0]?.original}
        alt={pkg.name}
        className="w-full h-40 object-cover rounded-md mb-3"
      />
    )}

    {/* Text Info */}
    <div className="font-semibold text-[#1e1e1e] mb-1">{pkg.name}</div>
    <div className="text-sm text-gray-600 mb-2">{pkg.description}</div>

    {/* Price Section */}
    <div className="flex justify-between items-center">
      <span className="text-lg font-bold text-[#62a0f6]">{pkg.price} {t("step2.price")}</span>
      {pkg.discount && (
        <span className="text-sm text-green-600">{t("step2.insteadOf")} <span className="text-sm text-gray-400 line-through ms-1">{pkg.discount}</span> </span>
      )}
    </div>
  </button>
                  );
                })}

              </div>
            )}
          </div>
        </div>

        {/* Doctors List */}
        <div className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{t("step2.results")}</h2>
            <span className="text-gray-600">({filteredDoctors.length} {t("step2.doctorsCount")})</span>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#62a0f6]"></div>
            </div>
          ) : isDoctorsEmpty ? (
            <div className="text-center p-6 text-gray-600">
              {t("step2.noDoctors")}
              <button
                onClick={onPrev}
                className="mt-4 px-6 py-3 bg-[#62a0f6] text-white rounded-lg hover:bg-[#5090e6]"
              >
                {t("step2.backToSpecialty")}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredDoctors.map((doctor: any) => {
                const img = getDoctorImage(doctor);
                const rateNum = toNum(doctor?.rate, 4);

                return (
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
                        <Image
                          src={img}
                          alt={`صورة الطبيب ${doctor?.name ?? ""}`}
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
                              <h3 className="text-xl font-semibold text-[#1e1e1e]">
                                {doctor?.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {doctor?.doctor_role ?? doctor?.specialist ?? t("step2.doctorRole")}
                              </p>
                            </div>
                            <div className="flex">
                              {Array.from({ length: Math.max(1, Math.min(5, rateNum)) }).map(
                                (_, i) => (
                                  <Star
                                    key={i}
                                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                                    aria-hidden="true"
                                  />
                                )
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">
                                {t("step2.experienceLabel")}: {toNum(doctor?.experience, 0)} {t("step2.years")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">
                                {t("step2.specialtyLabel")}: {doctor?.specialist ?? doctor?.department ?? t("step2.doctorRole")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{t("step2.clinic")}: {doctor?.clinic_name ?? "-"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">
                                {t("step2.appointments")}: {doctor?.from ?? "--:--"} - {doctor?.to ?? "--:--"}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-4">
                            <div className="text-right">
                              <span className="text-sm text-gray-600">{t("step2.priceLabel")}: </span>
                              <span className="text-lg font-bold text-[#62a0f6]">
                                {toNum(doctor?.session_price, 0)} {t("step2.price")}
                              </span>
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={() => onOpenProfile(doctor)}
                                className="px-4 py-2 border border-[#62a0f6] text-[#62a0f6] rounded-lg hover:bg-[#eff6fe] transition-colors"
                                aria-label={`${t("step2.viewProfile")} ${doctor?.name ?? ""}`}
                              >
                                {t("step2.viewProfile")}
                              </button>
                              <button
                                onClick={() => handleDoctorSelect(doctor)}
                                className="px-6 py-2 bg-[#143087] text-white rounded-lg hover:bg-[#0f2470] transition-colors"
                                aria-label={`${t("step2.selectDoctor")} ${doctor?.name ?? ""}`}
                              >
                                {t("step2.selectDoctor")}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          aria-label={t("step2.previous")}
        >
          {t("step2.previous")}
        </button>
        <button
          onClick={() => {
            if (!bookingData.selectedDoctor) {
              toast.error(t("step2.selectDoctorFirst"));
              return;
            }
            onNext();
          }}
          className="px-6 py-3 bg-[#143087] text-white rounded-lg hover:bg-[#0f2470] disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!bookingData.selectedDoctor}
          aria-label={t("step2.next")}
        >
          {t("step2.next")}
        </button>
      </div>
    </div>
  );
}
