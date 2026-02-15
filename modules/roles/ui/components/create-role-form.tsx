"use client";

import { useAppForm } from "@/components/ui/form/hooks";
import { Separator } from "@/components/ui/separator";
import { createRoleFormSchema } from "@/modules/schemas/create-role-schema";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  PERMISSION_MAP,
  RESOURCE_TRANSLATION_KEY,
  toRolePermissions,
} from "../../constants";

export const CreateRoleForm = () => {
  const t = useTranslations("roles");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const permissionOptions = Object.entries(PERMISSION_MAP).flatMap(
    ([resource, actions]) =>
      actions.map((action) => ({
        value: `${resource}:${action}`,
        label:
          t(
            RESOURCE_TRANSLATION_KEY[resource] as
              | "organization"
              | "members"
              | "invitations",
          ) +
          ":" +
          t(action as "read" | "create" | "update" | "delete" | "cancel"),
      })),
  );

  const createRole = useMutation(
    trpc.roles.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.roles.getMany.queryOptions());
        toast.success(t("createSuccess"));
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      name: "",
      permissions: [] as string[],
    },
    validators: { onSubmit: createRoleFormSchema },
    onSubmit: async ({ value }) => {
      await createRole.mutateAsync({
        name: value.name.trim(),
        permission: toRolePermissions(value.permissions),
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className="rounded-xl border border-border bg-card">
        <form.AppField name="name">
          {(field) => (
            <field.Input
              label={t("roleName")}
              description={t("roleNameDescription")}
              placeholder={t("roleNamePlaceholder")}
              row
            />
          )}
        </form.AppField>

        <Separator orientation="horizontal" />

        <form.AppField name="permissions">
          {(field) => (
            <field.MultiSelect
              label={t("permissions")}
              description={t("permissionsDescription")}
              placeholder={t("selectPermissions")}
              options={permissionOptions}
              row
            />
          )}
        </form.AppField>
      </div>

      <div className="flex justify-end mt-4">
        <form.AppForm>
          <form.SubmitButton label={t("createRole")} size="sm" />
        </form.AppForm>
      </div>
    </form>
  );
};
