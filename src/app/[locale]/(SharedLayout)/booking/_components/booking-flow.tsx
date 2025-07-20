"use client"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import type { BookingData, Location, Patient, Doctor } from "@/types/booking"

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
import ClientAPI from "@/app/api/api"
import { useRouter } from "next/navigation"

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
  const [profileDoctor, setProfileDoctor] = useState<Doctor | null>(null)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [reservationId, setReservationId] = useState<number | null>(null) // Store reservation ID
 let route=useRouter()
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
    selectedPatients: [],
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
  })

  const [savedLocations, setSavedLocations] = useLocalStorage<Location[]>("savedLocations", [])
  const [savedPatients, setSavedPatients] = useLocalStorage<Patient[]>("savedPatients", [])
  const [modals, setModals] = useState({
    addPatient: false,
    locationPicker: false,
    symptomsSearch: false,
    doctorProfile: false,
  })
  const [filteredDoctors, setFilteredDoctors] = useState(doctorsData?.data || [])

  const steps = [
    { step: "الخطوة الأولى", desc: "(اختيار التخصص)", active: currentStep >= 1 },
    { step: "الخطوة الثانية", desc: "(اختيار الطبيب)", active: currentStep >= 2 },
    { step: "الخطوة الثالثة", desc: "(الموقع والوقت)", active: currentStep >= 3 },
    { step: "الخطوة الرابعة", desc: "(بيانات المريض)", active: currentStep >= 4 },
    { step: "الخطوة الخامسة", desc: "(الدفع)", active: currentStep >= 5 },
    { step: "التأكيد", desc: "(تأكيد الحجز)", active: currentStep >= 6 },
  ]

  useEffect(() => {
    calculatePricing()
  }, [bookingData.selectedPackage, bookingData.sessionsCount, bookingData.couponCode])

  useEffect(() => {
    handleDoctorSearch()
  }, [bookingData.searchFilters])

  const calculatePricing = () => {
    let subTotal = 0

    if (bookingData.selectedPackage) {
      subTotal = Number.parseFloat(bookingData.selectedPackage.price)
    } else {
      subTotal = 300 * bookingData.sessionsCount
    }

    const fees = 50
    const tax = Math.round(subTotal * 0.15)
    let discount = 0

    if (bookingData.selectedPackage && bookingData.selectedPackage.discount) {
      discount += Number.parseFloat(bookingData.selectedPackage.discount)
    }

    if (bookingData.couponCode === "SAVE20") {
      discount += Math.round(subTotal * 0.2)
    }

    const total = subTotal + fees + tax - discount

    setBookingData((prev) => ({
      ...prev,
      pricing: { subTotal, fees, tax, discount, total },
    }))
  }

  const handleDoctorSearch = async () => {
    setFilteredDoctors(doctorsData?.data || [])
  }

  const updateBookingData = (updates: Partial<BookingData>) => {
    console.log("Updating booking data:", updates)
    setBookingData((prev) => ({ ...prev, ...updates }))
  }

  const openModal = (modalName: keyof typeof modals, doctor?: Doctor) => {
    setModals((prev) => ({ ...prev, [modalName]: true }))
    if (modalName === "doctorProfile" && doctor) {
      setProfileDoctor(doctor)
    }
  }

  const closeModal = (modalName: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [modalName]: false }))
    if (modalName === "doctorProfile") {
      setProfileDoctor(null)
    }
    if (modalName === "addPatient") {
      setEditingPatient(null)
    }
  }

  const saveLocation = (location: Location) => {
    console.log("Saving location:", location)
    const newLocation = { ...location, id: location.id || Date.now() }
    setSavedLocations((prev) => [...prev, newLocation])
    updateBookingData({ selectedLocation: newLocation })
    toast.success("تم حفظ الموقع بنجاح")
  }

  const updateSavedLocations = (locations: Location[]) => {
    setSavedLocations(locations)
    //@ts-ignore
    if (bookingData.selectedLocation && !locations.some((loc) => loc.id === bookingData.selectedLocation.id)) {
      updateBookingData({ selectedLocation: null })
    }
  }

  const savePatient = (patient: Patient, isEditing: boolean = false) => {
    console.log(isEditing ? "Updating patient:" : "Saving patient:", patient)
    if (isEditing) {
      const updatedPatients = savedPatients.map((p) => (p.id === patient.id ? patient : p))
      setSavedPatients(updatedPatients)
      updateBookingData({
        selectedPatients: bookingData.selectedPatients.map((p) => (p.id === patient.id ? patient : p)),
        patients: bookingData.patients.map((p) => (p.id === patient.id ? patient : p)),
      })
      toast.success("تم تعديل المريض بنجاح")
    } else {
      const newPatient = { ...patient, id: patient.id || Date.now() }
      setSavedPatients((prev) => [...prev, newPatient])
      updateBookingData({
        patients: [...bookingData.patients, newPatient],
      })
      toast.success("تم إضافة المريض بنجاح")
    }
    closeModal("addPatient")
  }

  const updateSavedPatients = (patients: Patient[]) => {
    setSavedPatients(patients)
    updateBookingData({
      selectedPatients: bookingData.selectedPatients.filter((p) => patients.some((sp) => sp.id === p.id)),
      patients: bookingData.patients.filter((p) => patients.some((sp) => sp.id === p.id)),
    })
  }

  const validateStep = (step: BookingStep): boolean => {
    switch (step) {
      case 1:
        if (!bookingData.selectedCategory && !bookingData.selectedService) {
          setError("يرجى اختيار التخصص أو الخدمة")
          toast.error("يرجى اختيار التخصص أو الخدمة")
          return false
        }
        break
      case 2:
        if (!bookingData.selectedDoctor) {
          setError("يرجى اختيار الطبيب")
          toast.error("يرجى اختيار الطبيب")
          return false
        }
        break
      case 3:
        if (!bookingData.selectedLocation) {
          setError("يرجى اختيار الموقع")
          toast.error("يرجى اختيار الموقع")
          return false
        }
        const sessionsCount = bookingData.selectedPackage?.sessions_count ?? bookingData.sessionsCount
        if (bookingData.selectedDates.length !== sessionsCount) {
          setError(`يرجى اختيار ${sessionsCount} موعد${sessionsCount > 1 ? "ات" : ""} لتتناسب مع عدد الجلسات`)
          toast.error(`يرجى اختيار ${sessionsCount} موعد${sessionsCount > 1 ? "ات" : ""}`)
          return false
        }
        break
      case 4:
        if (bookingData.selectedPatients.length === 0) {
          setError("يرجى اختيار مريض واحد على الأقل")
          toast.error("يرجى اختيار مريض واحد على الأقل")
          return false
        }
        if (!bookingData.healthInfo.painLocation.trim()) {
          setError("يرجى تحديد مكان الألم أو المشكلة الصحية")
          toast.error("يرجى تحديد مكان الألم أو المشكلة الصحية")
          return false
        }
        break
      case 5:
        if (!bookingData.paymentMethod) {
          setError("يرجى اختيار طريقة الدفع")
          toast.error("يرجى اختيار طريقة الدفع")
          return false
        }
        break
    }
    setError(null)
    return true
  }

