import RouteTranslations from "@/Providers/route-translations";

export default async function OffersLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Offer book flow also uses booking payment copy
  return (
    <RouteTranslations locale={locale} namespaces={["offers", "booking"]}>
      {children}
    </RouteTranslations>
  );
}
