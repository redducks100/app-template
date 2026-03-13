import { createFileRoute } from "@tanstack/react-router";

import { invitationsListOptions } from "@/lib/queries/invitations";
import { membersListOptions } from "@/lib/queries/members";

import { DashboardView } from "./-components/dashboard-view";

const defaultListParams = { page: 1, pageSize: 100, search: "" };

export const Route = createFileRoute("/_dashboard/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(membersListOptions(defaultListParams)),
      context.queryClient.ensureQueryData(invitationsListOptions(defaultListParams)),
    ]),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="h-full flex justify-center">
        <div className="w-full max-w-screen-2xl">
          <div className="p-4 space-y-6">
            <DashboardView />
          </div>
        </div>
      </div>
    </main>
  );
}
