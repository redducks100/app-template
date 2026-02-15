import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { InvitationsSection } from "../components/invitations-section";

export const InvitationsView = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.invitations.getMany.queryOptions(),
  );

  return (
    <div className="p-4 space-y-12">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense>
          <InvitationsSection />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
};
