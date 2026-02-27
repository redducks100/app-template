import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { getSession } from "@/lib/server-fns";
import i18n from "@/lib/i18n";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async () => {
    const data = await getSession();

    if (!data) {
      throw redirect({ to: "/sign-in" });
    }

    if (!data.user.emailVerified) {
      throw redirect({ to: "/verify-email" });
    }

    return {
      user: data.user,
      session: data.session,
      hasMembership: data.user.hasMembership,
      locale: data.user.locale ?? "en",
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
