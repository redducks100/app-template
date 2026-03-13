import {
  type OnChangeFn,
  type PaginationState,
  type Table,
  type TableOptions,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { type ReactNode } from "react";

import { createSafeContext } from "../../lib/create-safe-context";
import { cn } from "../../lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
import { SearchInput } from "./search-input";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table as UITable } from "./table";

// --- Context ---

interface DataTableContextValue {
  table: Table<unknown>;
  totalRows: number;
  search: string;
  onSearchChange: (value: string) => void;
  onRowClick?: (row: unknown) => void;
  isLoading?: boolean;
  loadingMessage?: string;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
}

const [DataTableProvider, useDataTableContext] =
  createSafeContext<DataTableContextValue>("DataTable");

interface DataTableProps<TData> {
  data: TData[];
  columns: TableOptions<TData>["columns"];
  totalRows: number;
  onRowClick?: (row: TData) => void;
  isLoading?: boolean;
  loadingMessage?: string;
  search: string;
  onSearchChange: (value: string) => void;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  children: ReactNode;
}

function DataTable<TData>({
  data,
  columns,
  totalRows,
  onRowClick,
  isLoading,
  loadingMessage,
  search,
  onSearchChange,
  pagination,
  onPaginationChange,
  children,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
    pageCount: Math.ceil(totalRows / pagination.pageSize),
    onPaginationChange,
    state: {
      pagination,
    },
  });

  return (
    <DataTableProvider
      value={{
        table: table as Table<unknown>,
        totalRows,
        search,
        onSearchChange,
        onRowClick: onRowClick as ((row: unknown) => void) | undefined,
        isLoading,
        loadingMessage,
        pagination,
        onPaginationChange,
      }}
    >
      <div className="space-y-4">{children}</div>
    </DataTableProvider>
  );
}

interface DataTableSearchProps {
  placeholder?: string;
  className?: string;
}

function DataTableSearch({ placeholder = "Search...", className }: DataTableSearchProps) {
  const { search, onSearchChange } = useDataTableContext();

  return (
    <SearchInput
      value={search}
      onChange={onSearchChange}
      placeholder={placeholder}
      className={className}
    />
  );
}

interface DataTableContentProps {
  noResultsMessage?: string;
  className?: string;
}

function DataTableContent({ noResultsMessage = "No results.", className }: DataTableContentProps) {
  const { table, onRowClick, isLoading, loadingMessage } = useDataTableContext();

  return (
    <div className={cn("rounded-lg border border-border bg-card", className)}>
      <UITable>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className={header.column.columnDef.meta?.className}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center text-muted-foreground"
              >
                {loadingMessage ?? "Loading..."}
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={onRowClick ? "cursor-pointer transition-colors duration-150" : undefined}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={cell.column.columnDef.meta?.className}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center text-muted-foreground"
              >
                {noResultsMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </UITable>
    </div>
  );
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
}

interface DataTablePaginationProps {
  labels?: {
    showing?: (args: { from: number; to: number; total: number }) => string;
    previous?: string;
    next?: string;
  };
}

function DataTablePagination({ labels }: DataTablePaginationProps = {}) {
  const { table, totalRows, pagination } = useDataTableContext();

  const pageIndex = pagination.pageIndex;
  const pageSize = pagination.pageSize;
  const pageCount = table.getPageCount();
  const currentPage = pageIndex + 1;
  const from = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalRows);

  const showingText = labels?.showing
    ? labels.showing({ from, to, total: totalRows })
    : `Showing ${from}-${to} of ${totalRows}`;

  const pages = getPageNumbers(currentPage, pageCount);

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">{showingText}</p>
      {pageCount > 1 && (
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              />
            </PaginationItem>
            {pages.map((page, i) =>
              page === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => table.setPageIndex(page - 1)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationNext onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

export { DataTable, DataTableSearch, DataTableContent, DataTablePagination };
export type { DataTablePaginationProps };
