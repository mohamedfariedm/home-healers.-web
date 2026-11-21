"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, Loader2, Tag } from "lucide-react";
import ClientAPI from "@/app/api/api";
import LocationPickerModal from "@/app/[locale]/(SharedLayout)/booking/_components/modals/location-picker-modal";
import OfferBookingForm, {
  type OfferGuestForm,
} from "@/components/offers/booking/OfferBookingForm";
import OfferPaymentPanel from "@/components/offers/booking/OfferPaymentPanel";
import ClaimSpecialtyDoctorPicker from "@/components/offers/claim/ClaimSpecialtyDoctorPicker";
import { useLocalStorage } from "@/Hooks/use-local-storage";
import { isClientApiError } from "@/lib/client-api-error";
import {
  buildClaimReservationPayload,
  clearAllClaimOfferStorage,
  clearClaimCheckout,
  clearClaimFormDraft,
  clearPendingClaim,
  matchCouponInList,
  readClaimCheckout,
  readClaimFormDraft,
  readPendingClaim,
  saveClaimCheckout,
  saveClaimFormDraft,
  savePendingClaim,
  type ClaimCheckoutState,
  type PendingOfferClaim,
} from "@/lib/claim-offer";
import {
  addOneHour,
  combineDateAndTime,
  formatLocalDateTime,
  isSlotInPast,
  offerBookingFieldForError,
  resolveDefaultAddress,
  scrollToOfferBookingError,
  timePeriodFromStart,
  validateOfferBooking,
  type OfferBookingFieldKey,
} from "@/lib/offer-booking";
import { doctorMatchesCategoryId } from "@/lib/doctor-matches-category";
import { formatDiscountDisplay } from "@/lib/offer-popup";
import { formatOfferPrice, localePath, localizedName } from "@/lib/offers";
import {
  extractTelrRedirectUrl,
  isReservationNotPayableError,
  reservationHasPayableClient,
} from "@/lib/payment-api";
import {
  applyPaymentSummaryToBooking,
  extractApiMessage,
  type PaymentSummaryData,
} from "@/lib/payment-summary";
import {
  clearCheckoutStorage,
  getPersistedReservationId,
  persistPendingPayment,
  persistReservationId,
} from "@/lib/checkout-storage";
import {
  mapTamaraStartError,
  startTamaraCheckoutRedirect,
  TamaraAlreadyPaidError,
} from "@/lib/tamara";
import { applyReservationPricingFromApi } from "@/lib/reservation-pricing";
import { GTM_EVENTS, trackEvent } from "@/lib/gtm";
import { resolveNationalityId } from "@/lib/saudi-nationality";
import type { BookingData, Category, Doctor, Location, Patient } from "@/types/booking";

type Phase = "form" | "payment" | "done";

type ClaimOfferClientProps = {
  locale: string;
  categoriesData: unknown;
  doctorsData: unknown;
  countriesData: unknown;
  statesData: unknown;
  nationalitiesData: unknown;
};

function emptyBookingData(): BookingData {
  return {
    selectedCategory: null,
    selectedPatients: [],
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
    paymentMethod: "card",
    couponCode: "",
    pricing: {
      subTotal: 0,
      fees: 0,
      tax: 0,
      discount: 0,
      couponDiscount: 0,
      total: 0,
    },
  };
}

function normalizeList(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray((raw as { data?: unknown })?.data)) {
    return (raw as { data: unknown[] }).data;
  }
  return [];
}

function normalizeNationalities(
  raw: unknown,
  locale: string,
): { id: number; name: string }[] {
  return normalizeList(raw)
    .map((item) => {
      const record = item as { id?: number; name?: unknown };
      return {
        id: Number(record.id),
        name: localizedName(record.name, locale),
      };
    })
    .filter((item) => item.id && item.name);
}

