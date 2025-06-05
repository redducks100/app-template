import { auth } from "@/lib/auth";
import { SelectOrganizationView } from "@/modules/organizations/ui/views/select-organization-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (!!session.session.activeOrganizationId) {
    redirect("/dashboard");
  }

  return <SelectOrganizationView />;
};

export default Page;
