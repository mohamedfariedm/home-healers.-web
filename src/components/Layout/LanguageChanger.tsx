"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import ClientAPI from "@/app/api/api"
import {
  blogHref,
  categoryHref,
  getBlogSlug,
  getCategorySlug,
  getOfferSlug,
  getServiceSlug,
  serviceHref,
  unwrapDetail,
} from "@/lib/slugs"
import { offerHref, one, safeDecodeUriSlug } from "@/lib/offers"

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

    if (currentPathname.startsWith("/en/") || currentPathname === "/en") {
      pathWithoutLocale = currentPathname.replace(/^\/en/, "") || "/"
    }

    const pathParts = pathWithoutLocale.split("/").filter(Boolean)
    let newPath = pathWithoutLocale

    try {
      if (pathParts[0] === "blog" && pathParts[1]) {
        const res = await ClientAPI.getSingleBlog(
          decodeURIComponent(pathParts[1]),
          currentLocale,
        )
        const blog = unwrapDetail<{ slug?: unknown }>(res)
        const translated = getBlogSlug(blog, newLocale)
        if (translated) {
          newPath = blogHref(newLocale, translated)
          i18n.changeLanguage(newLocale)
          router.push(newPath)
          setDropdownOpen(false)
          return
        }
      } else if (pathParts[0] === "offers" && pathParts[1]) {
        const res = await ClientAPI.getOfferBySlug(
          safeDecodeUriSlug(pathParts[1]),
          currentLocale,
        )
        const offer = one<{ slug?: unknown }>(res)
        const translated = getOfferSlug(offer, newLocale)
        if (translated) {
          newPath = offerHref(newLocale, translated)
          i18n.changeLanguage(newLocale)
          router.push(newPath)
          setDropdownOpen(false)
          return
        }
      } else if (pathParts[0] === "our-services") {
        if (pathParts[1]) {
          const currentServiceSlug = decodeURIComponent(pathParts[1])
          const [res, listRes] = await Promise.all([
            ClientAPI.getAllServicesSlug(currentLocale, currentServiceSlug),
            ClientAPI.getAllServices(currentLocale),
          ])
          const service = unwrapDetail<{
            id?: number
            slug?: unknown
            category?: { slug?: unknown }
          }>(res)
          const services = Array.isArray(listRes?.data) ? listRes.data : []
          const match = services.find(
            (item: { id?: number; slug?: unknown; category?: { slug?: unknown } }) =>
              (service?.id != null && item.id === service.id) ||
              getServiceSlug(item, currentLocale) === currentServiceSlug,
          )
          const categorySlug =
            getCategorySlug(service?.category, newLocale) ||
            getCategorySlug(match?.category, newLocale)
          const translated = getServiceSlug(service, newLocale)
          if (categorySlug && translated) {
            newPath = serviceHref(newLocale, categorySlug, translated)
            i18n.changeLanguage(newLocale)
            router.push(newPath)
            setDropdownOpen(false)
            return
          }
        }
        newPath = categoryHref(newLocale, "")
        i18n.changeLanguage(newLocale)
        router.push(newPath)
        setDropdownOpen(false)
        return
      } else if (pathParts[0] === "categories" && pathParts.length >= 3) {
        const [categoryRes, serviceRes] = await Promise.all([
          ClientAPI.getCategory(decodeURIComponent(pathParts[1]), currentLocale),
          ClientAPI.getAllServicesSlug(
            currentLocale,
            decodeURIComponent(pathParts[2]),
          ),
        ])
        const category = unwrapDetail<{ slug?: unknown }>(categoryRes)
        const service = unwrapDetail<{
          slug?: unknown
          category?: { slug?: unknown }
        }>(serviceRes)
        const categorySlug =
          getCategorySlug(category, newLocale) ||
          getCategorySlug(service?.category, newLocale) ||
          decodeURIComponent(pathParts[1])
        const translated =
          getServiceSlug(service, newLocale) || decodeURIComponent(pathParts[2])
        if (categorySlug && translated) {
          newPath = serviceHref(newLocale, categorySlug, translated)
          i18n.changeLanguage(newLocale)
          router.push(newPath)
          setDropdownOpen(false)
          return
        }
      } else if (pathParts[0] === "categories" && pathParts[1]) {
        const res = await ClientAPI.getCategory(
          decodeURIComponent(pathParts[1]),
          currentLocale,
        )
        const category = unwrapDetail<{ slug?: unknown }>(res)
        const translated = getCategorySlug(category, newLocale)
        if (translated) {
          newPath = categoryHref(newLocale, translated)
          i18n.changeLanguage(newLocale)
          router.push(newPath)
          setDropdownOpen(false)
          return
        }
      }
    } catch (err) {
      console.error("Failed to fetch translated slug:", err)
    }

    if (newLocale === "en") {
      newPath = `/en${newPath}`
    }

    i18n.changeLanguage(newLocale)
    router.push(newPath)
    setDropdownOpen(false)
  }

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
    <div className="relative z-[3]" ref={dropdownRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={dropdownOpen}
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-full border border-[#d7e4f8] bg-white/80 px-2.5 py-1.5 backdrop-blur-sm transition hover:border-[#62a0f6] hover:bg-white"
      >
        <div className="h-5 w-5 shrink-0 bg-[url(/assets/images/shared/language-globe.png)] bg-cover bg-no-repeat" />
        <span className="text-sm font-medium leading-5 text-[#1e1e1e] whitespace-nowrap">
          {currentLocale === "ar" ? "Eng" : "عربى"}
        </span>
      </button>

      {dropdownOpen && (
        <motion.div
          role="listbox"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full end-0 z-50 mt-2 w-[120px] overflow-hidden rounded-2xl border border-[#d7e4f8] bg-white shadow-[0_16px_40px_rgba(20,48,135,0.12)]"
        >
          <button
            type="button"
            onClick={() => handleChange("en")}
            className="block w-full px-3 py-2.5 text-start text-sm text-[#1e1e1e] hover:bg-[#eff6fe]"
          >
            English
          </button>
          <button
            type="button"
            onClick={() => handleChange("ar")}
            className="block w-full px-3 py-2.5 text-start text-sm text-[#1e1e1e] hover:bg-[#eff6fe]"
          >
            العربية
          </button>
        </motion.div>
      )}
    </div>
  )
}
