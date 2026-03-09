import { useAppForm } from "@/components/ui/form/hooks";
import { Field, FieldGroup } from "@/components/ui/field";
import { SelectItem } from "@/components/ui/select";
import { createInvitationSchema } from "@app/shared/schemas/create-invitation-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { rolesListOptions } from "@/lib/query-options/roles";
import { createInvitation as createInvitationMutation } from "@/lib/mutations/invitations";

export const CreateInvitationForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { t } = useTranslation("invitations");
  const queryClient = useQueryClient();

  const { data: roles } = useQuery(rolesListOptions());

  const assignableRoles = (roles ?? []).filter((r) => r.role !== "owner");

  const createInvitation = useMutation({
    mutationFn: createInvitationMutation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["invitations", "list"],
      });
      toast.success(t("sentSuccess"));
      form.reset();
      onSuccess?.();
    },
  });

  const form = useAppForm({
    defaultValues: {
      email: "",
      role: "member",
    },
    validators: {
      onSubmit: createInvitationSchema,
    },
    onSubmit: async ({ value }) => {
      await createInvitation.mutateAsync(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField name="email">
          {(field) => (
            <field.Input
              label={t("email")}
              placeholder={t("emailPlaceholder")}
            />
          )}
        </form.AppField>

        <form.AppField name="role">
          {(field) => (
            <field.Select
              label={t("role")}
              items={assignableRoles.map((r) => ({
                value: r.role,
                label: r.role.charAt(0).toUpperCase() + r.role.slice(1),
              }))}
            >
              {assignableRoles.map((r) => (
                <SelectItem key={r.role} value={r.role}>
                  {r.role.charAt(0).toUpperCase() + r.role.slice(1)}
                </SelectItem>
              ))}
            </field.Select>
          )}
        </form.AppField>

        <Field>
          <form.AppForm>
            <div className="flex justify-end">
              <form.SubmitButton label={t("sendInvitation")} />
            </div>
          </form.AppForm>
        </Field>
      </FieldGroup>
    </form>
  );
};
