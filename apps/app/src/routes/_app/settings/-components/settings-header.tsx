import { useLocation } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";
import { settingsNavigation } from "../-lib/settings-navigation";
import { useTranslation } from "react-i18next";

const itemTranslationKeys: Record<string, string> = {
  profile: "profile",
  security: "security",
  sessions: "sessions",
  integrations: "oauthProviders",
  preferences: "preferences",
  danger: "dangerZone",
};

export const SettingsHeader = () => {
  const { pathname } = useLocation();
  const segment = pathname.split("/").pop();
  const { t } = useTranslation("settings");

  let groupKey = "account";
  let itemValue = "profile";

  for (const group of settingsNavigation) {
    for (const item of group.items) {
      if (item.value === segment) {
        groupKey = group.key;
        itemValue = item.value;
        break;
      }
    }
  }

  const translatedGroup = t(`navigation.${groupKey}`);
  const translatedItem = itemTranslationKeys[itemValue]
    ? t(`navigation.${itemTranslationKeys[itemValue]}`)
    : itemValue;

  return (
    <>
      <div className="pt-8 pb-0 md:pt-10">
        <p className="text-sm font-medium text-muted-foreground mb-1">
          {translatedGroup}
        </p>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">
          {translatedItem}
        </h1>
      </div>
      <Separator className="mt-2" orientation="horizontal" />
    </>
  );
};
