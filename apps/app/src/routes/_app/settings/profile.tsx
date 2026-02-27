import { createFileRoute } from "@tanstack/react-router";
import { ProfileSection } from "./-components/profile-section";

export const Route = createFileRoute(
  "/_app/settings/profile",
)({
  component: SettingsProfilePage,
});

function SettingsProfilePage() {
  const { user } = Route.useRouteContext();

  return (
    <div className="py-8 md:py-10">
      <ProfileSection user={user} />
    </div>
  );
}
