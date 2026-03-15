import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import {
  removeMember as removeMemberMutation,
  updateMemberRole as updateMemberRoleMutation,
} from "@/lib/mutations/members";
import { memberGetOptions, membersPermissionsOptions } from "@/lib/queries/members";
import { Avatar, AvatarFallback, AvatarImage } from "@app/ui/components/avatar";
import { Badge } from "@app/ui/components/badge";
import {
  ConfirmDialog,
  ConfirmDialogContent,
  ConfirmDialogDescription,
  ConfirmDialogFooter,
  ConfirmDialogHeader,
  ConfirmDialogTitle,
  ConfirmDialogTrigger,
} from "@app/ui/components/confirm-dialog";
import { LoaderButton } from "@app/ui/components/loader-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@app/ui/components/select";
import { formatDate, getInitials } from "@app/ui/lib/utils";

type MemberDetailProps = {
  memberId: string;
  onClose?: () => void;
};

export const MemberDetail = ({ memberId, onClose }: MemberDetailProps) => {
  const { t, i18n } = useTranslation("members");
  const queryClient = useQueryClient();

  const { data: member } = useSuspenseQuery(memberGetOptions(memberId));
  const { data: permissions } = useSuspenseQuery(membersPermissionsOptions());
  const { data: session } = authClient.useSession();

  const currentUserId = session?.user?.id ?? "";
  const isSelf = member.userId === currentUserId;
  const isOwnerRole = member.role === "owner";

  const availableRoles = [
    { role: "admin", id: "admin" },
    { role: "member", id: "member" },
  ];

  const [selectedRole, setSelectedRole] = useState<string>(member?.role ?? "");
  const isDirty = selectedRole !== member?.role;

  const updateRole = useMutation({
    mutationFn: updateMemberRoleMutation,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["members", "list"] }),
        queryClient.invalidateQueries({ queryKey: ["members", "get", memberId] }),
      ]);
      toast.success(t("roleUpdateSuccess"));
    },
  });

  const removeMember = useMutation({
    mutationFn: removeMemberMutation,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["members", "list"] }),
        queryClient.invalidateQueries({ queryKey: ["members", "get", memberId] }),
        queryClient.invalidateQueries({ queryKey: ["members", "count"] }),
      ]);
      toast.success(t("removeSuccess"));
      onClose?.();
    },
  });

  const userInitials = getInitials(member.user.name ?? member.user.email ?? "");

  const canChangeRole = permissions.canUpdate && !isOwnerRole;
  const canDelete = permissions.canDelete && !isOwnerRole && !isSelf;
  const showFooter = isDirty || canDelete;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-5">
          {/* Avatar + name + badges */}
          <div className="flex items-center gap-3">
            <Avatar className="size-20" size="lg">
              <AvatarImage src={member.user.image ?? undefined} />
              <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-medium capitalize truncate">
                  {member.user.name ?? member.user.email}
                </h2>
                <Badge variant="outline" className="capitalize shrink-0">
                  {member.role}
                </Badge>
                {isSelf && (
                  <Badge variant="secondary" className="shrink-0">
                    {t("you")}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Email field */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">{t("email")}</p>
            <p className="text-sm text-muted-foreground">{member.user.email}</p>
          </div>

          {/* Joined field */}
          {member.createdAt && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">{t("joinedDate")}</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(member.createdAt, i18n.language)}
              </p>
            </div>
          )}

          {/* Role section */}
          {canChangeRole && (
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{t("memberRole")}</p>
                <p className="text-xs text-muted-foreground">{t("memberRoleDescription")}</p>
              </div>
              <Select
                value={selectedRole}
                onValueChange={(v) => {
                  if (v) setSelectedRole(v);
                }}
                items={availableRoles.map((r) => ({
                  value: r.role,
                  label: r.role,
                }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue className="capitalize" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((r) => (
                    <SelectItem key={r.role} value={r.role}>
                      <span className="capitalize">{r.role}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Sticky footer */}
      {showFooter && (
        <div className="border-t border-border bg-background p-4 flex items-center justify-between">
          <div>
            {isDirty && (
              <LoaderButton
                size="sm"
                loading={updateRole.isPending}
                onClick={() =>
                  updateRole.mutate({
                    memberId: member.id,
                    role: selectedRole,
                  })
                }
              >
                {t("saveChanges")}
              </LoaderButton>
            )}
          </div>
          <div>
            {canDelete && (
              <ConfirmDialog>
                <ConfirmDialogTrigger>
                  <LoaderButton variant="destructive" size="sm" loading={removeMember.isPending}>
                    {t("removeMember")}
                  </LoaderButton>
                </ConfirmDialogTrigger>
                <ConfirmDialogContent>
                  <ConfirmDialogHeader>
                    <ConfirmDialogTitle>{t("removeConfirmTitle")}</ConfirmDialogTitle>
                    <ConfirmDialogDescription>{t("removeConfirm")}</ConfirmDialogDescription>
                  </ConfirmDialogHeader>
                  <ConfirmDialogFooter
                    variant="destructive"
                    confirmLabel={t("remove")}
                    cancelLabel={t("cancel")}
                    onConfirm={() => removeMember.mutate({ memberIdOrEmail: member.id })}
                  />
                </ConfirmDialogContent>
              </ConfirmDialog>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
