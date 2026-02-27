import { createFileRoute } from "@tanstack/react-router";
import { DangerSection } from "./-components/danger-section";

export const Route = createFileRoute(
  "/_app/settings/danger",
)({
  component: SettingsDangerPage,
});

function SettingsDangerPage() {
  return (
    <div className="py-8 md:py-10">
      <DangerSection />
    </div>
  );
}
