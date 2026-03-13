import { Link, Outlet, createFileRoute, useMatches } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { cn } from "@app/ui/lib/utils";

import { type SettingsValue, settingsNavigation } from "./settings/-lib/settings-navigation";

export const Route = createFileRoute("/_dashboard/settings")({
  component: SettingsLayout,
});

function SettingsLayout() {
  const { t } = useTranslation("settings");
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];
  const segment = (lastMatch?.pathname.split("/").filter(Boolean).pop() ??
    "profile") as SettingsValue;

  const allItems = settingsNavigation.flatMap((g) => g.items);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="h-full flex justify-center">
        <div className="w-full max-w-screen-2xl">
          <div className="p-4 space-y-6 animate-in-page">
            <div className="mb-1">
              <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
              <p className="text-sm text-muted-foreground mt-1">{t("description")}</p>
            </div>

            {/* Horizontal tabs */}
            <nav className="mt-4 mb-6 flex gap-1 border-b border-border overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {allItems.map((item) => {
                const isActive = item.value === segment;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.value}
                    to={`/settings/${item.value}`}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors relative whitespace-nowrap shrink-0",
                      isActive
                        ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
}
