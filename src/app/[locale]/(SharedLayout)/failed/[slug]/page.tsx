import ClientAPI from "@/app/api/api";
import initTranslations from "@/app/i18n";
import PaymentFail from "@/components/fail";
import { createMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";

type props = {
  params: { locale: string; slug: string };
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const { t } = await initTranslations(locale, ["homepage"]);
  const settings = await ClientAPI.getSettings(locale);
  const seo = settings?.data[0]?.setting?.seo["services"];

  return createMetadata(seo, locale, `/failed/${slug}`, {
    title: "Home Hellers",
  }, { preferPathCanonical: true });
}

async function page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["aboutUs"]);
  const servicesData = await ClientAPI.getAllServices(locale);
  const settings = await ClientAPI.getSettings(locale);

  const homeBanners = settings?.data?.[0]?.setting?.banners?.filter(
    (banner: any) => banner.page === "services"&& banner.type === "web"
  );
  return <PaymentFail />;
}

export default page;
