import { useQueryClient, useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { type PaginationState, type Updater } from "@tanstack/react-table";
import { UsersIcon } from "lucide-react";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { authClient } from "@/lib/auth-client";
import {
  memberGetOptions,
  membersInfiniteOptions,
  membersListOptions,
  membersPermissionsOptions,
} from "@/lib/queries/members";
import { DEFAULT_PAGE_SIZE } from "@app/shared/types/result";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@app/ui/components/sheet";
import { Skeleton } from "@app/ui/components/skeleton";
import { useIsMobile } from "@app/ui/hooks/use-mobile";

import { MemberDetail } from "./member-detail";
import { createMemberColumns } from "./members-columns";
import { MembersDesktopDataTable } from "./members-data-table.desktop";
import { MembersMobileDataTable } from "./members-data-table.mobile";
const DEBOUNCE_MS = 300;

const routeApi = getRouteApi("/_dashboard/settings/members/");

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

const MemberDetailSkeleton = () => (
  <div className="flex flex-col h-full">
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-5">
        <div className="flex items-center gap-3">
          <Skeleton className="size-14 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  </div>
);

export const MembersDataTable = () => {
  const { i18n } = useTranslation("members");
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("members");
  const isMobile = useIsMobile();
  const navigate = routeApi.useNavigate();
  const { page, search: urlSearch } = routeApi.useSearch();
  const queryClient = useQueryClient();

  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id ?? "";

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

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

  const handleMemberClick = useCallback(
    (memberId: string) => {
      setSelectedMemberId(memberId);
      queryClient.ensureQueryData(memberGetOptions(memberId));
      queryClient.ensureQueryData(membersPermissionsOptions());
    },
    [queryClient],
  );

  return (
    <>
      {isMobile ? (
        <MembersMobileContent
          urlSearch={urlSearch}
          localSearch={localSearch}
          currentUserId={currentUserId}
          noResultsMessage={tCommon("noResults")}
          locale={i18n.language}
          onSearchChange={handleSearchChange}
          onMemberClick={handleMemberClick}
        />
      ) : (
        <MembersDesktopContent
          page={page}
          urlSearch={urlSearch}
          localSearch={localSearch}
          currentUserId={currentUserId}
          noResultsMessage={tCommon("noResults")}
          locale={i18n.language}
          onSearchChange={handleSearchChange}
          onPaginationChange={onPaginationChange}
          onRowClick={(row) => handleMemberClick(row.id)}
        />
      )}

      <Sheet
        open={!!selectedMemberId}
        onOpenChange={(open) => {
          if (!open) setSelectedMemberId(null);
        }}
      >
        <SheetContent side="right" className="sm:max-w-xl p-0 flex flex-col">
          <SheetHeader className="p-6 pb-4">
            <SheetTitle className="text-xl">{t("memberDetails")}</SheetTitle>
            <SheetDescription className="sr-only">{t("memberDetails")}</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-hidden">
            {selectedMemberId && (
              <Suspense fallback={<MemberDetailSkeleton />}>
                <MemberDetail
                  memberId={selectedMemberId}
                  onClose={() => setSelectedMemberId(null)}
                />
              </Suspense>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
