import { createFileRoute } from "@tanstack/react-router";
import { DashboardView } from "./-components/dashboard-view";
import { membersListOptions } from "@/lib/query-options/members";
import { rolesListOptions } from "@/lib/query-options/roles";
import { invitationsListOptions } from "@/lib/query-options/invitations";

export const Route = createFileRoute("/_dashboard/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(membersListOptions()),
      context.queryClient.ensureQueryData(rolesListOptions()),
      context.queryClient.ensureQueryData(invitationsListOptions()),
    ]),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-6 pt-4">
      <DashboardView />
    </main>
  );
}
