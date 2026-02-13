"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { settingsNavigation } from "../constants/settings-navigation";

export const SettingsHeader = () => {
  const pathname = usePathname();
  const segment = pathname.split("/").pop();

  let groupLabel = "Account";
  let itemLabel = "Profile";

  for (const group of settingsNavigation) {
    for (const item of group.items) {
      if (item.value === segment) {
        groupLabel = group.label;
        itemLabel = item.label;
        break;
      }
    }
  }

  return (
    <>
      <div className="pt-8 pb-0 md:pt-10">
        <p className="text-sm font-medium text-muted-foreground mb-1">
          {groupLabel}
        </p>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">
          {itemLabel}
        </h1>
      </div>
      <Separator className="mt-2" orientation="horizontal" />
    </>
  );
};
