import ClientAPI from "@/app/api/api";
import initTranslations from "@/app/i18n";
import PaymentCanceled from "@/components/canceled";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  await initTranslations(locale, ["homepage"]);
  const settings = await ClientAPI.getSettings(locale);
  const seo = settings?.data[0]?.setting?.seo["services"];

  return createMetadata(
    seo,
    locale,
    `/canceled/${slug}`,
    {
      title: "Home Hellers",
    },
    { preferPathCanonical: true }
  );
}

async function page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  return <PaymentCanceled orderRef={slug} />;
}

export default page;
