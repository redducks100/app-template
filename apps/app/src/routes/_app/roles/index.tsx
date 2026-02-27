import { createFileRoute } from "@tanstack/react-router";
import { DashboardNavbar } from "../-components/dashboard-navbar";
import { Suspense } from "react";
import { RolesSection } from "./-components/roles-section";
import {
  rolesListOptions,
  activeOrganizationOptions,
} from "@/lib/query-options";

export const Route = createFileRoute("/_app/roles/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(rolesListOptions()),
      context.queryClient.ensureQueryData(activeOrganizationOptions()),
    ]),
  component: RolesPage,
});

function RolesPage() {
  return (
    <>
      <DashboardNavbar />
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
    </>
  );
}
