import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { type PaginationState, type Updater } from "@tanstack/react-table";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useIsMobile } from "@app/ui/hooks/use-mobile";
import { cancelInvitation as cancelInvitationMutation } from "@/lib/mutations/invitations";
import { invitationsListOptions } from "@/lib/queries/invitations";

import { createInvitationColumns } from "./invitations-columns";
import { InvitationsDesktopDataTable } from "./invitations-data-table.desktop";
import { InvitationsMobileDataTable } from "./invitations-data-table.mobile";

const routeApi = getRouteApi("/_dashboard/invitations");

export const InvitationsDataTable = () => {
  const { t } = useTranslation("invitations");
  const { t: tCommon } = useTranslation("common");
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();
  const { page } = routeApi.useSearch();

  const { data: invitations } = useSuspenseQuery(invitationsListOptions());

  const cancelInvitation = useMutation({
    mutationFn: cancelInvitationMutation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["invitations", "list"],
      });
      toast.success(t("canceled"));
    },
  });

  const columns = createInvitationColumns(
    (invitationId) => cancelInvitation.mutate({ invitationId }),
    cancelInvitation.isPending,
    t,
  );

  const onPaginationChange = useCallback(
    (updater: Updater<PaginationState>) => {
      const next =
        typeof updater === "function" ? updater({ pageIndex: page - 1, pageSize: 10 }) : updater;
      navigate({ search: { page: next.pageIndex + 1 } });
    },
    [page, navigate],
  );

  if (invitations.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">{t("emptyState")}</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <InvitationsMobileDataTable
        invitations={invitations}
        isCanceling={cancelInvitation.isPending}
        noResultsMessage={tCommon("noResults")}
        t={t}
        onCancel={(invitationId) => cancelInvitation.mutate({ invitationId })}
      />
    );
  }

  return (
    <InvitationsDesktopDataTable
      invitations={invitations}
      columns={columns}
      page={page}
      noResultsMessage={tCommon("noResults")}
      onPaginationChange={onPaginationChange}
    />
  );
};
