import { createFileRoute, redirect } from "@tanstack/react-router";

import { VerifyEmailView } from "./-components/verify-email-view";

export const Route = createFileRoute("/_guest/verify-email")({
  beforeLoad: ({ context }) => {
    if (!context.authData) {
      throw redirect({ to: "/sign-in" });
    }
    if (context.authData.user.emailVerified) {
      throw redirect({ to: "/" });
    }
    return { email: context.authData.user.email };
  },
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { email } = Route.useRouteContext();
  return <VerifyEmailView email={email} />;
}
