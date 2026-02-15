"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LockIcon, MailIcon, UserIcon } from "lucide-react";

import { authClient } from "@/lib/auth/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/modules/schemas/sign-up-schema";
import { useAppForm } from "@/components/ui/form/hooks";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { toast } from "sonner";
import Link from "next/link";
import {
  SUPPORTED_OATH_PROVIDER_DETAILS,
  SUPPORTED_OAUTH_PROVIDERS,
  SupportedOAuthProvider,
} from "@/lib/auth/constants";
import { useTranslations } from "next-intl";

export const SignUpView = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const t = useTranslations("auth.sign_up");
  const tCommon = useTranslations("common");

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: { onSubmit: signUpSchema },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          name: value.name,
          email: value.email,
          password: value.password,
          callbackURL: "/dashboard",
        },
        {
          onSuccess: () => {
            router.push("/dashboard");
          },
          onError: ({ error }) => {
            toast.error(error.message || t("error"));
          },
        },
      );
    },
  });

  const onProviderSubmit = (provider: SupportedOAuthProvider) => {
    setLoading(true);
    authClient.signIn.social(
      { provider: provider, callbackURL: "/dashboard" },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: ({ error }) => {
          setLoading(false);
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
          const Icon = SUPPORTED_OATH_PROVIDER_DETAILS[provider].Icon;

          return (
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => onProviderSubmit(provider)}
              className="w-full"
              key={provider}
            >
              <Icon />
              {tCommon("continueWith", {
                provider: SUPPORTED_OATH_PROVIDER_DETAILS[provider].name,
              })}
            </Button>
          );
        })}

        <div className="flex items-center space-x-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">{tCommon("or")}</span>
          <Separator className="flex-1" />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField name="name">
              {(field) => (
                <field.Input
                  label={t("name")}
                  placeholder={t("namePlaceholder")}
                  LeftIcon={UserIcon}
                />
              )}
            </form.AppField>
            <form.AppField name="email">
              {(field) => (
                <field.Input
                  label={t("email")}
                  placeholder={t("emailPlaceholder")}
                  LeftIcon={MailIcon}
                />
              )}
            </form.AppField>
            <form.AppField name="password">
              {(field) => (
                <field.Input
                  label={t("password")}
                  type="password"
                  description={t("passwordDescription")}
                  LeftIcon={LockIcon}
                />
              )}
            </form.AppField>
            <form.AppField name="confirmPassword">
              {(field) => (
                <field.Input
                  label={t("confirmPassword")}
                  type="password"
                  description={t("confirmPasswordDescription")}
                  LeftIcon={LockIcon}
                />
              )}
            </form.AppField>
            <Field>
              <form.AppForm>
                <form.SubmitButton label={t("submit")} />
              </form.AppForm>
              <p className="text-xs text-center text-muted-foreground">
                {t("terms")}
              </p>
              <FieldDescription className="px-6 text-center">
                {t("hasAccount")} <Link href="/sign-in">{t("signIn")}</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
