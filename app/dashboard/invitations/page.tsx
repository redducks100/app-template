import { protectRoute, verifySession } from "@/lib/auth/route-helpers";
import { DashboardNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar";
import { InvitationsView } from "@/modules/invitations/ui/views/invitations-view";

const Page = async () => {
  const session = await verifySession();
  await protectRoute(
    session.session.userId,
    session.session.activeOrganizationId,
  );

  return (
    <>
      <DashboardNavbar />
      <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="h-full flex justify-center">
          <div className="w-full max-w-6xl">
            <InvitationsView />
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
