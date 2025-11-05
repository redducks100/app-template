"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleIcon } from "@/components/ui/google-icon";
import { Separator } from "@/components/ui/separator";
import { AtSignIcon, LockIcon, UserIcon } from "lucide-react";

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

export const SignUpView = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
            toast.error(error.message || "Failed to sign up");
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
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Sign up to get started with our service
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
            <form.AppField name="name">
              {(field) => (
                <field.Input
                  label="Name"
                  placeholder="John Smith"
                  LeftIcon={UserIcon}
                />
              )}
            </form.AppField>
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
                  description="Must be at least 8 characters long."
                  LeftIcon={LockIcon}
                />
              )}
            </form.AppField>
            <form.AppField name="confirmPassword">
              {(field) => (
                <field.Input
                  label="Confirm Password"
                  type="password"
                  description="Please confirm your password."
                  LeftIcon={LockIcon}
                />
              )}
            </form.AppField>
            <Field>
              <form.AppForm>
                <form.SubmitButton label="Create account" />
              </form.AppForm>
              <p className="text-xs text-center text-muted-foreground">
                By signing up, you agree to our Terms of Service and Privacy
                Policy.
              </p>
              <FieldDescription className="px-6 text-center">
                Already have an account? <Link href="/sign-in">Sign in</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
