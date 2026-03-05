import { createFileRoute, redirect } from "@tanstack/react-router";
import { SelectOrganizationView } from "./-components/select-organization-view";
import {
  organizationsListOptions,
  activeOrganizationOptions,
} from "@/lib/query-options";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_protected/select-org")({
  beforeLoad: async ({ context }) => {
    if (context.session?.activeOrganizationId) {
      throw redirect({ to: "/" });
    }
  },
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(organizationsListOptions()),
      context.queryClient.ensureQueryData(activeOrganizationOptions()),
    ]),
  component: SelectOrgPage,
});

function SelectOrgPage() {
  const { t } = useTranslation("selectOrg");

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("description")}
          </p>
        </div>
        <SelectOrganizationView />
      </div>
    </div>
  );
}
