import { createFileRoute } from "@tanstack/react-router";
import { LanguageSection } from "./-components/language-section";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute(
  "/_app/settings/preferences",
)({
  component: SettingsPreferencesPage,
});

function SettingsPreferencesPage() {
  const { i18n } = useTranslation();
  const locale = (i18n.language as "en" | "ro") ?? "en";

  return (
    <div className="py-8 md:py-10">
      <LanguageSection locale={locale} />
    </div>
  );
}
