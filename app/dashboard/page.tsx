import { member } from "@/drizzle/auth";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardView } from "@/modules/dashboard/ui/views/dashboard-view";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const userMember = await db.query.member.findFirst({
    where: eq(member.userId, session.session.userId),
  });

  if (!userMember) {
    redirect("/create-org");
  } else if (userMember && !session.session.activeOrganizationId) {
    redirect("/select-org");
  }

  return <DashboardView />;
};

export default Page;
