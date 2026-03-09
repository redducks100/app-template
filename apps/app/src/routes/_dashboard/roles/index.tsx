import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { RolesSection } from "./-components/roles-section";
import { rolesListOptions } from "@/lib/query-options/roles";
import { activeOrganizationOptions } from "@/lib/query-options/organizations";

export const Route = createFileRoute("/_dashboard/roles/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(rolesListOptions()),
      context.queryClient.ensureQueryData(activeOrganizationOptions()),
    ]),
  component: RolesPage,
});

function RolesPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="h-full flex justify-center">
        <div className="w-full max-w-6xl">
          <div className="p-4 space-y-12">
            <Suspense>
              <RolesSection />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
