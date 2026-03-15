import { Link, useMatchRoute } from "@tanstack/react-router";
import { ChartBarIcon, CogIcon, LayoutDashboardIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

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
} from "@app/ui/components/sidebar";

import { DashboardOrganizationSwitcher } from "./dashboard-organization-switcher";
import { DashboardUserButton } from "./dashboard-user-button";

const activeClass =
  "relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-primary";

export const DashboardSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { t } = useTranslation("dashboard");
  const { t: tCommon } = useTranslation("common");
  const matchRoute = useMatchRoute();

  const isSettingsActive = !!matchRoute({ to: "/settings", fuzzy: true });

  const overviewItems = [
    { title: t("sidebar.dashboard"), url: "/", icon: LayoutDashboardIcon },
    { title: t("sidebar.analytics"), url: "#", icon: ChartBarIcon },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <DashboardOrganizationSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {/* Overview group — no label */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {overviewItems.map((item) => {
                const isActive = !!matchRoute({ to: item.url, fuzzy: true });
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive}
                      className={isActive ? activeClass : ""}
                      render={
                        <Link to={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={tCommon("settings")}
              isActive={isSettingsActive}
              className={isSettingsActive ? activeClass : ""}
              render={
                <Link to="/settings/general">
                  <CogIcon />
                  <span>{tCommon("settings")}</span>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
};
