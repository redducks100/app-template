import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { OrganizationSettingsSection } from "./-components/organization-settings-section";

export const Route = createFileRoute("/_dashboard/organization")({
  component: OrganizationPage,
});

function OrganizationPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="h-full flex justify-center">
        <div className="w-full max-w-6xl">
          <div className="p-4 space-y-12">
            <Suspense>
              <OrganizationSettingsSection />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
