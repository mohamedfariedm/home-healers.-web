"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  Star,
  Clock,
  MapPin,
  Info,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Gift,
  SlidersHorizontal,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

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
import { toSecureMediaUrl } from "@/lib/image-url";
import BookingStepNav from "../booking-step-nav";

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

const DOCTORS_PAGE_SIZE = 5;

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
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const genderFromUrlSynced = useRef(false);
  const citySelectRef = useRef<HTMLSelectElement>(null);
  const pendingCityFocus = useRef(false);
  const packagesPrevRef = useRef<HTMLButtonElement>(null);
  const packagesNextRef = useRef<HTMLButtonElement>(null);

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

  const activeFilterCount = [
    hasCityFilter,
    Boolean(bookingData.searchFilters.gender),
    Boolean(bookingData.searchFilters.experience),
    bookingData.selectedCategory?.id != null,
  ].filter(Boolean).length;

  const focusCitySelect = () => {
    pendingCityFocus.current = true;
    setFiltersOpen(true);
  };

  useEffect(() => {
    if (!filtersOpen || !pendingCityFocus.current) return;
    pendingCityFocus.current = false;
    citySelectRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    citySelectRef.current?.focus();
  }, [filtersOpen]);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    bookingData.searchFilters.cityId,
    bookingData.searchFilters.gender,
    bookingData.searchFilters.experience,
    bookingData.selectedCategory?.id,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDoctors.length / DOCTORS_PAGE_SIZE),
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const paginatedDoctors = useMemo(() => {
    const start = (currentPage - 1) * DOCTORS_PAGE_SIZE;
    return filteredDoctors.slice(start, start + DOCTORS_PAGE_SIZE);
  }, [filteredDoctors, currentPage]);

  const resultsFrom =
    filteredDoctors.length === 0
      ? 0
      : (currentPage - 1) * DOCTORS_PAGE_SIZE + 1;
  const resultsTo = Math.min(
    currentPage * DOCTORS_PAGE_SIZE,
    filteredDoctors.length,
  );

  const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (page) =>
      page === 1 ||
      page === totalPages ||
      Math.abs(page - currentPage) <= 1,
  );

  const goToPage = (page: number) => {
    const next = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(next);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const isDoctorsEmpty = !doctorsData?.data?.length || !filteredDoctors.length;
  const isPackagesEmpty = !packagesData?.data?.length;

  return (
    <div className="flex flex-col gap-5" data-booking-step>
      {/* City selection guide — shown until the client picks a city */}
      {!hasCityFilter && (citiesData?.data?.length ?? 0) > 0 && (
        <div
          className="flex flex-col gap-3 rounded-2xl border border-[#62a0f6]/30 bg-[#eff6fe]/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          role="status"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#62a0f6]">
              <MapPin className="h-4 w-4 text-white" aria-hidden />
            </div>
            <div>
              <h3 className="font-semibold text-[#143087]">
                {t("step2.cityGuideTitle")}
              </h3>
              <p className="text-sm text-gray-600">
                {t("step2.cityGuideDescription")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={focusCitySelect}
            className="shrink-0 rounded-xl bg-[#143087] px-4 py-2 text-sm font-medium text-white hover:bg-[#0f2470]"
          >
            {t("step2.cityGuideCta")}
          </button>
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

      <div
        dir="ltr"
        className="flex flex-col gap-5 lg:flex-row lg:items-start"
      >
        <aside
          dir={locale === "en" ? "ltr" : "rtl"}
          className="order-1 w-full shrink-0 lg:sticky lg:top-24 lg:order-2 lg:w-[300px] lg:self-start xl:w-[340px]"
        >
      {/* Search & Filters */}
      <div
        className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto"
        data-tour="tour-doctor-filters"
      >
        {/* Search */}
        <div className="border-b border-gray-100 bg-gradient-to-l from-[#eff6fe]/80 to-white px-4 py-4 sm:px-5">
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

        <button
          type="button"
          aria-expanded={filtersOpen}
          aria-controls="doctor-filters-panel"
          aria-label={t("step2.toggleFilters")}
          onClick={() => setFiltersOpen((open) => !open)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-start transition hover:bg-[#eff6fe]/70 sm:px-5"
        >
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#143087]">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eff6fe]">
              <SlidersHorizontal className="h-4 w-4 text-[#62a0f6]" aria-hidden />
            </span>
            {t("step2.filters")}
            {activeFilterCount > 0 ? (
              <span className="rounded-full bg-[#62a0f6] px-2 py-0.5 text-[11px] font-bold text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
            {filtersOpen ? t("step2.hideAdvancedFilters") : t("step2.showAdvancedFilters")}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
              aria-hidden
            />
          </span>
        </button>

        {filtersOpen ? (
        <div id="doctor-filters-panel" className="border-t border-gray-100 p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {/* City */}
            <div
              className={`${
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
        ) : null}
      </div>
        </aside>

        <div
          dir={locale === "en" ? "ltr" : "rtl"}
          className="order-2 min-w-0 flex-1 space-y-5 lg:order-1"
        >
      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eff6fe] text-[#62a0f6]">
                <Gift className="h-4 w-4" aria-hidden />
              </span>
              <h3 className="text-lg font-bold text-[#143087]">{t("step2.packages")}</h3>
              <span className="rounded-full bg-[#eff6fe] px-2.5 py-0.5 text-[11px] font-semibold text-[#62a0f6]">
                {t("step2.packagesOptional")}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">{t("step2.packagesHint")}</p>
          </div>
          {!isPackagesEmpty && (packagesData?.data?.length ?? 0) > 1 ? (
            <div className="flex shrink-0 gap-2">
              <button
                ref={packagesPrevRef}
                type="button"
                className="booking-step2-pkg-prev flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[#143087] shadow-sm transition hover:border-[#62a0f6] hover:bg-[#eff6fe] disabled:opacity-30"
                aria-label={t("step2.previous")}
              >
                <ChevronLeft className="h-5 w-5 rtl:rotate-180" aria-hidden />
              </button>
              <button
                ref={packagesNextRef}
                type="button"
                className="booking-step2-pkg-next flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[#143087] shadow-sm transition hover:border-[#62a0f6] hover:bg-[#eff6fe] disabled:opacity-30"
                aria-label={t("step2.next")}
              >
                <ChevronRight className="h-5 w-5 rtl:rotate-180" aria-hidden />
              </button>
            </div>
          ) : null}
        </div>

        {bookingData.selectedPackage ? (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#62a0f6]/30 bg-[#eff6fe] px-4 py-2.5">
            <p className="text-sm text-[#143087]">
              <span className="font-semibold">{bookingData.selectedPackage.name}</span>
              <span className="mx-1.5 text-[#62a0f6]">·</span>
              <span className="font-bold">
                {bookingData.selectedPackage.price} {t("step2.price")}
              </span>
            </p>
            <button
              type="button"
              onClick={() => handlePackageSelect(bookingData.selectedPackage as Package)}
              className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200 hover:text-[#143087]"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              {t("step2.clearPackage")}
            </button>
          </div>
        ) : null}

        {isPackagesEmpty ? (
          <p className="rounded-3xl border border-dashed border-gray-200 bg-white px-5 py-8 text-center text-sm text-gray-500">
            {t("step2.noPackages")}
          </p>
        ) : (
          <Swiper
            modules={[Navigation]}
            dir={locale === "en" ? "ltr" : "rtl"}
            spaceBetween={12}
            slidesPerView={1.2}
            watchOverflow
            navigation={{
              prevEl: ".booking-step2-pkg-prev",
              nextEl: ".booking-step2-pkg-next",
            }}
            onBeforeInit={(swiper) => {
              const nav = swiper.params.navigation;
              if (nav && typeof nav !== "boolean") {
                nav.prevEl = packagesPrevRef.current;
                nav.nextEl = packagesNextRef.current;
              }
            }}
            breakpoints={{
              480: { slidesPerView: 2.1, spaceBetween: 12 },
              768: { slidesPerView: 3.2, spaceBetween: 14 },
              1024: { slidesPerView: 4, spaceBetween: 14 },
              1280: { slidesPerView: 5, spaceBetween: 16 },
            }}
            className="!pb-1"
          >
            {packagesData?.data?.map((pkg: Package) => {
              const isSelected =
                Number(bookingData.selectedPackage?.id) === Number(pkg.id);
              const pkgImage = toSecureMediaUrl(
                pkg.image?.[0]?.thumbnail || pkg.image?.[0]?.original,
              );

              return (
                <SwiperSlide key={pkg.id} className="!h-auto">
                  <button
                    type="button"
                    onClick={() => handlePackageSelect(pkg)}
                    className={`group flex h-full w-full flex-col overflow-hidden rounded-3xl border bg-white text-start shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(20,48,135,0.12)] ${
                      isSelected
                        ? "border-[#62a0f6] ring-2 ring-[#62a0f6]/25"
                        : "border-gray-100"
                    }`}
                    aria-pressed={isSelected}
                    aria-label={`${t("step2.selectPackage")} ${pkg.name}`}
                  >
                    <div className="relative h-28 w-full bg-[#eff6fe] sm:h-32">
                      {pkgImage ? (
                        <img
                          src={pkgImage}
                          alt=""
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#62a0f6]">
                          <Gift className="h-10 w-10" aria-hidden />
                        </div>
                      )}
                      <span
                        className={`absolute end-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold text-white ${
                          String(pkg.type).toLowerCase() === "offer"
                            ? "bg-green-600"
                            : "bg-[#62a0f6]"
                        }`}
                      >
                        {String(pkg.type).toLowerCase() === "offer"
                          ? t("step2.offerType")
                          : t("step2.packageType")}
                      </span>
                      {isSelected ? (
                        <span className="absolute start-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#143087] px-2.5 py-1 text-[11px] font-semibold text-white">
                          <Check className="h-3.5 w-3.5" aria-hidden />
                          {t("step2.packageChosen")}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <p className="line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-[#1e1e1e] sm:text-base">
                        {pkg.name}
                      </p>
                      {pkg.sessions_count ? (
                        <p className="mt-1 text-xs text-gray-500">
                          {t("step2.sessionsCountShort", { count: pkg.sessions_count })}
                        </p>
                      ) : null}
                      <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                        <div>
                          <p className="text-lg font-bold text-[#62a0f6]">
                            {pkg.price}{" "}
                            <span className="text-xs font-medium text-gray-500">
                              {t("step2.price")}
                            </span>
                          </p>
                          {pkg.discount ? (
                            <p className="text-xs text-gray-400 line-through">{pkg.discount}</p>
                          ) : null}
                        </div>
                        <span
                          className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${
                            isSelected
                              ? "bg-[#143087] text-white"
                              : "bg-[#eff6fe] text-[#143087]"
                          }`}
                        >
                          {isSelected ? t("step2.packageChosen") : t("step2.selectPackage")}
                        </span>
                      </div>
                    </div>
                  </button>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </section>

      <div ref={resultsRef} className="scroll-mt-24">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-bold text-[#143087]">{t("step2.results")}</h2>
            <span className="rounded-full bg-white px-3 py-1 text-sm text-gray-600 ring-1 ring-gray-100">
              {filteredDoctors.length
                ? `${t("step2.showingDoctors", {
                    from: resultsFrom,
                    to: resultsTo,
                    total: filteredDoctors.length,
                  })} ${t("step2.doctorsCount")}`
                : `(0 ${t("step2.doctorsCount")})`}
            </span>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center rounded-2xl border border-gray-100 bg-white py-12 shadow-sm">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#62a0f6]"></div>
            </div>
          ) : isDoctorsEmpty ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center text-gray-600 shadow-sm">
              {t("step2.noDoctors")}
              <button
                type="button"
                onClick={onPrev}
                className="mt-4 px-6 py-3 bg-[#62a0f6] text-white rounded-lg hover:bg-[#5090e6]"
              >
                {t("step2.backToSpecialty")}
              </button>
            </div>
          ) : (
            <div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {paginatedDoctors.map((doctor: any) => {
                const img = getDoctorImage(doctor);
                const rateNum = toNum(doctor?.rate, 4);
                const cityName = getDoctorCityName(doctor, locale);
                const inYourCity =
                  sortCityId != null && isDoctorInCity(doctor, sortCityId);
                const isSelected = bookingData.selectedDoctor?.id === doctor.id;
                const specialist =
                  doctor?.doctor_role ??
                  doctor?.specialist ??
                  doctor?.department ??
                  t("step2.doctorRole");
                const starCount = Math.max(1, Math.min(5, Math.round(rateNum)));

                return (
                  <article
                    key={doctor.id}
                    className={`flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-[0_8px_30px_rgba(20,48,135,0.05)] transition-all ${
                      isSelected
                        ? "border-[#62a0f6] ring-2 ring-[#62a0f6]/20"
                        : "border-[#e6eef8] hover:border-[#62a0f6]/40 hover:shadow-[0_16px_36px_rgba(20,48,135,0.1)]"
                    }`}
                    aria-selected={isSelected}
                  >
                    <div className="relative h-36 w-full bg-[#eff6fe] sm:h-40">
                      <Image
                        src={img}
                        alt={doctor?.name ?? ""}
                        width={320}
                        height={160}
                        className="h-full w-full object-cover"
                      />
                      {isSelected ? (
                        <span className="absolute end-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#143087] text-white shadow">
                          <Check className="h-4 w-4" aria-hidden />
                        </span>
                      ) : null}
                      {inYourCity ? (
                        <span className="absolute start-2 top-2 rounded-full border border-[#62a0f6]/30 bg-white/95 px-2 py-0.5 text-[10px] font-medium text-[#62a0f6]">
                          {t("step2.inYourCity")}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-1 flex-col p-3.5">
                      <h3 className="line-clamp-1 text-sm font-semibold text-[#1e1e1e]">
                        {doctor?.name}
                      </h3>
                      <p className="mt-0.5 line-clamp-1 text-xs text-gray-600">{specialist}</p>
                      <div className="mt-1.5 flex items-center gap-1">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < starCount
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-200"
                              }`}
                              aria-hidden
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-medium text-gray-600">{rateNum}</span>
                      </div>
                      <div className="mt-2 flex flex-col gap-1 text-[11px] text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3 shrink-0 text-[#62a0f6]" aria-hidden />
                          {toNum(doctor?.experience, 0)} {t("step2.years")}
                        </span>
                        {cityName ? (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0 text-[#62a0f6]" aria-hidden />
                            <span className="line-clamp-1">{cityName}</span>
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-auto border-t border-gray-100 pt-3">
                        <p className="text-base font-bold text-[#62a0f6]">
                          {toNum(doctor?.session_price, 0)}
                          <span className="ms-1 text-xs font-medium text-gray-500">
                            {t("step2.price")}
                          </span>
                        </p>
                        <div className="mt-2 flex flex-col gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDoctorSelect(doctor)}
                            className="w-full rounded-xl bg-[#143087] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#0f2470]"
                            aria-label={`${t("step2.selectDoctor")} ${doctor?.name ?? ""}`}
                          >
                            {t("step2.selectDoctor")}
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenProfile(doctor)}
                            className="w-full rounded-xl border border-[#d7e4f8] px-3 py-1.5 text-xs font-medium text-[#143087] transition hover:bg-[#eff6fe]"
                            aria-label={`${t("step2.viewProfile")} ${doctor?.name ?? ""}`}
                          >
                            {t("step2.viewProfile")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

              {totalPages > 1 && (
                <nav
                  aria-label={t("step2.pageLabel", { page: currentPage })}
                  className="mt-8 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
                >
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
                    {t("step2.previous")}
                  </button>
                  {visiblePages.map((page, index) => {
                    const prev = visiblePages[index - 1];
                    return (
                      <span key={page} className="flex items-center gap-1.5">
                        {prev && page - prev > 1 ? (
                          <span className="px-1 text-[#4a5568]">…</span>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => goToPage(page)}
                          aria-current={page === currentPage ? "page" : undefined}
                          aria-label={t("step2.pageLabel", { page })}
                          className={`min-w-10 rounded-lg px-3 py-2 text-sm ${
                            page === currentPage
                              ? "bg-[#143087] text-white"
                              : "border"
                          }`}
                        >
                          {page}
                        </button>
                      </span>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {t("step2.next")}
                    <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                  </button>
                </nav>
              )}
            </div>
          )}
      </div>
        </div>
      </div>

      <BookingStepNav
        onPrev={onPrev}
        onNext={() => {
          if (!bookingData.selectedDoctor) {
            toast.error(t("step2.selectDoctorFirst"));
            return;
          }
          onNext();
        }}
        nextDisabled={!bookingData.selectedDoctor}
      />
    </div>
  );
}
