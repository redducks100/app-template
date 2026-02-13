import { SessionsSection } from "../components/sessions-section";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

export const SettingsSessionsView = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.auth.getSessions.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <SessionsSection />
      </Suspense>
    </HydrationBoundary>
  );
};
