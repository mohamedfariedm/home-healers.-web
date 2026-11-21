"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Star,
} from "lucide-react";
import type { Category, Doctor } from "@/types/booking";
import { doctorMatchesCategoryId } from "@/lib/doctor-matches-category";
import { toSecureMediaUrl } from "@/lib/image-url";
import { formatOfferPrice, localizedName } from "@/lib/offers";
import { cn } from "@/lib/utils";

const DOCTORS_PER_PAGE = 6;

type ClaimSpecialtyDoctorPickerProps = {
  locale: string;
  categories: Category[];
  doctors: Doctor[];
  selectedCategoryId: number | null;
  selectedDoctorId: number | null;
  onSelectCategory: (id: number | null) => void;
  onSelectDoctor: (id: number | null) => void;
  disabled?: boolean;
  /** Highlights specialty/doctor when claim validation fails. */
  errorField?: "specialty" | "doctor" | string | null;
};

function categoryLabel(category: Category, locale: string) {
  return localizedName(category.name, locale) || String(category.name || "");
}

function categoryImage(category: Category): string | null {
  const image = Array.isArray(category.image) ? category.image[0] : category.image;
  const src =
    image?.original || image?.thumbnail || image?.converted || image?.url || "";
  return src ? toSecureMediaUrl(src) || null : null;
}

function doctorImage(doctor: Doctor): string {
  const image = Array.isArray(doctor.image) ? doctor.image[0] : null;
  const original = image?.original || image?.thumbnail;
  if (original) {
    const secure = toSecureMediaUrl(original);
    if (secure) return secure;
  }
  if (String(doctor.gender || "").toLowerCase() === "female") {
    return "/assets/images/doctorFemale.webp";
  }
  return "/assets/images/doctorMale.webp";
}

