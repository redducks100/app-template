import { createFileRoute, redirect } from "@tanstack/react-router";
import { SelectOrganizationView } from "./-components/select-organization-view";
import {
  organizationsListOptions,
  activeOrganizationOptions,
} from "@/lib/query-options";

export const Route = createFileRoute("/_protected/select-org")({
  beforeLoad: async ({ context }) => {
    if (context.session?.activeOrganizationId) {
      throw redirect({ to: "/" });
    }
  },
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(organizationsListOptions()),
      context.queryClient.ensureQueryData(activeOrganizationOptions()),
    ]),
  component: SelectOrgPage,
});

function SelectOrgPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <SelectOrganizationView />
      </div>
    </div>
  );
}
