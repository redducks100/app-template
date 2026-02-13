import { protectRoute, verifySession } from "@/lib/auth/route-helpers";
import { SettingsDangerView } from "@/modules/settings/ui/views/settings-danger-view";

const Page = async () => {
  const session = await verifySession();
  await protectRoute(
    session.session.userId,
    session.session.activeOrganizationId,
  );

  return (
    <div className="py-8 md:py-10">
      <SettingsDangerView />
    </div>
  );
};

export default Page;
