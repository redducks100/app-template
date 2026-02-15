"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { RolePermissions } from "../../types";
import { CreateRoleForm } from "./create-role-form";
import { RoleCard } from "./role-card";

export const RolesSection = () => {
  const t = useTranslations("roles");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: roles } = useQuery(trpc.roles.getMany.queryOptions());
  const { data: activeOrg } = useQuery(
    trpc.organizations.getActiveOrganization.queryOptions(),
  );

  const invalidateRoles = async () => {
    await queryClient.invalidateQueries(trpc.roles.getMany.queryOptions());
  };

  const updateRole = useMutation(
    trpc.roles.update.mutationOptions({
      onSuccess: async () => {
        await invalidateRoles();
        toast.success(t("updateSuccess"));
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const deleteRole = useMutation(
    trpc.roles.delete.mutationOptions({
      onSuccess: async () => {
        await invalidateRoles();
        toast.success(t("deleteSuccess"));
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const isOwner = activeOrg?.role === "owner";

  const handleUpdate = (name: string, permission: RolePermissions) => {
    const role = (roles ?? []).find((r) => r.role === name);
    if (!role) return;
    updateRole.mutate({ roleId: role.id, data: { permission } });
  };

  const handleDelete = (role: { id: string; role: string }) => {
    deleteRole.mutate({ roleId: role.id });
  };

  return (
    <div className="space-y-12">
      {isOwner && (
        <section>
          <h3 className="text-base font-semibold text-foreground mb-4">
            {t("createRole")}
          </h3>
          <CreateRoleForm />
        </section>
      )}

      <section>
        <h3 className="text-base font-semibold text-foreground mb-4">
          {t("allRoles")}
        </h3>
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          {(roles ?? []).map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              onSave={handleUpdate}
              onDelete={handleDelete}
              isSaving={updateRole.isPending}
            />
          ))}

          {(roles ?? []).filter((r) => !r.isDefault).length === 0 && (
            <div className="px-4 py-3 text-sm text-muted-foreground">
              {t("noCustomRoles")}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
