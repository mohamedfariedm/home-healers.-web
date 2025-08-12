"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Upload, User, Briefcase, GraduationCap, FileText, MapPin, CheckCircle } from "lucide-react"
import { useToast } from "@/Hooks/use-toast"
import { useTranslation } from "react-i18next"

interface FormData {
  doctor_role: string
  name_en: string
  name_ar: string
  email: string
  nationality_id: string
  national_id: string
  country_code: string
  mobile_number: string
  date_of_birth: string
  blood_group: string
  gender: string
  degree: string
  languages_spoken: string
  classification: string
  department: string
  experience: string
  medical_school: string
  memberships: string
  specialized_in: string
  awards: string
  certification: string
  medical_registration_number: string
  medical_license_expiry: string
  specialist: string
  sub_specialist: string
  service_id: string
  clinic_name: string
  from: string
  to: string
  upload_attachments: File[]
}

const initialFormData: FormData = {
  doctor_role: "",
  name_en: "",
  name_ar: "",
  email: "",
  nationality_id: "",
  national_id: "",
  country_code: "+1",
  mobile_number: "",
  date_of_birth: "",
  blood_group: "",
  gender: "",
  degree: "",
  languages_spoken: "",
  classification: "",
  department: "",
  experience: "",
  medical_school: "",
  memberships: "",
  specialized_in: "",
  awards: "",
  certification: "",
  medical_registration_number: "",
  medical_license_expiry: "",
  specialist: "",
  sub_specialist: "",
  service_id: "",
  clinic_name: "",
  from: "",
  to: "",
  upload_attachments: [],
}

// keep only ids/icons; titles come from i18n
const stepDefs = [
  { id: 1, icon: User },
  { id: 2, icon: Briefcase },
  { id: 3, icon: GraduationCap },
  { id: 4, icon: FileText },
  { id: 5, icon: MapPin },
  { id: 6, icon: Upload },
] as const

