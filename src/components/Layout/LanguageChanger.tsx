"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import ClientAPI from "@/app/api/api"

export default function LanguageChanger() {
  const { i18n } = useTranslation()
  const currentLocale = i18n.language
  const router = useRouter()
  const currentPathname = usePathname()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleChange = async (newLocale: string) => {
    if (newLocale === currentLocale) return

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${30 * 24 * 60 * 60}`

    let pathWithoutLocale = currentPathname

    // Remove /en prefix if present (for English pages)
    if (currentPathname.startsWith("/en/") || currentPathname === "/en") {
      pathWithoutLocale = currentPathname.replace(/^\/en/, "") || "/"
    }

    const pathParts = pathWithoutLocale.split("/").filter(Boolean)
    const currentSlug = pathParts[pathParts.length - 1]
    const section = pathParts[pathParts.length - 2] || ""

    console.log("🔍 currentPathname:", currentPathname)
    console.log("📍 pathWithoutLocale:", pathWithoutLocale)
    console.log("📍 section:", section, "slug:", currentSlug)

    let translatedSlug = currentSlug

    try {
      if (section === "blog" && currentSlug) {
        const res = await ClientAPI.getSingleBlog(currentSlug, currentLocale)
        const blog = res?.data
        translatedSlug = blog?.slug?.[newLocale] || currentSlug
        console.log("🔄 Blog translated slug:", translatedSlug)
      } else if (section === "our-services" && currentSlug) {
        const res = await ClientAPI.getAllServicesSlug(currentLocale, currentSlug)
        const service = res?.data
        translatedSlug = service?.slug?.[newLocale] || currentSlug
        console.log("🔄 Service translated slug:", translatedSlug)
      }
    } catch (err) {
      console.error("❌ Failed to fetch translated slug:", err)
    }

    let newPath = pathWithoutLocale

    // Replace slug if it was translated
    if (translatedSlug && currentSlug && translatedSlug !== currentSlug) {
      newPath = newPath.replace(currentSlug, translatedSlug)
    }

    // Add /en prefix for English, no prefix for Arabic
    if (newLocale === "en") {
      newPath = `/en${newPath}`
    }
    // For Arabic, newPath already has no prefix

    console.log("🚀 Redirecting to:", newPath)

    i18n.changeLanguage(newLocale)
    router.push(newPath)
    setDropdownOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div
      className="relative flex items-center cursor-pointer z-[3]"
      onClick={() => setDropdownOpen((prev) => !prev)}
      ref={dropdownRef}
    >
      <div className="w-[24px] h-[24px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-08/YQshacmVLQ.png)] bg-cover bg-no-repeat relative overflow-hidden z-[4]" />
      <div className="flex w-[28px] gap-[10px] justify-center items-center shrink-0 relative z-[50]">
        <span className="h-[20px]  text-[14px] font-medium leading-[20px] text-[#1e1e1e] whitespace-nowrap z-[6]">
          {currentLocale === "ar" ? "Eng" : "عربى"}
        </span>
      </div>

      {dropdownOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 w-[80px]"
        >
          <div
            onClick={() => handleChange("en")}
            className="px-3 py-2 hover:bg-gray-100 text-sm text-[#1e1e1e]  cursor-pointer"
          >
            English
          </div>
          <div
            onClick={() => handleChange("ar")}
            className="px-3 py-2 hover:bg-gray-100 text-sm text-[#1e1e1e]  cursor-pointer"
          >
            العربية
          </div>
        </motion.div>
      )}
    </div>
  )
}
