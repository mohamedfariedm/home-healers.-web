"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { MapPin, Calendar, Clock, StickyNote, User, Plus, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Location } from "@/types/booking";
import {
  NOTE_TAGS,
  NOTES_MAX_LENGTH,
  OFFER_TIME_SLOTS,
  addDays,
  formatDayLabel,
  formatTimeLabel,
  isSlotInPast,
  startOfLocalDay,
  toDateKey,
  toggleNoteTag,
} from "@/lib/offer-booking";
import { cn } from "@/lib/utils";

export type OfferGuestForm = {
  name: string;
  phone: string;
  email: string;
  nationality: string;
  nationalityId?: number;
  gender: "male" | "female";
};

type OfferBookingFormProps = {
  locale: string;
  guest: OfferGuestForm;
  onGuestChange: (updates: Partial<OfferGuestForm>) => void;
  nationalityOptions: { id: number; name: string }[];
  addresses: Location[];
  selectedAddressId?: number | null;
  onSelectAddress: (location: Location) => void;
  onAddAddress: () => void;
  dateKey: string | null;
  onSelectDate: (dateKey: string) => void;
  time: string | null;
  onSelectTime: (time: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  clockOffset: number;
  disabled?: boolean;
};

const fieldClass =
  "h-12 w-full rounded-2xl border border-[#e4ebf7] bg-[#f8faff] px-4 text-base font-normal text-[#1e1e1e] outline-none transition-colors placeholder:text-[#9aa7c2] focus:border-[#143087] focus:bg-white focus:ring-2 focus:ring-[#143087]/15";

function SectionCard({
  icon: Icon,
  title,
  extra,
  children,
  className,
}: {
  icon: LucideIcon;
  title: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "flex min-h-full min-w-0 flex-col rounded-[28px] border border-[#e8eef8] bg-white p-5 shadow-[0_12px_40px_rgba(20,48,135,0.06)] sm:p-6",
        className,
      )}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-3 text-lg font-bold text-[#143087]">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#143087]">
            <Icon className="size-5" aria-hidden />
          </span>
          {title}
        </h2>
        {extra}
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
    </section>
  );
}

