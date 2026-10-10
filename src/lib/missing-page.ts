const RETIRED_ROOTS = new Set(["our-services", "backges", "services"])

const STATIC_PAGES = new Set([
  "about",
  "contact",
  "blog",
  "offers",
  "categories",
  "booking",
  "privacy",
  "terms",
  "doctors-apply",
  "failed",
])

function requestLocaleAndPath(pathname: string): { locale: "en" | "ar"; path: string } {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return { locale: "en", path: pathname === "/en" ? "/" : pathname.slice(3) || "/" }
  }
  if (pathname === "/ar" || pathname.startsWith("/ar/")) {
    return { locale: "ar", path: pathname === "/ar" ? "/" : pathname.slice(3) || "/" }
  }
  return { locale: "ar", path: pathname || "/" }
}

function decodeSegment(value: string): string | null {
  try {
    return decodeURIComponent(value)
  } catch {
    return null
  }
}

async function apiStatus(path: string, locale: string): Promise<number | null> {
  const api = (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "").replace(/\/$/, "")
  if (!api) return null

  try {
    const response = await fetch(`${api}/${path}`, {
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
        language: locale,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    })
    return response.status
  } catch {
    return null
  }
}

async function resourceMissing(path: string, locale: string): Promise<boolean> {
  const status = await apiStatus(path, locale)
  return status === 404
}

async function landingPageMissing(locale: string, slug: string): Promise<boolean> {
  const api = (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "").replace(/\/$/, "")
  if (!api) return false

  try {
    const response = await fetch(`${api}/client/settings`, {
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
        language: locale,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) return false
    const data = await response.json()
    const pages = data?.data?.[0]?.setting?.landing_pages
    if (!Array.isArray(pages)) return false
    return !pages.some((page: { slug?: string }) => page?.slug === slug)
  } catch {
    return false
  }
}

/** True when this URL has no page and should be 410 Gone. */
export async function isMissingPage(pathname: string): Promise<boolean> {
  const { locale, path } = requestLocaleAndPath(pathname)
  const decoded = path.split("/").filter(Boolean).map(decodeSegment)
  if (decoded.some((segment) => segment == null)) return true
  const parts = decoded as string[]

  if (parts.length === 0) return false
  if (RETIRED_ROOTS.has(parts[0])) return true
  if (parts.length === 1 && STATIC_PAGES.has(parts[0])) return false

  if (parts[0] === "blog") {
    if (parts.length !== 2 || /^\d+$/.test(parts[1])) return true
    return resourceMissing(`client/news-slug/${encodeURIComponent(parts[1])}`, locale)
  }

  if (parts[0] === "offers") {
    if (parts.length === 2 || (parts.length === 3 && parts[2] === "book")) {
      return resourceMissing(`client/offers/${encodeURIComponent(parts[1])}`, locale)
    }
    return true
  }

  if (parts[0] === "categories") {
    if (/^\d+$/.test(parts[1] || "")) return true
    if (parts.length === 2) {
      return resourceMissing(`client/categories/${encodeURIComponent(parts[1])}`, locale)
    }
    if (parts.length === 3) {
      const [categoryMissing, serviceMissing] = await Promise.all([
        resourceMissing(`client/categories/${encodeURIComponent(parts[1])}`, locale),
        resourceMissing(`client/services-slug/${encodeURIComponent(parts[2])}`, locale),
      ])
      return categoryMissing || serviceMissing
    }
    return true
  }

  if (
    (parts[0] === "invoice" ||
      parts[0] === "success" ||
      parts[0] === "failed" ||
      parts[0] === "canceled" ||
      parts[0] === "review" ||
      parts[0] === "invite-doctor") &&
    parts.length === 2
  ) {
    return false
  }

  if (parts[0] === "reservations" && parts.length === 3 && parts[1] === "review") {
    return false
  }

  if (parts.length === 1) return landingPageMissing(locale, parts[0])

  return true
}
