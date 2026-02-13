import { protectRoute, verifySession } from "@/lib/auth/route-helpers";
import { SettingsSecurityView } from "@/modules/settings/ui/views/settings-security-view";

const Page = async () => {
  const session = await verifySession();
  await protectRoute(
    session.session.userId,
    session.session.activeOrganizationId,
  );

  return (
    <div className="py-8 md:py-10">
      <SettingsSecurityView user={session.user} />
    </div>
  );
};

export default Page;
