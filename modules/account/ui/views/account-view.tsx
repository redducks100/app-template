import { type User } from "better-auth";
import { ProfileSection } from "../components/profile-section";
import { SecuritySection } from "../components/security-section";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { SessionsSection } from "../components/sessions-section";
import { LinkedAccountsSection } from "../components/linked-accounts-section";
import { DangerSection } from "../components/danger-section";

type AccountViewProps = {
  user: User;
};

export const AccountView = async ({ user }: AccountViewProps) => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.auth.hasPasswordAccount.queryOptions());
  void queryClient.prefetchQuery(trpc.auth.getLinkedAccounts.queryOptions());
  void queryClient.prefetchQuery(trpc.auth.getSessions.queryOptions());
  return (
    <div className="p-4 space-y-12">
      <ProfileSection user={user} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense>
          <SecuritySection user={user} />
        </Suspense>
        <Suspense>
          <SessionsSection />
        </Suspense>
        <Suspense>
          <LinkedAccountsSection />
        </Suspense>
      </HydrationBoundary>
      <DangerSection />
    </div>
  );
};
