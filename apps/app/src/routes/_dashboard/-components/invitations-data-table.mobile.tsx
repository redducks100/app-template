import { Badge } from "@app/ui/components/badge";
import { Button } from "@app/ui/components/button";
import {
  CardList,
  CardListEmpty,
  CardListItems,
  CardListLoadMore,
  CardListSearch,
} from "@app/ui/components/card-list";
import { formatDate } from "@app/ui/lib/utils";

import type { Invitation } from "./invitations-columns";

const statusVariant: Record<string, "secondary" | "default" | "destructive"> = {
  pending: "secondary",
  accepted: "default",
  canceled: "destructive",
  rejected: "destructive",
};

interface InvitationsMobileDataTableProps {
  invitations: Invitation[];
  isCanceling: boolean;
  noResultsMessage: string;
  t: (key: string) => string;
  onCancel: (invitationId: string) => void;
}

export const InvitationsMobileDataTable = ({
  invitations,
  isCanceling,
  noResultsMessage,
  t,
  onCancel,
}: InvitationsMobileDataTableProps) => {
  return (
    <CardList
      data={invitations}
      filterFn={(inv, search) => {
        const s = search.toLowerCase();
        return (
          inv.email.toLowerCase().includes(s) ||
          inv.role.toLowerCase().includes(s) ||
          inv.status.toLowerCase().includes(s)
        );
      }}
      renderCard={(inv) => (
        <div key={inv.id} className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-start justify-between gap-2">
            <p className="min-w-0 truncate font-medium">{inv.email}</p>
            <Badge
              variant={statusVariant[inv.status] ?? "secondary"}
              className="shrink-0 capitalize"
            >
              {inv.status}
            </Badge>
          </div>
          <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
            <span>
              {t("roleColumn")}:{" "}
              <Badge variant="outline" className="capitalize">
                {inv.role}
              </Badge>
            </span>
            {inv.expiresAt && (
              <span>
                {t("expiresColumn")}: {formatDate(inv.expiresAt)}
              </span>
            )}
          </div>
          {inv.status === "pending" && (
            <div className="mt-3 flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                disabled={isCanceling}
                onClick={() => onCancel(inv.id)}
              >
                {t("cancel")}
              </Button>
            </div>
          )}
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
