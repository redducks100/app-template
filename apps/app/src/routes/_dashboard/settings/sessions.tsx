import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

import { sessionsOptions } from "@/lib/queries/user";

import { SessionsSection } from "./-components/sessions-section";

export const Route = createFileRoute("/_dashboard/settings/sessions")({
  loader: ({ context }) => context.queryClient.ensureQueryData(sessionsOptions()),
  component: SettingsSessionsPage,
});

function SettingsSessionsPage() {
  return (
    <div className="py-8 md:py-10">
      <Suspense>
        <SessionsSection />
      </Suspense>
    </div>
  );
}
