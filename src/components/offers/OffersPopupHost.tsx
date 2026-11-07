import { getCachedSettings } from "@/lib/cached-api";
import { extractOfferPopups } from "@/types/offer-popup";
import OffersPopup from "./OffersPopup";

export default async function OffersPopupHost({
  locale,
}: {
  locale: string;
}) {
  const settings = await getCachedSettings(locale);
  const popups = extractOfferPopups(settings);

  if (!popups.length) return null;

  return (
    <OffersPopup
      locale={locale === "en" ? "en" : "ar"}
      popups={popups}
    />
  );
}
