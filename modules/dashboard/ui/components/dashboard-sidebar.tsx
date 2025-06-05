"use client";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { LayoutDashboardIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "./dashboard-user-button";
import { DashboardOrganizationSwitcher } from "./dashboard-organization-switcher";

const section = [
  {
    icon: LayoutDashboardIcon,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: UserIcon,
    label: "Users",
    href: "/users",
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="text-sidebar-accent-foreground">
        <div className="flex items-center px-2 pt-2">
          <Link href="/">
            <h1 className="text-xl font-bold">TEMPLATEAPP</h1>
          </Link>
        </div>
      </SidebarHeader>
      <div className="px-2 py-2">
        <Separator className="text-sidebar-foreground" />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <DashboardOrganizationSwitcher />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {section.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-sidebar-foreground/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                    pathname === item.href &&
                      "bg-linear-to-r/oklch border-sidebar-foreground/10",
                  )}
                  isActive={pathname === item.href}
                >
                  <Link href={item.href}>
                    <item.icon className="size-5" />
                    <span className="text-sm font-medium tracking-tight">
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
};
