import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { LinkedAccountsSection } from "./-components/linked-accounts-section";
import { linkedAccountsOptions } from "@/lib/query-options";

export const Route = createFileRoute(
  "/_protected/dashboard/settings/integrations",
)({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(linkedAccountsOptions(context.cookie)),
  component: SettingsIntegrationsPage,
});

function SettingsIntegrationsPage() {
  return (
    <div className="py-8 md:py-10">
      <Suspense>
        <LinkedAccountsSection />
      </Suspense>
    </div>
  );
}
