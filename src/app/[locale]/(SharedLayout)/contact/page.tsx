import initTranslations from "@/app/i18n";
import React from "react";
import ContactSection from "./_components/ContactForm";
import MapComponent from "./_components/MapComponent";
import { Bannar } from "../(homepage)/_components";
import { createMetadata } from "@/lib/seo";
import { PageHero } from "@/components/Shared/PageHero";
import { localePath } from "@/lib/offers";
import { getCachedSettings } from "@/lib/cached-api";
import { slimBanner, slimSettingsForContact } from "@/lib/public-payload";

export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["homepage"]);
  const settings = await getCachedSettings(locale);
  const seo = settings?.data[0]?.setting?.seo["contact"];

  return createMetadata(seo, locale, "/contact", {
    title: "Home Healers | Contact",
    description: "Contact Home Healers for in-home physiotherapy in Saudi Arabia",
  });
}

async function page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["contactUs"]);
  const settings = await getCachedSettings(locale);

  const homeBanners = settings?.data?.[0]?.setting?.banners?.filter(
    (banner: any) => banner.page === "contact"&& banner.type === "web"
  );
  return (
    <>
      <div className="page-shell bg-white">
        <PageHero
          title={t("hero.title")}
          breadcrumbItems={[
            {
              label: t("hero.home"),
              href: localePath(locale, "/"),
            },
            {
              label: t("hero.breadcrumb"),
              isActive: true,
            },
          ]}
        />
        <ContactSection settings={slimSettingsForContact(settings)} />
        <MapComponent />
        {homeBanners?.length > 0 &&
          homeBanners.map((banner: any, index: number) => (
            <Bannar key={index} banner={slimBanner(banner)} />
          ))}
      </div>
    </>
  );
}

export default page;
