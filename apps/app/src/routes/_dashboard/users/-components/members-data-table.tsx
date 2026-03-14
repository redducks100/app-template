import { useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { type PaginationState, type Updater } from "@tanstack/react-table";
import { UsersIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { authClient } from "@/lib/auth-client";
import { membersInfiniteOptions, membersListOptions } from "@/lib/queries/members";
import { DEFAULT_PAGE_SIZE } from "@app/shared/types/result";
import { useIsMobile } from "@app/ui/hooks/use-mobile";

import { createMemberColumns } from "./members-columns";
import { MembersDesktopDataTable } from "./members-data-table.desktop";
import { MembersMobileDataTable } from "./members-data-table.mobile";
const DEBOUNCE_MS = 300;

const routeApi = getRouteApi("/_dashboard/users/");

const MembersDesktopContent = ({
  page,
  urlSearch,
  localSearch,
  currentUserId,
  noResultsMessage,
  locale,
  onSearchChange,
  onPaginationChange,
  onRowClick,
}: {
  page: number;
  urlSearch: string;
  localSearch: string;
  currentUserId: string;
  noResultsMessage: string;
  locale: string;
  onSearchChange: (value: string) => void;
  onPaginationChange: (updater: Updater<PaginationState>) => void;
  onRowClick: (row: { id: string }) => void;
}) => {
  const { t } = useTranslation("members");
  const columns = createMemberColumns(currentUserId, t, locale);

  const {
    data: { data: members, pagination },
  } = useSuspenseQuery(
    membersListOptions({ page, pageSize: DEFAULT_PAGE_SIZE, search: urlSearch }),
  );

  if (pagination.total === 0 && !urlSearch) {
    return (
      <div className="border border-border bg-card p-12 text-center">
        <div className="flex flex-col items-center">
          <div className="rounded-lg bg-muted p-3 text-muted-foreground">
            <UsersIcon className="size-6" />
          </div>
          <h3 className="mt-4 text-sm font-medium">{t("emptyState")}</h3>
        </div>
      </div>
    );
  }

  return (
    <MembersDesktopDataTable
      members={members}
      columns={columns}
      totalRows={pagination.total}
      page={page}
      search={localSearch}
      onSearchChange={onSearchChange}
      noResultsMessage={noResultsMessage}
      onPaginationChange={onPaginationChange}
      onRowClick={onRowClick}
    />
  );
};

const MembersMobileContent = ({
  urlSearch,
  localSearch,
  currentUserId,
  noResultsMessage,
  locale,
  onSearchChange,
  onMemberClick,
}: {
  urlSearch: string;
  localSearch: string;
  currentUserId: string;
  noResultsMessage: string;
  locale: string;
  onSearchChange: (value: string) => void;
  onMemberClick: (memberId: string) => void;
}) => {
  const { t } = useTranslation("members");
  const { data, hasNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
    membersInfiniteOptions(urlSearch, DEFAULT_PAGE_SIZE),
  );

  const allMembers = data.pages.flatMap((p) => p.data);
  const firstPageTotal = data.pages[0]?.pagination.total ?? 0;

  if (firstPageTotal === 0 && !urlSearch) {
    return (
      <div className="border border-border bg-card p-12 text-center">
        <div className="flex flex-col items-center">
          <div className="rounded-lg bg-muted p-3 text-muted-foreground">
            <UsersIcon className="size-6" />
          </div>
          <h3 className="mt-4 text-sm font-medium">{t("emptyState")}</h3>
        </div>
      </div>
    );
  }

  return (
    <MembersMobileDataTable
      members={allMembers}
      currentUserId={currentUserId}
      hasNextPage={hasNextPage}
      onLoadMore={() => fetchNextPage()}
      search={localSearch}
      onSearchChange={onSearchChange}
      noResultsMessage={noResultsMessage}
      locale={locale}
      t={t}
      onMemberClick={onMemberClick}
    />
  );
};

export const MembersDataTable = () => {
  const { i18n } = useTranslation("members");
  const { t: tCommon } = useTranslation("common");
  const isMobile = useIsMobile();
  const navigate = routeApi.useNavigate();
  const { page, search: urlSearch } = routeApi.useSearch();

  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id ?? "";

  // Local search state for debouncing
  const [localSearch, setLocalSearch] = useState(urlSearch);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Sync local search when URL changes externally
  useEffect(() => {
    setLocalSearch(urlSearch);
  }, [urlSearch]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalSearch(value);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        navigate({
          search: { page: undefined, search: value || undefined },
        });
      }, DEBOUNCE_MS);
    },
    [navigate],
  );

  const onPaginationChange = useCallback(
    (updater: Updater<PaginationState>) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex: page - 1, pageSize: DEFAULT_PAGE_SIZE })
          : updater;
      const newPage = next.pageIndex + 1;
      navigate({
        search: {
          page: newPage === 1 ? undefined : newPage,
          search: urlSearch || undefined,
        },
      });
    },
    [page, urlSearch, navigate],
  );

  if (isMobile) {
    return (
      <MembersMobileContent
        urlSearch={urlSearch}
        localSearch={localSearch}
        currentUserId={currentUserId}
        noResultsMessage={tCommon("noResults")}
        locale={i18n.language}
        onSearchChange={handleSearchChange}
        onMemberClick={(memberId) => navigate({ to: `/users/${memberId}` })}
      />
    );
  }

  return (
    <MembersDesktopContent
      page={page}
      urlSearch={urlSearch}
      localSearch={localSearch}
      currentUserId={currentUserId}
      noResultsMessage={tCommon("noResults")}
      locale={i18n.language}
      onSearchChange={handleSearchChange}
      onPaginationChange={onPaginationChange}
      onRowClick={(row) => navigate({ to: `/users/${row.id}` })}
    />
  );
};
