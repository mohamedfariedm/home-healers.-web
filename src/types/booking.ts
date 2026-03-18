export interface Doctor {
  id: number
  name: string
  doctor_role: string
  email: string
  nationality: {
    id: number
    name: string
  }
  mobile_number: string
  gender: string
  degree: string
  department: string
  experience: number
  specialist: string
  sub_specialist: string
  clinic_name: string
  medical_school: string
  certification: string
  session_price: number
  medical_registration_number: string
  from: string
  to: string
  rate: number | null // Added from data
  national_id: string // Added from data
  country_code: string // Added from data
  date_of_birth: string // Added from data
  blood_group: string // Added from data
  status: boolean // Added from data
  languages_spoken: string // Added from data
  classification: string // Added from data
  medical_license_expiry: string // Added from data
  memberships: string // Added from data
  awards: string // Added from data
  upload_attachments: string // Added from data
  specialized_in: string // Added from data
  offers: Array<{
    id: number
    name: string
    description: string
    price: string
    discount: string
    sessions_count: number
    type: string
    doctors: Array<{
      id: number
      name: string
    }>
  }> // Added from data
  service: {
    id: number
    name: string
    description: string

    image: Array<{
      thumbnail: string
      original: string
      id: number
    }>
  } | null // Added from data
  addresses: Array<{
    city?: string
    district?: string
    address?: string
  }> // Added from data
  image?: Array<{
    thumbnail: string
    original: string
    id: number
  }>
  categories?: Array<{ // Added: categories that doctor belongs to
    id: number
    name: {
      en: string
      ar: string
    }
    image: any
    active: number
    created_at: string
    updated_at: string
    has_service: boolean
  }>
}

export interface Category {
  id: number
  name: string
  image: any
  services: Service[]
  has_service?: boolean // Added: indicates if category has services
}

export interface Service {
  id: number
  image: Array<{
    thumbnail: string
    original: string
    id: number
  }>
  icon?: Array<{
    thumbnail?: string
    original?: string
    id?: number
  }>
  name: string
  description: string
  category: {
    id: number
    name: string
  }
}

export interface Package {
  id: number
  name: string
  description: string
  price: string
  discount: string
  image?: any
  type: string
  sessions_count?: number // Added to align with offers
}

export interface Location {
  id: number;
  title: string;
  address: string;
  city: string;
  state?: string;       // new: administrative area / region
  country: string;
  latitude?: number;
  longitude?: number;
  link?: string;        // new: Google Maps link
}


export interface Patient {
  id: number
  name: string
  birthDate: string
  relationship: string | undefined
  nationality: string
  idNumber: string
  phone: string
  email: string
  gender: "male" | "female"
  bloodType: string
}

export interface BookingData {
  selectedCategory: Category | null
  selectedPatients: Patient[];
  selectedService: Service | null
  selectedSymptoms: string[]
  selectedDoctor: Doctor | null
  selectedPackage: Package | null
  searchFilters: {
    city: string
    district: string
    specialty: string
    experience: string
    rating: number
    priceRange: [number, number]
  }
  selectedLocation: Location | null
  selectedDates: Array<{
    date: string
    time: string
    start_time: string
    end_time: string
    time_period: "morning" | "afternoon" | "evening"
  }>
  sessionsCount: number
  patients: Patient[]
  healthInfo: {
    painLocation: string
    symptoms: string
    medicalHistory: string
    currentMedications: string
    allergies: string
    notes: string
    attachments: File[]
  }
  paymentMethod: string
  couponCode: string
  pricing: {
    subTotal: number
    fees: number
    tax: number
    discount: number
    total: number
  }
  clientId?: number
  addressId?: number
}

export interface ReservationRequest {
  client_id: number
  service_id?: number
  category_id?: number
  address_id: number
  doctor_id: number
  package_id?: number
  sessions_count: number
  sub_total: number
  fees: number
  total_amount: number
  transaction_reference: string
  pain_location: string
  notes: string
  dates: Array<{
    start_time: string
    end_time: string
    time_period: string
  }>
}