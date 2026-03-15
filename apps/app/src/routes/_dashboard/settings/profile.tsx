import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@app/ui/components/button";

import { ProfileSection } from "./-components/profile-section";

export const Route = createFileRoute("/_dashboard/settings/profile")({
  component: SettingsProfilePage,
});

function SettingsProfilePage() {
  const { t } = useTranslation("settings");
  const { user } = Route.useRouteContext();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{t("account.title")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("account.description")}</p>
        </div>
        <Button type="submit" form="profile-form">
          Save changes
        </Button>
      </div>
      <ProfileSection user={user} />
    </div>
  );
}
