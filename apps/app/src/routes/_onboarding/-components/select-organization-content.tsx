import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@app/ui/components/avatar";
import { authClient } from "@/lib/auth-client";
import { sessionOptions } from "@/lib/queries/auth";
import { activeOrganizationOptions, organizationsListOptions } from "@/lib/queries/organizations";

export const SelectOrganizationContent = () => {
  const { t } = useTranslation("selectOrg");
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<boolean>(false);

  const { data: organizations } = useSuspenseQuery(organizationsListOptions());

  const { data: activeOrganization } = useSuspenseQuery(activeOrganizationOptions());

  const onCreateOrganization = () => {
    navigate({ to: "/create-org" });
  };

  const onSelectOrganization = async (selectOrganizationId: string) => {
    if (selectOrganizationId === activeOrganization?.id) {
      toast.info(t("alreadyActive"));
      return;
    }
    setLoading(true);

    const result = await authClient.organization.setActive({
      organizationId: selectOrganizationId,
    });

    if (result.error) {
      toast.error(result.error.message);
      setLoading(false);
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: ["organizations", "active"],
    });

    await queryClient.fetchQuery({ ...sessionOptions(), staleTime: 0 });
    await router.invalidate();

    navigate({ to: "/" });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {organizations.map((org) => {
        const isActive = org.id === activeOrganization?.id;
        return (
          <button
            key={org.id}
            onClick={() => onSelectOrganization(org.id)}
            disabled={loading}
            className={`rounded-xl border bg-card p-5 text-left cursor-pointer transition-all hover:border-primary/50 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
              isActive ? "ring-2 ring-primary" : ""
            }`}
          >
            <Avatar className="rounded-md size-12 mb-3">
              <AvatarImage src={org.logo ?? undefined} />
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {org.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold">{org.name}</h3>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {org.role}
            </span>
          </button>
        );
      })}

      <button
        onClick={onCreateOrganization}
        disabled={loading}
        className="rounded-xl border-2 border-dashed p-5 text-left cursor-pointer transition-all hover:border-primary/50 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-2 min-h-[140px]"
      >
        <PlusIcon className="size-8 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">{t("createNew")}</span>
      </button>
    </div>
  );
};
