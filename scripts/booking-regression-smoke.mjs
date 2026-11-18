/**
 * Lightweight booking helper regression checks (no browser / no payments).
 * Run: node scripts/booking-regression-smoke.mjs
 *
 * Mirrors critical pure logic from:
 * - src/lib/doctor-matches-category.ts
 * - src/lib/resolve-booking-specialty.ts (via localizedName rules)
 * - payment-summary nationality_fee → tax mapping
 */

function localizedName(name, locale) {
  if (typeof name === "string") return name;
  if (name && typeof name === "object") {
    return name[locale] || name.ar || name.en || "";
  }
  return "";
}

function doctorMatchesCategoryId(doc, categoryId) {
  const idStr = String(categoryId);
  if (
    Array.isArray(doc?.categories) &&
    doc.categories.some((c) => String(c?.id) === idStr)
  ) {
    return true;
  }
  if (
    Array.isArray(doc?.services) &&
    doc.services.some((s) => String(s?.category_id) === idStr)
  ) {
    return true;
  }
  return false;
}

const PLACEHOLDER_SPECIALIST = /^(doloremque|atque|lorem|ipsum|test)$/i;

function asDisplayName(value, locale) {
  if (typeof value === "string" && value.trim()) {
    return PLACEHOLDER_SPECIALIST.test(value.trim()) ? "" : value.trim();
  }
  return localizedName(value, locale).trim();
}

function resolveBookingSpecialtyLabel(
  bookingData,
  locale,
  fallback = "",
  categoryCatalog,
) {
  const selectedId = bookingData.selectedCategory?.id;
  if (selectedId != null && Array.isArray(categoryCatalog)) {
    const fromCatalog = categoryCatalog.find(
      (c) => Number(c.id) === Number(selectedId),
    );
    const catalogName = asDisplayName(fromCatalog?.name, locale);
    if (catalogName) return catalogName;
  }
  const fromCategory = asDisplayName(bookingData.selectedCategory?.name, locale);
  if (fromCategory) return fromCategory;
  const fromServiceCategory = asDisplayName(
    bookingData.selectedService?.category?.name,
    locale,
  );
  if (fromServiceCategory) return fromServiceCategory;
  const specialist = asDisplayName(bookingData.selectedDoctor?.specialist, locale);
  if (specialist) return specialist;
  return fallback;
}

function applyNationalityFeeToTax(prevPricing, nationalityFee) {
  const fee = Number(nationalityFee);
  return {
    ...prevPricing,
    tax: Number.isFinite(fee) ? fee : prevPricing.tax,
  };
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const doctor = {
  id: 1,
  categories: [{ id: 21, name: { ar: "العلاج الطبيعي العام", en: "General Physiotherapy" } }],
  specialist: "doloremque",
};
assert(doctorMatchesCategoryId(doctor, 21), "doctor should match category 21");
assert(!doctorMatchesCategoryId(doctor, 99), "doctor should not match category 99");

const booking = {
  selectedCategory: { id: 21, name: "العلاج الطبيعي العام" },
  selectedDoctor: doctor,
  selectedService: null,
};
const enCatalog = [
  { id: 21, name: { ar: "العلاج الطبيعي العام", en: "General Physiotherapy" } },
];
assert(
  resolveBookingSpecialtyLabel(booking, "en", "n/a", enCatalog) ===
    "General Physiotherapy",
  "locale catalog should win over stale AR string",
);
assert(
  resolveBookingSpecialtyLabel(booking, "ar", "n/a", enCatalog) ===
    "العلاج الطبيعي العام",
  "AR catalog name should resolve",
);
assert(
  resolveBookingSpecialtyLabel(
    { selectedCategory: null, selectedDoctor: doctor, selectedService: null },
    "ar",
    "fallback",
  ) === "fallback",
  "placeholder specialist should not display",
);

const priced = applyNationalityFeeToTax(
  { subTotal: 300, fees: 0, tax: 0, total: 300 },
  0,
);
assert(priced.tax === 0, "Saudi nationality_fee 0 maps to tax 0");
const pricedNonSaudi = applyNationalityFeeToTax(
  { subTotal: 300, fees: 0, tax: 0, total: 300 },
  45,
);
assert(pricedNonSaudi.tax === 45, "backend fee 45 maps to tax 45");

console.log("booking-regression-smoke: OK");
