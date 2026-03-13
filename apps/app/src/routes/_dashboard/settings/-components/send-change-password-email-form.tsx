import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { forgotPasswordSchema } from "@app/shared/schemas/forgot-password-schema";
import { useAppForm } from "@app/ui/components/form/hooks";

type SendChangePasswordEmailForm = {
  email: string;
};

export const SendChangePasswordEmailForm = ({ email }: SendChangePasswordEmailForm) => {
  const form = useAppForm({
    defaultValues: {
      email: email,
    },
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.requestPasswordReset(
        {
          email: value.email,
          redirectTo: new URL("/reset-password", window.location.origin).href,
        },
        {
          onError: (error: { error: { message?: string } }) => {
            toast.error(error.error.message || "Failed to send password reset email.");
          },
          onSuccess: () => {
            toast.success("Password reset email sent");
          },
        },
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
      <div className="border border-border bg-card">
        <div className="flex items-center justify-between p-6">
          <div>
            <p className="font-medium">Set Password</p>
            <p className="text-sm text-muted-foreground">
              We will send you a password reset email to set up a password.
            </p>
          </div>
          <form.AppForm>
            <form.SubmitButton timer={30} label="Send" dontStartOnRender={true} />
          </form.AppForm>
        </div>
      </div>
    </form>
  );
};
