import { Link, useMatchRoute } from "@tanstack/react-router";
import {
  BuildingIcon,
  ChartBarIcon,
  ChevronRightIcon,
  CogIcon,
  InfoIcon,
  LayoutDashboardIcon,
  MailsIcon,
  UsersIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@app/ui/components/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@app/ui/components/dropdown-menu";
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
  useSidebar,
} from "@app/ui/components/sidebar";

import { DashboardOrganizationSwitcher } from "./dashboard-organization-switcher";
import { DashboardUserButton } from "./dashboard-user-button";

const activeClass =
  "relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-4 before:w-0.5 before:rounded-full before:bg-primary";

export const DashboardSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { t } = useTranslation("dashboard");
  const { t: tCommon } = useTranslation("common");
  const matchRoute = useMatchRoute();
  const { state } = useSidebar();

  const isSettingsActive = !!matchRoute({ to: "/settings", fuzzy: true });

  const overviewItems = [
    { title: t("sidebar.dashboard"), url: "/", icon: LayoutDashboardIcon },
    { title: t("sidebar.analytics"), url: "#", icon: ChartBarIcon },
  ];

  const organizationSubItems = [
    { title: t("sidebar.general"), url: "/organization", icon: InfoIcon },
    { title: t("sidebar.invitations"), url: "/invitations", icon: MailsIcon },
    { title: t("sidebar.users"), url: "/users", icon: UsersIcon },
  ];

  const isOrgSectionActive = organizationSubItems.some(
    (item) => !!matchRoute({ to: item.url, fuzzy: true }),
  );

  const [orgOpen, setOrgOpen] = useState(isOrgSectionActive);

  useEffect(() => {
    if (isOrgSectionActive) setOrgOpen(true);
  }, [isOrgSectionActive]);

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

        {/* Organization group — collapsible / dropdown */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                {state === "collapsed" ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <SidebarMenuButton>
                          <BuildingIcon />
                        </SidebarMenuButton>
                      }
                    />
                    <DropdownMenuContent side="right" sideOffset={4} align="start">
                      {organizationSubItems.map((item) => (
                        <DropdownMenuItem key={item.url} render={<Link to={item.url} />}>
                          <item.icon />
                          <span>{item.title}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Collapsible
                    open={orgOpen}
                    onOpenChange={setOrgOpen}
                    className="group/collapsible"
                  >
                    <CollapsibleTrigger
                      render={
                        <SidebarMenuButton tooltip={t("sidebar.organizationSection")}>
                          <BuildingIcon />
                          <span>{t("sidebar.organizationSection")}</span>
                          <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      }
                    />
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {organizationSubItems.map((item) => {
                          const isActive = !!matchRoute({ to: item.url, fuzzy: true });
                          return (
                            <SidebarMenuSubItem key={item.url}>
                              <SidebarMenuSubButton
                                isActive={isActive}
                                className={isActive ? activeClass : ""}
                                render={
                                  <Link to={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                  </Link>
                                }
                              />
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </SidebarMenuItem>
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
