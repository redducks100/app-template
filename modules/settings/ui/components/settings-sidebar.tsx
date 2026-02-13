"use client";

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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { settingsNavigation } from "../constants/settings-navigation";

export function SettingsSidebar() {
  const path = usePathname();
  const items = settingsNavigation.flatMap((x) => x.items);
  const selectedItem = items.find((x) => path.includes(x.value)) || items[0];
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
              <h1 className="font-semibold">Settings</h1>
              <InputGroup>
                <InputGroupInput placeholder="Search" />
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
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = selectedValue === item.value;
                  return (
                    <SidebarMenuItem key={item.value}>
                      <SidebarMenuButton
                        isActive={isActive}
                        render={
                          <Link href={`/dashboard/settings/${item.value}`}>
                            {item.icon && <item.icon />}
                            <span>{item.label}</span>
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
