import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";

import { sessionsOptions } from "@/lib/queries/user";

import { SessionsSection } from "./-components/sessions-section";

export const Route = createFileRoute("/_dashboard/settings/sessions")({
  loader: ({ context }) => context.queryClient.ensureQueryData(sessionsOptions()),
  component: SettingsSessionsPage,
});

function SettingsSessionsPage() {
  const { t } = useTranslation("settings");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{t("sessions.title")}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t("sessions.description")}</p>
      </div>
      <Suspense>
        <SessionsSection />
      </Suspense>
    </div>
  );
}
