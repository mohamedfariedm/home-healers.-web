"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { BookingData, Location, Patient, Doctor, Category } from "@/types/booking";

// Import all step components
import Step1SpecialtySelection from "./steps/step1-specialty-selection";
import Step2DoctorSelection from "./steps/step2-doctor-selection";
import Step3LocationTime from "./steps/step3-location-time";
import Step4PatientInfo from "./steps/step4-patient-info";
import Step5Payment from "./steps/step5-payment";
import Step6Confirmation from "./steps/step6-confirmation";

// Import modals
import AddPatientModal from "./modals/add-patient-modal";
import LocationPickerModal from "./modals/location-picker-modal";
import SymptomsSearchModal from "./modals/symptoms-search-modal";
import DoctorProfileModal from "./modals/doctor-profile-modal";
import { useLocalStorage } from "@/Hooks/use-local-storage";
import ClientAPI from "@/app/api/api";
import { useRouter } from "next/navigation";
import { doctorMatchesCategoryId } from "@/lib/doctor-matches-category";
import { applyReservationPricingFromApi } from "@/lib/reservation-pricing";
import {
  applyPaymentSummaryToBooking,
  extractApiMessage,
  type PaymentSummaryData,
} from "@/lib/payment-summary";
import { extractTelrRedirectUrl } from "@/lib/payment-api";
import { persistReservationId, clearCheckoutStorage } from "@/lib/checkout-storage";
import {
  resolveNationalityId,
} from "@/lib/saudi-nationality";
import BookingReservationTour from "@/components/booking/BookingReservationTour";
import {
  isBookingTourCompleted,
  resetBookingTour,
} from "@/lib/booking-tour-storage";
import { useSearchParams } from "next/navigation";
import { Compass } from "lucide-react";
import { SHOW_SERVICE_SELECTION_STEP } from "@/lib/booking-config";
import {
  getPackageCategoryList,
  type PackageWithCategories,
} from "@/lib/package-categories";

function normalizePaymentMethod(method: string | undefined): string {
  if (!method || method === "cash_on_delivery") return "cash";
  if (method === "apple_pay" || method === "wallet") return "telr";
  return method;
}

