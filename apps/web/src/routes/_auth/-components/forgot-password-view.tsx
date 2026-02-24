import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
      await authClient.forgetPassword(
        {
          email: value.email,
          redirectTo: "/reset-password",
        },
        {
          onError: (error) => {
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
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{t("forgot_password.title")}</CardTitle>
        <CardDescription>{t("forgot_password.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
                <form.SubmitButton label={t("forgot_password.submit")} />
              </form.AppForm>

              <FieldDescription className="text-center">
                <Link to="/sign-in">{t("forgot_password.backToSignIn")}</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
