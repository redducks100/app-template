import { type User } from "better-auth";
import { SecuritySection } from "../components/security-section";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

type SettingsSecurityViewProps = {
  user: User;
};

export const SettingsSecurityView = async ({
  user,
}: SettingsSecurityViewProps) => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.auth.hasPasswordAccount.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <SecuritySection user={user} />
      </Suspense>
    </HydrationBoundary>
  );
};
