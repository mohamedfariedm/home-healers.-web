import ClientAPI from "@/app/api/api";
import initTranslations from "@/app/i18n";
import { createMetadata } from "@/lib/seo";
import { AnimatedServicesSection } from "@/components/Services";
import PaymentSuccess from "@/components/success";
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

  return createMetadata(seo, locale, `/success/${slug}`, {
    title: "Home Healers",
  }, { preferPathCanonical: true });
}

async function page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  return <PaymentSuccess orderRef={slug} />;
}

export default page;
