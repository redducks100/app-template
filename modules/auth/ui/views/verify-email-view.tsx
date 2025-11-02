"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export const VerifyEmailView = () => {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
        <CardDescription>
          Your email is not verified! Check your inbox and follow the
          instructions to verify your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4"></CardContent>
    </Card>
  );
};
