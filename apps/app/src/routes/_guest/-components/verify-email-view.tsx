import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { verifyEmailSchema } from "@app/shared/schemas/verify-email-schema";
import { Field, FieldGroup } from "@app/ui/components/field";
import { useAppForm } from "@app/ui/components/form/hooks";

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
          callbackURL: new URL("/", window.location.origin).href,
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
    <div className="animate-in-page">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight">{t("verify_email.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("verify_email.description")}</p>
      </div>

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
    </div>
  );
};
