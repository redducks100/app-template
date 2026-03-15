import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { invitationsListOptions } from "@/lib/queries/invitations";
import { DEFAULT_PAGE_SIZE } from "@app/shared/types/result";

import { InvitationsSection } from "./-components/invitations-section";
import { InviteMemberDialog } from "./-components/invite-member-dialog";

const searchDefaults = { page: 1, search: "" } as const;

const searchSchema = z.object({
  page: z.number().default(1).catch(1),
  search: z.string().default("").catch(""),
});

export const Route = createFileRoute("/_dashboard/settings/invitations")({
  validateSearch: searchSchema,
  search: {
    middlewares: [stripSearchParams(searchDefaults)],
  },
  loaderDeps: ({ search: { page, search } }) => ({ page, search }),
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(
      invitationsListOptions({ page: deps.page, pageSize: DEFAULT_PAGE_SIZE, search: deps.search }),
    ),
  component: InvitationsPage,
});

function InvitationsPage() {
  const { t } = useTranslation("invitations");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{t("allInvitations")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("invitationsDescription")}</p>
        </div>
        <InviteMemberDialog />
      </div>
      <Suspense>
        <InvitationsSection />
      </Suspense>
    </div>
  );
}
