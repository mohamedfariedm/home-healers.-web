export interface DoctorCity {
  id: number;
  name: string | {
    en: string;
    ar: string;
  };
}

export interface DoctorNationality {
  id: number;
  name: string | {
    en: string;
    ar: string;
  };
}

export interface DoctorOffer {
  id: number;
  name: string;
  description: string;
  price: string;
  discount: string;
  sessions_count: number;
  type: string;
  doctors: Array<{
    id: number;
    name: string;
  }>;
}

export interface Doctor {
  id: number;
  doctor_role: string;
  service?: any;
  offers: DoctorOffer[];
  session_price: number;
  name: string;
  email: string;
  nationality: DoctorNationality | null;
  rate?: number | null;
  national_id: string;
  country_code: string;
  mobile_number: string;
  date_of_birth: string;
  blood_group?: string | null;
  gender: string;
  status: boolean;
  degree: string;
  languages_spoken: string;
  classification: string;
  department: string;
  experience: number;
  medical_school: string;
  memberships?: string | null;
  specialized_in: string;
  awards?: string | null;
  certification?: string | null;
  upload_attachments?: string | null;
  medical_registration_number: string;
  medical_license_expiry: string;
  specialist: string;
  sub_specialist?: string | null;
  clinic_name: string;
  city_id?: number | null;
  city?: DoctorCity | null;
  from: string;
  to: string;
  addresses: any[];
  image?: any;
  created_at: string;
  updated_at: string;
}

export interface DoctorsSectionData {
  title?: string;
  Posts?: Array<{
    title: string;
  }>;
}
