"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CheckCircle, Loader2 } from "lucide-react";
import ClientAPI from "@/app/api/api";
import LocationPickerModal from "@/app/[locale]/(SharedLayout)/booking/_components/modals/location-picker-modal";
import OfferBookingForm, {
  type OfferGuestForm,
} from "@/components/offers/booking/OfferBookingForm";
import OfferPaymentPanel from "@/components/offers/booking/OfferPaymentPanel";
import OfferCountdown from "@/components/offers/OfferCountdown";
import OfferPriceBlock from "@/components/offers/OfferPriceBlock";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLocalStorage } from "@/Hooks/use-local-storage";
import { isClientApiError } from "@/lib/client-api-error";
import {
  addOneHour,
  buildOfferReservationPayload,
  checkoutStorageKey,
  combineDateAndTime,
  draftStorageKey,
  formatLocalDateTime,
  formatTimeLabel,
  guestFromPatient,
  parseDateKey,
  readJson,
  removeStorage,
  resolveDefaultAddress,
  serverClockOffset,
  timePeriodFromStart,
  toDateKey,
  validateOfferBooking,
  writeJson,
  type OfferBookingDraft,
  type OfferCheckoutState,
} from "@/lib/offer-booking";
import {
  formatOfferPrice,
  localePath,
  localizedName,
  OFFERS_WEBSITE_BASE_PATH,
  offerDisplayImage,
  offerHref,
  toNumber,
} from "@/lib/offers";
import { extractTelrRedirectUrl } from "@/lib/payment-api";
import {
  applyPaymentSummaryToBooking,
  extractApiMessage,
  type PaymentSummaryData,
} from "@/lib/payment-summary";
import { persistReservationId, clearCheckoutStorage } from "@/lib/checkout-storage";
import { applyReservationPricingFromApi } from "@/lib/reservation-pricing";
import { resolveNationalityId } from "@/lib/saudi-nationality";
import type { BookingData, Location, Patient } from "@/types/booking";
import type { OfferDetails } from "@/types/offers";

type Phase = "form" | "payment" | "done";

type OfferBookingClientProps = {
  offer: OfferDetails;
  locale: string;
  serverTime?: string;
  countriesData: unknown;
  statesData: unknown;
  nationalitiesData: unknown;
};

function emptyBookingData(offer: OfferDetails): BookingData {
  const price = toNumber(offer.price) ?? 0;
  return {
    selectedCategory: null,
    selectedPatients: [],
    selectedService: null,
    selectedSymptoms: [],
    selectedDoctor: null,
    selectedPackage: {
      id: offer.id,
      name: offer.name,
      description: offer.short_description || "",
      price: String(offer.price ?? ""),
      discount: String(offer.old_price ?? ""),
      type: "offer",
      sessions_count: toNumber(offer.sessions_count) ?? 1,
    },
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
    sessionsCount: toNumber(offer.sessions_count) ?? 1,
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
      subTotal: price,
      fees: 0,
      tax: 0,
      discount: 0,
      couponDiscount: 0,
      total: price,
    },
  };
}

function normalizeNationalities(
  raw: unknown,
  locale: string,
): { id: number; name: string }[] {
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as { data?: unknown })?.data)
      ? ((raw as { data: unknown[] }).data)
      : [];
  return list
    .map((item) => {
      const record = item as { id?: number; name?: unknown };
      return {
        id: Number(record.id),
        name: localizedName(record.name, locale),
      };
    })
    .filter((item) => item.id && item.name);
}

