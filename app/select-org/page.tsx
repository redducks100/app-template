import { verifySession } from "@/lib/auth/route-helpers";
import { SelectOrganizationView } from "@/modules/organizations/ui/views/select-organization-view";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await verifySession();

  if (!!session.session.activeOrganizationId) {
    redirect("/dashboard");
  }

  return <SelectOrganizationView />;
};

export default Page;
