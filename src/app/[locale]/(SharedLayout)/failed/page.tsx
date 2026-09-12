import PaymentFail from "@/components/fail";
import { createNoIndexMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return createNoIndexMetadata(locale, "/failed", {
    title: "Home Healers | Payment failed",
    description: "The Home Healers payment could not be completed",
  });
}

async function page() {
  return <PaymentFail />;
}

export default page;
