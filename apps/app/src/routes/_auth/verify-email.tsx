import { createFileRoute, redirect } from "@tanstack/react-router";
import { VerifyEmailView } from "./-components/verify-email-view";
import { getSession } from "@/lib/server-fns";

export const Route = createFileRoute("/_auth/verify-email")({
  beforeLoad: async () => {
    const data = await getSession();
    if (!data) {
      throw redirect({ to: "/sign-in" });
    }
    if (data.user.emailVerified) {
      throw redirect({ to: "/" });
    }
    return { email: data.user.email };
  },
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { email } = Route.useRouteContext();
  return <VerifyEmailView email={email} />;
}
