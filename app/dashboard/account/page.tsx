import { protectRoute, verifySession } from "@/lib/auth/route-helpers";
import { AccountView } from "@/modules/account/ui/views/account-view";

const Page = async () => {
  const session = await verifySession();
  await protectRoute(
    session.session.userId,
    session.session.activeOrganizationId
  );

  return (
    <div className="h-full flex justify-center">
      <div className="w-full max-w-6xl">
        <AccountView user={session.user} />
      </div>
    </div>
  );
};

export default Page;
