import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { type PaginationState, type Updater } from "@tanstack/react-table";
import { UsersIcon } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useIsMobile } from "@app/ui/hooks/use-mobile";
import { authClient } from "@/lib/auth-client";
import { membersListOptions } from "@/lib/queries/members";

import { createMemberColumns } from "./members-columns";
import { MembersDesktopDataTable } from "./members-data-table.desktop";
import { MembersMobileDataTable } from "./members-data-table.mobile";

const routeApi = getRouteApi("/_dashboard/users/");

export const MembersDataTable = () => {
  const { t } = useTranslation("members");
  const { t: tCommon } = useTranslation("common");
  const isMobile = useIsMobile();
  const navigate = routeApi.useNavigate();
  const { page } = routeApi.useSearch();

  const { data: session } = authClient.useSession();

  const { data } = useSuspenseQuery(membersListOptions());

  const members = data.members;
  const currentUserId = session?.user?.id ?? "";

  const columns = createMemberColumns(currentUserId, t);

  const onPaginationChange = useCallback(
    (updater: Updater<PaginationState>) => {
      const next =
        typeof updater === "function" ? updater({ pageIndex: page - 1, pageSize: 10 }) : updater;
      navigate({ search: { page: next.pageIndex + 1 } });
    },
    [page, navigate],
  );

  if (members.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <div className="flex flex-col items-center">
          <div className="rounded-lg bg-muted p-3 text-muted-foreground">
            <UsersIcon className="size-6" />
          </div>
          <h3 className="mt-4 text-sm font-medium">{t("emptyState")}</h3>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <MembersMobileDataTable
        members={members}
        currentUserId={currentUserId}
        noResultsMessage={tCommon("noResults")}
        t={t}
        onMemberClick={(memberId) => navigate({ to: `/users/${memberId}` })}
      />
    );
  }

  return (
    <MembersDesktopDataTable
      members={members}
      columns={columns}
      page={page}
      noResultsMessage={tCommon("noResults")}
      onPaginationChange={onPaginationChange}
      onRowClick={(row) => navigate({ to: `/users/${row.id}` })}
    />
  );
};
