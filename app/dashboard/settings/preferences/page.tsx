import { protectRoute, verifySession } from "@/lib/auth/route-helpers";
import { SettingsLanguageView } from "@/modules/settings/ui/views/settings-language-view";
import { db } from "@/lib/db";
import { user } from "@/drizzle/auth";
import { eq } from "drizzle-orm";

const Page = async () => {
  const session = await verifySession();
  await protectRoute(
    session.session.userId,
    session.session.activeOrganizationId,
  );

  const dbUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  return (
    <div className="py-8 md:py-10">
      <SettingsLanguageView locale={(dbUser?.locale as "en" | "ro") ?? "en"} />
    </div>
  );
};

export default Page;
