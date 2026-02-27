import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SettingsSidebar } from "./settings/-components/settings-sidebar";
import { SettingsNavbar } from "./settings/-components/settings-navbar";
import { SettingsHeader } from "./settings/-components/settings-header";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsLayout,
});

function SettingsLayout() {
  return (
    <div className="flex flex-1 h-screen">
      <SettingsSidebar />
      <SidebarInset>
        <SettingsNavbar />
        <div className="mx-auto w-full max-w-6xl px-8 md:px-12">
          <SettingsHeader />
          <Outlet />
        </div>
      </SidebarInset>
    </div>
  );
}
