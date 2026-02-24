import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { SessionsSection } from "./-components/sessions-section";
import { sessionsOptions } from "@/lib/query-options";

export const Route = createFileRoute(
  "/_protected/dashboard/settings/sessions",
)({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(sessionsOptions(context.cookie)),
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
