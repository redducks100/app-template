import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  BuildingIcon,
  ChartBarIcon,
  ChevronRightIcon,
  CogIcon,
  LayoutDashboardIcon,
  MailsIcon,
  ShieldIcon,
  UsersIcon,
} from "lucide-react";
import { DashboardUserButton } from "./dashboard-user-button";
import { DashboardOrganizationSwitcher } from "./dashboard-organization-switcher";
import { settingsNavigation } from "../settings/-lib/settings-navigation";
import { useTranslation } from "react-i18next";
import { Link, useMatchRoute } from "@tanstack/react-router";

export const DashboardSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { t } = useTranslation("dashboard");
  const { t: tCommon } = useTranslation("common");
  const matchRoute = useMatchRoute();

  const isSettingsActive = !!matchRoute({ to: "/settings", fuzzy: true });

  const navItems = [
    { title: t("sidebar.dashboard"), url: "/", icon: LayoutDashboardIcon },
    { title: t("sidebar.analytics"), url: "#", icon: ChartBarIcon },
    { title: t("sidebar.organization"), url: "/organization", icon: BuildingIcon },
    { title: t("sidebar.invitations"), url: "/invitations", icon: MailsIcon },
    { title: t("sidebar.roles"), url: "/roles", icon: ShieldIcon },
    { title: t("sidebar.users"), url: "/users", icon: UsersIcon },
  ];

  const settingsItems = settingsNavigation.flatMap((group) => group.items);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <DashboardOrganizationSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={!!matchRoute({ to: item.url, fuzzy: true })}
                    render={
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              ))}
              <Collapsible
                defaultOpen={isSettingsActive}
                className="group/collapsible"
                render={<SidebarMenuItem />}
              >
                <CollapsibleTrigger
                  render={
                    <SidebarMenuButton
                      tooltip={tCommon("settings")}
                      isActive={isSettingsActive}
                    >
                      <CogIcon />
                      <span>{tCommon("settings")}</span>
                      <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  }
                />
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {settingsItems.map((item) => (
                      <SidebarMenuSubItem key={item.value}>
                        <SidebarMenuSubButton
                          isActive={
                            !!matchRoute({
                              to: `/settings/${item.value}`,
                              fuzzy: true,
                            })
                          }
                          render={
                            <Link to={`/settings/${item.value}`}>
                              <span>{item.label}</span>
                            </Link>
                          }
                        />
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
};
