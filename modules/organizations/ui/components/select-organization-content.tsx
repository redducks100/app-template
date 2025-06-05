"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";
import { PlusIcon } from "lucide-react";

export const SelectOrganizationContent = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<boolean>(false);

  const { data: organizations } = useSuspenseQuery(
    trpc.organizations.getMany.queryOptions(),
  );

  const { data: activeOrganization } = useSuspenseQuery(
    trpc.organizations.getActiveOrganization.queryOptions(),
  );

  const onCreateOrganization = () => {
    router.push("/create-org");
  };

  const onSelectOrganization = async (selectOrganizationId: string) => {
    if (selectOrganizationId === activeOrganization?.id) {
      toast.info("This organization is already active");
      return;
    }
    setLoading(true);

    const result = await authClient.organization.setActive({
      organizationId: selectOrganizationId,
    });

    if (result.error) {
      toast.error(result.error.message);
      return;
    }

    await queryClient.invalidateQueries(
      trpc.organizations.getActiveOrganization.queryOptions(),
    );

    router.push("/dashboard");
  };

  return (
    <>
      <ScrollArea className="max-h-[200px] rounded-md p-4">
        <div className="space-y-2">
          {organizations.map((org) => {
            return (
              <Button
                key={org.id}
                variant="ghost"
                onClick={() => onSelectOrganization(org.id)}
                disabled={loading}
                className={
                  "flex items-center w-full rounded-lg px-4 py-8 border border-border transition-all"
                }
              >
                {org.logo ? (
                  <Avatar className="rounded-md size-9 mr-3">
                    <AvatarImage src={org.logo} />
                  </Avatar>
                ) : (
                  <GeneratedAvatar
                    seed={org.name}
                    className="rounded-md size-9 mr-3"
                  />
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{org.name}</h3>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-500">
                      {org.role.toUpperCase()}
                    </span>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      <div className="pt-4 border-t">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 p-2"
          onClick={onCreateOrganization}
        >
          <PlusIcon className="size-4" />
          Create new organization
        </Button>
      </div>
    </>
  );
};
