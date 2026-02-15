"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PencilIcon, TrashIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { RESOURCE_TRANSLATION_KEY } from "../../constants";
import type { RoleData, RolePermissions } from "../../types";
import { RoleForm } from "./role-form";

type RoleCardProps = {
  role: RoleData;
  onSave: (name: string, permission: RolePermissions) => void;
  onDelete: (role: RoleData) => void;
  isSaving?: boolean;
};

const RESOURCE_ORDER = ["organization", "member", "invitation"] as const;

export const RoleCard = ({
  role,
  onSave,
  onDelete,
  isSaving,
}: RoleCardProps) => {
  const t = useTranslations("roles");
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  return (
    <div className="px-4 py-4">
      {/* Header row: name + badges + actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground capitalize">
            {role.role}
          </span>
          {role.isDefault && <Badge variant="secondary">{t("default")}</Badge>}
        </div>
        {!role.isDefault && (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" onClick={toggleEdit}>
              {isEditing ? <XIcon /> : <PencilIcon />}
            </Button>
            <ConfirmDialog
              title={t("deleteConfirmTitle")}
              description={t("deleteConfirm")}
              confirmLabel={t("delete")}
              cancelLabel={t("cancel")}
              variant="destructive"
              onConfirm={() => onDelete(role)}
            >
              <Button variant="destructive" size="icon-sm">
                <TrashIcon />
              </Button>
            </ConfirmDialog>
          </div>
        )}
      </div>

      {/* Permission summary (visible when NOT editing) */}
      {!isEditing && (
        <div className="mt-2 space-y-1">
          {RESOURCE_ORDER.filter((resource) => resource in role.permission).map(
            (resource) => {
              const actions = role.permission[resource];
              return (
                <div
                  key={resource}
                  className="flex items-baseline gap-2 text-sm"
                >
                  <span className="text-muted-foreground min-w-24 shrink-0">
                    {t(
                      RESOURCE_TRANSLATION_KEY[resource] as
                        | "organization"
                        | "members"
                        | "invitations",
                    )}
                  </span>
                  <span className="text-foreground">
                    {(actions as string[])
                      .map((action) =>
                        t(
                          action as
                            | "read"
                            | "create"
                            | "update"
                            | "delete"
                            | "cancel",
                        ),
                      )
                      .join(", ")}
                  </span>
                </div>
              );
            },
          )}
        </div>
      )}

      {/* Inline edit form (collapsible) */}
      <Collapsible open={isEditing}>
        <CollapsibleContent>
          <div className="mt-3 pt-3 border-t border-border">
            <RoleForm
              role={role}
              onSave={(name, permission) => {
                onSave(name, permission);
                setIsEditing(false);
              }}
              onCancel={toggleEdit}
              isSaving={isSaving}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
