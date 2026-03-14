import { type ReactNode, type RefObject, useCallback, useState } from "react";

import { useInfiniteScroll } from "../../hooks/use-infinite-scroll";
import { createSafeContext } from "../../lib/create-safe-context";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { SearchInput } from "./search-input";

interface CardListContextValue {
  data: unknown[];
  renderCard: (item: unknown) => ReactNode;
  hasNextPage: boolean;
  autoScrollEnabled: boolean;
  onLoadMore: () => void;
  enableAutoScroll: () => void;
  sentinelRef: RefObject<HTMLDivElement | null>;
  search: string;
  onSearchChange: (value: string) => void;
}

const [CardListProvider, useCardListContext] = createSafeContext<CardListContextValue>("CardList");

interface CardListProps<TData> {
  data: TData[];
  renderCard: (item: TData) => ReactNode;
  hasNextPage: boolean;
  onLoadMore: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  children: ReactNode;
}

function CardList<TData>({
  data,
  renderCard,
  hasNextPage,
  onLoadMore,
  search,
  onSearchChange,
  children,
}: CardListProps<TData>) {
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);

  const enableAutoScroll = useCallback(() => {
    onLoadMore();
    setAutoScrollEnabled(true);
  }, [onLoadMore]);

  const sentinelRef = useInfiniteScroll(onLoadMore, autoScrollEnabled && hasNextPage);

  return (
    <CardListProvider
      value={{
        data,
        renderCard: renderCard as (item: unknown) => ReactNode,
        hasNextPage,
        autoScrollEnabled,
        onLoadMore,
        enableAutoScroll,
        sentinelRef,
        search,
        onSearchChange,
      }}
    >
      <div className="space-y-4">{children}</div>
    </CardListProvider>
  );
}

interface CardListSearchProps {
  placeholder?: string;
  className?: string;
}

function CardListSearch({ placeholder = "Search...", className }: CardListSearchProps) {
  const { search, onSearchChange } = useCardListContext();

  return (
    <SearchInput
      value={search}
      onChange={onSearchChange}
      placeholder={placeholder}
      className={className}
    />
  );
}

function CardListItems({ className }: { className?: string }) {
  const { data, renderCard } = useCardListContext();

  return <div className={cn("space-y-3", className)}>{data.map((item) => renderCard(item))}</div>;
}

function CardListEmpty({ children }: { children: ReactNode }) {
  const { data } = useCardListContext();

  if (data.length > 0) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-8 text-center">
      <p className="text-muted-foreground">{children}</p>
    </div>
  );
}

interface CardListLoadMoreProps {
  label?: string;
}

function CardListLoadMore({ label = "Load more" }: CardListLoadMoreProps) {
  const { hasNextPage, autoScrollEnabled, enableAutoScroll, sentinelRef } = useCardListContext();

  return (
    <>
      {hasNextPage && !autoScrollEnabled && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={enableAutoScroll}>
            {label}
          </Button>
        </div>
      )}
      {autoScrollEnabled && hasNextPage && <div ref={sentinelRef} />}
    </>
  );
}

export { CardList, CardListSearch, CardListItems, CardListEmpty, CardListLoadMore };
