import initTranslations from "@/app/i18n";
import ClientComponentsTranslationsProvider from "./client-components-translations-provider";

const CHROME_NAMESPACES = ["common", "offers"] as const;

/**
 * Nested i18n provider for route-specific namespaces.
 * Always includes chrome namespaces so nested trees keep header/popup keys.
 */
export default async function RouteTranslations({
  locale,
  namespaces,
  children,
}: {
  locale: string;
  namespaces: string[];
  children: React.ReactNode;
}) {
  const merged = Array.from(
    new Set([...CHROME_NAMESPACES, ...namespaces]),
  );
  const { resources } = await initTranslations(locale, merged);

  return (
    <ClientComponentsTranslationsProvider
      namespaces={merged}
      locale={locale}
      resources={resources}
    >
      {children}
    </ClientComponentsTranslationsProvider>
  );
}
