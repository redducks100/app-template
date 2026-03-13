import {
  type FilterFn,
  type OnChangeFn,
  type PaginationState,
  type Table,
  type TableOptions,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react";
import { type ReactNode, useState } from "react";

import { createSafeContext } from "../../lib/create-safe-context";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table as UITable } from "./table";

// --- Context ---

interface DataTableContextValue {
  table: Table<unknown>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onRowClick?: (row: unknown) => void;
  isLoading?: boolean;
  loadingMessage?: string;
}

const [DataTableProvider, useDataTableContext] =
  createSafeContext<DataTableContextValue>("DataTable");

interface DataTableProps<TData> {
  data: TData[];
  columns: TableOptions<TData>["columns"];
  onRowClick?: (row: TData) => void;
  isLoading?: boolean;
  loadingMessage?: string;
  globalFilterFn?: FilterFn<TData>;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  children: ReactNode;
}

function DataTable<TData>({
  data,
  columns,
  onRowClick,
  isLoading,
  loadingMessage,
  globalFilterFn,
  pagination,
  onPaginationChange,
  children,
}: DataTableProps<TData>) {
  const [globalFilter, setGlobalFilter] = useState("");

  const hasSearch = !!globalFilterFn || children !== undefined;
  const hasPagination = !!pagination;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(hasSearch && {
      getFilteredRowModel: getFilteredRowModel(),
      globalFilterFn,
      onGlobalFilterChange: setGlobalFilter,
    }),
    ...(hasPagination && {
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange,
    }),
    state: {
      globalFilter,
      ...(hasPagination && { pagination }),
    },
  });

  return (
    <DataTableProvider
      value={{
        table: table as Table<unknown>,
        globalFilter,
        setGlobalFilter,
        onRowClick: onRowClick as ((row: unknown) => void) | undefined,
        isLoading,
        loadingMessage,
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
  const { globalFilter, setGlobalFilter } = useDataTableContext();

  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder={placeholder}
        className="pl-8"
      />
    </div>
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

interface DataTablePaginationProps {
  labels?: {
    showing?: (args: { from: number; to: number; total: number }) => string;
    page?: (args: { page: number; total: number }) => string;
    previous?: string;
    next?: string;
  };
}

function DataTablePagination({ labels }: DataTablePaginationProps = {}) {
  const { table } = useDataTableContext();

  const totalRows = table.getFilteredRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const from = pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalRows);
  const pageCount = table.getPageCount();

  const showingText = labels?.showing
    ? labels.showing({ from, to, total: totalRows })
    : `Showing ${from}-${to} of ${totalRows}`;

  const pageText = labels?.page
    ? labels.page({ page: pageIndex + 1, total: pageCount })
    : `Page ${pageIndex + 1} of ${pageCount}`;

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">{showingText}</p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label={labels?.previous ?? "Previous"}
        >
          <ChevronLeftIcon />
        </Button>
        <span className="text-sm text-muted-foreground">{pageText}</span>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label={labels?.next ?? "Next"}
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
}

export { DataTable, DataTableSearch, DataTableContent, DataTablePagination };
export type { DataTablePaginationProps };