export default function  toOfferBookingClient({
  offer,
  locale,
  serverTime,
  countriesData,
  statesData,
  nationalitiesData,
}: OfferBookingClientProps) {
  const { t } = useTranslation("offers");
  const router = useRouter();
  const clockOffset = useMemo(
    () => serverClockOffset(serverTime),
    [serverTime],
  );
  const nationalityOptions = useMemo(
    () => normalizeNationalities(nationalitiesData, locale),
    [nationalitiesData, locale],
  );
  const [savedLocations, setSavedLocations] = useLocalStorage<Location[]>(
    "savedLocations",
    [],
  );
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [ended, setEnded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("form");
  const submittingRef = useRef(false);
  const [bookingData, setBookingData] = useState<BookingData>(() =>
    emptyBookingData(offer),
  );

  const [guest, setGuest] = useState<OfferGuestForm>({
    name: "",
    phone: "",
    email: "",
    nationality: "",
    nationalityId: undefined,
    gender: "male",
  });
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [draftReady, setDraftReady] = useState(false);

  const selectedAddress = useMemo(
    () =>
      savedLocations.find((location) => location.id === selectedAddressId) ??
      null,
    [savedLocations, selectedAddressId],
  );

  useEffect(() => {
    const storedLocations = readJson<Location[]>("savedLocations") || [];
    if (storedLocations.length) setSavedLocations(storedLocations);

    const storedPatients = readJson<Patient[]>("savedPatients") || [];
    const draft = readJson<OfferBookingDraft>(draftStorageKey(offer.id));
    const fromPatient = guestFromPatient(storedPatients[0]);
    if (draft || fromPatient.guest_name) {
      setGuest({
        name: draft?.guest_name || fromPatient.guest_name || "",
        phone: draft?.guest_phone || fromPatient.guest_phone || "",
        email: draft?.guest_email || fromPatient.guest_email || "",
        nationality:
          draft?.guest_nationality || fromPatient.guest_nationality || "",
        nationalityId:
          draft?.guest_nationality_id || fromPatient.guest_nationality_id,
        gender: draft?.guest_gender || fromPatient.guest_gender || "male",
      });
    }
    if (draft?.address_id) setSelectedAddressId(draft.address_id);
    if (draft?.selected_date) {
      const parsed = new Date(draft.selected_date);
      if (!Number.isNaN(parsed.getTime())) setDateKey(toDateKey(parsed));
    }
    if (draft?.start_time) {
      const parsed = new Date(draft.start_time);
      if (Number.isNaN(parsed.getTime())) {
        const match = draft.start_time.match(/(\d{2}:\d{2})/);
        if (match?.[1]) setTime(match[1]);
      } else {
        setTime(
          `${String(parsed.getHours()).padStart(2, "0")}:${String(parsed.getMinutes()).padStart(2, "0")}`,
        );
      }
    }
    if (draft?.notes) setNotes(draft.notes);

    const checkout = readJson<OfferCheckoutState>(checkoutStorageKey(offer.id));
    if (checkout?.reservationId) {
      setReservationId(checkout.reservationId);
      persistReservationId(checkout.reservationId);
      setPhase(checkout.phase);
    }
    setDraftReady(true);
    // Restore once per offer after mount so SSR does not wipe local drafts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offer.id]);

  useEffect(() => {
    if (selectedAddressId) return;
    const next = resolveDefaultAddress(savedLocations);
    if (next) setSelectedAddressId(next.id);
  }, [savedLocations, selectedAddressId]);

  useEffect(() => {
    if (!draftReady || phase !== "form") return;
    const start = dateKey && time ? combineDateAndTime(dateKey, time) : null;
    const end = start ? addOneHour(start) : null;
    const draft: OfferBookingDraft = {
      offer_id: offer.id,
      sessions_count: toNumber(offer.sessions_count) ?? 1,
      offer_name: offer.name,
      offer_price: toNumber(offer.price) ?? 0,
      currency: offer.currency || "SAR",
      address_id: selectedAddressId,
      selected_date: dateKey ? `${dateKey}T00:00:00.000` : null,
      start_time: start ? start.toISOString() : null,
      end_time: end ? end.toISOString() : null,
      notes,
      ends_at: offer.ends_at,
      guest_name: guest.name,
      guest_phone: guest.phone,
      guest_email: guest.email,
      guest_nationality: guest.nationality,
      guest_nationality_id: guest.nationalityId,
      guest_gender: guest.gender,
    };
    writeJson(draftStorageKey(offer.id), draft);
  }, [
    draftReady,
    phase,
    offer.id,
    offer.name,
    offer.price,
    offer.currency,
    offer.sessions_count,
    offer.ends_at,
    selectedAddressId,
    dateKey,
    time,
    notes,
    guest,
  ]);

  const persistCheckoutBooking = useCallback(
    (next: BookingData) => {
      if (typeof window === "undefined") return;
      window.localStorage.setItem("bookingData", JSON.stringify(next));
    },
    [],
  );

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

  const onEnded = useCallback((value: boolean) => setEnded(value), []);

  const validationMessage = (code: ReturnType<typeof validateOfferBooking>) => {
    if (!code) return "";
    return t(`booking.errors.${code}`);
  };

  const handleConfirm = async () => {
    if (submittingRef.current || ended) return;
    const nationalityId =
      guest.nationalityId ??
      resolveNationalityId(guest.nationality, nationalityOptions);
    const error = validateOfferBooking({
      name: guest.name,
      phone: guest.phone,
      nationality: guest.nationality,
      address: selectedAddress,
      dateKey,
      time,
      clockOffset,
    });
    if (error || !selectedAddress || !dateKey || !time) {
      toast.error(validationMessage(error));
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    try {
      const payload = buildOfferReservationPayload({
        offerId: offer.id,
        sessionsCount: toNumber(offer.sessions_count) ?? 1,
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
        },
      });
      const response = await ClientAPI.createReservationWithPackage(
        payload,
        locale,
      );
      const created = Array.isArray(response?.data)
        ? response.data[0]
        : response?.data;
      if (!created?.id) {
        throw new Error(t("booking.errors.createFailed"));
      }

      const start = combineDateAndTime(dateKey, time)!;
      const patient: Patient = {
        id: Date.now(),
        name: guest.name.trim(),
        birthDate: "",
        relationship: undefined,
        nationality: guest.nationality,
        nationality_id: nationalityId,
        idNumber: "",
        phone: guest.phone.trim(),
        email: guest.email.trim(),
        gender: guest.gender,
        bloodType: "",
      };
      const nextBooking = applyReservationPricingFromApi(
        {
          ...emptyBookingData(offer),
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
            ...emptyBookingData(offer).healthInfo,
            notes,
          },
          addressId: selectedAddress.id,
          paymentMethod: "telr",
        },
        created,
      );
      setBookingData(nextBooking);
      persistCheckoutBooking(nextBooking);
      setReservationId(created.id);
      persistReservationId(created.id);
      writeJson(checkoutStorageKey(offer.id), {
        reservationId: created.id,
        phase: "payment",
      } satisfies OfferCheckoutState);
      removeStorage(draftStorageKey(offer.id));

      try {
        const summaryResponse = await ClientAPI.getPaymentSummary(
          created.id,
          locale,
        );
        if (summaryResponse?.data) {
          const withSummary = applyPaymentSummaryToBooking(
            nextBooking,
            summaryResponse.data as PaymentSummaryData,
            nextBooking.paymentMethod,
          );
          setBookingData(withSummary);
          persistCheckoutBooking(withSummary);
        }
      } catch (summaryError) {
        console.error("Failed to load payment summary:", summaryError);
      }

      setPhase("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success(t("booking.created"));
    } catch (error: unknown) {
      if (isClientApiError(error) && error.isPackageOutOfStock()) {
        setOutOfStock(true);
        return;
      }
      const message =
        (isClientApiError(error) && error.message) ||
        (error instanceof Error ? error.message : t("booking.errors.createFailed"));
      toast.error(message);
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
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
        removeStorage(checkoutStorageKey(offer.id));
        clearCheckoutStorage();
        toast.success(
          extractApiMessage(cashResponse, t("booking.cashConfirmed")),
        );
        setPhase("done");
      } else {
        const telrResponse = await ClientAPI.payReservationWithTelr(
          reservationId,
          locale,
        );
        router.push(extractTelrRedirectUrl(telrResponse));
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : t("booking.errors.paymentFailed"),
      );
    } finally {
      setPaying(false);
    }
  };

  const detailsHref = offerHref(locale, offer.slug);
  const image = offerDisplayImage(offer);
  const sessions = toNumber(offer.sessions_count);
  const summaryChips = [
    selectedAddress
      ? selectedAddress.title || selectedAddress.city || selectedAddress.address
      : null,
    dateKey
      ? parseDateKey(dateKey)?.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-GB", {
          day: "numeric",
          month: "short",
        })
      : null,
    time ? formatTimeLabel(time, locale) : null,
  ].filter(Boolean) as string[];

  if (phase === "done") {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16 text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle className="size-10 text-emerald-600" />
        </div>
        <h1 className="mb-3 text-2xl font-bold text-[#143087]">
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
          className="inline-flex h-12 items-center rounded-xl bg-primary px-6 font-semibold text-white"
        >
          {t("booking.goHome")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1280px] px-4 pb-32 pt-4 sm:px-6 sm:pt-8 lg:px-8">
      <nav className="mb-5 text-sm text-[#4a5568]">
        <Link href={detailsHref} className="inline-flex items-center rounded-full bg-white px-3 py-1.5 shadow-sm hover:text-primary">
          ← {t("booking.backToOffer")}
        </Link>
      </nav>

      <section className="mb-5 overflow-hidden rounded-[28px] border border-[#e8eef8] bg-white shadow-[0_12px_40px_rgba(20,48,135,0.06)]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative min-h-[200px] bg-[#eef4ff] md:min-h-[260px]">
            {image ? (
              <Image
                src={image}
                alt={offer.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : null}
          </div>
          <div className="flex min-w-0 flex-col justify-center gap-3 p-5 sm:p-8">
            <p className="w-fit rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#143087]">
              {t("booking.fastCheckout")}
            </p>
            <h1 className="break-words text-2xl font-bold leading-tight text-[#1e1e1e] sm:text-3xl">
              {offer.name}
            </h1>
            {sessions ? (
              <p className="text-sm text-[#4a5568]">
                {t("sessions", { count: sessions })}
              </p>
            ) : null}
            <OfferPriceBlock
              price={offer.price}
              oldPrice={offer.old_price}
              savingsAmount={offer.savings_amount}
              currency={offer.currency}
              locale={locale}
              saveLabel={t("save")}
            />
            {offer.ends_at && serverTime ? (
              <OfferCountdown
                endsAt={offer.ends_at}
                serverTime={serverTime}
                label={(remaining) => t("endsIn", { time: remaining })}
                endedLabel={t("ended")}
                onEndedChange={onEnded}
              />
            ) : null}
          </div>
        </div>
      </section>

      {phase === "form" && summaryChips.length > 0 ? (
        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3">
          {summaryChips.map((chip) => (
            <span
              key={chip}
              className="truncate rounded-2xl bg-white px-4 py-2.5 text-center text-sm font-semibold text-[#143087] shadow-[0_8px_24px_rgba(20,48,135,0.05)]"
            >
              {chip}
            </span>
          ))}
        </div>
      ) : null}

      {phase === "form" ? (
        <OfferBookingForm
          locale={locale}
          guest={guest}
          onGuestChange={(updates) => setGuest((prev) => ({ ...prev, ...updates }))}
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
          }}
          time={time}
          onSelectTime={setTime}
          notes={notes}
          onNotesChange={setNotes}
          clockOffset={clockOffset}
          disabled={submitting}
        />
      ) : reservationId ? (
        <OfferPaymentPanel
          locale={locale}
          reservationId={reservationId}
          bookingData={bookingData}
          updateBookingData={updateBookingData}
          onPay={handlePay}
          isPaying={paying}
        />
      ) : null}

      {phase === "form" ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(16,24,40,0.08)] backdrop-blur">
          <div className="mx-auto flex w-full max-w-[1280px] items-center gap-3 lg:px-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-[#4a5568]">{offer.name}</p>
              <p className="font-bold text-[#143087]">
                {formatOfferPrice(offer.price, offer.currency, locale)}
              </p>
            </div>
            {ended ? (
              <span className="rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-[#4a5568]">
                {t("ended")}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={submitting}
                className="inline-flex h-12 min-w-[9rem] items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  t("booking.confirm")
                )}
              </button>
            )}
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

      <AlertDialog open={outOfStock}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("booking.outOfStockTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("booking.outOfStockBody")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Link href={localePath(locale, OFFERS_WEBSITE_BASE_PATH)}>
                {t("backToOffers")}
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
