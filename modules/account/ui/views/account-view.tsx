import { type User } from "better-auth";
import { AccountProfileCard } from "../components/account-profile-card";
import { AccountSecurityCard } from "../components/account-security-card";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { AccountSessionsCard } from "../components/account-sessions-card";

type AccountViewProps = {
  user: User;
};

export const AccountView = async ({ user }: AccountViewProps) => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.auth.hasPasswordAccount.queryOptions());
  void queryClient.prefetchQuery(trpc.auth.getSessions.queryOptions());
  return (
    <div className="p-4 space-y-12">
      <AccountProfileCard user={user} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense>
          <AccountSecurityCard user={user} />
        </Suspense>
        <Suspense>
          <AccountSessionsCard />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
};
