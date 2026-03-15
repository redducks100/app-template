import { createColumnHelper } from "@tanstack/react-table";

import type { MemberListItem } from "@app/shared/schemas/member";

import { Avatar, AvatarFallback, AvatarImage } from "@app/ui/components/avatar";
import { Badge } from "@app/ui/components/badge";
import { formatDate, getInitials } from "@app/ui/lib/utils";

export type MemberColumn = MemberListItem;

const columnHelper = createColumnHelper<MemberColumn>();

export function createMemberColumns(
  currentUserId: string,
  t: (key: string) => string,
  locale: string,
) {
  return [
    columnHelper.display({
      id: "name",
      header: t("nameColumn"),
      cell: (info) => {
        const member = info.row.original;
        const name = member.user.name ?? "-";
        const isYou = member.userId === currentUserId;
        const initials = getInitials(member.user.name ?? member.user.email ?? "");
        return (
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarImage src={member.user.image ?? undefined} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="font-medium">
              {name}
              {isYou && <span className="text-muted-foreground ml-1.5">({t("you")})</span>}
            </span>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "email",
      header: t("emailColumn"),
      cell: (info) => info.row.original.user.email,
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
      id: "createdAt",
      header: t("joinedColumn"),
      cell: (info) => {
        const value = info.row.original.createdAt;
        if (!value) return <span className="text-muted-foreground">-</span>;
        return formatDate(value, locale);
      },
    }),
  ];
}
