import { createColumnHelper } from "@tanstack/react-table";
import { InferResponseType } from "hono/client";

import { Badge } from "@app/ui/components/badge";
import { Button } from "@app/ui/components/button";
import { apiClient } from "@/lib/api-client";
import { formatDate } from "@app/ui/lib/utils";

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

export function createInvitationColumns(
  onCancel: (invitationId: string) => void,
  isCanceling: boolean,
  t: (key: string) => string,
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
        return <span>{formatDate(value)}</span>;
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      cell: (info) => {
        const status = info.row.original.status;
        if (status !== "pending") return null;
        return (
          <Button
            variant="destructive"
            size="sm"
            disabled={isCanceling}
            onClick={() => onCancel(info.row.original.id)}
          >
            {t("cancel")}
          </Button>
        );
      },
    }),
  ];
}
