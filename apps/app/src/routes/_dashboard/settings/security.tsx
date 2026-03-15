import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";

import { hasPasswordOptions } from "@/lib/queries/user";
import { Button } from "@app/ui/components/button";

import { SecuritySection } from "./-components/security-section";

export const Route = createFileRoute("/_dashboard/settings/security")({
  loader: ({ context }) => context.queryClient.ensureQueryData(hasPasswordOptions()),
  component: SettingsSecurityPage,
});

function SettingsSecurityPage() {
  const { t } = useTranslation("settings");
  const { user } = Route.useRouteContext();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{t("security.title")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("security.description")}</p>
        </div>
        <Suspense>
          <SecuritySaveButton />
        </Suspense>
      </div>
      <Suspense>
        <SecuritySection user={user} />
      </Suspense>
    </div>
  );
}

function SecuritySaveButton() {
  const { data } = useSuspenseQuery(hasPasswordOptions());

  if (!data.hasPassword) return null;

  return (
    <Button type="submit" form="security-form">
      Save changes
    </Button>
  );
}
