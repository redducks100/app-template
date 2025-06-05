"use client";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";
import { useTRPC } from "@/trpc/client";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDown,
  Loader2Icon,
  PlusIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const DashboardOrganizationSwitcher = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: activeOrganization, isLoading } = useQuery(
    trpc.organizations.getActiveOrganization.queryOptions(),
  );

  const { data: organizations, isLoading: isOrganizationsLoading } = useQuery(
    trpc.organizations.getMany.queryOptions(),
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
      trpc.organizations.getActiveOrganization.queryOptions(),
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-md border border-border/10 p-2 gap-x-2 flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden">
        {activeOrganization.logo ? (
          <Avatar className="rounded-md size-6 mr-2">
            <AvatarImage src={activeOrganization.logo} />
          </Avatar>
        ) : (
          <GeneratedAvatar
            seed={activeOrganization.name}
            className="rounded-md size-6 mr-2"
          />
        )}
        <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
          <p className="text-sm truncate w-full">{activeOrganization.name}</p>
        </div>
        <ChevronDown className="size-4 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>
          <p className="text-sm font-medium text-muted-foreground">
            Switch Organization
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isOrganizationsLoading || !organizations ? (
          <div className="flex items-center p-2">
            <Loader2Icon className="mx-auto size-9 animate-spin" />
          </div>
        ) : (
          organizations.map((org) => (
            <DropdownMenuItem
              key={org.id}
              className="cursor-pointer w-full flex items-center justify-between gap-2 p-2"
              onClick={() => onOrganizationSwitch(org.id)}
            >
              <div className="flex items-center mr-2">
                {activeOrganization.logo ? (
                  <Avatar className="rounded-md size-9 mr-4">
                    <AvatarImage src={activeOrganization.logo} />
                  </Avatar>
                ) : (
                  <GeneratedAvatar
                    seed={activeOrganization.name}
                    className="rounded-md size-9 mr-4"
                  />
                )}
                <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                  <span className="text-sm truncate w-full">{org.name}</span>
                  <span className="text-xs text-muted-foreground w-full">
                    {org.role.toUpperCase()}
                  </span>
                </div>
              </div>
              {activeOrganization.id === org.id ? (
                <CheckIcon className="size-4 shrink-0" />
              ) : (
                <ArrowRightIcon className="size-4 shrink-0" />
              )}
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer w-full flex items-center justify-between gap-2 p-2"
          onClick={onOrganizationCreate}
        >
          <div className="flex items-center mr-2">
            <PlusIcon className="size-4 mr-4 shrink-0" />
            <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
              <span className="text-sm w-full">Create Organization</span>
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
