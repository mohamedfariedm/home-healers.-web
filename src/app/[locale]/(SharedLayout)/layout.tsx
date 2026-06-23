import { getCachedHomeData, getCachedSettings } from "@/lib/cached-api";
import { Footer, Header } from "@/components/Layout";
import DeferredFloatingContact from "@/components/DeferredFloatingContact";
import { IS_RAMADAN_ACTIVE } from "@/constants/ramadan";
import { IS_WORLD_CUP_ACTIVE } from "@/constants/world-cup";
import RamadanBanner, { RamadanBackgroundDecorations } from "@/components/RamadanOverlay";
import WorldCupAside from "@/components/WorldCupAside";
import { i18nRouterConfig } from "@/i18nRouterConfig";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!i18nRouterConfig.locales.includes(locale as "ar" | "en")) {
    redirect("/ar/notfound/404");
  }

  const [homeData, settings] = await Promise.all([
    getCachedHomeData(locale),
    getCachedSettings(locale),
  ]);
  const footerSection = homeData?.data?.sections.find(
    (section: any) => section?.id === 6
  );
  return (
    <>
      {IS_WORLD_CUP_ACTIVE && <WorldCupAside />}
      <Header locale={locale} />
      {IS_RAMADAN_ACTIVE && <RamadanBanner position="top" />}
      {IS_RAMADAN_ACTIVE && <RamadanBackgroundDecorations />}
      {children}
      {IS_RAMADAN_ACTIVE && <RamadanBanner position="bottom" />}
      <Footer settings={settings} section={footerSection} locale={locale} />
      <DeferredFloatingContact settings={settings} locale={locale} />
    </>
  );
}
