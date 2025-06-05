import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SelectOrganizationContent } from "@/modules/organizations/ui/components/select-organization-content";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { SelectOrganizationLoading } from "../components/select-organization-loading";
import { SelectOrganizationError } from "../components/select-organization-error";

export const SelectOrganizationView = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.organizations.getMany.queryOptions());
  void queryClient.prefetchQuery(
    trpc.organizations.getActiveOrganization.queryOptions(),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Select organization
        </CardTitle>
        <CardDescription className="text-center">
          Choose which organization you'd like to work with
        </CardDescription>
      </CardHeader>
      <CardContent>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<SelectOrganizationLoading />}>
            <ErrorBoundary fallback={<SelectOrganizationError />}>
              <SelectOrganizationContent />
            </ErrorBoundary>
          </Suspense>
        </HydrationBoundary>
      </CardContent>
    </Card>
  );
};
