"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { LogoGoogle } from "@/components/ui/logo";
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

export const SignInView = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);

      authClient.signIn.email(
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
            setLoading(false);
            toast.error(error.message);
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
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your account using your preferred method
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
            Continue with Google
          </div>
        </Button>

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
              <Button type="submit" className="w-full" disabled={loading}>
                Sign in
              </Button>
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
