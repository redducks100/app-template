"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const DashboardNavMain = ({
  items,
  sectionTitle,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
  sectionTitle: string;
}) => {
  const path = usePathname();
  const paths = path.toLowerCase().split("/");
  const lastPath = paths[paths.length - 1];
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{sectionTitle}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={lastPath.includes(item.title.toLowerCase())}
                render={
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                }
              ></SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
