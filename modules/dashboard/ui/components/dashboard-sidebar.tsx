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

const navMain = {
  items: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Analytics",
      url: "#",
      icon: ChartBarIcon,
    },
  ],
  sectionTitle: "Dashboard",
};

const navSecondary = {
  items: [
    {
      title: "Organization",
      url: "/dashboard/organization",
      icon: BuildingIcon,
    },
    {
      title: "Invitations",
      url: "#",
      icon: MailsIcon,
    },
    {
      title: "Users",
      url: "#",
      icon: UsersIcon,
    },
  ],
  sectionTitle: "Organization",
};

const navFooter = [
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: CogIcon,
  },
  {
    title: "Get Help",
    url: "#",
    icon: HelpCircleIcon,
  },
];

export const DashboardSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
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
