import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@app/ui/components/button";

import { OrganizationSettingsSection } from "./-components/organization-settings-section";

export const Route = createFileRoute("/_dashboard/settings/general")({
  component: SettingsGeneralPage,
});

function SettingsGeneralPage() {
  const { t } = useTranslation("settings");

  return (
    <Suspense>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{t("general.title")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t("general.description")}</p>
          </div>
          <Button type="submit" form="org-settings-form">
            Save changes
          </Button>
        </div>
        <OrganizationSettingsSection />
      </div>
    </Suspense>
  );
}
