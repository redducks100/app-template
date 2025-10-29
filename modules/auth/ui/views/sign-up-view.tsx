"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogoGoogle } from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";
import { AtSignIcon, LockIcon, UserIcon } from "lucide-react";

import { authClient } from "@/lib/auth/auth-client";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/modules/schemas/sign-up-schema";
import { useAppForm } from "@/components/ui/form/hooks";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";

type FormData = z.infer<typeof signUpSchema>;

export const SignUpView = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    } satisfies FormData as FormData,
    validators: { onSubmit: signUpSchema },
    onSubmit: async ({ value }) => {
      setError(null);
      setLoading(true);

      authClient.signUp.email(
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
            setLoading(false);
            setError(error.statusText);
          },
        }
      );
    },
  });

  const onGoogleSubmit = () => {
    setLoading(true);
    authClient.signIn.social(
      { provider: "google", callbackURL: "/dashboard" },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: ({ error }) => {
          setLoading(false);
          setError(error.statusText);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Sign up to get started with our service
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          disabled={loading}
          onClick={onGoogleSubmit}
          className="w-full justify-between border-gray-300"
        >
          <div className="flex items-center">
            <LogoGoogle />
            Sign up with Google
          </div>
        </Button>

        <div className="flex items-center space-x-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>
        <form
          className="space-y-2"
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
                  disabled={loading}
                  LeftIcon={UserIcon}
                />
              )}
            </form.AppField>
            <form.AppField name="email">
              {(field) => (
                <field.Input
                  label="Email"
                  placeholder="you@example.com"
                  disabled={loading}
                  LeftIcon={AtSignIcon}
                />
              )}
            </form.AppField>
            <form.AppField name="password">
              {(field) => (
                <field.Input
                  label="Password"
                  type="password"
                  disabled={loading}
                  LeftIcon={LockIcon}
                />
              )}
            </form.AppField>
            <form.AppField name="confirmPassword">
              {(field) => (
                <field.Input
                  label="Confirm Password"
                  type="password"
                  disabled={loading}
                  LeftIcon={LockIcon}
                />
              )}
            </form.AppField>
            <Field>
              <Button type="submit" className="w-full" disabled={loading}>
                Create account
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                By signing up, you agree to our Terms of Service and Privacy
                Policy.
              </p>
              <FieldDescription className="text-center">
                Already have an account? <a href="/sign-in">Sign in</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
