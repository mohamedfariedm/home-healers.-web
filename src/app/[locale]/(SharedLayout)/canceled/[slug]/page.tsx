import PaymentCanceled from "@/components/canceled";
import { createNoIndexMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  return createNoIndexMetadata(locale, `/canceled/${slug}`, {
    title: "Home Healers | Payment canceled",
    description: "The Home Healers payment was canceled",
  });
}

async function page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  return <PaymentCanceled orderRef={slug} />;
}

export default page;
