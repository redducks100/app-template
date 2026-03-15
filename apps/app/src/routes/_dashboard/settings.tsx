import { Link, Outlet, createFileRoute, useMatches } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { cn } from "@app/ui/lib/utils";

import { DashboardNavbar } from "./-components/dashboard-navbar";
import { type SettingsValue, settingsNavigation } from "./settings/-lib/settings-navigation";

export const Route = createFileRoute("/_dashboard/settings")({
  component: SettingsLayout,
});

function SettingsLayout() {
  const { t } = useTranslation("settings");
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];
  const segment = (lastMatch?.pathname.split("/").filter(Boolean).pop() ??
    "general") as SettingsValue;

  return (
    <>
      <DashboardNavbar title={t("title")} />
      <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="h-full flex justify-center">
          <div className="w-full max-w-screen-2xl">
            <div className="p-4 space-y-6 animate-in-page">
              {/* Horizontal tabs — two groups with a visual gap */}
              <nav className="flex gap-1 border-b border-border overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {settingsNavigation.map((group, groupIndex) => (
                  <div key={group.key} className={cn("flex gap-1", groupIndex > 0 && "ml-auto")}>
                    {group.items.map((item) => {
                      const isActive = item.value === segment;
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.value}
                          to={`/settings/${item.value}`}
                          className={cn(
                            "flex items-center gap-1.5 px-2.5 py-2 text-xs uppercase tracking-wider font-medium transition-colors relative whitespace-nowrap shrink-0",
                            isActive
                              ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-foreground"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <Icon className="size-3.5" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>

              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
