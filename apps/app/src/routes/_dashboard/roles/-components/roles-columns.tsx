
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { RoleData } from "@app/shared/types/roles";
import { createColumnHelper } from "@tanstack/react-table";
import { TrashIcon } from "lucide-react";
import { PermissionSummaryCell } from "./permission-summary-cell";

const columnHelper = createColumnHelper<RoleData>();

export function createRoleColumns(
  onDelete: (roleId: string) => void,
  isDeleting: boolean,
  canDelete: boolean,
  t: (key: string) => string,
) {
  return [
    columnHelper.accessor("role", {
      header: t("nameColumn"),
      cell: (info) => (
        <span className="font-medium capitalize">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("isDefault", {
      header: t("typeColumn"),
      cell: (info) =>
        info.getValue() ? (
          <Badge variant="secondary">{t("default")}</Badge>
        ) : (
          <Badge variant="outline">{t("custom")}</Badge>
        ),
    }),
    columnHelper.accessor("permission", {
      header: t("permissionsColumn"),
      cell: (info) => <PermissionSummaryCell permission={info.getValue()} />,
    }),
    ...(canDelete
      ? [
          columnHelper.display({
            id: "actions",
            header: "",
            cell: (info) => {
              const role = info.row.original;
              if (role.isDefault) return null;
              return (
                <div
                  className="flex items-center justify-end gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ConfirmDialog
                    title={t("deleteConfirmTitle")}
                    description={t("deleteConfirm")}
                    confirmLabel={t("delete")}
                    cancelLabel={t("cancel")}
                    variant="destructive"
                    onConfirm={() => onDelete(role.id)}
                  >
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      disabled={isDeleting}
                    >
                      <TrashIcon />
                    </Button>
                  </ConfirmDialog>
                </div>
              );
            },
          }),
        ]
      : []),
  ];
}
