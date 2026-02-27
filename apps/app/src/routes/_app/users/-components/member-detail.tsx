import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  membersListOptions,
  membersPermissionsOptions,
  rolesListOptions,
} from "@/lib/query-options";
import {
  updateMemberRole as updateMemberRoleMutation,
  removeMember as removeMemberMutation,
} from "@/lib/mutations";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

type MemberDetailProps = {
  memberId: string;
};

export const MemberDetail = ({ memberId }: MemberDetailProps) => {
  const { t } = useTranslation("members");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: membersData } = useSuspenseQuery(membersListOptions());

  const members = membersData.members;

  const { data: permissions } = useSuspenseQuery(membersPermissionsOptions());

  const { data: roles } = useSuspenseQuery(rolesListOptions());

  const { data: session } = authClient.useSession();

  const member = members.find((m) => m.id === memberId);
  const currentUserId = session?.user?.id ?? "";
  const isSelf = member?.userId === currentUserId;
  const isOwnerRole = member?.role === "owner";

  const availableRoles = roles.filter((r) => r.role !== "owner");

  const [selectedRole, setSelectedRole] = useState<string>(
    member?.role ?? "",
  );
  const isDirty = selectedRole !== member?.role;

  const updateRole = useMutation({
    mutationFn: updateMemberRoleMutation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["members", "list"] });
      toast.success(t("roleUpdateSuccess"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const removeMember = useMutation({
    mutationFn: removeMemberMutation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["members", "list"] });
      toast.success(t("removeSuccess"));
      navigate({ to: "/users" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (!member) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("emptyState")}</p>
        <Link
          to="/users"
          className="text-primary hover:underline mt-2 inline-block"
        >
          {t("backToUsers")}
        </Link>
      </div>
    );
  }

  const userInitials = `${(member.user.name ?? member.user.email)?.[0]?.toUpperCase() ?? ""}${(member.user.name ?? member.user.email)?.[1]?.toUpperCase() ?? ""}`;

  return (
    <div className="space-y-6">
      <Link
        to="/users"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeftIcon className="size-4" />
        {t("backToUsers")}
      </Link>

      {/* Profile header card */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center gap-4 p-5">
          <Avatar className="size-14" size="lg">
            <AvatarImage src={member.user.image ?? undefined} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold capitalize truncate">
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
            <p className="text-sm text-muted-foreground truncate">
              {member.user.email}
            </p>
            {member.createdAt && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {t("joinedDate")}{" "}
                {dateFormatter.format(member.createdAt)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Role section */}
      {permissions.canUpdate && !isOwnerRole && (
        <section>
          <h3 className="text-base font-semibold text-foreground mb-4">
            {t("memberRole")}
          </h3>
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between p-5">
              <div>
                <FieldLabel>{t("memberRole")}</FieldLabel>
                <FieldDescription>
                  {t("memberRoleDescription")}
                </FieldDescription>
              </div>
              <div className="flex items-center gap-3">
                <Select
                  value={selectedRole}
                  onValueChange={(v) => {
                    if (v) setSelectedRole(v);
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role.id} value={role.role}>
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
          <h3 className="text-base font-semibold text-destructive mb-4">
            {t("dangerZone")}
          </h3>
          <div className="rounded-xl border border-destructive/30 bg-destructive/5">
            <div className="flex items-center justify-between p-6">
              <div>
                <p className="font-medium">{t("removeMember")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("removeDescription")}
                </p>
              </div>
              <ConfirmDialog
                title={t("removeConfirmTitle")}
                description={t("removeConfirm")}
                confirmLabel={t("remove")}
                cancelLabel={t("cancel")}
                variant="destructive"
                onConfirm={() =>
                  removeMember.mutate({ memberIdOrEmail: member.id })
                }
              >
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={removeMember.isPending}
                >
                  {t("removeMember")}
                </Button>
              </ConfirmDialog>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
