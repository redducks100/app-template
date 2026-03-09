import { MailIcon } from "lucide-react";
import { useAppForm } from "@/components/ui/form/hooks";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { forgotPasswordSchema } from "@app/shared/schemas/forgot-password-schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";

export const ForgotPasswordView = () => {
  const { t } = useTranslation("auth");

  const form = useAppForm({
    defaultValues: {
      email: "",
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
            toast.error(error.error.message || t("forgot_password.error"));
          },
          onSuccess: () => {
            toast.success(t("forgot_password.success"));
          },
        },
      );
    },
  });

  return (
    <div className="animate-in-stagger">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          {t("forgot_password.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("forgot_password.description")}</p>
      </div>

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
                label={t("forgot_password.email")}
                placeholder={t("forgot_password.emailPlaceholder")}
                LeftIcon={MailIcon}
              />
            )}
          </form.AppField>

          <Field>
            <form.AppForm>
              <form.SubmitButton label={t("forgot_password.submit")} timer={30} dontStartOnRender />
            </form.AppForm>

            <FieldDescription className="text-center">
              <Link to="/sign-in" className="text-primary hover:underline underline-offset-4">{t("forgot_password.backToSignIn")}</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};
