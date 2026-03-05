import { createFileRoute } from "@tanstack/react-router";
import { DashboardView } from "./-components/dashboard-view";
import {
  membersListOptions,
  rolesListOptions,
  invitationsListOptions,
} from "@/lib/query-options";

export const Route = createFileRoute("/_app/")({
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
