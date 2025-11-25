import { i18nRouterConfig } from "@/i18nRouterConfig";
import { dir } from "i18next";
import type { Metadata } from "next";
import GlobalProvider from "../../Providers";
import "../../styles/globals.css";
import { Alexandria } from 'next/font/google';
import { Toaster } from "sonner";
import {
  createOrganizationSchema,
  createWebsiteSchema,
  defaultOrganizationData,
  renderJsonLd,
} from "@/lib/structured-data";

const alexandria = Alexandria({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-alexandria',
});

export const metadata: Metadata = {
  icons: {
    icon: "/assets/images/favicon.ico",
  },
};

export function generateStaticParams() {
  return i18nRouterConfig.locales.map((locale) => ({ locale }));
}



export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Generate structured data schemas
  const organizationSchema = createOrganizationSchema(defaultOrganizationData);
  const websiteSchema = createWebsiteSchema({
    name: "Home Healers",
    url: "https://home-healers.com",
    description: "Professional healthcare services at your doorstep",
  });

  return (
    <html lang={locale} dir={dir(locale)}>
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
           
        </main>
      </body>
    </html>
  );
}