const submitBooking = async () => {
  try {
    setIsLoading(true)
    setError(null)
    console.log("bookingData", bookingData)

    // Upload attachments and get their IDs
    const attachmentIds: number[] = []
    for (const file of bookingData.healthInfo.attachments || []) {
      console.log("Uploading attachment:", bookingData.healthInfo.attachments);
      
      const formData = new FormData()
      formData.append("attachment[]", file)
      const attachmentResponse = await ClientAPI.uploadAttachment(formData, "ar")
      attachmentIds.push(attachmentResponse.data[0].original)
    }

    // Build guest_info if it's a guest reservation (assumes selectedPatients has the guest info)
    const isGuest = bookingData.selectedPatients?.length === 1
    const guest = isGuest ? bookingData.selectedPatients[0] : null

    const reservationData: any = {
      service_id: bookingData.selectedService?.id,
      category_id: bookingData.selectedCategory?.id,
      doctor_id: bookingData.selectedDoctor?.id,
      sessions_count: bookingData.selectedPackage?.sessions_count ?? bookingData.sessionsCount,
      sub_total: bookingData.pricing.subTotal,
      fees: bookingData.pricing.fees,
      total_amount: bookingData.pricing.total,
      transaction_reference: `txn_${Date.now()}`,
      pain_location: bookingData.healthInfo.painLocation,
      notes: [
        bookingData.healthInfo.symptoms,
        bookingData.healthInfo.medicalHistory,
        bookingData.healthInfo.currentMedications,
        bookingData.healthInfo.allergies,
        bookingData.healthInfo.notes,
      ]
        .filter(Boolean)
        .join("\n"),
      dates: bookingData.selectedDates.map((date) => ({
        start_time: date.start_time,
        end_time: date.end_time,
        time_period: date.time_period,
      })),
      attachments: attachmentIds,
    }
if (bookingData.selectedPackage) {
  reservationData.package_id = bookingData.selectedPackage.id
  reservationData.sessions_count = bookingData.selectedPackage.sessions_count
}
    // Handle guest booking
    if (isGuest && guest) {
      reservationData.is_guest = true
      reservationData.guest_info = {
        name: guest.name,
        email: guest.email,
        mobile: guest.phone,
        address: bookingData.selectedLocation?.address || "N/A",
        city: bookingData.selectedLocation?.city || "N/A",
        country: bookingData.selectedLocation?.country || "N/A",
        nationality: guest.nationality,
        date_of_birth: guest.birthDate,
        gender: guest.gender,
        national_id: guest.idNumber,
        blood_group: guest.bloodType,
        languages_spoken: "ar", // or dynamically set from user input
      }
    } else {
      // Handle registered user
      reservationData.client_id = bookingData.clientId
      reservationData.address_id = bookingData.addressId
      reservationData.patient_ids = bookingData.selectedPatients.map((p) => p.id)
    }

    // Send request
    const response = bookingData.selectedPackage
      ? await ClientAPI.createReservationWithPackage(reservationData, "ar")
      : await ClientAPI.createReservation(reservationData, "ar")
console.log("response", response);

    setReservationId(response.data[0].id)
    toast.success("تم إنشاء الحجز بنجاح، يرجى إكمال الدفع")
    setCurrentStep(5)
  } catch (error: any) {
    console.error(error)
    setError(error.message || "حدث خطأ أثناء إنشاء الحجز")
    toast.error("فشل في إنشاء الحجز")
  } finally {
    setIsLoading(false)
  }
}


