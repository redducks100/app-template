import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
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
import { Button } from "@app/ui/components/button";
import {
  ConfirmDialog,
  ConfirmDialogContent,
  ConfirmDialogDescription,
  ConfirmDialogFooter,
  ConfirmDialogHeader,
  ConfirmDialogTitle,
  ConfirmDialogTrigger,
} from "@app/ui/components/confirm-dialog";
import { FieldDescription, FieldLabel } from "@app/ui/components/field";
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
};

export const MemberDetail = ({ memberId }: MemberDetailProps) => {
  const { t, i18n } = useTranslation("members");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
      ]);
      toast.success(t("removeSuccess"));
      navigate({ to: "/users" });
    },
  });

  const userInitials = getInitials(member.user.name ?? member.user.email ?? "");

  return (
    <div className="space-y-6">
      <Link
        to="/users"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeftIcon className="size-4" />
        {t("backToUsers")}
      </Link>

      <h1 className="text-lg font-medium">{t("memberDetails")}</h1>

      {/* Profile header card */}
      <div className="border border-border bg-card">
        <div className="flex items-center gap-4 p-5">
          <Avatar className="size-16" size="lg">
            <AvatarImage src={member.user.image ?? undefined} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium capitalize truncate">
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
            <p className="text-sm text-muted-foreground truncate">{member.user.email}</p>
            {member.createdAt && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {t("joinedDate")} {formatDate(member.createdAt, i18n.language)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Role section */}
      {permissions.canUpdate && !isOwnerRole && (
        <section>
          <h3 className="text-base font-medium text-foreground mb-4">{t("memberRole")}</h3>
          <div className="border border-border bg-card">
            <div className="flex items-center justify-between p-5">
              <div>
                <FieldLabel>{t("memberRole")}</FieldLabel>
                <FieldDescription>{t("memberRoleDescription")}</FieldDescription>
              </div>
              <div className="flex items-center gap-3">
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
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role.role} value={role.role}>
                        <span className="capitalize">{role.role}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isDirty && (
                  <Button
                    size="sm"
                    onClick={() =>
                      updateRole.mutate({
                        memberId: member.id,
                        role: selectedRole,
                      })
                    }
                    disabled={updateRole.isPending}
                  >
                    {t("saveChanges")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Danger zone */}
      {permissions.canDelete && !isOwnerRole && !isSelf && (
        <section>
          <h3 className="text-base font-medium text-destructive mb-4">{t("dangerZone")}</h3>
          <div className="border border-destructive/30 bg-destructive/5">
            <div className="flex items-center justify-between p-5">
              <div>
                <p className="font-medium">{t("removeMember")}</p>
                <p className="text-sm text-muted-foreground">{t("removeDescription")}</p>
              </div>
              <ConfirmDialog>
                <ConfirmDialogTrigger>
                  <Button variant="destructive" size="sm" disabled={removeMember.isPending}>
                    {t("removeMember")}
                  </Button>
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
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
