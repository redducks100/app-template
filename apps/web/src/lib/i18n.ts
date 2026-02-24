import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import ro from "../locales/ro.json";

export const locales = ["en", "ro"] as const;
export const defaultLocale = "en";
export type Locale = (typeof locales)[number];

i18n.use(initReactI18next).init({
  resources: {
    en,
    ro,
  },
  lng: defaultLocale,
  fallbackLng: defaultLocale,
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