const completePayment = async () => {
  try {
    setIsLoading(true);
    setError(null);

    if (!reservationId) {
      throw new Error("معرف الحجز غير متوفر");
    }

    if (bookingData.paymentMethod === "cash_on_delivery") {
      // Cash on Delivery: No API call needed, just confirm the booking
      localStorage.removeItem("bookingData");
      toast.success("تم تأكيد الحجز بنجاح! سيتم الدفع عند الاستلام.");
      setCurrentStep(6); // Proceed to confirmation
    } else if (bookingData.paymentMethod === "telr") {
      // Telr Payment
      const responceTelr = await ClientAPI.payReservationWithTelr(reservationId, "ar");
      route.push(responceTelr.data.redirect_url);

      localStorage.removeItem("bookingData");
      toast.success("تم تأكيد الدفع بنجاح عبر Telr!");
      setCurrentStep(6); // Proceed to confirmation
    } else {
      // Default payment (Apple Pay or others)
      const responceTap = await ClientAPI.payReservation(reservationId, "ar");
      route.push(responceTap.data.redirect_url);
      localStorage.removeItem("bookingData");
      toast.success("تم تأكيد الدفع بنجاح!");
      setCurrentStep(6); // Proceed to confirmation
    }
  } catch (error: any) {
    console.error("Payment Error:", error);
    setError(error.message || "حدث خطأ أثناء تأكيد الدفع");
    toast.error(error.message || "فشل في تأكيد الدفع");
  } finally {
    setIsLoading(false);
  }
};

  const nextStep = () => {
    if (currentStep === 4) {
      if (validateStep(currentStep)) {
        submitBooking() // Submit reservation after Step 4
      }
    } else if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6) as BookingStep)
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as BookingStep)
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
            onOpenProfile={(doctor) => openModal("doctorProfile", doctor)}
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
            updateSavedPatients={updateSavedPatients}
            onNext={nextStep}
            onPrev={prevStep}
            onOpenAddPatient={(patient?: Patient) => {
              setModals((prev) => ({ ...prev, addPatient: true }))
              setEditingPatient(patient || null)
            }}
          />
        )
      case 5:
        return (
          <Step5Payment
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            onNext={completePayment} // Call payment completion
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
      <div className="w-full h-[247px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/dw6xSVLu5N.png)] bg-[length:100%_100%] bg-no-repeat absolute top-0 left-0 -z-10" />

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

      {error && (
        <div className="w-full max-w-[1280px] mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      )}

      <div className="w-full max-w-[1280px] mt-10">{renderStepContent()}</div>

      <AddPatientModal
        isOpen={modals.addPatient}
        onClose={() => closeModal("addPatient")}
        onSave={savePatient}
        patient={editingPatient}
      />
      <LocationPickerModal
        isOpen={modals.locationPicker}
        onClose={() => closeModal("locationPicker")}
        onSave={saveLocation}
        savedLocations={savedLocations}
        updateSavedLocations={updateSavedLocations}
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
        doctor={profileDoctor}
        updateBookingData={updateBookingData}
        onSelectDoctor={nextStep}
      />
    </div>
  )
}