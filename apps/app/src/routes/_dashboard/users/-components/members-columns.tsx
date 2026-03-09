import { Badge } from "@/components/ui/badge";
import type { InferResponseType } from "hono/client";
import type { apiClient } from "@/lib/api-client";
import { createColumnHelper } from "@tanstack/react-table";

type MembersResponse = InferResponseType<
  (typeof apiClient)["members"]["$get"],
  200
>["data"];
type Member = MembersResponse["members"][number];

const columnHelper = createColumnHelper<Member>();

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function createMemberColumns(
  currentUserId: string,
  t: (key: string) => string,
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
            {isYou && (
              <span className="text-muted-foreground ml-1.5">({t("you")})</span>
            )}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: "email",
      header: t("emailColumn"),
      cell: (info) => info.row.original.user.email,
    }),
    columnHelper.accessor("role", {
      header: t("roleColumn"),
      cell: (info) => (
        <Badge variant="outline" className="capitalize">
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: t("joinedColumn"),
      cell: (info) => {
        const value = info.getValue();
        if (!value) return <span className="text-muted-foreground">-</span>;
        return dateFormatter.format(new Date(value));
      },
    }),
  ];
}
