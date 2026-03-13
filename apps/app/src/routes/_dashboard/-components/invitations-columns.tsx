import { createColumnHelper } from "@tanstack/react-table";
import { InferResponseType } from "hono/client";
import { MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

import { apiClient } from "@/lib/api-client";
import { Badge } from "@app/ui/components/badge";
import { Button } from "@app/ui/components/button";
import {
  ConfirmDialog,
  ConfirmDialogContent,
  ConfirmDialogDescription,
  ConfirmDialogFooter,
  ConfirmDialogHeader,
  ConfirmDialogTitle,
} from "@app/ui/components/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@app/ui/components/dropdown-menu";
import { formatDateTime } from "@app/ui/lib/utils";

export type Invitation = InferResponseType<
  (typeof apiClient)["invitations"]["$get"],
  200
>["data"][number];

const columnHelper = createColumnHelper<Invitation>();

const statusVariant: Record<string, "secondary" | "default" | "destructive"> = {
  pending: "secondary",
  accepted: "default",
  canceled: "destructive",
  rejected: "destructive",
};

function InvitationActions({
  invitation,
  onCancel,
  isCanceling,
  t,
}: {
  invitation: Invitation;
  onCancel: (invitationId: string) => void;
  isCanceling: boolean;
  t: (key: string) => string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" disabled={isCanceling}>
              <MoreHorizontalIcon />
              <span className="sr-only">Actions</span>
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem variant="destructive" onClick={() => setDialogOpen(true)}>
            <span className="flex items-center gap-2">
              <Trash2Icon />
              {t("cancel")}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>{t("cancelConfirmTitle")}</ConfirmDialogTitle>
            <ConfirmDialogDescription>{t("cancelConfirmDescription")}</ConfirmDialogDescription>
          </ConfirmDialogHeader>
          <ConfirmDialogFooter
            variant="destructive"
            confirmLabel={t("revokeInvitation")}
            cancelLabel={t("keepIt")}
            onConfirm={() => onCancel(invitation.id)}
          />
        </ConfirmDialogContent>
      </ConfirmDialog>
    </>
  );
}

export function createInvitationColumns(
  onCancel: (invitationId: string) => void,
  isCanceling: boolean,
  t: (key: string) => string,
  locale: string,
) {
  return [
    columnHelper.display({
      id: "email",
      header: t("emailColumn"),
      cell: (info) => <span>{info.row.original.email}</span>,
    }),
    columnHelper.display({
      id: "role",
      header: t("roleColumn"),
      cell: (info) => (
        <Badge variant="outline" className="capitalize">
          {info.row.original.role}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: "status",
      header: t("statusColumn"),
      cell: (info) => {
        const status = info.row.original.status;
        return (
          <Badge variant={statusVariant[status] ?? "secondary"} className="capitalize">
            {status}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: "expiresAt",
      header: t("expiresColumn"),
      cell: (info) => {
        const value = info.row.original.expiresAt;
        if (!value) return <span className="text-muted-foreground">-</span>;
        return <span>{formatDateTime(value, locale)}</span>;
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      meta: { className: "w-12" },
      cell: (info) => {
        if (info.row.original.status !== "pending") return null;
        return (
          <InvitationActions
            invitation={info.row.original}
            onCancel={onCancel}
            isCanceling={isCanceling}
            t={t}
          />
        );
      },
    }),
  ];
}
