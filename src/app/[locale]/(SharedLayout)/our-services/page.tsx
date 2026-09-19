import { localePath } from "@/lib/offers";
import { permanentRedirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OurServicesRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(localePath(locale, "/categories"));
}
