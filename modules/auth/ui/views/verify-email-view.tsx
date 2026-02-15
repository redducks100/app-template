"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/components/ui/form/hooks";
import { authClient } from "@/lib/auth/auth-client";
import { verifyEmailSchema } from "@/modules/schemas/verify-email-schema";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

type VerifyEmailViewProps = {
  email: string;
};

export const VerifyEmailView = ({ email }: VerifyEmailViewProps) => {
  const t = useTranslations("auth.verify_email");

  const form = useAppForm({
    defaultValues: {
      email: email,
    },
    validators: { onSubmit: verifyEmailSchema },
    onSubmit: async ({ value }) => {
      await authClient.sendVerificationEmail(
        {
          email: value.email,
          callbackURL: "/dashboard",
        },
        {
          onSuccess: () => {
            toast.success(t("success"));
          },
          onError: ({ error }) => {
            toast.error(error.message || t("error"));
          },
        }
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
            <Field>
              <form.AppForm>
                <form.SubmitButton label={t("submit")} timer={30} />
              </form.AppForm>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
