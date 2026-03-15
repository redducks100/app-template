import { createFileRoute } from "@tanstack/react-router";

import { invitationsCountOptions } from "@/lib/queries/invitations";
import { membersCountOptions } from "@/lib/queries/members";

import { DashboardNavbar } from "./-components/dashboard-navbar";
import { DashboardView } from "./-components/dashboard-view";

export const Route = createFileRoute("/_dashboard/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(membersCountOptions()),
      context.queryClient.ensureQueryData(invitationsCountOptions()),
    ]),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <>
      <DashboardNavbar />
      <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="h-full flex justify-center">
          <div className="w-full max-w-screen-2xl">
            <div className="p-4 space-y-6">
              <DashboardView />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