function addDaysLocalISO(daysFromToday: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

type BookingStep = 1 | 2 | 3 | 4 | 5 | 6;

interface BookingFlowProps {
  locale: string;
  doctorsData: any;
  servicesData: any;
  packagesData: any;
  categoriesData: any;
  countriesData: any;
  statesData: any;
  citiesData: any;
  nationalitiesData: any;
}

export default function BookingFlow({
  locale,
  doctorsData,
  servicesData,
  packagesData,
  categoriesData,
  countriesData,
  statesData,
  citiesData,
  nationalitiesData,
}: BookingFlowProps) {
  const { t } = useTranslation("booking");
  const [currentStep, setCurrentStep] = useState<BookingStep>(1);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileDoctor, setProfileDoctor] = useState<Doctor | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [reservationId, setReservationId] = useState<number | null>(null); // Store reservation ID
  const [tourActive, setTourActive] = useState(false);
  const searchParams = useSearchParams();
  let route = useRouter();
  const [bookingData, setBookingData] = useLocalStorage<BookingData>(
    "bookingData",
    {
      selectedCategory: null,
      selectedService: null,
      selectedSymptoms: [],
      selectedDoctor: null,
      selectedPackage: null,
      searchFilters: {
        cityId: "",
        gender: "",
        district: "",
        specialty: "",
        experience: "",
        rating: 0,
        priceRange: [0, 1000],
      },
      selectedLocation: null,
      selectedDates: [],
      sessionsCount: 1,
      selectedPatients: [],
      patients: [],
      healthInfo: {
        painLocation: "",
        symptoms: "",
        medicalHistory: "",
        currentMedications: "",
        allergies: "",
        notes: "",
        attachments: [],
      },
      paymentMethod: "cash",
      couponCode: "",
      couponId: undefined,
      couponType: undefined,
      couponValue: undefined,
      pricing: {
        subTotal: 0,
        fees: 0,
        tax: 0,
        discount: 0,
        couponDiscount: 0,
        total: 0,
      },
    },
    {
      // Fresh specialty/service each visit; other draft fields (location, patients, etc.) still restore.
      deserialize: (parsed) => {
        const filters = parsed.searchFilters ?? {};
        const { city: _legacyCity, ...restFilters } = filters;
        return {
          ...parsed,
          paymentMethod: normalizePaymentMethod(parsed.paymentMethod),
          selectedCategory: null,
          selectedService: null,
          searchFilters: {
            cityId: restFilters.cityId ?? "",
            gender: restFilters.gender ?? "",
            district: restFilters.district ?? "",
            specialty: restFilters.specialty ?? "",
            experience: restFilters.experience ?? "",
            rating: restFilters.rating ?? 0,
            priceRange: restFilters.priceRange ?? [0, 1000],
          },
        };
      },
    }
  );

  const [savedLocations, setSavedLocations] = useLocalStorage<Location[]>(
    "savedLocations",
    []
  );
  const [savedPatients, setSavedPatients] = useLocalStorage<Patient[]>(
    "savedPatients",
    []
  );
  const [modals, setModals] = useState({
    addPatient: false,
    locationPicker: false,
    symptomsSearch: false,
    doctorProfile: false,
  });
  const [doctorsList, setDoctorsList] = useState(doctorsData?.data || []);
  const [filteredDoctors, setFilteredDoctors] = useState(
    doctorsData?.data || []
  );
  const [doctorsLoading, setDoctorsLoading] = useState(false);

  const defaultDatesSeededRef = useRef(false);
  const step1DefaultsAppliedRef = useRef(false);
  const packageInitRef = useRef(false);
  const bookingDataRef = useRef(bookingData);
  bookingDataRef.current = bookingData;

  useEffect(() => {
    if (searchParams.get("booking_tour") === "1") {
      resetBookingTour();
    }
    if (!isBookingTourCompleted()) {
      const timer = window.setTimeout(() => setTourActive(true), 600);
      return () => window.clearTimeout(timer);
    }
  }, [searchParams]);

  // Auto-select package from URL and handle category scoping / auto-advance
  useEffect(() => {
    const packageId =
      searchParams.get("packageId") || searchParams.get("packageid");
    if (!packageId || !packagesData?.data || packageInitRef.current) return;

    const pkgId = Number.parseInt(packageId, 10);
    if (Number.isNaN(pkgId)) return;

    const selectedPkg = packagesData.data.find(
      (p: PackageWithCategories) => Number(p.id) === pkgId
    );
    if (!selectedPkg) return;

    packageInitRef.current = true;
    step1DefaultsAppliedRef.current = true;

    const allCategories: Category[] = categoriesData?.data ?? [];
    const packageCategories = getPackageCategoryList(
      selectedPkg,
      allCategories
    );

    const baseUpdates: Partial<BookingData> = {
      selectedPackage: selectedPkg,
      sessionsCount: selectedPkg.sessions_count || 1,
      selectedService: null,
    };

    if (packageCategories?.length === 1) {
      setBookingData((prev) => ({
        ...prev,
        ...baseUpdates,
        selectedCategory: packageCategories[0],
      }));
      setCurrentStep(2);
      toast.success(
        `${t("step2.packageSelected")}: ${selectedPkg.name}`
      );
    } else {
      setBookingData((prev) => ({
        ...prev,
        ...baseUpdates,
        selectedCategory: null,
      }));
      toast.success(
        `${t("step2.packageSelected")}: ${selectedPkg.name}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, packagesData, categoriesData]);

  const clearTransientReservationData = () => {
    setBookingData((prev) => ({
      ...prev,
      couponCode: "",
      couponId: undefined,
      couponType: undefined,
      couponValue: undefined,
    }));
  };

  // Avoid conflicts from old reservation/coupon data saved in localStorage
  useEffect(() => {
    if (
      bookingData.couponCode ||
      bookingData.couponId ||
      bookingData.couponType ||
      bookingData.couponValue
    ) {
      clearTransientReservationData();
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resolveCityIdForDoctorSort = (): number | undefined => {
    const fromFilter = bookingData.searchFilters?.cityId;
    if (fromFilter !== "" && fromFilter != null) {
      return Number(fromFilter);
    }
    const fromLocation = bookingData.selectedLocation?.cityId;
    if (fromLocation != null) return Number(fromLocation);
    const locationCityName = bookingData.selectedLocation?.city?.trim();
    if (locationCityName && citiesData?.data) {
      const match = citiesData.data.find(
        (c: { id: number; name: string }) =>
          String(c.name).toLowerCase() === locationCityName.toLowerCase()
      );
      if (match) return Number(match.id);
    }
    return undefined;
  };

  // Refetch doctors when sort hints change (server-side sort, not filter)
  useEffect(() => {
    let cancelled = false;
    const loadDoctors = async () => {
      setDoctorsLoading(true);
      try {
        const cityId = resolveCityIdForDoctorSort();
        const gender = bookingData.searchFilters?.gender;
        const params: { city_id?: number; gender?: "male" | "female" } = {};
        if (cityId != null && !Number.isNaN(cityId)) params.city_id = cityId;
        if (gender === "male" || gender === "female") params.gender = gender;

        const response = await ClientAPI.getDoctors(locale, params);
        if (!cancelled && Array.isArray(response?.data)) {
          setDoctorsList(response.data);
        }
      } catch (err) {
        console.error("Failed to load doctors:", err);
        if (!cancelled) setDoctorsList(doctorsData?.data || []);
      } finally {
        if (!cancelled) setDoctorsLoading(false);
      }
    };
    loadDoctors();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    locale,
    bookingData.searchFilters?.cityId,
    bookingData.searchFilters?.gender,
    bookingData.selectedLocation?.cityId,
    bookingData.selectedLocation?.city,
  ]);

  useEffect(() => {
    handleDoctorSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorsList, bookingData.selectedCategory]);

  // Step 1: default first category (and first service when enabled), once per visit
  useEffect(() => {
    const packageId =
      searchParams.get("packageId") || searchParams.get("packageid");
    if (packageId || packageInitRef.current) return;

    const firstCat = categoriesData?.data?.[0];
    if (!firstCat || step1DefaultsAppliedRef.current) return;

    setBookingData((prev:any) => {
      if (prev.selectedCategory || prev.selectedService || prev.selectedPackage) {
        step1DefaultsAppliedRef.current = true;
        return prev;
      }
      step1DefaultsAppliedRef.current = true;

      if (!SHOW_SERVICE_SELECTION_STEP) {
        return {
          ...prev,
          selectedCategory: firstCat,
          selectedService: null,
        };
      }

      const catServices = (servicesData?.data ?? []).filter(
        (s: any) => s.category?.id === firstCat.id
      );
      if (catServices.length > 0) {
        const s0 = catServices[0];
        return {
          ...prev,
          selectedCategory: {
            id: s0.category.id,
            name: s0.category.name,
            services: [],
          },
          selectedService: s0,
        };
      }
      return {
        ...prev,
        selectedCategory: firstCat,
        selectedService: null,
      };
    });
  }, [categoriesData, servicesData, searchParams]);

  // Step 2: default first doctor in current filtered list when none selected or selection not in list
  useEffect(() => {
    if (!filteredDoctors?.length) return;
    setBookingData((prev) => {
      if (
        prev.selectedDoctor &&
        filteredDoctors.some((d: Doctor) => d.id === prev.selectedDoctor?.id)
      ) {
        return prev;
      }
      return { ...prev, selectedDoctor: filteredDoctors[0] };
    });
  }, [filteredDoctors]);

  // Step 3: default first saved location
  useEffect(() => {
    if (!savedLocations?.length) return;
    setBookingData((prev) => {
      if (prev.selectedLocation) return prev;
      return { ...prev, selectedLocation: savedLocations[0] };
    });
  }, [savedLocations]);

  // Step 3: default one appointment (tomorrow, first morning slot) when none stored
  useEffect(() => {
    if (defaultDatesSeededRef.current) return;
    defaultDatesSeededRef.current = true;
    setBookingData((prev) => {
      if (prev.selectedDates.length > 0) return prev;
      const dateStr = addDaysLocalISO(1);
      const time = "09:00";
      return {
        ...prev,
        selectedDates: [
          {
            date: dateStr,
            time,
            start_time: `${dateStr} ${time}:00`,
            end_time: `${dateStr} 10:00:00`,
            time_period: "morning",
          },
        ],
      };
    });
  }, []);

  // Step 4: default first saved patient when none selected
  useEffect(() => {
    if (!savedPatients?.length) return;
    setBookingData((prev) => {
      if (prev.selectedPatients.length > 0) return prev;
      return { ...prev, selectedPatients: [savedPatients[0]] };
    });
  }, [savedPatients]);

  // Step 5: ensure a payment method (default to cash)
  useEffect(() => {
    setBookingData((prev) => {
      const method = normalizePaymentMethod(prev.paymentMethod);
      if (method !== prev.paymentMethod) {
        return { ...prev, paymentMethod: method };
      }
      if (prev.paymentMethod) return prev;
      return { ...prev, paymentMethod: "cash" };
    });
  }, []);

  const steps = [
    {
      step: t("steps.step1"),
      desc: t("steps.step1Desc"),
      active: currentStep >= 1,
    },
    {
      step: t("steps.step2"),
      desc: t("steps.step2Desc"),
      active: currentStep >= 2,
    },
    {
      step: t("steps.step3"),
      desc: t("steps.step3Desc"),
      active: currentStep >= 3,
    },
    {
      step: t("steps.step4"),
      desc: t("steps.step4Desc"),
      active: currentStep >= 4,
    },
    {
      step: t("steps.step5"),
      desc: t("steps.step5Desc"),
      active: currentStep >= 5,
    },
    {
      step: t("steps.step6"),
      desc: t("steps.step6Desc"),
      active: currentStep >= 6,
    },
  ];

  useEffect(() => {
    calculatePricing();
  }, [
    bookingData.selectedPackage,
    bookingData.sessionsCount,
    bookingData.selectedPatients,
  ]);

  const nationalityOptions: { id: number; name: string }[] = Array.isArray(
    nationalitiesData?.data
  )
    ? nationalitiesData.data
    : [];

  const getPatientNationalityContext = () => {
    const patient = bookingData.selectedPatients?.[0];
    const nationalityName = patient?.nationality;
    const nationalityId =
      patient?.nationality_id ??
      resolveNationalityId(nationalityName, nationalityOptions);
    return { nationalityName, nationalityId };
  };

  const calculatePricing = () => {
    let subTotal = 0;
    const hasPackage = !!bookingData.selectedPackage;

    // 1. Calculate base subtotal
    if (hasPackage && bookingData.selectedPackage) {
      // For packages, the price is already after discount
      subTotal = Number.parseFloat(bookingData.selectedPackage.price);
    } else {
      subTotal = 300 * bookingData.sessionsCount;
    }

    // Nationality fee comes from payment summary after reservation is created
    const tax = 0;

    // 5. Discount from package + coupon
    let discount = 0;

    // For packages: don't apply package discount again (price is already discounted)
    // Only apply coupon discounts if any
    if (!hasPackage && bookingData.selectedPackage?.discount) {
      discount += Number.parseFloat(bookingData.selectedPackage.discount);
    }

    // For packages: show the discount amount for display purposes only
    // but don't subtract it from total (price is already discounted)
    const packageDiscount =
      hasPackage && bookingData.selectedPackage
        ? Math.max(
            0,
            (Number.parseFloat(bookingData.selectedPackage.discount) || 0) -
              (Number.parseFloat(bookingData.selectedPackage.price) || 0)
          )
        : 0;

    const payableBeforeDiscount = hasPackage
      ? Math.max(0, subTotal)
      : Math.max(0, subTotal - discount);

    const total = Math.max(0, payableBeforeDiscount);

    setBookingData((prev) => ({
      ...prev,
      pricing: {
        subTotal,
        fees: prev.paymentSummaryMethods?.length ? prev.pricing.fees : 0,
        tax: prev.paymentSummaryMethods?.length ? prev.pricing.tax : tax,
        discount: hasPackage ? packageDiscount : discount,
        couponDiscount: prev.pricing.couponDiscount ?? 0,
        total: prev.paymentSummaryMethods?.length ? prev.pricing.total : total,
      },
    }));
  };

  const handleDoctorSearch = async () => {
    let doctors = doctorsList.length > 0 ? doctorsList : doctorsData?.data || [];

    let fullCategory = bookingData.selectedCategory as Category | null;
    if (fullCategory && categoriesData?.data) {
      const categoryFromData = categoriesData.data.find(
        (cat: any) => cat.id === fullCategory?.id
      );
      if (categoryFromData) {
        fullCategory = { ...fullCategory, ...categoryFromData };
      }
    }

    const categoryId = fullCategory?.id;
    if (categoryId != null) {
      doctors = doctors.filter((doctor: Doctor) =>
        doctorMatchesCategoryId(doctor, categoryId)
      );
    }

    setFilteredDoctors(doctors);
  };

  const updateBookingData = (
    updates:
      | Partial<BookingData>
      | ((prev: BookingData) => Partial<BookingData>)
  ) => {
    setBookingData((prev) => {
      const partial =
        typeof updates === "function" ? updates(prev) : updates;
      const next = { ...prev, ...partial };
      bookingDataRef.current = next;
      return next;
    });
  };

  const openModal = (modalName: keyof typeof modals, doctor?: Doctor) => {
    setModals((prev) => ({ ...prev, [modalName]: true }));
    if (modalName === "doctorProfile" && doctor) {
      setProfileDoctor(doctor);
    }
  };

  const closeModal = (modalName: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
    if (modalName === "doctorProfile") {
      setProfileDoctor(null);
    }
    if (modalName === "addPatient") {
      setEditingPatient(null);
    }
    if (modalName === "locationPicker") {
      setEditingLocation(null);
    }
  };

  const saveLocation = (location: Location) => {
        const existingIndex = savedLocations.findIndex(
      (loc) =>
        loc.id === location.id ||
        (loc.latitude === location.latitude &&
          loc.longitude === location.longitude &&
          loc.title === location.title)
    );

    if (existingIndex >= 0) {
      const updated = [...savedLocations];
      updated[existingIndex] = location;
      setSavedLocations(updated);
      updateBookingData({ selectedLocation: location });
      toast.success(t("messages.locationUpdated") || "تمت تحديث الموقع بنجاح");
    } else {
      const newLocation = { ...location, id: location.id || Date.now() };
      setSavedLocations((prev) => [...prev, newLocation]);
      updateBookingData({ selectedLocation: newLocation });
      toast.success(t("messages.locationSaved"));
    }
  };

  const updateSavedLocations = (locations: Location[]) => {
    setSavedLocations(locations);
    //@ts-ignore
    if (
      bookingData.selectedLocation &&
      //@ts-ignore
      !locations.some((loc) => loc.id === bookingData.selectedLocation.id)
    ) {
      updateBookingData({ selectedLocation: null });
    }
  };

  const savePatient = (patient: Patient, isEditing: boolean = false) => {
        if (isEditing) {
      const updatedPatients = savedPatients.map((p) =>
        p.id === patient.id ? patient : p
      );
      setSavedPatients(updatedPatients);
      updateBookingData({
        selectedPatients: bookingData.selectedPatients.map((p) =>
          p.id === patient.id ? patient : p
        ),
        patients: bookingData.patients.map((p) =>
          p.id === patient.id ? patient : p
        ),
      });
      toast.success(t("messages.patientUpdated"));
    } else {
      const newPatient = { ...patient, id: patient.id || Date.now() };
      setSavedPatients((prev) => [...prev, newPatient]);
      updateBookingData({
        patients: [...bookingData.patients, newPatient],
      });
      // ⭐ التحديد التلقائي لأول مريض
      if (bookingData.selectedPatients.length === 0) {
        updateBookingData({
          selectedPatients: [newPatient],
        });
      }
    }
    closeModal("addPatient");
  };

  const updateSavedPatients = (patients: Patient[]) => {
    setSavedPatients(patients);
    updateBookingData({
      selectedPatients: bookingData.selectedPatients.filter((p) =>
        patients.some((sp) => sp.id === p.id)
      ),
      patients: bookingData.patients.filter((p) =>
        patients.some((sp) => sp.id === p.id)
      ),
    });
  };

  const validateStep = (step: BookingStep): boolean => {
    const data = bookingDataRef.current;
    switch (step) {
      case 1:
        if (!SHOW_SERVICE_SELECTION_STEP) {
          if (!data.selectedCategory) {
            setError(t("validation.selectCategoryOrService"));
            toast.error(t("validation.selectCategoryOrService"));
            return false;
          }
          break;
        }
        if (!data.selectedCategory && !data.selectedService) {
          setError(t("validation.selectCategoryOrService"));
          toast.error(t("validation.selectCategoryOrService"));
          return false;
        }
        break;
      case 2:
        if (!data.selectedDoctor) {
          
          setError(t("validation.selectDoctor"));
          toast.error(t("validation.selectDoctor"));
          return false;
        }
        break;
      case 3:
        if (!data.selectedLocation) {
          setError(t("validation.selectLocation"));
          toast.error(t("validation.selectLocation"));
          return false;
        }
        if (data.selectedDates.length < 1) {
          setError(t("validation.selectAtLeastOneAppointment"));
          toast.error(t("validation.selectAtLeastOneAppointment"));
          return false;
        }
        break;
      case 4:
        if (data.selectedPatients.length === 0) {
          setError(t("validation.selectAtLeastOnePatient"));
          toast.error(t("validation.selectAtLeastOnePatient"));
          return false;
        }
        if (!data.healthInfo.painLocation.trim()) {
          setError(t("validation.specifyPainLocation"));
          toast.error(t("validation.specifyPainLocation"));
          return false;
        }
        break;
      case 5:
        if (!data.paymentMethod) {
          setError(t("validation.selectPaymentMethod"));
          toast.error(t("validation.selectPaymentMethod"));
          return false;
        }
        break;
    }
    setError(null);
    return true;
  };

  const submitBooking = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Upload attachments and get their IDs
      const attachmentIds: number[] = [];
      for (const file of bookingData.healthInfo.attachments || []) {
        
        const formData = new FormData();
        formData.append("attachment[]", file);
        const attachmentResponse = await ClientAPI.uploadAttachment(
          formData,
          "ar"
        );
        attachmentIds.push(attachmentResponse.data[0].original);
      }

      // Build guest_info if it's a guest reservation (assumes selectedPatients has the guest info)
      const isGuest = bookingData.selectedPatients?.length === 1;
      const guest = isGuest ? bookingData.selectedPatients[0] : null;

      // Check if selected category has has_service: false
      const selectedCategory = bookingData.selectedCategory as (Category & { has_service?: boolean }) | null;
      const categoryHasNoService = selectedCategory?.has_service === false;
      
            
      const { nationalityName, nationalityId } = getPatientNationalityContext();
      const primaryPatient = bookingData.selectedPatients?.[0];
      const resolvedNationalityId =
        nationalityId ??
        primaryPatient?.nationality_id ??
        resolveNationalityId(
          primaryPatient?.nationality ?? nationalityName,
          nationalityOptions
        );

      const reservationData: any = {
        service_id: categoryHasNoService ? null : bookingData.selectedService?.id,
        category_id: bookingData.selectedCategory?.id,
        doctor_id: bookingData.selectedDoctor?.id,
        sessions_count:
          bookingData.selectedPackage?.sessions_count ??
          bookingData.sessionsCount,
        sub_total: bookingData.pricing.subTotal,
        total_amount: bookingData.pricing.subTotal,
        transaction_reference: `txn_${Date.now()}`,
        pain_location: bookingData.healthInfo.painLocation,
        notes: [
          bookingData.healthInfo.symptoms,
          bookingData.healthInfo.medicalHistory,
          bookingData.healthInfo.currentMedications,
          bookingData.healthInfo.allergies,
          bookingData.healthInfo.notes,
        ]
          .filter(Boolean)
          .join("\n"),
        dates: bookingData.selectedDates.map((date) => ({
          start_time: date.start_time,
          end_time: date.end_time,
          time_period: date.time_period,
        })),
        attachments: attachmentIds,
        ...(resolvedNationalityId != null
          ? { nationality_id: resolvedNationalityId }
          : {}),
      };
      if (bookingData.selectedPackage) {
        reservationData.package_id = bookingData.selectedPackage.id;
        reservationData.sessions_count =
          bookingData.selectedPackage.sessions_count;
      }
      // Handle guest booking
      if (isGuest && guest) {
        reservationData.is_guest = true;
        reservationData.guest_info = {
          name: guest.name,
          email: guest.email,
          mobile: guest.phone,
          address: bookingData.selectedLocation?.address || "N/A",
          city: bookingData.selectedLocation?.city || "N/A",
          country: bookingData.selectedLocation?.country || "N/A",
          nationality: guest.nationality,
          ...(resolvedNationalityId != null
            ? {
                nationality_id: resolvedNationalityId,
                guest_nationality_id: resolvedNationalityId,
              }
            : {}),
          date_of_birth: guest.birthDate,
          gender: guest.gender,
          national_id: guest.idNumber?.trim() || "",
          blood_group: guest.bloodType || "",
          languages_spoken: "ar",
        };
        reservationData.address_city =
          bookingData.selectedLocation?.city || "N/A";
        reservationData.address_country =
          bookingData.selectedLocation?.country || "N/A";
        reservationData.address_state =
          bookingData.selectedLocation?.state || "N/A";
        reservationData.address_link =
          bookingData.selectedLocation?.link || "N/A";
      } else {
        // Handle registered user
        reservationData.client_id = bookingData.clientId;
        reservationData.address_id = bookingData.addressId;
        reservationData.patient_ids = bookingData.selectedPatients.map(
          (p) => p.id
        );
      }

      // Send request
      const response = bookingData.selectedPackage
        ? await ClientAPI.createReservationWithPackage(reservationData, locale)
        : await ClientAPI.createReservation(reservationData, locale);
      
      const created = response.data[0];
      setReservationId(created.id);
      persistReservationId(created.id);
      setBookingData((prev) => applyReservationPricingFromApi(prev, created));

      try {
        const summaryResponse = await ClientAPI.getPaymentSummary(created.id, locale);
        if (summaryResponse?.data) {
          setBookingData((prev) =>
            applyPaymentSummaryToBooking(
              prev,
              summaryResponse.data as PaymentSummaryData,
              prev.paymentMethod
            )
          );
        }
      } catch (summaryError) {
        console.error("Failed to load payment summary:", summaryError);
      }

      toast.success(t("messages.bookingCreated"));
      setCurrentStep(5);
    } catch (error: any) {
      console.error(error);
      setError(error.message || t("messages.error"));
      toast.error(t("messages.bookingFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const completePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!reservationId) {
        throw new Error(t("messages.reservationIdMissing"));
      }

      persistReservationId(reservationId);

      const summaryResponse = await ClientAPI.getPaymentSummary(
        reservationId,
        locale
      );
      if (summaryResponse?.data) {
        setBookingData((prev) =>
          applyPaymentSummaryToBooking(
            prev,
            summaryResponse.data as PaymentSummaryData,
            prev.paymentMethod
          )
        );
      }

      if (bookingData.paymentMethod === "cash") {
        const cashResponse = await ClientAPI.payReservationWithCash(
          reservationId,
          locale
        );
        setBookingData((prev) => ({
          ...prev,
          paymentMethod: "cash",
          paymentStatus: "cash_pending",
        }));
        clearCheckoutStorage();
        toast.success(
          extractApiMessage(cashResponse, t("messages.cashPendingConfirmed"))
        );
        setCurrentStep(6);
      } else {
        const telrResponse = await ClientAPI.payReservationWithTelr(
          reservationId,
          locale
        );
        const redirectUrl = extractTelrRedirectUrl(telrResponse);
        route.push(redirectUrl);
      }
    } catch (error: any) {
      console.error("Payment Error:", error);
      setError(error.message || t("messages.error"));
      toast.error(error.message || t("messages.paymentFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 2) {
      // نتخطّى validateStep لأن اختيار الطبيب تم داخل Step2
      setCurrentStep(3 as BookingStep);
      return;
    }
    if (currentStep === 4) {
      if (validateStep(currentStep)) {
        submitBooking(); // Submit reservation after Step 4
      }
    } else if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6) as BookingStep);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as BookingStep);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1SpecialtySelection
            categoriesData={categoriesData}
            servicesData={servicesData}
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            onNext={nextStep}
            showServiceSelection={SHOW_SERVICE_SELECTION_STEP}
          />
        );
      case 2:
        return (
          <Step2DoctorSelection
            doctorsData={{ data: filteredDoctors }}
            packagesData={packagesData}
            categoriesData={categoriesData}
            citiesData={citiesData}
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            onNext={nextStep}
            onPrev={prevStep}
            onOpenProfile={(doctor) => openModal("doctorProfile", doctor)}
            isLoading={isLoading || doctorsLoading}
            locale={locale}
            sortCityId={resolveCityIdForDoctorSort()}
          />
        );
      case 3:
        return (
          <Step3LocationTime
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            savedLocations={savedLocations}
            onNext={nextStep}
            onPrev={prevStep}
            onOpenLocationPicker={() => openModal("locationPicker")}
            onEditLocation={(location: Location) => {
              setEditingLocation(location);
              setModals((prev) => ({ ...prev, locationPicker: true }));
            }}
            onDeleteLocation={(id: number) => {
              const updated = savedLocations.filter((loc) => loc.id !== id);
              updateSavedLocations(updated);
            }}
          />
        );
      case 4:
        return (
          <Step4PatientInfo
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            savedPatients={savedPatients}
            updateSavedPatients={updateSavedPatients}
            onNext={nextStep}
            onPrev={prevStep}
            onOpenAddPatient={(patient?: Patient) => {
              setModals((prev) => ({ ...prev, addPatient: true }));
              setEditingPatient(patient || null);
            }}
          />
        );
      case 5:
        return (
          <Step5Payment
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            reservationId={reservationId}
            onNext={completePayment} // Call payment completion
            onPrev={prevStep}
            isLoading={isLoading}
          />
        );
      case 6:
        return (
          <Step6Confirmation
            bookingData={bookingData}
            reservationId={reservationId}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  return (
    <div
      className="main-container w-full mx-auto flex flex-col items-center relative my-0 px-2 sm:px-4 md:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="w-full h-[180px] sm:h-[200px] md:h-[247px] bg-[url(/assets/images/shared/booking-header.png)] bg-[length:100%_100%] bg-no-repeat absolute top-0 left-0 -z-10" />

      <div
        className="relative w-full max-w-[800px] mt-4 sm:mt-6 md:mt-8 px-2"
        data-tour="booking-stepper"
      >
        {/* Mobile: Compact step indicators */}
        <div className="flex sm:hidden justify-between items-center gap-1 w-full">
          {steps.map(({ step, active }, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  active
                    ? "bg-[#12b669] text-white shadow-md"
                    : "bg-white/90 text-gray-400"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-[10px] font-medium text-center leading-tight line-clamp-1 ${
                  active ? "text-[#12b669]" : "text-white/80"
                }`}
              >
                {step}
              </span>
              <div
                className={`h-1 w-full rounded-full ${
                  active ? "bg-[#12b669]" : "bg-white/30"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Tablet and Desktop: Full step indicators */}
        <div className="hidden sm:flex flex-wrap justify-center gap-2 md:gap-4">
          {steps.map(({ step, desc, active }, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1.5 md:gap-2 min-w-[80px] md:min-w-[110px] lg:min-w-[120px]"
            >
              <div
                className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all ${
                  active
                    ? "bg-[#12b669] text-white shadow-md"
                    : "bg-white text-gray-400"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-[10px] md:text-xs font-semibold text-center ${
                  active ? "text-[#12b669]" : "text-white"
                }`}
              >
                {step}
              </span>
              <span
                className={`text-[9px] md:text-xs text-center hidden md:block ${
                  active ? "text-[#12b669]" : "text-white/80"
                }`}
              >
                {desc}
              </span>
              <div
                className={`h-1 w-full rounded-full ${
                  active ? "bg-[#12b669]" : "bg-white/30"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-[1280px] mt-6 sm:mt-8 md:mt-10 px-1 sm:px-2 relative">
        {!tourActive && isBookingTourCompleted() && (
          <button
            type="button"
            onClick={() => setTourActive(true)}
            className="fixed bottom-5 end-5 z-[100] inline-flex items-center gap-2 rounded-full bg-[#143087] text-white shadow-[0_4px_20px_rgba(20,48,135,0.35)] ring-2 ring-white ps-4 pe-5 py-3 hover:bg-[#0f2470] hover:shadow-[0_6px_24px_rgba(20,48,135,0.45)] active:scale-[0.98] transition-all sm:bottom-8 sm:end-8"
            aria-label={t("tour.restart")}
          >
            <Compass className="h-5 w-5 shrink-0" aria-hidden />
            <span className="text-sm font-semibold whitespace-nowrap">
              {t("tour.restart")}
            </span>
          </button>
        )}
        {renderStepContent()}
      </div>

      <AddPatientModal
        isOpen={modals.addPatient}
        onClose={() => closeModal("addPatient")}
        onSave={savePatient}
        patient={editingPatient}
        nationalityOptions={nationalityOptions}
      />
      <LocationPickerModal
        isOpen={modals.locationPicker}
        onClose={() => closeModal("locationPicker")}
        onSave={saveLocation}
        savedLocations={savedLocations}
        updateSavedLocations={updateSavedLocations}
        countriesData={countriesData}
        statesData={statesData}
        initialLocation={editingLocation}
      />
      <SymptomsSearchModal
        isOpen={modals.symptomsSearch}
        onClose={() => closeModal("symptomsSearch")}
        onSelect={(symptoms) => {
          updateBookingData({ selectedSymptoms: symptoms });
          closeModal("symptomsSearch");
        }}
      />
      <DoctorProfileModal
        isOpen={modals.doctorProfile}
        onClose={() => closeModal("doctorProfile")}
        doctor={profileDoctor}
        updateBookingData={updateBookingData}
        onSelectDoctor={nextStep}
        locale={locale}
      />

      <BookingReservationTour
        active={tourActive}
        onClose={() => setTourActive(false)}
        currentBookingStep={currentStep}
        onBookingStepChange={(step) => setCurrentStep(step)}
      />
    </div>
  );
}
