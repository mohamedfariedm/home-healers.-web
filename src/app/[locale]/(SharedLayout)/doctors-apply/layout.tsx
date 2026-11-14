import RouteTranslations from "@/Providers/route-translations";

export default async function DoctorsApplyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <RouteTranslations locale={locale} namespaces={["doctor-apply"]}>
      {children}
    </RouteTranslations>
  );
}
