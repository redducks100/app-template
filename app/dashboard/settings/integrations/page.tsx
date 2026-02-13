import { protectRoute, verifySession } from "@/lib/auth/route-helpers";
import { SettingsIntegrationsView } from "@/modules/settings/ui/views/settings-integrations-view";

const Page = async () => {
  const session = await verifySession();
  await protectRoute(
    session.session.userId,
    session.session.activeOrganizationId,
  );

  return (
    <div className="py-8 md:py-10">
      <SettingsIntegrationsView />
    </div>
  );
};

export default Page;
