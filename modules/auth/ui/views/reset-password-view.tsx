"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { AlertCircleIcon, LockIcon } from "lucide-react";

import { useAppForm } from "@/components/ui/form/hooks";
import { Field, FieldGroup } from "@/components/ui/field";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { resetPasswordSchema } from "@/modules/schemas/reset-password-schema";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const ResetPasswordView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const error = searchParams.get("error");

  const form = useAppForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      if (error || !token) return;
      await authClient.resetPassword(
        {
          newPassword: value.password,
          token: token,
        },
        {
          onError: (error) => {
            toast.error(error.error.message || "Failed to reset password.");
          },
          onSuccess: () => {
            toast.success("Password reset successful", {
              description: "Redirecting to login...",
            });
            setTimeout(() => {
              router.push("/sign-in");
            }, 1000);
          },
        }
      );
    },
  });

  if (!token || error) {
    return (
      <Card>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Invalid Reset Link
          </CardTitle>
          <CardDescription>
            The password reset link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" asChild>
            <Link href="/sign-in" className="text-primary">
              Back to Sign in
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          Reset your password
        </CardTitle>
        <CardDescription>Set a new password for your account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Your token is invalid or expired.</AlertTitle>
          </Alert>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField name="password">
              {(field) => (
                <field.Input
                  label="Password"
                  type="password"
                  description="Your new password must be at least 8 characters long."
                  LeftIcon={LockIcon}
                />
              )}
            </form.AppField>

            <form.AppField name="confirmPassword">
              {(field) => (
                <field.Input
                  label="Re-enter Password"
                  type="password"
                  LeftIcon={LockIcon}
                />
              )}
            </form.AppField>

            <Field>
              <form.AppForm>
                <form.SubmitButton label="Save" />
              </form.AppForm>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
