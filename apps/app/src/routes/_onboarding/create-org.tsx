import { createFileRoute } from "@tanstack/react-router";

import { CreateOrganizationView } from "./-components/create-organization-view";

export const Route = createFileRoute("/_onboarding/create-org")({
  component: CreateOrgPage,
});

function CreateOrgPage() {
  const context = Route.useRouteContext();
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <CreateOrganizationView canGoBack={!!context.session?.activeOrganizationId} />
      </div>
    </div>
  );
}
