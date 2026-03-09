
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { RoleData } from "@app/shared/types/roles";
import { createColumnHelper } from "@tanstack/react-table";
import { TrashIcon } from "lucide-react";
import {
  PERMISSION_MAP,
  RESOURCE_TRANSLATION_KEY,
} from "@app/shared/types/roles";

const columnHelper = createColumnHelper<RoleData>();

const RESOURCE_ORDER = ["organization", "member", "invitation"] as const;

function formatPermissions(
  permission: RoleData["permission"],
  t: (key: string) => string,
) {
  return RESOURCE_ORDER
    .filter((resource) => resource in permission)
    .map((resource) => {
      const actions = permission[resource] as string[];
      const label = t(
        RESOURCE_TRANSLATION_KEY[resource] as
          | "organization"
          | "members"
          | "invitations",
      );
      const actionLabels = actions
        .map((a) => t(a as "read" | "create" | "update" | "delete" | "cancel"))
        .join(", ");
      return `${label}: ${actionLabels}`;
    })
    .join(" | ");
}

export function createRoleColumns(
  onDelete: (roleId: string) => void,
  isDeleting: boolean,
  isOwner: boolean,
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
      cell: (info) => {
        const summary = formatPermissions(info.getValue(), t);
        return (
          <span className="truncate max-w-sm block" title={summary}>
            {summary}
          </span>
        );
      },
    }),
    ...(isOwner
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
