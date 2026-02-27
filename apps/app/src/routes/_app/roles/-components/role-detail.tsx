import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { fromRolePermissions, toRolePermissions } from "@app/shared/types/roles";
import { PermissionEditor } from "./permission-editor";
import {
  rolesListOptions,
  activeOrganizationOptions,
} from "@/lib/query-options";
import {
  updateRole as updateRoleMutation,
  deleteRole as deleteRoleMutation,
} from "@/lib/mutations";

type RoleDetailProps = {
  roleId: string;
};

export const RoleDetail = ({ roleId }: RoleDetailProps) => {
  const { t } = useTranslation("roles");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: roles } = useSuspenseQuery(rolesListOptions());

  const { data: activeOrg } = useSuspenseQuery(activeOrganizationOptions());

  const role = roles.find((r) => r.id === roleId);
  const isOwner = activeOrg?.role === "owner";
  const isEditable = role && !role.isDefault && isOwner;

  const [permissions, setPermissions] = useState<string[]>(
    role ? fromRolePermissions(role.permission) : [],
  );

  const originalPermissions = role
    ? fromRolePermissions(role.permission)
    : [];
  const isDirty =
    JSON.stringify([...permissions].sort()) !==
    JSON.stringify([...originalPermissions].sort());

  const updateRole = useMutation({
    mutationFn: updateRoleMutation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["roles", "list"] });
      toast.success(t("updateSuccess"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteRole = useMutation({
    mutationFn: deleteRoleMutation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["roles", "list"] });
      toast.success(t("deleteSuccess"));
      navigate({ to: "/roles" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (!role) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("emptyState")}</p>
        <Link
          to="/roles"
          className="text-primary hover:underline mt-2 inline-block"
        >
          {t("backToRoles")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/roles"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeftIcon className="size-4" />
        {t("backToRoles")}
      </Link>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold capitalize">{role.role}</h2>
          {role.isDefault ? (
            <Badge variant="secondary">{t("default")}</Badge>
          ) : (
            <Badge variant="outline">{t("custom")}</Badge>
          )}
        </div>
      </div>

      {role.isDefault && (
        <p className="text-sm text-muted-foreground">
          {t("viewingDefaultRole")}
        </p>
      )}

      <PermissionEditor
        value={permissions}
        onChange={setPermissions}
        disabled={!isEditable}
      />

      {isEditable && (
        <div className="flex items-center gap-3">
          <Button
            onClick={() =>
              updateRole.mutate({
                roleId: role.id,
                data: { permission: toRolePermissions(permissions) },
              })
            }
            disabled={!isDirty || updateRole.isPending}
          >
            {t("saveChanges")}
          </Button>
          <ConfirmDialog
            title={t("deleteConfirmTitle")}
            description={t("deleteConfirm")}
            confirmLabel={t("delete")}
            cancelLabel={t("cancel")}
            variant="destructive"
            onConfirm={() => deleteRole.mutate({ roleId: role.id })}
          >
            <Button
              variant="destructive"
              disabled={deleteRole.isPending}
            >
              {t("deleteRole")}
            </Button>
          </ConfirmDialog>
        </div>
      )}
    </div>
  );
};
