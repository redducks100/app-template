import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./_app/-components/dashboard-sidebar";
import { getSession } from "@/lib/server-fns";
import i18n from "@/lib/i18n";

export const Route = createFileRoute("/_app")({
  beforeLoad: async () => {
    const data = await getSession();
    if (!data) throw redirect({ to: "/sign-in" });
    if (!data.user.emailVerified) throw redirect({ to: "/verify-email" });
    if (!data.user.hasMembership) throw redirect({ to: "/create-org" });
    if (!data.session?.activeOrganizationId)
      throw redirect({ to: "/select-org" });

    return {
      user: data.user,
      session: data.session,
      hasMembership: data.user.hasMembership,
      locale: data.user.locale ?? "en",
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
