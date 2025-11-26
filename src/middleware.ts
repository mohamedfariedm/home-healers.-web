import { type NextRequest, NextResponse } from "next/server"
import { i18nRouterConfig } from "./i18nRouterConfig"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if path already has locale prefix
  const hasEnPrefix = pathname.startsWith("/en/") || pathname === "/en"
  const hasArPrefix = pathname.startsWith("/ar/") || pathname === "/ar"

  console.log("➡️ Incoming:", pathname)

  // If path already has a locale prefix, just pass through
  if (hasEnPrefix || hasArPrefix) {
    const locale = hasEnPrefix ? "en" : "ar"
    console.log(`✅ Locale prefix detected → ${locale} mode`)
    const response = NextResponse.next()
    response.cookies.set("NEXT_LOCALE", locale, { path: "/" })
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
    return response
  }

  // For paths without locale prefix, rewrite to /ar/* (default locale)
  // This avoids redirects by using rewrites instead
  console.log("🌍 No prefix → Rewriting to Arabic (default)")

  const url = request.nextUrl.clone()
  url.pathname = `/ar${pathname}`

  const response = NextResponse.rewrite(url)
  response.cookies.set("NEXT_LOCALE", "ar", { path: "/" })
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")

  return response
}

export const config = {
  // Exclude API routes, static files, Next.js internals, and common assets
  matcher: "/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt|sitemap.xml).*)",
}
