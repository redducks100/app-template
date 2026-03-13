import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

import { linkedAccountsOptions } from "@/lib/queries/user";

import { LinkedAccountsSection } from "./-components/linked-accounts-section";

export const Route = createFileRoute("/_dashboard/settings/integrations")({
  loader: ({ context }) => context.queryClient.ensureQueryData(linkedAccountsOptions()),
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
