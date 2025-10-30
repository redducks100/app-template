"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  ChartBarIcon,
  CogIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  UsersIcon,
} from "lucide-react";
import { DashboardUserButton } from "./dashboard-user-button";
import { DashboardOrganizationSwitcher } from "./dashboard-organization-switcher";
import { DashboardNavMain } from "./dashboard-nav-main";
import { DashboardNavSecondary } from "./dashboard-nav-secondary";

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Users",
    url: "#",
    icon: UsersIcon,
  },
  {
    title: "Analytics",
    url: "#",
    icon: ChartBarIcon,
  },
];

const navSecondary = [
  {
    title: "Settings",
    url: "/settings",
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <DashboardOrganizationSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <DashboardNavMain items={navMain} />
        <DashboardNavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <DashboardUserButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
