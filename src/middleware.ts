import { type NextRequest, NextResponse } from "next/server"
import { i18nRouter } from "next-i18n-router"
import { i18nRouterConfig } from "./i18nRouterConfig"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const localeCookie = request.cookies.get("NEXT_LOCALE")?.value

  const hasEnPrefix = pathname.startsWith("/en/") || pathname === "/en"

  console.log("➡️ Incoming:", pathname, "| Cookie:", localeCookie)

  if (hasEnPrefix) {
    console.log("✅ EN prefix detected → English mode")
    const response = NextResponse.next()
    response.cookies.set("NEXT_LOCALE", "en", { path: "/" })
    return response
  }

  if (localeCookie === "en" && !hasEnPrefix) {
    console.log("🔄 Removing /en → Redirect to Arabic")
    const response = NextResponse.redirect(request.nextUrl)
    response.cookies.set("NEXT_LOCALE", "ar", { path: "/" })
    return response
  }

  if (!localeCookie && !hasEnPrefix) {
    console.log("🔄 Removing /en → Redirect to Arabic")
    const response = NextResponse.redirect(request.nextUrl)
    response.cookies.set("NEXT_LOCALE", "ar", { path: "/" })
    return response
  }

  console.log("🌍 No prefix → Arabic mode (default)")
  const response = i18nRouter(request, i18nRouterConfig)
  response.cookies.set("NEXT_LOCALE", "ar", { path: "/" })
  return response
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next|google8cb9aef7afb925eb.html).*)",
}
