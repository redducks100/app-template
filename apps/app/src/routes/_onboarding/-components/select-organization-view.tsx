import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { SelectOrganizationContent } from "./select-organization-content";
import { SelectOrganizationError } from "./select-organization-error";
import { SelectOrganizationLoading } from "./select-organization-loading";

export const SelectOrganizationView = () => {
  return (
    <Suspense fallback={<SelectOrganizationLoading />}>
      <ErrorBoundary fallback={<SelectOrganizationError />}>
        <SelectOrganizationContent />
      </ErrorBoundary>
    </Suspense>
  );
};
