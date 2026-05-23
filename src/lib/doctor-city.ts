import type { DoctorCity } from "@/types/doctors";

type DoctorWithCity = {
  city_id?: number | null;
  city?: DoctorCity | null;
  addresses?: Array<{ city?: string }>;
};

export function getDoctorCityName(
  doctor: DoctorWithCity,
  locale: string = "ar"
): string | null {
  const city = doctor.city;
  if (!city?.name) {
    const fromAddress = doctor.addresses?.find((a) => a?.city)?.city;
    return fromAddress ? String(fromAddress) : null;
  }
  if (typeof city.name === "string") return city.name;
  return locale === "ar" ? city.name.ar : city.name.en;
}

export function isDoctorInCity(
  doctor: DoctorWithCity,
  cityId?: number | null
): boolean {
  if (cityId == null || doctor.city_id == null) return false;
  return Number(doctor.city_id) === Number(cityId);
}
