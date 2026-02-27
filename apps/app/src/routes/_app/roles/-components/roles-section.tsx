import { buttonVariants } from "@/components/ui/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { RolesDataTable } from "./roles-data-table";
import { activeOrganizationOptions } from "@/lib/query-options";

export const RolesSection = () => {
  const { t } = useTranslation("roles");

  const { data: activeOrg } = useSuspenseQuery(activeOrganizationOptions());

  const isOwner = activeOrg?.role === "owner";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">
          {t("allRoles")}
        </h3>
        {isOwner && (
          <Link
            to="/roles/create"
            className={buttonVariants({ size: "sm" })}
          >
            <PlusIcon className="size-4" />
            {t("createRole")}
          </Link>
        )}
      </div>

      <RolesDataTable />
    </div>
  );
};
