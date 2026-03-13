import { Link, getRouteApi, useNavigate } from "@tanstack/react-router";
import { AlertCircleIcon, LockIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { resetPasswordSchema } from "@app/shared/schemas/reset-password-schema";
import { Alert, AlertTitle } from "@app/ui/components/alert";
import { buttonVariants } from "@app/ui/components/button";
import { Field, FieldGroup } from "@app/ui/components/field";
import { useAppForm } from "@app/ui/components/form/hooks";

const routeApi = getRouteApi("/_guest/reset-password");

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
      <div className="animate-in-page">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-medium tracking-tight">
            {t("reset_password.invalidTitle")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("reset_password.invalidDescription")}
          </p>
        </div>
        <Link to="/sign-in" className={buttonVariants({ className: "w-full" })}>
          {t("reset_password.backToSignIn")}
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in-stagger">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight">{t("reset_password.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("reset_password.description")}</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
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
    </div>
  );
};
