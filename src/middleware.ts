import { NextRequest, NextResponse } from "next/server";
import { i18nRouter } from "next-i18n-router";
import { i18nRouterConfig } from "./i18nRouterConfig";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const localeCookie = request.cookies.get("NEXT_LOCALE")?.value;
  const hasLocalePrefix = /^\/(en)(\/|$)/.test(pathname); // only EN prefix
  const responseUrl = new URL(request.url);

  console.log("➡️ Incoming:", pathname, "| Cookie:", localeCookie);

  // ✅ Case 1: User visits /en/... → English mode
  if (hasLocalePrefix) {
    console.log("✅ EN prefix detected → English mode");
    const response = NextResponse.next();
    response.cookies.set("NEXT_LOCALE", "en");
    return response;
  }

  // ✅ Case 2: No prefix — Arabic mode (default)
  if (!hasLocalePrefix) {
    // If cookie was en, reset to ar because user deleted /en
    if (localeCookie === "en") {
      console.log("🌍 Switched to Arabic (no prefix)");
      const res = NextResponse.next();
      res.cookies.set("NEXT_LOCALE", "ar");
      return res;
    }

    // No cookie or Arabic already → stay as is
    const res = i18nRouter(request, i18nRouterConfig);
    if (!localeCookie) res.cookies.set("NEXT_LOCALE", "ar");
    return res;
  }

  return i18nRouter(request, i18nRouterConfig);
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
