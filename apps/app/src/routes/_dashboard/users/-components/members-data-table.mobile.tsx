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

interface MembersMobileDataTableProps {
  members: MemberColumn[];
  currentUserId: string;
  hasNextPage: boolean;
  onLoadMore: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  noResultsMessage: string;
  locale: string;
  t: (key: string) => string;
  onMemberClick: (memberId: string) => void;
}

export const MembersMobileDataTable = ({
  members,
  currentUserId,
  hasNextPage,
  onLoadMore,
  search,
  onSearchChange,
  noResultsMessage,
  locale,
  t,
  onMemberClick,
}: MembersMobileDataTableProps) => {
  return (
    <CardList
      data={members}
      hasNextPage={hasNextPage}
      onLoadMore={onLoadMore}
      search={search}
      onSearchChange={onSearchChange}
      renderCard={(member) => {
        const isYou = member.userId === currentUserId;
        return (
          <button
            key={member.id}
            type="button"
            className="w-full border border-border bg-card p-4 text-left transition-colors hover:bg-accent/50"
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
                {t("joinedColumn")}: {formatDate(member.createdAt, locale)}
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
