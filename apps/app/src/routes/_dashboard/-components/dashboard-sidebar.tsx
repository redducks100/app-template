import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BuildingIcon,
  ChartBarIcon,
  CogIcon,
  LayoutDashboardIcon,
  MailsIcon,
  ShieldIcon,
  UsersIcon,
} from "lucide-react";
import { DashboardUserButton } from "./dashboard-user-button";
import { DashboardOrganizationSwitcher } from "./dashboard-organization-switcher";
import { useTranslation } from "react-i18next";
import { Link, useMatchRoute } from "@tanstack/react-router";

const activeClass = "relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-4 before:w-0.5 before:rounded-full before:bg-primary";

export const DashboardSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { t } = useTranslation("dashboard");
  const { t: tCommon } = useTranslation("common");
  const matchRoute = useMatchRoute();

  const isSettingsActive = !!matchRoute({ to: "/settings", fuzzy: true });

  const overviewItems = [
    { title: t("sidebar.dashboard"), url: "/", icon: LayoutDashboardIcon },
    { title: t("sidebar.analytics"), url: "#", icon: ChartBarIcon },
  ];

  const organizationItems = [
    { title: t("sidebar.organization"), url: "/organization", icon: BuildingIcon },
    { title: t("sidebar.invitations"), url: "/invitations", icon: MailsIcon },
    { title: t("sidebar.roles"), url: "/roles", icon: ShieldIcon },
    { title: t("sidebar.users"), url: "/users", icon: UsersIcon },
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

        {/* Organization group */}
        <SidebarGroup>
          <SidebarGroupLabel>{t("sidebar.organizationSection")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {organizationItems.map((item) => {
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
                <Link to="/settings/profile">
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
