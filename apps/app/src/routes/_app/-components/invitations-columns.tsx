import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { InferResponseType } from "hono/client";
import type { apiClient } from "@/lib/api-client";
import { createColumnHelper } from "@tanstack/react-table";

type Invitation = InferResponseType<(typeof apiClient)["invitations"]["list"]["$get"], 200>[number];

const columnHelper = createColumnHelper<Invitation>();

const statusVariant: Record<string, "secondary" | "default" | "destructive"> = {
  pending: "secondary",
  accepted: "default",
  canceled: "destructive",
  rejected: "destructive",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function createInvitationColumns(
  onCancel: (invitationId: string) => void,
  isCanceling: boolean,
  t: (key: string) => string,
) {
  return [
    columnHelper.accessor("email", {
      header: t("emailColumn"),
      cell: (info) => (
        <span className="font-medium">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("role", {
      header: t("roleColumn"),
      cell: (info) => (
        <Badge variant="outline" className="capitalize">
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor("status", {
      header: t("statusColumn"),
      cell: (info) => {
        const status = info.getValue();
        return (
          <Badge variant={statusVariant[status] ?? "secondary"} className="capitalize">
            {status}
          </Badge>
        );
      },
    }),
    columnHelper.accessor("expiresAt", {
      header: t("expiresColumn"),
      cell: (info) => {
        const value = info.getValue();
        if (!value) return <span className="text-muted-foreground">-</span>;
        return dateFormatter.format(new Date(value));
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
