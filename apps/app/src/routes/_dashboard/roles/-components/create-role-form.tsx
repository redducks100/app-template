import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppForm } from "@/components/ui/form/hooks";
import { createRoleFormSchema } from "@app/shared/schemas/create-role-schema";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { toRolePermissions, fromRolePermissions } from "@app/shared/types/roles";
import { PermissionEditor } from "./permission-editor";
import { createRole as createRoleMutation } from "@/lib/mutations/roles";
import { rolesListOptions } from "@/lib/query-options/roles";

export const CreateRoleForm = () => {
  const { t } = useTranslation("roles");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: roles } = useSuspenseQuery(rolesListOptions());

  const createRole = useMutation({
    mutationFn: createRoleMutation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["roles", "list"] });
      toast.success(t("createSuccess"));
      navigate({ to: "/roles" });
    },
  });

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

  const handleTemplateChange = (roleId: string) => {
    if (roleId === "blank") {
      form.setFieldValue("permissions", []);
      return;
    }
    const templateRole = roles.find((r) => r.id === roleId);
    if (templateRole) {
      form.setFieldValue("permissions", fromRolePermissions(templateRole.permission));
    }
  };

  // Exclude owner from templates
  const templateRoles = roles.filter((r) => r.role !== "owner");

  return (
    <div className="space-y-6">
      <Link
        to="/roles"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeftIcon className="size-4" />
        {t("backToRoles")}
      </Link>

      <h2 className="text-xl font-semibold">{t("newRole")}</h2>

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
        </div>

        {/* Template selector */}
        <div className="mt-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-foreground">
                {t("startFromTemplate")}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("templateDescription")}
              </p>
            </div>
            <Select
              defaultValue="blank"
              onValueChange={handleTemplateChange}
              items={[
                { value: "blank", label: t("blank") },
                ...templateRoles.map((r) => ({ value: r.id, label: r.role.charAt(0).toUpperCase() + r.role.slice(1) })),
              ]}
            >
              <SelectTrigger className="w-48 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blank">{t("blank")}</SelectItem>
                {templateRoles.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    <span className="capitalize">{r.role}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-foreground mb-2">
            {t("permissions")}
          </h4>
          <form.AppField name="permissions">
            {(field) => (
              <PermissionEditor
                value={field.state.value}
                onChange={(val) => field.handleChange(val)}
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
    </div>
  );
};
