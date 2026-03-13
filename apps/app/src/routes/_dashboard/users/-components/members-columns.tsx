import type { InferResponseType } from "hono/client";

import { createColumnHelper } from "@tanstack/react-table";

import type { apiClient } from "@/lib/api-client";

import { Badge } from "@app/ui/components/badge";
import { formatDate } from "@app/ui/lib/utils";

type MembersResponse = InferResponseType<(typeof apiClient)["members"]["$get"], 200>["data"];
export type MemberColumn = MembersResponse["members"][number];

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
        return (
          <span className="font-medium">
            {name}
            {isYou && <span className="text-muted-foreground ml-1.5">({t("you")})</span>}
          </span>
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