function ChoiceTile({
  active,
  disabled,
  children,
  onClick,
  className,
}: {
  active?: boolean;
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex min-h-[4.75rem] w-full flex-col items-start justify-center rounded-2xl border px-4 py-3 text-start transition-all",
        active
          ? "border-[#143087] bg-[#143087] text-white shadow-md shadow-[#143087]/20"
          : "border-[#e4ebf7] bg-[#f8faff] text-[#1e1e1e] hover:border-[#143087]/40 hover:bg-white",
        disabled && "cursor-not-allowed opacity-40 hover:border-[#e4ebf7] hover:bg-[#f8faff]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export default function OfferBookingForm({
  locale,
  guest,
  onGuestChange,
  nationalityOptions,
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddAddress,
  dateKey,
  onSelectDate,
  time,
  onSelectTime,
  notes,
  onNotesChange,
  clockOffset,
  disabled = false,
}: OfferBookingFormProps) {
  const { t } = useTranslation("offers");
  const today = startOfLocalDay(new Date());
  const dateOptions = [0, 1, 2].map((offset) => {
    const date = addDays(today, offset);
    return { key: toDateKey(date), date, offset };
  });
  const maxDate = toDateKey(addDays(today, 365));
  const minDate = toDateKey(today);
  const isPresetDate = dateOptions.some((option) => option.key === dateKey);
  const isPresetTime = time
    ? OFFER_TIME_SLOTS.includes(time as (typeof OFFER_TIME_SLOTS)[number])
    : false;

  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:gap-6",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      <SectionCard icon={User} title={t("booking.patient")}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-[#1e1e1e]">
            {t("booking.name")}
            <input
              value={guest.name}
              onChange={(event) => onGuestChange({ name: event.target.value })}
              placeholder={t("booking.namePlaceholder")}
              className={fieldClass}
              autoComplete="name"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-[#1e1e1e]">
            {t("booking.phone")}
            <input
              value={guest.phone}
              onChange={(event) => onGuestChange({ phone: event.target.value })}
              placeholder={t("booking.phonePlaceholder")}
              className={fieldClass}
              inputMode="tel"
              autoComplete="tel"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-[#1e1e1e] sm:col-span-2">
            {t("booking.nationality")}
            <select
              value={guest.nationalityId != null ? String(guest.nationalityId) : ""}
              onChange={(event) => {
                const selected = nationalityOptions.find(
                  (item) => String(item.id) === event.target.value,
                );
                onGuestChange({
                  nationalityId: selected?.id,
                  nationality: selected?.name ?? "",
                });
              }}
              className={fieldClass}
            >
              <option value="">{t("booking.nationalityPlaceholder")}</option>
              {nationalityOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-sm font-medium text-[#1e1e1e]">{t("booking.gender")}</span>
            <div className="grid grid-cols-2 gap-3">
              <ChoiceTile
                active={guest.gender === "male"}
                onClick={() => onGuestChange({ gender: "male" })}
                className="min-h-[3.5rem] items-center"
              >
                <span className="w-full text-center text-sm font-semibold">
                  {t("booking.male")}
                </span>
              </ChoiceTile>
              <ChoiceTile
                active={guest.gender === "female"}
                onClick={() => onGuestChange({ gender: "female" })}
                className="min-h-[3.5rem] items-center"
              >
                <span className="w-full text-center text-sm font-semibold">
                  {t("booking.female")}
                </span>
              </ChoiceTile>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        icon={MapPin}
        title={t("booking.address")}
        extra={
          addresses.length > 0 ? (
            <button
              type="button"
              onClick={onAddAddress}
              className="inline-flex items-center gap-1 rounded-full bg-[#eef4ff] px-3 py-1.5 text-sm font-semibold text-[#143087] hover:bg-[#dbe7ff]"
            >
              <Plus className="size-4" aria-hidden />
              {t("booking.addAddress")}
            </button>
          ) : null
        }
      >
        {addresses.length === 0 ? (
          <button
            type="button"
            onClick={onAddAddress}
            className="flex min-h-[10rem] flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#c9d8f5] bg-[#f8faff] px-4 py-8 text-center transition-colors hover:border-[#143087] hover:bg-white"
          >
            <span className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-white text-[#143087] shadow-sm">
              <Plus className="size-5" aria-hidden />
            </span>
            <p className="text-sm font-semibold text-[#143087]">{t("booking.addAddress")}</p>
            <p className="mt-1 text-sm text-[#4a5568]">{t("booking.noAddresses")}</p>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {addresses.map((location) => {
              const active = location.id === selectedAddressId;
              return (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => onSelectAddress(location)}
                  className={cn(
                    "flex min-h-[7.5rem] w-full flex-col rounded-2xl border p-4 text-start transition-all",
                    active
                      ? "border-[#143087] bg-[#143087] text-white shadow-md shadow-[#143087]/20"
                      : "border-[#e4ebf7] bg-[#f8faff] text-[#1e1e1e] hover:border-[#143087]/40 hover:bg-white",
                  )}
                >
                  <p className="flex items-center gap-1.5 font-semibold">
                    {location.title || location.address}
                    {addresses[0]?.id === location.id ? (
                      <Star
                        className={cn(
                          "size-3.5",
                          active ? "fill-amber-300 text-amber-300" : "fill-amber-400 text-amber-400",
                        )}
                        aria-hidden
                      />
                    ) : null}
                  </p>
                  <p
                    className={cn(
                      "mt-2 line-clamp-2 text-sm",
                      active ? "text-white/80" : "text-[#4a5568]",
                    )}
                  >
                    {[location.address, location.city, location.country]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard icon={Calendar} title={t("booking.date")}>
        <div className="grid grid-cols-2 gap-3">
          {dateOptions.map((option) => (
            <ChoiceTile
              key={option.key}
              active={dateKey === option.key}
              onClick={() => onSelectDate(option.key)}
            >
              <span className={cn("text-xs font-medium", dateKey === option.key ? "text-white/80" : "text-[#4a5568]")}>
                {option.offset === 0
                  ? t("booking.today")
                  : option.offset === 1
                    ? t("booking.tomorrow")
                    : t("booking.dayAfter")}
              </span>
              <span className="mt-1 text-base font-bold">
                {formatDayLabel(option.date, locale)}
              </span>
            </ChoiceTile>
          ))}
          <label
            className={cn(
              "flex min-h-[4.75rem] w-full cursor-pointer flex-col items-start justify-center rounded-2xl border px-4 py-3",
              dateKey && !isPresetDate
                ? "border-[#143087] bg-[#143087] text-white shadow-md shadow-[#143087]/20"
                : "border-[#e4ebf7] bg-[#f8faff] text-[#1e1e1e]",
            )}
          >
            <span className={cn("text-xs font-medium", dateKey && !isPresetDate ? "text-white/80" : "text-[#4a5568]")}>
              {t("booking.customDate")}
            </span>
            <input
              type="date"
              min={minDate}
              max={maxDate}
              value={dateKey && !isPresetDate ? dateKey : ""}
              onChange={(event) => {
                if (event.target.value) onSelectDate(event.target.value);
              }}
              className="mt-1 w-full bg-transparent text-sm font-semibold outline-none [color-scheme:inherit]"
            />
          </label>
        </div>
      </SectionCard>

      <SectionCard icon={Clock} title={t("booking.time")}>
        <div className="grid grid-cols-2 gap-3">
          {OFFER_TIME_SLOTS.map((slot) => {
            const past = Boolean(dateKey && isSlotInPast(dateKey, slot, clockOffset));
            return (
              <ChoiceTile
                key={slot}
                active={time === slot}
                disabled={past}
                onClick={() => onSelectTime(slot)}
                className="min-h-[3.75rem] items-center"
              >
                <span className="w-full text-center text-base font-bold">
                  {formatTimeLabel(slot, locale)}
                </span>
              </ChoiceTile>
            );
          })}
          <label
            className={cn(
              "flex min-h-[3.75rem] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border px-4 py-3",
              time && !isPresetTime
                ? "border-[#143087] bg-[#143087] text-white shadow-md shadow-[#143087]/20"
                : "border-[#e4ebf7] bg-[#f8faff] text-[#1e1e1e]",
            )}
          >
            <span className={cn("text-xs font-medium", time && !isPresetTime ? "text-white/80" : "text-[#4a5568]")}>
              {t("booking.customTime")}
            </span>
            <input
              type="time"
              value={time && !isPresetTime ? time : ""}
              onChange={(event) => {
                if (event.target.value) onSelectTime(event.target.value);
              }}
              className="mt-0.5 w-full bg-transparent text-center text-sm font-bold outline-none [color-scheme:inherit]"
            />
          </label>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-[#4a5568]">
          {t("booking.sessionLength")}
        </p>
      </SectionCard>

      <SectionCard
        icon={StickyNote}
        title={
          <span className="flex flex-wrap items-baseline gap-2">
            {t("booking.notes")}
            <span className="text-sm font-normal text-[#4a5568]">
              {t("booking.optional")}
            </span>
          </span>
        }
        className="md:col-span-2"
      >
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {NOTE_TAGS.map((tag) => {
            const label = locale === "ar" ? tag.ar : tag.en;
            const active = notes
              .split(/\r?\n/)
              .map((line) => line.trim())
              .includes(label);
            return (
              <ChoiceTile
                key={tag.en}
                active={active}
                onClick={() => onNotesChange(toggleNoteTag(notes, label))}
                className="min-h-[3.5rem] items-center"
              >
                <span className="w-full text-center text-sm font-semibold">{label}</span>
              </ChoiceTile>
            );
          })}
        </div>
        <textarea
          value={notes}
          maxLength={NOTES_MAX_LENGTH}
          onChange={(event) =>
            onNotesChange(event.target.value.slice(0, NOTES_MAX_LENGTH))
          }
          placeholder={t("booking.notesPlaceholder")}
          rows={4}
          className="w-full rounded-2xl border border-[#e4ebf7] bg-[#f8faff] px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#9aa7c2] focus:border-[#143087] focus:bg-white focus:ring-2 focus:ring-[#143087]/15"
        />
        <p className="mt-2 text-end text-xs text-[#4a5568]">
          {notes.length}/{NOTES_MAX_LENGTH}
        </p>
      </SectionCard>
    </div>
  );
}
