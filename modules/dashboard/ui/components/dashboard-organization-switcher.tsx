"use client";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth/auth-client";
import { useTRPC } from "@/trpc/client";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDown,
  ChevronsUpDownIcon,
  Loader2Icon,
  PlusIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const DashboardOrganizationSwitcher = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isMobile } = useSidebar();

  const { data: activeOrganization, isLoading } = useQuery(
    trpc.organizations.getActiveOrganization.queryOptions()
  );

  const { data: organizations, isLoading: isOrganizationsLoading } = useQuery(
    trpc.organizations.getMany.queryOptions()
  );

  if (isLoading || !activeOrganization) {
    return null;
  }

  const onOrganizationCreate = () => {
    router.push("/create-org");
  };

  const onOrganizationSwitch = async (switchOrganizationId: string) => {
    if (switchOrganizationId === activeOrganization.id) {
      toast.info("This organization is already active");
      return;
    }

    const result = await authClient.organization.setActive({
      organizationId: switchOrganizationId,
    });

    if (result.error) {
      toast.error(result.error.message);
      return;
    }

    await queryClient.invalidateQueries(
      trpc.organizations.getActiveOrganization.queryOptions()
    );
  };

  if (!activeOrganization) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Avatar className="rounded-md">
                  <AvatarImage src={activeOrganization.logo ?? undefined} />
                  <AvatarFallback className="rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                    {activeOrganization.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeOrganization.name}
                </span>
                <span className="truncate text-xs">
                  {activeOrganization.slug}
                </span>
              </div>
              <ChevronsUpDownIcon className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Organizations
            </DropdownMenuLabel>
            {isOrganizationsLoading || !organizations ? (
              <div className="flex items-center p-2">
                <Loader2Icon className="mx-auto size-9 animate-spin" />
              </div>
            ) : (
              organizations.map((organization) => (
                <DropdownMenuItem
                  key={organization.name}
                  onClick={() => onOrganizationSwitch(organization.id)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <Avatar className="rounded-md size-6">
                      <AvatarImage src={organization.logo ?? undefined} />
                      <AvatarFallback className="rounded-md">
                        {organization.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  {organization.name}
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => onOrganizationCreate()}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <PlusIcon className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
