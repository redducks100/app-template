import {
  useMutation,
  useQueryClient,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { type PaginationState, type Updater } from "@tanstack/react-table";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { cancelInvitation as cancelInvitationMutation } from "@/lib/mutations/invitations";
import { invitationsInfiniteOptions, invitationsListOptions } from "@/lib/queries/invitations";
import { DEFAULT_PAGE_SIZE } from "@app/shared/types/result";
import { useIsMobile } from "@app/ui/hooks/use-mobile";

import { createInvitationColumns } from "./invitations-columns";
import { InvitationsDesktopDataTable } from "./invitations-data-table.desktop";
import { InvitationsMobileDataTable } from "./invitations-data-table.mobile";

const DEBOUNCE_MS = 300;

const routeApi = getRouteApi("/_dashboard/settings/invitations");

const InvitationsDesktopContent = ({
  page,
  urlSearch,
  localSearch,
  noResultsMessage,
  onSearchChange,
  onPaginationChange,
  onCancel,
  isCanceling,
  locale,
}: {
  page: number;
  urlSearch: string;
  localSearch: string;
  noResultsMessage: string;
  onSearchChange: (value: string) => void;
  onPaginationChange: (updater: Updater<PaginationState>) => void;
  onCancel: (invitationId: string) => void;
  isCanceling: boolean;
  locale: string;
}) => {
  const { t } = useTranslation("invitations");
  const columns = createInvitationColumns(onCancel, isCanceling, t, locale);

  const {
    data: { data: invitations, pagination },
  } = useSuspenseQuery(
    invitationsListOptions({ page, pageSize: DEFAULT_PAGE_SIZE, search: urlSearch }),
  );

  if (pagination.total === 0 && !urlSearch) {
    return (
      <div className="border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">{t("emptyState")}</p>
      </div>
    );
  }

  return (
    <InvitationsDesktopDataTable
      invitations={invitations}
      columns={columns}
      totalRows={pagination.total}
      page={page}
      search={localSearch}
      onSearchChange={onSearchChange}
      noResultsMessage={noResultsMessage}
      onPaginationChange={onPaginationChange}
    />
  );
};

const InvitationsMobileContent = ({
  urlSearch,
  localSearch,
  noResultsMessage,
  locale,
  onSearchChange,
  onCancel,
  isCanceling,
}: {
  urlSearch: string;
  localSearch: string;
  noResultsMessage: string;
  locale: string;
  onSearchChange: (value: string) => void;
  onCancel: (invitationId: string) => void;
  isCanceling: boolean;
}) => {
  const { t } = useTranslation("invitations");
  const { data, hasNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
    invitationsInfiniteOptions(urlSearch, DEFAULT_PAGE_SIZE),
  );

  const allInvitations = data.pages.flatMap((p) => p.data);
  const firstPageTotal = data.pages[0]?.pagination.total ?? 0;

  if (firstPageTotal === 0 && !urlSearch) {
    return (
      <div className="border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">{t("emptyState")}</p>
      </div>
    );
  }

  return (
    <InvitationsMobileDataTable
      invitations={allInvitations}
      hasNextPage={hasNextPage}
      onLoadMore={() => fetchNextPage()}
      search={localSearch}
      onSearchChange={onSearchChange}
      isCanceling={isCanceling}
      noResultsMessage={noResultsMessage}
      locale={locale}
      t={t}
      onCancel={onCancel}
    />
  );
};

export const InvitationsDataTable = () => {
  const { t, i18n } = useTranslation("invitations");
  const { t: tCommon } = useTranslation("common");
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();
  const { page, search: urlSearch } = routeApi.useSearch();

  // Local search state for debouncing
  const [localSearch, setLocalSearch] = useState(urlSearch);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

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

  const cancelInvitation = useMutation({
    mutationFn: cancelInvitationMutation,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["invitations", "list"] }),
        queryClient.invalidateQueries({ queryKey: ["invitations", "count"] }),
      ]);
      toast.success(t("canceled"));
    },
  });

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
      <InvitationsMobileContent
        urlSearch={urlSearch}
        localSearch={localSearch}
        noResultsMessage={tCommon("noResults")}
        locale={i18n.language}
        onSearchChange={handleSearchChange}
        onCancel={(invitationId) => cancelInvitation.mutate({ invitationId })}
        isCanceling={cancelInvitation.isPending}
      />
    );
  }

  return (
    <InvitationsDesktopContent
      page={page}
      urlSearch={urlSearch}
      localSearch={localSearch}
      noResultsMessage={tCommon("noResults")}
      onSearchChange={handleSearchChange}
      onPaginationChange={onPaginationChange}
      onCancel={(invitationId) => cancelInvitation.mutate({ invitationId })}
      isCanceling={cancelInvitation.isPending}
      locale={i18n.language}
    />
  );
};
