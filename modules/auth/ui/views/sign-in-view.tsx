"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { GoogleIcon } from "@/components/ui/google-icon";
import { Separator } from "@/components/ui/separator";
import { AtSignIcon, LockIcon } from "lucide-react";

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

export const SignInView = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

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
        }
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
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your account using your preferred method
        </CardDescription>
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
            >
              <Icon />
              Continue with {SUPPORTED_OATH_PROVIDER_DETAILS[provider].name}
            </Button>
          );
        })}

        <div className="flex items-center space-x-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">OR</span>
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
                  label="Email"
                  placeholder="you@example.com"
                  LeftIcon={AtSignIcon}
                />
              )}
            </form.AppField>

            <form.AppField name="password">
              {(field) => (
                <field.Input
                  label="Password"
                  type="password"
                  LeftIcon={LockIcon}
                  labelRight={
                    <Link
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  }
                />
              )}
            </form.AppField>

            <Field>
              <form.AppForm>
                <form.SubmitButton label="Sign in" />
              </form.AppForm>
              <p className="text-center text-xs text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy
                Policy.
              </p>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
