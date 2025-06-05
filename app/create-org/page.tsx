import { verifySession } from "@/lib/auth/route-helpers";
import { CreateOrganizationView } from "@/modules/organizations/ui/views/create-organization-view";

const Page = async () => {
  const session = await verifySession();

  return (
    <CreateOrganizationView
      canGoBack={!!session.session.activeOrganizationId}
    />
  );
};

export default Page;
