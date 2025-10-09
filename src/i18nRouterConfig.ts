export const i18nRouterConfig = {
  locales: ["ar", "en"],
  defaultLocale: "ar",
  prefixDefault: false, // Arabic will NOT have /ar prefix
  serverSetCookie: "if-empty",
} as const
