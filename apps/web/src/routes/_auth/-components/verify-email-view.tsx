import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/components/ui/form/hooks";
import { authClient } from "@/lib/auth-client";
import { verifyEmailSchema } from "@app/shared/schemas/verify-email-schema";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

type VerifyEmailViewProps = {
  email: string;
};

export const VerifyEmailView = ({ email }: VerifyEmailViewProps) => {
  const { t } = useTranslation("auth");

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
            toast.success(t("verify_email.success"));
          },
          onError: ({ error }) => {
            toast.error(error.message || t("verify_email.error"));
          },
        },
      );
    },
  });
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{t("verify_email.title")}</CardTitle>
        <CardDescription>{t("verify_email.description")}</CardDescription>
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
                <form.SubmitButton label={t("verify_email.submit")} timer={30} />
              </form.AppForm>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
