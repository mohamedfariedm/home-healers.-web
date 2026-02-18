import ClientAPI from "@/app/api/api";
import { Footer, Header } from "@/components/Layout";
import FloatingContact from "@/components/FloatingContact";
import { IS_RAMADAN_ACTIVE } from "@/constants/ramadan";
import RamadanBanner, { RamadanBackgroundDecorations } from "@/components/RamadanOverlay";

export default async function Layout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const homeData = await ClientAPI.getHomeData(locale);
  const footerSection = homeData?.data?.sections.find(
    (section: any) => section?.id === 6
  );
  const settings = await ClientAPI.getSettings(locale);
  return (
    <>
      <Header locale={locale} />
      {IS_RAMADAN_ACTIVE && <RamadanBanner position="top" />}
      {IS_RAMADAN_ACTIVE && <RamadanBackgroundDecorations />}
      {children}
      {IS_RAMADAN_ACTIVE && <RamadanBanner position="bottom" />}
      <Footer settings={settings} section={footerSection} locale={locale} />
      <FloatingContact settings={settings} locale={locale} />
    </>
  );
}
