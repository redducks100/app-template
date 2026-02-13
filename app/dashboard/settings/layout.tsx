import { Separator } from "@/components/ui/separator";
import { SidebarInset } from "@/components/ui/sidebar";
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
          <div className="pt-8 pb-0 md:pt-10">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Account
            </p>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Profile
            </h1>
          </div>
          <Separator className="mt-2" orientation="horizontal" />
          {children}
        </div>
      </SidebarInset>
    </div>
  );
};

export default Layout;
