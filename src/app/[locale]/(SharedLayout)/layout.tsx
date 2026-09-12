import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/Layout";
import ChromeFooter from "@/components/Layout/ChromeFooter";
import { IS_RAMADAN_ACTIVE } from "@/constants/ramadan";
import { IS_WORLD_CUP_ACTIVE } from "@/constants/world-cup";
import RamadanBanner, { RamadanBackgroundDecorations } from "@/components/RamadanOverlay";
import WorldCupAside from "@/components/WorldCupAside";
import { i18nRouterConfig } from "@/i18nRouterConfig";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!i18nRouterConfig.locales.includes(locale as "ar" | "en")) {
    notFound();
  }

  return (
    <>
      {IS_WORLD_CUP_ACTIVE && <WorldCupAside />}
      <Header locale={locale} />
      {IS_RAMADAN_ACTIVE && <RamadanBanner position="top" />}
      {IS_RAMADAN_ACTIVE && <RamadanBackgroundDecorations />}
      {children}
      <Suspense fallback={null}>
        <ChromeFooter locale={locale} />
      </Suspense>
    </>
  );
}
