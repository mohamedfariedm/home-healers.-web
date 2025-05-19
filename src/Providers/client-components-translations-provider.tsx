"use client";

import { I18nextProvider } from "react-i18next";
import { createInstance } from "i18next";
import React from "react";
import initTranslations from "@/app/i18n";

type props = {
  children: React.ReactNode;
  locale: string;
  namespaces: string[];
  resources: any;
};
export default function ClientComponentsTranslationsProvider({
  children,
  locale,
  namespaces,
  resources,
}: props) {
  const i18n = createInstance();

  initTranslations(locale, namespaces, i18n, resources);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
