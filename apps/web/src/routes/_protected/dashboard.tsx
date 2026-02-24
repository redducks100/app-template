import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./dashboard/-components/dashboard-sidebar";

export const Route = createFileRoute("/_protected/dashboard")({
  beforeLoad: async ({ context }) => {
    if (!context.hasMembership) {
      throw redirect({ to: "/create-org" });
    }
    if (!context.session?.activeOrganizationId) {
      throw redirect({ to: "/select-org" });
    }
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
