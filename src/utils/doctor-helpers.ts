import type { Doctor, DoctorNationality } from "@/types/doctors";

export const getDoctorImage = (doctor: Doctor): string => {
    console.log("Doctor Image:", doctor);
    
  return doctor?.image?.[0]?.original || "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpngtree.com%2Ffree-png-vectors%2Fdoctor&psig=AOvVaw0GBbm-13F9GHjedbpp1sDP&ust=1754681016562000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCMjnsaq2-Y4DFQAAAAAdAAAAABAE";
};

export const getNationalityName = (
  nationality: DoctorNationality | null,
  locale: string
): string => {
  if (!nationality) return "N/A";
  
  if (typeof nationality.name === "string") {
    return nationality.name;
  }
  
  return locale === "ar" ? nationality.name.ar : nationality.name.en;
};

export const formatWorkingHours = (from: string, to: string, locale: string): string => {
  if (!from || !to) return locale === "ar" ? "غير محدد" : "Not specified";
  
  try {
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? (locale === "ar" ? "م" : "PM") : (locale === "ar" ? "ص" : "AM");
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    };
    
    return `${formatTime(from)} - ${formatTime(to)}`;
  } catch {
    return `${from} - ${to}`;
  }
};

export const formatDate = (dateString: string, locale: string): string => {
  if (!dateString) return locale === "ar" ? "غير محدد" : "Not specified";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US");
  } catch {
    return dateString;
  }
};

export const getExperienceText = (experience: number, locale: string): string => {
  if (!experience || experience <= 0) {
    return locale === "ar" ? "خبرة غير محددة" : "Experience not specified";
  }
  
  if (locale === "ar") {
    return experience === 1 ? "سنة واحدة خبرة" : `${experience} سنوات خبرة`;
  } else {
    return experience === 1 ? "1 year experience" : `${experience} years experience`;
  }
};

export const getDoctorRating = (doctor: Doctor): number => {
  return doctor.rate || 5.0; // Default to 5.0 if no rating
};
