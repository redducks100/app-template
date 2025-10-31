"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { AtSignIcon } from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppForm } from "@/components/ui/form/hooks";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { forgotPasswordSchema } from "@/modules/schemas/forgot-password-schema";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";

export const ForgotPasswordView = () => {
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.forgetPassword(
        {
          email: value.email,
          redirectTo: "/sign-in",
        },
        {
          onError: (error) => {
            toast.error(
              error.error.message || "Failed to send password reset email."
            );
          },
          onSuccess: () => {
            toast.success("Password reset email sent");
          },
        }
      );
    },
  });

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Forgot password?</CardTitle>
        <CardDescription>
          Don't worry! Fill in your email and we'll send you a link to reset
          your password.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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

            <Field>
              <Button type="submit">Send email</Button>
              <FieldDescription className="text-center">
                <a href="/sign-in">Back to Login</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
