import { i18nRouterConfig } from "@/i18nRouterConfig";
import { dir } from "i18next";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import GlobalProvider from "../../Providers";
import "../../styles/globals.css";
import { Alexandria } from 'next/font/google';
import { Toaster } from "sonner";
import Script from "next/script";
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
  if (!i18nRouterConfig.locales.includes(locale as "ar" | "en")) {
    redirect("/notfound/404");
  }

  // Generate structured data schemas
  const organizationSchema = createOrganizationSchema(defaultOrganizationData);
  const websiteSchema = createWebsiteSchema({
    name: "Home Healers",
    url: "https://home-healers.com",
    description: "Professional healthcare services at your doorstep",
  });

  return (
    <html lang={locale} dir={dir(locale)}>
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TDDDW3G3');`}
        </Script>
      </head>
      <body className={alexandria.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TDDDW3G3"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
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
