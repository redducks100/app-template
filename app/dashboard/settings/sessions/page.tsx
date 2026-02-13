import { protectRoute, verifySession } from "@/lib/auth/route-helpers";
import { SettingsSessionsView } from "@/modules/settings/ui/views/settings-sessions-view";

const Page = async () => {
  const session = await verifySession();
  await protectRoute(
    session.session.userId,
    session.session.activeOrganizationId,
  );

  return (
    <div className="py-8 md:py-10">
      <SettingsSessionsView />
    </div>
  );
};

export default Page;
