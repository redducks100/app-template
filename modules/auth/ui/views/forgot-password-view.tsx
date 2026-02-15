"use client";

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
import { forgotPasswordSchema } from "@/modules/schemas/forgot-password-schema";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export const ForgotPasswordView = () => {
  const t = useTranslations("auth.forgot_password");

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
            toast.error(error.error.message || t("error"));
          },
          onSuccess: () => {
            toast.success(t("success"));
          },
        },
      );
    },
  });

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
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
                  label={t("email")}
                  placeholder={t("emailPlaceholder")}
                  LeftIcon={MailIcon}
                />
              )}
            </form.AppField>

            <Field>
              <form.AppForm>
                <form.SubmitButton label={t("submit")} />
              </form.AppForm>

              <FieldDescription className="text-center">
                <a href="/sign-in">{t("backToSignIn")}</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
