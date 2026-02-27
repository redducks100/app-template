import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  BuildingIcon,
  ChartBarIcon,
  CogIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  MailsIcon,
  ShieldIcon,
  UsersIcon,
} from "lucide-react";
import { DashboardUserButton } from "./dashboard-user-button";
import { DashboardOrganizationSwitcher } from "./dashboard-organization-switcher";
import { DashboardNavMain } from "./dashboard-nav-main";
import { DashboardNavSecondary } from "./dashboard-nav-secondary";
import { useTranslation } from "react-i18next";

export const DashboardSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { t } = useTranslation("dashboard");
  const { t: tCommon } = useTranslation("common");

  const navMain = {
    items: [
      {
        title: t("sidebar.dashboard"),
        url: "/",
        icon: LayoutDashboardIcon,
      },
      {
        title: t("sidebar.analytics"),
        url: "#",
        icon: ChartBarIcon,
      },
    ],
    sectionTitle: t("sidebar.dashboardSection"),
  };

  const navSecondary = {
    items: [
      {
        title: t("sidebar.organization"),
        url: "/organization",
        icon: BuildingIcon,
      },
      {
        title: t("sidebar.invitations"),
        url: "/invitations",
        icon: MailsIcon,
      },
      {
        title: t("sidebar.roles"),
        url: "/roles",
        icon: ShieldIcon,
      },
      {
        title: t("sidebar.users"),
        url: "/users",
        icon: UsersIcon,
      },
    ],
    sectionTitle: t("sidebar.organizationSection"),
  };

  const navFooter = [
    {
      title: tCommon("settings"),
      url: "/settings",
      icon: CogIcon,
    },
    {
      title: tCommon("getHelp"),
      url: "#",
      icon: HelpCircleIcon,
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <DashboardOrganizationSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <DashboardNavMain
          items={navMain.items}
          sectionTitle={navMain.sectionTitle}
        />
        <DashboardNavMain
          items={navSecondary.items}
          sectionTitle={navSecondary.sectionTitle}
        />
        <DashboardNavSecondary items={navFooter} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
};
