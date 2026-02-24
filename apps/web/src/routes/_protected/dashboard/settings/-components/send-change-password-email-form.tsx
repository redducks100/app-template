import { useAppForm } from "@/components/ui/form/hooks";
import { authClient } from "@/lib/auth-client";
import { forgotPasswordSchema } from "@app/shared/schemas/forgot-password-schema";
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
          redirectTo: "/reset-password",
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
      <section>
        <h3 className="text-base font-semibold text-foreground mb-4">
          Password
        </h3>
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="font-medium">Set Password</p>
              <p className="text-sm text-muted-foreground">
                We will send you a password reset email to set up a password.
              </p>
            </div>
            <form.AppForm>
              <form.SubmitButton
                timer={30}
                label="Send"
                dontStartOnRender={true}
              />
            </form.AppForm>
          </div>
        </div>
      </section>
    </form>
  );
};