export default function DoctorRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { t } = useTranslation("doctor-apply")
  const { toast } = useToast()

  const tr = (key: string, def?: string, opts?: Record<string, any>) =>
    t(key, { defaultValue: def, ...opts })

  const updateFormData = (field: keyof FormData, value: string | File[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}
    switch (step) {
      case 1:
        if (!formData.doctor_role) newErrors.doctor_role = tr("form.validation.doctor_role_required")
        if (!formData.name_en) newErrors.name_en = tr("form.validation.name_en_required")
        if (!formData.name_ar) newErrors.name_ar = tr("form.validation.name_ar_required")
        if (!formData.email) newErrors.email = tr("form.validation.email_required")
        if (!formData.national_id) newErrors.national_id = tr("form.validation.national_id_required")
        if (!formData.mobile_number) newErrors.mobile_number = tr("form.validation.mobile_number_required")
        if (!formData.date_of_birth) newErrors.date_of_birth = tr("form.validation.date_of_birth_required")
        if (!formData.gender) newErrors.gender = tr("form.validation.gender_required")
        break
      case 2:
        if (!formData.degree) newErrors.degree = tr("form.validation.degree_required")
        if (!formData.classification) newErrors.classification = tr("form.validation.classification_required")
        if (!formData.department) newErrors.department = tr("form.validation.department_required")
        if (!formData.experience) newErrors.experience = tr("form.validation.experience_required")
        if (!formData.specialized_in) newErrors.specialized_in = tr("form.validation.specialized_in_required")
        break
      case 3:
        if (!formData.medical_school) newErrors.medical_school = tr("form.validation.medical_school_required")
        if (!formData.certification) newErrors.certification = tr("form.validation.certification_required")
        break
      case 4:
        if (!formData.medical_registration_number)
          newErrors.medical_registration_number = tr("form.validation.medical_registration_number_required")
        if (!formData.medical_license_expiry) newErrors.medical_license_expiry = tr("form.validation.medical_license_expiry_required")
        if (!formData.specialist) newErrors.specialist = tr("form.validation.specialist_required")
        break
      case 5:
        if (!formData.clinic_name) newErrors.clinic_name = tr("form.validation.clinic_name_required")
        if (!formData.service_id) newErrors.service_id = tr("form.validation.service_id_required")
        break
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, stepDefs.length))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return
    try {
      const submissionData = {
        doctor_role: formData.doctor_role,
        name: { en: formData.name_en, ar: formData.name_ar },
        email: formData.email,
        nationality_id: Number.parseInt(formData.nationality_id) || 1,
        service_id: Number.parseInt(formData.service_id) || 4,
        national_id: formData.national_id,
        country_code: formData.country_code,
        mobile_number: formData.mobile_number,
        date_of_birth: formData.date_of_birth,
        blood_group: formData.blood_group,
        gender: formData.gender,
        degree: formData.degree,
        languages_spoken: formData.languages_spoken,
        classification: formData.classification,
        department: formData.department,
        experience: Number.parseInt(formData.experience) || 0,
        medical_school: formData.medical_school,
        memberships: formData.memberships,
        specialized_in: formData.specialized_in,
        awards: formData.awards,
        certification: formData.certification,
        upload_attachments: formData.upload_attachments.map((file) => file.name).join(", "),
        medical_registration_number: formData.medical_registration_number,
        medical_license_expiry: formData.medical_license_expiry,
        specialist: formData.specialist,
        sub_specialist: formData.sub_specialist,
        clinic_name: formData.clinic_name,
        from: formData.from,
        to: formData.to,
      }
      console.log("Submitting doctor registration:", submissionData)
      toast({
        title: tr("form.messages.success_title"),
        description: tr("form.messages.success_description"),
        className: "bg-green-100 border-green-500 text-green-900",
      })
      setFormData(initialFormData)
      setCurrentStep(1)
    } catch (error) {
      toast({
        title: tr("form.messages.error_title"),
        description: tr("form.messages.error_description"),
        variant: "destructive",
        className: "bg-red-100 border-red-500 text-red-900",
      })
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    updateFormData("upload_attachments", [...formData.upload_attachments, ...files])
  }

  const removeFile = (index: number) => {
    const newFiles = formData.upload_attachments.filter((_, i) => i !== index)
    updateFormData("upload_attachments", newFiles)
  }

  const renderStepTitle = (id: number) => tr(`form.steps.${id}`, `Step ${id}`)

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="doctor_role" className="text-sm font-semibold text-gray-700">{tr("form.labels.doctor_role")} *</Label>
                <Select value={formData.doctor_role} onValueChange={(value) => updateFormData("doctor_role", value)}>
                  <SelectTrigger className={`mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.doctor_role ? "border-red-500" : ""}`}>
                    <SelectValue placeholder={tr("form.placeholders.doctor_role")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl shadow-lg">
                    <SelectItem value="Consultant">{tr("form.options.roles.consultant", "Consultant")}</SelectItem>
                    <SelectItem value="Specialist">{tr("form.options.roles.specialist", "Specialist")}</SelectItem>
                    <SelectItem value="Resident">{tr("form.options.roles.resident", "Resident")}</SelectItem>
                    <SelectItem value="Intern">{tr("form.options.roles.intern", "Intern")}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.doctor_role && <p className="text-red-500 text-xs mt-1">{errors.doctor_role}</p>}
              </div>
              <div>
                <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">{tr("form.labels.gender")} *</Label>
                <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
                  <SelectTrigger className={`mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.gender ? "border-red-500" : ""}`}>
                    <SelectValue placeholder={tr("form.placeholders.gender")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl shadow-lg">
                    <SelectItem value="male">{tr("form.options.gender.male", "Male")}</SelectItem>
                    <SelectItem value="female">{tr("form.options.gender.female", "Female")}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name_en" className="text-sm font-semibold text-gray-700">{tr("form.labels.name_en")} *</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => updateFormData("name_en", e.target.value)}
                  placeholder={tr("form.placeholders.name_en")}
                  className={`mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${errors.name_en ? "border-red-500" : ""}`}
                />
                {errors.name_en && <p className="text-red-500 text-xs mt-1">{errors.name_en}</p>}
              </div>
              <div>
                <Label htmlFor="name_ar" className="text-sm font-semibold text-gray-700">{tr("form.labels.name_ar")} *</Label>
                <Input
                  id="name_ar"
                  value={formData.name_ar}
                  onChange={(e) => updateFormData("name_ar", e.target.value)}
                  placeholder={tr("form.placeholders.name_ar")}
                  className={`mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${errors.name_ar ? "border-red-500" : ""}`}
                  dir="rtl"
                />
                {errors.name_ar && <p className="text-red-500 text-xs mt-1">{errors.name_ar}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">{tr("form.labels.email")} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder={tr("form.placeholders.email")}
                  className={`mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="national_id" className="text-sm font-semibold text-gray-700">{tr("form.labels.national_id")} *</Label>
                <Input
                  id="national_id"
                  value={formData.national_id}
                  onChange={(e) => updateFormData("national_id", e.target.value)}
                  placeholder={tr("form.placeholders.national_id")}
                  className={`mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${errors.national_id ? "border-red-500" : ""}`}
                />
                {errors.national_id && <p className="text-red-500 text-xs mt-1">{errors.national_id}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="country_code" className="text-sm font-semibold text-gray-700">{tr("form.labels.country_code")}</Label>
                <Select value={formData.country_code} onValueChange={(value) => updateFormData("country_code", value)}>
                  <SelectTrigger className="mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl shadow-lg">
                    <SelectItem value="+1">+1 (US/CA)</SelectItem>
                    <SelectItem value="+44">+44 (UK)</SelectItem>
                    <SelectItem value="+971">+971 (UAE)</SelectItem>
                    <SelectItem value="+966">+966 (SA)</SelectItem>
                    <SelectItem value="+20">+20 (EG)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="mobile_number" className="text-sm font-semibold text-gray-700">{tr("form.labels.mobile_number")} *</Label>
                <Input
                  id="mobile_number"
                  value={formData.mobile_number}
                  onChange={(e) => updateFormData("mobile_number", e.target.value)}
                  placeholder={tr("form.placeholders.mobile_number")}
                  className={`mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${errors.mobile_number ? "border-red-500" : ""}`}
                />
                {errors.mobile_number && <p className="text-red-500 text-xs mt-1">{errors.mobile_number}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="date_of_birth" className="text-sm font-semibold text-gray-700">{tr("form.labels.date_of_birth")} *</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => updateFormData("date_of_birth", e.target.value)}
                  className={`mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.date_of_birth ? "border-red-500" : ""}`}
                />
                {errors.date_of_birth && <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>}
              </div>
              <div>
                <Label htmlFor="blood_group" className="text-sm font-semibold text-gray-700">{tr("form.labels.blood_group")}</Label>
                <Select value={formData.blood_group} onValueChange={(value) => updateFormData("blood_group", value)}>
                  <SelectTrigger className="mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder={tr("form.placeholders.blood_group")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl shadow-lg">
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="nationality_id" className="text-sm font-semibold text-gray-700">{tr("form.labels.nationality_id")}</Label>
                <Input
                  id="nationality_id"
                  value={formData.nationality_id}
                  onChange={(e) => updateFormData("nationality_id", e.target.value)}
                  placeholder={tr("form.placeholders.nationality_id")}
                  className="mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="degree" className="text-sm font-semibold text-gray-700">{tr("form.labels.degree")} *</Label>
                <Input
                  id="degree"
                  value={formData.degree}
                  onChange={(e) => updateFormData("degree", e.target.value)}
                  placeholder={tr("form.placeholders.degree")}
                  className={`mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${errors.degree ? "border-red-500" : ""}`}
                />
                {errors.degree && <p className="text-red-500 text-xs mt-1">{errors.degree}</p>}
              </div>
              <div>
                <Label htmlFor="classification" className="text-sm font-semibold text-gray-700">{tr("form.labels.classification")} *</Label>
                <Select value={formData.classification} onValueChange={(value) => updateFormData("classification", value)}>
                  <SelectTrigger className={`mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.classification ? "border-red-500" : ""}`}>
                    <SelectValue placeholder={tr("form.placeholders.classification")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl shadow-lg">
                    <SelectItem value="Senior Specialist">{tr("form.options.classification.senior_specialist","Senior Specialist")}</SelectItem>
                    <SelectItem value="Specialist">{tr("form.options.classification.specialist","Specialist")}</SelectItem>
                    <SelectItem value="Senior Consultant">{tr("form.options.classification.senior_consultant","Senior Consultant")}</SelectItem>
                    <SelectItem value="Consultant">{tr("form.options.classification.consultant","Consultant")}</SelectItem>
                    <SelectItem value="Registrar">{tr("form.options.classification.registrar","Registrar")}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.classification && <p className="text-red-500 text-xs mt-1">{errors.classification}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="department" className="text-sm font-semibold text-gray-700">{tr("form.labels.department")} *</Label>
                <Select value={formData.department} onValueChange={(value) => updateFormData("department", value)}>
                  <SelectTrigger className={`mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.department ? "border-red-500" : ""}`}>
                    <SelectValue placeholder={tr("form.placeholders.department")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl shadow-lg">
                    <SelectItem value="Cardiology">{tr("form.options.department.cardiology","Cardiology")}</SelectItem>
                    <SelectItem value="Neurology">{tr("form.options.department.neurology","Neurology")}</SelectItem>
                    <SelectItem value="Orthopedics">{tr("form.options.department.orthopedics","Orthopedics")}</SelectItem>
                    <SelectItem value="Pediatrics">{tr("form.options.department.pediatrics","Pediatrics")}</SelectItem>
                    <SelectItem value="Internal Medicine">{tr("form.options.department.internal_medicine","Internal Medicine")}</SelectItem>
                    <SelectItem value="Surgery">{tr("form.options.department.surgery","Surgery")}</SelectItem>
                    <SelectItem value="Dermatology">{tr("form.options.department.dermatology","Dermatology")}</SelectItem>
                    <SelectItem value="Psychiatry">{tr("form.options.department.psychiatry","Psychiatry")}</SelectItem>
                    <SelectItem value="Radiology">{tr("form.options.department.radiology","Radiology")}</SelectItem>
                    <SelectItem value="Emergency Medicine">{tr("form.options.department.emergency_medicine","Emergency Medicine")}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
              </div>
              <div>
                <Label htmlFor="experience" className="text-sm font-semibold text-gray-700">{tr("form.labels.experience")} *</Label>
                <Input
                  id="experience"
                  type="number"
                  value={formData.experience}
                  onChange={(e) => updateFormData("experience", e.target.value)}
                  placeholder={tr("form.placeholders.experience")}
                  min="0"
                  className={`mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${errors.experience ? "border-red-500" : ""}`}
                />
                {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="specialized_in" className="text-sm font-semibold text-gray-700">{tr("form.labels.specialized_in")} *</Label>
              <Input
                id="specialized_in"
                value={formData.specialized_in}
                onChange={(e) => updateFormData("specialized_in", e.target.value)}
                placeholder={tr("form.placeholders.specialized_in")}
                className={`mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${errors.specialized_in ? "border-red-500" : ""}`}
              />
              {errors.specialized_in && <p className="text-red-500 text-xs mt-1">{errors.specialized_in}</p>}
            </div>
            <div>
              <Label htmlFor="languages_spoken" className="text-sm font-semibold text-gray-700">{tr("form.labels.languages_spoken")}</Label>
              <Input
                id="languages_spoken"
                value={formData.languages_spoken}
                onChange={(e) => updateFormData("languages_spoken", e.target.value)}
                placeholder={tr("form.placeholders.languages_spoken")}
                className="mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="memberships" className="text-sm font-semibold text-gray-700">{tr("form.labels.memberships")}</Label>
              <Textarea
                id="memberships"
                value={formData.memberships}
                onChange={(e) => updateFormData("memberships", e.target.value)}
                placeholder={tr("form.placeholders.memberships")}
                className="mt-1 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="awards" className="text-sm font-semibold text-gray-700">{tr("form.labels.awards")}</Label>
              <Textarea
                id="awards"
                value={formData.awards}
                onChange={(e) => updateFormData("awards", e.target.value)}
                placeholder={tr("form.placeholders.awards")}
                className="mt-1 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                rows={4}
              />
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="medical_school" className="text-sm font-semibold text-gray-700">{tr("form.labels.medical_school")} *</Label>
              <Input
                id="medical_school"
                value={formData.medical_school}
                onChange={(e) => updateFormData("medical_school", e.target.value)}
                placeholder={tr("form.placeholders.medical_school")}
                className={`mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${errors.medical_school ? "border-red-500" : ""}`}
              />
              {errors.medical_school && <p className="text-red-500 text-xs mt-1">{errors.medical_school}</p>}
            </div>
            <div>
              <Label htmlFor="certification" className="text-sm font-semibold text-gray-700">{tr("form.labels.certification")} *</Label>
              <Input
                id="certification"
                value={formData.certification}
                onChange={(e) => updateFormData("certification", e.target.value)}
                placeholder={tr("form.placeholders.certification")}
                className={`mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${errors.certification ? "border-red-500" : ""}`}
              />
              {errors.certification && <p className="text-red-500 text-xs mt-1">{errors.certification}</p>}
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="medical_registration_number" className="text-sm font-semibold text-gray-700">{tr("form.labels.medical_registration_number")} *</Label>
                <Input
                  id="medical_registration_number"
                  value={formData.medical_registration_number}
                  onChange={(e) => updateFormData("medical_registration_number", e.target.value)}
                  placeholder={tr("form.placeholders.medical_registration_number")}
                  className={`mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${errors.medical_registration_number ? "border-red-500" : ""}`}
                />
                {errors.medical_registration_number && <p className="text-red-500 text-xs mt-1">{errors.medical_registration_number}</p>}
              </div>
              <div>
                <Label htmlFor="medical_license_expiry" className="text-sm font-semibold text-gray-700">{tr("form.labels.medical_license_expiry")} *</Label>
                <Input
                  id="medical_license_expiry"
                  type="date"
                  value={formData.medical_license_expiry}
                  onChange={(e) => updateFormData("medical_license_expiry", e.target.value)}
                  className={`mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.medical_license_expiry ? "border-red-500" : ""}`}
                />
                {errors.medical_license_expiry && <p className="text-red-500 text-xs mt-1">{errors.medical_license_expiry}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="specialist" className="text-sm font-semibold text-gray-700">{tr("form.labels.specialist")} *</Label>
                <Input
                  id="specialist"
                  value={formData.specialist}
                  onChange={(e) => updateFormData("specialist", e.target.value)}
                  placeholder={tr("form.placeholders.specialist")}
                  className={`mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${errors.specialist ? "border-red-500" : ""}`}
                />
                {errors.specialist && <p className="text-red-500 text-xs mt-1">{errors.specialist}</p>}
              </div>
              <div>
                <Label htmlFor="sub_specialist" className="text-sm font-semibold text-gray-700">{tr("form.labels.sub_specialist")}</Label>
                <Input
                  id="sub_specialist"
                  value={formData.sub_specialist}
                  onChange={(e) => updateFormData("sub_specialist", e.target.value)}
                  placeholder={tr("form.placeholders.sub_specialist")}
                  className="mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        )
      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="clinic_name" className="text-sm font-semibold text-gray-700">{tr("form.labels.clinic_name")} *</Label>
                <Input
                  id="clinic_name"
                  value={formData.clinic_name}
                  onChange={(e) => updateFormData("clinic_name", e.target.value)}
                  placeholder={tr("form.placeholders.clinic_name")}
                  className={`mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${errors.clinic_name ? "border-red-500" : ""}`}
                />
                {errors.clinic_name && <p className="text-red-500 text-xs mt-1">{errors.clinic_name}</p>}
              </div>
              <div>
                <Label htmlFor="service_id" className="text-sm font-semibold text-gray-700">{tr("form.labels.service_id")} *</Label>
                <Select value={formData.service_id} onValueChange={(value) => updateFormData("service_id", value)}>
                  <SelectTrigger className={`mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.service_id ? "border-red-500" : ""}`}>
                    <SelectValue placeholder={tr("form.placeholders.service_id")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl shadow-lg">
                    <SelectItem value="1">{tr("form.options.service.general_consultation","General Consultation")}</SelectItem>
                    <SelectItem value="2">{tr("form.options.service.specialist_consultation","Specialist Consultation")}</SelectItem>
                    <SelectItem value="3">{tr("form.options.service.emergency_services","Emergency Services")}</SelectItem>
                    <SelectItem value="4">{tr("form.options.service.surgical_services","Surgical Services")}</SelectItem>
                    <SelectItem value="5">{tr("form.options.service.diagnostic_services","Diagnostic Services")}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.service_id && <p className="text-red-500 text-xs mt-1">{errors.service_id}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="from" className="text-sm font-semibold text-gray-700">{tr("form.labels.from")}</Label>
                <Input
                  id="from"
                  type="datetime-local"
                  value={formData.from}
                  onChange={(e) => updateFormData("from", e.target.value)}
                  className="mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="to" className="text-sm font-semibold text-gray-700">{tr("form.labels.to")}</Label>
                <Input
                  id="to"
                  type="datetime-local"
                  value={formData.to}
                  onChange={(e) => updateFormData("to", e.target.value)}
                  className="mt-1 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )
      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="upload_attachments" className="text-sm font-semibold text-gray-700">{tr("form.labels.upload_attachments")}</Label>
              <div className="mt-1 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                  {tr("form.upload.helper_text","Upload medical license, certificates, and other documents (PDF, JPG, PNG, DOC)")}
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-xl border-gray-300 text-blue-600 hover:bg-blue-50"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  {tr("form.buttons.choose_files")}
                </Button>
              </div>
              {formData.upload_attachments.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">{tr("form.upload.list_title","Uploaded Files:")}</h4>
                  <div className="space-y-2">
                    {formData.upload_attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                        <span className="text-sm text-gray-600 truncate max-w-[70%]">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeFile(index)}
                        >
                          {tr("form.buttons.remove")}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                {tr("form.review.title")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                <div className="space-y-2">
                  <p><strong className="font-semibold">{tr("form.review.name")}:</strong> {formData.name_en || tr("form.review.not_provided")}</p>
                  <p><strong className="font-semibold">{tr("form.review.email")}:</strong> {formData.email || tr("form.review.not_provided")}</p>
                  <p><strong className="font-semibold">{tr("form.review.role")}:</strong> {formData.doctor_role || tr("form.review.not_provided")}</p>
                  <p><strong className="font-semibold">{tr("form.review.department")}:</strong> {formData.department || tr("form.review.not_provided")}</p>
                </div>
                <div className="space-y-2">
                  <p><strong className="font-semibold">{tr("form.review.specialization")}:</strong> {formData.specialized_in || tr("form.review.not_provided")}</p>
                  <p><strong className="font-semibold">{tr("form.review.experience")}:</strong> {formData.experience ? `${formData.experience} ${tr("form.review.years","years")}` : tr("form.review.not_provided")}</p>
                  <p><strong className="font-semibold">{tr("form.review.clinic")}:</strong> {formData.clinic_name || tr("form.review.not_provided")}</p>
                  <p><strong className="font-semibold">{tr("form.review.registration")}:</strong> {formData.medical_registration_number || tr("form.review.not_provided")}</p>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const progress = (currentStep / stepDefs.length) * 100
  const currentStepTitle = renderStepTitle(currentStep)

  return (
    <Card className="max-w-4xl mx-auto my-8 shadow-2xl border-none rounded-xl bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-2xl font-bold text-gray-800">
            {tr("form.stepper.step_of_total", "Step {{current}} of {{total}}: {{title}}", {
              current: currentStep,
              total: stepDefs.length,
              title: currentStepTitle,
            })}
          </CardTitle>
          <div className="text-sm font-medium text-gray-500">
            {tr("form.stepper.percent_complete", "{{percent}}% Complete", { percent: Math.round(progress) })}
          </div>
        </div>
        <Progress value={progress} className="h-2 bg-gray-200 rounded-full" />
        <div className="flex items-center justify-between mt-6">
          {stepDefs.map((step) => {
            const Icon = step.icon
            const isCurrent = step.id === currentStep
            const isDone = step.id < currentStep
            return (
              <div key={step.id} className="flex flex-col items-center space-y-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCurrent
                      ? "bg-blue-100 border-2 border-blue-600 text-blue-600"
                      : isDone
                      ? "bg-green-100 border-2 border-green-600 text-green-600"
                      : "bg-gray-100 border-2 border-gray-300 text-gray-400"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`text-xs font-medium text-center ${
                    isCurrent ? "text-blue-600" : isDone ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {renderStepTitle(step.id)}
                </span>
              </div>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-8">{renderStepContent()}</div>
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="h-10 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{tr("form.buttons.previous")}</span>
          </Button>
          {currentStep === stepDefs.length ? (
            <Button
              type="button"
              onClick={handleSubmit}
              className="h-10 rounded-xl bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
            >
              <span>{tr("form.buttons.submit")}</span>
              <CheckCircle className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={nextStep}
              className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
            >
              <span>{tr("form.buttons.next")}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
