import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { RolesSection } from "../components/roles-section";

export const RolesView = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.roles.getMany.queryOptions());
  void queryClient.prefetchQuery(
    trpc.organizations.getActiveOrganization.queryOptions(),
  );

  return (
    <div className="p-4 space-y-12">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense>
          <RolesSection />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
};
