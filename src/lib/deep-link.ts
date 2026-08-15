export type DeepLinkRoute =
  | "doctor"
  | "service"
  | "reservation"
  | "offers"
  | "home";

export const DEEP_LINK_ROUTE_NAMES: DeepLinkRoute[] = [
  "doctor",
  "service",
  "reservation",
  "home",
];

export const APP_SCHEME = "homehealers";
export const DEFAULT_PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.home.healers.app";
export const DEFAULT_APP_STORE_URL =
  "https://apps.apple.com/sa/app/home-healers/id123456789";

const ROUTE_QUERY_KEYS: Record<DeepLinkRoute, string | null> = {
  doctor: "doctorId",
  service: "categoryId",
  reservation: "reservationId",
  offers: null,
  home: null,
};

export function buildDeepLinkPath(
  route: DeepLinkRoute,
  segments?: string[],
  queryId?: string,
): string {
  const queryKey = ROUTE_QUERY_KEYS[route];
  const pathId = segments?.[0];
  const id = queryId || pathId;

  if (id && queryKey) {
    return `/${route}?${queryKey}=${encodeURIComponent(id)}`;
  }

  return `/${route}`;
}

export function extractLocaleFromPathname(pathname: string): string {
  if (pathname.startsWith("/en/") || pathname === "/en") return "en";
  return "ar";
}

export function parseDeepLinkRequest(
  pathname: string,
  searchParams: URLSearchParams,
): { locale: string; route: DeepLinkRoute; id?: string } | null {
  const locale = extractLocaleFromPathname(pathname);
  const normalized = pathname.replace(/^\/(en|ar)(?=\/|$)/, "") || pathname;

  for (const route of DEEP_LINK_ROUTE_NAMES) {
    if (normalized === `/${route}` || normalized.startsWith(`/${route}/`)) {
      const queryKey = ROUTE_QUERY_KEYS[route];
      let id: string | undefined;

      if (queryKey) {
        id = searchParams.get(queryKey) ?? undefined;
      }

      if (!id && normalized.startsWith(`/${route}/`)) {
        id = normalized.slice(`/${route}/`.length).split("/")[0] || undefined;
      }

      return { locale, route, id };
    }
  }

  return null;
}

/** Desktop deep links always go to the homepage. */
export function buildWebsiteRedirectPath(locale: string): string {
  return locale === "en" ? "/en" : "/";
}

export function buildAppOpenUrl(targetUrl: string): string {
  return `${APP_SCHEME}://open?target_url=${encodeURIComponent(targetUrl)}`;
}

export type MobilePlatform = "android" | "ios" | "desktop";

export function getMobilePlatform(userAgent: string): MobilePlatform {
  const ua = userAgent.toLowerCase();
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  return "desktop";
}

/** Facebook / Instagram in-app browser only. */
export function isFacebookOrInstagram(userAgent: string): boolean {
  return /FBAN|FBAV|FB_IAB|Instagram/i.test(userAgent);
}

/** Android App Link intent. Pass fallbackUrl on mobile for auto Play Store redirect. */
export function buildAndroidAppLinkIntentUrl(
  targetUrl: string,
  fallbackUrl?: string,
  packageName = "com.home.healers.app",
): string {
  const url = new URL(targetUrl);
  const intentPath = `${url.host}${url.pathname}${url.search}`;
  const fallback = fallbackUrl
    ? `;S.browser_fallback_url=${encodeURIComponent(fallbackUrl)}`
    : "";
  return `intent://${intentPath}#Intent;scheme=https;package=${packageName}${fallback};end`;
}

export const STORE_FALLBACK_MS = 2500;

export const DEEP_LINK_COPY: Record<
  DeepLinkRoute,
  { ar: { title: string; description: string }; en: { title: string; description: string } }
> = {
  doctor: {
    ar: {
      title: "عرض الطبيب في التطبيق",
      description: "افتح تطبيق هوم هيلرز لعرض ملف الطبيب والحجز مباشرة.",
    },
    en: {
      title: "View doctor in the app",
      description: "Open the Home Healers app to view this doctor and book instantly.",
    },
  },
  service: {
    ar: {
      title: "عرض الخدمة في التطبيق",
      description: "افتح تطبيق هوم هيلرز لاستكشاف هذه الخدمة والحجز.",
    },
    en: {
      title: "View service in the app",
      description: "Open the Home Healers app to explore this service and book.",
    },
  },
  reservation: {
    ar: {
      title: "عرض الحجز في التطبيق",
      description: "افتح تطبيق هوم هيلرز لمتابعة تفاصيل حجزك.",
    },
    en: {
      title: "View reservation in the app",
      description: "Open the Home Healers app to view your reservation details.",
    },
  },
  offers: {
    ar: {
      title: "عروض هوم هيلرز",
      description: "افتح التطبيق لاكتشاف أحدث العروض والخصومات.",
    },
    en: {
      title: "Home Healers offers",
      description: "Open the app to discover our latest offers and discounts.",
    },
  },
  home: {
    ar: {
      title: "هوم هيلرز",
      description: "افتح التطبيق للوصول إلى جميع خدماتنا الصحية المنزلية.",
    },
    en: {
      title: "Home Healers",
      description: "Open the app to access all our home healthcare services.",
    },
  },
};
