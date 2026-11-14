import RouteTranslations from "@/Providers/route-translations";

export default async function ReviewLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <RouteTranslations locale={locale} namespaces={["review"]}>
      {children}
    </RouteTranslations>
  );
}
