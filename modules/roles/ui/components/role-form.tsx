"use client";

import { useAppForm } from "@/components/ui/form/hooks";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import type { RoleData, RolePermissions } from "../../types";
import {
  PERMISSION_MAP,
  RESOURCE_TRANSLATION_KEY,
  fromRolePermissions,
  toRolePermissions,
} from "../../constants";

type RoleFormProps = {
  role?: RoleData | null;
  onSave: (name: string, permission: RolePermissions) => void;
  onCancel: () => void;
  isSaving?: boolean;
};

export const RoleForm = ({ role, onSave, onCancel, isSaving }: RoleFormProps) => {
  const t = useTranslations("roles");

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

  const form = useAppForm({
    defaultValues: {
      permissions: role ? fromRolePermissions(role.permission) : ([] as string[]),
    },
    onSubmit: async ({ value }) => {
      onSave(role?.role ?? "", toRolePermissions(value.permissions));
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.AppField name="permissions">
        {(field) => (
          <field.MultiSelect
            label={t("permissions")}
            placeholder={t("selectPermissions")}
            options={permissionOptions}
          />
        )}
      </form.AppField>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button type="submit" size="sm" disabled={isSaving}>
          {t("save")}
        </Button>
      </div>
    </form>
  );
};
