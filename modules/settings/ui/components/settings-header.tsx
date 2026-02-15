"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { settingsNavigation } from "../constants/settings-navigation";
import { useTranslations } from "next-intl";

const itemTranslationKeys: Record<string, string> = {
  profile: "profile",
  security: "security",
  sessions: "sessions",
  integrations: "oauthProviders",
  preferences: "preferences",
  danger: "dangerZone",
};

export const SettingsHeader = () => {
  const pathname = usePathname();
  const segment = pathname.split("/").pop();
  const t = useTranslations("settings.navigation");

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

  const translatedGroup = t(groupKey);
  const translatedItem = itemTranslationKeys[itemValue]
    ? t(itemTranslationKeys[itemValue])
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
