import { Badge } from "@app/ui/components/badge";
import {
  CardList,
  CardListEmpty,
  CardListItems,
  CardListLoadMore,
  CardListSearch,
} from "@app/ui/components/card-list";
import { formatDate } from "@app/ui/lib/utils";

import type { MemberColumn } from "./members-columns";

function filterMember(member: MemberColumn, search: string): boolean {
  const s = search.toLowerCase();
  const name = (member.user?.name ?? "").toLowerCase();
  const email = (member.user?.email ?? "").toLowerCase();
  const role = (member.role ?? "").toLowerCase();
  return name.includes(s) || email.includes(s) || role.includes(s);
}

interface MembersMobileDataTableProps {
  members: MemberColumn[];
  currentUserId: string;
  noResultsMessage: string;
  t: (key: string) => string;
  onMemberClick: (memberId: string) => void;
}

export const MembersMobileDataTable = ({
  members,
  currentUserId,
  noResultsMessage,
  t,
  onMemberClick,
}: MembersMobileDataTableProps) => {
  return (
    <CardList
      data={members}
      filterFn={filterMember}
      renderCard={(member) => {
        const isYou = member.userId === currentUserId;
        return (
          <button
            key={member.id}
            type="button"
            className="w-full rounded-xl border border-border bg-card p-4 text-left shadow-xs transition-colors hover:bg-accent/50"
            onClick={() => onMemberClick(member.id)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {member.user.name ?? "-"}
                  {isYou && <span className="ml-1.5 text-muted-foreground">({t("you")})</span>}
                </p>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">{member.user.email}</p>
              </div>
              <Badge variant="outline" className="shrink-0 capitalize">
                {member.role}
              </Badge>
            </div>
            {member.createdAt && (
              <p className="mt-2 text-xs text-muted-foreground">
                {t("joinedColumn")}: {formatDate(member.createdAt)}
              </p>
            )}
          </button>
        );
      }}
    >
      <CardListSearch />
      <CardListItems />
      <CardListEmpty>{noResultsMessage}</CardListEmpty>
      <CardListLoadMore />
    </CardList>
  );
};
