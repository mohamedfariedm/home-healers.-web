import { i18nRouterConfig } from "@/i18nRouterConfig";
import { dir } from "i18next";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GlobalProvider from "../../Providers";
import "../../styles/globals.css";
import { Alexandria } from 'next/font/google';
import AnalyticsScripts from "@/components/AnalyticsScripts";
import {
  createOrganizationSchema,
  createWebsiteSchema,
  defaultOrganizationData,
  renderJsonLd,
} from "@/lib/structured-data";
import { htmlLang } from "@/lib/seo";

const alexandria = Alexandria({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-alexandria',
  preload: true,
  adjustFontFallback: true,
});

const SITE_URL =
  process.env.NEXT_PUBLIC_WEBSITE_URL || "https://home-healers.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Home Healers",
    template: "%s",
  },
  description:
    "Home Healers — in-home physiotherapy and medical rehabilitation services in Saudi Arabia",
  applicationName: "Home Healers",
  authors: [{ name: "Home Healers", url: SITE_URL }],
  creator: "Home Healers",
  publisher: "Home Healers",
  category: "healthcare",
  icons: {
    icon: "/assets/images/favicon.ico",
    shortcut: "/assets/images/favicon.ico",
    apple: "/assets/images/favicon.ico",
  },
  openGraph: {
    type: "website",
    siteName: "Home Healers",
    locale: "ar_SA",
    alternateLocale: ["en_SA"],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#143087",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!i18nRouterConfig.locales.includes(locale as "ar" | "en")) {
    notFound();
  }

  // Generate structured data schemas
  const organizationSchema = createOrganizationSchema(defaultOrganizationData);
  const websiteSchema = createWebsiteSchema({
    name: "Home Healers",
    url: "https://home-healers.com",
    description: "Professional healthcare services at your doorstep",
  });

  return (
    <html lang={htmlLang(locale)} dir={dir(locale)}>
      <head>
        <link rel="preconnect" href="https://backend.home-healers.com" />
        <link rel="dns-prefetch" href="https://backend.home-healers.com" />
        <link rel="preconnect" href="https://apis.home-healers.com" />
        <link rel="dns-prefetch" href="https://apis.home-healers.com" />
      </head>
      <body className={alexandria.className}>
        {/* Organization Schema - JSON-LD can be placed in body per Schema.org spec */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: renderJsonLd(organizationSchema) }}
        />
        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: renderJsonLd(websiteSchema) }}
        />
        <main className="w-full">
          <GlobalProvider locale={locale}>{children}</GlobalProvider>
          <AnalyticsScripts />
        </main>
      </body>
    </html>
  );
}
