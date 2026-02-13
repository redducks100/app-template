import { LinkedAccountsSection } from "../components/linked-accounts-section";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

export const SettingsIntegrationsView = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.auth.getLinkedAccounts.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <LinkedAccountsSection />
      </Suspense>
    </HydrationBoundary>
  );
};
