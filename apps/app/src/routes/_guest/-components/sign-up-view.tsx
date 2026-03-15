import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Loader2Icon, LockIcon, MailIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import {
  SUPPORTED_OATH_PROVIDER_DETAILS,
  SUPPORTED_OAUTH_PROVIDERS,
  SupportedOAuthProvider,
} from "@/lib/constants";
import { sessionOptions } from "@/lib/queries/auth";
import { signUpSchema } from "@app/shared/schemas/sign-up-schema";
import { Button } from "@app/ui/components/button";
import { Field, FieldDescription, FieldGroup } from "@app/ui/components/field";
import { useAppForm } from "@app/ui/components/form/hooks";
import { Separator } from "@app/ui/components/separator";
export const SignUpView = () => {
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("auth");
  const { t: tCommon } = useTranslation("common");

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
          callbackURL: "/",
        },
        {
          onSuccess: async () => {
            await queryClient.fetchQuery({ ...sessionOptions(), staleTime: 0 });
            await router.invalidate();
            navigate({ to: "/" });
          },
          onError: ({ error }) => {
            toast.error(error.message || t("sign_up.error"));
          },
        },
      );
    },
  });

  const onProviderSubmit = (provider: SupportedOAuthProvider) => {
    setLoading(true);
    authClient.signIn.social(
      {
        provider: provider,
        callbackURL: new URL("/", window.location.origin).href,
      },
      {
        onSuccess: async () => {
          await queryClient.fetchQuery({ ...sessionOptions(), staleTime: 0 });
          await router.invalidate();
          navigate({ to: "/" });
        },
        onError: ({ error }) => {
          setLoading(false);
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <div className="animate-in-stagger">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight">{t("sign_up.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("sign_up.description")}</p>
      </div>

      <div className="space-y-3">
        {SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
          const Icon = SUPPORTED_OATH_PROVIDER_DETAILS[provider].Icon;

          return (
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => onProviderSubmit(provider)}
              className="w-full h-10"
              key={provider}
            >
              {loading ? <Loader2Icon className="animate-spin" /> : <Icon />}
              {tCommon("continueWith", {
                provider: SUPPORTED_OATH_PROVIDER_DETAILS[provider].name,
              })}
            </Button>
          );
        })}

        <div className="flex items-center gap-3 py-1">
          <Separator className="flex-1" />
          <span className="text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase font-medium">
            {tCommon("or")}
          </span>
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
                  label={t("sign_up.name")}
                  placeholder={t("sign_up.namePlaceholder")}
                  LeftIcon={UserIcon}
                />
              )}
            </form.AppField>
            <form.AppField name="email">
              {(field) => (
                <field.Input
                  label={t("sign_up.email")}
                  placeholder={t("sign_up.emailPlaceholder")}
                  LeftIcon={MailIcon}
                />
              )}
            </form.AppField>
            <form.AppField name="password">
              {(field) => (
                <field.Input
                  label={t("sign_up.password")}
                  type="password"
                  description={t("sign_up.passwordDescription")}
                  LeftIcon={LockIcon}
                />
              )}
            </form.AppField>
            <form.AppField name="confirmPassword">
              {(field) => (
                <field.Input
                  label={t("sign_up.confirmPassword")}
                  type="password"
                  description={t("sign_up.confirmPasswordDescription")}
                  LeftIcon={LockIcon}
                />
              )}
            </form.AppField>
            <Field>
              <form.AppForm>
                <form.SubmitButton label={t("sign_up.submit")} />
              </form.AppForm>
              <p className="text-xs text-center text-muted-foreground">{t("sign_up.terms")}</p>
              <FieldDescription className="px-6 text-center">
                {t("sign_up.hasAccount")}{" "}
                <Link to="/sign-in" className="text-primary hover:underline underline-offset-4">
                  {t("sign_up.signIn")}
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
};
