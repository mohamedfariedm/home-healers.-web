"use client"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import type { BookingData, Location, Patient } from "@/types/booking"

// Import all step components
import Step1SpecialtySelection from "./steps/step1-specialty-selection"
import Step2DoctorSelection from "./steps/step2-doctor-selection"
import Step3LocationTime from "./steps/step3-location-time"
import Step4PatientInfo from "./steps/step4-patient-info"
import Step5Payment from "./steps/step5-payment"
import Step6Confirmation from "./steps/step6-confirmation"

// Import modals
import AddPatientModal from "./modals/add-patient-modal"
import LocationPickerModal from "./modals/location-picker-modal"
import SymptomsSearchModal from "./modals/symptoms-search-modal"
import DoctorProfileModal from "./modals/doctor-profile-modal"
import { useLocalStorage } from "@/Hooks/use-local-storage"

type BookingStep = 1 | 2 | 3 | 4 | 5 | 6

interface BookingFlowProps {
  doctorsData: any
  servicesData: any
  packagesData: any
  categoriesData: any
  countriesData: any
  statesData: any
}

export default function BookingFlow({
  doctorsData,
  servicesData,
  packagesData,
  categoriesData,
  countriesData,
  statesData,
}: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Store booking data in localStorage
  const [bookingData, setBookingData] = useLocalStorage<BookingData>("bookingData", {
    selectedCategory: null,
    selectedService: null,
    selectedSymptoms: [],
    selectedDoctor: null,
    selectedPackage: null,
    searchFilters: {
      city: "",
      district: "",
      specialty: "",
      experience: "",
      rating: 0,
      priceRange: [0, 1000],
    },
    selectedLocation: null,
    selectedDates: [],
    sessionsCount: 1,
    selectedPatient: null,
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
    paymentMethod: "apple_pay",
    couponCode: "",
    pricing: {
      subTotal: 0,
      fees: 50,
      tax: 0,
      discount: 0,
      total: 0,
    },
    clientId: 2, // This should come from auth
    addressId: 1,
  })

  // Store saved locations
  const [savedLocations, setSavedLocations] = useLocalStorage<Location[]>("savedLocations", [])

  // Store saved patients
  const [savedPatients, setSavedPatients] = useLocalStorage<Patient[]>("savedPatients", [])

  // Modal states
  const [modals, setModals] = useState({
    addPatient: false,
    locationPicker: false,
    symptomsSearch: false,
    doctorProfile: false,
  })

  // Filtered doctors based on search
  const [filteredDoctors, setFilteredDoctors] = useState(doctorsData?.data || [])

  const steps = [
    { step: "الخطوة الأولي", desc: "(اختيار التخصص)", active: currentStep >= 1 },
    { step: "الخطوة الثانية", desc: "(اختيار الطبيب)", active: currentStep >= 2 },
    { step: "الخطوة الثالثة", desc: "(الموقع والوقت)", active: currentStep >= 3 },
    { step: "الخطوة الرابعة", desc: "(بيانات المريض)", active: currentStep >= 4 },
    { step: "الخطوة الخامسة", desc: "(الدفع)", active: currentStep >= 5 },
    { step: "التأكيد", desc: "(تأكيد الحجز)", active: currentStep >= 6 },
  ]

  // Update pricing when booking data changes
  useEffect(() => {
    calculatePricing()
  }, [bookingData.selectedPackage, bookingData.sessionsCount, bookingData.couponCode])

  // Search doctors when filters change
  useEffect(() => {
    handleDoctorSearch()
  }, [bookingData.searchFilters])

  const calculatePricing = () => {
    let subTotal = 0

    if (bookingData.selectedPackage) {
      subTotal = Number.parseFloat(bookingData.selectedPackage.price)
    } else {
      subTotal = 300 * bookingData.sessionsCount // Base price per session
    }

    const fees = 50
    const tax = Math.round(subTotal * 0.15) // 15% VAT
    let discount = 0

    // Apply package discount
    if (bookingData.selectedPackage && bookingData.selectedPackage.discount) {
      discount += Number.parseFloat(bookingData.selectedPackage.discount)
    }

    // Apply coupon discount
    if (bookingData.couponCode === "SAVE20") {
      discount += Math.round(subTotal * 0.2) // 20% discount
    }

    const total = subTotal + fees + tax - discount

    setBookingData((prev) => ({
      ...prev,
      pricing: { subTotal, fees, tax, discount, total },
    }))
  }

  const handleDoctorSearch = async () => {
    // try {
    //   setIsLoading(true)
    //   const searchResults = await searchDoctors(bookingData.searchFilters)
    //   setFilteredDoctors(searchResults.data || doctorsData?.data || [])
    // } catch (error) {
    //   console.error("Search failed:", error)
    //   setFilteredDoctors(doctorsData?.data || [])
    // } finally {
    //   setIsLoading(false)
    // }
  }

  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...updates }))
  }

  const openModal = (modalName: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [modalName]: true }))
  }

  const closeModal = (modalName: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [modalName]: false }))
  }

  const saveLocation = (location: Location) => {
    const newLocation = { ...location, id: Date.now() }
    setSavedLocations((prev) => [...prev, newLocation])
    updateBookingData({ selectedLocation: newLocation })
    toast.success("تم حفظ الموقع بنجاح")
  }

  const savePatient = (patient: Patient) => {
    const newPatient = { ...patient, id: Date.now() }
    setSavedPatients((prev) => [...prev, newPatient])
    updateBookingData({
      selectedPatient: newPatient,
      patients: [...bookingData.patients, newPatient],
    })
    toast.success("تم إضافة المريض بنجاح")
    closeModal("addPatient")
  }

  const validateStep = (step: BookingStep): boolean => {
    switch (step) {
      case 1:
        if (!bookingData.selectedCategory && !bookingData.selectedService) {
          setError("يرجى اختيار التخصص أو الخدمة")
          return false
        }
        break
      case 2:
        if (!bookingData.selectedDoctor) {
          setError("يرجى اختيار الطبيب")
          return false
        }
        break
      case 3:
        if (!bookingData.selectedLocation) {
          setError("يرجى اختيار الموقع")
          return false
        }
        if (bookingData.selectedDates.length === 0) {
          setError("يرجى اختيار موعد واحد على الأقل")
          return false
        }
        break
      case 4:
        if (!bookingData.selectedPatient) {
          setError("يرجى اختيار أو إضافة مريض")
          return false
        }
        if (!bookingData.healthInfo.painLocation.trim()) {
          setError("يرجى تحديد مكان الألم أو المشكلة الصحية")
          return false
        }
        break
      case 5:
        if (!bookingData.paymentMethod) {
          setError("يرجى اختيار طريقة الدفع")
          return false
        }
        break
    }
    setError(null)
    return true
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6) as BookingStep)
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as BookingStep)
  }

  const submitBooking = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Prepare reservation data
      const reservationData = {
        client_id: bookingData.clientId,
        service_id: bookingData.selectedService?.id,
        category_id: bookingData.selectedCategory?.id,
        address_id: bookingData.addressId,
        doctor_id: bookingData.selectedDoctor!.id,
        package_id: bookingData.selectedPackage?.id,
        sessions_count: bookingData.sessionsCount,
        sub_total: bookingData.pricing.subTotal,
        fees: bookingData.pricing.fees,
        total_amount: bookingData.pricing.total,
        transaction_reference: `txn_${Date.now()}`,
        pain_location: bookingData.healthInfo.painLocation,
        notes: `${bookingData.healthInfo.symptoms}\n${bookingData.healthInfo.notes}`,
        dates: bookingData.selectedDates.map((date) => ({
          start_time: date.start_time,
          end_time: date.end_time,
          time_period: date.time_period,
        })),
      }

      // const response = await submitReservation(reservationData)

      // Clear booking data after successful submission
      localStorage.removeItem("bookingData")

      toast.success("تم تأكيد الحجز بنجاح!")
      setCurrentStep(6)
    } catch (error: any) {
      setError(error.message || "حدث خطأ أثناء تأكيد الحجز")
      toast.error("فشل في تأكيد الحجز")
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1SpecialtySelection
            categoriesData={categoriesData}
            servicesData={servicesData}
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            onNext={nextStep}
            onOpenSymptoms={() => openModal("symptomsSearch")}
          />
        )
      case 2:
        return (
          <Step2DoctorSelection
            doctorsData={{ data: filteredDoctors }}
            packagesData={packagesData}
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            onNext={nextStep}
            onPrev={prevStep}
            onOpenProfile={() => openModal("doctorProfile")}
            isLoading={isLoading}
          />
        )
      case 3:
        return (
          <Step3LocationTime
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            savedLocations={savedLocations}
            onNext={nextStep}
            onPrev={prevStep}
            onOpenLocationPicker={() => openModal("locationPicker")}
          />
        )
      case 4:
        return (
          <Step4PatientInfo
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            savedPatients={savedPatients}
            onNext={nextStep}
            onPrev={prevStep}
            onOpenAddPatient={() => openModal("addPatient")}
          />
        )
      case 5:
        return (
          <Step5Payment
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            onNext={submitBooking}
            onPrev={prevStep}
            isLoading={isLoading}
          />
        )
      case 6:
        return <Step6Confirmation bookingData={bookingData} />
      default:
        return null
    }
  }

  return (
    <div
      className="main-container w-full mx-auto flex flex-col items-center relative my-0 px-4 sm:px-6 lg:px-8"
      dir="rtl"
    >
      {/* Background Header */}
      <div className="w-full h-[247px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/dw6xSVLu5N.png)] bg-[length:100%_100%] bg-no-repeat absolute top-0 left-0 -z-10" />

      {/* Steps Progress */}
      <div className="relative w-full max-w-[800px] mt-8">
        <div className="flex flex-wrap justify-center gap-4">
          {steps.map(({ step, desc, active }, i) => (
            <div key={i} className="flex flex-col items-center gap-2 min-w-[120px]">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  active ? "bg-[#12b669] text-white" : "bg-white text-gray-400"
                }`}
              >
                {i + 1}
              </div>
              <span className={`text-xs font-semibold text-center ${active ? "text-[#12b669]" : "text-white"}`}>
                {step}
              </span>
              <span className={`text-xs text-center ${active ? "text-[#12b669]" : "text-white"}`}>{desc}</span>
              <div className={`h-1 w-full rounded-full ${active ? "bg-[#12b669]" : "bg-white/30"}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="w-full max-w-[1280px] mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      )}

      {/* Step Content */}
      <div className="w-full max-w-[1280px] mt-10">{renderStepContent()}</div>

      {/* Modals */}
      <AddPatientModal isOpen={modals.addPatient} onClose={() => closeModal("addPatient")} onSave={savePatient} />

      <LocationPickerModal
        isOpen={modals.locationPicker}
        onClose={() => closeModal("locationPicker")}
        onSave={saveLocation}
        savedLocations={savedLocations}
      />

      <SymptomsSearchModal
        isOpen={modals.symptomsSearch}
        onClose={() => closeModal("symptomsSearch")}
        onSelect={(symptoms) => {
          updateBookingData({ selectedSymptoms: symptoms })
          closeModal("symptomsSearch")
        }}
      />

      <DoctorProfileModal
        isOpen={modals.doctorProfile}
        onClose={() => closeModal("doctorProfile")}
        doctor={bookingData.selectedDoctor}
      />
    </div>
  )
}
