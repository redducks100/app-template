import { LanguageSection } from "../components/language-section";

type SettingsLanguageViewProps = {
  locale: "en" | "ro";
};

export const SettingsLanguageView = async ({
  locale,
}: SettingsLanguageViewProps) => {
  return <LanguageSection locale={locale} />;
};
