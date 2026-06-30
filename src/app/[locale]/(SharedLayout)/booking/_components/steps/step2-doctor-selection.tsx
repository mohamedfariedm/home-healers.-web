"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  Star,
  Clock,
  User,
  MapPin,
  Info,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

const filterSelectClass =
  "h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 ps-4 pe-10 text-sm text-[#1e1e1e] shadow-sm transition-all hover:border-[#62a0f6]/40 focus:border-[#62a0f6] focus:outline-none focus:ring-2 focus:ring-[#62a0f6]/25 cursor-pointer";

const filterLabelClass = "mb-1.5 block text-xs font-semibold tracking-wide text-gray-500 uppercase";
import Image from "next/image";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { BookingData, Category, Doctor, Package } from "@/types/booking";
import { doctorMatchesCategoryId } from "@/lib/doctor-matches-category";
import { getDoctorCityName, isDoctorInCity } from "@/lib/doctor-city";
import { getPackageCategoryList } from "@/lib/package-categories";

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
  categoriesData?: { data?: Category[] };
  citiesData?: { data?: Array<{ id: number; name: string }> };
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  onOpenProfile: (doctor: Doctor) => void;
  isLoading: boolean;
  locale: string;
  sortCityId?: number;
}

export default function Step2DoctorSelection({
  doctorsData,
  packagesData,
  categoriesData,
  citiesData,
  bookingData,
  updateBookingData,
  onNext,
  onPrev,
  onOpenProfile,
  isLoading,
  locale,
  sortCityId,
}: Step2Props) {
  const { t } = useTranslation("booking");
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const genderFromUrlSynced = useRef(false);
  const citySelectRef = useRef<HTMLSelectElement>(null);

  const hasCityFilter =
    bookingData.searchFilters.cityId !== "" &&
    bookingData.searchFilters.cityId != null;

  const selectedCityName = hasCityFilter
    ? (citiesData?.data ?? []).find(
        (c) => Number(c.id) === Number(bookingData.searchFilters.cityId)
      )?.name
    : null;

  const nearbyDoctorsCount = useMemo(() => {
    if (!hasCityFilter || sortCityId == null) return 0;
    const list: any[] = doctorsData?.data ?? [];
    return list.filter((doc) => isDoctorInCity(doc, sortCityId)).length;
  }, [doctorsData, hasCityFilter, sortCityId]);

  const focusCitySelect = () => {
    citySelectRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    citySelectRef.current?.focus();
  };

  const syncGenderToUrl = (gender: "" | "male" | "female") => {
    const params = new URLSearchParams(searchParams.toString());
    if (gender) params.set("gender", gender);
    else params.delete("gender");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  useEffect(() => {
    if (genderFromUrlSynced.current) return;
    const urlGender = searchParams.get("gender");
    if (urlGender === "male" || urlGender === "female") {
      if (bookingData.searchFilters.gender !== urlGender) {
        updateBookingData({
          searchFilters: {
            ...bookingData.searchFilters,
            gender: urlGender,
          },
        });
      }
    }
    genderFromUrlSynced.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    const nextFilters = {
      ...bookingData.searchFilters,
      [key]: value,
    };
    updateBookingData({ searchFilters: nextFilters });
    if (key === "gender") {
      syncGenderToUrl(value as "" | "male" | "female");
    }
    toast.info(t("step2.filtersUpdated"));
  };

  const allCategories: Category[] = categoriesData?.data ?? [];
  const packageScopedCategories = getPackageCategoryList(
    bookingData.selectedPackage,
    allCategories
  );
  const categories: Category[] = packageScopedCategories ?? allCategories;

  const handleCategoryFilterChange = (categoryIdStr: string) => {
    if (categoryIdStr === "") {
      updateBookingData({ selectedCategory: null, selectedService: null });
    } else {
      const cat = categories.find((c) => String(c.id) === categoryIdStr);
      if (cat) {
        updateBookingData({ selectedCategory: cat, selectedService: null });
      }
    }
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
    updateBookingData({ 
      selectedPackage: null,
      sessionsCount: 1,
      selectedCategory: null,
      selectedService: null,
    });
    toast.info(`${t("step2.packageUnselected")}: ${pkg.name}`);
    return;
  }

  const packageCategories = getPackageCategoryList(pkg, allCategories);
  const updates: Partial<BookingData> = {
    selectedPackage: pkg,
    sessionsCount: pkg.sessions_count || 1,
    selectedService: null,
  };

  if (packageCategories?.length === 1) {
    updates.selectedCategory = packageCategories[0];
  } else if (packageCategories && packageCategories.length > 1) {
    const stillValid = packageCategories.some(
      (c) => c.id === bookingData.selectedCategory?.id
    );
    if (!stillValid) {
      updates.selectedCategory = null;
    }
  }

  updateBookingData(updates);
  toast.success(`${t("step2.packageSelected")}: ${pkg.name}`);
};

  // Main filtering
  const filteredDoctors = useMemo(() => {
    const list: any[] = doctorsData?.data ?? [];
    if (!Array.isArray(list)) return [];

    const q = searchQuery.trim().toLowerCase();

    const selectedCategory = bookingData?.selectedCategory;
    const categoryId = selectedCategory?.id;

    
    const expFilter = bookingData?.searchFilters?.experience
      ? parseInt(String(bookingData.searchFilters.experience))
      : null;

    return list.filter((doc) => {
      // --- Text search (name / clinic_name) ---
      const name = String(doc?.name ?? "").toLowerCase();
      const clinic = String(doc?.clinic_name ?? "").toLowerCase();
      const matchesSearch = q === "" || name.includes(q) || clinic.includes(q);

      // --- Experience filter (>= expFilter) ---
      const exp = toNum(doc?.experience, 0);
      const matchesExp = !expFilter || exp >= expFilter;

      // --- Step 1: always by selected category id (not selected service id) ---
      let matchesStep1 = true;
      if (categoryId != null && selectedCategory) {
        matchesStep1 = doctorMatchesCategoryId(doc, categoryId);
      }

      return matchesSearch && matchesExp && matchesStep1;
    });
  }, [doctorsData, searchQuery, bookingData]);

  const isDoctorsEmpty = !doctorsData?.data?.length || !filteredDoctors.length;
  const isPackagesEmpty = !packagesData?.data?.length;

  return (
    <div className="flex flex-col gap-6">
      {/* City selection guide — shown until the client picks a city */}
      {!hasCityFilter && (citiesData?.data?.length ?? 0) > 0 && (
        <div
          className="rounded-2xl border-2 border-[#62a0f6]/40 bg-gradient-to-r from-[#eff6fe] to-white p-5 shadow-sm"
          role="status"
        >
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="flex gap-3 items-start">
              <div className="shrink-0 w-10 h-10 rounded-full bg-[#62a0f6] flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" aria-hidden />
              </div>
              <div>
                <h3 className="font-bold text-[#143087] text-lg mb-1">
                  {t("step2.cityGuideTitle")}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t("step2.cityGuideDescription")}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={focusCitySelect}
              className="shrink-0 px-5 py-2.5 bg-[#143087] text-white rounded-lg hover:bg-[#0f2470] font-medium text-sm transition-colors"
            >
              {t("step2.cityGuideCta")}
            </button>
          </div>
        </div>
      )}

      {hasCityFilter && selectedCityName && (
        <div
          className="flex flex-wrap items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
          role="status"
        >
          <Info className="w-4 h-4 shrink-0" aria-hidden />
          <span>{t("step2.citySelectedHint", { city: selectedCityName })}</span>
          {nearbyDoctorsCount > 0 && (
            <span className="text-green-700/90">
              · {t("step2.nearbyDoctorsCount", { count: nearbyDoctorsCount })}
            </span>
          )}
        </div>
      )}

      {/* Search & Filters */}
      <div
        className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md"
        data-tour="tour-doctor-filters"
      >
        {/* Search */}
        <div className="border-b border-gray-100 bg-gradient-to-l from-[#eff6fe]/80 to-white p-5">
          <label htmlFor="doctor-search" className={filterLabelClass}>
            {t("step2.searchLabel")}
          </label>
          <div className="relative">
            <input
              id="doctor-search"
              type="text"
              placeholder={t("step2.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-12 w-full rounded-xl border border-gray-200 bg-white pe-12 ps-4 text-sm shadow-sm transition-all placeholder:text-gray-400 hover:border-[#62a0f6]/40 focus:border-[#62a0f6] focus:outline-none focus:ring-2 focus:ring-[#62a0f6]/25"
              aria-label={t("step2.searchLabel")}
            />
            <span className="pointer-events-none absolute end-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-[#eff6fe] text-[#62a0f6]">
              <Search className="h-4 w-4" aria-hidden />
            </span>
          </div>
        </div>

        {/* Primary filters */}
        <div className="p-5">
          <div className="mb-4 flex items-center gap-2 text-[#143087]">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eff6fe]">
              <SlidersHorizontal className="h-4 w-4 text-[#62a0f6]" aria-hidden />
            </span>
            <span className="text-sm font-bold">{t("step2.filters")}</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* City */}
            <div
              className={`sm:col-span-2 lg:col-span-1 ${
                !hasCityFilter ? "rounded-2xl bg-[#eff6fe]/60 p-3 ring-1 ring-[#62a0f6]/30" : ""
              }`}
            >
              <label
                htmlFor="doctor-city-filter"
                className={`${filterLabelClass} ${
                  !hasCityFilter ? "!text-[#143087]" : ""
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {t("step2.citySort")}
                  {!hasCityFilter && <span className="text-[#62a0f6]">*</span>}
                </span>
              </label>
              <div className="relative">
                <select
                  id="doctor-city-filter"
                  ref={citySelectRef}
                  value={
                    bookingData.searchFilters.cityId === ""
                      ? ""
                      : String(bookingData.searchFilters.cityId)
                  }
                  onChange={(e) =>
                    handleFilterChange(
                      "cityId",
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className={`${filterSelectClass} ${
                    !hasCityFilter
                      ? "!border-[#62a0f6]/60 !bg-white !ring-2 !ring-[#62a0f6]/20"
                      : ""
                  }`}
                  aria-label={t("step2.citySort")}
                  aria-describedby={!hasCityFilter ? "city-filter-hint" : undefined}
                >
                  <option value="">{t("step2.allCities")}</option>
                  {(citiesData?.data ?? []).map((city) => (
                    <option key={city.id} value={String(city.id)}>
                      {city.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden
                />
              </div>
              {!hasCityFilter && (
                <p id="city-filter-hint" className="mt-1.5 text-xs leading-snug text-[#62a0f6]">
                  {t("step2.cityFilterHint")}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="doctor-gender-filter" className={filterLabelClass}>
                {t("step2.genderPreference")}
              </label>
              <div className="relative">
                <select
                  id="doctor-gender-filter"
                  value={bookingData.searchFilters.gender}
                  onChange={(e) =>
                    handleFilterChange("gender", e.target.value as "" | "male" | "female")
                  }
                  className={filterSelectClass}
                  aria-label={t("step2.genderPreference")}
                >
                  <option value="">{t("step2.genderAny")}</option>
                  <option value="male">{t("step1.male")}</option>
                  <option value="female">{t("step1.female")}</option>
                </select>
                <ChevronDown
                  className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden
                />
              </div>
            </div>

            {/* Specialty (category) */}
            <div>
              <label htmlFor="doctor-specialty-filter" className={filterLabelClass}>
                {t("step2.specialty")}
              </label>
              <div className="relative">
                <select
                  id="doctor-specialty-filter"
                  value={
                    bookingData.selectedCategory?.id != null
                      ? String(bookingData.selectedCategory.id)
                      : ""
                  }
                  onChange={(e) => handleCategoryFilterChange(e.target.value)}
                  className={filterSelectClass}
                  aria-label={t("step2.specialty")}
                >
                  <option value="">{t("step2.allSpecialties")}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden
                />
              </div>
            </div>

            {/* Experience */}
            <div>
              <label htmlFor="doctor-experience-filter" className={filterLabelClass}>
                {t("step2.experience")}
              </label>
              <div className="relative">
                <select
                  id="doctor-experience-filter"
                  value={bookingData.searchFilters.experience}
                  onChange={(e) => handleFilterChange("experience", e.target.value)}
                  className={filterSelectClass}
                  aria-label={t("step2.experience")}
                >
                  <option value="">{t("step2.experienceYears")}</option>
                  <option value="2">{t("step2.moreThan2")}</option>
                  <option value="5">{t("step2.moreThan5")}</option>
                  <option value="10">{t("step2.moreThan10")}</option>
                </select>
                <ChevronDown
                  className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden
                />
              </div>
            </div>
          </div>
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
                const cityName = getDoctorCityName(doctor, locale);
                const inYourCity =
                  sortCityId != null && isDoctorInCity(doctor, sortCityId);

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
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-xl font-semibold text-[#1e1e1e]">
                                  {doctor?.name}
                                </h3>
                                {inYourCity && (
                                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#eff6fe] text-[#62a0f6] border border-[#62a0f6]/30">
                                    {t("step2.inYourCity")}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                {doctor?.doctor_role ?? doctor?.specialist ?? t("step2.doctorRole")}
                              </p>
                              {cityName && (
                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {cityName}
                                </p>
                              )}
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
