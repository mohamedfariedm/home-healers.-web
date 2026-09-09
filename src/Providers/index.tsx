import initTranslations from "@/app/i18n";
import ClientComponentsTranslationsProvider from "./client-components-translations-provider";
import ThemeProvider from "./theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { RamadanProvider } from "./ramadan-provider";
import { IS_RAMADAN_ACTIVE } from "@/constants/ramadan";

const i18nNamespaces = [
  "common",
  "homepage",
  "offers",
  "aboutUs",
  "contactUs",
  "blog",
  "booking",
  "doctor-apply",
  "invite-doctor",
  "review",
];

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
        defaultTheme="light"
        forcedTheme="light" 
        enableSystem
        disableTransitionOnChange
      >
        <RamadanProvider isRamadan={IS_RAMADAN_ACTIVE}>
          <ClientComponentsTranslationsProvider
            namespaces={i18nNamespaces}
            locale={locale}
            resources={resources}
          >
            {children}
            <Toaster />
          </ClientComponentsTranslationsProvider>
        </RamadanProvider>
      </ThemeProvider>
    </>
  );
}
