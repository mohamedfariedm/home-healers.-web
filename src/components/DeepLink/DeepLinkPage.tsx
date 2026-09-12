import DeepLinkLanding from "@/components/DeepLink/DeepLinkLanding";
import { getCachedSettings } from "@/lib/cached-api";
import {
  buildDeepLinkPath,
  buildWebsiteRedirectPath,
  DEFAULT_APP_STORE_URL,
  DEFAULT_PLAY_STORE_URL,
  DEEP_LINK_COPY,
  getMobilePlatform,
  type DeepLinkRoute,
} from "@/lib/deep-link";
import { createNoIndexMetadata } from "@/lib/seo";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const SITE_URL =
  process.env.NEXT_PUBLIC_WEBSITE_URL || "https://home-healers.com";

type DeepLinkPageProps = {
  route: DeepLinkRoute;
  params: Promise<{ locale: string; segments?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getQueryId(
  route: DeepLinkRoute,
  searchParams: Record<string, string | string[] | undefined>,
): string | undefined {
  const keys: Record<DeepLinkRoute, string | null> = {
    doctor: "doctorId",
    service: "categoryId",
    reservation: "reservationId",
    offers: null,
    home: null,
  };

  const key = keys[route];
  if (!key) return undefined;

  const value = searchParams[key];
  return typeof value === "string" ? value : undefined;
}

export async function generateDeepLinkMetadata(
  route: DeepLinkRoute,
  locale: string,
) {
  const copy = DEEP_LINK_COPY[route][locale === "en" ? "en" : "ar"];

  return createNoIndexMetadata(locale, `/${route}`, {
    title: copy.title,
    description: copy.description,
  });
}

export default async function DeepLinkPage({
  route,
  params,
  searchParams,
}: DeepLinkPageProps) {
  const { locale, segments } = await params;
  const resolvedSearchParams = await searchParams;
  const queryId = getQueryId(route, resolvedSearchParams);

  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  if (getMobilePlatform(userAgent) === "desktop") {
    redirect(buildWebsiteRedirectPath(locale, route, segments));
  }

  const settings = await getCachedSettings(locale);
  const settingsData = settings?.data?.[0]?.setting;

  const path = buildDeepLinkPath(route, segments, queryId);
  const targetUrl = `${SITE_URL}${path}`;

  return (
    <DeepLinkLanding
      route={route}
      locale={locale}
      targetUrl={targetUrl}
      androidUrl={settingsData?.android_link || DEFAULT_PLAY_STORE_URL}
      iosUrl={settingsData?.ios_link || DEFAULT_APP_STORE_URL}
    />
  );
}
