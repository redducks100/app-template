import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SelectOrganizationContent } from "./select-organization-content";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { SelectOrganizationLoading } from "./select-organization-loading";
import { SelectOrganizationError } from "./select-organization-error";

export const SelectOrganizationView = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Select organization
        </CardTitle>
        <CardDescription className="text-center">
          Choose which organization you&apos;d like to work with
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<SelectOrganizationLoading />}>
          <ErrorBoundary fallback={<SelectOrganizationError />}>
            <SelectOrganizationContent />
          </ErrorBoundary>
        </Suspense>
      </CardContent>
    </Card>
  );
};
