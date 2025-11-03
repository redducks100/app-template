import { verifySession } from "@/lib/auth/route-helpers";
import { VerifyEmailView } from "@/modules/auth/ui/views/verify-email-view";

const Page = async () => {
  const session = await verifySession("/verify-email");
  return <VerifyEmailView email={session.user.email} />;
};

export default Page;
