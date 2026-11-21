import RouteTranslations from "@/Providers/route-translations";

export default async function ClaimOfferLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Claim checkout reuses offer form copy + booking payment strings.
  return (
    <RouteTranslations locale={locale} namespaces={["offers", "booking"]}>
      {children}
    </RouteTranslations>
  );
}
