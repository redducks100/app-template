import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { OrganizationSettingsSection } from "../components/organization-settings-section";

export const OrganizationView = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.organizations.getActiveOrganization.queryOptions(),
  );

  return (
    <div className="p-4 space-y-12">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense>
          <OrganizationSettingsSection />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
};
