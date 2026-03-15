import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";

import i18n from "@/lib/i18n";
import { SidebarInset, SidebarProvider } from "@app/ui/components/sidebar";

import { DashboardSidebar } from "./_dashboard/-components/dashboard-sidebar";

export const Route = createFileRoute("/_dashboard")({
  beforeLoad: ({ context }) => {
    if (!context.authData) throw redirect({ to: "/sign-in" });
    if (!context.authData.user.emailVerified) throw redirect({ to: "/verify-email" });
    if (!context.authData.user.hasMembership) throw redirect({ to: "/create-org" });
    if (!context.authData.session?.activeOrganizationId) throw redirect({ to: "/create-org" });

    return {
      user: context.authData.user,
      session: context.authData.session,
      hasMembership: context.authData.user.hasMembership,
      locale: context.authData.user.locale ?? "en",
    };
  },
  component: AppLayout,
});

function AppLayout() {
  const { locale } = Route.useRouteContext();
  useEffect(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
