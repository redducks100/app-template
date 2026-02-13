import { SidebarInset } from "@/components/ui/sidebar";
import { SettingsHeader } from "@/modules/settings/ui/components/settings-header";
import { SettingsNavbar } from "@/modules/settings/ui/components/settings-navbar";
import { SettingsSidebar } from "@/modules/settings/ui/components/settings-sidebar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-1 h-screen">
      <SettingsSidebar />

      <SidebarInset>
        <SettingsNavbar />
        <div className="mx-auto w-full max-w-6xl px-8 md:px-12">
          <SettingsHeader />
          {children}
        </div>
      </SidebarInset>
    </div>
  );
};

export default Layout;
