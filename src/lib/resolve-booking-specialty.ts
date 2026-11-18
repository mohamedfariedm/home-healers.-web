import { localizedName } from "@/lib/offers";
import type { BookingData, Category } from "@/types/booking";

/** Latin placeholder strings sometimes present on seeded doctor.specialist values. */
const PLACEHOLDER_SPECIALIST = /^(doloremque|atque|lorem|ipsum|test)$/i;

function asDisplayName(value: unknown, locale: string): string {
  if (typeof value === "string" && value.trim()) {
    return PLACEHOLDER_SPECIALIST.test(value.trim()) ? "" : value.trim();
  }
  const localized = localizedName(value, locale);
  return localized.trim();
}

/**
 * Prefer the specialty the user selected in the booking flow.
 * When a category catalog for the active locale is provided, resolve by ID
 * so locale switches do not keep a stale language-specific name string.
 * Fall back to the matching doctor category name, then a non-placeholder
 * specialist / role string from the doctor record.
 */
export function resolveBookingSpecialtyLabel(
  bookingData: Pick<
    BookingData,
    "selectedCategory" | "selectedDoctor" | "selectedService"
  >,
  locale: string,
  fallback = "",
  categoryCatalog?: Category[] | null,
): string {
  const selectedId = bookingData.selectedCategory?.id;

  if (selectedId != null && Array.isArray(categoryCatalog)) {
    const fromCatalog = categoryCatalog.find(
      (c) => Number(c.id) === Number(selectedId),
    );
    const catalogName = asDisplayName(fromCatalog?.name, locale);
    if (catalogName) return catalogName;
  }

  const fromCategory = asDisplayName(
    bookingData.selectedCategory?.name,
    locale,
  );
  if (fromCategory) return fromCategory;

  const fromServiceCategory = asDisplayName(
    bookingData.selectedService?.category?.name,
    locale,
  );
  if (fromServiceCategory) return fromServiceCategory;

  const doctor = bookingData.selectedDoctor as
    | (BookingData["selectedDoctor"] & {
        categories?: Category[];
        specialist?: string;
        doctor_role?: string;
        department?: string;
      })
    | null
    | undefined;

  const categories = doctor?.categories;
  if (Array.isArray(categories) && categories.length > 0) {
    const matched =
      selectedId != null
        ? categories.find((c) => Number(c.id) === Number(selectedId))
        : undefined;
    const fromDoctorCat = asDisplayName(
      (matched ?? categories[0])?.name,
      locale,
    );
    if (fromDoctorCat) return fromDoctorCat;
  }

  const fromSpecialist = asDisplayName(doctor?.specialist, locale);
  if (fromSpecialist) return fromSpecialist;

  const fromRole = asDisplayName(doctor?.doctor_role, locale);
  if (fromRole) return fromRole;

  const fromDept = asDisplayName(doctor?.department, locale);
  if (fromDept) return fromDept;

  return fallback;
}
