import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import { settingsNavigation } from "./settings/-lib/settings-navigation";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsLayout,
});

function SettingsLayout() {
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];
  const segment = lastMatch?.pathname.split("/").filter(Boolean).pop() ?? "profile";

  const allItems = settingsNavigation.flatMap((g) => g.items);
  const current = allItems.find((item) => item.value === segment);
  const title = current?.label ?? "Settings";

  return (
    <div className="mx-auto w-full max-w-6xl px-8 md:px-12 py-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">{title}</h1>
      <Outlet />
    </div>
  );
}
