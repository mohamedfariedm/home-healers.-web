import PaymentSuccess from "@/components/success";
import { createNoIndexMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  return createNoIndexMetadata(locale, `/success/${slug}`, {
    title: "Home Healers | Payment successful",
    description: "Your Home Healers payment was completed successfully",
  });
}

async function page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  return <PaymentSuccess orderRef={slug} />;
}

export default page;
