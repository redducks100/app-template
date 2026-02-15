"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LockIcon, MailIcon } from "lucide-react";

import { authClient } from "@/lib/auth/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/modules/schemas/sign-in-schema";
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

export const SignInView = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const t = useTranslations("auth.sign_in");
  const tCommon = useTranslations("common");

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
          callbackURL: "/dashboard",
        },
        {
          onSuccess: () => {
            router.push("/dashboard");
          },
          onError: ({ error }) => {
            toast.error(error.message);
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
                  LeftIcon={LockIcon}
                  labelRight={
                    <Link
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      {t("forgotPassword")}
                    </Link>
                  }
                />
              )}
            </form.AppField>

            <Field>
              <form.AppForm>
                <form.SubmitButton label={t("submit")} />
              </form.AppForm>
              <p className="text-center text-xs text-muted-foreground">
                {t("terms")}
              </p>
              <FieldDescription className="text-center">
                {t("noAccount")} <Link href="/sign-up">{t("signUp")}</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
