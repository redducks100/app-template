import { buttonVariants } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { RolesDataTable } from "./roles-data-table";
import { useRolePermissions } from "@/lib/hooks/use-permissions";

export const RolesSection = () => {
  const { t } = useTranslation("roles");

  const { canCreate } = useRolePermissions();

  return (
    <div className="space-y-6 animate-in-page">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            {t("allRoles")}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("permissionsDescription")}</p>
        </div>
        {canCreate && (
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