export default function ClaimOfferClient({
  locale,
  categoriesData,
  doctorsData,
  countriesData,
  statesData,
  nationalitiesData,
}: ClaimOfferClientProps) {
  const { t } = useTranslation(["offers", "booking"]);
  const router = useRouter();
  const isAr = locale === "ar";
  const nationalityOptions = useMemo(
    () => normalizeNationalities(nationalitiesData, locale),
    [nationalitiesData, locale],
  );
  const categories = useMemo(() => {
    return normalizeList(categoriesData)
      .map((item) => item as Category)
      .filter((c) => c?.id);
  }, [categoriesData]);
  const allDoctors = useMemo(() => {
    return normalizeList(doctorsData)
      .map((item) => item as Doctor)
      .filter((d) => d?.id);
  }, [doctorsData]);

  const [claim, setClaim] = useState<PendingOfferClaim | null>(null);
  const [claimReady, setClaimReady] = useState(false);
  const [savedLocations, setSavedLocations] = useLocalStorage<Location[]>(
    "savedLocations",
    [],
  );
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("form");
  const submittingRef = useRef(false);
  const [bookingData, setBookingData] = useState<BookingData>(() =>
    emptyBookingData(),
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [guest, setGuest] = useState<OfferGuestForm>({
    name: "",
    phone: "",
    email: "",
    nationality: "",
    nationalityId: undefined,
    gender: "male",
    birthDate: "",
  });
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [errorField, setErrorField] = useState<OfferBookingFieldKey | null>(
    null,
  );
  const shouldRetryCouponRef = useRef(false);

  const selectedCategory =
    categories.find((c) => Number(c.id) === selectedCategoryId) ?? null;
  const filteredDoctors = useMemo(() => {
    if (!selectedCategoryId) return [];
    return allDoctors.filter((doc) =>
      doctorMatchesCategoryId(doc, selectedCategoryId),
    );
  }, [allDoctors, selectedCategoryId]);
  const selectedDoctor =
    filteredDoctors.find((d) => Number(d.id) === selectedDoctorId) ?? null;
  const selectedAddress = useMemo(
    () =>
      savedLocations.find((location) => location.id === selectedAddressId) ??
      null,
    [savedLocations, selectedAddressId],
  );
  const sessionPrice = Number(selectedDoctor?.session_price) || 0;

  const discountDisplay = useMemo(() => {
    if (!claim?.discountType) return null;
    return formatDiscountDisplay(
      claim.discountType,
      claim.discountValue ?? null,
      isAr ? "ar" : "en",
    );
  }, [claim, isAr]);

  useEffect(() => {
    const pending = readPendingClaim();
    const draft = readClaimFormDraft();
    const checkout = readClaimCheckout();
    const persistedReservationId = getPersistedReservationId();

    const claimMeta: PendingOfferClaim | null =
      pending ||
      draft?.claim ||
      (checkout?.couponCode
        ? {
            popupId: checkout.popupId || "restored",
            couponCode: checkout.couponCode,
            couponId: checkout.couponId || null,
            name: "",
            mobile: "",
            locale,
            createdAt: checkout.updatedAt || Date.now(),
            discountType: checkout.discountType,
            discountValue: checkout.discountValue,
            offerTitle: checkout.offerTitle,
          }
        : null);

    setClaim(claimMeta);

    // Prefer payment restore so refresh after coupon stays on checkout.
    const paymentReservationId =
      checkout?.reservationId ||
      (checkout?.phase === "payment" ? persistedReservationId : null);

    if (paymentReservationId && (checkout?.phase === "payment" || checkout?.phase === "done")) {
      setReservationId(paymentReservationId);
      persistReservationId(paymentReservationId);
      setPhase(checkout?.phase || "payment");
      // Only auto-retry coupon after a refresh/restore, not right after first apply.
      shouldRetryCouponRef.current = checkout?.phase === "payment";
      setBookingData((prev) => {
        let next: BookingData = {
          ...prev,
          couponCode: checkout?.couponCode || prev.couponCode,
          couponId: checkout?.couponId || prev.couponId,
        };
        try {
          const stored = window.localStorage.getItem("bookingData");
          if (stored) {
            const parsed = JSON.parse(stored) as BookingData;
            if (parsed?.pricing) {
              next = {
                ...next,
                ...parsed,
                couponCode:
                  checkout?.couponCode ||
                  parsed.couponCode ||
                  next.couponCode,
                couponId:
                  checkout?.couponId || parsed.couponId || next.couponId,
              };
            }
          }
        } catch {
          // ignore
        }
        return next;
      });
      if (checkout?.guestEmail) {
        setGuest((prev) => ({
          ...prev,
          email: prev.email || checkout.guestEmail || "",
        }));
      }
      setClaimReady(true);
      return;
    }

    if (draft?.claim) {
      setGuest({
        name: draft.guest.name || claimMeta?.name || "",
        phone: draft.guest.phone || claimMeta?.mobile || "",
        email: draft.guest.email || "",
        nationality: draft.guest.nationality || "",
        nationalityId: draft.guest.nationalityId,
        gender: draft.guest.gender || "male",
        birthDate: draft.guest.birthDate || "",
      });
      setSelectedCategoryId(draft.selectedCategoryId);
      setSelectedDoctorId(draft.selectedDoctorId);
      setSelectedAddressId(draft.selectedAddressId);
      setDateKey(draft.dateKey);
      setTime(draft.time);
      setNotes(draft.notes || "");
      setPhase("form");
    } else if (claimMeta) {
      setGuest((prev) => ({
        ...prev,
        name: claimMeta.name || prev.name,
        phone: claimMeta.mobile || prev.phone,
      }));
    }

    setClaimReady(true);
  }, [locale]);

  // Persist in-progress form so refresh does not reset the claim cycle.
  useEffect(() => {
    if (!claimReady || phase !== "form" || !claim?.couponCode) return;
    saveClaimFormDraft({
      updatedAt: Date.now(),
      claim,
      guest,
      selectedCategoryId,
      selectedDoctorId,
      selectedAddressId,
      dateKey,
      time,
      notes,
    });
  }, [
    claimReady,
    phase,
    claim,
    guest,
    selectedCategoryId,
    selectedDoctorId,
    selectedAddressId,
    dateKey,
    time,
    notes,
  ]);

  // If payment was restored without a discount, retry coupon apply once.
  useEffect(() => {
    if (!claimReady || phase !== "payment" || !reservationId) return;
    if (!shouldRetryCouponRef.current) return;
    shouldRetryCouponRef.current = false;

    const code = bookingData.couponCode || claim?.couponCode;
    if (!code) return;
    if ((bookingData.pricing?.couponDiscount ?? 0) > 0) return;

    let cancelled = false;
    const retry = async () => {
      try {
        const matched = await applyClaimCoupon(reservationId, {
          couponCode: code,
          couponId: bookingData.couponId || claim?.couponId || null,
        });
        if (cancelled) return;

        const summaryResponse = await ClientAPI.getPaymentSummary(
          reservationId,
          locale,
        );
        if (cancelled || !summaryResponse?.data) return;

        setBookingData((prev) => {
          const withCoupon = {
            ...prev,
            couponCode: matched.code,
            couponId: matched.id,
          };
          const next = applyPaymentSummaryToBooking(
            withCoupon,
            summaryResponse.data as PaymentSummaryData,
            withCoupon.paymentMethod,
          );
          persistCheckoutBooking(next);
          return next;
        });
        saveClaimCheckout({
          reservationId,
          phase: "payment",
          couponCode: matched.code,
          couponId: matched.id,
          offerTitle: claim?.offerTitle,
          discountType: claim?.discountType,
          discountValue: claim?.discountValue,
          popupId: claim?.popupId,
          guestEmail: guest.email.trim() || undefined,
          updatedAt: Date.now(),
        });
        toast.success(t("claim.createdWithCoupon"));
      } catch (error) {
        if (cancelled) return;
        toast.error(
          (isClientApiError(error) && error.message) ||
            t("claim.errors.couponApplyFailed"),
        );
      }
    };

    void retry();
    return () => {
      cancelled = true;
    };
    // Run once after payment restore.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimReady, phase, reservationId]);

  useEffect(() => {
    if (selectedAddressId) return;
    const next = resolveDefaultAddress(savedLocations);
    if (next) setSelectedAddressId(next.id);
  }, [savedLocations, selectedAddressId]);

  useEffect(() => {
    if (!selectedCategoryId) {
      setSelectedDoctorId(null);
      return;
    }
    if (
      selectedDoctorId &&
      filteredDoctors.some((d) => Number(d.id) === selectedDoctorId)
    ) {
      return;
    }
    setSelectedDoctorId(
      filteredDoctors.length === 1 ? Number(filteredDoctors[0].id) : null,
    );
  }, [selectedCategoryId, filteredDoctors, selectedDoctorId]);

  const persistCheckoutBooking = useCallback((next: BookingData) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("bookingData", JSON.stringify(next));
  }, []);

  const updateBookingData = useCallback(
    (
      updates:
        | Partial<BookingData>
        | ((prev: BookingData) => Partial<BookingData>),
    ) => {
      setBookingData((prev) => {
        const patch = typeof updates === "function" ? updates(prev) : updates;
        const next = { ...prev, ...patch };
        persistCheckoutBooking(next);
        return next;
      });
    },
    [persistCheckoutBooking],
  );

  const saveLocation = (location: Location) => {
    const existingIndex = savedLocations.findIndex(
      (item) =>
        item.id === location.id ||
        (item.latitude === location.latitude &&
          item.longitude === location.longitude &&
          item.title === location.title),
    );
    const saved =
      existingIndex >= 0
        ? { ...savedLocations[existingIndex], ...location }
        : { ...location, id: location.id || Date.now() };
    const next =
      existingIndex >= 0
        ? savedLocations.map((item, index) =>
            index === existingIndex ? saved : item,
          )
        : [...savedLocations, saved];
    setSavedLocations(next);
    setSelectedAddressId(saved.id);
    setLocationPickerOpen(false);
    setEditingLocation(null);
    toast.success(t("booking.addressSaved"));
  };

  const validationMessage = (code: ReturnType<typeof validateOfferBooking>) => {
    if (!code) return "";
    return t(`booking.errors.${code}`);
  };

  const resolveCouponId = async (
    source?: Pick<PendingOfferClaim, "couponCode" | "couponId"> | null,
  ): Promise<{ id: string; code: string } | null> => {
    const target = source || claim;
    if (!target) return null;

    const code = String(target.couponCode || "").trim();
    const couponId = String(target.couponId || "").trim();
    if (!code && !couponId) return null;

    // Always resolve against the coupons API first (same approach as booking step 5).
    // Do not trust a stale/empty couponId from popup handoff alone.
    try {
      if (code) {
        const byCode = await ClientAPI.getCoupons(locale, {
          code,
          limit: 20,
          page: 1,
        });
        const codeList = Array.isArray(byCode?.data) ? byCode.data : [];
        const matchedByCode = matchCouponInList(codeList, { code, couponId });
        if (matchedByCode?.id) return matchedByCode;

        const byName = await ClientAPI.getCoupons(locale, {
          name: code,
          limit: 20,
          page: 1,
        });
        const nameList = Array.isArray(byName?.data) ? byName.data : [];
        const matchedByName = matchCouponInList(nameList, { code, couponId });
        if (matchedByName?.id) return matchedByName;
      }

      const all = await ClientAPI.getCoupons(locale, { limit: 50, page: 1 });
      const allList = Array.isArray(all?.data) ? all.data : [];
      const matchedAll = matchCouponInList(allList, { code, couponId });
      if (matchedAll?.id) return matchedAll;
    } catch {
      // Fall through to configured coupon id if API lookup fails for guests.
    }

    if (couponId) {
      return { id: couponId, code: code || couponId };
    }
    return null;
  };

  const applyClaimCoupon = async (
    reservationIdToUse: number,
    source?: Pick<PendingOfferClaim, "couponCode" | "couponId"> | null,
  ) => {
    const matchedCoupon = await resolveCouponId(source);
    if (!matchedCoupon?.id) {
      throw new Error(t("claim.errors.couponApplyFailed"));
    }
    await ClientAPI.applyCouponOnReservation(
      {
        reservationId: reservationIdToUse,
        coupon_id: String(matchedCoupon.id),
      },
      locale,
    );
    return matchedCoupon;
  };

  const handleConfirm = async () => {
    if (submittingRef.current || !claim) return;

    if (!selectedCategory) {
      setErrorField("specialty");
      toast.error(t("claim.errors.specialtyRequired"));
      scrollToOfferBookingError("specialty_required");
      return;
    }
    if (!selectedDoctor) {
      setErrorField("doctor");
      toast.error(t("claim.errors.doctorRequired"));
      scrollToOfferBookingError("doctor_required");
      return;
    }

    const nationalityId =
      guest.nationalityId ??
      resolveNationalityId(guest.nationality, nationalityOptions);
    const error = validateOfferBooking({
      name: guest.name,
      phone: guest.phone,
      nationality: guest.nationality,
      birthDate: guest.birthDate,
      requireBirthDate: true,
      address: selectedAddress,
      dateKey,
      time,
      clockOffset: 0,
    });
    if (error || !selectedAddress || !dateKey || !time) {
      const field = offerBookingFieldForError(error) ?? (
        !selectedAddress ? "address" : !dateKey ? "date" : "time"
      );
      setErrorField(field);
      toast.error(validationMessage(error));
      scrollToOfferBookingError(error ?? field);
      return;
    }
    setErrorField(null);

    submittingRef.current = true;
    setSubmitting(true);
    try {
      const payload = buildClaimReservationPayload({
        categoryId: Number(selectedCategory.id),
        doctorId: Number(selectedDoctor.id),
        sessionPrice,
        notes,
        dateKey,
        time,
        address: selectedAddress,
        guest: {
          name: guest.name,
          phone: guest.phone,
          email: guest.email,
          nationality: guest.nationality,
          nationalityId,
          gender: guest.gender,
          birthDate: guest.birthDate,
        },
      });

      const response = await ClientAPI.createReservation(payload, locale);
      const created = Array.isArray(response?.data)
        ? response.data[0]
        : response?.data;
      if (!created?.id) {
        throw new Error(t("booking.errors.createFailed"));
      }
      if (!reservationHasPayableClient(created)) {
        throw new Error(t("messages.reservationWithoutClient", { ns: "booking" }));
      }

      const start = combineDateAndTime(dateKey, time)!;
      const patient: Patient = {
        id: Date.now(),
        name: guest.name.trim(),
        birthDate: guest.birthDate.trim(),
        relationship: undefined,
        nationality: guest.nationality,
        nationality_id: nationalityId,
        idNumber: "",
        phone: guest.phone.trim(),
        email: guest.email.trim(),
        gender: guest.gender,
        bloodType: "",
      };

      // Persist reservation immediately so refresh can resume payment even if
      // coupon apply needs a retry.
      setReservationId(created.id);
      persistReservationId(created.id);
      saveClaimCheckout({
        reservationId: created.id,
        phase: "payment",
        couponCode: claim.couponCode,
        couponId: claim.couponId || undefined,
        offerTitle: claim.offerTitle,
        discountType: claim.discountType,
        discountValue: claim.discountValue,
        popupId: claim.popupId,
        guestEmail: guest.email.trim() || undefined,
        updatedAt: Date.now(),
      });

      const matchedCoupon = await applyClaimCoupon(created.id, claim);
      const appliedCouponCode = matchedCoupon.code;
      const appliedCouponId = matchedCoupon.id;

      let nextBooking = applyReservationPricingFromApi(
        {
          ...emptyBookingData(),
          selectedCategory,
          selectedDoctor,
          selectedLocation: selectedAddress,
          selectedDates: [
            {
              date: dateKey,
              time,
              start_time: formatLocalDateTime(start),
              end_time: formatLocalDateTime(addOneHour(start)),
              time_period: timePeriodFromStart(start),
            },
          ],
          selectedPatients: [patient],
          patients: [patient],
          healthInfo: {
            ...emptyBookingData().healthInfo,
            notes,
          },
          couponCode: appliedCouponCode,
          couponId: appliedCouponId,
          paymentMethod: "card",
          pricing: {
            subTotal: sessionPrice,
            fees: 0,
            tax: 0,
            discount: 0,
            couponDiscount: 0,
            total: sessionPrice,
          },
        },
        created,
      );

      try {
        const summaryResponse = await ClientAPI.getPaymentSummary(
          created.id,
          locale,
        );
        if (summaryResponse?.status === false || !summaryResponse?.data) {
          throw new Error(
            extractApiMessage(
              summaryResponse,
              t("messages.reservationWithoutClient", { ns: "booking" }),
            ),
          );
        }
        nextBooking = applyPaymentSummaryToBooking(
          nextBooking,
          summaryResponse.data as PaymentSummaryData,
          nextBooking.paymentMethod,
        );
      } catch (summaryError) {
        if (
          isReservationNotPayableError(summaryError) ||
          (isClientApiError(summaryError) &&
            (summaryError.status === 422 || summaryError.status === 404))
        ) {
          throw new Error(
            t("messages.reservationWithoutClient", { ns: "booking" }),
          );
        }
        console.error("Failed to load payment summary:", summaryError);
      }

      const checkoutState: ClaimCheckoutState = {
        reservationId: created.id,
        phase: "payment",
        couponCode: appliedCouponCode,
        couponId: appliedCouponId,
        offerTitle: claim.offerTitle,
        discountType: claim.discountType,
        discountValue: claim.discountValue,
        popupId: claim.popupId,
        guestEmail: guest.email.trim() || undefined,
        updatedAt: Date.now(),
      };

      // Keep form draft so the user can go back and edit details.
      saveClaimFormDraft({
        updatedAt: Date.now(),
        claim: {
          ...claim,
          couponCode: appliedCouponCode,
          couponId: appliedCouponId,
        },
        guest,
        selectedCategoryId,
        selectedDoctorId,
        selectedAddressId,
        dateKey,
        time,
        notes,
      });
      setBookingData(nextBooking);
      persistCheckoutBooking(nextBooking);
      saveClaimCheckout(checkoutState);
      clearPendingClaim();

      trackEvent(GTM_EVENTS.RESERVATION_CREATED, {
        reservation_id: created.id,
        source: "claim_offer",
        coupon_code: appliedCouponCode,
        popup_id: claim.popupId,
      });

      setPhase("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success(t("claim.createdWithCoupon"));
    } catch (error: unknown) {
      const message =
        (isClientApiError(error) && error.message) ||
        (error instanceof Error
          ? error.message
          : t("booking.errors.createFailed"));
      toast.error(message);
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const handleBackToEdit = () => {
    if (paying || submitting) return;

    const draft = readClaimFormDraft();
    const checkout = readClaimCheckout();
    const nextClaim =
      claim ||
      draft?.claim ||
      (bookingData.couponCode
        ? {
            popupId: checkout?.popupId || "restored",
            couponCode: bookingData.couponCode,
            couponId: bookingData.couponId || checkout?.couponId || null,
            name: guest.name,
            mobile: guest.phone,
            locale,
            createdAt: checkout?.updatedAt || Date.now(),
            discountType: checkout?.discountType,
            discountValue: checkout?.discountValue,
            offerTitle: checkout?.offerTitle,
          }
        : null);

    if (!nextClaim?.couponCode) {
      toast.error(t("claim.unavailableBody"));
      return;
    }

    const patient = bookingData.selectedPatients?.[0];
    const slot = bookingData.selectedDates?.[0];
    const nextGuest = draft?.guest
      ? {
          name: draft.guest.name || nextClaim.name || guest.name,
          phone: draft.guest.phone || nextClaim.mobile || guest.phone,
          email: draft.guest.email || guest.email,
          nationality: draft.guest.nationality || guest.nationality,
          nationalityId: draft.guest.nationalityId ?? guest.nationalityId,
          gender: draft.guest.gender || guest.gender,
          birthDate: draft.guest.birthDate || guest.birthDate,
        }
      : {
          name: patient?.name || guest.name || nextClaim.name,
          phone: patient?.phone || guest.phone || nextClaim.mobile,
          email: patient?.email || guest.email,
          nationality: patient?.nationality || guest.nationality,
          nationalityId: patient?.nationality_id ?? guest.nationalityId,
          gender: patient?.gender || guest.gender,
          birthDate: patient?.birthDate || guest.birthDate,
        };

    const nextCategoryId =
      draft?.selectedCategoryId ??
      (bookingData.selectedCategory?.id
        ? Number(bookingData.selectedCategory.id)
        : selectedCategoryId);
    const nextDoctorId =
      draft?.selectedDoctorId ??
      (bookingData.selectedDoctor?.id
        ? Number(bookingData.selectedDoctor.id)
        : selectedDoctorId);
    const nextAddressId =
      draft?.selectedAddressId ??
      (bookingData.selectedLocation?.id
        ? Number(bookingData.selectedLocation.id)
        : selectedAddressId);
    const nextDateKey = draft?.dateKey || slot?.date || dateKey;
    const nextTime = draft?.time || slot?.time || time;
    const nextNotes = draft?.notes || bookingData.healthInfo?.notes || notes;

    // Unlock payment restore on refresh; user is editing again.
    clearClaimCheckout();
    setReservationId(null);
    shouldRetryCouponRef.current = false;
    setClaim(nextClaim);
    setGuest(nextGuest);
    setSelectedCategoryId(nextCategoryId);
    setSelectedDoctorId(nextDoctorId);
    setSelectedAddressId(nextAddressId);
    setDateKey(nextDateKey);
    setTime(nextTime);
    setNotes(nextNotes);
    savePendingClaim(nextClaim);
    saveClaimFormDraft({
      updatedAt: Date.now(),
      claim: nextClaim,
      guest: nextGuest,
      selectedCategoryId: nextCategoryId,
      selectedDoctorId: nextDoctorId,
      selectedAddressId: nextAddressId,
      dateKey: nextDateKey,
      time: nextTime,
      notes: nextNotes,
    });

    setPhase("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startHostedTelrPay = async () => {
    if (!reservationId) return;
    const isApplePay = bookingData.paymentMethod === "apple_pay";
    persistReservationId(reservationId);
    persistCheckoutBooking(bookingData);
    persistPendingPayment({
      reservationId,
      provider: "telr",
      method: isApplePay ? "apple_pay" : "hpp",
    });
    const telrResponse = await ClientAPI.payReservationWithTelr(
      reservationId,
      locale,
    );
    trackEvent(GTM_EVENTS.RESERVATION_PAYMENT, {
      reservation_id: reservationId,
      payment_method: isApplePay ? "apple_pay" : "telr",
      source: "claim_offer",
      checkout: "hosted",
    });
    router.push(extractTelrRedirectUrl(telrResponse));
  };

  const startTamaraPay = async () => {
    if (!reservationId) return;
    persistReservationId(reservationId);
    persistCheckoutBooking(bookingData);
    try {
      trackEvent(GTM_EVENTS.RESERVATION_PAYMENT, {
        reservation_id: reservationId,
        payment_method: "tamara",
        source: "claim_offer",
        checkout: "tamara",
      });
      await startTamaraCheckoutRedirect({
        reservationId,
        locale,
        customerEmail: guest.email.trim() || undefined,
      });
    } catch (error: unknown) {
      if (error instanceof TamaraAlreadyPaidError) {
        router.push(
          `/${locale}/success/${encodeURIComponent(String(reservationId))}`,
        );
        return;
      }
      throw new Error(
        mapTamaraStartError(error, {
          alreadyPaid: t("tamara.alreadyPaid", { ns: "booking" }),
          inProgress: t("tamara.paymentInProgress", { ns: "booking" }),
          rejected:
            (isClientApiError(error) && error.message) ||
            t("tamara.rejected", { ns: "booking" }),
          unavailable: t("tamara.unavailable", { ns: "booking" }),
          fallback: t("messages.paymentFailed", { ns: "booking" }),
        }),
      );
    }
  };

  const handleSeamlessPaid = (meta: {
    paymentId?: string | null;
    reservationId: number;
  }) => {
    trackEvent(GTM_EVENTS.RESERVATION_PAYMENT, {
      reservation_id: meta.reservationId,
      payment_method: "telr",
      source: "claim_offer",
      checkout: "seamless",
    });
    const ref = meta.paymentId || String(meta.reservationId);
    router.push(`/${locale}/success/${encodeURIComponent(ref)}`);
  };

  const handlePay = async () => {
    if (!reservationId) return;
    setPaying(true);
    try {
      persistReservationId(reservationId);
      persistCheckoutBooking(bookingData);
      if (bookingData.paymentMethod === "cash") {
        const cashResponse = await ClientAPI.payReservationWithCash(
          reservationId,
          locale,
        );
        updateBookingData({
          paymentMethod: "cash",
          paymentStatus: "cash_pending",
        });
        clearAllClaimOfferStorage();
        clearCheckoutStorage();
        trackEvent(GTM_EVENTS.RESERVATION_PAYMENT, {
          reservation_id: reservationId,
          payment_method: "cash",
          source: "claim_offer",
        });
        toast.success(
          extractApiMessage(cashResponse, t("booking.cashConfirmed")),
        );
        setPhase("done");
        saveClaimCheckout({
          reservationId,
          phase: "done",
          couponCode: bookingData.couponCode,
          couponId: bookingData.couponId,
          offerTitle: claim?.offerTitle,
          discountType: claim?.discountType,
          discountValue: claim?.discountValue,
          popupId: claim?.popupId,
          updatedAt: Date.now(),
        });
      } else if (bookingData.paymentMethod === "tamara") {
        await startTamaraPay();
      } else {
        await startHostedTelrPay();
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : t("booking.errors.paymentFailed"),
      );
    } finally {
      setPaying(false);
    }
  };

  if (!claimReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#0d7377]" />
      </div>
    );
  }

  if (!claim && phase === "form" && !reservationId) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16 text-center">
        <h1 className="mb-3 text-2xl font-bold text-[#0d7377]">
          {t("claim.unavailableTitle")}
        </h1>
        <p className="mb-8 text-[#4a5568]">{t("claim.unavailableBody")}</p>
        <Link
          href={localePath(locale, "/")}
          className="inline-flex h-12 items-center rounded-xl bg-[#0d7377] px-6 font-semibold text-white"
        >
          {t("booking.goHome")}
        </Link>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16 text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle className="size-10 text-emerald-600" />
        </div>
        <h1 className="mb-3 text-2xl font-bold text-[#0d7377]">
          {t("booking.confirmedTitle")}
        </h1>
        <p className="mb-6 text-[#4a5568]">{t("booking.confirmedBody")}</p>
        {reservationId ? (
          <p className="mb-8 font-semibold text-[#1e1e1e]">
            {t("booking.reservationNumber")}: HH-{reservationId}
          </p>
        ) : null}
        <Link
          href={localePath(locale, "/")}
          className="inline-flex h-12 items-center rounded-xl bg-[#0d7377] px-6 font-semibold text-white"
        >
          {t("booking.goHome")}
        </Link>
      </div>
    );
  }

  const couponLabel = claim?.couponCode || bookingData.couponCode;

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1280px] px-4 pb-32 pt-4 sm:px-6 sm:pt-8 lg:px-8">
      <section className="mb-5 overflow-hidden rounded-[28px] border border-[#d7ecee] bg-white shadow-[0_12px_40px_rgba(13,115,119,0.08)]">
        <div className="bg-gradient-to-br from-[#0d7377] to-[#14919b] px-5 py-6 text-white sm:px-8">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            <Tag className="size-3.5" />
            {t("claim.badge")}
          </p>
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
            {claim?.offerTitle || t("claim.defaultTitle")}
          </h1>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            {discountDisplay ? (
              <div>
                <p className="text-sm opacity-90">{discountDisplay.label}</p>
                <p className="text-4xl font-bold tracking-tight">
                  {discountDisplay.big}
                </p>
              </div>
            ) : null}
            {couponLabel ? (
              <span className="rounded-xl bg-white/15 px-3 py-2 text-sm font-semibold">
                {t("claim.couponLabel")}: {couponLabel}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      {phase === "form" ? (
        <>
          <ClaimSpecialtyDoctorPicker
            locale={locale}
            categories={categories}
            doctors={allDoctors}
            selectedCategoryId={selectedCategoryId}
            selectedDoctorId={selectedDoctorId}
            onSelectCategory={(id) => {
              setSelectedCategoryId(id);
              setErrorField((prev) =>
                prev === "specialty" || prev === "doctor" ? null : prev,
              );
            }}
            onSelectDoctor={(id) => {
              setSelectedDoctorId(id);
              setErrorField((prev) => (prev === "doctor" ? null : prev));
            }}
            disabled={submitting}
            errorField={errorField}
          />

          <OfferBookingForm
            locale={locale}
            guest={guest}
            onGuestChange={(updates) => {
              setGuest((prev) => ({ ...prev, ...updates }));
              setErrorField((prev) => {
                if (!prev) return prev;
                if (prev === "name" && "name" in updates) return null;
                if (prev === "phone" && "phone" in updates) return null;
                if (
                  prev === "nationality" &&
                  ("nationality" in updates || "nationalityId" in updates)
                ) {
                  return null;
                }
                if (prev === "birthDate" && "birthDate" in updates) return null;
                return prev;
              });
            }}
            nationalityOptions={nationalityOptions}
            addresses={savedLocations}
            selectedAddressId={selectedAddressId}
            onSelectAddress={(location) => {
              setSelectedAddressId(location.id);
              setErrorField((prev) => (prev === "address" ? null : prev));
            }}
            onAddAddress={() => {
              setEditingLocation(null);
              setLocationPickerOpen(true);
            }}
            dateKey={dateKey}
            onSelectDate={(nextDate) => {
              setDateKey(nextDate);
              setTime((prev) =>
                prev && isSlotInPast(nextDate, prev, 0) ? null : prev,
              );
              setErrorField((prev) => (prev === "date" ? null : prev));
            }}
            time={time}
            onSelectTime={(nextTime) => {
              setTime(nextTime);
              setErrorField((prev) => (prev === "time" ? null : prev));
            }}
            notes={notes}
            onNotesChange={setNotes}
            clockOffset={0}
            disabled={submitting}
            errorField={errorField}
          />
        </>
      ) : reservationId ? (
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleBackToEdit}
            disabled={paying}
            className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-[#0d7377] shadow-sm ring-1 ring-[#d7ecee] transition hover:bg-[#f3fbfb] disabled:opacity-50"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
            {t("claim.backToEdit")}
          </button>
          <OfferPaymentPanel
            locale={locale}
            reservationId={reservationId}
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            onPay={handlePay}
            isPaying={paying}
            customerEmail={guest.email.trim() || null}
            onHostedTelrPay={async () => {
              setPaying(true);
              try {
                await startHostedTelrPay();
              } catch (error: unknown) {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : t("booking.errors.paymentFailed"),
                );
              } finally {
                setPaying(false);
              }
            }}
            onTamaraPay={async () => {
              setPaying(true);
              try {
                await startTamaraPay();
              } catch (error: unknown) {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : t("booking.errors.paymentFailed"),
                );
              } finally {
                setPaying(false);
              }
            }}
            onSeamlessPaid={handleSeamlessPaid}
          />
        </div>
      ) : null}

      {phase === "form" ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(16,24,40,0.08)] backdrop-blur">
          <div className="mx-auto flex w-full max-w-[1280px] items-center gap-3 lg:px-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-[#4a5568]">
                {selectedDoctor?.name || t("claim.completeDetails")}
              </p>
              <p className="font-bold text-[#0d7377]">
                {selectedDoctor
                  ? formatOfferPrice(sessionPrice, "SAR", locale)
                  : couponLabel
                    ? `${t("claim.codeShort")}: ${couponLabel}`
                    : "—"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={submitting}
              className="inline-flex h-12 min-w-[9rem] items-center justify-center rounded-xl bg-[#0d7377] px-5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                t("claim.continueToPayment")
              )}
            </button>
          </div>
        </div>
      ) : null}

      <LocationPickerModal
        isOpen={locationPickerOpen}
        onClose={() => {
          setLocationPickerOpen(false);
          setEditingLocation(null);
        }}
        onSave={saveLocation}
        savedLocations={savedLocations}
        updateSavedLocations={setSavedLocations}
        countriesData={countriesData}
        statesData={statesData}
        initialLocation={editingLocation}
      />
    </div>
  );
}
