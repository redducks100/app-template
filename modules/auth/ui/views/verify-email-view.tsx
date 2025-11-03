"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/components/ui/form/hooks";
import { authClient } from "@/lib/auth/auth-client";
import { verifyEmailSchema } from "@/modules/schemas/verify-email-schema";
import { toast } from "sonner";

type VerifyEmailViewProps = {
  email: string;
};

export const VerifyEmailView = ({ email }: VerifyEmailViewProps) => {
  const form = useAppForm({
    defaultValues: {
      email: email,
    },
    validators: { onSubmit: verifyEmailSchema },
    onSubmit: async ({ value }) => {
      await authClient.sendVerificationEmail(
        {
          email: value.email,
          callbackURL: "/dashboard",
        },
        {
          onSuccess: () => {
            toast.success("Verification email has been sent");
          },
          onError: ({ error }) => {
            toast.error(error.message || "Failed to sign up");
          },
        }
      );
    },
  });
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
        <CardDescription>
          Your email is not verified! Check your inbox and follow the
          instructions to verify your account.
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
            <Field>
              <form.AppForm>
                <form.SubmitButton label="Send verification email" timer={30} />
              </form.AppForm>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
