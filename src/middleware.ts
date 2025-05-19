import { i18nRouter } from "next-i18n-router";
import { i18nRouterConfig } from "./i18nRouterConfig";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  console.log("url Request:", url.pathname);
  console.log("i18nRouterConfig:", i18nRouterConfig);

  const localeCookie = request.cookies.get("NEXT_LOCALE");

  if (!localeCookie) {
    console.log("Setting NEXT_LOCALE to 'ar'");
    
    const response = i18nRouter(request, i18nRouterConfig);
    response.cookies.set("NEXT_LOCALE", "ar");
    return response;
  }

  return i18nRouter(request, i18nRouterConfig);
}

// applies this middleware only to files in the app directory
export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
