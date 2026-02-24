import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SearchIcon } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
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

export function SettingsSidebar() {
  const { pathname } = useLocation();
  const { t } = useTranslation("settings");
  const { t: tCommon } = useTranslation("common");
  const items = settingsNavigation.flatMap((x) => x.items);
  const selectedItem =
    items.find((x) => pathname.includes(x.value)) || items[0];
  const selectedValue = selectedItem.value;

  return (
    <Sidebar
      collapsible="none"
      className="hidden lg:flex lg:rounded-l-xl lg:ml-0 bg-background border-r"
    >
      <SidebarHeader className="gap-2 p-2 flex flex-col">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex flex-col gap-2 p-2">
              <h1 className="font-semibold">{tCommon("settings")}</h1>
              <InputGroup>
                <InputGroupInput placeholder={tCommon("search")} />
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
              </InputGroup>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem></SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {settingsNavigation.map((group) => (
          <SidebarGroup key={group.key}>
            <SidebarGroupLabel>
              {t(`navigation.${group.key}`)}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = selectedValue === item.value;
                  const translationKey = itemTranslationKeys[item.value];
                  return (
                    <SidebarMenuItem key={item.value}>
                      <SidebarMenuButton
                        isActive={isActive}
                        render={
                          <Link to={`/dashboard/settings/${item.value}`}>
                            {item.icon && <item.icon />}
                            <span>
                              {translationKey
                                ? t(`navigation.${translationKey}`)
                                : item.label}
                            </span>
                          </Link>
                        }
                      />
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
