import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { AlertCircleIcon, LockIcon } from "lucide-react";
import { useAppForm } from "@/components/ui/form/hooks";
import { Field, FieldGroup } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { resetPasswordSchema } from "@app/shared/schemas/reset-password-schema";
import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const routeApi = getRouteApi("/_auth/reset-password");

export const ResetPasswordView = () => {
  const navigate = useNavigate();
  const { token, error } = routeApi.useSearch();
  const { t } = useTranslation("auth");

  const form = useAppForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      if (error || !token) return;
      await authClient.resetPassword(
        {
          newPassword: value.password,
          token: token,
        },
        {
          onError: (error) => {
            toast.error(error.error.message || t("reset_password.error"));
          },
          onSuccess: () => {
            toast.success(t("reset_password.success"), {
              description: t("reset_password.successDescription"),
            });
            setTimeout(() => {
              navigate({ to: "/sign-in" });
            }, 1000);
          },
        },
      );
    },
  });

  if (!token || error) {
    return (
      <Card>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            {t("reset_password.invalidTitle")}
          </CardTitle>
          <CardDescription>{t("reset_password.invalidDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/sign-in" className={buttonVariants({ className: "w-full" })}>
            {t("reset_password.backToSignIn")}
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{t("reset_password.title")}</CardTitle>
        <CardDescription>{t("reset_password.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>{t("reset_password.tokenError")}</AlertTitle>
          </Alert>
        )}
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
                  label={t("reset_password.password")}
                  type="password"
                  description={t("reset_password.passwordDescription")}
                  LeftIcon={LockIcon}
                />
              )}
            </form.AppField>

            <form.AppField name="confirmPassword">
              {(field) => (
                <field.Input
                  label={t("reset_password.confirmPassword")}
                  type="password"
                  LeftIcon={LockIcon}
                />
              )}
            </form.AppField>

            <Field>
              <form.AppForm>
                <form.SubmitButton label={t("reset_password.submit")} />
              </form.AppForm>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
