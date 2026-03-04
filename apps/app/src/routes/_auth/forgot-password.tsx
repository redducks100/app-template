import { createFileRoute, redirect } from "@tanstack/react-router";
import { ForgotPasswordView } from "./-components/forgot-password-view";

export const Route = createFileRoute("/_auth/forgot-password")({
  beforeLoad: ({ context }) => {
    if (context.authData) throw redirect({ to: "/" });
  },
  component: ForgotPasswordView,
});
