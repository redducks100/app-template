"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  BuildingIcon,
  ChartBarIcon,
  CogIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  MailsIcon,
  UsersIcon,
} from "lucide-react";
import { DashboardUserButton } from "./dashboard-user-button";
import { DashboardOrganizationSwitcher } from "./dashboard-organization-switcher";
import { DashboardNavMain } from "./dashboard-nav-main";
import { DashboardNavSecondary } from "./dashboard-nav-secondary";
import { useTranslations } from "next-intl";

export const DashboardSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const t = useTranslations("dashboard.sidebar");
  const tCommon = useTranslations("common");

  const navMain = {
    items: [
      {
        title: t("dashboard"),
        url: "/dashboard",
        icon: LayoutDashboardIcon,
      },
      {
        title: t("analytics"),
        url: "#",
        icon: ChartBarIcon,
      },
    ],
    sectionTitle: t("dashboardSection"),
  };

  const navSecondary = {
    items: [
      {
        title: t("organization"),
        url: "/dashboard/organization",
        icon: BuildingIcon,
      },
      {
        title: t("invitations"),
        url: "/dashboard/invitations",
        icon: MailsIcon,
      },
      {
        title: t("users"),
        url: "#",
        icon: UsersIcon,
      },
    ],
    sectionTitle: t("organizationSection"),
  };

  const navFooter = [
    {
      title: tCommon("settings"),
      url: "/dashboard/settings",
      icon: CogIcon,
    },
    {
      title: tCommon("getHelp"),
      url: "#",
      icon: HelpCircleIcon,
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <DashboardOrganizationSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <DashboardNavMain
          items={navMain.items}
          sectionTitle={navMain.sectionTitle}
        />
        <DashboardNavMain
          items={navSecondary.items}
          sectionTitle={navSecondary.sectionTitle}
        />
        <DashboardNavSecondary items={navFooter} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
};
