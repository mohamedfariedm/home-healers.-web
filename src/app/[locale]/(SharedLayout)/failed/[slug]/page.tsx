import ClientAPI from "@/app/api/api";
import initTranslations from "@/app/i18n";
import PaymentFail from "@/components/fail";
import { createMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";

type props = {
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string[] };
}) {
  const { t } = await initTranslations(locale, ["homepage"]);
  const settings = await ClientAPI.getSettings(locale);
  const seo = settings?.data[0]?.setting?.seo["services"];

  return createMetadata(seo, locale, "/failed", {
    title: "Home Hellers",
  });
}

async function page({ params: { locale } }: props) {
  const { t } = await initTranslations(locale, ["aboutUs"]);
  const servicesData = await ClientAPI.getAllServices(locale);
  const settings = await ClientAPI.getSettings(locale);

  const homeBanners = settings?.data?.[0]?.setting?.banners?.filter(
    (banner: any) => banner.page === "services"
  );
  return <PaymentFail />;
}

export default page;
