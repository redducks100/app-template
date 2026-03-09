import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { SecuritySection } from "./-components/security-section";
import { hasPasswordOptions } from "@/lib/query-options/user";

export const Route = createFileRoute(
  "/_dashboard/settings/security",
)({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(hasPasswordOptions()),
  component: SettingsSecurityPage,
});

function SettingsSecurityPage() {
  const { user } = Route.useRouteContext();

  return (
    <div className="py-8 md:py-10">
      <Suspense>
        <SecuritySection user={user} />
      </Suspense>
    </div>
  );
}
