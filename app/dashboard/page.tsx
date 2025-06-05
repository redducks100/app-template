import { protectRoute, verifySession } from "@/lib/auth/route-helpers";
import { DashboardView } from "@/modules/dashboard/ui/views/dashboard-view";

const Page = async () => {
  const session = await verifySession();
  await protectRoute(
    session.session.userId,
    session.session.activeOrganizationId,
  );

  return <DashboardView />;
};

export default Page;
