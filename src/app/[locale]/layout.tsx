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
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

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
        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window,document,"clarity","script","wc9sy4cx56");`}
        </Script>
        {/* Tawk.to live chat */}
        <Script id="tawk-to" strategy="afterInteractive">
          {`var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
Tawk_API.customStyle={
  visibility:{
    desktop:{position:'br',xOffset:16,yOffset:16},
    mobile:{position:'br',xOffset:12,yOffset:12}
  }
};
Tawk_API.onLoad=function(){
  Tawk_API.hideWidget();
  if(window.__tawkOpenOnLoad){
    Tawk_API.maximize();
    window.__tawkOpenOnLoad=false;
    document.body.classList.add('tawk-chat-open');
    document.body.style.setProperty('--tawk-chat-bottom','13rem');
    window.dispatchEvent(new Event('tawk-chat-opened'));
  }
};
Tawk_API.onChatMaximized=function(){
  document.body.classList.add('tawk-chat-open');
  document.body.style.setProperty('--tawk-chat-bottom','13rem');
  window.dispatchEvent(new Event('tawk-chat-opened'));
};
Tawk_API.onChatMinimized=function(){
  Tawk_API.hideWidget();
  document.body.classList.remove('tawk-chat-open');
  window.dispatchEvent(new Event('tawk-chat-closed'));
};
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/6a086137c744531c43731fa0/1joobngld';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();`}
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
