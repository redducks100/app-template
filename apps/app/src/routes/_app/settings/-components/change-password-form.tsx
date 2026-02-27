import { Field, FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/components/ui/form/hooks";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { changePasswordSchema } from "@app/shared/schemas/change-password-schema";
import { LockIcon } from "lucide-react";
import { toast } from "sonner";

export const ChangePasswordForm = () => {
  const form = useAppForm({
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
      revokeSessions: false,
    },
    validators: {
      onSubmit: changePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.changePassword(
        {
          currentPassword: value.password,
          newPassword: value.newPassword,
          revokeOtherSessions: value.revokeSessions,
        },
        {
          onSuccess: () => {
            toast.success("Password changed successfully");
            form.reset();
          },
          onError: (error) => {
            toast.error(error.error.message || "Failed to change password");
          },
        }
      );
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
        <section>
          <h3 className="text-base font-semibold text-foreground mb-4">
            Password
          </h3>
          <div className="rounded-xl border border-border bg-card">
            <form.AppField name="password">
              {(field) => (
                <field.Input
                  label="Password"
                  type="password"
                  description="Your current password."
                  LeftIcon={LockIcon}
                  row
                />
              )}
            </form.AppField>

            <Separator orientation="horizontal" />

            <form.AppField name="newPassword">
              {(field) => (
                <field.Input
                  label="New Password"
                  type="password"
                  description="Your new pasword. No less than 8 characters."
                  LeftIcon={LockIcon}
                  row
                />
              )}
            </form.AppField>

            <Separator orientation="horizontal" />

            <form.AppField name="confirmPassword">
              {(field) => (
                <field.Input
                  label="Repeat Password"
                  type="password"
                  description="Repeat the new password."
                  LeftIcon={LockIcon}
                  row
                />
              )}
            </form.AppField>
          </div>
        </section>

        <section>
          <h3 className="text-base font-semibold text-foreground mb-4">
            Options
          </h3>
          <div className="rounded-xl border border-border bg-card">
            <div className="p-6">
              <form.AppField name="revokeSessions">
                {(field) => (
                  <field.Checkbox
                    label="Sign out other sessions"
                    description="This will log out all of the other sessions."
                  />
                )}
              </form.AppField>
            </div>
          </div>
        </section>

        <Field>
          <form.AppForm>
            <div className="flex justify-end">
              <form.SubmitButton label="Change" />
            </div>
          </form.AppForm>
        </Field>
      </FieldGroup>
    </form>
  );
};
