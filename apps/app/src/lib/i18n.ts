import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import ro from "../locales/ro.json";

export const locales = ["en", "ro"] as const;
export const defaultLocale = "en";
export type Locale = (typeof locales)[number];

function detectLocale(): Locale {
  const browserLang = navigator.language?.split("-")[0];
  return locales.includes(browserLang as Locale) ? (browserLang as Locale) : defaultLocale;
}

i18n.use(initReactI18next).init({
  resources: {
    en,
    ro,
  },
  lng: detectLocale(),
  fallbackLng: defaultLocale,
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
