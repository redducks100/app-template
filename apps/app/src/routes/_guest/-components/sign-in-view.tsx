import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LockIcon, MailIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { sessionOptions } from "@/lib/query-options/auth";

const routeApi = getRouteApi("/_guest/sign-in");
import { signInSchema } from "@app/shared/schemas/sign-in-schema";
import { useAppForm } from "@/components/ui/form/hooks";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import {
  SUPPORTED_OATH_PROVIDER_DETAILS,
  SUPPORTED_OAUTH_PROVIDERS,
  SupportedOAuthProvider,
} from "@/lib/constants";
import { useTranslation } from "react-i18next";
export const SignInView = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { callbackURL } = routeApi.useSearch();
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation("auth");
  const { t: tCommon } = useTranslation("common");

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
          callbackURL,
        },
        {
          onSuccess: async () => {
            await queryClient.fetchQuery({ ...sessionOptions(), staleTime: 0 });
            navigate({ to: callbackURL });
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
      { provider: provider, callbackURL: new URL(callbackURL, window.location.origin).href },
      {
        onSuccess: async () => {
          await queryClient.fetchQuery({ ...sessionOptions(), staleTime: 0 });
          navigate({ to: callbackURL });
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
        <h1 className="text-3xl font-semibold tracking-tight">
          {t("sign_in.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("sign_in.description")}</p>
      </div>

      <div className="space-y-3">
        {SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
          const Icon = SUPPORTED_OATH_PROVIDER_DETAILS[provider].Icon;

          return (
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => onProviderSubmit(provider)}
              className="w-full h-11"
              key={provider}
            >
              <Icon />
              {tCommon("continueWith", {
                provider: SUPPORTED_OATH_PROVIDER_DETAILS[provider].name,
              })}
            </Button>
          );
        })}

        <div className="flex items-center gap-3 py-1">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground/60 uppercase tracking-wider font-medium">{tCommon("or")}</span>
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
                  label={t("sign_in.email")}
                  placeholder={t("sign_in.emailPlaceholder")}
                  LeftIcon={MailIcon}
                />
              )}
            </form.AppField>

            <form.AppField name="password">
              {(field) => (
                <field.Input
                  label={t("sign_in.password")}
                  type="password"
                  LeftIcon={LockIcon}
                  labelRight={
                    <Link
                      to="/forgot-password"
                      className="ml-auto inline-block text-sm text-primary hover:underline underline-offset-4"
                    >
                      {t("sign_in.forgotPassword")}
                    </Link>
                  }
                />
              )}
            </form.AppField>

            <Field>
              <form.AppForm>
                <form.SubmitButton label={t("sign_in.submit")} />
              </form.AppForm>
              <p className="text-center text-xs text-muted-foreground">
                {t("sign_in.terms")}
              </p>
              <FieldDescription className="text-center">
                {t("sign_in.noAccount")}{" "}
                <Link to="/sign-up" className="text-primary hover:underline underline-offset-4">{t("sign_in.signUp")}</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
};
