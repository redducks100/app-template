import { SelectOrganizationContent } from "./select-organization-content";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { SelectOrganizationLoading } from "./select-organization-loading";
import { SelectOrganizationError } from "./select-organization-error";

export const SelectOrganizationView = () => {
  return (
    <Suspense fallback={<SelectOrganizationLoading />}>
      <ErrorBoundary fallback={<SelectOrganizationError />}>
        <SelectOrganizationContent />
      </ErrorBoundary>
    </Suspense>
  );
};
