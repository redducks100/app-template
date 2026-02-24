import { createFileRoute, redirect } from "@tanstack/react-router";
import { VerifyEmailView } from "./-components/verify-email-view";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_auth/verify-email")({
  beforeLoad: async ({ context }) => {
    const fetchOptions = context.cookie
      ? { headers: { cookie: context.cookie } }
      : undefined;
    const { data } = await authClient.getSession({ fetchOptions });
    if (!data) {
      throw redirect({ to: "/sign-in" });
    }
    if (data.user.emailVerified) {
      throw redirect({ to: "/dashboard" });
    }
    return { email: data.user.email };
  },
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { email } = Route.useRouteContext();
  return <VerifyEmailView email={email} />;
}
