import { protectRoute, verifySession } from "@/lib/auth/route-helpers";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await verifySession();
  await protectRoute(
    session.session.userId,
    session.session.activeOrganizationId,
  );

  redirect("/dashboard/settings/profile");
};

export default Page;
