"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CheckCircle, Loader2, Tag } from "lucide-react";
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
  claimCheckoutStorageKey,
  clearPendingClaim,
  matchCouponInList,
  readPendingClaim,
  type ClaimCheckoutState,
  type PendingOfferClaim,
} from "@/lib/claim-offer";
import {
  addOneHour,
  combineDateAndTime,
  formatLocalDateTime,
  isSlotInPast,
  readJson,
  removeStorage,
  resolveDefaultAddress,
  timePeriodFromStart,
  validateOfferBooking,
  writeJson,
} from "@/lib/offer-booking";
import { doctorMatchesCategoryId } from "@/lib/doctor-matches-category";
import { formatDiscountDisplay } from "@/lib/offer-popup";
import { formatOfferPrice, localePath, localizedName } from "@/lib/offers";
import { extractTelrRedirectUrl } from "@/lib/payment-api";
import {
  applyPaymentSummaryToBooking,
  extractApiMessage,
  type PaymentSummaryData,
} from "@/lib/payment-summary";
import {
  clearCheckoutStorage,
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
    paymentMethod: "telr",
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
    const checkout = readJson<ClaimCheckoutState>(claimCheckoutStorageKey());
    setClaim(pending);

    if (pending) {
      setGuest((prev) => ({
        ...prev,
        name: pending.name || prev.name,
        phone: pending.mobile || prev.phone,
      }));
    }

    if (checkout?.reservationId) {
      setReservationId(checkout.reservationId);
      persistReservationId(checkout.reservationId);
      setPhase(checkout.phase);
      setBookingData((prev) => ({
        ...prev,
        couponCode:
          checkout.couponCode || pending?.couponCode || prev.couponCode,
        couponId:
          checkout.couponId ||
          pending?.couponId ||
          prev.couponId ||
          undefined,
      }));
      // Rehydrate full booking draft if still in localStorage from this claim.
      try {
        const stored = window.localStorage.getItem("bookingData");
        if (stored) {
          const parsed = JSON.parse(stored) as BookingData;
          if (parsed?.pricing) {
            setBookingData((prev) => ({
              ...prev,
              ...parsed,
              couponCode:
                checkout.couponCode ||
                pending?.couponCode ||
                parsed.couponCode ||
                prev.couponCode,
              couponId:
                checkout.couponId ||
                pending?.couponId ||
                parsed.couponId ||
                prev.couponId,
            }));
          }
        }
      } catch {
        // ignore
      }
    }
    setClaimReady(true);
  }, []);

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

  const resolveCouponId = async (): Promise<{
    id: string;
    code: string;
  } | null> => {
    if (!claim) return null;
    if (claim.couponId) {
      return { id: String(claim.couponId), code: claim.couponCode };
    }
    try {
      const response = await ClientAPI.getCoupons(locale, {
        code: claim.couponCode,
        limit: 20,
        page: 1,
      });
      const list = Array.isArray(response?.data) ? response.data : [];
      let matched = matchCouponInList(list, {
        code: claim.couponCode,
        couponId: claim.couponId,
      });
      if (!matched) {
        const searchResponse = await ClientAPI.getCoupons(locale, {
          name: claim.couponCode,
          limit: 20,
          page: 1,
        });
        const searchList = Array.isArray(searchResponse?.data)
          ? searchResponse.data
          : [];
        matched = matchCouponInList(searchList, {
          code: claim.couponCode,
          couponId: claim.couponId,
        });
      }
      return matched;
    } catch {
      return null;
    }
  };

  const handleConfirm = async () => {
    if (submittingRef.current || !claim) return;

    if (!selectedCategory) {
      toast.error(
        isAr ? "من فضلك اختر التخصص" : "Please select a specialty",
      );
      return;
    }
    if (!selectedDoctor) {
      toast.error(isAr ? "من فضلك اختر المعالج" : "Please select a doctor");
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
      toast.error(validationMessage(error));
      return;
    }

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

      const matchedCoupon = await resolveCouponId();
      if (!matchedCoupon?.id) {
        throw new Error(
          isAr
            ? "تعذر تطبيق كود الخصم"
            : "Could not apply the discount code",
        );
      }

      await ClientAPI.applyCouponOnReservation(
        {
          reservationId: created.id,
          coupon_id: matchedCoupon.id,
        },
        locale,
      );

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
          couponCode: matchedCoupon.code,
          couponId: matchedCoupon.id,
          paymentMethod: "telr",
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
        if (summaryResponse?.data) {
          nextBooking = applyPaymentSummaryToBooking(
            nextBooking,
            summaryResponse.data as PaymentSummaryData,
            nextBooking.paymentMethod,
          );
        }
      } catch (summaryError) {
        console.error("Failed to load payment summary:", summaryError);
      }

      setBookingData(nextBooking);
      persistCheckoutBooking(nextBooking);
      setReservationId(created.id);
      persistReservationId(created.id);
      writeJson(claimCheckoutStorageKey(), {
        reservationId: created.id,
        phase: "payment",
        couponCode: matchedCoupon.code,
        couponId: matchedCoupon.id,
      } satisfies ClaimCheckoutState);
      clearPendingClaim();

      trackEvent(GTM_EVENTS.RESERVATION_CREATED, {
        reservation_id: created.id,
        source: "claim_offer",
        coupon_code: matchedCoupon.code,
        popup_id: claim.popupId,
      });

      setPhase("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success(
        isAr
          ? "تم إنشاء الحجز وتطبيق الخصم"
          : "Booking created and discount applied",
      );
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

  const startHostedTelrPay = async () => {
    if (!reservationId) return;
    persistReservationId(reservationId);
    persistCheckoutBooking(bookingData);
    persistPendingPayment({
      reservationId,
      provider: "telr",
      method: "hpp",
    });
    const telrResponse = await ClientAPI.payReservationWithTelr(
      reservationId,
      locale,
    );
    trackEvent(GTM_EVENTS.RESERVATION_PAYMENT, {
      reservation_id: reservationId,
      payment_method: "telr",
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
        removeStorage(claimCheckoutStorageKey());
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
          {isAr ? "انتهى العرض أو غير متاح" : "Offer unavailable"}
        </h1>
        <p className="mb-8 text-[#4a5568]">
          {isAr
            ? "لم نجد عرضاً نشطاً. ارجع للرئيسية وحاول مرة أخرى من النافذة المنبثقة."
            : "We could not find an active claim. Go home and claim the offer from the popup again."}
        </p>
        <Link
          href={localePath(locale, "/")}
          className="inline-flex h-12 items-center rounded-xl bg-[#0d7377] px-6 font-semibold text-white"
        >
          {isAr ? "العودة للرئيسية" : "Go home"}
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
            {isAr ? "عرض خاص" : "Special offer"}
          </p>
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
            {claim?.offerTitle ||
              (isAr ? "أكمل حجزك بالخصم" : "Complete your discounted booking")}
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
                {isAr ? "كود الخصم" : "Coupon"}: {couponLabel}
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
            onSelectCategory={setSelectedCategoryId}
            onSelectDoctor={setSelectedDoctorId}
            disabled={submitting}
          />

          <OfferBookingForm
            locale={locale}
            guest={guest}
            onGuestChange={(updates) =>
              setGuest((prev) => ({ ...prev, ...updates }))
            }
            nationalityOptions={nationalityOptions}
            addresses={savedLocations}
            selectedAddressId={selectedAddressId}
            onSelectAddress={(location) => setSelectedAddressId(location.id)}
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
            }}
            time={time}
            onSelectTime={setTime}
            notes={notes}
            onNotesChange={setNotes}
            clockOffset={0}
            disabled={submitting}
          />
        </>
      ) : reservationId ? (
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
      ) : null}

      {phase === "form" ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(16,24,40,0.08)] backdrop-blur">
          <div className="mx-auto flex w-full max-w-[1280px] items-center gap-3 lg:px-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-[#4a5568]">
                {selectedDoctor?.name ||
                  (isAr ? "أكمل بياناتك" : "Complete your details")}
              </p>
              <p className="font-bold text-[#0d7377]">
                {selectedDoctor
                  ? formatOfferPrice(sessionPrice, "SAR", locale)
                  : couponLabel
                    ? `${isAr ? "كود" : "Code"}: ${couponLabel}`
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
              ) : isAr ? (
                "متابعة للدفع"
              ) : (
                "Continue to payment"
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
