import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { BuildingIcon, Link2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";
import { updateOrganization as updateOrganizationMutation } from "@/lib/mutations/organizations";
import { activeOrganizationOptions } from "@/lib/queries/organizations";
import { updateOrganizationSchema } from "@app/shared/schemas/update-organization-schema";
import { Button } from "@app/ui/components/button";
import {
  ConfirmDialog,
  ConfirmDialogContent,
  ConfirmDialogDescription,
  ConfirmDialogFooter,
  ConfirmDialogHeader,
  ConfirmDialogTitle,
  ConfirmDialogTrigger,
} from "@app/ui/components/confirm-dialog";
import { FieldGroup } from "@app/ui/components/field";
import { useAppForm } from "@app/ui/components/form/hooks";
import { Separator } from "@app/ui/components/separator";

export const OrganizationSettingsSection = () => {
  const { t } = useTranslation("organization");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: activeOrg } = useQuery(activeOrganizationOptions());

  const updateOrganization = useMutation({
    mutationFn: updateOrganizationMutation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["organizations", "active"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["organizations", "list"],
      });
      toast.success("Organization updated successfully");
    },
  });

  const form = useAppForm({
    defaultValues: {
      organizationId: activeOrg?.id ?? "",
      name: activeOrg?.name ?? "",
      slug: activeOrg?.slug ?? "",
    },
    validators: {
      onSubmit: updateOrganizationSchema.extend({
        organizationId: z.string(),
      }),
    },
    onSubmit: async ({ value }) => {
      await updateOrganization.mutateAsync(value);
    },
  });

  const handleDelete = async () => {
    const { error } = await authClient.organization.delete({
      organizationId: (await authClient.getSession()).data?.session.activeOrganizationId ?? "",
    });

    if (error) {
      toast.error(error.message || t("danger.deleteError"));
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["organizations"] });
    toast.success(t("danger.deleteSuccess"));
    navigate({ to: "/" });
  };

  if (!activeOrg) return null;

  return (
    <form
      id="org-settings-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <div>
          <form.AppField name="name">
            {(field) => (
              <field.Input
                label="Name"
                description="The display name of your organization."
                placeholder="Acme Organization"
                LeftIcon={BuildingIcon}
                row
              />
            )}
          </form.AppField>

          <Separator orientation="horizontal" />

          <form.AppField name="slug">
            {(field) => (
              <field.Input
                label="Slug"
                description="Used in URLs to identify your organization."
                placeholder="acme-organization"
                LeftIcon={Link2Icon}
                row
              />
            )}
          </form.AppField>

          <Separator orientation="horizontal" />

          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium">{t("danger.deleteOrganization")}</p>
              <p className="text-sm text-muted-foreground">{t("danger.deleteDescription")}</p>
            </div>
            <ConfirmDialog>
              <ConfirmDialogTrigger>
                <Button type="button" variant="destructive" size="sm">
                  {t("danger.deleteOrganization")}
                </Button>
              </ConfirmDialogTrigger>
              <ConfirmDialogContent>
                <ConfirmDialogHeader>
                  <ConfirmDialogTitle>{t("danger.confirmTitle")}</ConfirmDialogTitle>
                  <ConfirmDialogDescription>
                    {t("danger.confirmDescription")}
                  </ConfirmDialogDescription>
                </ConfirmDialogHeader>
                <ConfirmDialogFooter
                  variant="destructive"
                  confirmLabel={t("danger.confirm")}
                  cancelLabel={t("danger.cancel")}
                  onConfirm={handleDelete}
                />
              </ConfirmDialogContent>
            </ConfirmDialog>
          </div>
        </div>
      </FieldGroup>
    </form>
  );
};
