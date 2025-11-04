import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useAppForm } from "@/components/ui/form/hooks";
import { authClient } from "@/lib/auth/auth-client";
import { forgotPasswordSchema } from "@/modules/schemas/forgot-password-schema";
import { toast } from "sonner";

type SendChangePasswordEmailForm = {
  email: string;
};

export const SendChangePasswordEmailForm = ({
  email,
}: SendChangePasswordEmailForm) => {
  const form = useAppForm({
    defaultValues: {
      email: email,
    },
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.forgetPassword(
        {
          email: value.email,
          redirectTo: "/dashboard/account",
        },
        {
          onError: (error) => {
            toast.error(
              error.error.message || "Failed to send password reset email."
            );
          },
          onSuccess: () => {
            toast.success("Password reset email sent");
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
        <Field>
          <FieldLabel>Set Password</FieldLabel>
          <FieldDescription>
            We will send you a password reset email to set up a password.
          </FieldDescription>
          <form.AppForm>
            <form.SubmitButton
              className="md:max-w-fit"
              timer={30}
              label="Send"
              dontStartOnRender={true}
            />
          </form.AppForm>
        </Field>
      </FieldGroup>
    </form>
  );
};
