import { verifySession } from "@/lib/auth/route-helpers";
import { VerifyEmailView } from "@/modules/auth/ui/views/verify-email-view";

const Page = async () => {
  return <VerifyEmailView />;
};

export default Page;
