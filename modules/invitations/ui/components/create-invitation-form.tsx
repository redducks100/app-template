"use client";

import { useAppForm } from "@/components/ui/form/hooks";
import { Field, FieldGroup } from "@/components/ui/field";
import { SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { createInvitationSchema } from "@/modules/schemas/create-invitation-schema";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MailIcon, ShieldIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export const CreateInvitationForm = () => {
  const t = useTranslations("invitations");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createInvitation = useMutation(
    trpc.invitations.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.invitations.getMany.queryOptions(),
        );
        toast.success(t("sentSuccess"));
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      email: "",
      role: "member" as "admin" | "member",
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
        <div className="rounded-xl border border-border bg-card">
          <form.AppField name="email">
            {(field) => (
              <field.Input
                label={t("email")}
                description={t("emailDescription")}
                placeholder={t("emailPlaceholder")}
                LeftIcon={MailIcon}
                row
              />
            )}
          </form.AppField>

          <Separator orientation="horizontal" />

          <form.AppField name="role">
            {(field) => (
              <field.Select
                label={t("role")}
                description={t("roleDescription")}
                items={[
                  { value: "member", label: t("member") },
                  { value: "admin", label: t("admin") },
                ]}
                row
              >
                <SelectItem value="member">{t("member")}</SelectItem>
                <SelectItem value="admin">{t("admin")}</SelectItem>
              </field.Select>
            )}
          </form.AppField>
        </div>

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
