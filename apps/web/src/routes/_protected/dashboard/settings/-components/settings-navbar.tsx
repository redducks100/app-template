import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "@tanstack/react-router";
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

export const SettingsNavbar = () => {
  const navigationItems = settingsNavigation.flatMap((x) => x.items);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation("settings");
  const { t: tCommon } = useTranslation("common");
  const selectedItem =
    navigationItems.find((x) => pathname.includes(x.value)) || navigationItems[0];
  const selectedValue = selectedItem.value;

  function onNavigationItemClick(value: string) {
    navigate({ to: `/dashboard/settings/${value}` });
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="lg:hidden mr-2 data-[orientation=vertical]:h-4"
        />
        <div className="lg:hidden flex flex-1 flex-row items-center gap-4">
          <p>{tCommon("settings")}</p>
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Select items={navigationItems} value={selectedValue}>
            <SelectTrigger className="w-full max-w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              <SelectGroup>
                {navigationItems.map((x) => (
                  <SelectItem
                    key={x.value}
                    value={x.value}
                    onClick={() => onNavigationItemClick(x.value)}
                  >
                    {itemTranslationKeys[x.value]
                      ? t(`navigation.${itemTranslationKeys[x.value]}`)
                      : x.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
};
