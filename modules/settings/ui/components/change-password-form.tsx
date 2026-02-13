import { Field, FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/components/ui/form/hooks";
import { authClient } from "@/lib/auth/auth-client";
import { changePasswordSchema } from "@/modules/schemas/change-password-schema";
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
        <form.AppField name="password">
          {(field) => (
            <field.Input
              label="Password"
              type="password"
              description="Your current password."
              LeftIcon={LockIcon}
            />
          )}
        </form.AppField>
        <form.AppField name="newPassword">
          {(field) => (
            <field.Input
              label="New Password"
              type="password"
              description="Your new pasword. No less than 8 characters."
              LeftIcon={LockIcon}
            />
          )}
        </form.AppField>

        <form.AppField name="confirmPassword">
          {(field) => (
            <field.Input
              label="Repeat Password"
              type="password"
              description="Repeat the new password."
              LeftIcon={LockIcon}
            />
          )}
        </form.AppField>

        <form.AppField name="revokeSessions">
          {(field) => (
            <field.Checkbox
              label="Sign out other sessions"
              description="This will log out all of the other sessions."
            />
          )}
        </form.AppField>

        <Field>
          <form.AppForm>
            <form.SubmitButton className="md:max-w-fit" label="Change" />
          </form.AppForm>
        </Field>
      </FieldGroup>
    </form>
  );
};
