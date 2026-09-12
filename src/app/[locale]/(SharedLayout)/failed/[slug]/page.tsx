import PaymentFail from "@/components/fail";
import { createNoIndexMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  return createNoIndexMetadata(locale, `/failed/${slug}`, {
    title: "Home Healers | Payment failed",
    description: "The Home Healers payment could not be completed",
  });
}

async function page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  return <PaymentFail orderRef={slug} />;
}

export default page;
