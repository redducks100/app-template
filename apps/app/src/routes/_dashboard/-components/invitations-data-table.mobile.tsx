import { Trash2Icon } from "lucide-react";

import type { InvitationListItem } from "@app/shared/schemas/invitation";

import { Badge } from "@app/ui/components/badge";
import { Button } from "@app/ui/components/button";
import {
  CardList,
  CardListEmpty,
  CardListItems,
  CardListLoadMore,
  CardListSearch,
} from "@app/ui/components/card-list";
import {
  ConfirmDialog,
  ConfirmDialogContent,
  ConfirmDialogDescription,
  ConfirmDialogFooter,
  ConfirmDialogHeader,
  ConfirmDialogTitle,
  ConfirmDialogTrigger,
} from "@app/ui/components/confirm-dialog";
import { formatDateTime } from "@app/ui/lib/utils";

const statusVariant: Record<string, "secondary" | "default" | "destructive"> = {
  pending: "secondary",
  accepted: "default",
  canceled: "destructive",
  rejected: "destructive",
};

interface InvitationsMobileDataTableProps {
  invitations: InvitationListItem[];
  hasNextPage: boolean;
  onLoadMore: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  isCanceling: boolean;
  noResultsMessage: string;
  locale: string;
  t: (key: string) => string;
  onCancel: (invitationId: string) => void;
}

export const InvitationsMobileDataTable = ({
  invitations,
  hasNextPage,
  onLoadMore,
  search,
  onSearchChange,
  isCanceling,
  noResultsMessage,
  locale,
  t,
  onCancel,
}: InvitationsMobileDataTableProps) => {
  return (
    <CardList
      data={invitations}
      hasNextPage={hasNextPage}
      onLoadMore={onLoadMore}
      search={search}
      onSearchChange={onSearchChange}
      renderCard={(inv) => (
        <div key={inv.id} className="border border-border bg-card p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="min-w-0 truncate font-medium">{inv.email}</p>
            <div className="flex items-center gap-1.5">
              <Badge
                variant={statusVariant[inv.status] ?? "secondary"}
                className="shrink-0 capitalize"
              >
                {inv.status}
              </Badge>
              {inv.status === "pending" && (
                <ConfirmDialog>
                  <ConfirmDialogTrigger>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={isCanceling}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2Icon />
                    </Button>
                  </ConfirmDialogTrigger>
                  <ConfirmDialogContent>
                    <ConfirmDialogHeader>
                      <ConfirmDialogTitle>{t("cancelConfirmTitle")}</ConfirmDialogTitle>
                      <ConfirmDialogDescription>
                        {t("cancelConfirmDescription")}
                      </ConfirmDialogDescription>
                    </ConfirmDialogHeader>
                    <ConfirmDialogFooter
                      variant="destructive"
                      confirmLabel={t("revokeInvitation")}
                      cancelLabel={t("keepIt")}
                      onConfirm={() => onCancel(inv.id)}
                    />
                  </ConfirmDialogContent>
                </ConfirmDialog>
              )}
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
            <span>
              {t("roleColumn")}:{" "}
              <Badge variant="outline" className="capitalize">
                {inv.role}
              </Badge>
            </span>
            {inv.expiresAt && (
              <span>
                {t("expiresColumn")}: {formatDateTime(inv.expiresAt, locale)}
              </span>
            )}
          </div>
        </div>
      )}
    >
      <CardListSearch />
      <CardListItems />
      <CardListEmpty>{noResultsMessage}</CardListEmpty>
      <CardListLoadMore />
    </CardList>
  );
};