export default function ClaimSpecialtyDoctorPicker({
  locale,
  categories,
  doctors,
  selectedCategoryId,
  selectedDoctorId,
  onSelectCategory,
  onSelectDoctor,
  disabled = false,
  errorField = null,
}: ClaimSpecialtyDoctorPickerProps) {
  const { t } = useTranslation("offers");
  const isAr = locale === "ar";
  const [page, setPage] = useState(1);

  const filteredDoctors = useMemo(() => {
    if (!selectedCategoryId) return [];
    return doctors.filter((doc) =>
      doctorMatchesCategoryId(doc, selectedCategoryId),
    );
  }, [doctors, selectedCategoryId]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDoctors.length / DOCTORS_PER_PAGE),
  );

  useEffect(() => {
    setPage(1);
  }, [selectedCategoryId]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageDoctors = useMemo(() => {
    const start = (page - 1) * DOCTORS_PER_PAGE;
    return filteredDoctors.slice(start, start + DOCTORS_PER_PAGE);
  }, [filteredDoctors, page]);

  const selectedDoctor =
    filteredDoctors.find((d) => Number(d.id) === selectedDoctorId) ?? null;

  return (
    <section className="mb-5 overflow-hidden rounded-[28px] border border-[#d9ecee] bg-white shadow-[0_12px_40px_rgba(13,115,119,0.06)]">
      <div className="border-b border-[#e8f3f4] bg-[linear-gradient(180deg,#f3fbfb_0%,#ffffff_100%)] px-5 py-5 sm:px-6">
        <div className="mb-1 flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-2xl bg-[#0d7377]/10 text-[#0d7377]">
            <Stethoscope className="size-4" aria-hidden />
          </span>
          <h2 className="text-lg font-bold text-[#0d7377]">
            {t("claim.pickerTitle")}
          </h2>
        </div>
        <p className="text-sm text-[#5b6b7a]">{t("claim.pickerHint")}</p>
      </div>

      <div className="space-y-6 px-5 py-5 sm:px-6 sm:py-6">
        <div
          data-offer-field="specialty"
          className={cn(
            "scroll-mt-28 rounded-2xl",
            errorField === "specialty" && "ring-2 ring-red-400 ring-offset-2",
          )}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[#1e1e1e]">
              {t("claim.specialty")}
            </p>
            <span className="text-xs text-[#7a8899]">
              {t("claim.specialtyCount", { count: categories.length })}
            </span>
          </div>

          <div
            className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]"
            role="listbox"
            aria-label={t("claim.specialties")}
          >
            {categories.map((category) => {
              const active = Number(category.id) === selectedCategoryId;
              const image = categoryImage(category);
              const label = categoryLabel(category, locale);
              return (
                <button
                  key={category.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  disabled={disabled}
                  onClick={() => {
                    const nextId = Number(category.id);
                    onSelectCategory(active ? null : nextId);
                    if (!active) onSelectDoctor(null);
                  }}
                  className={cn(
                    "group flex min-w-[9.5rem] max-w-[11rem] shrink-0 flex-col items-start gap-2 rounded-2xl border px-3 py-3 text-start transition",
                    active
                      ? "border-[#0d7377] bg-[#0d7377] text-white shadow-[0_10px_24px_rgba(13,115,119,0.28)]"
                      : "border-[#e4ebf0] bg-[#f7fafb] text-[#1e1e1e] hover:border-[#0d7377]/35 hover:bg-white",
                  )}
                >
                  <span
                    className={cn(
                      "relative flex size-10 items-center justify-center overflow-hidden rounded-xl",
                      active ? "bg-white/15" : "bg-white",
                    )}
                  >
                    {image ? (
                      <Image
                        src={image}
                        alt=""
                        width={40}
                        height={40}
                        className="size-10 object-cover"
                      />
                    ) : (
                      <Stethoscope
                        className={cn(
                          "size-4",
                          active ? "text-white" : "text-[#0d7377]",
                        )}
                      />
                    )}
                  </span>
                  <span className="line-clamp-2 text-sm font-semibold leading-snug">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          data-offer-field="doctor"
          className={cn(
            "scroll-mt-28 rounded-2xl",
            errorField === "doctor" && "ring-2 ring-red-400 ring-offset-2",
          )}
        >
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#1e1e1e]">
                {t("claim.therapists")}
              </p>
              <p className="mt-0.5 text-xs text-[#7a8899]">
                {!selectedCategoryId
                  ? t("claim.pickSpecialtyFirst")
                  : t("claim.therapistCount", {
                      count: filteredDoctors.length,
                    })}
              </p>
            </div>
            {selectedDoctor ? (
              <span className="rounded-xl bg-[#e7f6f7] px-3 py-1.5 text-xs font-semibold text-[#0d7377]">
                {t("claim.selected")}: {selectedDoctor.name}
              </span>
            ) : null}
          </div>

          {!selectedCategoryId ? (
            <div className="rounded-2xl border border-dashed border-[#d7e4e8] bg-[#f8fbfc] px-4 py-10 text-center text-sm text-[#6b7c8a]">
              {t("claim.startWithSpecialty")}
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#d7e4e8] bg-[#f8fbfc] px-4 py-10 text-center text-sm text-[#6b7c8a]">
              {t("claim.noTherapists")}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {pageDoctors.map((doctor) => {
                  const active = Number(doctor.id) === selectedDoctorId;
                  const price = Number(doctor.session_price) || 0;
                  const specialty =
                    doctor.specialist || doctor.department || "";
                  const rating = Number(doctor.rate);
                  const experience = Number(doctor.experience);

                  return (
                    <button
                      key={doctor.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => onSelectDoctor(Number(doctor.id))}
                      className={cn(
                        "relative flex gap-3 rounded-2xl border p-3.5 text-start transition",
                        active
                          ? "border-[#0d7377] bg-[#eef9f9] shadow-[0_10px_28px_rgba(13,115,119,0.12)] ring-1 ring-[#0d7377]/20"
                          : "border-[#e5edf0] bg-white hover:border-[#0d7377]/35 hover:bg-[#f8fcfc]",
                      )}
                    >
                      {active ? (
                        <span className="absolute end-3 top-3 flex size-6 items-center justify-center rounded-full bg-[#0d7377] text-white">
                          <Check className="size-3.5" strokeWidth={3} />
                        </span>
                      ) : null}

                      <span className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-[#eef4f5]">
                        <Image
                          src={doctorImage(doctor)}
                          alt={doctor.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </span>

                      <span className="min-w-0 flex-1 pe-6">
                        <span className="block truncate text-sm font-bold text-[#1e1e1e]">
                          {doctor.name}
                        </span>
                        {specialty ? (
                          <span className="mt-0.5 block truncate text-xs text-[#6b7c8a]">
                            {specialty}
                          </span>
                        ) : null}

                        <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#5b6b7a]">
                          {Number.isFinite(rating) && rating > 0 ? (
                            <span className="inline-flex items-center gap-1">
                              <Star className="size-3 fill-amber-400 text-amber-400" />
                              {rating.toFixed(1)}
                            </span>
                          ) : null}
                          {Number.isFinite(experience) && experience > 0 ? (
                            <span>
                              {t("claim.yearsExp", { count: experience })}
                            </span>
                          ) : null}
                        </span>

                        {/* <span className="mt-2 block text-sm font-bold text-[#0d7377]">
                          {formatOfferPrice(price, "SAR", locale)}
                          <span className="ms-1 text-[11px] font-medium text-[#7a8899]">
                            {t("claim.perSession")}
                          </span>
                        </span> */}
                      </span>
                    </button>
                  );
                })}
              </div>

              {totalPages > 1 ? (
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#eef3f5] pt-4">
                  <p className="text-xs text-[#7a8899]">
                    {t("claim.pageOf", { page, total: totalPages })}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={disabled || page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="inline-flex size-10 items-center justify-center rounded-xl border border-[#e5edf0] bg-white text-[#0d7377] transition hover:border-[#0d7377]/40 disabled:opacity-35"
                      aria-label={t("claim.prev")}
                    >
                      <ChevronRight
                        className={cn(
                          "size-4",
                          isAr ? "" : "rotate-180",
                        )}
                      />
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => {
                          if (totalPages <= 5) return true;
                          return (
                            p === 1 ||
                            p === totalPages ||
                            Math.abs(p - page) <= 1
                          );
                        })
                        .map((p, index, arr) => {
                          const prev = arr[index - 1];
                          const showEllipsis = prev != null && p - prev > 1;
                          return (
                            <span key={p} className="contents">
                              {showEllipsis ? (
                                <span className="px-1 text-xs text-[#9aa8b5]">
                                  …
                                </span>
                              ) : null}
                              <button
                                type="button"
                                disabled={disabled}
                                onClick={() => setPage(p)}
                                className={cn(
                                  "inline-flex size-9 items-center justify-center rounded-xl text-xs font-semibold transition",
                                  p === page
                                    ? "bg-[#0d7377] text-white"
                                    : "bg-[#f4f8f9] text-[#4a5b68] hover:bg-[#e7f6f7]",
                                )}
                              >
                                {p}
                              </button>
                            </span>
                          );
                        })}
                    </div>
                    <button
                      type="button"
                      disabled={disabled || page >= totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      className="inline-flex size-10 items-center justify-center rounded-xl border border-[#e5edf0] bg-white text-[#0d7377] transition hover:border-[#0d7377]/40 disabled:opacity-35"
                      aria-label={t("claim.next")}
                    >
                      <ChevronLeft
                        className={cn(
                          "size-4",
                          isAr ? "" : "rotate-180",
                        )}
                      />
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
