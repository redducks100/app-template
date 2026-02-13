import { protectRoute, verifySession } from "@/lib/auth/route-helpers";

const Page = async () => {
  const session = await verifySession();
  await protectRoute(
    session.session.userId,
    session.session.activeOrganizationId,
  );

  return (
    <div className="px-8 py-8 md:px-12 md:py-10">
      <div className="max-w-3xl">
        <p>sessions</p>
      </div>
    </div>
  );
};

export default Page;
