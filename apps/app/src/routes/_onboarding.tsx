import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import i18n from "@/lib/i18n";

export const Route = createFileRoute("/_onboarding")({
  beforeLoad: ({ context }) => {
    if (!context.authData) {
      throw redirect({ to: "/sign-in" });
    }

    if (!context.authData.user.emailVerified) {
      throw redirect({ to: "/verify-email" });
    }

    return {
      user: context.authData.user,
      session: context.authData.session,
      hasMembership: context.authData.user.hasMembership,
      locale: context.authData.user.locale ?? "en",
    };
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  const { locale } = Route.useRouteContext();

  useEffect(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);

  return <Outlet />;
}
