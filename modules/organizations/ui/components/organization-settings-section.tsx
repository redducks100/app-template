"use client";

import { BuildingIcon, Link2Icon } from "lucide-react";
import { useAppForm } from "@/components/ui/form/hooks";
import { Field, FieldGroup } from "@/components/ui/field";
import { updateOrganizationSchema } from "@/modules/schemas/update-organization-schema";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export const OrganizationSettingsSection = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: activeOrg } = useQuery(
    trpc.organizations.getActiveOrganization.queryOptions(),
  );

  const updateOrganization = useMutation(
    trpc.organizations.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.organizations.getActiveOrganization.queryOptions(),
        );
        await queryClient.invalidateQueries(
          trpc.organizations.getMany.queryOptions(),
        );
        router.refresh();
        toast.success("Organization updated successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      organizationId: activeOrg?.id ?? "",
      name: activeOrg?.name ?? "",
      slug: activeOrg?.slug ?? "",
    },
    validators: {
      onSubmit: updateOrganizationSchema,
    },
    onSubmit: async ({ value }) => {
      await updateOrganization.mutateAsync(value);
    },
  });

  if (!activeOrg) return null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <section>
          <h3 className="text-base font-semibold text-foreground mb-4">
            General
          </h3>
          <div className="rounded-xl border border-border bg-card">
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
          </div>
        </section>

        <Field>
          <form.AppForm>
            <div className="flex justify-end">
              <form.SubmitButton label="Update" />
            </div>
          </form.AppForm>
        </Field>
      </FieldGroup>
    </form>
  );
};
