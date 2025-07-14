export interface Doctor {
  id: number
  name: string
  doctor_role: string
  email: string
  nationality: {
    id: number
    name: {
      en: string
      ar: string
    }
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
  medical_registration_number: string
  from: string
  to: string
}

export interface Category {
  id: number
  name: {
    en: string
    ar: string
  }
  services: Service[]
}

export interface Service {
  id: number
  name: {
    en: string
    ar: string
  }
  description: {
    en: string
    ar: string
  }
  category: {
    id: number
    name: {
      en: string
      ar: string
    }
  }
}

export interface Package {
  id: number
  name: {
    en: string
    ar: string
  }
  description: {
    en: string
    ar: string
  }
  price: string
  discount: string
  type: string
}

export interface Location {
  id?: number
  title: string
  address: string
  latitude?: number
  longitude?: number
  city?: string
  district?: string
}

export interface Patient {
  id?: number
  name: string
  relationship: string
  nationality: string
  idNumber: string
  phone: string
  email: string
  gender: "male" | "female"
  birthDate: string
  bloodType: string
}

export interface BookingData {
  // Step 1: Specialty Selection
  selectedCategory: Category | null
  selectedService: Service | null
  selectedSymptoms: string[]

  // Step 2: Doctor Selection
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

  // Step 3: Location & Time
  selectedLocation: Location | null
  selectedDates: Array<{
    date: string
    time: string
    start_time: string
    end_time: string
    time_period: "morning" | "afternoon" | "evening"
  }>
  sessionsCount: number

  // Step 4: Patient Information
  selectedPatient: Patient | null
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

  // Step 5: Payment
  paymentMethod: string
  couponCode: string
  pricing: {
    subTotal: number
    fees: number
    tax: number
    discount: number
    total: number
  }

  // Additional fields
  clientId: number
  addressId: number
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
