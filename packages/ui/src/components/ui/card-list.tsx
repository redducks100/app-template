import { SearchIcon } from "lucide-react";
import { type ReactNode, type RefObject, useCallback, useRef, useState } from "react";

import { useInfiniteScroll } from "../../hooks/use-infinite-scroll";
import { createSafeContext } from "../../lib/create-safe-context";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Input } from "./input";

interface CardListContextValue {
  visible: unknown[];
  renderCard: (item: unknown) => ReactNode;
  hasMore: boolean;
  autoScrollEnabled: boolean;
  loadMore: () => void;
  enableAutoScroll: () => void;
  sentinelRef: RefObject<HTMLDivElement | null>;
  search: string;
  setSearch: (value: string) => void;
}

const [CardListProvider, useCardListContext] = createSafeContext<CardListContextValue>("CardList");

interface CardListProps<TData> {
  data: TData[];
  renderCard: (item: TData) => ReactNode;
  filterFn?: (item: TData, search: string) => boolean;
  pageSize?: number;
  children: ReactNode;
}

function CardList<TData>({
  data,
  renderCard,
  filterFn,
  pageSize = 10,
  children,
}: CardListProps<TData>) {
  const [search, setSearch] = useState("");
  const [displayCount, setDisplayCount] = useState(pageSize);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);

  // Reset display count when search changes
  const prevSearchRef = useRef(search);
  if (prevSearchRef.current !== search) {
    prevSearchRef.current = search;
    setDisplayCount(pageSize);
    setAutoScrollEnabled(false);
  }

  const filtered = search && filterFn ? data.filter((item) => filterFn(item, search)) : data;
  const visible = filtered.slice(0, displayCount);
  const hasMore = displayCount < filtered.length;

  const loadMore = useCallback(() => {
    setDisplayCount((prev) => prev + pageSize);
  }, [pageSize]);

  const enableAutoScroll = useCallback(() => {
    loadMore();
    setAutoScrollEnabled(true);
  }, [loadMore]);

  const sentinelRef = useInfiniteScroll(loadMore, autoScrollEnabled && hasMore);

  return (
    <CardListProvider
      value={{
        visible,
        renderCard: renderCard as (item: unknown) => ReactNode,
        hasMore,
        autoScrollEnabled,
        loadMore,
        enableAutoScroll,
        sentinelRef,
        search,
        setSearch,
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
  const { search, setSearch } = useCardListContext();

  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className="pl-8"
      />
    </div>
  );
}

function CardListItems({ className }: { className?: string }) {
  const { visible, renderCard } = useCardListContext();

  return (
    <div className={cn("space-y-3", className)}>{visible.map((item) => renderCard(item))}</div>
  );
}

function CardListEmpty({ children }: { children: ReactNode }) {
  const { visible } = useCardListContext();

  if (visible.length > 0) return null;

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
  const { hasMore, autoScrollEnabled, enableAutoScroll, sentinelRef } = useCardListContext();

  return (
    <>
      {hasMore && !autoScrollEnabled && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={enableAutoScroll}>
            {label}
          </Button>
        </div>
      )}
      {autoScrollEnabled && hasMore && <div ref={sentinelRef} />}
    </>
  );
}

export { CardList, CardListSearch, CardListItems, CardListEmpty, CardListLoadMore };
