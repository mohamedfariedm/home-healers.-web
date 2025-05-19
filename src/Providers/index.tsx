import initTranslations from "@/app/i18n";
import ClientComponentsTranslationsProvider from "./client-components-translations-provider";
import ThemeProvider from "./theme-provider";
import { Toaster } from "@/components/ui/sonner";
import ClientComponentsAuthSessionProvider from "./client-components-auth-session-provider";

const i18nNamespaces = [ "homepage", "common", "contactUs", "blog", "complaints","products","faq","expo"];

export default async function GlobalProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        forcedTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <ClientComponentsTranslationsProvider
          namespaces={i18nNamespaces}
          locale={locale}
          resources={resources}
        >
            {children}{" "}
          <Toaster />
        </ClientComponentsTranslationsProvider>
      </ThemeProvider>
    </>
  );
}
