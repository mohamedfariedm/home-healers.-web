"use client";
import { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import { Search, ArrowRight, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { BookingData, Category, Service, Location } from "@/types/booking";
import { useRouter } from "next/navigation";
import ClientAPI from "@/app/api/api";
import LocationPickerModal from "../modals/location-picker-modal";
import { getPackageCategoryList } from "@/lib/package-categories";
import { extractTelrRedirectUrl } from "@/lib/payment-api";
import { persistReservationId } from "@/lib/checkout-storage";
import BookingStepNav from "../booking-step-nav";

/* ------------------------------------------------------------------ */
/* -------------------------- COMPONENT ------------------------------ */
/* ------------------------------------------------------------------ */
export default function Step1SpecialtySelection({
  categoriesData,
  servicesData,
  bookingData,
  updateBookingData,
  onNext,
  showServiceSelection = false,
}: Step1Props) {
  const { t } = useTranslation("booking");
  const router = useRouter();

  /* --------------------- STATE --------------------- */
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"category" | "service">(
    "category",
  );
  const [isQuickBookingOpen, setIsQuickBookingOpen] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false); // <-- NEW
  const [savedLocations, setSavedLocations] = useState<Location[]>([]); // <-- NEW
  let route = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [quickForm, setQuickForm] = useState({
    pain_location: "",
    notes: "",
    attachments: [] as File[],
    is_guest: true,
    guest_info: {
      name: "",
      email: "",
      mobile: "",
      address: "",
      city: "",
      country: "",
      nationality: "",
      date_of_birth: "",
      gender: "male",
      national_id: "",
      blood_group: "",
      languages_spoken: "ar",
    },
    address_city: "",
    address_country: "",
    address_state: "",
    address_link: "",
  });

  /* ------------------- LOAD SAVED LOCATIONS ------------------- */
  useEffect(() => {
    const stored = localStorage.getItem("quickBookingSavedLocations");
    if (stored) setSavedLocations(JSON.parse(stored));
  }, []);

  /* Match tab to pre-filled booking (e.g. defaults from parent) */
  useEffect(() => {
    if (!showServiceSelection) {
      setSelectedType("category");
      return;
    }
    if (bookingData.selectedService) {
      setSelectedType("service");
      return;
    }
    if (bookingData.selectedCategory && servicesData?.data?.length) {
      const hasServicesForCategory = servicesData.data.some(
        (s: Service) => s.category?.id === bookingData.selectedCategory?.id
      );
      setSelectedType(hasServicesForCategory ? "service" : "category");
    }
  }, [
    showServiceSelection,
    bookingData.selectedCategory?.id,
    bookingData.selectedService?.id,
    servicesData?.data,
  ]);

  const updateSavedLocations = (locations: Location[]) => {
    setSavedLocations(locations);
    localStorage.setItem(
      "quickBookingSavedLocations",
      JSON.stringify(locations),
    );
  };

  /* ------------------- FILTERS ------------------- */
  const allCategories: Category[] = categoriesData?.data ?? [];
  const packageScopedCategories = getPackageCategoryList(
    bookingData.selectedPackage,
    allCategories
  );
  const visibleCategories = packageScopedCategories ?? allCategories;

  const filteredCategories =
    visibleCategories.filter((c: Category) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const filteredServices =
    servicesData?.data?.filter(
      (s: Service) =>
        (bookingData.selectedCategory
          ? s.category?.id === bookingData.selectedCategory.id
          : true) &&
        (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description
            .replace(/<[^>]*>/g, "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())),
    ) || [];

  /* ------------------- HANDLERS ------------------- */
  const handleCategorySelect = (category: Category) => {
    flushSync(() => {
      updateBookingData({ selectedCategory: category, selectedService: null });
    });

    if (!showServiceSelection) {
      toast.success(`${t("step1.categorySelected")}: ${category.name}`);
      onNext();
      return;
    }

    const catServices =
      servicesData?.data?.filter(
        (s: Service) => s.category?.id === category.id,
      ) || [];

    if (catServices.length) {
      setSelectedType("service");
      setSearchQuery("");
      toast.success(`${t("step1.categorySelected")}: ${category.name}`);
    } else {
      toast.success(`${t("step1.categorySelected")}: ${category.name}`);
      onNext();
    }
  };

  const handleServiceSelect = (service: Service) => {
    flushSync(() => {
      updateBookingData({
        selectedService: service,
        //@ts-ignore
        selectedCategory: service.category
          ? { id: service.category.id, name: service.category.name, services: [] }
          : null,
      });
    });
    onNext();
  };

  const categoryHasServices =
    showServiceSelection &&
    !!bookingData.selectedCategory &&
    (servicesData?.data ?? []).some(
      (s: Service) => s.category?.id === bookingData.selectedCategory?.id
    );

  const canContinueStep1 = showServiceSelection
    ? !!bookingData.selectedService ||
      (!!bookingData.selectedCategory && !categoryHasServices)
    : !!bookingData.selectedCategory;

  const handleContinueStep1 = () => {
    if (!canContinueStep1) return;
    onNext();
  };

  const handleBackToCategories = () => {
    setSelectedType("category");
    setSearchQuery("");
    updateBookingData({ selectedCategory: null, selectedService: null });
  };

  const removeAttachment = (i: number) =>
    setQuickForm((p) => ({
      ...p,
      attachments: p.attachments.filter((_, idx) => idx !== i),
    }));

  /* ------------------- QUICK BOOKING SUBMIT ------------------- */
  const handleQuickBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await ClientAPI.createQueiqReservation(quickForm, "ar");

      if (res?.success || res?.data) {
        toast.success(
          t("step1.quickBookingSuccess") || "تم إرسال طلب الحجز السريع بنجاح!",
        );
        setIsQuickBookingOpen(false);
        setQuickForm({
          pain_location: "",
          notes: "",
          attachments: [],
          is_guest: true,
          guest_info: {
            name: "",
            email: "",
            mobile: "",
            address: "",
            city: "",
            country: "",
            nationality: "",
            date_of_birth: "",
            gender: "male",
            national_id: "",
            blood_group: "",
            languages_spoken: "ar",
          },
          address_city: "",
          address_country: "",
          address_state: "",
          address_link: "",
        });
        const reservationId = res.data[0].id;
        persistReservationId(reservationId);
        const telrResponse = await ClientAPI.payReservationWithTelr(
          reservationId,
          "ar",
        );

        router.push(extractTelrRedirectUrl(telrResponse));
      } else
        toast.error(
          t("step1.quickBookingFailed") || "فشل الإرسال، حاول مرة أخرى.",
        );
    } catch (err) {
      console.error(err);
      toast.error(t("messages.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ------------------- LOCATION PICKER CALLBACK ------------------- */
  const handleLocationSaved = (
    loc: Location & {
      address_city?: string;
      address_state?: string;
      address_link?: string;
    },
  ) => {
    // Fill the quick-booking fields
    setQuickForm((p) => ({
      ...p,
      address_city: loc.address_city ?? loc.city ?? "",
      address_country: loc.country ?? "",
      address_state: loc.address_state ?? loc.state ?? "",
      address_link: loc.address_link ?? loc.link ?? "",
      // also fill guest address (optional)
      guest_info: {
        ...p.guest_info,
        address: loc.address ?? "",
        city: loc.address_city ?? loc.city ?? "",
        country: loc.country ?? "",
      },
    }));

    toast.success(t("step3.locationSelected"));
    setIsLocationPickerOpen(false);
  };

  /* ------------------- UI HELPERS ------------------- */
  const isCategoriesEmpty = !visibleCategories.length;
  const isServicesEmpty =
    showServiceSelection &&
    (!servicesData?.data?.length ||
      (selectedType === "service" && filteredServices.length === 0));

  const showCategoryGrid =
    !isCategoriesEmpty && (selectedType === "category" || !showServiceSelection);
  const showServiceGrid =
    showServiceSelection && selectedType === "service" && !isServicesEmpty;

  /* ------------------------------------------------------------------ */
  return (
    <>
      {/* ====================== MAIN UI ====================== */}
      <div
        className="flex flex-col gap-8 bg-white rounded-2xl shadow-md p-6"
        data-tour="tour-specialty"
        data-booking-step
      >
        {/* Quick Booking Button */}
        <div className="flex flex-col items-start gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
          <h2 className="text-lg sm:text-xl font-bold leading-7 text-[#1e1e1e]">
            {t("step1.quickBooking")}
          </h2>
          <p className="text-base leading-6 text-[#1e1e1e] text-right">
            {t("step1.quickBookingDescription") ||
              "أرسل حالتك وسنتواصل معك لتحديد الطبيب والموعد المناسب"}
          </p>
          <button
            onClick={() => setIsQuickBookingOpen(true)}
            className="px-6 py-3 bg-[#10b981] rounded-lg text-white font-medium text-base flex items-center gap-2 hover:bg-[#0d9c6e] transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            {t("step1.quickBooking")}
          </button>
        </div>

        <div className="w-full h-px bg-gray-200" />

        {bookingData.selectedPackage && packageScopedCategories && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            {t("step1.packageCategoryHint") ||
              "اختر التخصص المناسب ضمن باقتك:"}{" "}
            <span className="font-semibold">
              {bookingData.selectedPackage.name}
            </span>
          </div>
        )}

        {/* Tabs — service selection optional via showServiceSelection */}
        {showServiceSelection && (
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
              {t("step1.selectCategory")}
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
              {t("step1.selectService")}
            </button>
          </div>
        )}

        {/* Back button */}
        {showServiceSelection &&
          selectedType === "service" &&
          bookingData.selectedCategory && (
          <button
            onClick={handleBackToCategories}
            className="flex items-center gap-2 text-[#62a0f6] hover:text-[#5090e6] font-medium mb-4"
          >
            <ArrowRight className="w-5 h-5" />
            {t("step2.backToSpecialty")}
          </button>
        )}

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder={t("step1.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 pr-12 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#62a0f6] focus:border-transparent"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        {/* Empty states */}
        {selectedType === "category" && isCategoriesEmpty && (
          <div className="text-center p-6 text-gray-600">
            {t("step1.noCategories") ||
              "لا توجد تخصصات متاحة حاليًا. حاول لاحقًا."}
          </div>
        )}
        {selectedType === "service" && isServicesEmpty && (
          <div className="text-center p-6 text-gray-600">
            {t("step1.noServices") ||
              "لا توجد خدمات متاحة لهذا التخصص. يمكنك العودة لاختيار تخصص آخر."}
          </div>
        )}

        {/* Grid */}
        {(showCategoryGrid || showServiceGrid) && (
          <div>
            <h2 className="text-lg sm:text-xl font-bold leading-7 text-[#1e1e1e] mb-6">
              {selectedType === "category" || !showServiceSelection
                ? t("step1.selectCategory")
                : t("step1.selectService")}
            </h2>

            {selectedType === "category" || !showServiceSelection ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCategories.map((c: Category) => (
                  <button
                    key={c.id}
                    onClick={() => handleCategorySelect(c)}
                    className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                      bookingData.selectedCategory?.id === c.id
                        ? "border-[#62a0f6] bg-[#eff6fe]"
                        : "border-gray-200 bg-white hover:border-[#62a0f6]"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-[#eff6fe] rounded-full flex items-center justify-center">
                        <img
                          src={
                            c.image?.[0]?.original || "/default-category.png"
                          }
                          alt={c.name}
                          className="w-8 h-8 object-cover rounded-full"
                        />
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold text-[#1e1e1e] mb-1">
                          {c.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {c.services?.length || 0}{" "}
                          {t("step1.service") || "خدمة"}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((s: Service) => (
                  <button
                    key={s.id}
                    onClick={() => handleServiceSelect(s)}
                    className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg text-right ${
                      bookingData.selectedService?.id === s.id
                        ? "border-[#62a0f6] bg-[#eff6fe]"
                        : "border-gray-200 bg-white hover:border-[#62a0f6]"
                    }`}
                  >
                    <div className="flex flex-col gap-4">
                      <div className="w-12 h-12 bg-[#eff6fe] rounded-lg flex items-center justify-center">
                        <img
                          src={
                            s.icon?.[0]?.original ||
                            s.image?.[0]?.original ||
                            "/default-service.png"
                          }
                          alt={s.name}
                          className="w-6 h-6 object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1e1e1e] mb-2">
                          {s.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {s.description.replace(/<[^>]*>/g, "")}
                        </p>
                        {s.category && (
                          <p className="text-xs text-[#62a0f6] mt-2">
                            {s.category.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selected summary */}
        {(bookingData.selectedCategory || bookingData.selectedService) && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">
              {t("step1.selected") || "تم اختيار"}:{" "}
              {showServiceSelection &&
              bookingData.selectedService ? (
                <>
                  {bookingData.selectedService?.name} (
                  {t("step1.service") || "خدمة"})
                  {bookingData.selectedService?.category && (
                    <>
                      {" "}
                      - {t("step1.category")}:{" "}
                      {bookingData.selectedService.category.name}
                    </>
                  )}
                </>
              ) : bookingData.selectedCategory ? (
                <>
                  {bookingData.selectedCategory.name} (
                  {t("step1.category") || "تخصص"})
                </>
              ) : null}
            </p>
          </div>
        )}

        <BookingStepNav
          showPrev={false}
          showNext={canContinueStep1}
          onNext={handleContinueStep1}
        />
      </div>

      {/* ==================== QUICK BOOKING MODAL ==================== */}
      {isQuickBookingOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-2 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[95%] sm:max-w-2xl lg:max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white p-4 sm:p-6 border-b flex justify-between items-center z-10">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {t("step1.quickBooking")}
              </h2>
              <button
                onClick={() => setIsQuickBookingOpen(false)}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleQuickBookingSubmit}
              className="p-4 sm:p-6 space-y-5 sm:space-y-6"
            >
              {/* Pain & Notes Section */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 sm:p-5 rounded-xl border border-emerald-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 sm:w-7 sm:h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                    1
                  </span>
                  {t("step1.medicalInfo") || "المعلومات الطبية"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {t("step1.painLocation")} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={
                        t("step1.painLocationPlaceholder") ||
                        "مثال: أسفل الظهر – الركبة – الرقبة"
                      }
                      value={quickForm.pain_location}
                      onChange={(e) =>
                        setQuickForm((p) => ({
                          ...p,
                          pain_location: e.target.value,
                        }))
                      }
                      className="w-full h-11 sm:h-12 px-4 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-gray-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {t("step1.notes")} *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder={
                        t("step1.notesPlaceholder") ||
                        "اكتب وصف دقيق للحالة – متى بدأ الألم – ما الذى يسببه – الأدوية الحالية..."
                      }
                      value={quickForm.notes}
                      onChange={(e) =>
                        setQuickForm((p) => ({ ...p, notes: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-gray-400 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Info Section */}
              <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-4 sm:p-5 rounded-xl border border-blue-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                    2
                  </span>
                  {t("step1.personalInfo") || "المعلومات الشخصية"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {t("step1.name")} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={
                        t("step1.namePlaceholder") || "أدخل اسم المريض"
                      }
                      value={quickForm.guest_info.name}
                      onChange={(e) =>
                        setQuickForm((p) => ({
                          ...p,
                          guest_info: { ...p.guest_info, name: e.target.value },
                        }))
                      }
                      className="w-full h-11 sm:h-12 px-4 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {t("step1.email")} *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="example@email.com"
                      value={quickForm.guest_info.email}
                      onChange={(e) =>
                        setQuickForm((p) => ({
                          ...p,
                          guest_info: {
                            ...p.guest_info,
                            email: e.target.value,
                          },
                        }))
                      }
                      className="w-full h-11 sm:h-12 px-4 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 transition-all"
                    />
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {t("step1.mobile")} *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="05xxxxxxxx"
                      value={quickForm.guest_info.mobile}
                      onChange={(e) =>
                        setQuickForm((p) => ({
                          ...p,
                          guest_info: {
                            ...p.guest_info,
                            mobile: e.target.value,
                          },
                        }))
                      }
                      className="w-full h-11 sm:h-12 px-4 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 transition-all"
                    />
                  </div>

                  {/* Nationality */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {t("step1.nationality")}
                    </label>
                    <input
                      type="text"
                      placeholder="سعودي – مصري – أردني..."
                      value={quickForm.guest_info.nationality}
                      onChange={(e) =>
                        setQuickForm((p) => ({
                          ...p,
                          guest_info: {
                            ...p.guest_info,
                            nationality: e.target.value,
                          },
                        }))
                      }
                      className="w-full h-11 sm:h-12 px-4 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 transition-all"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {t("step1.dateOfBirth")}
                    </label>
                    <input
                      type="date"
                      value={quickForm.guest_info.date_of_birth}
                      onChange={(e) =>
                        setQuickForm((p) => ({
                          ...p,
                          guest_info: {
                            ...p.guest_info,
                            date_of_birth: e.target.value,
                          },
                        }))
                      }
                      className="w-full h-11 sm:h-12 px-4 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {t("step1.gender")}
                    </label>
                    <select
                      value={quickForm.guest_info.gender}
                      onChange={(e) =>
                        setQuickForm((p) => ({
                          ...p,
                          guest_info: {
                            ...p.guest_info,
                            gender: e.target.value as "male" | "female",
                          },
                        }))
                      }
                      className="w-full h-11 sm:h-12 px-4 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option value="">{t("step1.select") || "اختر"}</option>
                      <option value="male">{t("step1.male") || "ذكر"}</option>
                      <option value="female">
                        {t("step1.female") || "أنثى"}
                      </option>
                    </select>
                  </div>

                  {/* National ID */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {t("step1.nationalId")}
                    </label>
                    <input
                      type="text"
                      placeholder="الهوية / الإقامة"
                      value={quickForm.guest_info.national_id}
                      onChange={(e) =>
                        setQuickForm((p) => ({
                          ...p,
                          guest_info: {
                            ...p.guest_info,
                            national_id: e.target.value,
                          },
                        }))
                      }
                      className="w-full h-11 sm:h-12 px-4 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 transition-all"
                    />
                  </div>

                  {/* Blood Group */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {t("step1.bloodGroup")}
                    </label>
                    <select
                      value={quickForm.guest_info.blood_group}
                      onChange={(e) =>
                        setQuickForm((p) => ({
                          ...p,
                          guest_info: {
                            ...p.guest_info,
                            blood_group: e.target.value,
                          },
                        }))
                      }
                      className="w-full h-11 sm:h-12 px-4 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option value="">
                        {t("step1.selectBloodGroup") || "اختر فصيلة الدم"}
                      </option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 sm:p-5 rounded-xl border border-purple-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 sm:w-7 sm:h-7 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                    3
                  </span>
                  {t("step1.addressInfo") || "معلومات العنوان"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {t("step1.address")} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="الحي – الشارع – رقم المبنى"
                      value={quickForm.guest_info.address}
                      onChange={(e) =>
                        setQuickForm((p) => ({
                          ...p,
                          guest_info: {
                            ...p.guest_info,
                            address: e.target.value,
                          },
                        }))
                      }
                      className="w-full h-11 sm:h-12 px-4 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 transition-all"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {t("step1.city")} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="الرياض – جدة – الدمام..."
                      value={quickForm.guest_info.city}
                      onChange={(e) =>
                        setQuickForm((p) => ({
                          ...p,
                          guest_info: { ...p.guest_info, city: e.target.value },
                        }))
                      }
                      className="w-full h-11 sm:h-12 px-4 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 transition-all"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {t("step1.country")} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="السعودية – الكويت – الإمارات..."
                      value={quickForm.guest_info.country}
                      onChange={(e) =>
                        setQuickForm((p) => ({
                          ...p,
                          guest_info: {
                            ...p.guest_info,
                            country: e.target.value,
                          },
                        }))
                      }
                      className="w-full h-11 sm:h-12 px-4 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 transition-all"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {t("step1.state") || "المنطقة / الولاية"}
                    </label>
                    <input
                      type="text"
                      placeholder="منطقة الرياض..."
                      value={quickForm.address_state}
                      onChange={(e) =>
                        setQuickForm((p) => ({
                          ...p,
                          address_state: e.target.value,
                        }))
                      }
                      className="w-full h-11 sm:h-12 px-4 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 transition-all"
                    />
                  </div>

                  {/* Location Picker */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {t("step3.selectLocation")}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="https://maps.google.com/?q=..."
                        value={quickForm.address_link}
                        readOnly
                        className="flex-1 h-11 sm:h-12 px-4 border border-gray-300 rounded-xl text-right bg-gray-50 text-gray-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setIsLocationPickerOpen(true)}
                        className="h-11 sm:h-12 px-5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {t("step3.selectLocation")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsQuickBookingOpen(false)}
                  className="h-11 sm:h-12 px-6 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  {t("modals.addPatient.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 sm:h-12 px-8 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t("step1.submitting") || "جاري الإرسال..."}
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-5 h-5 rotate-180" />
                      {t("step1.submit") || "إرسال الطلب"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== LOCATION PICKER MODAL ==================== */}
      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onSave={handleLocationSaved}
        savedLocations={savedLocations}
        updateSavedLocations={updateSavedLocations}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* -------------------------- TYPES & STYLES ------------------------ */
/* ------------------------------------------------------------------ */
interface Step1Props {
  categoriesData: any;
  servicesData: any;
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  onNext: () => void;
  showServiceSelection?: boolean;
}

/* Form styles are now inline using Tailwind classes for better consistency */
