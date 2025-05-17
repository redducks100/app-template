import { SignOutButton } from "@/components/ui/sign-out";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p>{session ? session.user.name : "Not Authenticated"}</p>
      {session && <SignOutButton />}
    </div>
  );
}
