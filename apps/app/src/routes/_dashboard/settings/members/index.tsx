import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { membersListOptions } from "@/lib/queries/members";
import { DEFAULT_PAGE_SIZE } from "@app/shared/types/result";

import { InviteMemberDialog } from "../-components/invite-member-dialog";
import { MembersSection } from "../-components/members-section";

const searchDefaults = { page: 1, search: "" } as const;

const searchSchema = z.object({
  page: z.number().default(1).catch(1),
  search: z.string().default("").catch(""),
});

export const Route = createFileRoute("/_dashboard/settings/members/")({
  validateSearch: searchSchema,
  search: {
    middlewares: [stripSearchParams(searchDefaults)],
  },
  loaderDeps: ({ search: { page, search } }) => ({ page, search }),
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(
      membersListOptions({ page: deps.page, pageSize: DEFAULT_PAGE_SIZE, search: deps.search }),
    ),
  component: MembersPage,
});

function MembersPage() {
  const { t } = useTranslation("members");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{t("allMembers")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("membersDescription")}</p>
        </div>
        <InviteMemberDialog />
      </div>
      <Suspense>
        <MembersSection />
      </Suspense>
    </div>
  );
}
