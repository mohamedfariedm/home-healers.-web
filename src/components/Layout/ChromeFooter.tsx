import dynamic from "next/dynamic";
import { getCachedHomeData, getCachedSettings } from "@/lib/cached-api";
import { slimHomeSection, slimSettingsForChrome } from "@/lib/public-payload";
import { IS_RAMADAN_ACTIVE } from "@/constants/ramadan";
import RamadanBanner from "@/components/RamadanOverlay";

const Footer = dynamic(() => import("@/components/Layout/Footer"));
const DeferredFloatingContact = dynamic(
  () => import("@/components/DeferredFloatingContact"),
);

export default async function ChromeFooter({ locale }: { locale: string }) {
  const [homeData, settings] = await Promise.all([
    getCachedHomeData(locale),
    getCachedSettings(locale),
  ]);
  const footerSection = slimHomeSection(
    homeData?.data?.sections.find((section: { id?: number }) => section?.id === 6),
    2,
  );
  const chromeSettings = slimSettingsForChrome(settings);

  return (
    <>
      {IS_RAMADAN_ACTIVE && <RamadanBanner position="bottom" />}
      <Footer settings={chromeSettings} section={footerSection} locale={locale} />
      <DeferredFloatingContact settings={chromeSettings} locale={locale} />
    </>
  );
}
