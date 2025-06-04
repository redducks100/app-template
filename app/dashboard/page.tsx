import { SignOutButton } from "@/components/ui/sign-out";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session.activeOrganizationId) {
    redirect("/create-org");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p>{session ? session.user.name : "Not Authenticated"}</p>
      {session && <SignOutButton />}
    </div>
  );
};

export default Page;
